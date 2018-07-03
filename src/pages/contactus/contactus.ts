import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';


@IonicPage({
  name:'contact-us'
})
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {

  // constructor(public navCtrl: NavController, public navParams: NavParams) {
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ContactusPage');
  // }

  langDirection:any;
  contactusdata:any;
  accessToken:any;
  email;
  phone;
  mobile;

  constructor(public service:LoginserviceProvider,public helper:HelperProvider,public translate:TranslateService,public platform:Platform,public storage:Storage,public navCtrl: NavController, public navParams: NavParams) {
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
      this.service.ContactUs(this.accessToken)
      .subscribe(
        resp=>{
          this.contactusdata = JSON.parse(JSON.stringify(resp));
          this.email = this.contactusdata[0].value;
          this.mobile = this.contactusdata[1].value;
          this.phone = this.contactusdata[2].value;
          console.log("resp from contact us",resp);
        },err=>{
          console.log("err from contact us: ",err);
        }
      );
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactusPage');
  }

  dismiss(){
    this.navCtrl.pop();
  }
  
}
