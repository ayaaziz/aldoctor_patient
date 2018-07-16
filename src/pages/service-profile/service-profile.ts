import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';


@IonicPage({
  name:'service-profile'
})
@Component({
  selector: 'page-service-profile',
  templateUrl: 'service-profile.html',
})
export class ServiceProfilePage {

  langDirection: string;
  doctorProfile;
  image;
  name;
  address;
  phone;
  specialization;
  rate;
  services=["any thing","any thing","any thing"];
  accessToken;
  tostClass;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, 
    public storage: Storage, 
    public service:LoginserviceProvider,
    public helper: HelperProvider,public translate: TranslateService) {
    var data = this.navParams.get('data');
    console.log("data from service-profile ", data);
    this.langDirection = this.helper.lang_direction;
    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";
    this.translate.use(this.helper.currentLang);
    
    this.image = data.profile_pic;
    this.name = data.name;
    this.rate = data.rate;
    this.phone="0123456";
    this.address="address";
    // this.services = this.doctorProfile.SpecialityServices;
    this.services = ["any thing","any thing","any thing"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceProfilePage');
  }
  dismiss(){
    this.navCtrl.pop();
  }
  
  sendOrder(){

   // console.log("orderId from doctorProfile: ",this.doctorProfile.id);
  //   this.storage.get("access_token").then(data=>{
  //     this.accessToken = data;

  //   this.service.saveOrder(this.doctorProfile.id,this.accessToken).subscribe(
  //     resp => {
  //       console.log("saveOrder resp: ",resp);
  //       this.presentToast(this.translate.instant("ordersent"));
  //       // this.navCtrl.pop();
  //       this.navCtrl.push('remaining-time-to-accept');
  //     },
  //     err=>{
  //       console.log("saveOrder error: ",err);
  //       this.presentToast(this.translate.instant("serverError"));
  //     }
  //   ); 

  // });

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
