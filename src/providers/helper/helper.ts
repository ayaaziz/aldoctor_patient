import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController ,Events, AlertController, Platform} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TranslateService } from '@ngx-translate/core';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { Network } from '@ionic-native/network';

@Injectable()
export class HelperProvider {

  public lang_direction ='rtl';
  public currentLang ='ar';
  // public selectedUserCity;
  selectedCityId = "";
  registeredCityId = "";
   
  // public homeZoneSServices = [];
  // ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="2136661453100884" --variable APP_NAME="Aldoctor APP"
  // ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="410227209992614" --variable APP_NAME="Aldoctor APP"

  //public serviceUrl: string = "http://itrootsdemos.com/aldoctor/public/";
  
  //production
  //public serviceUrl: string = "http://aldoctor-app.com/aldoctortest/public/";
  
  //test
  //public serviceUrl: string = "http://aldoctor-app.com/aldoctor/public/";

    //test
  //public serviceUrl: string = "http://aldoctor-app.com/aldoctortest/public/";
  
  
  // final test
  //public serviceUrl: string = "http://aldoctor-app.com/aldoctor3/public/";

  //finalll test
  //public serviceUrl: string = "http://aldoctor-app.com/aldoctor/public/";

  // final production
  // public serviceUrl: string = "http://aldoctor-app.com/aldoctor/public/";

  //last api for testing
  public serviceUrl: string = "http://aldoctor-app.com/aldoctorfinaltest/public/";

  public registration;
  public device_type;
  // public device_type="1";
  //if(platfrom==ios )
  //0 -> ios , 1-> android
  public notification;
  public accessToken;
  public lon=31.381523;
  public lat=31.037933;


  // public lat= 31.205753;
  // public lon = 29.924526;

  public detectLocation = false;
  // public lon;
  // public lat;

  //google maps api key
  //  public key = "AIzaSyB73L1RyzXHkT9fZMlnitShWfEkF3bzrVk";
  public key =  "AIzaSyCqLKTRbSzlXV86rXciYGUPF7fNdVPsgnA";

   //public key = "AIzaSyBPvbu83CtqeV67AihfGfwxKRzq4ExENNo";

  public userId ;
  public trackInterval;
  public changePhoneNumber;
  public orderRated=0;

  public type_id;

  public orderIdForUpdate;

  public disconnectSubscription;
  public connectSubscription;
  public view;
  public dontSendNotification = false;

  backBtnInHelper = false;
  stillCount = false;

  public city_id ="";
  
  public idForOrderToCancelItFromBack;
  public myindexTobeoffline;
  
  public logout = false;
  public inspectorLat
  public inspectorLong
  public inspectorLocAccuracy

  public isProcessed:boolean = false;
  
  constructor(//private afAuth: AngularFireAuth, private db: AngularFireDatabase,
    public toastCtrl: ToastController, public http: HttpClient,private geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,public diagnostic: Diagnostic,public alertCtrl: AlertController,
    public platform:Platform, public translate: TranslateService,
    public events: Events, private network: Network) {
    console.log('Hello HelperProvider Provider');
    
  }
  
  // public presentToast(text) {
  //   let toast = this.toastCtrl.create({
  //     message: text,
  //     duration: 4000,
  //     position: 'bottom'
      
  //   });
  //   toast.present();
  // }


