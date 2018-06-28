import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular/platform/platform';


@IonicPage({
  name:'settings'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  langDirection:any;
  language;

  constructor(public helper:HelperProvider,public translate:TranslateService,
     public navCtrl: NavController, public navParams: NavParams,
     public platform:Platform) {
    if (this.helper.currentLang == 'ar')
    {
     
      this.translate.use('ar');
      this.helper.currentLang = 'ar';
      this.translate.setDefaultLang('ar');
      this.helper.lang_direction = 'rtl';
      this.langDirection = "rtl";
      this.platform.setDir('rtl',true);
      this.language = this.translate.instant("english");
    }
    else{
    
      this.translate.use('en');
      this.helper.currentLang = 'en';
      this.translate.setDefaultLang('en');
      this.helper.lang_direction = 'ltr';
      this.langDirection = "ltr";
      this.platform.setDir('ltr',true);
      this.language = this.translate.instant("arabic");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  dismiss(){
    this.navCtrl.pop();
  }
 
  changeLanguage() {
    
   
    if (this.helper.currentLang == 'ar') {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.helper.currentLang = 'en';
      this.helper.lang_direction = 'ltr';
      this.langDirection = "ltr";
      this.platform.setDir('ltr',true);
      this.language = this.translate.instant("arabic");

    }
    else {
      this.translate.use('ar');
      this.helper.currentLang = 'ar';
      this.translate.setDefaultLang('ar');
      this.helper.lang_direction = 'rtl';
      this.langDirection = "rtl";
      this.platform.setDir('rtl',true);
      this.language = this.translate.instant("english");
    }
  }
}
