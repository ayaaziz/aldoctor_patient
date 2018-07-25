import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController ,Events} from 'ionic-angular';

// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';


@Injectable()
export class HelperProvider {

  public lang_direction ='rtl';
  public currentLang ='ar';
  public serviceUrl: string = "http://itrootsdemos.com/aldoctor/public/";
  public registration;
  public device_type="1";
  //if(platfrom==ios )
  //0 -> ios , 1-> android
  public notification;
  public accessToken;
  public lon=31.381523;
  public lat=31.037933;
  //google maps api key
  public key="AIzaSyB73L1RyzXHkT9fZMlnitShWfEkF3bzrVk";

  public userId ;
  public trackInterval;
  public changePhoneNumber;

  constructor(//private afAuth: AngularFireAuth, private db: AngularFireDatabase,
    public toastCtrl: ToastController, public http: HttpClient,
    public events: Events) {
    console.log('Hello HelperProvider Provider');
  }
  
  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'bottom'
      
    });
    toast.present();
  }


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

 updateUserLoc(loc: string) {
   if (!this.userId) return
   firebase.database().ref().child(`user/`+this.userId)
   .update({ location: loc })
 }
 private updateStatus(status: string) {
   if (!this.userId) return
   firebase.database().ref().child(`user/`+this.userId).update({ status: status })
   let time = Date.now()
   firebase.database().ref().child(`user/`+this.userId).update({ last_updated:  time})
 }
 /// Updates status when connection to Firebase starts
 private updateOnConnect() {
   firebase.database().ref().on('value', snapshot => {
     console.log(snapshot.numChildren())
     console.log(snapshot.val());
     let status = snapshot.val() == true ? 'online' : 'offline'
     this.updateStatus(status)
   })
 
 }



}