  private updateOnDisconnect() {
    // clearInterval(this.trackInterval)
     firebase.database().ref().child(`user/${this.userId}`)
             .onDisconnect()
             .update({status: 'offline'})
   }
 intializeFirebase(userId){
   
  //  this.afAuth.auth.signInAnonymously().then(()=> {
     this.trackInterval = setInterval(() => {
       if(navigator.onLine){
         //if(this.newOrder){
           console.log("intializeFirebase");
           /*
           firebase.database().ref(`user/${userId}`).on('child_changed',(snap)=>{
             //alert("newOrder "+ snap.val())
             console.log(".....",snap.val())
            //  console.log(".....",snap.val().status);
             if(snap.val().status)
             {
              var data = {status:snap.val() , id:userId};
              this.events.publish('statusChanged',data );
             }
            //  if(snap.val() == "online" || snap.val() == "offline")
            //  {
            //  console.log("child_changed  "+snap.val()," id ",`user/${userId}`);
            //  var data = {status:snap.val() , id:userId};
            //  this.events.publish('statusChanged',data );
            //  }

           });
          */
          //  firebase.database().ref(`user/${userId}/status`).on('value',(snap)=>{
          //   //alert("newOrder "+ snap.val())
          //   console.log("on status "+snap.val());
          //   var data = {status:snap.val() , id:userId};
          //   this.events.publish('status',data );

          // });

          // firebase.database().ref(`user/${userId}`).on('value',(snap)=>{
          //   //alert("newOrder "+ snap.val())
          //   console.log("on status "+snap.val().status , " id ",`user/${userId}`);
          // })

        // }
      // this.updateOnConnect()
       }
     }, 10000)
     //this.updateOnConnect()
     //this.updateOnDisconnect()
  // })
 
 
 }
 statusChanged(userId)
 {
  // firebase.database().ref().child(`user/`+this.userId)
  firebase.database().ref(`user/${userId}/availablity/online/status`).on('child_changed',(snap)=>{
   
    console.log(".....",snap.val())
   
    // if(snap.val().status)
    // {
    //  var data = {status:snap.val() , id:userId};
    //  this.events.publish('statusChanged',data );
    // }
    console.log("doctor status changed "+snap.val(),"id: ",userId);
    var data = {status:snap.val() , id:userId};
    this.events.publish('statusChanged',data );
 

  });
 }
 trackDoctor(userId){
  firebase.database().ref(`user/${userId}/location`).on('child_changed',(snap)=>{
    //alert("newOrder "+ snap.val())
    // if(snap.val().split(',').length == 2)
    // {
    // console.log("location changed  "+snap.val()," id ",`user/${userId}`);
    // var data = {location:snap.val() , id:userId};
    // this.events.publish('locationChanged',data );
    // }

    console.log("doctor location changed "+snap.val());
    var data = {location:snap.val() , id:userId};
    this.events.publish('locationChanged',data );

  });

}
getDoctorStatus(userId){
  firebase.database().ref(`user/${userId}/availablity/online/status`).on('value',(snap)=>{
    //alert("newOrder "+ snap.val())
    console.log("doctor status "+snap.val(),"id: ",userId);
    var data = {status:snap.val() , id:userId};
    this.events.publish('status',data );

  });
}

getDoctorlocation(userId){
  firebase.database().ref(`user/${userId}/location/loc`).on('value',(snap)=>{
    //alert("newOrder "+ snap.val())
    console.log("get doctor location "+snap.val());
    var data = {location:snap.val() , id:userId};
    this.events.publish('location',data );

  });
}

busyDoctorChanged(userId)
{
  console.log("enter busy doctor chnaged",userId);
  firebase.database().ref(`user/${userId}/availablity/busy/status`).on('child_changed',(snap)=>{
      
    console.log("busyDoctorChanged "+snap.val(),"id: ",userId);
    var data = {status:snap.val() , id:userId};
    this.events.publish('busyDoctorChanged',data );
  });
}
getBusyDoctor(userId){
  firebase.database().ref(`user/${userId}/availablity/busy/status`).on('value',(snap)=>{
    
    console.log("getBusyDoctor "+snap.val(),"id: ",userId);
    var data = {status:snap.val() , id:userId};
    this.events.publish('getBusyDoctor',data );

  });
}

createOrder(orderId,serviceId,doctorsNumber){
  //firebase.database().ref('orders/'+orderId).push({status:1});
  console.log("create order",orderId,"service id",serviceId);
  var orderData = firebase.database().ref('orders/');
  orderData.child(orderId).set({orderStatus:{status:1},serviceProfileId:serviceId,doctorsNo:doctorsNumber});

}
createOrderForPLC(typeId, orderId, serviceId, doctorsNumber){
  //firebase.database().ref('orders/'+orderId).push({status:1});
  console.log("create order",orderId,"service id",serviceId);
  var orderData = firebase.database().ref('orders/');
  orderData.child(orderId).set({orderStatus:{status:1},serviceProfileId:serviceId,doctorsNo:doctorsNumber,typeID:typeId});

}
// orderStatusChanged(orderId){
//   firebase.database().ref(`orders/${orderId}/orderStatus`).on('child_changed',(snap)=>{
   
//     console.log("order status changed",snap.val(),"order id: ",orderId)
   
//     if(snap.val() == "10" ) //cancelled by doctor 0 || snap.val() == "0"
//     { 
//       console.log("doc status 10 , don't do nay thing");
//       // this.removeOrder(orderId);
//       // this.events.publish('status0');
//     } 
//     else if (snap.val() == "2") //accepted by doctor
//       this.getServiceProfileIdToFollowOrder(orderId);
//     else if (snap.val() == "3") //no respond
//     {
//       this.removeOrder(orderId);
//       this.events.publish('status0');
//     } 
//     else if (snap.val() == "5" || snap.val() == "6") //5->finished , 6->finished with reorder
//       this.getServiceProfileIdToRate(orderId);        
//     else if (snap.val() == "7") //start detection
//       this.events.publish('status7');
//     else if (snap.val() == "8") // move to patient
//       this.events.publish('status8'); 
//     else if (snap.val() == "11")
//     {
//       //alert appear here

//     }
geoLoc(success) {

  let LocationAuthorizedsuccessCallback = (isAvailable) => {
    //console.log('Is available? ' + isAvailable);
    if (isAvailable) {
      // this.locAlert = 0
      if (this.platform.is('android')) {
        this.diagnostic.getLocationMode().then((status) => {
          if (!(status == "high_accuracy")) {
            this.requestOpenGPS(success)
          }
          else {
            this.GPSOpened(success);
          }
        })
      }
      else {
        this.requestOpenGPS(success);
      }

    }
    else {
      this.requestOpenGPS(success);
    }
  };
  let LocationAuthorizederrorCallback = (e) => {
    console.error(e)
    this.requestOpenGPS(success);
  }
    ;
  this.diagnostic.isLocationAvailable().then(LocationAuthorizedsuccessCallback).catch(LocationAuthorizederrorCallback);

}
GPSOpened(success) {
  let optionsLoc = {}
  optionsLoc = { timeout: 30000, enableHighAccuracy: true, maximumAge: 3600 };
  this.geolocation.getCurrentPosition(optionsLoc).then((resp) => {
    //this.events.publish("locationEnabled")
    this.inspectorLat = resp.coords.latitude;
    this.inspectorLong = resp.coords.longitude;
    this.inspectorLocAccuracy = resp.coords.accuracy;
    let data = {
      inspectorLat: resp.coords.latitude,
      inspectorLong: resp.coords.longitude,
      inspectorLocAccuracy: resp.coords.accuracy
    }
    success(data);
  }
  ).catch((error) => {
    success("-1");
  });


}
requestOpenGPS(success) {
  if (this.platform.is('ios')) {
    this.diagnostic.isLocationEnabled().then(enabled => {
      if(enabled){
        this.diagnostic.getLocationAuthorizationStatus().then(status => {
          if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
            this.diagnostic.requestLocationAuthorization().then(status => {
              if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
                this.locationAccuracy.canRequest().then(requested => {
                  if (requested) {
                    this.requestOpenGPS(success)
                  }
                  else {
                    success("-1")
                  }

                }).catch(err => success("-1"))
              }
              else if (status == this.diagnostic.permissionStatus.GRANTED || status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
                this.GPSOpened(success);
              }
              else{
                success("-1")
              }
            })
          }
          else if (status == this.diagnostic.permissionStatus.DENIED) {
            success("-1")
          }
          else if (status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
            this.GPSOpened(success);
          }
          //ayaaaaaaaa
          else {
            console.log("gps is closed");
            success("-1");
          }
          /////////
        });
      }
      else{
        this.diagnostic.requestLocationAuthorization().then(val => {
          if (val == "GRANTED") {
            this.requestOpenGPS(success)
          }
          else {
            success("-1")
          }
        })
      }
    })
  }
  else {
    this.diagnostic.isLocationAuthorized().then(authorized => {
      if (authorized) {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => {
                console.log('Request successful')

                // this.geoLoc(success);
                this.GPSOpened(success)
              },
              error => {
                console.log('Error requesting location permissions', error);

                success("-1")
              }
            );
          }

          else {
            console.log('Error requesting location permissions');

            success("-1")
        
          }
        });
      }
      else {
        this.diagnostic.requestLocationAuthorization().then(val => {
          if (val == "GRANTED") {
            this.requestOpenGPS(success)
          }
          else {
            success("-1")
          }
        })
      }
    })
  }

}
 

