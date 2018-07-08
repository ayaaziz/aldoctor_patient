import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  // data=[{"txt":"doctor will arrive soon","time":"9:30 am"},
  //       {"txt":"doctor will arrive soon","time":"9:30 am"},
  //       {"txt":"doctor will arrive soon","time":"9:30 am"},
  //       {"txt":"doctor will arrive soon","time":"9:30 am"}];
        
  data = [];

  constructor(public service:LoginserviceProvider,public storage: Storage,
    public translate:TranslateService,public helper:HelperProvider
    ,public navCtrl: NavController, public navParams: NavParams) {

      this.langDirection = this.helper.lang_direction;
      this.translate.use(this.helper.currentLang);
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad NotificationPage');
    this.storage.get("access_token").then(data=>{

      this.accessToken = data;
      
      // this.navCtrl.push('rate-doctor',{data:{doctorId:28,orderId:177}});

      this.loadNotification();
      this.service.getCountOfNotifications(this.accessToken).subscribe(
        resp=>{;
          console.log("resp from getcountofnotifications ",resp);
        },err=>{
          console.log("err from getcountofnotifications ",err);
        }
      );
      // this.service.getNotifications(this.accessToken).subscribe(
      //   resp=>{
      //     console.log("resp from getNotifications : ",resp);
      //   },
      //   err=>{
      //     console.log("err from getNotifications: ",err);
      //   }
      // );


    });

    // this.service.getCountOfNotifications(this.accessToken).subscribe(
    //   resp=>{;
    //     console.log("resp from getcountofnotifications ",resp);
    //   },err=>{
    //     console.log("err from getcountofnotifications ",err);
    //   }
    // );
    
   
   
  }
  loadNotification(infiniteScroll?) {
    
    this.service.getNotifications(this.page,this.accessToken).subscribe(
      resp=>{
        console.log("resp from getNotifications : ",resp);
        var notificatoionResp = JSON.parse(JSON.stringify(resp)).notifications;
        this.maximumPages = notificatoionResp.last_page;
        var notificationsData = notificatoionResp.data;
        console.log("notificationsData" , notificationsData);
        console.log("notificationsData lenght",notificationsData.length);
        for(var i=0;i<notificationsData.length;i++){
          console.log("text ",notificationsData[i].data.text);
          
        }
        
        this.data = notificationsData;

        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      },
      err=>{
        console.log("err from getNotifications: ",err);
      }
    );

  
  }
 

  loadMore(infiniteScroll) {
    this.page++;
    this.loadNotification(infiniteScroll);
 
    if (this.page == this.maximumPages) {
      infiniteScroll.enable(false);
    }
  }


}
