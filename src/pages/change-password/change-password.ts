import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator,matchOtherValidator } from '../../validators/passwordValidator';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(public translate:TranslateService,public helper: HelperProvider,
    public toastCtrl: ToastController, public storage: Storage, 
    public service: LoginserviceProvider,public formBuilder: FormBuilder,
     public navCtrl: NavController, public navParams: NavParams) {
    this.langDirection = this.helper.lang_direction;
    this.translate.use(this.helper.currentLang);

    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

    this.resetForm = formBuilder.group({
      //usermail: ['', Validators.compose([Validators.required,Validators.email])],
      currentPass: ['', Validators.required],
      //newPass: ['', Validators.required],
      //confirmPassword: ['',matchOtherValidator('newPass')]
      newPass: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required, passwordValidator.isValid])],
      confirmPassword: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required, passwordValidator.isValid, matchOtherValidator('newPass')])],

    }); 
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
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.service.changePassword(this.currentPass,this.newPass,this.confirmTxt,this.accessToken).subscribe(
        resp => {
          
          console.log("cp resp: ",resp);
          this.navCtrl.setRoot(LoginPage);
        }
      );
    })
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
}