//   });
// }

// orderStatusChangedForPLC(orderId){
//   firebase.database().ref(`orders/${orderId}/orderStatus`).on('child_changed',(snap)=>{
   
//     console.log("order status changed",snap.val(),"order id: ",orderId)

    
    
//     if(snap.val() == "10" ) //cancelled by doctor 0 || snap.val() == "0"
//     {
//       this.removeOrder(orderId);
//       this.events.publish('status0ForPLC');
//     } 
//     else if (snap.val() == "2") //accepted by doctor
//       this.getServiceProfileIdToFollowOrder(orderId);
//     else if (snap.val() == "3") //no respond
//     {
//       this.removeOrder(orderId);
//       this.events.publish('status0ForPLC');
//     } 
//     // else if (snap.val() == "5" || snap.val() == "6") //5->finished , 6->finished with reorder
//     //   this.getServiceProfileIdToRate(orderId);        
//     // else if (snap.val() == "7") //start detection
//     //   this.events.publish('status7');
//     // else if (snap.val() == "8") // move to patient
//     //   this.events.publish('status8'); 

   
 

//   });
// }

getServiceProfileIdToRate(orderid){

  firebase.database().ref(`orders/${orderid}/serviceProfileId`).on('value',(snap)=>{
    
    console.log("getServiceProfileIdToRate "+snap.val(),"id: ",orderid);
    var data = {orderId:orderid, doctorId:snap.val()};
    this.events.publish('status5',data);

  });

}
getServiceProfileIdToFollowOrder(orderid){

  firebase.database().ref(`orders/${orderid}/serviceProfileId`).on('value',(snap)=>{
    
    console.log("getServiceProfileIdToFollowOrder "+snap.val(),"id: ",orderid);
    var data = {orderId:orderid, doctorId:snap.val()};
    this.events.publish('status2',data);
    
    

  });
  


}
getServiceProfileIdToFollowOrderForPLC(orderid){

  firebase.database().ref(`orders/${orderid}/serviceProfileId`).on('value',(snap)=>{
    
    console.log("getServiceProfileIdToFollowOrderForPLC "+snap.val(),"id: ",orderid);
    var data = {orderId:orderid, doctorId:snap.val()};
    this.events.publish('status2ForPLC',data);
    

  });
  


}

