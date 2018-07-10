import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
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
  moreReview= "";
  reviewArray = [];
  doctorName;
  //"assets/imgs/avatar-ts-jessie.png"
  image;
  rate;
  note=this.translate.instant("notes");
  rateWord=this.translate.instant("vbad");
  langDirection;
  doctorId;
  orderId;
  userId;
  accessToken;
  rateArray=[];
  constructor(public toastCtrl: ToastController,public service: LoginserviceProvider,public storage: Storage,
    public helper:HelperProvider,public translate: TranslateService,
    public navCtrl: NavController, public navParams: NavParams) {
      this.langDirection = this.helper.lang_direction;

      var notificationdata = this.navParams.get('data');
      this.doctorId = notificationdata.doctorId;
      this.orderId = notificationdata.orderId;

      this.storage.get("access_token").then(data=>{
        this.accessToken = data;
        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in doctor rate: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            this.doctorName = tempData.name;
            //this.rate = tempData.rate;
            this.image = tempData.profile_pic;
            //this.doctorSpecialization = tempData.speciality; 
            //this.doctorLocation = tempData.location;

          },err=>{
            console.log("error from getserviceprofile in doctor rate:",err);
          }
  
        );
      });
      this.storage.get("user_info").then(data=>{
        this.userId = data.id;
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
      this.service.rateCriteriea(5,this.accessToken).subscribe(
        resp=>{
          console.log("res from rate ",resp);
          var rateCriteriea = JSON.parse(JSON.stringify(resp));
          console.log(rateCriteriea.length);
          this.rateArray=[];
          for(var i=0;i<rateCriteriea.length;i++){
            this.rateArray.push({value:rateCriteriea[i].value,status:0});
          }
        },
        err=>{
          console.log("err from rate ",err);
        }
      );
    }else if(this.rate == "4"){
      this.rateWord=this.translate.instant("good");
      this.note = this.translate.instant("notes");
      this.service.rateCriteriea(4,this.accessToken).subscribe(
        resp=>{
          console.log("res from rate ",resp);
          var rateCriteriea = JSON.parse(JSON.stringify(resp));
          console.log(rateCriteriea.length);
          this.rateArray=[];
          for(var i=0;i<rateCriteriea.length;i++){
            // this.rateArray.push(rateCriteriea[i].value);
            this.rateArray.push({value:rateCriteriea[i].value,status:0});
          }
        },
        err=>{
          console.log("err from rate ",err);
        }
      );

    }else if(this.rate == "3"){
      this.rateWord=this.translate.instant("fine");
      this.note = this.translate.instant("notes");
      this.service.rateCriteriea(3,this.accessToken).subscribe(
        resp=>{
          console.log("res from rate ",resp);
          var rateCriteriea = JSON.parse(JSON.stringify(resp));
          console.log(rateCriteriea.length);
          this.rateArray=[];
          for(var i=0;i<rateCriteriea.length;i++){
            this.rateArray.push({value:rateCriteriea[i].value,status:0});
          }
        },
        err=>{
          console.log("err from rate ",err);
        }
      );

    }else if(this.rate == "2"){
      this.rateWord=this.translate.instant("bad");
      this.note = this.translate.instant("notes");
      this.service.rateCriteriea(2,this.accessToken).subscribe(
        resp=>{
          console.log("res from rate ",resp);
          var rateCriteriea = JSON.parse(JSON.stringify(resp));
          console.log(rateCriteriea.length);
          this.rateArray=[];
          for(var i=0;i<rateCriteriea.length;i++){
            this.rateArray.push({value:rateCriteriea[i].value,status:0});
          }
        },
        err=>{
          console.log("err from rate ",err);
        }
      );

    }else if(this.rate == "1"){
      this.rateWord=this.translate.instant("vbad");
      this.note = this.translate.instant("notes");
      this.service.rateCriteriea(1,this.accessToken).subscribe(
        resp=>{
          console.log("res from rate ",resp);
          var rateCriteriea = JSON.parse(JSON.stringify(resp));
          console.log(rateCriteriea.length);
          this.rateArray=[];
          for(var i=0;i<rateCriteriea.length;i++){
            this.rateArray.push({value:rateCriteriea[i].value,status:0});
          }
        },
        err=>{
          console.log("err from rate ",err);
        }
      );

    }
   

  }
  rateClicked(event,item){
    console.log("event ",event);
    console.log(event.target.innerText  );
    this.review += " ";
    this.review += event.target.innerText;
    // this.reviewArray.push(event.target.innerText);
    if(item.status == "0")
    {
      event.target.classList.remove('unselected');
      event.target.classList.add('selected');
      item.status = 1 ;
    }else{
      event.target.classList.remove('selected');
      event.target.classList.add('unselected');
      item.status = 0;
    }
  }
  rateDoctor(){
    
    this.review += " ";
    this.review += this.moreReview;
    console.log("all review ",this.review);
    this.service.rateDoctor(this.doctorId,this.rate,this.review,this.userId,this.orderId,this.accessToken).subscribe(
      resp=>{
        console.log("resp from rate :",resp); 
        this.presentToast(this.translate.instant("done"));
        this.navCtrl.push(TabsPage);
        
      },err=>{
        console.log("err from rate: ",err);
        this.presentToast(this.translate.instant("serverError"))
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
