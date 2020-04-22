import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';

import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from '../tabs/tabs';

// declare var interval;

@IonicPage({
  name: 'remaining-time-to-accept'
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

  // time = 45;
  // time = 120;
  time = 180;
  timer;
  notification;
  orderStatus;
  accessToken;
  interval
  timeLeft
  remaining_time = 180

  constructor(public helper: HelperProvider, public navCtrl: NavController,
    public navParams: NavParams, public storage: Storage,
    public events: Events, public service: LoginserviceProvider,
    public alertCtrl: AlertController, public toastCtrl: ToastController,
    public translate: TranslateService) {

    this.helper.view = "remaining-time-to-accept";

    this.events.publish('enableTabs', false);

    this.accessToken = localStorage.getItem('user_token');
    this.orderId = this.navParams.get('orderId');

    this.helper.idForOrderToCancelItFromBack = this.orderId;

    this.langDirection = this.helper.lang_direction;

    if (this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass = "toastLeft";

      document.addEventListener('pause', () => {
        console.log("pause "+ this.navCtrl.getActive().name)
        if(this.navCtrl.getActive().name == "RemainingTimeToAcceptPage"){
        clearTimeout(this.timer)
        clearInterval(this.interval)
        var dt1 = new Date();
        console.log("this.time from pause :", this.time)
        localStorage.setItem('timeStopAt', this.time + "," + dt1)
        }
        else{
          if(localStorage.getItem('timeStopAt')){
            localStorage.removeItem('timeStopAt')
          }
        }
      });
      document.addEventListener('resume', () => {
        if(this.navCtrl.getActive().name == "RemainingTimeToAcceptPage"){
          if(localStorage.getItem('timeStartAt')){
        console.log("localStorage.getItem('timeStopAt') :", localStorage.getItem('timeStartAt'))
        var timeStopAt = localStorage.getItem('timeStartAt');
        var t1 = new Date()
        var t2 = new Date(timeStopAt);
        var dif = t1.getTime() - t2.getTime();
        var Seconds_from_T1_to_T2 = (dif / 1000);
        console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2)
        let time_left
        time_left = 180 - Seconds_from_T1_to_T2
        if (time_left <= 0) {
          this.remaining_time = 0
        }
        else {
          this.remaining_time = time_left
        }
        this.startTimer()
        //   console.log("localStorage.getItem('timeStopAt') :",localStorage.getItem('timeStopAt'))
  
       
      }
      }
      else{
        if(localStorage.getItem('timeStopAt')){
          localStorage.removeItem('timeStopAt')
        }
      }
      });
      
    // document.addEventListener('pause', () => {
    //   console.log("pause")
    //   clearTimeout(this.timer)
    //   clearInterval(this.interval)
    //   var dt1 = new Date();
    //   console.log("this.time from pause :", this.time)
    //   localStorage.setItem('timeStopAt', this.time + "," + dt1)
    //   // localStorage.setItem('remaining',"1")
    // });
    // document.addEventListener('resume', () => {
    //   // if(localStorage.getItem('remaining') == "1"){
    //   console.log("localStorage.getItem('timeStopAt') :", localStorage.getItem('timeStartAt'))
    //   var timeStopAt = localStorage.getItem('timeStartAt');
    //   var t1 = new Date()
    //   var t2 = new Date(timeStopAt);
    //   var dif = t1.getTime() - t2.getTime();
    //   var Seconds_from_T1_to_T2 = (dif / 1000);
    //   console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2)
    //   let time_left
    //   time_left = 180 - Seconds_from_T1_to_T2
    //   if (time_left <= 0) {
    //     this.remaining_time = 0
    //   }
    //   else {
    //     this.remaining_time = time_left
    //   }
    //   this.startTimer()


    // // }


    //   //   console.log("localStorage.getItem('timeStopAt') :",localStorage.getItem('timeStopAt'))

    //   //   var timeStopAt = localStorage.getItem('timeStopAt');
    //   //   var dt2 = new Date(timeStopAt.split(",")[1])
    //   //   var dt1 = new Date();
    //   //   console.log("resume dt1 :",dt1," dt2:",dt2);
    //   //   var timeDiff = Math.abs( dt2.getTime() - dt1.getTime());
    //   //   var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 


    //   //   if(diffDays <= 0)
    //   //   {
    //   //     var ss =Math.abs(Math.round((dt2.getTime() - dt1.getTime()) / 1000));


    //   //     // var h = Math.floor(ss/3600);
    //   //     // var m = Math.floor(ss % 3600 /60);
    //   //     var s = Math.floor(ss % 3600 % 60);
    //   //      console.log("diff ss : ",s)
    //   //      this.time = parseInt(timeStopAt.split(",")[0] ) - s 
    //   //      console.log("this.time after diff",this.time)
    //   //      var xxxxtime =   parseInt(timeStopAt.split(",")[0] ) - s
    //   //     if( xxxxtime>0)
    //   //  this.time = xxxxtime 
    //   //  else if(xxxxtime <=0)
    //   //   this.time = 0
    //   //  if(this.time <= 0)
    //   // {
    //   //   console.log("clear timer from time diff ")
    //   //   clearTimeout(this.timer);
    //   //   this.accessToken = localStorage.getItem('user_token');

    //   //   this.service.updateOrderStatus(this.helper.orderIdForUpdate,this.accessToken).subscribe(
    //   //     resp=>{
    //   //       console.log("update status",resp);
    //   //       this.helper.removeOrder(this.helper.orderIdForUpdate);

    //   //     if(JSON.parse(JSON.stringify(resp)).running == 1)
    //   //     {
    //   //     this.presentToast("تم قبول الطلب لمتابعه الطلب من هنا ");
    //   //     this.navCtrl.parent.select(2);   //1      
    //   //     }

    //   //     },err=>{
    //   //       console.log("uppdate status",err);
    //   //     }
    //   //   );
    //   // // });
    //   // this.events.publish('enableTabs', true);
    //   // this.navCtrl.setRoot('order-not-accepted');

    //   // }

    //   // }

    // });

  }

  startTimer() {
    let start_time = localStorage.getItem("timeStartAt")
    console.log("start_time : ",start_time)
    if(!start_time){
      return;
    }
    this.timeLeft = Math.round(this.remaining_time)
    console.log("timeLeft :",this.timeLeft)
    if (this.timeLeft <= 0) {
      this.helper.removeNetworkDisconnectionListener();
      this.updateOrderStat()
      clearTimeout(this.timer)
      clearInterval(this.interval)

    }
    else {
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;

        } else {
          this.timeLeft = 180;
        }
      }, 1000)
      this.timer = setTimeout(() => {
        this.helper.removeNetworkDisconnectionListener();
        this.updateOrderStat()
        clearTimeout(this.timer)
        clearInterval(this.interval)
      }, this.timeLeft * 1000);
    }
  }
  updateOrderStat() {
    this.accessToken = localStorage.getItem('user_token');

    this.service.updateOrderStatus(this.helper.orderIdForUpdate, this.accessToken).subscribe(
      resp => {
        console.log("update status", resp);
       // this.helper.removeOrder(this.helper.orderIdForUpdate);
        localStorage.removeItem("timeStartAt")
        if (JSON.parse(JSON.stringify(resp)).running == 1 && JSON.parse(JSON.stringify(resp)).order.status != 3) {
          this.presentToast("تم قبول الطلب لمتابعه الطلب من هنا ");
          this.navCtrl.parent.select(2);   //1      
        }
        else{
          this.events.publish('enableTabs', true);
          this.navCtrl.setRoot('order-not-accepted');
        }

      }, err => {
        console.log("uppdate status", err);
      }
    );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RemainingTimeToAcceptPage');
    localStorage.setItem('remaining',"1")
    this.helper.listenToNetworkDisconnection();
    localStorage.setItem('timeStartAt', String(new Date()))
    this.startTimer()
    // this.timer =setInterval(()=>{

    //     this.time--;
    //     if(this.time <= 0){
    //       console.log("timer off 1");
    //      this.helper.removeNetworkDisconnectionListener();
    //       clearTimeout(this.timer);

    //       // this.storage.get("access_token").then(data=>{
    //       //   this.accessToken = data;

    //     // });
    //     this.events.publish('enableTabs', true);
    //     this.navCtrl.setRoot('order-not-accepted');

    //     }
    //     console.log("time: ",this.time);
    // //  console.log("timer : ",this.timer);
    // //  this.notification = this.helper.notification;
    // // console.log("notification from remaining time :",this.notification);

    // //   this.orderStatus = this.notification.additionalData.order_status;
    // //   if(this.orderStatus == "2")
    // //   {
    // //     clearTimeout(this.timer);
    // //     this.navCtrl.setRoot('follow-order',
    // //     {data:
    // //       {"orderId":this.notification.additionalData.orderId          , 
    // //         "doctorId":this.notification.additionalData.doctorId
    // //       }
    // //     });

    // //   }else if(this.orderStatus == "0")
    // //   {
    // //     clearTimeout(this.timer);
    // //     this.navCtrl.setRoot('order-not-accepted');

    // //   }else{
    // //     console.log("another status");
    // //   }



    // },1000);

    this.events.subscribe('cancelDoctorOrder', () => {
      console.log("cancel order from event doc");

      // this.presentCancelConfirm();
      if (this.timer) {
        console.log("clear timer to cancel");
        clearTimeout(this.timer);
      }

      //   this.backpresentCancelConfirm();
    });


    this.events.subscribe('status0', (data) => {
      console.log("status0", data);
      console.log("clear yimer status0")
      clearTimeout(this.timer);
      this.events.publish('enableTabs', true);
      this.navCtrl.setRoot('order-not-accepted');
      this.helper.removeNetworkDisconnectionListener();

    });

    this.events.subscribe('status2', (data) => {
      console.log("status2", data);
      this.acceptOrder = true;
      console.log("clear timer status2")
      if (this.timer)
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

    this.events.subscribe('networkError', (data) => {
      this.helper.listenToNetworkConnection();
      this.net = false;

      this.presentToast(" تأكد من اتصالك بالانترنت.. لمتابعه الطلب من هنا ");
      // this.navCtrl.push(OrderhistoryPage);
      this.helper.removeNetworkDisconnectionListener();
      console.log("clear timer hhh")
      clearTimeout(this.timer);
      this.navCtrl.setRoot(TabsPage);
      this.navCtrl.parent.select(2); //1
      //this.events.publish("changeIndex",{index:"1"});


    });

    this.events.subscribe('networkConnected', (data) => {
      this.presentToast(" انت متصل بالانترنت");
      this.net = true;
      this.helper.removeNetworkConnectionListener();
    });



  }

   ionViewWillLeave(){
    console.log("remaing time for plc will leave");
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
            console.log("clear timer cancel order")
            clearTimeout(this.timer);
            // this.navCtrl.pop();
            this.navCtrl.parent.select(0);
            this.stopAlert = true;
            this.navCtrl.setRoot(TabsPage);
            this.navCtrl.push('cancel-order', { orderId: this.orderId });

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
            console.log("clear timer ppppp")
            clearTimeout(this.timer);
            this.helper.backBtnInHelper = false;
            // this.navCtrl.pop();
            //         this.navCtrl.parent.select(0);
            this.stopAlert = true;
            this.navCtrl.setRoot(TabsPage);
            this.navCtrl.push('cancel-order', { orderId: this.orderId });

          }
        }
      ]
    });
    alert.present();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter from doctor");
    this.helper.view = "remaining-time-to-accept";
  }



  cancelOrder(){
    console.log("cancelOrder")
    this.backpresentCancelConfirmForDoc()
    
  }


  backpresentCancelConfirmForDoc() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: "هل تريد إلغاء الطلب ؟ ",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('cancel disagree clicked');

          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('cancel order agree clicked');

            var token = localStorage.getItem('user_token');
            this.events.publish('cancelDoctorOrder');
            this.service.cancelorder(this.orderId, "", "", token).timeout(10000).subscribe(
              resp => {
                console.log("cancel order resp: ", resp);
                if (JSON.parse(JSON.stringify(resp)).success) {

                  this.presentToast(this.translate.instant("orderCancled"));
                  this.events.publish('cancelDoctorOrder');
                  this.events.publish('enableTabs', true);
                  this.navCtrl.setRoot(TabsPage);
                  this.navCtrl.parent.select(2); //1
                  // this.navCtrl.pop();
                }
              },
              err => {
                console.log("cancel order err: ", err);
                this.presentToast(this.translate.instant("serverError"));
              }
            );



            //this.nav.push('cancel-order',{orderId:this.helper.idForOrderToCancelItFromBack});

          }
        }
      ]
    });
    alert.present();
  }



}
