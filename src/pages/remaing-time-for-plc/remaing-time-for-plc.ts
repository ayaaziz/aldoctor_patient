import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events ,ToastController,AlertController,Platform} from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';

import { Storage } from '@ionic/storage';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from '../tabs/tabs';


// import { Network } from '@ionic-native/network';


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
  langDirection;
  tostClass;
  orderId;
  acceptOrder = false;
  net = true;
  stopAlert = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider,public events: Events,
    public storage: Storage,public service:LoginserviceProvider,
    public toastCtrl: ToastController,public alertCtrl: AlertController
    // ,private network: Network
    ,public translate: TranslateService,public platformObj:Platform
  ) {
    
      this.helper.view = "remaining-time-for-plc";

      this.accessToken = localStorage.getItem('user_token');
      this.langDirection = this.helper.lang_direction;
    
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";


     var data =  this.navParams.get('data');
      this.orderId = this.navParams.get('orderId');
      console.log("data from remaing time for plc",data , "orderId: ",this.orderId);
     
     if(data == 1)
     {
        this.time = 120;
        this.receivedImage = 1;
     }else if (data == 0){
       this.time = 45;
       this.receivedImage = 0;
     }

    //  this.platformObj.registerBackButtonAction(()=>{
    //    console.log("back btn ");
    //    this.presentCancelConfirm();
    //  });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemaingTimeForPlcPage');
  
    this.helper.listenToNetworkDisconnection();
    
    
    this.timer =setInterval(()=>{
      
      this.time--;
      if(this.time <= 0){
        console.log("timer off");
        // this.helper.removeNetworkDisconnectionListener();
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
    // this.helper.removeNetworkDisconnectionListener();    
    clearTimeout(this.timer);
    
    this.navCtrl.setRoot('order-not-accepted');
  });

  this.events.subscribe('status2ForPLC', (data) => {
    console.log("status2ForPLC",data);
    this.acceptOrder = true;
    clearTimeout(this.timer);
    this.navCtrl.setRoot('follow-order-for-plc',
    {data:
      { "orderId":data.orderId, 
        "doctorId":data.doctorId,
        "receivedImage":this.receivedImage
      }
    });
  });
  
  this.events.subscribe('cancelOrder', () => {
   console.log("cancel order from event");
  //  this.presentCancelConfirm();
  this.backpresentCancelConfirm();
  });
  
  this.events.subscribe('networkError',(data)=>{
    this.helper.listenToNetworkConnection();
    this.net = false;
    this.presentToast(" تأكد من اتصالك بالانترنت.. لمتابعه الطلب من هنا ");
    // this.navCtrl.push(OrderhistoryPage);  
    this.helper.removeNetworkDisconnectionListener();
    clearTimeout(this.timer);
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.parent.select(1);
    // this.events.publish("changeIndex",{index:"1"});
    
    
  });
  
  this.events.subscribe('networkConnected',(data)=>{
    this.presentToast("انت متصل بالانترنت");
    this.net = true;
    this.helper.removeNetworkConnectionListener();
  });

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

  ionViewWillLeave(){
    console.log("remaing time for plc will leave");
    console.log("net",this.net);
    if(this.time > 0 && this.acceptOrder == false && this.net == true && this.stopAlert == false)
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
            
            this.navCtrl.push('cancel-service',{orderId:this.orderId});
            
          } 
        }
      ]
    });
    alert.present();
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
            console.log('disagree clicked');
            //this.navCtrl.parent.select(0);
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('cancel order agree clicked');
            clearTimeout(this.timer);
            // this.navCtrl.pop();
            //this.navCtrl.parent.select(0);
            this.stopAlert = true;
            this.navCtrl.setRoot(TabsPage);
            
            this.navCtrl.push('cancel-service',{orderId:this.orderId});
            
          } 
        }
      ]
    });
    alert.present();
  }


  ionViewDidEnter(){
    this.helper.view = "remaining-time-for-plc";
  }

}
