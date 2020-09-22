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
import { LocalNotifications } from '@ionic-native/local-notifications';



@IonicPage({
  name:'follow-order'
})
@Component({
  selector: 'page-follow-order',
  templateUrl: 'follow-order.html',
  providers: [Diagnostic, LocationAccuracy,LocalNotifications]
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
  costAfterDiscount ;
  discountType;
  discountmony;

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
  phone;

  allMarkers = [] ;

  notificationFlag=false;
  reorderDetected = false; 
  patientAdd;
  newduration

  contNotes
  contDate

  patientId;
  currentFees;

  constructor(public storage: Storage,public service: LoginserviceProvider,
     public diagnostic: Diagnostic,public locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams,public translate: TranslateService,
     public toastCtrl: ToastController, public alertCtrl: AlertController,
     public events: Events,private localNotifications: LocalNotifications) {
       console.log("follow order");
      //  document.removeEventListener('pause',()=>{
      //    console.log("removeEventListener pause")
      //  })

      //  document.removeEventListener('resume',()=>{
      //   console.log("removeEventListener resume")
      // })

    this.langDirection = this.helper.lang_direction;
    this.helper.view = "follow";
    
    this.accessToken = localStorage.getItem('user_token');
    
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
  
  
        // this.storage.get("access_token").then(data=>{
        // this.accessToken = data;
        this.accessToken = localStorage.getItem('user_token');

        this.service.getOrderDetails(this.doctorData.orderId,this.accessToken).subscribe(
          resp=>{
            console.log("resp get order deatils",resp);
            var orderDataForPriceParsing = JSON.parse(JSON.stringify(resp)).order;
            if(orderDataForPriceParsing.is_reorder == "0" && orderDataForPriceParsing.reorder_done == "1")
              this.reorderDetected = true;

              //ayaaaaaaaa
              this.patientId = orderDataForPriceParsing.patient_id;
              console.log("patientId: "+this.patientId);
              ////////////

              if(orderDataForPriceParsing.PriceAfterDiscount)
              {
                this.discountType = orderDataForPriceParsing.couponType;
                this.discountmony = orderDataForPriceParsing.PriceAfterDiscount;
              }
              else
                this.discountmony = "";


                if(orderDataForPriceParsing.date)
                  this.contDate = orderDataForPriceParsing.date
                else
                  this.contDate = ""

                if(orderDataForPriceParsing.remark)
                  this.contNotes = orderDataForPriceParsing.remark
                else 
                  this.contNotes = ""
            this.patientAdd =  orderDataForPriceParsing.patient_location;
            this.lat = this.patientAdd.split(",")[0];
            this.lng = this.patientAdd.split(",")[1];
            // this.initMap2();
            this.initMapwithUserLocation();

        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in followorder: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            if (tempData.nickname)
              this.doctorName = tempData.nickname;
            else 
              this.doctorName = tempData.name;
              
            this.doctorRate = tempData.rate;
            if(! tempData.rate)
              this.doctorRate = 5;

            
            this.doctorSpecialization = tempData.speciality; 
            if(this.reorderDetected == false){
              this.OrderCost = tempData.extraInfo.discount; //كشف

              if(this.discountType == "amount")
                this.costAfterDiscount = this.OrderCost - this.discountmony ;
              else if(this.discountType == "percent")
                this.costAfterDiscount = this.OrderCost - this.discountmony ;
                // this.costAfterDiscount = this.OrderCost - (this.OrderCost*(this.discountmony/100)) ;

            }
            else if(this.reorderDetected == true)
              this.OrderCost = tempData.extraInfo.price;//اعاده

            this.phone = tempData.phone;
            
            //this.doctorLocation = tempData.location;
           
            this.helper.getDoctorlocation(this.doctorId);

          },err=>{
            console.log("error from getserviceprofile in followorder:",err);
          }
  
        );

      },err=>{
        console.log("err get order details",err);
      }
    );



      // });
      this.events.subscribe('location', (data) => {
        console.log(" event location ",data);
        if(data.location){
          this.doctorLocation = data.location;

          var patientLoc  = this.lat +","+this.lng;
var DoctorLoc = this.doctorLocation;
this.accessToken = localStorage.getItem('user_token');  
        this.service.durationbetweenDoctorAndPatient(patientLoc,DoctorLoc,this.accessToken).subscribe(resp=>{
          console.log("resp from durationbetweenDoctorAndPatient",resp);
                    var durVal = JSON.parse(JSON.stringify(resp)).routes[0].legs[0].duration.value;
          console.log("durVal : ",durVal);

var number = 30*60;


var d = Number(durVal+number);
var h = Math.floor(d/3600);
var m = Math.floor(d % 3600 /60);
var s = Math.floor(d % 3600 % 60);
console.log("h ", h,"m: ",m,"s: ",s);  

var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

console.log(" time : ",hdisplay+mdisplay);
this.newduration  = hdisplay+mdisplay;
console.log("doctorData[results][i].timefordelivery2: ",this.newduration)



        },err=>{
          console.log("err from durationbetweenDoctorAndPatient",err);
        });

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
          //size: new google.maps.Size(71, 71),
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
      // this.service.getDurationAndDistance().subscribe(
      //   resp=>{
      //     // console.log("resp from getDurationAndDistance: ", resp);
      //     // var respObj = JSON.parse(JSON.stringify(resp));
          
      //     // console.log("duration",respObj.routes[0].legs[0].duration.text);
      //     // this.duration = respObj.routes[0].legs[0].duration.text;
      //     // console.log("distance : ",respObj.routes[0].legs[0].distance.text);
      //     console.log("resp from getDurationAndDistance from location changed-> doctor map: ", resp);
      //     var respObj = JSON.parse(JSON.stringify(resp));
          
          
      
      //     console.log("duration",respObj.routes[0].legs[0].duration.text);
      //     var dur = respObj.routes[0].legs[0].duration.text;
      //     var durVal = respObj.routes[0].legs[0].duration.value;
      //     console.log("dur val after set",durVal);

      //     console.log("routes resp: ",respObj.routes[0].legs[0]);
          
      // if(dur.includes("hours"))
      //     dur = dur.replace("hours","س");
      
      // if(dur.includes("mins"))
      //     dur = dur.replace("mins","د");
      
      // if(dur.includes("min"))
      //     dur = dur.replace("min","د");
          
      // if (dur.includes("hour"))
      //     dur = dur.replace("hour","س");
      
      //     this.duration = dur;



      //     console.log("duration val before if ",durVal,"notificatoin flag",this.notificationFlag);

      //     if(this.notificationFlag == false && durVal == (2*60))
      //       this.scheduleNotification();
      //   },
      //   err=>{
      //     console.log("err from getDurationAndDistance: ",err);
      //   }
      // );

      /*edit to  get duration from our api  */
var patientLoc  = this.lat +","+this.lng;
var DoctorLoc = this.doctorLocation.split(',')[0] +","+this.doctorLocation.split(',')[1];
this.accessToken = localStorage.getItem('user_token');  
        this.service.durationbetweenDoctorAndPatient(patientLoc,DoctorLoc,this.accessToken).subscribe(resp=>{
          console.log("resp from durationbetweenDoctorAndPatient",resp);
          var durVal = JSON.parse(JSON.stringify(resp)).routes[0].legs[0].duration.value;
          console.log("durVal : ",durVal);

var number = 30*60;


var d = Number(durVal+number);
var h = Math.floor(d/3600);
var m = Math.floor(d % 3600 /60);
var s = Math.floor(d % 3600 % 60);
console.log("h ", h,"m: ",m,"s: ",s);  

var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

console.log(" time : ",hdisplay+mdisplay);
this.newduration  = hdisplay+mdisplay;
console.log("doctorData[results][i].timefordelivery2: ",this.newduration)


if(this.notificationFlag == false && durVal == (2*60))
            this.scheduleNotification();

        },err=>{
          console.log("err from durationbetweenDoctorAndPatient",err);
        });

          }

          });
    // this.doctorName = this.doctorData.name;
    // this.doctorRate = this.doctorData.rate;
    // this.doctorSpecialization = this.doctorData.specialization;
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowOrderPage');
    this.helper.view = "follow";

    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));

    // this.initMap();
        
    this.initMap();
   
