import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Platform, ToastController,Events,AlertController} from 'ionic-angular';
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
  access_token;
  message_id;

  hidePassword = true;
  pwdType = "password";
  iconName = "ios-eye-off";
  
  constructor(public alertCtrl:AlertController, public storage: Storage, public toastCtrl: ToastController,public loginservice:LoginserviceProvider, public translate: TranslateService,public helper: HelperProvider,
    public formBuilder: FormBuilder,public navCtrl: NavController, 
    public navParams: NavParams, public platform: Platform,
    public events: Events) {
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
   


    //ayaaaaaa 
    this.email = localStorage.getItem("userPhone");
    this.password = localStorage.getItem("userPwd");



    console.log("displayed userPhone: "+this.email);
    console.log("displayed userPwd: "+this.password);
     ////////////////
      
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
    
console.log("loginToApp")
    if(! this.loginForm.valid)
      this.submitAttempt=true;
    else{
      console.log("login else")
      this.loginservice.userLogin(this.email, this.password, "", (data) => this.loginSuccessCallback(data), (data) => this.loginFailureCallback(data))
    //this.navCtrl.setRoot(TabsPage);
    
      
    // if (navigator.onLine) {
      // this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));
      // this.authFailureCallback(()=>{})
    // }
    // else {
    //   this.presentToast(this.translate.instant("checkNetwork"))
    // }
  }
  }

  authSuccessCallback(data) {
    //localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
   
    // if (navigator.onLine) {
      this.loginservice.userLogin(this.email, this.password, data.access_token, (data) => this.loginSuccessCallback(data), (data) => this.loginFailureCallback(data))
    // }
    // else {
    //   this.presentToast(this.translate.instant("checkNetwork"))
    // }
   
  }
  authFailureCallback(data) {
    this.presentToast(this.translate.instant("cannotGetAccessToken"))
  }
  loginSuccessCallback(data) {
    console.log("from logincallback: ",JSON.stringify(data))
    this.events.publish("user:userLoginSucceeded")
    localStorage.setItem('user_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    console.log("accessToken from local storage",localStorage.getItem('user_token'));

    this.storage.set("language",{"lang":this.helper.currentLang,
    "langdir":this.helper.lang_direction} );
    // this.storage.set("lang-dir",this.helper.lang_direction);
    this.storage.set("access_token",data.access_token).then(val=>{
      console.log("saved access token in stoorage ",val);
    }).catch(err=>{console.log("err in saving access token",err);});
    this.storage.set("refresh_token",data.refresh_token);
    if(data.success == false    )
    {
      this.presentToast(this.translate.instant("invalidData"));
    }else{
      
      this.access_token = data.access_token;

    this.loginservice.registerFirebase(this.helper.registration,data.access_token).subscribe(
      resp=>{
        console.log("from registerFirebase resp: ",resp);
        var jsonUserData  = JSON.parse(JSON.stringify(resp)).user;
        console.log("json ",jsonUserData);
        
        // else if (jsonUserData.status == "-1")
        //   this.presentToast("الحساب غير مفعل");

        if (jsonUserData.status == "0")
          this.navCtrl.setRoot('verification-code',{data:0});
        else if (jsonUserData.status == "-1")
        {
          // this.loginservice.getContactMobile(this.access_token)
          // .timeout(10000).subscribe(
          //   resp=>{
          //     console.log("resp from contact us",resp);
          //     var mobile = JSON.parse(JSON.stringify(resp))[0].value;
          //     this.presentToast2("عذرا , تم إيقاف حسابك لتجاوزك  عدد المرات المسموح بها للإلغاء ... من فضلك تواصل مع خدمة العملاء "+mobile);    
              
          //   },err=>{
          //     console.log("err from contact us: ",err);
          //     this.presentToast(this.translate.instant("serverError"));
          //   }
          // );
          this.loginservice.getHelperTelephones("",this.access_token).timeout(10000).
          subscribe(
            resp=>{
              console.log("resp from getHelperTelephones from modal",resp);
              // this.helpersArr = JSON.parse(JSON.stringify(resp));
              var mobile = JSON.parse(JSON.stringify(resp))[0].value;
              this.presentToast2("عذرا , تم إيقاف حسابك لتجاوزك  عدد المرات المسموح بها للإلغاء ... من فضلك تواصل مع خدمة العملاء "+mobile+"+");    
          
        
            },
            err=>{
              console.log("err from contact us: ",err);
              this.presentToast(this.translate.instant("serverError"));
            });
     
  

        }

          
        else if(jsonUserData.status == "1")
        {

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
          this.events.publish('changeProfilePic',{pic:jsonUserData.profile_pic});



          //ayaaaaaa 
          localStorage.setItem("userPhone",this.email);
          localStorage.setItem("userPwd",this.password);

          console.log("userPhone: "+this.email);
          console.log("userPwd: "+this.password);
          ///////////

          this.navCtrl.setRoot(TabsPage);

          // this.storage.get("slider").catch(err=>{
          //   console.log("get slider err from login",err);
          // }).then(val=>{
          //   console.log("get slider val from login",val);
          //   if(val && val.showSlider && val.showSlider == "1")
          //     this.navCtrl.setRoot(TabsPage);
          //   else if(val && val.showSlider && val.showSlider != "1")
          //     this.navCtrl.push('slider');

          // });
          
          

        }).catch(data=>{
          console.log("catch data from login",data);
        });


        }
            
           
    
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

    // this.navCtrl.setRoot(TabsPage);
  }
  }
  loginFailureCallback(data) {
    this.presentToast(this.translate.instant("invalidData"));
 //   this.presentToast(this.translate.instant("serverError"))
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }


  private presentToast2(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 8000,
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
  ionViewDidEnter(){
    this.helper.view = "LoginPage"; 
  }

  changeTxt(){
    console.log("phone...",this.email);
    this.email = this.textArabicNumbersReplacment(this.email);
    console.log("phone after replacement: ",this.email); 
  
  }

  textArabicNumbersReplacment(strText) {
    // var strTextFiltered = strText.Trim().replace(" ", "");
   
    var strTextFiltered = strText.trim();
    strTextFiltered = strText;
    // //
    // // strTextFiltered = strTextFiltered.replace('ي', 'ى');
    // strTextFiltered = strTextFiltered.replace(/[\ي]/g, 'ى');
    // // strTextFiltered = strTextFiltered.replace('ئ', 'ى');
    // strTextFiltered = strTextFiltered.replace(/[\ئ]/g, 'ى');
    // //
    // // strTextFiltered = strTextFiltered.replace('أ', 'ا');
    // strTextFiltered = strTextFiltered.replace(/[\أ]/g, 'ا');
    // // strTextFiltered = strTextFiltered.replace('إ', 'ا');
    // strTextFiltered = strTextFiltered.replace(/[\إ]/g, 'ا');
    // // strTextFiltered = strTextFiltered.replace('آ', 'ا');
    // strTextFiltered = strTextFiltered.replace(/[\آ]/g, 'ا');
    // // strTextFiltered = strTextFiltered.replace('ء', 'ا');
    // strTextFiltered = strTextFiltered.replace(/[\ء]/g, 'ا');
    // //كاشيده
    // strTextFiltered = strTextFiltered.replace(/[\u0640]/g, '');
    // // التنوين  Unicode Position              
    // strTextFiltered = strTextFiltered.replace(/[\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652]/g, '');
    // // چ
    // strTextFiltered = strTextFiltered.replace(/[\u0686]/g, 'ج');
    // // ڤ
    // strTextFiltered = strTextFiltered.replace(/[\u06A4]/g, 'ف');
    // //                
    // // strTextFiltered = strTextFiltered.replace('ة', 'ه');
    // strTextFiltered = strTextFiltered.replace(/[\ة]/g, 'ه');
    // // strTextFiltered = strTextFiltered.replace('ؤ', 'و');
    // strTextFiltered = strTextFiltered.replace(/[\ؤ]/g, 'و');
    // //
    strTextFiltered = strTextFiltered.replace(/[\٩]/g, '9');
    strTextFiltered = strTextFiltered.replace(/[\٨]/g, '8');
    strTextFiltered = strTextFiltered.replace(/[\٧]/g, '7');
    strTextFiltered = strTextFiltered.replace(/[\٦]/g, '6');
    strTextFiltered = strTextFiltered.replace(/[\٥]/g, '5');
    strTextFiltered = strTextFiltered.replace(/[\٤]/g, '4');
    strTextFiltered = strTextFiltered.replace(/[\٣]/g, '3');
    strTextFiltered = strTextFiltered.replace(/[\٢]/g, '2');
    strTextFiltered = strTextFiltered.replace(/[\١]/g, '1');
    strTextFiltered = strTextFiltered.replace(/[\٠]/g, '0');
    //
    return strTextFiltered;
    //
  }
  

  nursersServices(){
  this.navCtrl.push('nursesServices');


  // this.navCtrl.push('nursingStayAndWoundCare',{data:{
  //   Service_id:-15
  // }});

  // let alert = this.alertCtrl.create({
  //   title: "العناية بالجروح",
  //   // message: this.translate.instant(""),
  //   inputs : [{type:'radio',
  //   label:"مرة واحدة",
  //   value:"1"},{type:'radio',
  //   label:"اكثر من مرة ",
  //   value:"2"}],
  //   buttons: [
  //     {
  //       text: this.translate.instant("canceltxt"),
  //       role: 'cancel',
  //       handler: (data) => {
  //         console.log('disagree clicked',data);
  //       }
  //     },
  //     {
  //       text: this.translate.instant("done"),
  //       handler: (catid) => {
  //         console.log('agree clicked',catid);
  
  
  
  
  
  //       }
  //     }
  //   ]
  // });
  // alert.present();
  

  
}


//ayaaaaaa
togglePwd() {
  if(this.hidePassword) {
    this.hidePassword = false;
    this.pwdType = "text";
    this.iconName = "ios-eye";
  } else {
    this.hidePassword = true;
    this.pwdType = "password";
    this.iconName = "ios-eye-off";        
  }  
}





}
