import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  name:'order-service'
})
@Component({
  selector: 'page-order-service',
  templateUrl: 'order-service.html',
})
export class OrderServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderServicePage');
  }

}
