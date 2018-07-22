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

  langDirection;
  activationForm;
  submitAttempt = false;
  phone;
  tostClass;
  accessToken;
  phoneErrMsg="";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loginservice:LoginserviceProvider, public helper: HelperProvider,
    public translate: TranslateService,public formBuilder: FormBuilder,
    public toastCtrl: ToastController) {


    this.langDirection = this.helper.lang_direction;
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
        this.loginservice.forgetPassword(this.phone).subscribe(
            resp=>{
              if(JSON.parse(JSON.stringify(resp)).success )
                this.navCtrl.setRoot(LoginPage);
              else
                this.presentToast(this.translate.instant("invalidPhone"));
            },
            err=>{

            this.presentToast(this.translate.instant("serverError"))
            }
        );
        
       

       
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
  

}
