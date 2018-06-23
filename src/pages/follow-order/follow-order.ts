import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

//import {GoogleMap} from '@ionic-native/google-maps';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';



@IonicPage({
  name:'follow-order'
})
@Component({
  selector: 'page-follow-order',
  templateUrl: 'follow-order.html',
  providers: [Diagnostic, LocationAccuracy]
})
export class FollowOrderPage {
  @ViewChild('map') mapElement;
  doctorData;
  doctorName;
  doctorSpecialization;
  doctorRate;
  OrderCost;
  map: any;
  langDirection;

  lat=31.037933; 
  lng=31.381523;

  constructor( public diagnostic: Diagnostic,public locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams,public translate: TranslateService,
     public toastCtrl: ToastController, public alertCtrl: AlertController) {
       console.log("follow order");
    this.langDirection = this.helper.lang_direction;
    console.log("langdir: ",this.langDirection);
    this.translate.use(this.helper.currentLang);
    this.doctorData = this.navParams.get('data');
    console.log("data from follow order:",this.doctorData);
    this.doctorName = this.doctorData.name;
    this.doctorRate = this.doctorData.rate;
    this.doctorSpecialization = this.doctorData.specialization;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowOrderPage');
    this.test();
    this.initMap();
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
  test(){
    this.diagnostic.isGpsLocationEnabled().then(
      a=>{
        //this.presentToast("location on");
        console.log("from gps opened resp",a);
        if(a)
        {
         this.presentToast("location on");
        this.getUserLocation();
        }
        else
        {
          this.presentToast("location off");
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
  getUserLocation(){
  
    this.geolocation.getCurrentPosition().then((resp) => {

      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log("resp: ", resp);
      this.initMapwithUserLocation();
      
    }).catch((error) => {
      console.log('Error getting location', error);
      
      //this.getUserLocation();
      this.initMap();
      //this.test();
      
    });
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
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 4000,
    position: 'bottom'
  });
  toast.present();
}

  cancelOrder(){
    this.navCtrl.push('cancel-order',{orderId:this.doctorData.orderId});

  }

}
