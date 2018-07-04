import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  name:'order-specific-service'
})
@Component({
  selector: 'page-order-specific-service',
  templateUrl: 'order-specific-service.html',
})
export class OrderSpecificServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSpecificServicePage');
  }

}
