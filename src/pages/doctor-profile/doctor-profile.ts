import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';


@IonicPage(
  {
    name:'doctor-profile'
  }
)
@Component({
  selector: 'page-doctor-profile',
  templateUrl: 'doctor-profile.html',
})
export class DoctorProfilePage {
  
  langDirection: string;
  doctorProfile;
  image;
  name;
  specialization;
  rate;
  services=["any thing","any thing","any thing"];
  accessToken;

  tostClass ;

  offline;

  constructor( public toastCtrl: ToastController, 
    public storage: Storage, 
    public service:LoginserviceProvider,
    public helper: HelperProvider, public navCtrl: NavController,
     public navParams: NavParams,public translate: TranslateService) {

    this.langDirection = this.helper.lang_direction;
    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

    this.translate.use(this.helper.currentLang);
    
    this.doctorProfile = navParams.get('data');
    console.log("from doctor profile: ",this.doctorProfile);
    this.image = this.doctorProfile.profile_pic;
    this.name = this.doctorProfile.name;
    this.specialization = this.doctorProfile.specialization;
    this.rate = this.doctorProfile.rate;
    this.services = this.doctorProfile.speciality_services;
    
    if(this.doctorProfile.availability == "1")
      this.offline = "0";
    else
      this.offline = "1";
    // this.services = ["any thing","any thing","any thing"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorProfilePage');
  }
  dismiss(){
    this.navCtrl.pop();
  }
  
  sendOrder(){

    if(this.offline == "1")
    {
      this.presentToast(this.translate.instant("doctoroffline"));
    }else{

    

    console.log("orderId from doctorProfile: ",this.doctorProfile.id);
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;

    this.service.saveOrder(this.doctorProfile.id,this.accessToken).subscribe(
      resp => {
        console.log("saveOrder resp: ",resp);
        this.presentToast(this.translate.instant("ordersent"));
        // this.navCtrl.pop();
        this.navCtrl.push('remaining-time-to-accept');
      },
      err=>{
        console.log("saveOrder error: ",err);
        this.presentToast(this.translate.instant("serverError"));
      }
    ); 

  });

}
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
