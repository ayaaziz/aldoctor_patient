import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';

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
    ,public toastCtrl: ToastController,
    public service:LoginserviceProvider
    ) {

      this.accessToken = localStorage.getItem('user_token');
      
      // this.langDirection = this.helper.lang_direction;
      // this.translate.use(this.helper.currentLang);
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRatesPage');
  }

}
