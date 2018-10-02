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
  acceptOrder = false;
  net = true;
  stopAlert = false;
  


  constructor(public helper:HelperProvider,public navCtrl: NavController, 
    public navParams: NavParams,public storage: Storage,
    public events: Events,public service:LoginserviceProvider,
    public alertCtrl: AlertController,public toastCtrl: ToastController,
    public translate: TranslateService) {
      
      this.helper.view = "remaining-time-to-accept";

      this.events.publish('enableTabs', false);

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

            if(JSON.parse(JSON.stringify(resp)).running == 1)
            {
            this.presentToast("تم قبول الطلب لمتابعه الطلب من هنا ");
            this.navCtrl.parent.select(2);   //1      
            }

            },err=>{
              console.log("uppdate status",err);
            }
          );
        // });
        this.events.publish('enableTabs', true);
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

      // this.presentCancelConfirm();
      this.backpresentCancelConfirm();
     });


    this.events.subscribe('status0', (data) => {
      console.log("status0",data);
       
      clearTimeout(this.timer);
      this.events.publish('enableTabs', true);
      this.navCtrl.setRoot('order-not-accepted');
      this.helper.removeNetworkDisconnectionListener(); 
      
    });

    this.events.subscribe('status2', (data) => {
      console.log("status2",data);
      this.acceptOrder = true;
      clearTimeout(this.timer);
      this.events.publish('enableTabs', true);
      this.helper.removeNetworkDisconnectionListener();

      // this.navCtrl.push('follow-order',
      // {data:
      //   { "orderId":data.orderId, 
      //     "doctorId":data.doctorId
      //   }
      // });
    });

    this.events.subscribe('networkError',(data)=>{
      this.helper.listenToNetworkConnection();
      this.net = false;

      this.presentToast(" تأكد من اتصالك بالانترنت.. لمتابعه الطلب من هنا ");
      // this.navCtrl.push(OrderhistoryPage);
      this.helper.removeNetworkDisconnectionListener();
      clearTimeout(this.timer);
      this.navCtrl.setRoot(TabsPage);  
      this.navCtrl.parent.select(2); //1
      //this.events.publish("changeIndex",{index:"1"});
      
      
    });
    
    this.events.subscribe('networkConnected',(data)=>{
      this.presentToast(" انت متصل بالانترنت");
      this.net = true;
      this.helper.removeNetworkConnectionListener();
    });



  }
  
  // ionViewWillLeave(){
  //   console.log("remaing time for plc will leave");
  //   if(this.time > 0 && this.acceptOrder == false && this.net == true && this.stopAlert == false)
  //     this.presentCancelConfirm();
  // }

  presentCancelConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: "هل تريد الغاء الطلب ؟ ",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('cancel disagree clicked');
            // this.navCtrl.setRoot(TabsPage);
            this.navCtrl.parent.select(0);
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('cancel order agree clicked');
            clearTimeout(this.timer);
            // this.navCtrl.pop();
            this.navCtrl.parent.select(0);
            this.stopAlert = true;
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
  backpresentCancelConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: "هل تريد الغاء الطلب ؟ ",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('cancel disagree clicked');
            this.helper.backBtnInHelper = false;
            // this.navCtrl.setRoot(TabsPage);
     //       this.navCtrl.parent.select(0);
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('cancel order agree clicked');
            clearTimeout(this.timer);
            this.helper.backBtnInHelper = false;
            // this.navCtrl.pop();
   //         this.navCtrl.parent.select(0);
            this.stopAlert = true;
            this.navCtrl.setRoot(TabsPage);
            this.navCtrl.push('cancel-order',{orderId:this.orderId});
            
          }
        }
      ]
    });
    alert.present();
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter from doctor");
    this.helper.view = "remaining-time-to-accept";
  }
  

}
