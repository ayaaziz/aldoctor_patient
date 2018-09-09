import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';

import { Storage } from '@ionic/storage';


@IonicPage({
  name:'remaining-time-for-plc'
})
@Component({
  selector: 'page-remaing-time-for-plc',
  templateUrl: 'remaing-time-for-plc.html',
})
export class RemaingTimeForPlcPage {

  time;
  timer;
  notification;
  orderStatus;
  accessToken;
  receivedImage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider,public events: Events,
    public storage: Storage,public service:LoginserviceProvider) {

      this.accessToken = localStorage.getItem('user_token');
      
     var data =  this.navParams.get('data');
     console.log("data from remaing time for plc",data);
     
     if(data == 1)
     {
       this.time = 120;
        this.receivedImage = 1;
     }else if (data == 0){
       this.time = 45;
       this.receivedImage = 0;
     }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemaingTimeForPlcPage');
    
    
    this.timer =setInterval(()=>{
      
      this.time--;
      if(this.time <= 0){
        console.log("timer off");
       clearTimeout(this.timer);

      //  this.storage.get("access_token").then(data=>{
      //   this.accessToken = data;
      this.accessToken = localStorage.getItem('user_token');

      this.service.updateOrderStatus(this.helper.orderIdForUpdate,this.accessToken).subscribe(
        resp=>{
          console.log("update status",resp);
          // this.helper.removeOrder(this.helper.orderIdForUpdate);
        },err=>{
          console.log("uppdate status",err);
        }
      );
    // });

       this.navCtrl.setRoot('order-not-accepted');
       
      }   
    
  },1000);


  this.events.subscribe('status0ForPLC', (data) => {
    console.log("status0ForPLC",data);
    clearTimeout(this.timer);
    
    this.navCtrl.setRoot('order-not-accepted');
  });

  this.events.subscribe('status2ForPLC', (data) => {
    console.log("status2ForPLC",data);
    clearTimeout(this.timer);
    this.navCtrl.setRoot('follow-order-for-plc',
    {data:
      { "orderId":data.orderId, 
        "doctorId":data.doctorId,
        "receivedImage":this.receivedImage
      }
    });
  });

  
  
  
  }

}
