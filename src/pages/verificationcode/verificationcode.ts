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
  tostClass ;

  constructor(public storage: Storage,public translate: TranslateService, 
    public loginservice:LoginserviceProvider,
    public toastCtrl: ToastController,public formBuilder: FormBuilder, public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
    
    this.langDirection = this.helper.lang_direction;

    if(this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass="toastLeft";


    this.activationForm = formBuilder.group({
      code: ['', Validators.required]
    });
    
    console.log("activation code lang dir :",this.langDirection);
    
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
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }
  activationSuccessCallback(data){
    console.log("activationSuccessCallback: ",data);
    if(JSON.parse(JSON.stringify(data)).success )
    {
      this.presentToast(this.translate.instant("phoneChanged"));
                
      this.loginservice.getuserProfile(this.accessToken).subscribe(
        resp=>{
          var newuserData = JSON.parse(JSON.stringify(resp));
          this.storage.set("user_info",{
            "id":newuserData.id,
            "name":newuserData.name,
            "email":newuserData.email,
            "phone":newuserData.phone,
            "dob":newuserData.user_info.birth_date,
            "add":newuserData.extraInfo.address,
            "profile_pic":newuserData.profile_pic
          }).then((data)=>{
            this.navCtrl.setRoot(TabsPage);
          },(error)=>{
          //  this.presentToast("set then error from signup: "+error)
          });
          
        },err=>{

        }
      );


      
    }else
      this.presentToast(this.translate.instant('wrongCode'));
  }
  failureSuccessCallback(data){
    console.log("failureSuccessCallback: ",data);
    this.presentToast(this.translate.instant("serverError"))
    
  }
  resendActivationCode(){
    this.loginservice.resendActivationCode(this.accessToken).subscribe(
      resp=>{
        console.log("resp from resend activation code",resp);
        this.presentToast(this.translate.instant("activationCodeTxt"));
      },
      err=>{
        console.log("err from resend activation code",err);
      }
    );

  }

}
