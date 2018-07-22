import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular/platform/platform';

import 'rxjs/add/operator/timeout';


@IonicPage({
  name:'about-app'
})
@Component({
  selector: 'page-about-app',
  templateUrl: 'about-app.html',
})
export class AboutAppPage {

  accessToken:any;
  langDirection:any;
  aboutdata:any;
  tostClass ;
  

  constructor(public toastCtrl: ToastController,
    public platform:Platform,public helper:HelperProvider,
    public translate:TranslateService,public service: LoginserviceProvider,
    public storage:Storage,public navCtrl: NavController, 
    public navParams: NavParams) {
    
    

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

    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";
  
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      //alert(this.accessToken)
      if (navigator.onLine) {
      this.service.AboutApplication(this.accessToken)
      .timeout(10000)
      .subscribe(
        resp=>{
          console.log("resp from about-app : ",resp);
          this.aboutdata = JSON.parse(JSON.stringify(resp))[0].value;
          console.log("val from about app",this.aboutdata);
        },err=>{
          console.log("error from about-app : ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
    }else{
      this.presentToast(this.translate.instant("checkNetwork"));
    }
    });
  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutappPage');
  }
  dismiss(){
    this.navCtrl.pop();
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
  AboutSuccess(data)
  {
    
    //alert(JSON.stringify(data))
  }
  FailSuccess(data)
  {
    
  }

}
