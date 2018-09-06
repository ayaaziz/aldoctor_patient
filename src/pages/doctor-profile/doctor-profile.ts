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
  services=[];
  accessToken;

  tostClass ;

  offline;
  bio;
  location;

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

    this.accessToken = localStorage.getItem('user_token');

    this.translate.use(this.helper.currentLang);
    
    this.doctorProfile = navParams.get('data');
    console.log("from doctor profile: ",this.doctorProfile);
    this.image = this.doctorProfile.profile_pic;
    this.name = this.doctorProfile.doctorName;
    this.specialization = this.doctorProfile.specialization;
    this.rate = this.doctorProfile.rate;
    this.bio = this.doctorProfile.bio;
    this.location = this.doctorProfile.address;
    this.services = this.doctorProfile.speciality_services;
    
    if(this.doctorProfile.offline == true)
      this.offline = "1";
    else
      this.offline = "0";
    // this.services = ["any thing","any thing","any thing"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorProfilePage');
    if(!navigator.onLine)
    this.presentToast(this.translate.instant("checkNetwork"));
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
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    
    this.accessToken = localStorage.getItem('user_token');

    this.service.saveOrder(this.doctorProfile.id,this.accessToken,1).subscribe(
      resp => {
        if(JSON.parse(JSON.stringify(resp)).success ){
        console.log("saveOrder resp: ",resp);
        var newOrder = JSON.parse(JSON.stringify(resp));
          
        this.helper.orderIdForUpdate = newOrder.order.id;
        
        this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,1);
        this.helper.orderStatusChanged(newOrder.order.id);

        this.presentToast(this.translate.instant("ordersent"));
        // this.navCtrl.pop();
        this.navCtrl.setRoot('remaining-time-to-accept');
        }else{
          this.presentToast(this.translate.instant("serverError"));
        }
      },
      err=>{
        console.log("saveOrder error: ",err);
        this.presentToast(this.translate.instant("serverError"));
      }
    ); 

  // });

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
