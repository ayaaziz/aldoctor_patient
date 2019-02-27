import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController,App} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator,matchOtherValidator } from '../../validators/passwordValidator';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';

import 'rxjs/add/operator/timeout';

@IonicPage(
  {
    name:'change-password'
  }
)
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  tostClass ;
  resetForm;
resetLoader;
submitAttempt = false;
usermailTxt;
currentPass;
newPass;
confirmTxt;
accessToken;
langDirection;
passErrMsg="";
validPass=false;

  constructor(public translate:TranslateService,public helper: HelperProvider,
    public toastCtrl: ToastController, public storage: Storage, 
    public service: LoginserviceProvider,public formBuilder: FormBuilder,
     public navCtrl: NavController, public navParams: NavParams,
    public app : App) {
    this.langDirection = this.helper.lang_direction;
    this.translate.use(this.helper.currentLang);

    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";
      
    this.accessToken = localStorage.getItem('user_token');
    this.helper.view = "pop";

    this.resetForm = formBuilder.group({
      //usermail: ['', Validators.compose([Validators.required,Validators.email])],
      currentPass: ['', Validators.required],
      //newPass: ['', Validators.required],
      //confirmPassword: ['',matchOtherValidator('newPass')]
      newPass: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(30), Validators.required])],//, passwordValidator.isValid ,8
      confirmPassword: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(30), Validators.required , matchOtherValidator('newPass')])],//, passwordValidator.isValid

    }); 
  
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    // });
    this.accessToken = localStorage.getItem('user_token');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePassword(){
    if(! this.resetForm.valid )
    {
      this.submitAttempt=true;
      if(this.resetForm.controls["newPass"].errors){
        if(this.resetForm.controls["newPass"].errors['required'])
        {
          this.passErrMsg = this.translate.instant("enterPassword");
        }else if (this.resetForm.controls["newPass"].errors['minlength']){
          this.passErrMsg = this.translate.instant("passErr");
        }else if (this.resetForm.controls["newPass"].errors['invalidChars']){
          this.passErrMsg = this.translate.instant("passContainChars");
        }
        else{
          console.log("passErrors:",this.resetForm.controls["newPass"].errors);
        }
      }

    }
  else{

    if(this.validPass == true)
    {
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    this.accessToken = localStorage.getItem('user_token');

    if (navigator.onLine) {
      if(this.currentPass == this.newPass)
      {
        this.presentToast("كلمة المرور الحالية والجديدة متشابهين");
      }else{

        this.service.changePassword(this.currentPass,this.newPass,this.confirmTxt,this.accessToken).timeout(10000).subscribe(
          resp => {
            
            console.log("cp resp: ",resp);
            // this.navCtrl.setRoot(LoginPage);
            this.app.getRootNav().setRoot(LoginPage);
            
          },
          err=>{
            this.presentToast(this.translate.instant("serverError"));
          }
        );

      }

      
    }else{
      this.presentToast(this.translate.instant("checkNetwork"));
    }
    // })
  }else{
    this.presentToast("يجب ألا تقل كلمة المرور الجديدة عن اربعة حروف أو أرقام");
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
  dismiss(){
    this.navCtrl.pop();
  }
  checkPass(){
    console.log("check pass ",this.currentPass);
    this.service.checkUserPass(this.currentPass,this.accessToken).subscribe(
      resp=>{
        console.log("resp from check pass",resp);
        if(JSON.parse(JSON.stringify(resp)).success == false)
        {
          this.presentToast(this.translate.instant("passNotCorrect"));
          this.validPass = false;
        }else{
          this.validPass = true;
        }
        
      },
      err=>{
        console.log("err from check pass",err);
      }
    );
  }
}
