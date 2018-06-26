import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';




@IonicPage({
  name:'verification-code'
})
@Component({
  selector: 'page-verificationcode',
  templateUrl: 'verificationcode.html',
})
export class VerificationcodePage {
  activationForm;
  submitAttempt = false;
  code;
  langDirection;

  constructor(public storage: Storage,public translate: TranslateService, public loginservice:LoginserviceProvider,public toastCtrl: ToastController,public formBuilder: FormBuilder, public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.activationForm = formBuilder.group({
      code: ['', Validators.required]
    });
    this.langDirection = this.helper.lang_direction;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerificationcodePage');
  }
  accessToken;
  login(){
    // if(! this.activationForm.valid)
    //   this.submitAttempt=true;
    // else{}
    this.submitAttempt = true;
    if(this.activationForm.valid){
      if(navigator.onLine){
        this.storage.get("access_token").then(data=>{
          this.accessToken = data;
          
          this.loginservice.activateUser(this.code,this.accessToken,(data)=>this.activationSuccessCallback(data),(data)=>this.failureSuccessCallback(data));
        
        })

       // this.loginservice.activateUser(this.code,"",(data)=>this.activationSuccessCallback(data),(data)=>this.failureSuccessCallback(data))
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
      position: 'bottom'
    });
    toast.present();
  }
  activationSuccessCallback(data){
    console.log("activationSuccessCallback: ",data);
    this.navCtrl.setRoot(TabsPage);
  }
  failureSuccessCallback(data){
    console.log("failureSuccessCallback: ",data);
    this.presentToast(this.translate.instant("serverError"))
    
  }

}
