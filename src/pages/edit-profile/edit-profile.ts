import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Content,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';


@IonicPage({
  name:'edit-profile'
})
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  @ViewChild(Content) content: Content;

  signUpForm;
  firstname;
  secondname;
  surname;
  passwrodTxt;
  email;
  // phone;
  birthdate;
  patientRegisterForm;
  gender;
  city;
  country;
  submitAttempt = false;
  langDirection;
  cancelTxt;
  doneTxt;
  registerAttempt = false;
  profile_pic_ext = [];
  profileImg = "";
  address;
  termsStatus = false;
  termsError = false;
  patient;
  userData;
  countries=[];
  cities=[];
  regAccessToken;
  //phoneErrMsg="";
  tostClass;

  constructor(public toastCtrl: ToastController,
    public storage: Storage, public translate: TranslateService,
     public loginservice:LoginserviceProvider, public helper: HelperProvider, public formBuilder: FormBuilder , public navCtrl: NavController, public navParams: NavParams) {
    this.langDirection = this.helper.lang_direction;
    this.translate.use(this.helper.currentLang);
     
    if(this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass="toastLeft";

    this.patientRegisterForm = formBuilder.group({

      firstname: ['', Validators.required],
      secondname: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required,Validators.email])],
      // phone: ['', Validators.required],
    //  phone: ['', Validators.compose([Validators.required,Validators.pattern("[0-9]{11}")])],
      address: ['', Validators.required],
      //password: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required, passwordValidator.isValid])],
      //confirmpassword: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required, passwordValidator.isValid, matchOtherValidator('password')])],
      birthdate: ['', Validators.required],
      //gender: ['', Validators.required],
      city:['',Validators.required],
      country:['',Validators.required]
    
                  
    
    });
    
  }



  x;
y;
nameArr;
addArr;

  ionViewDidLoad() {
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));

    this.storage.ready().then(() => {
    
      // this.storage.get('data').then(data=>{
      //   this.presentToast('simple data from profile'+data);
      //   this.name=data;
      // });
      this.storage.get("user_info").then((data) => {
        console.log("profile from storage: ",data);
     
        this.nameArr = data.name.split(" ");
        this.firstname = this.nameArr[0];
        this.secondname = this.nameArr[1];
        this.surname = this.nameArr[2];
      //  this.phone = data.phone;
        this.birthdate = data.dob;
        this.addArr = data.add.split("-");

        // this.countries.push({name:this.addArr[2]});
        // this.cities.push({name:this.addArr[1]});
        
         console.log("add..",data.add);
        
        this.city = this.addArr[1];
        this.country = this.addArr[2];
        
        console.log("city: ",this.city,"country: ",this.country);

        this.address = this.addArr[0];
        this.email = data.email;
      //  this.countryChecked();
      });
  
  });
    console.log('ionViewDidLoad EditProfilePage');
    this.loginservice.getGovernerates().subscribe(
      resp => {
        this.x=JSON.stringify(resp);
        // console.log(this.x);
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
        console.log(error);
      }
    );
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
          }
          else{
            console.log(this.y[i].translation.value);
            this.cities.push(this.y[i].translation.value); 
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
      // this.cancelTxt = "Cancel";
      // this.doneTxt = "Done";
     
    
    }
    name;
    add;
    accessToken;
    userprofileData;
    editUser(){
      if(! this.patientRegisterForm.valid ){
      this.submitAttempt=true;

      this.content.scrollToTop(3000); 

      // if(this.patientRegisterForm.controls["phone"].errors){
      //   if(this.patientRegisterForm.controls["phone"].errors['required'])
      //   {
      //     this.phoneErrMsg = this.translate.instant("enterPhone");
      //   }else if(this.patientRegisterForm.controls["phone"].errors['pattern']) {
      //     this.phoneErrMsg = this.translate.instant("phoneErr");
      //   }else{
      //     console.log("phone errors:",this.patientRegisterForm.controls["phone"].errors);
      //   }
      // }
      }
    else{
      this.name = this.firstname +" "+this.secondname+" "+this.surname;
      this.add = this.address +"-"+this.city +"-"+this.country;
      this.storage.get("access_token").then(data=>{
        this.accessToken = data;
        this.loginservice.editUser(this.name,this.add,this.birthdate,this.email,this.accessToken).subscribe(
          resp =>{
            console.log("edit resp: ",resp);
            this.storage.ready().then(() => {
              console.log("storage");
              console.log("user data before edit",this.userprofileData); 
              this.storage.get("user_info").then((data) => {
                console.log("get info fro update: ",data);
                this.userprofileData = data;  
                console.log("user data between edit",this.userprofileData); 
                this.userprofileData.name=this.name;
                // this.userprofileData.phone=this.phone;
                this.userprofileData.dob=this.birthdate;
                this.userprofileData.add=this.add;
                this.userprofileData.email=this.email;

                
             console.log("user data after edit",this.userprofileData); 
             this.storage.set("user_info",this.userprofileData).then(
               resp=>{
                 console.log("data saved");
                 this.navCtrl.pop();
               }
             );
              });



          });
        },
          err =>{
            console.log("edit err: ", err);
          }
  
        );
      });
      
    }
  }
  dismiss(){
    this.navCtrl.pop();
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
