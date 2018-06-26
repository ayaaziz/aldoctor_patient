import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';



// @IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  langDirection:any;

  data=[{"title":"doctor will arrive soon","time":"9:30 am"},
        {"title":"doctor will arrive soon","time":"9:30 am"},
        {"title":"doctor will arrive soon","time":"9:30 am"},
        {"title":"doctor will arrive soon","time":"9:30 am"}]

  constructor(public translate:TranslateService,public helper:HelperProvider
    ,public navCtrl: NavController, public navParams: NavParams) {

      this.langDirection = this.helper.lang_direction;
      this.translate.use(this.helper.currentLang);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}
