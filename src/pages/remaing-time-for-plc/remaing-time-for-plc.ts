import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams, Events ,ToastController,AlertController,Platform} from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';

import { Storage } from '@ionic/storage';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from '../tabs/tabs';
import { FollowOrderForPlcPage } from '../follow-order-for-plc/follow-order-for-plc';
import { HomePage } from '../home/home';


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
  // receivedImage;
  langDirection;
  tostClass;
  orderId;
  acceptOrder = false;
  net = true;
  stopAlert = false;
  willLeave = false;
  alertApear = false;
  alertCancelShown  = false;
  interval
  timeLeft
  remaining_time
  type_id;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider,public events: Events,
    public storage: Storage,public service:LoginserviceProvider,
    public toastCtrl: ToastController,public alertCtrl: AlertController
    // ,private network: Network
    ,public translate: TranslateService,public platformObj:Platform,
    public app:App
  ) {
    
    console.log("this.navCtrl from rtime constractor",this.navCtrl);
      this.helper.view = "remaining-time-for-plc";
      this.events.publish('enableTabs', false);
      this.helper.stillCount = true;

      this.accessToken = localStorage.getItem('user_token');
      this.langDirection = this.helper.lang_direction;
    
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";


     var data =  this.navParams.get('data');
      this.orderId = this.navParams.get('orderId');
      this.helper.idForOrderToCancelItFromBack = this.orderId;

      //ayaaaaa //from order-service & order-specific-service & service-profile pages
      this.type_id = this.navParams.get('type_id');
      
      console.log("data from remaing time for plc",data , "orderId: ",this.orderId);
     
     if(data == 1)
     {
        // this.time = 120;
        this.time = 180;
        this.remaining_time = 180
        // this.receivedImage = 1;
     }else if (data == 0){
      //  this.time = 45;
      this.time = 180;
      this.remaining_time = 180
      //  this.receivedImage = 0;
     }

    //  this.platformObj.registerBackButtonAction(()=>{
    //    console.log("back btn ");
    //    this.presentCancelConfirm();
    //  });
    // this.navCtrl.viewWillLeave.subscribe(view=>{
    //   console.log("view from remaining time plc",view);
    // });

    document.addEventListener('pause', () => {
      console.log("pause "+ this.navCtrl.getActive().name)
      if(this.navCtrl.getActive().name == "RemaingTimeForPlcPage"){
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
      if(this.navCtrl.getActive().name == "RemaingTimeForPlcPage"){
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
    //   console.log("this.time from pause :",this.time)
    //   localStorage.setItem('timeStopAt', String(dt1))
    //   // localStorage.setItem('remaining',"1")
    // });
    // document.addEventListener('resume', () => {
    //   console.log("localStorage.getItem('timeStopAt') :",localStorage.getItem('timeStartAt'))
    //   var timeStopAt = localStorage.getItem('timeStartAt');
    //   var t1 = new Date()
    //             var t2 = new Date(timeStopAt);
    //             var dif = t1.getTime() - t2.getTime();
    //             var Seconds_from_T1_to_T2 = (dif / 1000);
    //             console.log('Seconds_from_T1_to_T2 ' + Seconds_from_T1_to_T2)
    //             let time_left
    //             time_left = 180 - Seconds_from_T1_to_T2
    //             if(time_left <= 0){
    //               this.remaining_time = 0
    //             }
    //             else{
    //               this.remaining_time = time_left
    //             }
    //             this.startTimer()
    //   // var timeStopAt = localStorage.getItem('timeStopAt');
    //   // var dt2 = new Date(timeStopAt.split(",")[1])
    //   // var dt1 = new Date();
    //   // console.log("resume dt1 :",dt1," dt2:",dt2);
    //   // var timeDiff = Math.abs( dt2.getTime() - dt1.getTime());
    //   // var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 
  
    
    //   // if(diffDays <= 0)
    //   // {
    //   //   var ss =Math.abs(Math.round((dt2.getTime() - dt1.getTime()) / 1000));
        
    
    //   //   // var h = Math.floor(ss/3600);
    //   //   // var m = Math.floor(ss % 3600 /60);
    //   //   var s = Math.floor(ss % 3600 % 60);
    //   //    console.log("diff ss : ",s)
    //   //    this.time = parseInt(timeStopAt.split(",")[0] ) - s 
    //   //    console.log("this.time after diff",this.time)
        
    //   //    var xxxxtime =   parseInt(timeStopAt.split(",")[0] ) - s
    //   //    if( xxxxtime>0)
    //   // this.time = xxxxtime 
    //   // else if(xxxxtime <=0)
    //   //  this.time = 0
    //   // }

    // });

    
  }
  startTimer() {
    let start_time = localStorage.getItem("timeStartAt")
    if(!start_time){
      return;
    }
    this.timeLeft = Math.round(this.remaining_time)
    if(this.timeLeft <= 0){
      this.helper.removeNetworkDisconnectionListener();
      this.updateOrderStat()
      clearTimeout(this.timer)
      clearInterval(this.interval)
      
    }
    else{
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
  updateOrderStat(){
    this.accessToken = localStorage.getItem('user_token');

      this.service.updateOrderStatus(this.helper.orderIdForUpdate,this.accessToken).subscribe(
        resp=>{
          console.log("update status resp from remaining time for plc",resp);
          if(JSON.parse(JSON.stringify(resp)).running == 1 && JSON.parse(JSON.stringify(resp)).order.status != 3)
          {
            localStorage.removeItem("timeStartAt")
            this.presentToast("تم قبول طلبك .. لمتابعه الطلب من هنا ");
            this.events.publish('enableTabs', true);
            
            this.navCtrl.setRoot(TabsPage);
            // this.navCtrl.parent.select(1); 
            // console.log("before setRoot of follow plc");
            this.navCtrl.push(FollowOrderForPlcPage,
            {data2:
              { "orderId":this.orderId, 
                "doctorId":JSON.parse(JSON.stringify(resp)).serviceprofileid,
                
              }
            });  
                  
          }else{
            this.events.publish('enableTabs', true);
            this.navCtrl.setRoot('order-not-accepted',{type_id:this.type_id});
          }
          // this.helper.removeOrder(this.helper.orderIdForUpdate);
        },err=>{
          console.log("update status err from remaining time for plc",err);
        }
      );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RemaingTimeForPlcPage');
    console.log("stillCount",this.helper.stillCount);

    this.helper.listenToNetworkDisconnection();
    this.time = 180
    localStorage.setItem('timeStartAt', String(new Date()))
    this.startTimer()
  //   this.timer =setInterval(()=>{
      
  //     this.time--;
  //     if(this.time <= 0){
  //       console.log("timer off");
  //        this.helper.removeNetworkDisconnectionListener();
  //      clearTimeout(this.timer);
  //       this.helper.stillCount = false;

  //     //  this.storage.get("access_token").then(data=>{
  //     //   this.accessToken = data;
      
  //   // });

  //       // this.events.publish('enableTabs', true);
  //       // this.navCtrl.setRoot('order-not-accepted');
       
  //     }   
    
  // },1000);


  // this.events.subscribe('appearCancelAlert',()=>{
  //   console.log("from appearCancelAlert subscribe");
    
  //   this.presentCancelConfirm();

  // });

  this.events.subscribe('status0ForPLC', (data) => {
    console.log("status0ForPLC",data);
    
    clearTimeout(this.timer);
    this.helper.stillCount = false;
    this.events.publish('enableTabs', true);

    this.navCtrl.setRoot('order-not-accepted',{type_id:this.type_id});
    this.helper.removeNetworkDisconnectionListener();    

  });

  this.events.subscribe('status2ForPLC', (data) => {
    console.log("status2ForPLC",data);
    this.acceptOrder = true;
    if(this.timer)
    clearTimeout(this.timer);
    this.helper.stillCount = false;
    
    this.events.publish('enableTabs', true);

    console.log("before setRoot of follow plc");
    console.log("this.navCtrl",this.navCtrl);
    this.helper.removeNetworkDisconnectionListener();    
   
    // this.navCtrl.setRoot(TabsPage);

    // this.navCtrl.setRoot(FollowOrderForPlcPage,
    //   {data2:
    //     { "orderId":data.orderId, 
    //       "doctorId":data.doctorId
    //     }
    //   });

  //  this.pushFollowPage(data.orderId,data.doctorId);
  });
  
  this.events.subscribe('cancelOrder', () => {
   console.log("cancel order from event");
   if(this.timer)
   {  console.log("clear timer to cancel");
     clearTimeout(this.timer);
   }
  //  this.presentCancelConfirm();
  // console.log("alertApear: ",this.alertApear);
  // if(this.alertApear == false ){
  //   console.log("form if alertApear: ",this.alertApear);
  //   this.alertApear = true;
  //   console.log("set alertApear to true ");
  //   this.backpresentCancelConfirm();
  // }
    
  });
  
  this.events.subscribe('networkError',(data)=>{
    this.helper.listenToNetworkConnection();
    this.net = false;
    this.presentToast(" تأكد من اتصالك بالانترنت.. لمتابعه الطلب من هنا ");
    // this.navCtrl.push(OrderhistoryPage);  
    this.helper.removeNetworkDisconnectionListener();
    clearTimeout(this.timer);
    this.helper.stillCount = false;

    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.parent.select(2); //1
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

  // ionViewWillLeave(){
  //   console.log("remaing time for plc will leave");
  //   console.log("net",this.net);
  //   this.willLeave = true;
  //   if(this.time > 0 && this.acceptOrder == false && this.net == true && this.stopAlert == false)
  //     this.presentCancelConfirm();
  // }

  presentCancelConfirm() {
    console.log("alertCancelShown",this.alertCancelShown);
        
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
            this.helper.stillCount = false;

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
            this.alertApear = false;
            console.log("set alertApear to false");

            this.helper.backBtnInHelper = false;
            
            
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('cancel order agree clicked');
            clearTimeout(this.timer);
            this.helper.stillCount = false;

            this.helper.backBtnInHelper = false;
            this.alertApear = false;
            console.log("set alertApear to false");
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


  ionViewWillEnter() {
    console.log("ionViewWillEnter from plc");
    this.helper.view = "remaining-time-for-plc";
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter from plc");
    this.helper.view = "remaining-time-for-plc";
  }

  // ionViewDidLeave(){
  //   console.log("ionViewDidLeave from plc");
  //   // if(this.willLeave == false)
  //   // {
  //     if(this.time > 0 && this.acceptOrder == false && this.net == true && this.stopAlert == false)
  //       this.presentCancelConfirm();
  //   // }
    
  // }

  // onPageWillLeave() {
  // console.log("remaining plc leaveeeeeeeeee");  
  // }
  // ionViewCanLeave(){
  //   console.log("view will leave r plc");
  // }
  pushFollowPage(orderId,doctorId){
    console.log("push follow page ","oderId",orderId,"docId",doctorId);
    // this.navCtrl.parent.select(0);
    // this.navCtrl.setRoot(HomePage);
    
console.log("this.navCtrl setroot home page",this.navCtrl);
    this.navCtrl.push(FollowOrderForPlcPage,
      {data2:
        { "orderId":orderId, 
          "doctorId":doctorId
        }
      });
      console.log("after push page");
  }

  
  cancelOrder(){
    console.log("cancelOrder")
    
    this.backpresentCancelConfirm2();
    
  }


  backpresentCancelConfirm2() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: "هل تريد إلغاء الطلب ؟ ",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
            //this.navCtrl.parent.select(0);
            //          this.alertApear = false;
            console.log("set alertApear to false");

            //        this.helper.backBtnInHelper = false;


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

                  this.events.publish('cancelOrder');
                  this.events.publish('enableTabs', true);
                  this.navCtrl.setRoot(TabsPage);
                  this.navCtrl.parent.select(2); //1
                  // this.navCtrl.pop()

                }
              },
              err => {
                console.log("cancel order err: ", err);
                this.presentToast(this.translate.instant("serverError"));
              }
            );




            // this.nav.setRoot(TabsPage);

            // this.nav.push('cancel-service',{orderId:this.helper.idForOrderToCancelItFromBack});

          }
        }
      ]
    });
    alert.present();
  }


}
