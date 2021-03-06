import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController,Platform,AlertController,Events, PopoverController, App} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/timeout';
import { HomePage } from '../home/home';


@IonicPage({
  name:'search-for-pharmacy'
})
@Component({
  selector: 'page-search-for-pharmacy',
  templateUrl: 'search-for-pharmacy.html',
  providers: [Diagnostic, LocationAccuracy]
})
export class SearchForPharmacyPage {

  @ViewChild('map') mapElement;
  map: any;
  lat=31.037933; 
  lng=31.381523;
  doctorsLoc=[{id:1,lat:31.205753,lng:29.924526},{id:2,lat:29.952654,lng:30.921919}];
  //doctorsLoc=[];
  langDirection;
  type_id;

  btn;
  title;
  btn1;
  btn2;
  tostClass ;
  locFlag= 0;

  // locFlag= 1;


  center_id = "";
  toastFlag = false;
  allMarkers = [] ;
  city_id;

  cityIdFromCheckZone;
  popOver;


  constructor(public service:ProvidedServicesProvider,public storage: Storage,
    public helper:HelperProvider, public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,public platform: Platform,
    public diagnostic: Diagnostic, public translate: TranslateService,
     private geolocation: Geolocation, public toastCtrl: ToastController,
     public navCtrl: NavController, public navParams: NavParams,
     public events: Events,
     private popup:PopoverController,
     private app:App) {

      this.accessToken = localStorage.getItem('user_token');

      this.langDirection = this.helper.lang_direction;
      this.helper.view = "pop";
      
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.btn = this.navParams.get('data');
      console.log("btn txt ",this.btn);
      // this.title = this.translate.instant(this.btn.title);
      // this.btn1 = this.translate.instant(this.btn.btn1);
      // this.btn2 = this.translate.instant(this.btn.btn2);
      this.type_id = this.btn.type_id;
      console.log("btn txt ",this.btn);
      console.log("type_id = ",this.type_id);
      if(this.type_id == "1"){
        this.title = this.translate.instant("searchForPharmacy");
        this.btn1 = this.translate.instant("SearchByNearestPharmacies");
        this.btn2 = this.translate.instant("SearchBySpecificPharmacy");
      }else if(this.type_id == "3"){
        this.title = this.translate.instant("searchForLab");
        this.btn1 = this.translate.instant("SearchByNearestLab");
        this.btn2 = this.translate.instant("SearchBySpecificLab");
      }else if(this.type_id == "2"){
        this.title = this.translate.instant("searchForCenter");
        this.btn1 = this.translate.instant("SearchByNearestCenter");
        this.btn2 = this.translate.instant("SearchBySpecificCenter");
      }else if(this.type_id == "5"){
        this.title = this.translate.instant("searchForNurse");
        this.btn1 = this.translate.instant("SearchByNearestNurse");
        this.btn2 = this.translate.instant("SearchBySpecificNurse");
      }


      // this.platform.registerBackButtonAction(() => {

      //   console.log("back from searchForPharmacy");
      //   this.navCtrl.pop();
      // });
  }


