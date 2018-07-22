import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular/platform/platform';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import 'rxjs/add/operator/timeout';


@IonicPage({
  name:"conditions"
})
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

  langDirection:any;
  accessToken:any;
  conditiondata:any;
  tostClass;

  constructor(public toastCtrl: ToastController,
    public service:LoginserviceProvider,public platform:Platform,
    public storage:Storage,public helper:HelperProvider,
    public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
   
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
  
    this.translate.use(this.helper.currentLang);
    if(this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass="toastLeft";


    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      if(navigator.onLine){
      this.service.Conditions(this.accessToken)
      .timeout(10000)
      .subscribe(
        resp=>{
          this.conditiondata = JSON.parse(JSON.stringify(resp));
          //alert(JSON.stringify(this.conditiondata))
          console.log("resp from conditions: ",resp);
          this.conditiondata =  JSON.parse(JSON.stringify(resp))[0].value;

        },err=>{
          //alert(JSON.stringify(err))
          console.log("err from conditions: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
    }else{
      this.presentToast(this.translate.instant("checkNetwork"));
    }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConditionsPage');
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
  

}
