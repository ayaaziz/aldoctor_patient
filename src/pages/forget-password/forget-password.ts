import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoginPage }from '../login/login';

@IonicPage({
  name:'forget-Pass'
})
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {

  disableBtn = false
  langDirection;
  activationForm;
  submitAttempt = false;
  phone;
  tostClass;
  accessToken;
  phoneErrMsg="";

  timer;
  time=60;
firstTime = true

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loginservice:LoginserviceProvider, public helper: HelperProvider,
    public translate: TranslateService,public formBuilder: FormBuilder,
    public toastCtrl: ToastController) {


    this.langDirection = this.helper.lang_direction;

    this.helper.view = "pop";
    
    this.translate.use(this.helper.currentLang);
    if(this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass="toastLeft";


    this.activationForm = formBuilder.group({
      phone: ['', Validators.compose([Validators.required,Validators.pattern("[0-9]{11}")])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));
  }
  dismiss(){
    this.navCtrl.pop();
  }

  login(){
    if(! this.activationForm.valid)
      this.submitAttempt=true;

      if(this.activationForm.controls["phone"].errors){
        if(this.activationForm.controls["phone"].errors['required'])
        {
          this.phoneErrMsg = this.translate.instant("enterPhone");
        }else if(this.activationForm.controls["phone"].errors['pattern']) {
          this.phoneErrMsg = this.translate.instant("phoneErr");
        }else{
          console.log("phone errors:",this.activationForm.controls["phone"].errors);
        }
      }
    // else{}
    // this.submitAttempt = true;
    if(this.activationForm.valid){
      if(navigator.onLine){

        this.disableBtn  = true

if (this.firstTime == true) {
  this.firstTime = false
  // this.disableBtn  = true

  this.time = 60;
  this.enableTimer();

  this.loginservice.UserForgetPasswordSendPhone('2' + this.phone, (data) => {
    if(data.success){
    this.presentToast("لقد تم إرسال كود التحقق بنجاح")
    // this.navCtrl.setRoot(LoginPage)
    let tel = "2" + this.phone
    this.navCtrl.push('verification-code', { data: 2, phone: tel })
    }
    else{
      this.presentToast("رقم الموبايل المستخدم غير موجود")
      this.disableBtn = false
      clearTimeout(this.timer);
            this.time = 0 
      
    }
  }, (data) => {
    this.presentToast(this.translate.instant("serverError"))

    // this.disableBtn = false
    this.disableBtn = false
    clearTimeout(this.timer);
            this.time = 0 
  })
 

}else{
console.log("time : ",this.time)
        if( this.time>0){
          this.presentToast("الرجاء الانتظار "+ this.time + " ثانية ")
          // this.disableBtn  = true

        }else if( this.time == 0){
          this.time = 60;

          // this.disableBtn  = true
          this.enableTimer();


        this.loginservice.UserForgetPasswordSendPhone('2' + this.phone, (data) => {
          if(data.success){
          this.presentToast("لقد تم إرسال كود التحقق بنجاح")
          // this.navCtrl.setRoot(LoginPage)
          let tel = "2" + this.phone
          this.navCtrl.push('verification-code', { data: 2, phone: tel })
          }
          else{
            this.presentToast("رقم الموبايل المستخدم غير موجود")
            // clearTimeout(this.timer);
            // this.time = 0 
    this.disableBtn = false
    clearTimeout(this.timer);
            this.time = 0 

          }
        }, (data) => {
          this.presentToast(this.translate.instant("serverError"))

          this.disableBtn = false
          clearTimeout(this.timer);
                  this.time = 0 

        })
        // this.loginservice.forgetPassword(this.phone).subscribe(
        //     resp=>{
        //       if(JSON.parse(JSON.stringify(resp)).success )
        //         this.navCtrl.setRoot(LoginPage);
        //       else
        //         this.presentToast(this.translate.instant("invalidPhone"));
                
        //       // if(JSON.parse(JSON.stringify(resp)).success )
        //       // {
        //       //   this.presentToast("لقد تم إرسال كود التحقق بنجاح")
          
        //       //   let tel = "2" + this.phone
        //       //   this.navCtrl.push('verification-code', { data:2,phone:this.phone})

        //       // }else
        //       //     this.presentToast("رقم الموبايل المستخدم غير موجود")
        //       },
        //     err=>{

        //     this.presentToast(this.translate.instant("serverError"))
        //     }
        // );




        // this.loginservice.UserForgetPasswordSendPhone('2' + this.phone, (data) => {
        //   if(data.success){
        //   this.presentToast("لقد تم إرسال كود التحقق بنجاح")
        //   // this.navCtrl.setRoot(LoginPage)
        //   let tel = "2" + this.phone
        //   this.navCtrl.push(CodepagePage, { changePhone: 2, phoneToChange: tel })
        //   }
        //   else{

        //   }
        // }, (data) => {
        //   this.presentToast(this.translate.instant("serverError"))
        // })

        
      }

       
    }


      }
      else{
        this.presentToast(this.translate.instant("serverError"))
      }
    }
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
  


enableTimer(){
  this.timer =setInterval(()=>{
    this.time--;
      if(this.time <= 0){
        console.log("timer off");
        this.disableBtn = false
        clearTimeout(this.timer);
      }
  },1000);
}

}