  ionViewDidLoad() {
    
    console.log('ionViewDidLoad SearchForPharmacyPage');
    // this.test();
    // this.initMap();


    // this.events.subscribe('location', (data) => {
    //   console.log(" event location ",data);
      
    //   if(data.location){
    //   for(var k=0;k<this.doctorsLoc.length;k++)
    //   {   
    //     if(this.doctorsLoc[k].id == data.id)
    //     {
    //       this.doctorsLoc[k].lat = data.location.split(',')[0];
    //       this.doctorsLoc[k].lng = data.location.split(',')[1];
          
          
    //     }
              
    //   }
    //   }
    //    this.initMapWithDoctorsLocation();
  
      
  
  
    //   });


    this.initMap();
    // this.allowUserToChooseHisLocation();
    //this.test();
    this.helper.geoLoc(data => this.getCurrentLoc(data));
    //  if(!this.platform.is('android') || !this.platform.is('ios')){
    //    this.presentToast(this.translate.instant("AccessLocationFailed"));
    //    this.toastFlag = true;
    //    this.allowUserToChooseHisLocation();
    //  }
    
  }
  getCurrentLoc(loc) {

    //console.log("witting loc " + JSON.stringify(loc))
    if (loc == "-1") {
      // this.presentToast(this.translate.instant("AccessLocationFailed"));
      //ayaaaaaa
      let alert = this.alertCtrl.create({
        title:"لا يمكن تحديد موقعك",
        message: 'للإستمرار، الرجاء تفعيل ال GPS حتى يمكن تحديد موقعك، أو قم بتحديد موقعك على الخريطة بنفسك',
        cssClass:"alertGPS",
        buttons: [
          {
            text: 'تم',
            handler: () => {
              console.log('OK clicked');
              
            }
          }
        ]
      });
      alert.present();
      ////////////
        
      this.toastFlag=true;
      console.log("set toast flag with true: ",this.toastFlag);

      this.allowUserToChooseHisLocation();
    }
    else {
      this.toastFlag =false
    this.lat = loc.inspectorLat;
    this.helper.lat = loc.inspectorLat
    this.lng = loc.inspectorLong;
    this.helper.lon = loc.inspectorLong;


      this.service.getaddress(this.lat,this.lng).subscribe(
        resp=>{
          console.log("resp from get address",resp);
          var myLongAddress =  JSON.parse(JSON.stringify(resp)).results[0].formatted_address;
        
          this.service.updateUserLocation(this.lat+","+this.lng,myLongAddress,this.accessToken).subscribe(
            resp=>{
              console.log("resp from updateUserLocation",resp);
            },err=>{
              console.log("err from updateUserLocation",err);
            }
          );

        },err=>{
          console.log("err from get address",err);
        }
      );

      
      //this.locFlag = 1;
      this.service.getUserZone(this.lat,this.lng,this.accessToken).subscribe(
        resp=>{
          console.log("resp from getUserZone",resp);
          // if(JSON.parse(JSON.stringify(resp)).success == true)
          // {
          //   this.locFlag = 1;  
          //   this.city_id = JSON.parse(JSON.stringify(resp)).city[0].id;
          //   console.log("city_id",this.city_id);
          //   this.helper.city_id = this.city_id;
          // } 
          // else if (JSON.parse(JSON.stringify(resp)).success == false)
          //   this.locFlag = -1; 
          if(JSON.parse(JSON.stringify(resp)).success == true)
          {
            this.cityIdFromCheckZone = JSON.parse(JSON.stringify(resp)).city[0].id;
  
            if(this.cityIdFromCheckZone == this.helper.selectedCityId) {
              //in zone
              this.locFlag = 1;  
              this.helper.city_id = this.cityIdFromCheckZone;
              console.log("city_id",this.helper.city_id);
              console.log("selectedCityId",this.helper.selectedCityId );

            
            } else if (this.cityIdFromCheckZone != this.helper.selectedCityId) {
              //out of zone
              this.locFlag = -1; 
              console.log("city_id2",this.helper.city_id);
              console.log("selectedCityId2",this.helper.selectedCityId );
              console.log("locFlag2",this.locFlag);

            }
          } else {
            this.locFlag = -1; 
            console.log("entereeeeed here");
          }
        },err=>{
          console.log("err from getUserZone",err);

        }
      );


      this.handleuserLocattion();
    }
  }
  dismiss(){
    console.log("dismiss");
    this.navCtrl.setRoot(TabsPage);
  }
  
