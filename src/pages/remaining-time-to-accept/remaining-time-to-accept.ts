import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';


@IonicPage({
  name:'remaining-time-to-accept'
})
@Component({
  selector: 'page-remaining-time-to-accept',
  templateUrl: 'remaining-time-to-accept.html',
})
export class RemainingTimeToAcceptPage {

  constructor(public helper:HelperProvider,public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  time=45;
  timer;
  notification;
  orderStatus;
  ionViewDidLoad() {
    console.log('ionViewDidLoad RemainingTimeToAcceptPage');
    
   
    
    this.timer =setInterval(()=>{
      
        this.time--;
        if(this.time <= 0){
          console.log("timer off");
         clearTimeout(this.timer);
         this.navCtrl.setRoot('order-not-accepted');
         
        }
        console.log("time: ",this.time);
     console.log("timer : ",this.timer);
     this.notification = this.helper.notification;
    console.log("notification from remaining time :",this.notification);

      this.orderStatus = this.notification.additionalData.order_status;
      if(this.orderStatus == "2")
      {
        this.navCtrl.setRoot('follow-order',
        {data:
          {"orderId":this.notification.additionalData.orderId          , 
            "doctorId":this.notification.additionalData.doctorId
          }
        });
        clearTimeout(this.timer);
      }else if(this.orderStatus == "0")
      {
        this.navCtrl.setRoot('order-not-accepted');
        clearTimeout(this.timer);
      }else{
        console.log("another status");
      }

     
      
    },1000);
  }

}
