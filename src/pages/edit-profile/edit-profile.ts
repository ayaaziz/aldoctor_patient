import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Content,ToastController ,Events} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
//import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { emailValidator } from '../../validators/passwordValidator';


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
  secondname="";
  surname="";
  passwrodTxt;
  email = "";
  // phone;
  birthdate="";
  patientRegisterForm;
  gender;
  city  ="";
  country ="";
  submitAttempt = false;
  langDirection;
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
  //phoneErrMsg="";
  tostClass;
  emailErr="";

  maxDate ; 

  citiesObjects = [];


  constructor(public toastCtrl: ToastController,public events: Events,
    public storage: Storage, public translate: TranslateService,
     public loginservice:LoginserviceProvider, public helper: HelperProvider, public formBuilder: FormBuilder , public navCtrl: NavController, public navParams: NavParams) {
    this.langDirection = this.helper.lang_direction;
    this.translate.use(this.helper.currentLang);

     
    this.accessToken = localStorage.getItem('user_token');
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
      surname:['',''],
      //email: ['', Validators.compose([Validators.required,Validators.email])],
      //email: ['', Validators.compose([Validators.required,emailValidator.isValid])],
      // phone: ['', Validators.required],
    //  phone: ['', Validators.compose([Validators.required,Validators.pattern("[0-9]{11}")])],
      // address: ['', Validators.required],
      address: ['', ''],
      //password: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required, passwordValidator.isValid])],
      //confirmpassword: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(30), Validators.required, passwordValidator.isValid, matchOtherValidator('password')])],
      // birthdate: ['', Validators.required],
      birthdate: ['', ''],
      //gender: ['', Validators.required],
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
     
        // this.nameArr = data.name.split(" ");
        // this.firstname = this.nameArr[0];
        // if(this.nameArr[1])
        //   this.secondname = this.nameArr[1];
        // else
        // this.secondname = "";
          
        // if(this.nameArr[2])
        //   this.surname = this.nameArr[2];
        // else 
        //   this.surname ="";

if(data.name)
this.firstname = data.name;
else
this.firstname = "";
      //  this.phone = data.phone;
        if(data.dob)
          this.birthdate = data.dob;
        else
          this.birthdate = "";
        
          this.addArr = data.add.split("-");

        // this.countries.push({name:this.addArr[2]});
        // this.cities.push({name:this.addArr[1]});
        
         console.log("add..",data.add);
        
        //  debugger;

        this.country = this.addArr[2];
        // this.city = this.addArr[1];
        // this.cities.push(this.city);
      //  debugger; 
        console.log("city: ",this.city,"country: ",this.country);

        this.address = this.addArr[0];
        // this.email = data.email;
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


     // //ayaaaaaaaaaaaa
     this.loginservice.getCities("").subscribe(
      resp => {
        console.log("resp cities: ",resp);
        this.x=JSON.stringify(resp);
        //this.presentToast(this.x);
        this.y =JSON.parse(this.x);
        for(var i=0;i<this.y.length;i++)
        { 
          console.log("regiooooooon: "+this.y[i].region);
          // this.cities.push(this.y[i].region); 
          this.cities.push(this.y[i].region); 
          this.citiesObjects.push(this.y[i]); 
          console.log("citiesObjects: "+JSON.stringify(this.y[i]));

        }
      },
      error => {
        console.log(error);
      }
    )
    this.city = this.helper.registeredCityId;

    // ////////////
  }

  countryChecked(){
    this.cities=[];
    console.log("country: ",this.country, "city ",this.city);
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
      // this.name = this.firstname +" "+this.secondname+" "+this.surname;
      this.name = this.firstname ;
      

      //ayaaaaa
      let city = this.citiesObjects.find(el => {
        return el.id == this.city;
      });

      let cityName = city.region;

      if(this.address) {
        this.add = this.address +"-"+cityName;    
      } else {
        this.add = cityName;
      }
      ///////
      
      this.accessToken = localStorage.getItem('user_token');




        this.loginservice.editUser(this.name,this.add,this.birthdate,this.email,this.city,this.accessToken).subscribe(
          resp =>{
            console.log("edit resp: ",resp);
            this.presentToast("تم تعديل البيانات");
            

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
                // this.userprofileData.email=this.email;
                console.log("this.name",this.name,"this.userprofileData.name",this.userprofileData.name);


                //ayaaaaaa
                this.helper.selectedCityId = this.city;
                this.helper.registeredCityId = this.city;
                //////
                
             console.log("user data after edit",this.userprofileData); 
             this.storage.set("user_info",this.userprofileData).then(
               resp=>{
                 console.log("data saved");
                 this.events.publish('changeProfilePic',{pic:this.userprofileData.profile_pic});
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
      // });
      
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