  test(){
    this.diagnostic.isGpsLocationEnabled().then(
      a=>{
        
        console.log("from gps opened resp",a);
        if(a)
        {
         
        // this.getUserLocation();
        if(this.helper.detectLocation == false)
       {
          this.getUserLocation();
       }
      else
        {
          this.lat = this.helper.lat;
          this.lng = this.helper.lon;


          this.service.getaddress(this.lat,this.lng).subscribe(
            resp=>{
              console.log("resp from get address",resp);
              var myLongAddress =  JSON.parse(JSON.stringify(resp)).results[0].formatted_address;
            
              this.service.updateUserLocation(this.lat+","+this.lng,myLongAddress,this.accessToken).subscribe(
                resp=>{
                  console.log("resp from updateUserLocation",resp);
                },err=>{
                  console.log("err from updateUserLocation",err);
                }
              );

            },err=>{
              console.log("err from get address",err);
            }
          );

          


          //this.locFlag = 1;
          this.service.getUserZone(this.lat,this.lng,this.accessToken).subscribe(
            resp=>{
              console.log("resp from getUserZone",resp);
              // if(JSON.parse(JSON.stringify(resp)).success == true)
              // {
              //   this.locFlag = 1;  
              //   this.city_id = JSON.parse(JSON.stringify(resp)).city[0].id;
              //   console.log("city_id",this.city_id);
              //   this.helper.city_id = this.city_id;
              // } 
              // else if (JSON.parse(JSON.stringify(resp)).success == false)
              //   this.locFlag = -1; 
              if(JSON.parse(JSON.stringify(resp)).success == true)
              {
                this.cityIdFromCheckZone = JSON.parse(JSON.stringify(resp)).city[0].id;
      
                if(this.cityIdFromCheckZone == this.helper.selectedCityId) {
                  //in zone
                  this.locFlag = 1;  
                  this.helper.city_id = this.cityIdFromCheckZone;
                  console.log("city_id",this.helper.city_id);
                
                } else if (this.cityIdFromCheckZone != this.helper.selectedCityId) {
                  //out of zone
                  this.locFlag = -1; 
                }
              } else {
                this.locFlag = -1; 
              } 
            },err=>{
              console.log("err from getUserZone",err);
  
            }
          );


          this.handleuserLocattion();
        }


        }
        else
        {
          this.presentConfirm();        
          
        }
      }
    ).catch(
      a=>{
        console.log("from gps opened err",a);
        this.presentToast("can't get location ");
        this.diagnostic.switchToLocationSettings();
      }
    );
      
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("accessLocation"),
      message: this.translate.instant("msgAccessLocation"),
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('agree clicked');
            this.diagnostic.switchToLocationSettings();
            this.getUserLocation();
          }
        }
      ]
    });
    alert.present();
  }
  
  accessToken;

  getUserLocation(){
    
      let GPSoptions = {timeout: 20000,enableHighAccuracy: true, maximumAge: 3600};
      this.geolocation.getCurrentPosition(GPSoptions).then((resp) => {
  
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        this.helper.lat= this.lat;
        this.helper.lon = this.lng;

        // this.service.updateUserLocation(this.lat+","+this.lng,this.accessToken).subscribe(
        //   resp=>{
        //     console.log("resp from updateUserLocation",resp);
        //   },err=>{
        //     console.log("err from updateUserLocation",err);
        //   }
        // );

        this.service.getaddress(this.lat,this.lng).subscribe(
          resp=>{
            console.log("resp from get address",resp);
            var myLongAddress =  JSON.parse(JSON.stringify(resp)).results[0].formatted_address;
          
            this.service.updateUserLocation(this.lat+","+this.lng,myLongAddress,this.accessToken).subscribe(
              resp=>{
                console.log("resp from updateUserLocation",resp);
              },err=>{
                console.log("err from updateUserLocation",err);
              }
            );

          },err=>{
            console.log("err from get address",err);
          }
        );


        this.service.getUserZone(this.lat,this.lng,this.accessToken).subscribe(
          resp=>{
            console.log("resp from getUserZone",resp);
            // if(JSON.parse(JSON.stringify(resp)).success == true)
            // {
            //   this.locFlag = 1;  
            //   this.city_id = JSON.parse(JSON.stringify(resp)).city[0].id;
            //   console.log("city_id",this.city_id);
            //   this.helper.city_id = this.city_id;
            // } 
            // else if (JSON.parse(JSON.stringify(resp)).success == false)
            //   this.locFlag = -1; 
            if(JSON.parse(JSON.stringify(resp)).success == true)
            {
              this.cityIdFromCheckZone = JSON.parse(JSON.stringify(resp)).city[0].id;
    
              if(this.cityIdFromCheckZone == this.helper.selectedCityId) {
                //in zone
                this.locFlag = 1;  
                this.helper.city_id = this.cityIdFromCheckZone;
                console.log("city_id",this.helper.city_id);
              
              } else if (this.cityIdFromCheckZone != this.helper.selectedCityId) {
                //out of zone
                this.locFlag = -1; 
              }
            } else {
              this.locFlag = -1; 
            }
          },err=>{
            console.log("err from getUserZone",err);

          }
        );
        


        this.helper.detectLocation = true;

        console.log("resp: ", resp);
        this.initMapwithUserLocations();
        // this.storage.get("access_token").then(data=>{
        //   this.accessToken = data;
        this.accessToken = localStorage.getItem('user_token');

          this.helper.accessToken = this.accessToken;
          this.service.nearbyservices(0,this.type_id,this.center_id,this.lat,this.lng,2,this.accessToken).subscribe(
            resp =>{
              console.log("resp from nearby services: ",resp);
              var docsData = JSON.parse(JSON.stringify(resp)).result;
              console.log("res ",docsData,"lenght: ",docsData.lenght);
              this.doctorsLoc = [];
              for (let element in docsData) {
                console.log("element ",docsData[element]);
                if(docsData[element].locationNode)
                {
                  docsData[element].lat = docsData[element].locationNode.split(',')[0];
                  docsData[element].lng = docsData[element].locationNode.split(',')[1];
                }else{
                  docsData[element].lat = "";
                  docsData[element].lng = "";
                }
                // docsData[element].lat = docsData[element].locationNode.split(',')[0];
                // docsData[element].lng = docsData[element].locationNode.split(',')[1];

                if(docsData[element].online  == "1")
                  this.doctorsLoc.push( docsData[element]);

                  //this.helper.getDoctorlocation(docsData[element].id);
  
               }
               console.log("doctorsLoc",this.doctorsLoc);
              //  this.initMapWithDoctorsLocation();
              this.initMapWithDoctorsLocation();
              this.allowUserToChooseHisLocation();
  
            },err=>{
              console.log("err from nearby doctors: ",err);
              this.allowUserToChooseHisLocation();
            }
          );
       
        // });
  
        
      }).catch((error) => {
        console.log('Error getting location', error);
      
        // this.presentToast(this.translate.instant("AccessLocationFailed"));

        //ayaaaaaa
        let alert = this.alertCtrl.create({
          title:"لا يمكن تحديد موقعك",
          message: 'للإستمرار، الرجاء تفعيل ال GPS حتى يمكن تحديد موقعك، أو قم بتحديد موقعك على الخريطة بنفسك',
          cssClass:"alertGPS",
          buttons: [
            {
              text: 'تم',
              handler: () => {
                console.log('OK clicked');
                
              }
            }
          ]
        });
        alert.present();
        ////////////
        
        this.toastFlag=true;
        console.log("set toast flag with true: ",this.toastFlag);

        this.allowUserToChooseHisLocation();
      
        
      });
  
  }
  
  initMap(){
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:18,
      disableDefaultUI: true,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
  
    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    
  }
  allowUserToChooseHisLocation(){
    console.log("allowUserToChooseHisLocation");
  
    this.map.addListener('click',(ev) => {
      
      console.log("lat clicked",ev.latLng.lat());
      console.log("lon clicked",ev.latLng.lng());
      console.log("lat .. ",this.lat);
  
      this.lat = ev.latLng.lat();
      this.lng = ev.latLng.lng();
      this.helper.lon = this.lng;
      this.helper.lat = this.lat;

      // this.service.updateUserLocation(this.lat+","+this.lng,this.accessToken).subscribe(
      //   resp=>{
      //     console.log("resp from updateUserLocation",resp);
      //   },err=>{
      //     console.log("err from updateUserLocation",err);
      //   }
      // );
      this.service.getaddress(this.lat,this.lng).subscribe(
        resp=>{
          console.log("resp from get address",resp);
          var myLongAddress =  JSON.parse(JSON.stringify(resp)).results[0].formatted_address;
        
          this.service.updateUserLocation(this.lat+","+this.lng,myLongAddress,this.accessToken).subscribe(
            resp=>{
              console.log("resp from updateUserLocation",resp);
            },err=>{
              console.log("err from updateUserLocation",err);
            }
          );

        },err=>{
          console.log("err from get address",err);
        }
      );
      
      this.service.getUserZone(this.lat,this.lng,this.accessToken).subscribe(
        resp=>{
          console.log("resp from getUserZone",resp);
          // if(JSON.parse(JSON.stringify(resp)).success == true)
          // {
          //   this.locFlag = 1;  
          //   this.city_id = JSON.parse(JSON.stringify(resp)).city[0].id;
          //   console.log("city_id",this.city_id);
          //   this.helper.city_id = this.city_id;
          // } 
          // else if (JSON.parse(JSON.stringify(resp)).success == false)
          //   this.locFlag = -1; 
          if(JSON.parse(JSON.stringify(resp)).success == true)
          {
            this.cityIdFromCheckZone = JSON.parse(JSON.stringify(resp)).city[0].id;
  
            if(this.cityIdFromCheckZone == this.helper.selectedCityId) {
              //in zone
              this.locFlag = 1;  
              this.helper.city_id = this.cityIdFromCheckZone;
              console.log("city_id",this.helper.city_id);
            
            } else if (this.cityIdFromCheckZone != this.helper.selectedCityId) {
              //out of zone
              this.locFlag = -1; 
            }
          } else {
            this.locFlag = -1; 
          } 
        },err=>{
          console.log("err from getUserZone",err);

        }
      );

      //this.locFlag = 1;
      this.helper.detectLocation = true;
      console.log("loc flag form err ",this.locFlag , "flag from helper",this.helper.detectLocation);
  
      this.handleuserLocattion();
  
      console.log("lat",this.lat);
      console.log("lon",this.lng);

      
      
    });
    
       
  
  }
  handleuserLocattion(){
    
  
    this.initMapwithUserLocations();
  
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    this.accessToken = localStorage.getItem('user_token');

      this.service.nearbyservices(0,this.type_id,this.center_id,this.lat,this.lng,2,this.accessToken).subscribe(
        resp =>{
          console.log("resp from nearby doctors: ",resp);
          var docsData = JSON.parse(JSON.stringify(resp)).result;
          console.log("res ",docsData,"lenght: ",docsData.lenght);
          this.doctorsLoc = [];
          for (let element in docsData) {
            console.log("element ",docsData[element]);
  
            // docsData[element].lat = docsData[element].locationNode.split(',')[0];
            // docsData[element].lng = docsData[element].locationNode.split(',')[1];

            if(docsData[element].locationNode)
            {
              docsData[element].lat = docsData[element].locationNode.split(',')[0];
              docsData[element].lng = docsData[element].locationNode.split(',')[1];
            }else{
              docsData[element].lat = "";
              docsData[element].lng = "";
            }
            
            if(docsData[element].online  == "1")
              this.doctorsLoc.push( docsData[element]);
  
            //this.helper.getDoctorlocation(docsData[element].id);
  
           }
           console.log("doctorsLoc",this.doctorsLoc);
  
           this.initMapWithDoctorsLocation();
           this.allowUserToChooseHisLocation();
        },err=>{
          console.log("err from nearby doctors: ",err);
          this.allowUserToChooseHisLocation();
        }
      );
   
  //  });
  
  
  }

  initMapwithUserLocations(){
  
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:18,
      disableDefaultUI: true,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
   
    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      icon: { 
        url : 'assets/icon/user_locations.png',
        //size: new google.maps.Size(71, 71),
        scaledSize: new google.maps.Size(20, 25) 
      }
  
     
    });
  
    
  }
  initMapWithDoctorsLocation(){
  
    // let latlng = new google.maps.LatLng(this.lat,this.lng);
    // var mapOptions={
    //  center:latlng,
    //   zoom:15,
    //   mapTypeId:google.maps.MapTypeId.ROADMAP,
  
    // };
    // this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    // let marker = new google.maps.Marker({
    //   map: this.map,
    //   animation: google.maps.Animation.DROP,
    //   position: latlng,
    //   icon: { 
    //     url : 'assets/icon/user_locations.png',
    //     size: new google.maps.Size(71, 71),
    //     scaledSize: new google.maps.Size(20, 25) 
    //   }
  
     
    // });
  
  
    var markers, i;
    
    for(var j=0;j<this.allMarkers.length;j++)
    {
      this.allMarkers[j].setMap(null);
    }

    for (i = 0; i < this.doctorsLoc.length; i++) {  
      console.log("pin doctors om map",this.doctorsLoc);
  
      markers = new google.maps.Marker({
        position: new google.maps.LatLng(this.doctorsLoc[i].lat, this.doctorsLoc[i].lng),
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: { 
          url : 'assets/icon/location.png',
          //size: new google.maps.Size(71, 71),
          scaledSize: new google.maps.Size(25, 25) 
         }
      });
    
    }
    this.allMarkers.push(markers);    
    this.allowUserToChooseHisLocation();
  
  }
  
   
  SearchBySpecificService(event){
    console.log("event from SearchBySpecificPharmacy",event);
    console.log("event from SearchBySpecificPharmacy",event.target.innerText);
    if(this.locFlag == 1)
    {

    switch(event.target.innerText){
      case  this.translate.instant("SearchBySpecificPharmacy"):{
        this.navCtrl.push('order-specific-service',{
          data:{
            type_id:1,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }
      case  this.translate.instant("SearchBySpecificLab"):{
        this.navCtrl.push('order-specific-service',{
          data:{
            type_id:3,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }
      case  this.translate.instant("SearchBySpecificCenter"):{
        console.log("in case specific center")
        this.navCtrl.push('order-specific-service',{
          data:{
            type_id:2,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }
      case  this.translate.instant("SearchBySpecificNurse"):{
        console.log("in case specific center")
        this.navCtrl.push('order-specific-service',{
          data:{
            type_id:5,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }

      
      

    }
    
  }else if(this.locFlag == -1){
    // this.presentToast("أنت خارج المنطقة ");

    //ayaaaaa
    this.popOver = this.popup.create('MapAlertPopupPage');
    this.popOver.present();

    this.popOver.onDidDismiss((data) => {

      console.log("dataaaaaa "+JSON.stringify(data));
      if(data && data.goHome == true) {
        // this.navCtrl.setRoot(HomePage);
          this.navCtrl.pop();

      } 
      // else {
      //   this.platform.registerBackButtonAction(() => {
      //     console.log("back from searchForPharmacy");
      //     // this.navCtrl.pop();
      //   this.navCtrl.setRoot(HomePage);
      //   });
      // }
    })
  }
   else
  {
    console.log("toast flag ",this.toastFlag);
    if(this.toastFlag == true) {

      // this.presentToast(this.translate.instant("chooseLocationB2a"));

      //ayaaaaaa
      let alert = this.alertCtrl.create({
        title:"لا يمكن تحديد موقعك",
        message: 'للإستمرار، الرجاء تفعيل ال GPS حتى يمكن تحديد موقعك، أو قم بتحديد موقعك على الخريطة بنفسك',
        cssClass:"alertGPS",
        buttons: [
          {
            text: 'تم',
            handler: () => {
              console.log('OK clicked');
              
            }
          }
        ]
      });
      alert.present();
      ////////////   
    }
    else
      this.presentToast(this.translate.instant("chooseYourLocation"));

  }
    //this.presentToast(this.translate.instant("chooseYourLocation"));
      
  
  }
  SearchByNearestService(event){

    console.log("this.locFlag: "+this.locFlag);

    console.log("event from SearchByNearestPharmacies",event);
    console.log("event from SearchByNearestPharmacies",event.target.innerText);
    console.log("center translate",this.translate.instant("SearchByNearestCenter"))
    if(this.locFlag == 1){
    switch(event.target.innerText){
      case  this.translate.instant("SearchByNearestPharmacies"):{
        this.navCtrl.push('order-service',{data:{
          type_id:1,
          lat:this.lat,
          lng:this.lng
        }});
        break;
      }
      case  this.translate.instant("SearchByNearestLab"):{
        this.navCtrl.push('order-service',{data:{
          type_id:3,
          lat:this.lat,
          lng:this.lng
        }});
        break;
      }
      case  this.translate.instant("SearchByNearestCenter"):{
        console.log("in case nearest center");
        this.navCtrl.push('centers');
        // this.navCtrl.push('order-service',{data:{
        //   type_id:3,
        //   lat:this.lat,
        //   lng:this.lng
        // }});
        break;
      }
      case  this.translate.instant("SearchByNearestNurse"):{
        console.log("in case nearest nurse");
        this.navCtrl.push('nursesServices');
        // this.navCtrl.push('order-service',{data:{
        //   type_id:3,
        //   lat:this.lat,
        //   lng:this.lng
        // }});
        break;
      }

      

    }  
  } else if(this.locFlag == -1){
    
    // this.presentToast("أنت خارج المنطقة ");

    //ayaaaaa
    let popOver = this.popup.create('MapAlertPopupPage');
    popOver.present();

    popOver.onDidDismiss((data) => {

      console.log("dataaaaaa "+JSON.stringify(data));
      if(data && data.goHome == true) {
        this.navCtrl.pop();
        // this.navCtrl.setRoot(HomePage);

      } 
      // else {
      //   this.platform.registerBackButtonAction(() => {
      //     console.log("back from searchForPharmacy");
      //     // this.navCtrl.pop();
      //   this.navCtrl.setRoot(HomePage);

      //   });
      // }
    })
    
  }
  else
  {
    console.log("toast flag ",this.toastFlag);

    if(this.toastFlag == true) {

      // this.presentToast(this.translate.instant("chooseLocationB2a"));

        //ayaaaaaa
        let alert = this.alertCtrl.create({
        title:"لا يمكن تحديد موقعك",
        message: 'للإستمرار، الرجاء تفعيل ال GPS حتى يمكن تحديد موقعك، أو قم بتحديد موقعك على الخريطة بنفسك',
        cssClass:"alertGPS",
        buttons: [
          {
            text: 'تم',
            handler: () => {
              console.log('OK clicked');
              
            }
          }
        ]
      });
      alert.present();
      ////////////
    }
    else
      this.presentToast(this.translate.instant("chooseYourLocation"));
      
    
    
  }
  
  
  }

    
    private presentToast(text) {
      let toast = this.toastCtrl.create({
        message: text,
        duration: 4000,
        position: 'bottom',
        cssClass: this.tostClass
      });
      toast.present();
    }
    
  
}
