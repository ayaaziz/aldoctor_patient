import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';


@Injectable()
export class HelperProvider {

  public lang_direction ='rtl';
  public currentLang ='ar';
  public serviceUrl: string = "http://itrootsdemos.com/aldoctor/public/";
  public registration;
  public device_type="1";
  //if(platfrom==ios )
  //0 -> ios , 1-> android
  public notification;
  public accessToken;

  constructor(public toastCtrl: ToastController, public http: HttpClient) {
    console.log('Hello HelperProvider Provider');
  }
  
  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }

}
