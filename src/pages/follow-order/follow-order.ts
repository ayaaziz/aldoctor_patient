import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController ,Events} from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

//import {GoogleMap} from '@ionic-native/google-maps';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TabsPage } from '../tabs/tabs';



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
  doctorId;
  doctorName;
  doctorSpecialization;
  doctorLocation;
  doctorRate;
  OrderCost;
  map: any;
  langDirection;
  accessToken;
  notification;
  orderStatus;
  duration=0;

  lat=31.037933; 
  lng=31.381523;
  disableCancelBtn = false;
  tostClass;

  allMarkers = [] ;


  constructor(public storage: Storage,public service: LoginserviceProvider,
     public diagnostic: Diagnostic,public locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams,public translate: TranslateService,
     public toastCtrl: ToastController, public alertCtrl: AlertController,
     public events: Events) {
       console.log("follow order");
    this.langDirection = this.helper.lang_direction;
    
    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

    console.log("langdir: ",this.langDirection);
    this.translate.use(this.helper.currentLang);
    this.doctorData = this.navParams.get('data');
    console.log("data from follow order:",this.doctorData);
    
     this.doctorId = this.doctorData.doctorId;
      console.log("doctorid: ",this.doctorId," orderid: ",this.doctorData.orderId);
      if(this.doctorData.order_status && this.doctorData.order_status == "7")
        this.disableCancelBtn = true;
      else
        this.disableCancelBtn = false;
        

      this.storage.get("access_token").then(data=>{
        this.accessToken = data;
        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in followorder: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            this.doctorName = tempData.name;
            this.doctorRate = tempData.rate;
            this.doctorSpecialization = tempData.speciality; 
            this.OrderCost = tempData.extraInfo.discount;
            
            //this.doctorLocation = tempData.location;
           
            this.helper.getDoctorlocation(this.doctorId);

          },err=>{
            console.log("error from getserviceprofile in followorder:",err);
          }
  
        );
      });
      this.events.subscribe('location', (data) => {
        console.log(" event location ",data);
        if(data.location){
          this.doctorLocation = data.location;
          this.initMapWithDoctorLocation(this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]);
        }
        });
        this.events.subscribe('locationChanged', (data) => {
          console.log(" event location changed",data);
          if(data.location){
            this.doctorLocation = data.location;
            
            console.log("doctor location",this.doctorLocation);

            var markers, i;
            for(var j=0;j<this.allMarkers.length;j++)
            {
            this.allMarkers[j].setMap(null);
            }
        //this.doctorLocation.lat, this.doctorLocation.lng
        console.log("lat : ",this.doctorLocation.split(',')[0], "lon : ",this.doctorLocation.split(',')[1])
        markers = new google.maps.Marker({
        position: new google.maps.LatLng(this.doctorLocation.split(',')[0], this.doctorLocation.split(',')[1]),
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: { 
          url : 'assets/icon/location.png',
          size: new google.maps.Size(71, 71),
          scaledSize: new google.maps.Size(25, 25) 
          
         },
         label:{
           text:this.doctorName,
           color:"black",
           
         }
      });
      console.log("draw");
      this.allMarkers.push(markers);

      console.log("markers ",markers);
      this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
        resp=>{
          console.log("resp from getDurationAndDistance: ", resp);
          var respObj = JSON.parse(JSON.stringify(resp));
          
          console.log("duration",respObj.routes[0].legs[0].duration.text);
          this.duration = respObj.routes[0].legs[0].duration.text;
          console.log("distance : ",respObj.routes[0].legs[0].distance.text);
        },
        err=>{
          console.log("err from getDurationAndDistance: ",err);
        }
      );

          }

          });
    // this.doctorName = this.doctorData.name;
    // this.doctorRate = this.doctorData.rate;
    // this.doctorSpecialization = this.doctorData.specialization;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowOrderPage');
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));

    this.initMap();
    this.test();
    
//
// this.helper.trackDoctor(this.doctorId); 
//
    this.events.subscribe('status8', (data) => {
      console.log("notification event status 8");
      this.helper.trackDoctor(this.doctorId); 
    });
    this.events.subscribe('status5', (data) => {
      console.log("notification event status 5",data);
      this.navCtrl.push(TabsPage);
      // this.navCtrl.pop();
      this.navCtrl.push('rate-doctor',{
        data:{
          doctorId:data.doctorId,
          orderId:data.orderId
        }
      });
      
    });
    this.events.subscribe('status7', (data) => {
      console.log("notification event status 7");

      this.disableCancelBtn = true;
    });

    // var timer = setInterval(()=>{

      

    //   this.notification = this.helper.notification;
    //   this.orderStatus = this.notification.additionalData.order_status;
     

    //   if(this.orderStatus == "8"){
    //     console.log("order status 8"); //move to paient
    //     this.folllowdoctor();
    //   }else if(this.orderStatus == "5"){ 
    //     console.log("order status 5"); //finshed 
    //     clearTimeout(timer);
    //     // this.navCtrl.pop();
    //     this.navCtrl.push(TabsPage);
        
    //   }else if(this.orderStatus == "7")// 7 start detection
    //   {
    //     this.disableCancelBtn = true;
    //   }
    // },5000);




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
    //     this.presentToast("location on");
        this.getUserLocation();
        }
        else
        {
      //    this.presentToast("location off");
          this.presentConfirm();        
          
        }
      }
    ).catch(
      a=>{
        console.log("from gps opened err",a);
        //this.presentToast("can't get location ");
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
  presentCancelConfirm(cancelMsg) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: cancelMsg,
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
            console.log('cancel order agree clicked');
            this.navCtrl.push('cancel-order',{orderId:this.doctorData.orderId});
            
          }
        }
      ]
    });
    alert.present();
  }
  getUserLocation(){
  console.log("get user location");
    this.geolocation.getCurrentPosition().then((resp) => {

      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log("user location resp: ", resp);
      this.initMapwithUserLocation();
      
    }).catch((error) => {
      console.log('Error getting location', error);
      
      //this.getUserLocation();
      this.initMap();
      //this.test();
      
    });
}
initMapWithDoctorLocation(xlat,xlon){

  console.log("init map with doctor location");
  let latlng2 = new google.maps.LatLng(xlat,xlon);
var mapOptions={
 center:latlng2,
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
  position: latlng2,
  icon: { 
    url : 'assets/icon/location.png',
    size: new google.maps.Size(71, 71),
    scaledSize: new google.maps.Size(25, 25) 
  }
  ,
  label:{
    text:this.doctorName,
    color:"black",
    
  }
 
});

