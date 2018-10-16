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
  accessToken;

  constructor(public srv: ProvidedServicesProvider,public toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.ratedisabledbtn = false;
    this.tostClass = "toastRight";
    this.accessToken = localStorage.getItem('user_token');
    
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
    {
      this.ratedisabledbtn = true;
      this.srv.complains(this.moreReview,this.accessToken).subscribe(resp=>{
        console.log("resp from compalins",resp);
        if(JSON.parse(JSON.stringify(resp)).success == true)
        {
          this.presentToast("تم الارسال");
          this.ratedisabledbtn = false;
          this.navCtrl.pop();
        } 
      },err=>{
        console.log("err from compalins",err);
        this.presentToast("خطأ فى الاتصال");
        this.ratedisabledbtn = false;

      })
    }   
      
    
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
