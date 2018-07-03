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

  data=[{"title":"doctor will arrive soon","time":"9:30 am"},
        {"title":"doctor will arrive soon","time":"9:30 am"},
        {"title":"doctor will arrive soon","time":"9:30 am"},
        {"title":"doctor will arrive soon","time":"9:30 am"}]

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
      this.service.getNotifications(this.accessToken).subscribe(
        resp=>{
          console.log("resp from getNotifications : ",resp);
        },
        err=>{
          console.log("err from getNotifications: ",err);
        }
      );
    });
    this.service.getCountOfNotifications(this.accessToken).subscribe(
      resp=>{;
        console.log("resp from getcountofnotifications ",resp);
      },err=>{
        console.log("err from getcountofnotifications ",err);
      }
    );
  
   
  }


}
