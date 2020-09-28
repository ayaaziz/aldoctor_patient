import { Component,ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

import { Platform, IonicPage, NavController, NavParams, ToastController, ActionSheetController ,AlertController,Events} from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { passwordValidator, matchOtherValidator,emailValidator } from '../../validators/passwordValidator';
import { LoginPage } from '../login/login';
import { PatientData } from '../../models/patientData';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TabsPage } from '../tabs/tabs';

import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

//import { ImagePicker } from '@ionic-native/image-picker';
//import { Base64 } from '@ionic-native/base64';




@IonicPage({
  "name":"register"
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  @ViewChild(Content) content: Content;

  signUpForm;
  firstname;
  secondname="";
  surname="";
  passwrodTxt;
  email="";
  phone;
  birthdate="";
  patientRegisterForm;
  gender;
  city="";
  country="";
  submitAttempt = false;
  langDirection: string = 'rtl';
  cancelTxt;
  doneTxt;
  registerAttempt = false;
  profile_pic_ext = [];
  profileImg = "";
  address="";
  termsStatus = false;
  termsError = false;
  patient;
  userData;
  countries=[];
  cities=[];
  regAccessToken;

  passErrMsg="";
  phoneErrMsg="";
  emailErr="";

  imgPreview = 'assets/imgs/default-avatar.png';
  regData = { avatar:'', email: '', password: '', fullname: '' };
  
  tostClass;
  xxx;
  citiesObjects=[];
  cityId="";

  maxDate ; 
  cityZonesArray = [];

  constructor(private platform: Platform,public alerCtrl: AlertController,
     //private imagePicker: ImagePicker,private base64: Base64,
    public camera: Camera,public events: Events,
    public actionSheetCtrl: ActionSheetController, public storage: Storage,public loginservice:LoginserviceProvider, public toastCtrl: ToastController, public translate: TranslateService,public helper: HelperProvider, public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder) {
    this.langDirection = this.helper.lang_direction;
    this.helper.view = "pop";

    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

    this.patientRegisterForm = formBuilder.group({

      firstname: ['', Validators.required],
      // secondname: ['', Validators.required],
      // surname: ['', Validators.required],
      secondname: ['', ''],
      surname: ['', ''],
      //email: ['', Validators.compose([Validators.required,Validators.email])],
      // email:[],
       //email:['',Validators.email],
      //email: ['', Validators.compose([Validators.required,emailValidator.isValid])],
      //phone: ['', Validators.required],
      phone: ['', Validators.compose([Validators.required,Validators.pattern("[0-9]{11}")])],
      // address: ['', Validators.required],
      address: ['', ''],
      password: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(30), Validators.required])],//, passwordValidator.isValid,8
      confirmpassword: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(30), Validators.required, matchOtherValidator('password')])],//passwordValidator.isValid
      birthdate: ['', ''],
      // birthdate: ['', Validators.required],
      gender: ['', Validators.required],

      city:['',Validators.required],
      // country:['',Validators.required]
      // city:['',''],
      country:['','']
    
                  
    
    });
   
    this.maxDate  = new Date().toISOString().split('T')[0];
    console.log("this.maxDate",this.maxDate);
  }
