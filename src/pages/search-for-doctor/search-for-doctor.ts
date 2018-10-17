import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,Platform,AlertController ,Events} from 'ionic-angular';
import { SpecificDoctorPage } from '../specific-doctor/specific-doctor';
import { SpecializationsPage } from '../specializations/specializations';
import { HelperProvider } from '../../providers/helper/helper';


//import { BackgroundGeolocation,BackgroundGeolocationResponse, BackgroundGeolocationConfig} from '@ionic-native/background-geolocation';

import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';

//import {GoogleMap} from '@ionic-native/google-maps';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from '../tabs/tabs';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/timeout';


@IonicPage({
  name:'search-for-doctor'
})
@Component({
  selector: 'page-search-for-doctor',
  templateUrl: 'search-for-doctor.html',
  providers: [Diagnostic, LocationAccuracy]
})
export class SearchForDoctorPage {
  @ViewChild('map') mapElement;
  map: any;
  lat=31.037933; 
  lng=31.381523;
  
  // doctorsLoc=[{lat:31.205753,lng:29.924526},{lat:29.952654,lng:30.921919}];
  doctorsLoc=[];
  langDirection;
  tostClass ;
  locFlag= 0;
  
  // locFlag= 1;

  toastFlag= false;
  allMarkers = [] ;
  city_id;

  constructor(public service:LoginserviceProvider,public storage: Storage,
    public helper:HelperProvider, public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,public platform: Platform,
    public diagnostic: Diagnostic, public translate: TranslateService,
     private geolocation: Geolocation, public toastCtrl: ToastController, 
     //private backgroundGeolocation: BackgroundGeolocation, 
     public navCtrl: NavController, public navParams: NavParams,
     public events: Events) {

      this.accessToken = localStorage.getItem('user_token');
      this.helper.view = "pop";
  
      this.langDirection = this.helper.lang_direction;
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      console.log("helper langDirection",this.helper);

        
  }
  
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchForDoctorPage');

    

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

      
    // this.events.subscribe('userlocationnnnn', (data) => {
    //   console.log("location changed event",data);

    //   this.lng = data.lon;
    //   this.lat = data.lat;
    //   this.helper.lon = this.lng;
    //   this.helper.lat = this.lat;
    //   console.log("lat, lon from helper",this.helper.lat,
    // this.helper.lon);

    //   this.handleuserLocattion();

    // });

    // this.getUserLocation();
    //31.0657632,31.6421222-->
    //31.037933,31.381523-->mans
  // var directionsService = new google.maps.DirectionsService();
  // var request = {
  //   origin      : new google.maps.LatLng(31.0657632,31.6421222), // a city, full address, landmark etc
  //   destination : new google.maps.LatLng(31.037933,31.381523),
  //   //travelMode  : google.maps.DirectionsTravelMode.DRIVING
  //   travelMode: google.maps.TravelMode.DRIVING

  // };
  // directionsService.route(request, function(response, status) {
  //   if ( status == google.maps.DirectionsStatus.OK ) {
  //     console.log("route obj",response);
  //     console.log("distance", response.routes[0].legs[0].distance.text ); // the distance in metres
  //     console.log("duration",response.routes[0].legs[0].duration.text);
  //   }
  //   else {
  //     // oops, there's no route between these two locations
  //     // every time this happens, a kitten dies
  //     // so please, ensure your address is formatted properly
  //   }
  // });

    this.initMap();

    // this.allowUserToChooseHisLocation();

    //this.initMapwithUserLocations();

    // this.initMapWithDoctorsLocation();
    // this.handleuserLocattion();

