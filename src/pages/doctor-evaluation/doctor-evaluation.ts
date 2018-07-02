import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';


@IonicPage({
  name:'rate-doctor'
})
@Component({
  selector: 'page-doctor-evaluation',
  templateUrl: 'doctor-evaluation.html',
})
export class DoctorEvaluationPage {

  review="";
  doctorName;
  //"assets/imgs/avatar-ts-jessie.png"
  image;
  rate;
  note=this.translate.instant("notes");;
  rateWord=this.translate.instant("vbad");
  langDirection;
  doctorId;
  accessToken;

  constructor(public service: LoginserviceProvider,public storage: Storage,
    public helper:HelperProvider,public translate: TranslateService,
    public navCtrl: NavController, public navParams: NavParams) {
      this.langDirection = this.helper.lang_direction;

      this.doctorId = this.navParams.get('id');
      this.storage.get("access_token").then(data=>{
        this.accessToken = data;
        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in doctor rate: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            this.doctorName = tempData.name;
            this.rate = tempData.rate;
            this.image = tempData.profile_pic;
            //this.doctorSpecialization = tempData.speciality; 
            //this.doctorLocation = tempData.location;

          },err=>{
            console.log("error from getserviceprofile in doctor rate:",err);
          }
  
        );
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorEvaluationPage');
  }
  onModelChange(event){
    console.log("rate :",this.rate);
    if(this.rate == "5"){
      this.note=this.translate.instant("thanks");
      this.rateWord=this.translate.instant("excellent");
    }else if(this.rate == "4"){
      this.rateWord=this.translate.instant("good");
      this.note = this.translate.instant("notes");

    }else if(this.rate == "3"){
      this.rateWord=this.translate.instant("fine");
      this.note = this.translate.instant("notes");

    }else if(this.rate == "2"){
      this.rateWord=this.translate.instant("bad");
      this.note = this.translate.instant("notes");

    }else if(this.rate == "1"){
      this.rateWord=this.translate.instant("vbad");
      this.note = this.translate.instant("notes");

    }
   

  }
  rateClicked(event){
    console.log(event.target.innerText  );
    this.review += " ";
    this.review += event.target.innerText;
  }
  rateDoctor(){
    
    this.navCtrl.push(TabsPage);
    
  }
  dismiss(){
    this.navCtrl.pop();
  }

}
