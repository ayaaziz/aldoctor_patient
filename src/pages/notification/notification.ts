import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,ToastController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';




// @IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  langDirection:any;
  accessToken;
  page=1;
  maximumPages;
  refresher;

  showLoading=true;
  tostClass ;


  // data=[{"txt":"doctor will arrive soon","time":"9:30 am"},
  //       {"txt":"doctor will arrive soon","time":"9:30 am"},
  //       {"txt":"doctor will arrive soon","time":"9:30 am"},
  //       {"txt":"doctor will arrive soon","time":"9:30 am"}];
        
  data = [];

  constructor(public events: Events,public toastCtrl: ToastController,
    public service:LoginserviceProvider,public storage: Storage,
    public translate:TranslateService,public helper:HelperProvider
    ,public navCtrl: NavController, public navParams: NavParams) {

      this.langDirection = this.helper.lang_direction;
      this.translate.use(this.helper.currentLang);
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";
  }

  ionViewWillEnter(){
    console.log("will enter notifications");

    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.loadNotification();
    });

    this.storage.get("access_token").then(data=>{

      this.accessToken = data;

    this.service.readNotification(this.accessToken).subscribe(
      resp=>{
        console.log("resp from read notification",resp);
        this.events.publish('lengthdata', 0);
      },err=>{
        console.log("err from read notification",err);
      }
    );

  });

}
  ionViewDidLoad() {
    
    // this.navCtrl.push('rate-doctor',{data:{doctorId:28,orderId:177}});
    

    console.log('ionViewDidLoad NotificationPage');
    // this.storage.get("access_token").then(data=>{

    //   this.accessToken = data;
      
      

      // this.loadNotification();
      
      // this.service.getCountOfNotifications(this.accessToken).subscribe(
      //   resp=>{;
      //     console.log("resp from getcountofnotifications ",resp);
      //   },err=>{
      //     console.log("err from getcountofnotifications ",err);
      //   }
      // );
      // this.service.getNotifications(this.accessToken).subscribe(
      //   resp=>{
      //     console.log("resp from getNotifications : ",resp);
      //   },
      //   err=>{
      //     console.log("err from getNotifications: ",err);
      //   }
      // );


    //});

    // this.service.getCountOfNotifications(this.accessToken).subscribe(
    //   resp=>{;
    //     console.log("resp from getcountofnotifications ",resp);
    //   },err=>{
    //     console.log("err from getcountofnotifications ",err);
    //   }
    // );
    
   
   
  }
  loadNotification(infiniteScroll?) {
    this.showLoading = false;
    this.service.getNotifications(this.page,this.accessToken).subscribe(
      resp=>{
        this.showLoading = true;
        console.log("resp from getNotifications : ",resp);
        var notificatoionResp = JSON.parse(JSON.stringify(resp)).notifications;
        this.maximumPages = notificatoionResp.last_page;
        var notificationsData = notificatoionResp.data;
        console.log("notificationsData" , notificationsData);
        console.log("notificationsData lenght",notificationsData.length);
        
        for(var i=0;i<notificationsData.length;i++){
          console.log("text ",notificationsData[i].data.text);
          this.data.push(notificationsData[i].data.text);
          
        }
        
        // this.data = notificationsData;

        if(this.data.length == 0)
        {
         this.presentToast(this.translate.instant("noNOtification")); 
        }
        if (infiniteScroll) {
          infiniteScroll.complete();
        }

      },
      err=>{
        this.showLoading = true;
        console.log("err from getNotifications: ",err);
      }
    );

  
  }
 
  refreshNotification() {
    this.showLoading = false;
    this.service.getNotifications("1",this.accessToken).subscribe(
      resp=>{
        this.showLoading = true;
        console.log("resp from getNotifications : ",resp);
        if(this.refresher){
          this.data=[];
        }
        var notificatoionResp = JSON.parse(JSON.stringify(resp)).notifications;
        this.maximumPages = notificatoionResp.last_page;
        var notificationsData = notificatoionResp.data;
        console.log("notificationsData" , notificationsData);
        console.log("notificationsData lenght",notificationsData.length);
        // this.data = [];
        for(var i=0;i<notificationsData.length;i++){
          console.log("text ",notificationsData[i].data.text);
          this.data.push(notificationsData[i].data.text);
          
        }
        
        // this.data = notificationsData;


        if(this.refresher){
          this.refresher.complete();
        }
      },
      err=>{
        this.showLoading = true;
        console.log("err from getNotifications: ",err);
      }
    );

  
  }

  loadMore(infiniteScroll) {
    console.log("load more");
    this.page++;
    this.loadNotification(infiniteScroll);
 
    if (this.page == this.maximumPages) {
      infiniteScroll.enable(false);
    }
  }

  doRefresh(ev){
    console.log("refresh",ev);
    this.refresher = ev;
    
    this.refreshNotification();
    
  }
 
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }


}