x;
y;

  ionViewDidLoad() {
    var resp,error;
    //this.presentToast('ionViewDidLoad SignupPage');
     this.loginservice.getGovernerates()
    .subscribe(
      resp => {
        console.log("resp: ",resp);
        this.x=JSON.stringify(resp);
        //this.presentToast(this.x);
        this.y =JSON.parse(this.x);
        for(var i=0;i<this.y.length;i++)
        {
          if (this.helper.currentLang == 'en') {
            console.log(this.y[i].value);
            this.countries.push({"name":this.y[i].value,"id":this.y[i].id});
          }else{
            console.log(this.y[i].translation.value);
            this.countries.push({"name":this.y[i].translation.value,"id":this.y[i].id});
 
          }
        }
     
      },
      error => {
        console.log("country: ",error);
        //this.presentToast("err: "+JSON.stringify(error));
      }
    );


    // //ayaaaaaaaaaaaa
    this.loginservice.getCities("").subscribe(
      resp => {
        console.log("resp cities: ",resp);
        this.x=JSON.stringify(resp);
        this.y =JSON.parse(this.x);

        for(var i = 0; i < this.y.length; i++) { 
          console.log("regiooooooon: "+this.y[i].region);
          this.cities.push(this.y[i].region); 
          this.citiesObjects.push(this.y[i]); 
          console.log("citiesObjects: "+JSON.stringify(this.y[i]));

        }
     
      },
      error => {
        console.log(error);
      }
    )
    // ////////////
  }

  countryChecked(){
    this.cities=[];
    console.log("country: ",this.country);
    for(var i=0;i<this.countries.length;i++)
    {
      if(this.countries[i].name == this.country)
      {
        this.loginservice.getCities(this.countries[i].id).subscribe(
          resp =>{
            console.log("cities: ",resp);
            this.x=JSON.stringify(resp);
        // console.log(this.x);
        this.y =JSON.parse(this.x);
        for(var i=0;i<this.y.length;i++)
        {
          if (this.helper.currentLang == 'en') {
          console.log(this.y[i].value);
          this.cities.push(this.y[i].value);
          this.citiesObjects.push(this.y[i]);
          }
          else{
            console.log(this.y[i].translation.value);
            this.cities.push(this.y[i].translation.value); 
            this.citiesObjects.push(this.y[i]);
          }
        }
          }
        );
        break;
      }
    }
    

    }
  ionViewWillEnter() {
    this.cancelTxt = this.translate.instant("canceltxt");
    this.doneTxt = this.translate.instant("doneTxt");
    // this.getSpecializationsData()
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

  registerUser(){
    //this.presentToast("");
    if(! this.patientRegisterForm.valid ){
      this.submitAttempt=true;
      
      // var elements= document.getElementsByClassName("errors") as HTMLCollectionOf<HTMLElement>;;
      // // let classes: DOMTokenList = elements[0].classList;: NodeListOf<Element>
      // // console.log("classes: ",classes);
      // console.log("elements: ",elements);
      // var wrappedResult = angular.element(elements);
      // console.log("elements: ",elements.item(0));
      // console.log("elements: ",elements[0]);

      this.content.scrollToTop(3000);
      


      if(this.patientRegisterForm.controls["password"].errors){
      if(this.patientRegisterForm.controls["password"].errors['required'])
      {
        this.passErrMsg = this.translate.instant("enterPassword");
      }else if (this.patientRegisterForm.controls["password"].errors['minlength']){
        this.passErrMsg = this.translate.instant("passErr");
      }else if (this.patientRegisterForm.controls["password"].errors['invalidChars']){
        this.passErrMsg = this.translate.instant("passContainChars");
      }
      else{
        console.log("passErrors:",this.patientRegisterForm.controls["password"].errors);
      }
    }
      console.log(this.patientRegisterForm.controls["phone"].errors);

      if(this.patientRegisterForm.controls["phone"].errors){
      if(this.patientRegisterForm.controls["phone"].errors['required'])
      {
        this.phoneErrMsg = this.translate.instant("enterPhone");
      }else if(this.patientRegisterForm.controls["phone"].errors['pattern']) {
        this.phoneErrMsg = this.translate.instant("phoneErr");
      }else{
        console.log("phone errors:",this.patientRegisterForm.controls["phone"].errors);
      }
    }
// console.log("email err",this.patientRegisterForm.controls["email"].errors);
    
// if(this.patientRegisterForm.controls["email"].errors){
//   if(this.patientRegisterForm.controls["email"].errors['required'])
//   {
//     this.emailErr = this.translate.instant("enterEmail");
//   }else if(this.patientRegisterForm.controls["email"].errors['invalidChars']) {
//     this.emailErr = this.translate.instant("invalidEmailAddress");
//   }else{
//     console.log("phone errors:",this.patientRegisterForm.controls["email"].errors);
//   }
// }




}
    else{

      if(this.termsStatus == false){
        this.presentToast(this.translate.instant('checkAgreement'))
      }
      if(this.termsStatus){
        // this.presentToast(this.translate.instant("register"));
        this.presentToast(" تسجيل البيانات وإنشاء الحساب");
     console.log(this.getFormData());
     //this.navCtrl.setRoot(LoginPage);

     this.loginservice.getAccessToken((data) => this.authSuccessCallback(data), (data) => this.authFailureCallback(data));
      
    }
  }
   console.log("form : ", this.patientRegisterForm.valid);
    
  }


  getFormData(){
      this.patient = new PatientData();
      this.patient.firstname=this.patientRegisterForm.controls.firstname.value;
      this.patient.secondname=this.patientRegisterForm.controls.secondname.value;
      this.patient.surname=this.patientRegisterForm.controls.surname.value;
      this.patient.phone=this.patientRegisterForm.controls.phone.value;
      this.patient.address=this.patientRegisterForm.controls.address.value;
      this.patient.password=this.patientRegisterForm.controls.password.value;
      this.patient.birthdate=this.patientRegisterForm.controls.birthdate.value;
      // this.patient.city=this.patientRegisterForm.controls.city.value;

      //aya
      this.patient.city_id=this.patientRegisterForm.controls.city.value;

      this.patient.country=this.patientRegisterForm.controls.country.value;
      this.patient.gender=this.patientRegisterForm.controls.gender.value;
      this.patient.terms=this.termsStatus;   
     //this.patient.email=this.patientRegisterForm.controls.email.value;
     this.patient.email="";
    //  this.patient.email = this.email;
      this.patient.img=this.profileImg;
      console.log(this.patient);
      //this.presentToast("patient data from get data: "+JSON.stringify(this.patient));
      
      console.log("this.citiesObjects",this.citiesObjects);
      console.log("this.city",this.city);

      // this.patient.city_id="";

      // // for(var i=0;i<this.citiesObjects.length;i++)
      // // {
      // //   console.log("this.citiesObjects[i].translation.name",this.citiesObjects[i].translation.name);
      // //   if(this.citiesObjects[i].translation.value == this.city)
      // //     this.patient.city_id = this.citiesObjects[i].id;
        
      // // }

      //ayaaaaaaaa
      let cityObj = this.citiesObjects.find(el => {
       return el.id == this.patient.city_id;
      });

      console.log("cityObj: "+JSON.stringify(cityObj));

      this.patient.city = cityObj.region;

      this.helper.selectedUserCity = this.patient.city;
      this.helper.selectedCityId = this.patient.city_id;
      
      console.log("selectedCityId from signup:",this.patient.city_id);
      console.log("selectedUserCity from signup: ",this.patient.city);
    
     
      /////////////

      return this.patient;
  }


  authSuccessCallback(data) {
   // localStorage.setItem('adftrmee', data.access_token)
    //this.mainService.categoriesService( this.helper.DeviceId, (data) => this.categoriesSuccessCallback(data), (data) => this.categoriesFailureCallback(data));
    //this.presentToast("get access token from auth callback");
    this.regAccessToken=data.access_token;
    if (navigator.onLine) {
     console.log("authSuccess")
     this.userData=this.getFormData();
     console.log("data sent to register: ",this.userData);
     // this.loginservice.userRegister(this.userData,data.access_token,(data)=>this.successCallback(data),(data)=>this.failureCallback(data))
      
      this.loginservice.userRegister(this.userData,data.access_token,(data)=>this.loginSuccess(data),(data)=>this.failureCallback(data))
    }
    else {
      this.presentToast(this.translate.instant("serverError"))
    }
   
  }
  authFailureCallback(data) {
    this.presentToast(this.translate.instant("cannotGetAccessToken"))
  }
  successCallback(data){
    console.log("data from success callback: ", data);
    // this.presentToast("register successcallback data"+data.user.profile_pic);
    // console.log("user info:",data);
    // console.log("id: ",data.user.id);
    // console.log("name: ",data.user.name);
    // //console.log("profile_pic:",data.user.profile_pic);
    // console.log("phone: ",data.user.phone);
    // console.log("dob: ",data.user.user_info.birth_date);
    // console.log("add: ",data.user.extraInfo.address+"-"+this.city+"-"+this.country);
  //  data.forEach(element => {
     
  //  });
  //   this.presentToast("image from api: "+data.user.profile_pic);
    // this.storage.set('data',data.user.name);

    this.storage.ready().then(() => {
      //this.presentToast("set then from signup");
    this.storage.set("user_info",{
      "id":data.user.id,
      "name":data.user.name,
      // "email":data.user.email,
      "phone":data.user.phone,
      "dob":data.user.user_info.birth_date,
      "add":data.user.extraInfo.address+"-"+this.city+"-"+this.country,
      "profile_pic":data.user.profile_pic
    }).then((data)=>{
      //this.presentToast("set then data from signup: "+data)
    },
            (error)=>{
              //this.presentToast("set then error from signup: "+error)
            });

  });

    //this.presentToast("data saved on storage");
    // this.storage.get("user_info").then((val) => {
    //   console.log('from stroage', val);
    // });
    //this.presentToast("before login");
    this.loginservice.userLogin(this.userData.email,this.userData.password,this.regAccessToken,(data)=>this.loginSuccess(data),(data)=>this.loginFailure(data));
    
    
  }
  failureCallback(data){
    this.presentToast(this.translate.instant("serverError"))
  }
  loginSuccess(data){
    //this.presentToast("login success callback");
    console.log("loginsuccess data: ",data);
    
     if (JSON.parse(JSON.stringify(data)).success == false){
      var errorsFromApi = JSON.parse(JSON.stringify(data)).errors;
      // if(errorsFromApi.email)
      // {
      //   this.presentToast(errorsFromApi.email);
      // }
      if(errorsFromApi.phone)
      {
        this.presentToast(errorsFromApi.phone);
      }
    }
    else{
    // else if(JSON.parse(JSON.stringify(data))){ //.success

      console.log("access token: ",data.access_token);
      //this.presentToast("token: "+data.access_token);
      console.log("refresh token: ",data.refresh_token);
      
      localStorage.setItem('user_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      
      this.storage.set("language",{"lang":this.helper.currentLang,
      "langdir":this.helper.lang_direction} );

      this.storage.set("access_token",data.access_token);


      this.storage.set("refresh_token",data.refresh_token);
      this.storage.set("verification_page",1);
      

      this.loginservice.registerFirebase(this.helper.registration,data.access_token).subscribe(
        resp=>{
          console.log("from registerFirebase resp: ",resp);
          var jsonUserData  = JSON.parse(JSON.stringify(resp)).user;
          console.log("json ",jsonUserData);
          
          this.storage.set("user_info",{
                  "id":jsonUserData.id,
                  "name":jsonUserData.name,
                  // "email":jsonUserData.email,
                  "phone":jsonUserData.phone,
                  "dob":jsonUserData.user_info.birth_date,
                  "add":jsonUserData.extraInfo.address,
                  "profile_pic":jsonUserData.profile_pic
                }).then(data=>{
                  console.log("set data to storage from signup ",data);


                  //ayaaaaaa
                  localStorage.setItem("userPhone",this.patient.phone);
                  localStorage.setItem("userPwd",this.patient.password);

                  console.log("userPhone: "+this.patient.phone);
                  console.log("userPwd: "+this.patient.password);
                  ///////////

                  // this.navCtrl.setRoot(TabsPage);
                  this.events.publish('changeProfilePic',{pic:jsonUserData.profile_pic});
                  this.navCtrl.setRoot('verification-code',{data:0});
                }).catch(data=>{
                  console.log("catch data from login",data);
                });
                   
  
          // this.events.publish('changeProfilePic',{pic:jsonUserData.profile_pic});

        },
        err=>{
          
            console.log("from registerFirebase err: ",err);
              
         
        }
      );
      
      // this.navCtrl.setRoot(TabsPage);
      
      //this.navCtrl.setRoot('verification-code',{data:0});
    }
   
  }
  loginFailure(data){
    this.presentToast("login failure call back");
    console.log("loginFailure: ",data);
  }

  /*getPhoto(){
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          this.imgPreview = results[i];
          this.base64.encodeFile(results[i]).then((base64File: string) => {
            //this.regData.avatar = base64File;
            this.profileImg = base64File;
            let userImage = this.profileImg.split(',')[1];
            this.profileImg = userImage.replace(/\+/g,",");
        //    this.presentToast("image: "+this.profileImg);
          }, (err) => {
            console.log(err);
          });
      }
    }, (err) => { });
  
  }*/

  presentActionSheet() { 
    
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant("SelectImageSource"),
      buttons: [
        {
          text: this.translate.instant("LoadfromLibrary"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
   //         this.getPhoto();
          }
        },
        {
          text: this.translate.instant("UseCamera"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        // {
        //   text: this.translate.instant("cancelTxt"),
        //   role: 'cancel'
        // }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      targetWidth: 600,
      targetHeight: 600,
      quality: 80, //20,40
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
 
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //this.presentToast("load image");
      this.profileImg = 'data:image/jpeg;base64,' + imageData;
      this.imgPreview = 'data:image/jpeg;base64,' + imageData;
      // let userImage = this.profileImg.split(',')[1];
      // this.profileImg = userImage.replace(/\+/g,",");
// this.xxx = imageData;

      let userImage = encodeURIComponent(imageData);
      this.profileImg = userImage;

      //this.presentToast(this.profileImg);
    }, (err) => {
      // Handle error
     });
  }
  dismiss(){
    this.navCtrl.pop();
  }
  agreeConditions(){
    console.log("agree conditions");
    this.navCtrl.push('conditions');
  }
  
  presentHintAlert() {
    let alert = this.alerCtrl.create({
      title: this.translate.instant("passHintTitle"),
      message:  this.translate.instant("passHintMsg"),
      buttons: [ this.translate.instant("passHintBtn")]
    });
    alert.present()
  }

  changeTxt(){
    console.log("phone...",this.phone);
    this.phone = this.textArabicNumbersReplacment(this.phone);
    console.log("phone after replacement: ",this.phone); 
  
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
  

}