    // this.allowUserToChooseHisLocation();
    this.test();
    //this.geoLoc();
    // this.initMap();
    //this.getUserLocation();
    //  this.getDoctorsLocation();

  
}
test(){
  this.diagnostic.isGpsLocationEnabled().then(
    a=>{
      //this.presentToast("location on");
      console.log("from gps opened resp",a);
      if(a)
      {
       //this.presentToast("location on");
      if(this.helper.detectLocation == false)
       {
          this.getUserLocation();
       }
      else
        {
          this.lat = this.helper.lat;
          this.lng = this.helper.lon;
          // this.locFlag = 1;
          this.service.getUserZone(this.lat,this.lng,this.accessToken).subscribe(
            resp=>{
              console.log("resp from getUserZone",resp);
              if(JSON.parse(JSON.stringify(resp)).success == true)
              {
                this.locFlag = 1;  
                this.city_id = JSON.parse(JSON.stringify(resp)).city[0].id;
                console.log("city_id",this.city_id);
                this.helper.city_id = this.city_id;
              } 
              else if (JSON.parse(JSON.stringify(resp)).success == false)
                this.locFlag = -1; 
            },err=>{
              console.log("err from getUserZone",err);
  
            }
          );

          this.handleuserLocattion();
        }


      }
      else
      {
        //this.presentToast("location off");
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
    
    


  //this.diagnostic.isGpsLocationAvailable().then(this.gpslocationsuccessCallback).catch(this.gpslocationerrorCallback);
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

gpslocationsuccessCallback(){
  this.presentToast("from get loc su");

}
gpslocationerrorCallback(){
  this.presentToast("from get loc err");

}
accessToken;
getUserLocation(){
  
  console.log("get user location");
  // , enableHighAccuracy: true, maximumAge: 3600
  let GPSoptions = {timeout: 20000,enableHighAccuracy: true, maximumAge: 3600};
    this.geolocation.getCurrentPosition(GPSoptions).then((resp) => {

      console.log("current location resp: ", resp);
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      
      this.helper.lon = this.lng;
      this.helper.lat = this.lat;

      // this.locFlag = 1;
      this.service.getUserZone(this.lat,this.lng,this.accessToken).subscribe(
        resp=>{
          console.log("resp from getUserZone",resp);
          if(JSON.parse(JSON.stringify(resp)).success == true)
          {
            this.locFlag = 1;  
            this.city_id = JSON.parse(JSON.stringify(resp)).city[0].id;
            console.log("city_id",this.city_id);
            this.helper.city_id = this.city_id;
          } 
          else if (JSON.parse(JSON.stringify(resp)).success == false)
            this.locFlag = -1; 
        },err=>{
          console.log("err from getUserZone",err);

        }
      );

      this.helper.detectLocation = true;
      console.log("loc flag from get location",this.locFlag,"detectLocation ",this.helper.detectLocation);
      
      this.initMapwithUserLocations();
      // this.storage.get("access_token").then(data=>{
      //   this.accessToken = data;
      
      this.accessToken = localStorage.getItem('user_token');

        this.service.nearbyDooctors(this.lat,this.lng,this.accessToken).subscribe(
          resp =>{
            console.log("resp from nearby doctors: ",resp);
            var docsData = JSON.parse(JSON.stringify(resp)).result;
            console.log("res ",docsData,"lenght: ",docsData.lenght);
            this.doctorsLoc = [];
            for (let element in docsData) {
              console.log("element ",docsData[element]);

              // if(docsData[element].location != null)
              //   this.doctorsLoc.push( docsData[element].location);
                this.doctorsLoc.push( docsData[element]);

              this.helper.getDoctorlocation(docsData[element].id);
             }
             console.log("doctorsLoc",this.doctorsLoc);
            //  this.initMapWithDoctorsLocation();


            // docsData.forEach(element => {
              
            //   console.log("element from foreach ",element);
            //   if(element.location != null)
            //     this.doctorsLoc.push( element.location);

            // });
            // for(var i=0;i<docsData.length;i++){
            //   console.log("doctors i= ",i,"  data,  ",docsData[i]);
            //   if(docsData[i].location != null)
            //     this.doctorsLoc.push( docsData[i].location);
            // }
            this.allowUserToChooseHisLocation();
          },err=>{
            console.log("err from nearby doctors: ",err);
            this.allowUserToChooseHisLocation();
          }
        );
     
      // });

      
    }).catch((error) => {
      console.log('Error getting location', error);
      this.presentToast(this.translate.instant("AccessLocationFailed"));
      // this.presentToast(this.translate.instant("chooseYourLocation"));
      
      this.toastFlag = true;

      this.allowUserToChooseHisLocation();
      
      //this.getUserLocation();
      //this.initMap();
      //this.test();
      
    });

   
}

initMap(){

  console.log("init map");
  let latlng = new google.maps.LatLng(this.lat,this.lng);
  var mapOptions={
   center:latlng,
    zoom:15,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    // controls: {
    //   myLocationButton: true         
    // }, 
    // MyLocationEnabled: true,
    // setMyLocationButtonEnabled: true,
  };
  this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
  // this.map.on('click', (e)=>{
  //   console.log("from map clicked",e.latlng.lng, e.latlng.lat);
  // });

  // this.map.on('click').subscribe((e) => {
  //   console.log("map clicked",e); 
  //  })
  
  // var infowindow = new google.maps.InfoWindow({
  //   content:"Hello World!"
  //   });

  // google.maps.event.addListener(this.map,'click',event=>{
  //   console.log("map clicked ", event.latLng);
  //   // infowindow.open(this.map,marker);
  // });

 



  
}
allowUserToChooseHisLocation(){
  console.log("allowUserToChooseHisLocation");
  

  // this.map.addListener('click', function(ev) {
    
  //   console.log("lat clicked",ev.latLng.lat());
  //   console.log("lon clicked",ev.latLng.lng());

  //   console.log("lat .. ",this.lat);
  //   this.lat = ev.latLng.lat();
  //   this.lng = ev.latLng.lng();
      
  //   console.log("lat",this.lat);
  //   console.log("lon",this.lng);
  //   var x = {lat : ev.latLng.lat(),lon:ev.latLng.lng()};
  //   this.events.publish('userlocationnnnn',x);

  //   // this.handleuserLocattion();
  //   // console.log("helper lon",this.helper.lon);
  //   // console.log("helper lat",this.helper.lat);
    
  // });

  this.map.addListener('click',(ev) => {
    
    console.log("lat clicked",ev.latLng.lat());
    console.log("lon clicked",ev.latLng.lng());
    console.log("lat .. ",this.lat);

    this.lat = ev.latLng.lat();
    this.lng = ev.latLng.lng();
    this.helper.lon = this.lng;
    this.helper.lat = this.lat;
  
    // this.locFlag = 1;
    this.service.getUserZone(this.lat,this.lng,this.accessToken).subscribe(
      resp=>{
        console.log("resp from getUserZone",resp);
        if(JSON.parse(JSON.stringify(resp)).success == true)
        {
          this.locFlag = 1;  
          this.city_id = JSON.parse(JSON.stringify(resp)).city[0].id;
          console.log("city_id",this.city_id);
          this.helper.city_id = this.city_id;
        } 
        else if (JSON.parse(JSON.stringify(resp)).success == false)
          this.locFlag = -1; 
      },err=>{
        console.log("err from getUserZone",err);

      }
    );

    this.helper.detectLocation = true;
    console.log("loc flag form err ",this.locFlag , "flag from helper",this.helper.detectLocation);

    this.handleuserLocattion();

    console.log("lat",this.lat);
    console.log("lon",this.lng);
  //  var x = {lat : ev.latLng.lat(),lon:ev.latLng.lng()};
//    this.events.publish('userlocationnnnn',x);

    

    
    // console.log("helper lon",this.helper.lon);
    // console.log("helper lat",this.helper.lat);
    
  });
  
     

}
handleuserLocattion(){
  
  // this.helper.lon = this.lng;
  // this.helper.lat = this.lat;

  
  
  this.initMapwithUserLocations();

  // this.storage.get("access_token").then(data=>{
  //   this.accessToken = data;
  this.accessToken = localStorage.getItem('user_token');

    this.service.nearbyDooctors(this.lat,this.lng,this.accessToken).subscribe(
      resp =>{
        console.log("resp from nearby doctors: ",resp);
        var docsData = JSON.parse(JSON.stringify(resp)).result;
        console.log("res ",docsData,"lenght: ",docsData.lenght);
        this.doctorsLoc = [];
        for (let element in docsData) {
          console.log("element ",docsData[element]);
          // if(docsData[element].location != null)
          //   this.doctorsLoc.push( docsData[element].location);
          this.doctorsLoc.push( docsData[element]);

            this.helper.getDoctorlocation(docsData[element].id);

         }
         console.log("doctorsLoc",this.doctorsLoc);
        //  this.initMapWithDoctorsLocation();
        
         this.allowUserToChooseHisLocation();
      },err=>{
        console.log("err from nearby doctors: ",err);
        this.allowUserToChooseHisLocation();
      }
    );
 
  // });


}
initMapwithUserLocations(){

  console.log("initMapwithUserLocations");
  let latlng = new google.maps.LatLng(this.lat,this.lng);
  var mapOptions={
   center:latlng,
    zoom:15,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    // controls: {
    //   myLocationButton: true         
    // }, 
    // MyLocationEnabled: true,
    // setMyLocationButtonEnabled: true,
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
// this.map.removeMarkers();

  // var markers, i;

  // for (i = 0; i < this.doctorsLoc.length; i++) {  
  //   markers = new google.maps.Marker({
  //     position: new google.maps.LatLng(this.doctorsLoc[i].lat, this.doctorsLoc[i].long),
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     icon: { 
  //       url : 'assets/icon/location.png',
  //       size: new google.maps.Size(71, 71),
  //       scaledSize: new google.maps.Size(25, 25) 
  //      }
  //   });
  
  // }
  
  
  
}
initMapWithDoctorsLocation(){

  console.log("initMapWithDoctorsLocation");

  // let latlng = new google.maps.LatLng(this.lat,this.lng);
  // var mapOptions={
  //  center:latlng,
  //   zoom:15,
  //   mapTypeId:google.maps.MapTypeId.ROADMAP,
  //   // controls: {
  //   //   myLocationButton: true         
  //   // }, 
  //   // MyLocationEnabled: true,
  //   // setMyLocationButtonEnabled: true,
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

  console.log("all markers",this.allMarkers);
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
        size: new google.maps.Size(71, 71),
        scaledSize: new google.maps.Size(25, 25) 
       }
    });
  
  }
  this.allMarkers.push(markers);  
  this.allowUserToChooseHisLocation();

}

 
  searchBySpecificDoctor(){

    console.log("loc flag ",this.locFlag);
    
    if(this.locFlag == 1)
      this.navCtrl.push('specific-doctor');
    else if(this.locFlag == -1){
      this.presentToast("انت خارج المنطقه ");
    }else
    {
      if(this.toastFlag == true)
        this.presentToast(this.translate.instant("chooseLocationB2a"));
      else
        this.presentToast(this.translate.instant("chooseYourLocation"));
        
    }
      
  }
  searchBySpecializations(){
    console.log("loc flag ",this.locFlag);

    if(this.locFlag == 1)
      this.navCtrl.push('specializations-page');
    else if(this.locFlag == -1){
        this.presentToast("انت خارج المنطقه ");
    }
    else
    {
      if(this.toastFlag == true)
        this.presentToast(this.translate.instant("chooseLocationB2a"));
      else
        this.presentToast(this.translate.instant("chooseYourLocation"));
    }
      // this.presentToast(this.translate.instant("chooseYourLocation"));
    //this.navCtrl.push('order-doctor');
  }

  dismiss(){
    console.log("dismiss");
    //this.navCtrl.pop();
    this.navCtrl.setRoot(TabsPage);
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

  geolocationStarted() {
    // this.accuracyColor = 'black';
    // this.accuracyText = this.translate.instant('getLocation');
    // this.helper.color = "black";
    // this.accuracyShow = true;
  }
  geoLoc() {
    this.geolocationStarted();
    let LocationAuthorizedsuccessCallback = (isAvailable) => {
      console.log('Is available? ' + isAvailable);
      if (isAvailable) {
        this.GPSOpened();
      }
      else {
        this.requestOpenGPS();
      }
    };
    let LocationAuthorizederrorCallback = (e) => console.error(e);
    this.diagnostic.isLocationAvailable().then(LocationAuthorizedsuccessCallback).catch(LocationAuthorizederrorCallback);
  }
  
  latitude;
  longitude;
  locAccuracy;
  disableTog = false;
  nearestLoader;
  GPSOpened() {
    
    let optionsLoc = {timeout: 20000,enableHighAccuracy: true, maximumAge: 3600};
    this.geolocation.getCurrentPosition(optionsLoc).then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.locAccuracy = resp.coords.accuracy;
      //this.updateAccuracyMeter(this.locAccuracy, this.helper.maxAllowedAccuracy);
       setTimeout(() => {
        this.disableTog = false;
      },700);
     
      if (this.nearestLoader == null || this.nearestLoader == undefined) {
        if(navigator.onLine){
        //this.getNearestLocationData();
      }
      else{
         //this.toast.show(this.translate.instant("CannotLoadData"), '3000', 'bottom').subscribe();
         console.log(this.translate.instant("CannotLoadData"));
        //  this.accuracyColor = 'red';
        //  this.accuracyText = this.translate.instant('serverError');
        //  this.helper.color = "red";
        //  this.BranchesError = false;
        //  this.NoBranches = true;
      }
      }
    }
    ).catch((error) => {
      console.log('Error getting location', error);
      //  this.toast.show(this.translate.instant("requestLocTimeout"), '3000', 'bottom').subscribe();
      //       this.accuracyText = this.translate.instant('failedToDetectLocation');
      //       this.accuracyColor = 'red';
      //       this.helper.color = "red";
      //       this.disableTog = false;
    });


  }
  requestOpenGPS() {
        if (this.platform.is('ios')) {
          this.diagnostic.getLocationAuthorizationStatus().then(status => {
            if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
              console.log('Permission not requested')
              console.log('6')
              this.diagnostic.requestLocationAuthorization().then(status => {
                if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
                  console.log('Permission not requested')
                  let alert = this.alertCtrl.create({
                    title: this.translate.instant('locAlert'),
                    message: this.translate.instant('GPSIsNotAuth'),
                    buttons: [
                      {
                        text: this.translate.instant('cancel'),
                        role: 'cancel',
                        handler: () => {
                          console.log('Cancel clicked');
                        }
                      },
                      {
                        text: this.translate.instant('openSett'),
                        handler: () => {
                          console.log("open sett");
                          this.diagnostic.switchToSettings();

                        }
                      }
                    ]
                  });
                  alert.present();
                  this.disableTog = false;
                }
                else if (status == this.diagnostic.permissionStatus.DENIED){
                  let alert = this.alertCtrl.create({
                    title: this.translate.instant('locAlert'),
                    message: this.translate.instant('GPSIsNotAuth'),
                    buttons: [
                      {
                        text: this.translate.instant('cancel'),
                        role: 'cancel',
                        handler: () => {
                          console.log('Cancel clicked');
                        }
                      },
                      {
                        text: this.translate.instant('openSett'),
                        handler: () => {
                          console.log("open sett");
                          this.diagnostic.switchToSettings();

                        }
                      }
                    ]
                  });
                  alert.present();
                  this.disableTog = false;
                }
                 else if (status == this.diagnostic.permissionStatus.GRANTED){
                   this.GPSOpened();
                 }
                  else if (status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE){
                   this.GPSOpened();
                 }
              })
            }
            else if (status == this.diagnostic.permissionStatus.DENIED){
                  let alert = this.alertCtrl.create({
                    title: this.translate.instant('locAlert'),
                    message: this.translate.instant('GPSIsNotAuth'),
                    buttons: [
                      {
                        text: this.translate.instant('cancel'),
                        role: 'cancel',
                        handler: () => {
                          console.log('Cancel clicked');
                        }
                      },
                      {
                        text: this.translate.instant('openSett'),
                        handler: () => {
                          console.log("open sett");
                          this.diagnostic.switchToSettings();

                        }
                      }
                    ]
                  });
                  alert.present();
                  this.disableTog = false;
                }
                 else if (status == this.diagnostic.permissionStatus.GRANTED){
                   this.GPSOpened();
                 }
                  else if (status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE){
                   this.GPSOpened();
                 }
          });
        }
        else{
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if (canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            console.log('Request successful')
            this.disableTog = true;
            this.geoLoc();
          },
          error => {
            console.log('Error requesting location permissions', error);
            // this.toast.show(this.translate.instant("failedToDetectGPSAccuracy"), '3000', 'bottom').subscribe();
            // this.accuracyText = this.translate.instant('failedToDetectGPS');
            // this.accuracyColor = 'red';
            // this.helper.color = "red";
            this.disableTog = false;
            let alert = this.alertCtrl.create({
              title: this.translate.instant('locAlert'),
              message: this.translate.instant('GPSIsNotAuth'),
              buttons: [
                {
                  text: this.translate.instant('cancel'),
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: this.translate.instant('openSett'),
                  handler: () => {
                    console.log("open sett");
                    this.diagnostic.switchToLocationSettings();

                  }
                }
              ]
            });
            alert.present();
            this.disableTog = false;

          }
        );
      }
    
      else {
        console.log('Error requesting location permissions');
        // this.toast.show(this.translate.instant("failedToDetectGPSAccuracy"), '3000', 'bottom').subscribe();
        // this.accuracyText = this.translate.instant('failedToDetectGPS');
        // this.accuracyColor = 'red';
        // this.helper.color = "red";
        let alert = this.alertCtrl.create({
          title: this.translate.instant('locAlert'),
          message: this.translate.instant('GPSIsNotAuth'),
          buttons: [
            {
              text: this.translate.instant('cancel'),
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: this.translate.instant('openSett'),
              handler: () => {
                console.log("open sett");
                this.diagnostic.switchToSettings();

              }
            }
          ]
        });
        alert.present();  
        this.disableTog = false;
      }
    });
  }

}

}