//correct for user location ,, now from order details

    // if(this.helper.detectLocation == false)
    //   this.test();
    // else{
    //   this.lat = this.helper.lat;
    //   this.lng = this.helper.lon;
    //   this.initMapwithUserLocation();
    // }
    
//
// this.helper.trackDoctor(this.doctorId); 
//
    this.events.subscribe('status8', (data) => {
      console.log("notification event status 8");
      this.helper.trackDoctor(this.doctorId); 
    });
    this.events.subscribe('status5', (data) => {
      console.log("notification event status 5",data);
      this.navCtrl.setRoot(TabsPage);
      // this.navCtrl.pop();
      this.navCtrl.push('rate-doctor',{
        data:{
          doctorId:data.doctorId,
          orderId:data.OrderID
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


    //ayaaaaaaaaaaaaaaaaaa
    // this.accessToken = localStorage.getItem('user_token');

    // const alertEdit = this.alertCtrl.create({
    //   title:  'كوبون خصم',
    //   inputs: [
    //     { 
    //       name: 'currentFees',
    //       placeholder: "ادخل كود - اختياري",
    //       type: 'text'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: "إلغاء",
    //       role: 'cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },

    //     {
    //       text: "تم",
    //       handler: data => {
    //         if (String(data.currentFees).trim()) {
    //          //alert(this.spec_id)
    //           this.service.checKCoupon2(this.doctorData.orderId,this.patientId,this.doctorId,this.accessToken,"",String(data.currentFees).trim(),(data)=>{
    //             if(data.success){
    //               if(data.status == -1){
    //                 this.presentToast("كوبون الخصم غير صالح")
    //               }
    //               else if(data.status == 2){
    //                 this.presentToast("كوبون الخصم مستخدم من قبل")
    //               }
    //               else if(data.status == 1){
    //                 let coupon_type = ""
    //                 if(data.coupon.type == "percent"){
    //                   coupon_type = data.coupon.discount +" % "
    //                 }
    //                 else{
    //                   coupon_type = data.coupon.discount+ " جنيه "
    //                 }
    //                 let confirm = this.alertCtrl.create({
    //                   title: '',
    //                   subTitle: "سيتم خصم "+coupon_type+" من قيمة الكشف",
    //                   buttons: [
    //                     {
    //                       text: "تم",
    //                       role: 'cancel'
    //                     },
    //                     // {
    //                     // text: "تأكيد",
    //                     // handler: data2 => {
    //                       // ***************another api to send copon id**************
                          
    //                       // this.service.saveOrder(this.doctorProfile.id,this.accessToken,1,data.coupon.id).subscribe(
    //                       //   resp => {
    //                       //     if(JSON.parse(JSON.stringify(resp)).success ){
    //                       //     console.log("saveOrder resp: ",resp);
    //                       //     var newOrder = JSON.parse(JSON.stringify(resp));
                                
    //                       //     this.helper.orderIdForUpdate = newOrder.order.id;
                              
    //                       //     this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,1);
    //                       //     //this.helper.orderStatusChanged(newOrder.order.id);
                      
    //                       //     this.presentToast(this.translate.instant("ordersent"));
    //                       //     this.helper.dontSendNotification = false;
                              
    //                       //     // this.navCtrl.pop();
    //                       //     this.navCtrl.setRoot('remaining-time-to-accept',{orderId:newOrder.order.id});
    //                       //     }else{
    //                       //       this.presentToast(this.translate.instant("serverError"));
    //                       //     }
    //                       //   },
    //                       //   err=>{
    //                       //     console.log("saveOrder error: ",err);
    //                       //     this.presentToast(this.translate.instant("serverError"));
    //                       //   }
    //                       // );
    //                   //   }
    //                   // }
    //                 ]
    //                 });
    //                 confirm.present();
    //               }
                  
    //             }
    //             else{
    //               if(data.status == -1){
    //                 this.presentToast("كوبون الخصم غير صالح")
    //               }
    //               else if(data.status == 2){
    //                 this.presentToast("كوبون الخصم مستخدم من قبل")
    //               }
    //               else{
    //                 this.presentToast("كوبون الخصم غير صالح")
    //               }
                
    //             }
               
    //           },
    //           (data)=>{
    //             this.presentToast("خطأ في الأتصال")
    //           })
    //         }
    //       }
    //     }
    //   ]
    // });   
    // alertEdit.present()
    //////////////////


  }


  //ayaaaaaaaaaa
  useCoupon() {

    console.log("currentFees: "+this.currentFees);

    if (String(this.currentFees).trim() && String(this.currentFees).trim() != "undefined") {
      //alert(this.spec_id)
       this.service.checKCoupon2(this.doctorData.orderId,this.patientId,this.doctorId,this.accessToken,"",String(this.currentFees).trim(),(data)=>{
         if(data.success){
           if(data.status == -1){
             this.presentToast("كوبون الخصم غير صالح");
             this.currentFees = "";
           }
           else if(data.status == 2){
             this.presentToast("كوبون الخصم مستخدم من قبل");
             this.currentFees = "";
           }
           else if(data.status == 1){
             let coupon_type = ""
             if(data.coupon.type == "percent"){
               coupon_type = data.coupon.discount +" % "
             }
             else{
               coupon_type = data.coupon.discount+ " جنيه "
             }
             let confirm = this.alertCtrl.create({
               title: '',
               subTitle: "سيتم خصم "+coupon_type+" من قيمة الكشف",
               buttons: [
                 {
                   text: "تم",
                   handler: () => {
                    this.currentFees = "";
                   }
                 },
             ]
             });
             confirm.present();
           }
           
         }
         else{
           if(data.status == -1){
             this.presentToast("كوبون الخصم غير صالح");
           }
           else if(data.status == 2){
             this.presentToast("كوبون الخصم مستخدم من قبل");
           }
           else{
             this.presentToast("كوبون الخصم غير صالح");
           }
           this.currentFees = "";         
         }
        
       },
       (data)=>{
         this.presentToast("خطأ في الأتصال")
       })
     } else{
      this.presentToast("من فضلك أدخل كود الخصم");
    }
  }
  ////////////////////


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
            console.log('cancel order agree clicked : ',this.doctorId);
            this.navCtrl.push('cancel-order',{orderId:this.doctorData.orderId,doctorId:this.doctorId});
            
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
      //this.initMap();

      this.lat = this.helper.lat;
      this.lng = this.helper.lon;
      this.initMapwithUserLocation();

      //this.getUserLocation();
      //this.test();
      
    });
}
initMapWithDoctorLocation(xlat,xlon){

  console.log("init map with doctor location");
  let latlng2 = new google.maps.LatLng(xlat,xlon);
// var mapOptions={
//  center:latlng2,
//   zoom:15,
//   mapTypeId:google.maps.MapTypeId.ROADMAP,
//   // controls: {
//   //   myLocationButton: true         
//   // }, 
//   // MyLocationEnabled: true,
//   // setMyLocationButtonEnabled: true,
// };
// this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);

var markers, i;
for(var j=0;j<this.allMarkers.length;j++)
{
this.allMarkers[j].setMap(null);
}

let marker = new google.maps.Marker({
  map: this.map,
  animation: google.maps.Animation.DROP,
  position: latlng2,
  icon: { 
    url : 'assets/icon/location.png',
    //size: new google.maps.Size(71, 71),
    scaledSize: new google.maps.Size(25, 25) 
  }
  ,
  label:{
    text:this.doctorName,
    color:"black",
    
  }
 
});

this.allMarkers.push(marker);
// this.service.getDurationAndDistance(this.lat,this.lng,xlat,xlon).subscribe(
//   resp=>{
//     console.log("resp from getDurationAndDistance from init map with doc loc-> doctor map: ", resp);
//     var respObj = JSON.parse(JSON.stringify(resp));
    
    

//     console.log("duration",respObj.routes[0].legs[0].duration.text);
//     var dur = respObj.routes[0].legs[0].duration.text;
//     var durVal = respObj.routes[0].legs[0].duration.value;
//     console.log("dur val after set",durVal);
//     console.log("routes resp : ",respObj.routes[0].legs[0]);

// if(dur.includes("hours"))
//     dur = dur.replace("hours","س");

// if(dur.includes("mins"))
//     dur = dur.replace("mins","د");

// if(dur.includes("min"))
//     dur = dur.replace("min","د");
    
// if (dur.includes("hour"))
//     dur = dur.replace("hour","س");

//     this.duration = dur;
    


//     console.log("duration val before if ",durVal,"notificatoin flag",this.notificationFlag);

//     if(this.notificationFlag == false && durVal == (2*60)) //<=
//       this.scheduleNotification();
//   },
//   err=>{
//     console.log("err from getDurationAndDistance: ",err);
//   }
// );


}

initMapwithUserLocation(){
console.log("initMapwithUserLocation");



  
let latlng = new google.maps.LatLng(this.lat,this.lng);
  var mapOptions={
   center:latlng,
    zoom:18,
    disableDefaultUI: true,
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
      //size: new google.maps.Size(71, 71),
      scaledSize: new google.maps.Size(20, 25) 
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
          //size: new google.maps.Size(71, 71),
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

      // this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
      //   resp=>{
      //     // console.log("resp from getDurationAndDistance: ", resp);
      //     // var respObj = JSON.parse(JSON.stringify(resp));
      //     // console.log("duration",respObj.routes[0].legs[0].duration.text);
          

      //     // this.duration = respObj.routes[0].legs[0].duration.text;
      //     // console.log("distance : ",respObj.routes[0].legs[0].distance.text);
      //     console.log("resp from getDurationAndDistance from follow doctor func-> doctor map: ", resp);
      //     var respObj = JSON.parse(JSON.stringify(resp));
          
          
      
      //     console.log("duration",respObj.routes[0].legs[0].duration.text);
      //     var dur = respObj.routes[0].legs[0].duration.text;
      //     var durVal = respObj.routes[0].legs[0].duration.value;
      //     console.log("dur val after set",durVal);
      //     console.log("routes resp : ",respObj.routes[0].legs[0]);
      
      // if(dur.includes("hours"))
      //     dur = dur.replace("hours","س");
      
      // if(dur.includes("mins"))
      //     dur = dur.replace("mins","د");
      
      // if(dur.includes("min"))
      //     dur = dur.replace("min","د");
          
      // if (dur.includes("hour"))
      //     dur = dur.replace("hour","س");
      
      //     this.duration = dur;
          
      //     console.log("duration val before if ",durVal,"notificatoin flag",this.notificationFlag);
      // if(this.notificationFlag == false && durVal == (2*60))
      //   this.scheduleNotification();

      //   },
      //   err=>{
      //     console.log("err from getDurationAndDistance: ",err);
      //   }
      // );

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
    this.checkfund();

    
  }
  dismiss(){
    this.navCtrl.pop();
    this.navCtrl.parent.select(0);
    // this.navCtrl.setRoot(TabsPage);
  }
  
  scheduleNotification() {
    
    // text:"سوف يصل الطبيب ف خلال دقيقتين",

    this.notificationFlag = true;
    this.localNotifications.schedule({
      id: 1,
      title: "تطبيق الدكتور (#"+this.doctorData.orderId+" ) ",
      text:  " سوف يصلك الطلب من قبل "+this.doctorName ,
      data: { mydata: 'My hidden message this is' },
      trigger:{ at: new Date(new Date().getTime())}
    });
  }




checkfund(){

  this.accessToken = localStorage.getItem('user_token');  
  this.service.getFund(this.accessToken).subscribe(
    resp=>{
      console.log("resp from getFund",resp);
      var pfunds = JSON.parse(JSON.stringify(resp)).data;   
   
      if(pfunds.order_count >= 2)          
        this.confirmCancel();
      else
        {
          this.service.cancelMsg(this.accessToken).subscribe(
            resp=>{
              console.log("cancel msg resp",resp);
              this.presentCancelConfirm(JSON.parse(JSON.stringify(resp)).message);
            }
          );
        }
                  
        },err=>{
          console.log("err from getFund",err);
        });
}

confirmCancel(){
  
  let alert = this.alertCtrl.create({
    title: this.translate.instant("confirmCancelOrder"),
    message:"فى حالة إلغاء الطلب سوف يتم إيقاف الحساب الخاص بك ",
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
          console.log('cancel order agree clicked', this.doctorId);
          this.helper.logout = true;
          this.navCtrl.push('cancel-order',{orderId:this.doctorData.orderId,doctorId:this.doctorId});
        
        }
      }
    ]
  });
  alert.present();
}

ionViewWillEnter(){
  console.log("will enter from follow order");
  this.helper.view = "follow";
}

  
}
