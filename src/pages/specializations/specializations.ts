import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';


@IonicPage(
  {
    name:'specializations-page'
  }
)
@Component({
  selector: 'page-specializations',
  templateUrl: 'specializations.html',
})
export class SpecializationsPage {
  specializations;
  specializations1;
  specializations2;

  langDirection;

  constructor(public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams) {
      this.langDirection = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpecializationsPage');
    this.initializeSpecializations();
  }

  initializeSpecializations() {
    this.specializations = [
    {"name":"specialization1","image":""},
    {"name":"specialization2","image":""},
    {"name":"specialization3","image":""},
    {"name":"specialization4","image":""},
    {"name":"specialization5","image":""},
    {"name":"specialization6","image":""}];
    this.specializations1=[    {"name":"specialization1","image":"assets/imgs/specialization.png"},
    {"name":"specialization2","image":"assets/imgs/s2.png"},
    {"name":"specialization3","image":"assets/imgs/s3.png"}];
    this.specializations2=[{"name":"specialization5","image":"assets/imgs/s4.png"},
    {"name":"specialization6","image":"assets/imgs/s4.png"}];

  }


  getItems(ev) {
    
    this.initializeSpecializations();
    
    var val = ev.target.value;

    
    if (val && val.trim() != '') {
      this.specializations = this.specializations.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
