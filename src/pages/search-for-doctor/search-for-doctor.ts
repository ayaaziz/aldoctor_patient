import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,Platform,AlertController } from 'ionic-angular';
import { SpecificDoctorPage } from '../specific-doctor/specific-doctor';
import { SpecializationsPage } from '../specializations/specializations';
import { HelperProvider } from '../../providers/helper/helper';


//import { BackgroundGeolocation,BackgroundGeolocationResponse, BackgroundGeolocationConfig} from '@ionic-native/background-geolocation';

import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';

//import {GoogleMap} from '@ionic-native/google-maps';
import { TranslateService } from '@ngx-translate/core';

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
  doctorsLoc=[{lat:31.205753,long:29.924526},{lat:29.952654,long:30.921919}];
  langDirection;

  constructor(public helper:HelperProvider, public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,public platform: Platform,
    public diagnostic: Diagnostic, public translate: TranslateService,
     private geolocation: Geolocation, public toastCtrl: ToastController, 
     //private backgroundGeolocation: BackgroundGeolocation, 
     public navCtrl: NavController, public navParams: NavParams) {
  
      this.langDirection = this.helper.lang_direction;
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchForDoctorPage');
    this.test();
    //this.geoLoc();
    this.initMap();
    this.getUserLocation();
    //  this.getDoctorsLocation();

}
test(){
  this.diagnostic.isGpsLocationEnabled().then(
    a=>{
      this.presentToast("location on");
    }
  ).catch(
    a=>{
      this.presentToast("can't get location ");
      this.diagnostic.switchToLocationSettings();
    }
  );
    
    


  //this.diagnostic.isGpsLocationAvailable().then(this.gpslocationsuccessCallback).catch(this.gpslocationerrorCallback);
}
gpslocationsuccessCallback(){
  this.presentToast("from get loc su");

}
gpslocationerrorCallback(){
  this.presentToast("from get loc err");

}
getUserLocation(){
  
    this.geolocation.getCurrentPosition().then((resp) => {

      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log("resp: ", resp);
      this.initMapwithUserLocation();
      
    }).catch((error) => {
      console.log('Error getting location', error);
      this.presentToast(this.translate.instant("openGPS"));
      this.getUserLocation();
      this.initMap();
      
    });
}

initMap(){
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
  
}
initMapwithUserLocation(){

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
      url : 'assets/icon/location.png',
      size: new google.maps.Size(71, 71),
      scaledSize: new google.maps.Size(25, 25) 
    }

   
  });


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
getDoctorsLocation(){

  // this.initMap();

}

 
  searchBySpecificDoctor(){
    this.navCtrl.push('specific-doctor');

  }
  searchBySpecializations(){
    this.navCtrl.push('order-doctor');
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'bottom'
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
    
    let optionsLoc = {timeout: 35000,enableHighAccuracy: true, maximumAge: 3600};
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
