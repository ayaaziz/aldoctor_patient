import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController,Platform,AlertController,Events} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/timeout';


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
//  locFlag= 0;
  locFlag= 1;

  center_id = "";
  constructor(public service:ProvidedServicesProvider,public storage: Storage,
    public helper:HelperProvider, public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,public platform: Platform,
    public diagnostic: Diagnostic, public translate: TranslateService,
     private geolocation: Geolocation, public toastCtrl: ToastController,
     public navCtrl: NavController, public navParams: NavParams,
     public events: Events) {

      this.langDirection = this.helper.lang_direction;
      
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
      }else if(this.type_id == "2"){
        this.title = this.translate.instant("searchForLab");
        this.btn1 = this.translate.instant("SearchByNearestLab");
        this.btn2 = this.translate.instant("SearchBySpecificLab");
      }else if(this.type_id == "3"){
        this.title = this.translate.instant("searchForCenter");
        this.btn1 = this.translate.instant("SearchByNearestCenter");
        this.btn2 = this.translate.instant("SearchBySpecificCenter");
      }
  }


  ionViewDidLoad() {
    
    console.log('ionViewDidLoad SearchForPharmacyPage');
    // this.test();
    // this.initMap();


    this.events.subscribe('location', (data) => {
      console.log(" event location ",data);
      
      if(data.location){
      for(var k=0;k<this.doctorsLoc.length;k++)
      {   
        if(this.doctorsLoc[k].id == data.id)
        {
          this.doctorsLoc[k].lat = data.location.split(',')[0];
          this.doctorsLoc[k].lng = data.location.split(',')[1];
          
          
        }
              
      }
      }
       this.initMapWithDoctorsLocation();
  
      
  
  
      });


    this.initMap();
    // this.allowUserToChooseHisLocation();
    this.test();
    
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
          this.locFlag = 1;
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

        this.locFlag = 1;
        this.helper.detectLocation = true;

        console.log("resp: ", resp);
        this.initMapwithUserLocations();
        this.storage.get("access_token").then(data=>{
          this.accessToken = data;
          this.helper.accessToken = this.accessToken;
          this.service.nearbyservices(this.type_id,this.center_id,this.lat,this.lng,this.accessToken).subscribe(
            resp =>{
              console.log("resp from nearby services: ",resp);
              var docsData = JSON.parse(JSON.stringify(resp)).result;
              console.log("res ",docsData,"lenght: ",docsData.lenght);
              this.doctorsLoc = [];
              for (let element in docsData) {
                console.log("element ",docsData[element]);
               
                  this.doctorsLoc.push( docsData[element]);
                  this.helper.getDoctorlocation(docsData[element].id);
  
               }
               console.log("doctorsLoc",this.doctorsLoc);
              //  this.initMapWithDoctorsLocation();
             
  
            },err=>{
              console.log("err from nearby doctors: ",err);
            }
          );
       
        });
  
        
      }).catch((error) => {
        console.log('Error getting location', error);
        // this.initMap();
        this.presentToast(this.translate.instant("AccessLocationFailed"));
        this.allowUserToChooseHisLocation();
      
        
      });
  
  }
  
  initMap(){
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:15,
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
    
      this.locFlag = 1;
      this.helper.detectLocation = true;
      console.log("loc flag form err ",this.locFlag , "flag from helper",this.helper.detectLocation);
  
      this.handleuserLocattion();
  
      console.log("lat",this.lat);
      console.log("lon",this.lng);

      
      
    });
    
       
  
  }
  handleuserLocattion(){
    
  
    this.initMapwithUserLocations();
  
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.service.nearbyservices(this.type_id,this.center_id,this.lat,this.lng,this.accessToken).subscribe(
        resp =>{
          console.log("resp from nearby doctors: ",resp);
          var docsData = JSON.parse(JSON.stringify(resp)).result;
          console.log("res ",docsData,"lenght: ",docsData.lenght);
          this.doctorsLoc = [];
          for (let element in docsData) {
            console.log("element ",docsData[element]);
  
            this.doctorsLoc.push( docsData[element]);
  
              this.helper.getDoctorlocation(docsData[element].id);
  
           }
           console.log("doctorsLoc",this.doctorsLoc);
  
          
  
        },err=>{
          console.log("err from nearby doctors: ",err);
        }
      );
   
    });
  
  
  }

  initMapwithUserLocations(){
  
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
  
    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      icon: { 
        url : 'assets/icon/user_locations.png',
        size: new google.maps.Size(71, 71),
        scaledSize: new google.maps.Size(20, 25) 
      }
  
     
    });
  
    
  }
  initMapWithDoctorsLocation(){
  
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
  
    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      icon: { 
        url : 'assets/icon/user_locations.png',
        size: new google.maps.Size(71, 71),
        scaledSize: new google.maps.Size(20, 25) 
      }
  
     
    });
  
  
    var markers, i;
  
    for (i = 0; i < this.doctorsLoc.length; i++) {  
      console.log("pin doctors om map",this.doctorsLoc);
  
      markers = new google.maps.Marker({
        position: new google.maps.LatLng(this.doctorsLoc[i].lat, this.doctorsLoc[i].lng),
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: { 
          url : 'assets/icon/location.png',
          size: new google.maps.Size(71, 71),
          scaledSize: new google.maps.Size(25, 25) 
         }
      });
    
    }
    
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
            type_id:2,
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
            type_id:3,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }
      
      

    }
    
  } else
    this.presentToast(this.translate.instant("chooseYourLocation"));
      
  
  }
  SearchByNearestService(event){
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
          type_id:2,
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
      

    }  
  }else
  this.presentToast(this.translate.instant("chooseYourLocation"));
  
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
