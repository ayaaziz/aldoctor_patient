import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController,App} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoginPage }from '../login/login';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/timeout';


@IonicPage({
  name:'change-phone'
})
@Component({
  selector: 'page-change-phone',
  templateUrl: 'change-phone.html',
})
export class ChangePhonePage {

  langDirection;
  activationForm;
  submitAttempt = false;
  phone;
  tostClass;
  accessToken;
  phoneErrMsg="";


  constructor(
    public loginservice:LoginserviceProvider, public helper: HelperProvider,
    public translate: TranslateService,public formBuilder: FormBuilder,
    public toastCtrl: ToastController,public storage: Storage,
    public navCtrl: NavController, public navParams: NavParams,
  public app:App) {

    this.accessToken = localStorage.getItem('user_token');
    
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
    console.log('ionViewDidLoad ChangePhonePage');
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
        this.storage.get("user_info").then((data) => {
        
        console.log("change phone from storage: ",data, "phone", this.phone);
        
        if('2'+this.phone == data.phone ) 
          this.presentToast(this.translate.instant("phoneAlreadyExist"));
        else
        {

        // this.storage.get("access_token").then(data=>{
        //   this.accessToken = data;
        this.accessToken = localStorage.getItem('user_token');

        this.loginservice.changePhoneNumber(this.phone,this.accessToken).timeout(10000).subscribe(
            resp=>{
              console.log("resp from changephone",resp);
              if(JSON.parse(JSON.stringify(resp)).success )
              {
                this.app.getRootNav().setRoot('verification-code',{data:1,phone:this.phone});
                // this.navCtrl.setRoot('verification-code',{data:1});
              
              }else
                this.presentToast(this.translate.instant("phoneAlreadyExist")); //invalid
            },
            err=>{
              console.log("err from changephone",err);
            this.presentToast(this.translate.instant("serverError"));
            }
        );
        
      // });

        }
      });


       

       
      }
      else{
        this.presentToast(this.translate.instant("checkNetwork"));
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
