import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular/platform/platform';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';


@IonicPage()
@Component({
  selector: 'page-conditions',
  templateUrl: 'conditions.html',
})
export class ConditionsPage {

  // constructor(public navCtrl: NavController, public navParams: NavParams) {
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ConditionsPage');
  // }

  langDirection:any
  accessToken:any
  conditiondata:any
  constructor(public service:LoginserviceProvider,public platform:Platform,public storage:Storage,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
   
    if (this.helper.currentLang == 'ar')
    {
     
      this.translate.use('ar');
      this.helper.currentLang = 'ar';
      this.translate.setDefaultLang('ar');
      this.helper.lang_direction = 'rtl';
      this.langDirection = "rtl";
      this.platform.setDir('rtl',true)
    }
    else{
    
      this.translate.use('en');
      this.helper.currentLang = 'en';
      this.translate.setDefaultLang('en');
      this.helper.lang_direction = 'ltr';
      this.langDirection = "ltr";
      this.platform.setDir('ltr',true)
    }
  
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.service.Conditions(this.accessToken)
      .subscribe(
        resp=>{
          this.conditiondata = JSON.parse(JSON.stringify(resp));
          alert(JSON.stringify(this.conditiondata))
        },err=>{
          alert(JSON.stringify(err))
        }
      );
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConditionsPage');
  }

}
