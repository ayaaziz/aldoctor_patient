import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { HelperProvider } from '../../providers/helper/helper';

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

  constructor(  public helper:HelperProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    //   document.removeEventListener('pause',()=>{
    //     console.log("removeEventListener pause")
    //   })

    //   document.removeEventListener('resume',()=>{
    //    console.log("removeEventListener resume")
    //  })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderNotAcceptedPage');
    this.helper.view = "";
  }
  ok(){
    this.navCtrl.setRoot(TabsPage);
  }
}
