import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';


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

  constructor( public helper: HelperProvider, public navCtrl: NavController,
     public navParams: NavParams,public translate: TranslateService) {

    this.langDirection = this.helper.lang_direction;
    this.translate.use(this.helper.currentLang);
    
    this.doctorProfile = navParams.get('data');
    console.log("from doctor profile: ",this.doctorProfile);
    this.image = this.doctorProfile.profile_pic;
    this.name = this.doctorProfile.name;
    this.specialization = this.doctorProfile.specialization;
    this.rate = this.doctorProfile.rate;
    this.services = this.doctorProfile.extraInfo.SpecialityServices;
    this.services = ["any thing","any thing","any thing"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorProfilePage');
  }
  dismiss(){
    this.navCtrl.pop();
  }

}
