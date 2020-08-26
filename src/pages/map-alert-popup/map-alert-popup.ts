import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Platform } from 'ionic-angular/platform/platform';

@IonicPage()
@Component({
  selector: 'page-map-alert-popup',
  templateUrl: 'map-alert-popup.html',
})
export class MapAlertPopupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,
              private app: App,
              private platform:Platform) {

    // this.platform.registerBackButtonAction(() => {
    //   this.viewCtrl.dismiss({"goHome":true});
    // });
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapAlertPopupPage');
  }

  closePopup() {
    this.viewCtrl.dismiss({"goHome":false});
  }

  goHome() {
    this.viewCtrl.dismiss({"goHome":true});
  }

}
