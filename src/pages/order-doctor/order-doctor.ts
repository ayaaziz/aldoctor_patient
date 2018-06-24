import { Component } from '@angular/core';
import {ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';


@IonicPage(
  {
    name : 'order-doctor'
  }
)
@Component({
  selector: 'page-order-doctor',
  templateUrl: 'order-doctor.html',
})
export class OrderDoctorPage {
  accessToken;
  Specialization="";
  SpecializationArray=[];
  DoctorsArray = [];
  langDirection;

  
  first;
  second;
  third;
  fourth
  last;
  // DoctorsArray=[{"name":"ali","cost":"200","rate":"4","specialization":"specialization1","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
  // {"name":"mohamed","cost":"300","rate":"2.5","specialization":"specialization2","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
  // {"name":"ahmed","cost":"400","rate":"2","specialization":"specialization3","profile_pic":"assets/imgs/avatar-ts-jessie.png"}];



  cost:number=0;
  choosenDoctors=[];

  constructor(public helper:HelperProvider, public toastCtrl: ToastController, 
    public storage: Storage, 
    public service:LoginserviceProvider,public navCtrl: NavController, 
    public navParams: NavParams,  public translate: TranslateService) {

     
        this.langDirection = this.helper.lang_direction;
        this.translate.use(this.helper.currentLang);
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDoctorPage');
   
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.service.getSpecializations(this.accessToken).subscribe(
        resp=>{
          
          console.log("getSpecializations resp: ",resp);
          for(var i=0;i<JSON.parse(JSON.stringify(resp)).length;i++){
            console.log("sp: ",resp[i].value);
            this.Specialization=resp[0].value;
            // this.SpecializationArray.push(resp[i].value);
            this.SpecializationArray.push(resp[i]);
            this.SpecializationChecked();

          }
         

        },
        err=>{
          console.log("getSpecializations error: ",err);
        }
      );
    });

   
  
  }

  SpecializationChecked(){
    var id;
    console.log("all Specialization: ",this.SpecializationArray);
    console.log(this.Specialization);
    for(var i=0;i<this.SpecializationArray.length;i++){
      if(this.Specialization == this.SpecializationArray[i].value)
      {
        id = this.SpecializationArray[i].id;
        break;
      }
    }
    console.log("id: ",id);
    this.service.getDoctorInSpecificSpecialization(id,this.accessToken).subscribe(
      resp =>{
        console.log("getDoctorInSpecificSpecialization resp: ",resp);
        let doctorData =JSON.parse(JSON.stringify(resp));
        console.log(doctorData["results"].length);
        this.DoctorsArray=[];  
        for(var i=0;i<doctorData["results"].length;i++){
            console.log("doctor: ",doctorData["results"][i]);  
            this.DoctorsArray.push(doctorData["results"][i]);
          }
      },
      err=>{
        console.log("getDoctorInSpecificSpecialization error: ",err);
      }
    );
    
  }

  doctorChecked(item , event){
    if(item.checked == true)
      {
  //      this.cost += parseInt(item.cost);
        this.choosenDoctors.push(item);
      }
    else
      {
    //    this.cost -= parseInt(item.cost);
        for(var i=0;i<this.choosenDoctors.length;i++){
          if(item.name == this.choosenDoctors[i].name )
            this.choosenDoctors.splice(i,1);
        }
      }

  
  }
  sendOrder(){
    console.log("first: ",this.first);
    console.log("second: ",this.second);
    console.log("doctors: ",this.choosenDoctors);
    console.log("cost: ",this.cost);
    if(this.choosenDoctors.length > 3 )
    {
      this.presentToast(this.translate.instant("check3doctors"));
    }else if (this.choosenDoctors.length<1){
      this.presentToast(this.translate.instant("checkAtleastone"));
    }else{
      var doctorsId="";
      for(var j=0;j<this.choosenDoctors.length;j++)
      {
        doctorsId += this.choosenDoctors[j].id+",";
      }
      console.log("doctors id: ",doctorsId);
      this.service.saveOrder(doctorsId,this.accessToken).subscribe(
        resp => {
          console.log("saveOrder resp: ",resp);
          this.presentToast(this.translate.instant("ordersent"));
          this.navCtrl.pop();
        },
        err=>{
          console.log("saveOrder error: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );    
    }
    
  }

  showDoctorProfile(item){
    console.log("card item ",item);
    item.specialization = this.Specialization;
    console.log("item after add specialization: ",item);
    this.navCtrl.push('doctor-profile',{
      data:item
    });
  }

  validate(){
    console.log("validation") ;
    var code = this.first+this.second+this.third+this.fourth+this.last;
    this.service.validateDiscountCode(this.accessToken,code).subscribe(
      resp =>{
        console.log("resp from validateDiscountCode: ",resp);
      },
      err=>{
        console.log("err from validateDiscountCode: ",err);
      }
    );
  }
  dismiss(){
    this.navCtrl.pop();
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
