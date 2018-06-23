import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-doctor-evaluation',
  templateUrl: 'doctor-evaluation.html',
})
export class DoctorEvaluationPage {

  doctorName="Ahmed";
  rate;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorEvaluationPage');
  }
  onModelChange(event){

  }
  sendEvaluation(){
    
  }

}
