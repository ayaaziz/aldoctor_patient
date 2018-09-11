import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams ,Events,AlertController} from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';

import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from '../tabs/tabs';


@IonicPage({
  name:'remaining-time-to-accept'
})
@Component({
  selector: 'page-remaining-time-to-accept',
  templateUrl: 'remaining-time-to-accept.html',
})
export class RemainingTimeToAcceptPage {

  orderId;
  langDirection;
  tostClass;

  constructor(public helper:HelperProvider,public navCtrl: NavController, 
    public navParams: NavParams,public storage: Storage,
    public events: Events,public service:LoginserviceProvider,
    public alertCtrl: AlertController,public toastCtrl: ToastController,
    public translate: TranslateService) {
      
      this.helper.view = "remaining-time-to-accept";
      this.accessToken = localStorage.getItem('user_token');
      this.orderId = this.navParams.get('orderId');

      this.langDirection = this.helper.lang_direction;
    
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

  }

  // time = 45;
  time = 120;
  timer;
  notification;
  orderStatus;
  accessToken;

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemainingTimeToAcceptPage');
    this.helper.listenToNetworkDisconnection();
   
    
    this.timer =setInterval(()=>{
      
        this.time--;
        if(this.time <= 0){
          console.log("timer off");
          this.helper.removeNetworkDisconnectionListener();
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

    this.events.subscribe('cancelDoctorOrder', () => {
      console.log("cancel order from event doc");

      this.presentCancelConfirm();
     });


    this.events.subscribe('status0', (data) => {
      console.log("status0",data);
      this.helper.removeNetworkDisconnectionListener(); 
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

    this.events.subscribe('networkError',(data)=>{
      this.helper.listenToNetworkConnection();
      this.presentToast(" تأكد من اتصالك بالانترنت.. لمتابعه الطلب من هنا ");
      // this.navCtrl.push(OrderhistoryPage);  
      this.events.publish("changeIndex",{index:"1"});
      
      
    });
    
    this.events.subscribe('networkConnected',(data)=>{
      this.presentToast("الان انت متصل بالانترنت");
    });



  }
  
  ionViewWillLeave(){
    console.log("remaing time for plc will leave");
    if(this.time > 0)
      this.presentCancelConfirm();
  }

  presentCancelConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: "هل تريد الغاء الطلب ؟ ",
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
            clearTimeout(this.timer);
            // this.navCtrl.pop();
            this.navCtrl.setRoot(TabsPage);
            this.navCtrl.push('cancel-order',{orderId:this.orderId});
            
          }
        }
      ]
    });
    alert.present();
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

}
