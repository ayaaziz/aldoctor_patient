import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController , ModalController } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';

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

  nursingStayperiod
  nursestayGender
  noOfHoursPerDay 
  noOfDaysPerMonth
  estimatedPriceForNursingStay


  woundCareGender
  noOfTimesPerDay
  noOfDaysPerWeek
  priceForWoundCare

  isNursingStayPriceCalculated:boolean = false;
  isWoundCarePriceCalculated:boolean = false;

  

  constructor(public service:ProvidedServicesProvider, public modalCtrl: ModalController,public toastCtrl: ToastController,public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams) {


    this.langDirection = this.helper.lang_direction;

    if(this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass="toastLeft";


    var recievedData = this.navParams.get('data');
    this.Service_id = recievedData.Service_id;
    this.pageTitle = recievedData.title

    console.log("extra : , "  , this.Service_id)
    // if (this.Service_id == -15){

    //   //nursing stay
    //   this.pageTitle = "إقامة تمريضية"
    
    
    // }else if (this.Service_id == -16){
    //   // wound care
    //   this.pageTitle = "العناية بالجروح لأكثر من مرة"


    // }

    console.log("Service_id from nursingStayAndWoundCare : ",this.Service_id)




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NursingStayAndWoundCarePage');

    this.isNursingStayPriceCalculated = false;
    this.isWoundCarePriceCalculated = false;
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
  
  customerService(){
    console.log("customerService")
    
    
      var modalPage = this.modalCtrl.create('ModalPage',{from:"customerService"});
      modalPage.present();
   
  
  }


  // noOfHoursPerDayonInput() {
  //   console.log("noOfHoursPerDayonInput")


  //   if(this.noOfHoursPerDay && this.noOfHoursPerDay > 24){
  //     this.presentToast("الرجاء إدخال عدد ساعات لا يتجاوز ٢٤ ساعة ")
  //     return
  //   }

  //   if (this.noOfDaysPerMonth && this.noOfDaysPerMonth > 31 ){
  //     this.presentToast("الرجاء إدخال عدد أيام فى الشهر لا يتجاوز ٣١ يوم ")
  //     return
  //   }


  //   if (this.Service_id == 1){
  //     //nursing stay

  //     if(this.noOfDaysPerMonth){



  //       if( this.noOfDaysPerMonth <= 5){
  //         this.estimatedPriceForNursingStay = this.noOfDaysPerMonth * this.noOfHoursPerDay * 25
  //       }else if( this.noOfDaysPerMonth > 5 && this.noOfDaysPerMonth <= 15){
  //        this.estimatedPriceForNursingStay =  this.noOfDaysPerMonth * 200
  //       }else if (this.noOfDaysPerMonth > 15){
  //         this.estimatedPriceForNursingStay =  this.noOfDaysPerMonth * 170
  //       }
  //     }
  //   }
  // }

  // noOfDaysPerMonthonInput() { 
  //   console.log("noOfDaysPerMonthonInput .......")

  //   if (this.Service_id == 1){
  //     //nursing stay

  //     if(this.noOfHoursPerDay && this.noOfHoursPerDay > 24){
  //       this.presentToast("الرجاء إدخال عدد ساعات لا يتجاوز ٢٤ ساعة ")
  //       return
  //     }
  

  //     if (this.noOfDaysPerMonth && this.noOfDaysPerMonth > 31 ){
  //       this.presentToast("الرجاء إدخال عدد أيام فى الشهر لا يتجاوز ٣١ يوم ")
  //       return
  //     }

  //     if(this.noOfHoursPerDay){
      

  //       if( this.noOfDaysPerMonth <= 5){
  //         this.estimatedPriceForNursingStay = this.noOfDaysPerMonth * this.noOfHoursPerDay * 25
  //       }else if( this.noOfDaysPerMonth > 5 && this.noOfDaysPerMonth <= 15){
  //        this.estimatedPriceForNursingStay =  this.noOfDaysPerMonth * 200
  //       }else if (this.noOfDaysPerMonth > 15){
  //         this.estimatedPriceForNursingStay =  this.noOfDaysPerMonth * 170
  //       }
  //     }
  //   }
  // }



  // noOfTimesPerDayonInput(){

  //   if (this.Service_id == 2 || this.Service_id == 3){
    

  //     if(this.noOfDaysPerWeek && this.noOfDaysPerWeek > 7){
  //       this.presentToast("الرجاء إدخال عدد أيام لا يتجاوز ٧ أيام ")
  //       return
  //     }
  


  //     if(this.noOfDaysPerWeek){
      
  //       this.priceForWoundCare = 100 + 70 * (this.noOfDaysPerWeek * this.noOfTimesPerDay -1)
 
  //     }
  //   }
  // }

  // noOfDaysPerWeekonInput(){

  //   if (this.Service_id == 2 || this.Service_id == 3){
     

  //     if(this.noOfDaysPerWeek && this.noOfDaysPerWeek > 7){
  //       this.presentToast("الرجاء إدخال عدد أيام لا يتجاوز ٧ أيام ")
  //       return
  //     }

      

  //     if(this.noOfTimesPerDay){
      

  //       this.priceForWoundCare = 100 + 70 * (this.noOfDaysPerWeek * this.noOfTimesPerDay -1)

  //     }
  //   }
  // }

  //ayaaaaaa
  //get calculted price from api
  calculePrice() {

    //nursing stay
    if (this.Service_id == 1) {

      if(! this.noOfHoursPerDay) {
        this.presentToast("الرجاء إدخال عدد الساعات فى اليوم");
        return;
      } else if(this.noOfHoursPerDay && this.noOfHoursPerDay > 24){
        this.presentToast("الرجاء إدخال عدد ساعات لا يتجاوز ٢٤ ساعة ");
        return;
      
      } else if (! this.noOfDaysPerMonth) {
        this.presentToast("الرجاء إدخال عدد الأيام  فى الشهر ");
        return;
      
      } else if (this.noOfDaysPerMonth && this.noOfDaysPerMonth > 31 ) {
        this.presentToast("الرجاء إدخال عدد أيام فى الشهر لا يتجاوز ٣١ يوم ");
        return;
      
      } else if (! this.nursingStayperiod) { 
        this.presentToast("الرجاء اختيار الفترة");
        return;
      
      } else if(! this.nursestayGender) {
        this.presentToast("الرجاء اختيار النوع");
        return;
      } 

    var accessToken = localStorage.getItem('user_token');
    this.service.calculateNursingTotalPrice(this.Service_id,this.noOfHoursPerDay,this.noOfDaysPerMonth,0,0,accessToken).subscribe(
      resp => {
        console.log("calculatedPrice: ",resp);
        let result = JSON.parse(JSON.stringify(resp));
        if(resp && result.success) {
          this.estimatedPriceForNursingStay = result.TotalPrice;
          this.isNursingStayPriceCalculated = true;
        }
      },err => {
        console.log("err calculatedPrice: : ",err);
      })
    } 
    //wound care
    else if (this.Service_id == 2 || this.Service_id == 3) {
      if(! this.noOfTimesPerDay) {
        this.presentToast("الرجاء إدخال عدد المرات فى اليوم");
        return;
      
      } else if (! this.noOfDaysPerWeek) {
        this.presentToast("الرجاء إدخال عدد الأيام فى الأسبوع");
        return;
      
      } else if(this.noOfDaysPerWeek && this.noOfDaysPerWeek > 7) {
        this.presentToast("الرجاء إدخال عدد أيام لا يتجاوز ٧ أيام");
        return;
      
      } else if(! this.woundCareGender) {
        this.presentToast("الرجاء اختيار النوع");
        return;
      }
    
      var accessToken = localStorage.getItem('user_token');
      this.service.calculateNursingTotalPrice(this.Service_id,0,0,this.noOfTimesPerDay,this.noOfDaysPerWeek,accessToken).subscribe(
        resp => {
          console.log("calculatedPrice: ",resp);
          let result = JSON.parse(JSON.stringify(resp));
          if(resp && result.success) {
            this.priceForWoundCare = result.TotalPrice;
            this.isWoundCarePriceCalculated = true;
          }
        },err => {
          console.log("err calculatedPrice: : ",err);
      })
    } 
  }


  //ayaaaaaaa
  sendOrder() {
      
    //nursing stay
    if (this.Service_id == 1) {

      if(! this.noOfHoursPerDay) {
        this.presentToast("الرجاء إدخال عدد الساعات فى اليوم");
        return;
      
      } else if(this.noOfHoursPerDay && this.noOfHoursPerDay > 24) {
        this.presentToast("الرجاء إدخال عدد ساعات لا يتجاوز ٢٤ ساعة");
        return;
      
      } else if (! this.noOfDaysPerMonth) {
        this.presentToast("الرجاء إدخال عدد الأيام  فى الشهر");
        return;
      
      } else if (this.noOfDaysPerMonth && this.noOfDaysPerMonth > 31 ) {
        this.presentToast("الرجاء إدخال عدد أيام فى الشهر لا يتجاوز ٣١ يوم");
        return;
      
      } else if (! this.nursingStayperiod) {
        this.presentToast("الرجاء اختيار الفترة");
        return;
      
      } else if(! this.nursestayGender) {
        this.presentToast("الرجاء اختيار النوع");
        return;
      } 

      var accessToken = localStorage.getItem('user_token');
      this.service.saveOrderForNursingServices(this.Service_id,this.noOfHoursPerDay,this.noOfDaysPerMonth,this.nursingStayperiod,this.nursestayGender,0,0,this.estimatedPriceForNursingStay,accessToken).subscribe(resp=>{
        console.log("resp from create order : ",resp)

        this.presentToast("شكرا لإرسال الطلب وسيتم التواصل معك لتنفيذ الخدمة");
        this.navCtrl.pop();

      },err=>{
        console.log("err from create order : ",err)
      })

    }
    //wound care
    else if (this.Service_id == 2 || this.Service_id == 3) {

      if(! this.noOfTimesPerDay) {
        this.presentToast("الرجاء إدخال عدد المرات فى اليوم");
        return;
      
      } else if (! this.noOfDaysPerWeek) {
        this.presentToast("الرجاء إدخال عدد الأيام فى الأسبوع");
        return;
      
      } else if(this.noOfDaysPerWeek && this.noOfDaysPerWeek > 7) {
        this.presentToast("الرجاء إدخال عدد أيام لا يتجاوز ٧ أيام");
        return;
      
      } else if(! this.woundCareGender) {
        this.presentToast("الرجاء اختيار النوع");
        return;
      } 

      var accessToken = localStorage.getItem('user_token');
      this.service.saveOrderForNursingServices(this.Service_id,0,0,0,this.woundCareGender,this.noOfTimesPerDay,this.noOfDaysPerWeek,this.priceForWoundCare,accessToken).subscribe(resp => {
        console.log("createOrder: ",resp);

        this.presentToast("شكرا لإرسال الطلب وسيتم التواصل معك لتنفيذ الخدمة");
        this.navCtrl.pop();

      },err => {
        console.log("err createOrder: ",err);
      })
    }

  }






  dismiss(){
    this.navCtrl.pop();
  }




  
}
