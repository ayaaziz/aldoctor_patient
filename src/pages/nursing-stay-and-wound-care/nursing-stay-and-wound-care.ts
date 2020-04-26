import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';

@IonicPage({
  name:'nursingStayAndWoundCare'
})

@Component({
  selector: 'page-nursing-stay-and-wound-care',
  templateUrl: 'nursing-stay-and-wound-care.html',
})
export class NursingStayAndWoundCarePage {

  tostClass 
  langDirection
  Service_id
  pageTitle

  noOfHoursPerDay 
  noOfDaysPerMonth
  estimatedPriceForNursingStay


  noOfTimesPerDay
  noOfDaysPerWeek
  priceForWoundCare
  

  constructor(public toastCtrl: ToastController,public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams) {


    this.langDirection = this.helper.lang_direction;

    if(this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass="toastLeft";


    var recievedData = this.navParams.get('data');
    this.Service_id = recievedData.Service_id;

    if (this.Service_id == -15){

      //nursing stay
      this.pageTitle = "إقامة تمريضية"
    
    
    }else if (this.Service_id == -16){
      // wound care
      this.pageTitle = "العناية بالجروح لأكثر من مرة"


    }

    console.log("Service_id from nursingStayAndWoundCare : ",this.Service_id)




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NursingStayAndWoundCarePage');
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

  sendOrder(){

    if (this.Service_id == -15){
      //nursing stay

      if( this.noOfDaysPerMonth <= 5){
        this.estimatedPriceForNursingStay = this.noOfDaysPerMonth * this.noOfHoursPerDay * 25
      }else if( this.noOfDaysPerMonth > 5 && this.noOfDaysPerMonth <= 15){
       this.estimatedPriceForNursingStay =  this.noOfDaysPerMonth * 200
      }else if (this.noOfDaysPerMonth > 15){
        this.estimatedPriceForNursingStay =  this.noOfDaysPerMonth * 170
      }
      
      //sendOrderToapi
      this.presentToast("شكرا لإرسال الطلب وسيتم التواصل معك لتنفيذ الخدمة ")
      this.navCtrl.pop()


    }
    else if (this.Service_id == -16){
      //wound care

      this.priceForWoundCare = 100 + 70 * (this.noOfDaysPerWeek * this.noOfTimesPerDay -1)


       //sendOrderToapi
       this.presentToast("شكرا لإرسال الطلب وسيتم التواصل معك لتنفيذ الخدمة ")
       this.navCtrl.pop()



    }

  }
}
