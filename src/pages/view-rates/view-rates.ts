import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  name:'view-rates'
})
@Component({
  selector: 'page-view-rates',
  templateUrl: 'view-rates.html',
})
export class ViewRatesPage {

  langDirection:any;
  accessToken;
  page=1;
  maximumPages;
  refresher;
  showLoading=true;
  tostClass ;
  data = [];

  constructor(public navCtrl: NavController, public navParams: NavParams
    // ,public toastCtrl: ToastController,
    // public service:LoginserviceProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRatesPage');
  }

}
