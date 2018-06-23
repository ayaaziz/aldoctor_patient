import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular/platform/platform';


@IonicPage()
@Component({
  selector: 'page-about-app',
  templateUrl: 'about-app.html',
})
export class AboutAppPage {

  accessToken:any
  langDirection:any
  aboutdata:any
  constructor(public platform:Platform,public helper:HelperProvider,public translate:TranslateService,public service: LoginserviceProvider,public storage:Storage,public navCtrl: NavController, public navParams: NavParams) {
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
      alert(this.accessToken)
      this.service.AboutApplication(this.accessToken)
      .subscribe(
        resp=>{
          this.aboutdata = JSON.parse(JSON.stringify(resp));
        },err=>{
          alert(JSON.stringify(err))
        }
      );
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutappPage');
  }
  AboutSuccess(data)
  {
alert(JSON.stringify(data))
  }
  FailSuccess(data)
  {

  }

}
