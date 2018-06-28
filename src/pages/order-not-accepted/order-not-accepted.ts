import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the OrderNotAcceptedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
