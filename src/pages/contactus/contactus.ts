import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import 'rxjs/add/operator/timeout';

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
  tostClass;
  
  constructor(public toastCtrl: ToastController,
    public service:LoginserviceProvider,public helper:HelperProvider,
    public translate:TranslateService,public platform:Platform,
    public storage:Storage,public navCtrl: NavController,
    public navParams: NavParams) {
    
    
    this.accessToken = localStorage.getItem('user_token');
    this.helper.view = "pop";
    

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

    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    this.accessToken = localStorage.getItem('user_token');

      if(navigator.onLine){
      // this.service.ContactUs(this.accessToken)
      // .timeout(10000).subscribe(
      //   resp=>{
      //     this.contactusdata = JSON.parse(JSON.stringify(resp));
      //     this.email = this.contactusdata[0].value;
      //     this.mobile = this.contactusdata[1].value;
      //     this.phone = this.contactusdata[2].value;
      //     console.log("resp from contact us",resp);
      //   },err=>{
      //     console.log("err from contact us: ",err);
      //     this.presentToast(this.translate.instant("serverError"));
      //   }
      // );

      this.service.getContactEmail(this.accessToken)
      .timeout(10000).subscribe(
        resp=>{
          
          this.email =  JSON.parse(JSON.stringify(resp))[0].value;
          
          console.log("resp from contact us",resp);
        },err=>{
          console.log("err from contact us: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
      this.service.getContactMobile(this.accessToken)
      .timeout(10000).subscribe(
        resp=>{
          
          
          this.mobile = JSON.parse(JSON.stringify(resp))[0].value;
          
          console.log("resp from contact us",resp);
        },err=>{
          console.log("err from contact us: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
      this.service.getContactPhone(this.accessToken)
      .timeout(10000).subscribe(
        resp=>{
          
          this.phone = JSON.parse(JSON.stringify(resp))[0].value;
          console.log("resp from contact us",resp);
        },err=>{
          console.log("err from contact us: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );


    }else{
      this.presentToast(this.translate.instant("checkNetwork"));
    }
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactusPage');
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
