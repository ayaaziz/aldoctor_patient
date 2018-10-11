import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';

@IonicPage({
  name:"Complaints"
})
@Component({
  selector: 'page-complaints',
  templateUrl: 'complaints.html',
})
export class ComplaintsPage {
  ratedisabledbtn ;
  moreReview;
  tostClass;

  constructor(public srv: ProvidedServicesProvider,public toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.ratedisabledbtn = false;
    this.tostClass = "toastRight";
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintsPage');
    this.ratedisabledbtn = false;
    this.tostClass = "toastRight";
    
  }

  send(){
    console.log("moreREview",this.moreReview);
    if(!this.moreReview)
      this.presentToast("ادخل رسالتك");
    else    
      this.ratedisabledbtn = true;
    
  }
  dismiss(){
    this.navCtrl.pop();
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }

}
