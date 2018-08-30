import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


@IonicPage(
  {
    name:'order-not-accepted'
  }
)
@Component({
  selector: 'page-order-not-accepted',
  templateUrl: 'order-not-accepted.html',
})
export class OrderNotAcceptedPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderNotAcceptedPage');
  }
  ok(){
    this.navCtrl.setRoot(TabsPage);
  }
}
