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
  from;
  codeErrMsg;
phone="";

  constructor(public storage: Storage,public translate: TranslateService, 
    public loginservice:LoginserviceProvider,
    public toastCtrl: ToastController,public formBuilder: FormBuilder, public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
    
    this.langDirection = this.helper.lang_direction;

    if(this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass="toastLeft";

      if(this.navParams.get('data')){
        this.from = this.navParams.get('data');
        console.log("activation from ",this.from);
      }
      if(this.navParams.get('phone')){
        this.phone = this.navParams.get('phone');
        console.log("from activation phone",this.phone);
      }

    this.activationForm = formBuilder.group({
      // code: ['', Validators.required]
      code: ['', Validators.compose([Validators.required,Validators.pattern("[0-9]{5}")])]
    });
    
    console.log("activation code lang dir :",this.langDirection);

    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    // });
    this.accessToken = localStorage.getItem('user_token');

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerificationcodePage');
  }
  accessToken;
  login(){
    // if(! this.activationForm.valid)
    //   this.submitAttempt=true;
    // else{}
    // '/[٠١٢٣٤٥٦٧٨٩]/g'

    console.log("code:", this.code);
    // this.code.replace('١',1);
    console.log("code 2: ",this.code); 

    this.submitAttempt = true;
    if( !this.activationForm.valid){

      if(this.activationForm.controls["code"].errors){
        if(this.activationForm.controls["code"].errors['required'])
        {
          this.codeErrMsg = this.translate.instant("enterCode");
        }else if(this.activationForm.controls["code"].errors['pattern']) {
          this.codeErrMsg = this.translate.instant("codeErr");
        }else{
          console.log("phone errors:",this.activationForm.controls["code"].errors);
        }
      }
    }
    if(this.activationForm.valid){
      if(navigator.onLine){
        // this.storage.get("access_token").then(data=>{
        //   this.accessToken = data;
        this.accessToken = localStorage.getItem('user_token');
        
          if(this.from)
          {
            this.loginservice.checkPhoneWithCode(this.phone,this.code,this.accessToken).subscribe(
              resp=>{
                console.log("check phne with code",resp);

                console.log("in success true",JSON.parse(JSON.stringify(resp)).success);
                if(JSON.parse(JSON.stringify(resp)).success == true)
                {
                  console.log("in success true");
                  this.storage.remove("verification_page");
            
                  if(this.from)
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
            
            
                  
                }else if (JSON.parse(JSON.stringify(resp)).success == false){
                  console.log("resp false",resp);
                 if(JSON.parse(JSON.stringify(resp)).found == 0)
                  this.presentToast(this.translate.instant('wrongCode'));
                  else if (JSON.parse(JSON.stringify(resp)).found == 1)
                  this.presentToast(this.translate.instant("phoneAlreadyExist"));


                }
                  

              },
              err=>{

              }
            );
          }else
          this.loginservice.activateUser(this.code,this.accessToken,(data)=>this.activationSuccessCallback(data),(data)=>this.failureSuccessCallback(data));
        
        // })

       // this.loginservice.activateUser(this.code,"",(data)=>this.activationSuccessCallback(data),(data)=>this.failureSuccessCallback(data))
      }
      else{
        this.presentToast(this.translate.instant("checkNetwork"))
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
      this.storage.remove("verification_page");

      if(this.from)
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
    
    if(this.from)
    {
      this.phone = '2'+this.phone;
      this.loginservice.resendActivationCode(this.phone,this.accessToken).subscribe(
        resp=>{
          console.log("resp from resend activation code",resp);
          if(JSON.parse(JSON.stringify(resp)).success)
            this.presentToast(this.translate.instant("activationCodeTxt"));
          else
          this.presentToast(this.translate.instant("serverError"));
        },
        err=>{
          console.log("err from resend activation code",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );

    }
else{
  this.loginservice.resendActivationCode(this.phone,this.accessToken).subscribe(
    resp=>{
      console.log("resp from resend activation code",resp);
      if(JSON.parse(JSON.stringify(resp)).success)
        this.presentToast(this.translate.instant("activationCodeTxt"));
      else
      this.presentToast(this.translate.instant("serverError"));
    },
    err=>{
      console.log("err from resend activation code",err);
      this.presentToast(this.translate.instant("serverError"));
    }
  );

}
  
  }

}
