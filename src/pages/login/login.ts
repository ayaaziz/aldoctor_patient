import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Platform, ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm;
  usernameTxt;
  langDirection: string;
  usernameLocal: string;
  passwordLocal:string;
  submitAttempt=false;
  email;
  password;
  tostClass ;
  
  constructor( public storage: Storage, public toastCtrl: ToastController,public loginservice:LoginserviceProvider, public translate: TranslateService,public helper: HelperProvider,
    public formBuilder: FormBuilder,public navCtrl: NavController, 
    public navParams: NavParams, public platform: Platform) {
      this.langDirection = this.helper.lang_direction;
      
      
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";
    this.loginForm = formBuilder.group({
      //username: ['', Validators.required],
      password: ['', Validators.required],
      //email: ['', Validators.compose([Validators.required,Validators.email])],
      email: ['', Validators.required]
    });
   
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));
   
  }

  
  changelang() {
    
   
    if (this.helper.currentLang == 'ar') {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.helper.currentLang = 'en';
      this.helper.lang_direction = 'ltr';
      this.langDirection = "ltr";
      this.usernameLocal = this.translate.instant("Username")
      this.passwordLocal = this.translate.instant("Password")
      this.platform.setDir('ltr',true)

    }
    else {
      this.translate.use('ar');
      this.helper.currentLang = 'ar';
      this.translate.setDefaultLang('ar');
      this.helper.lang_direction = 'rtl';
      this.langDirection = "rtl";
      this.usernameLocal = this.translate.instant("Username")
      this.passwordLocal = this.translate.instant("Password")
      this.platform.setDir('rtl',true)
    }
  }

  loginToApp() {
    

    if(! this.loginForm.valid)
      this.submitAttempt=true;
    else{
    //this.navCtrl.setRoot(TabsPage);
    
      
    if (navigator.onLine) {
      this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));
     
    }
    else {
      this.presentToast(this.translate.instant("checkNetwork"))
    }
  }
  }

  authSuccessCallback(data) {
    //localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
    if (navigator.onLine) {
      this.loginservice.userLogin(this.email, this.password, data.access_token, (data) => this.loginSuccessCallback(data), (data) => this.loginFailureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("checkNetwork"))
    }
   
  }
  authFailureCallback(data) {
    this.presentToast(this.translate.instant("cannotGetAccessToken"))
  }
  loginSuccessCallback(data) {
    console.log("from logincallback: ",JSON.stringify(data))
    this.storage.set("language",{"lang":this.helper.currentLang,
    "langdir":this.helper.lang_direction} );
    // this.storage.set("lang-dir",this.helper.lang_direction);
    this.storage.set("access_token",data.access_token);
    this.storage.set("refresh_token",data.refresh_token);
    this.loginservice.registerFirebase(this.helper.registration,data.access_token).subscribe(
      resp=>{
        console.log("from registerFirebase resp: ",resp);
        var jsonUserData  = JSON.parse(JSON.stringify(resp)).user;
        console.log("json ",jsonUserData);
        
        this.storage.set("user_info",{
                "id":jsonUserData.id,
                "name":jsonUserData.name,
                "email":jsonUserData.email,
                "phone":jsonUserData.phone,
                "dob":jsonUserData.user_info.birth_date,
                "add":jsonUserData.extraInfo.address,
                "profile_pic":jsonUserData.profile_pic
              }).then(data=>{
                console.log("set data to storage from login ",data);
                this.navCtrl.setRoot(TabsPage);
              }).catch(data=>{
                console.log("catch data from login",data);
              });
                 

      },
      err=>{
        
          console.log("from registerFirebase err: ",err);
            
       
      }
    );
    // this.loginservice.getuserProfile(data.accessToken).subscribe(
    //   resp=>{
    //     // this.navCtrl.setRoot(TabsPage);
    //     var newuserData = JSON.parse(JSON.stringify(resp));
    //     this.storage.set("user_info",{
    //       "id":newuserData.id,
    //       "name":newuserData.name,
    //       "email":newuserData.email,
    //       "phone":newuserData.phone,
    //       "dob":newuserData.user_info.birth_date,
    //       "add":newuserData.extraInfo.address,
    //       "profile_pic":newuserData.profile_pic
    //     }).then((data)=>{
    //       //this.presentToast("set then data from signup: "+data)
    //     },(error)=>{
    //     //  this.presentToast("set then error from signup: "+error)
    //     });
    //     this.navCtrl.setRoot(TabsPage);

    //   },err=>{

    //   }
    // );

    this.navCtrl.setRoot(TabsPage);
    
  }
  loginFailureCallback(data) {
    this.presentToast(this.translate.instant("serverError"))
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

  register(){
    //this.navCtrl.setRoot(SignupPage);
    //this.navCtrl.setRoot('register');
    this.navCtrl.push('register');
  }
  forgetPass(){
    this.navCtrl.push('forget-Pass');
  }
}