updateCancelOrderStatus(orderId){

  firebase.database().ref().child(`orders/${orderId}/orderStatus`)
   .update({status:4})

}
removeOrder(orderId){
  console.log("remove order",orderId);
  firebase.database().ref().child(`orders/${orderId}`)
   .remove();
}
//  updateUserLoc(loc: string) {
//    if (!this.userId) return
//    firebase.database().ref().child(`user/`+this.userId)
//    .update({ location: loc })
//  }
//  private updateStatus(status: string) {
//    if (!this.userId) return
//    firebase.database().ref().child(`user/`+this.userId).update({ status: status })
//    let time = Date.now()
//    firebase.database().ref().child(`user/`+this.userId).update({ last_updated:  time})
//  }
//  /// Updates status when connection to Firebase starts
//  private updateOnConnect() {
//    firebase.database().ref().on('value', snapshot => {
//      console.log(snapshot.numChildren())
//      console.log(snapshot.val());
//      let status = snapshot.val() == true ? 'online' : 'offline'
//      this.updateStatus(status)
//    })
 
//  }

checkConnection(){

var connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", (snap)=> {
  if (snap.val() === true) {
   // alert("connected");
  } else {
  //  alert("not connected");
  }
});


}

listenToNetworkDisconnection(){
console.log("listenToNetworkDisconnection");
  this.disconnectSubscription = this.network.onDisconnect().subscribe(
    (val) => {
    console.log('network was disconnected :-(',val);
    this.events.publish('networkError');
  });
  
}
removeNetworkDisconnectionListener(){
  console.log("removeNetworkDisconnectionListener");
  if(this.disconnectSubscription)
    this.disconnectSubscription.unsubscribe(); 
}
listenToNetworkConnection(){
  this.connectSubscription = this.network.onConnect().subscribe(
    () => {
    console.log('network connected!');
    this.events.publish('networkConnected');
      this.removeNetworkConnectionListener();
    // setTimeout(() => {
    //   if (this.network.type === 'wifi') {
    //     console.log('we got a wifi connection, woohoo!');
    //   }
    // }, 3000);
  });
}
removeNetworkConnectionListener(){
  if(this.connectSubscription)
    this.connectSubscription.unsubscribe(); 
}

public userlogout(){
  //if(this.logoutMsgStatus == 0){
   // this.presentToast("لقد أنتهت صلاحية الجلسة الخاصة بك، يجب عليك تسجيل الدخول")
   // this.logoutMsgStatus = 1
  //}
  
  this.events.publish('user:userLogedout')
}

updateCancelSatatus(userId){
  console.log("updateCancelSatatus doc id: ",userId)
  firebase.database().ref().child(`user/${userId}/availablity/busy`).update({ status: 0 })
}

}