this.service.getDurationAndDistance(this.lat,this.lng,xlat,xlon).subscribe(
  resp=>{
    console.log("resp from getDurationAndDistance -> doctor map: ", resp);
    var respObj = JSON.parse(JSON.stringify(resp));
    
    console.log("duration",respObj.routes[0].legs[0].duration.text);
    this.duration = respObj.routes[0].legs[0].duration.text;
    console.log("distance : ",respObj.routes[0].legs[0].distance.text);
  },
  err=>{
    console.log("err from getDurationAndDistance: ",err);
  }
);


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
  // markers = new google.maps.Marker({
  //   position: new google.maps.LatLng(this.doctorLocation.lat, this.doctorLocation.lng),
  //   map: this.map,
  //   animation: google.maps.Animation.DROP,
  //   icon: { 
  //     url : 'assets/icon/location.png',
  //     size: new google.maps.Size(71, 71),
  //     scaledSize: new google.maps.Size(25, 25) 
      
  //    },
  //    label:{
  //      text:this.doctorName,
  //      color:"black",
       
  //    }
  // });

  // this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.lat,this.doctorLocation.lng).subscribe(
  //   resp=>{
  //     console.log("resp from getDurationAndDistance: ", resp);
  //     var respObj = JSON.parse(JSON.stringify(resp));
  //     console.log("duration",respObj.routes[0].legs[0].duration.text);
  //     this.duration = respObj.routes[0].legs[0].duration.text;
  //     console.log("distance : ",respObj.routes[0].legs[0].distance.text);
  //   },
  //   err=>{
  //     console.log("err from getDurationAndDistance: ",err);
  //   }
  // );

  // var directionsService = new google.maps.DirectionsService();
  // var request = {
  //   origin      : 'Melbourne VIC', // a city, full address, landmark etc
  //   destination : 'Sydney NSW',
  //   //travelMode  : google.maps.DirectionsTravelMode.DRIVING
  // };
  // directionsService.route(request, function(response, status) {
  //   if ( status == google.maps.DirectionsStatus.OK ) {
  //     console.log("distance", response.routes[0].legs[0].distance.value ); // the distance in metres
  //   }
  //   else {
  //     // oops, there's no route between these two locations
  //     // every time this happens, a kitten dies
  //     // so please, ensure your address is formatted properly
  //   }
  // });
  
}

folllowdoctor(){
console.log("follow doctor");
  this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
    resp =>{
      console.log("resp from getserviceprofile in followorder: ",resp);
      var tempData = JSON.parse(JSON.stringify(resp)).user;
      // this.doctorName = tempData.name;
      // this.doctorRate = tempData.rate;
      // this.doctorSpecialization = tempData.speciality; 
      this.doctorLocation = tempData.location;

      // this.map.removeMarkers();
      
      console.log("remove");
      
      
      var markers, i;
     
/**/
// markers = new google.maps.Marker({
//   position: new google.maps.LatLng(this.lat, this.lng),
//   map: this.map,
//   // animation: google.maps.Animation.DROP,
//   icon: { 
//     url : 'assets/icon/location.png',
//     size: new google.maps.Size(71, 71),
//     scaledSize: new google.maps.Size(25, 25) 
    
//    }
// });


/**/
for(var j=0;j<this.allMarkers.length;j++)
{
  this.allMarkers[j].setMap(null);
}
//this.doctorLocation.lat, this.doctorLocation.lng
      markers = new google.maps.Marker({
        position: new google.maps.LatLng(this.doctorLocation.split(',')[0], this.doctorLocation.split(',')[1]),
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: { 
          url : 'assets/icon/location.png',
          size: new google.maps.Size(71, 71),
          scaledSize: new google.maps.Size(25, 25) 
          
         },
         label:{
           text:this.doctorName,
           color:"black",
           
         }
      });
      console.log("draw");
      this.allMarkers.push(markers);

      console.log("markers ",markers);
      this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
        resp=>{
          console.log("resp from getDurationAndDistance: ", resp);
          var respObj = JSON.parse(JSON.stringify(resp));
          console.log("duration",respObj.routes[0].legs[0].duration.text);
          this.duration = respObj.routes[0].legs[0].duration.text;
          console.log("distance : ",respObj.routes[0].legs[0].distance.text);
        },
        err=>{
          console.log("err from getDurationAndDistance: ",err);
        }
      );

 //     this.initMapwithUserLocation();

    },err=>{
      console.log("error from getserviceprofile in followorder:",err);
    }

  );

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

  cancelOrder(){
    //this.navCtrl.push('cancel-order',{orderId:this.doctorData.orderId});
    this.service.cancelMsg(this.accessToken).subscribe(
      resp=>{
        console.log("cancel msg resp",resp);
        this.presentCancelConfirm(JSON.parse(JSON.stringify(resp)).message);
      }
    );
  }
  dismiss(){
    this.navCtrl.pop();
  }
  
}
