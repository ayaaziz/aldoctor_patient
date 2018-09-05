import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events} from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';

import { Storage } from '@ionic/storage';

@IonicPage({
  name:'remaining-time-to-accept'
})
@Component({
  selector: 'page-remaining-time-to-accept',
  templateUrl: 'remaining-time-to-accept.html',
})
export class RemainingTimeToAcceptPage {

  constructor(public helper:HelperProvider,public navCtrl: NavController, 
    public navParams: NavParams,public storage: Storage,
    public events: Events,public service:LoginserviceProvider) {
      this.accessToken = localStorage.getItem('user_token');
  }

  time=45;
  timer;
  notification;
  orderStatus;
  accessToken;

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemainingTimeToAcceptPage');
    
   
    
    this.timer =setInterval(()=>{
      
        this.time--;
        if(this.time <= 0){
          console.log("timer off");
          clearTimeout(this.timer);
          
          // this.storage.get("access_token").then(data=>{
          //   this.accessToken = data;
          this.accessToken = localStorage.getItem('user_token');

          this.service.updateOrderStatus(this.helper.orderIdForUpdate,this.accessToken).subscribe(
            resp=>{
              console.log("update status",resp);
              this.helper.removeOrder(this.helper.orderIdForUpdate);
            },err=>{
              console.log("uppdate status",err);
            }
          );
        // });
        this.navCtrl.setRoot('order-not-accepted');
         
        }
    //     console.log("time: ",this.time);
    //  console.log("timer : ",this.timer);
    //  this.notification = this.helper.notification;
    // console.log("notification from remaining time :",this.notification);

    //   this.orderStatus = this.notification.additionalData.order_status;
    //   if(this.orderStatus == "2")
    //   {
    //     clearTimeout(this.timer);
    //     this.navCtrl.setRoot('follow-order',
    //     {data:
    //       {"orderId":this.notification.additionalData.orderId          , 
    //         "doctorId":this.notification.additionalData.doctorId
    //       }
    //     });
        
    //   }else if(this.orderStatus == "0")
    //   {
    //     clearTimeout(this.timer);
    //     this.navCtrl.setRoot('order-not-accepted');
        
    //   }else{
    //     console.log("another status");
    //   }

     
      
    },1000);


    this.events.subscribe('status0', (data) => {
      console.log("status0",data);
      clearTimeout(this.timer);
      this.navCtrl.setRoot('order-not-accepted');
    });

    this.events.subscribe('status2', (data) => {
      console.log("status2",data);
      clearTimeout(this.timer);
      this.navCtrl.setRoot('follow-order',
      {data:
        { "orderId":data.orderId, 
          "doctorId":data.doctorId
        }
      });
    });

  }

}
