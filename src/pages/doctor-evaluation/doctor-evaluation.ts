import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';


@IonicPage({
  name:'rate-doctor'
})
@Component({
  selector: 'page-doctor-evaluation',
  templateUrl: 'doctor-evaluation.html',
})
export class DoctorEvaluationPage {

  doctorName="Ahmed";
  rate;
  note="ملاحظات";
  rateWord="جيد";
  langDirection;

  constructor(public helper:HelperProvider,
    public navCtrl: NavController, public navParams: NavParams) {
      this.langDirection = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorEvaluationPage');
  }
  onModelChange(event){

  }
  rateDoctor(){
    
  }
  dismiss(){
    this.navCtrl.pop();
  }

}
