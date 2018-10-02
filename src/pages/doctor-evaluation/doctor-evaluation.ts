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
  // rateWord=this.translate.instant("vbad");
  rateWord="";
  langDirection;
  doctorId;
  orderId;
  userId;
  accessToken;
  rateArray=[];
  tostClass ;
  rateWordsWithId=[];
  ratedisabledbtn = false;
  ratesIDS=[];


  constructor(public toastCtrl: ToastController,public service: LoginserviceProvider,public storage: Storage,
    public helper:HelperProvider,public translate: TranslateService,
    public navCtrl: NavController, public navParams: NavParams) {
      this.langDirection = this.helper.lang_direction;

      this.helper.view = "pop";
      
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.accessToken = localStorage.getItem('user_token');

      var notificationdata = this.navParams.get('data');
      if(notificationdata )
      {
        console.log("data",notificationdata);
        this.doctorId = notificationdata.doctorId;
        this.orderId = notificationdata.orderId;
        this.helper.removeOrder(this.orderId);

        this.storage.set("rate_doctor",{
          "doctorId":this.doctorId,
          "orderId":this.orderId,
          "date":new Date().toISOString().split('T')[0]
          
        }).then(
          thenResp=>{
          console.log("save rate doc",thenResp);
          }
        ).catch(
          catchResp=>{
            console.log("can't save rate doc",catchResp);
          }
        );

      }else{
        var notificationdata2 = this.navParams.get('data2');
        console.log("data2",notificationdata2);
        this.doctorId = notificationdata2.doctorId;
        this.orderId = notificationdata2.orderId;
        this.helper.removeOrder(this.orderId);
      }

      // this.storage.get("rate_doctor").then(data=>{
      //   if(data){
      //     this.doctorId = data.doctorId;
      //     this.orderId = data.orderId;
      //   }
      // });

      // this.storage.get("access_token").then(data=>{
      //   this.accessToken = data;
      
      this.accessToken = localStorage.getItem('user_token');

        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in doctor rate: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            // this.doctorName = tempData.name;
            if(tempData.nickname)
              this.doctorName = tempData.nickname;
            else 
              this.doctorName = tempData.name;


            //this.rate = tempData.rate;
            this.image = tempData.profile_pic;
            //this.doctorSpecialization = tempData.speciality; 
            //this.doctorLocation = tempData.location;

          },err=>{
            console.log("error from getserviceprofile in doctor rate:",err);
          }
  
        );
        
      // });
      this.storage.get("user_info").then(data=>{
        this.userId = data.id;
      });
  
      // this.storage.get("access_token").then(data=>{
      //   this.accessToken = data;
      
      this.accessToken = localStorage.getItem('user_token');

      this.service.rateWords(this.accessToken).subscribe(
        resp=>{
          console.log("rateWords resp ",resp);
          var reteWordsResp = JSON.parse(JSON.stringify(resp));
          console.log("length ",reteWordsResp.length,"...");
          console.log(reteWordsResp[0].translation.value);
          this.rateWordsWithId = [];
          this.rateWordsWithId=reteWordsResp;
            // this.rateWord = reteWordsResp[0].translation.value;
            // this.rateCommentsFromApi();    
          

        },err=>{
          console.log("ratewords err",err);
        }
      );
    // });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorEvaluationPage');
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));
  }

  rateWordsFromApi(rateIndex){
    this.service.rateWords(this.accessToken).subscribe(
      resp=>{
        console.log("rateWords resp ",resp);
        var reteWordsResp = JSON.parse(JSON.stringify(resp));
        console.log("length ",reteWordsResp.length);
        
        this.rateWordsWithId = [];
        this.rateWordsWithId=reteWordsResp;

          this.rateWord = reteWordsResp[rateIndex].translation.value;
        
        this.rateCommentsFromApi();

      },err=>{
        console.log("ratewords err",err);
      }
    );

  }
  rateCommentsFromApi(){
    this.rateArray=[];
    for(var h=0;h<this.rateWordsWithId.length;h++){
      if(this.rateWord == this.rateWordsWithId[h].translation.value)
      {

        this.service.reteWordsComments(this.rateWordsWithId[h].id,this.accessToken).subscribe(
          resp=>{
            console.log("comments from api",resp);
            console.log("res from rate ",resp);
            var rateCriteriea = JSON.parse(JSON.stringify(resp));
            console.log(rateCriteriea.length);
            //this.rateArray=[];
            for(var i=0;i<rateCriteriea.length;i++){
              this.rateArray.push({value:rateCriteriea[i].translation.value,status:0});
            }

          },err=>{
            console.log("comments err from api",err);
          }
        );

      }
    }
    
  }
  onModelChange(event){
    console.log("rate :",this.rate);
    if(this.rate == "5"){
      this.note=this.translate.instant("thanks");
      
      //this.rateWord=this.translate.instant("excellent");
      this.rateWordsFromApi(4);

/*
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
      );*/
    }else if(this.rate == "4"){
      //this.rateWord=this.translate.instant("good");
      this.rateWordsFromApi(3);

      this.note = this.translate.instant("notes");
  
  /*    this.service.rateCriteriea(4,this.accessToken).subscribe(
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
*/
    }else if(this.rate == "3"){
      //this.rateWord=this.translate.instant("fine");
      this.rateWordsFromApi(2);

      this.note = this.translate.instant("notes");
  /*    this.service.rateCriteriea(3,this.accessToken).subscribe(
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
*/
    }else if(this.rate == "2"){
      //this.rateWord=this.translate.instant("bad");
      this.rateWordsFromApi(1);
      this.note = this.translate.instant("notes");
/*
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
      );*/

    }else if(this.rate == "1"){
      //this.rateWord=this.translate.instant("vbad");
      this.rateWordsFromApi(0);

      this.note = this.translate.instant("notes");
      /*
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
*/

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
      this.ratesIDS.push(item.id);
    }else{
      event.target.classList.remove('selected');
      event.target.classList.add('unselected');
      item.status = 0;
      for(var g=0;g<this.ratesIDS.length;g++)
      {
        console.log("item removed : ",item.id);
        if(this.ratesIDS[g] == item.id)
          this.ratesIDS.splice(g, 1);
      }

    }
  }
  rateDoctor(){

    this.ratedisabledbtn = true;
    this.review += " ";
    this.review += this.moreReview;
    console.log("all review ",this.review);
    console.log("ratesIds",this.ratesIDS,"more review",this.moreReview);

    this.service.rateDoctor(this.doctorId,this.rate,this.moreReview,this.ratesIDS.join(","),this.userId,this.orderId,this.accessToken).subscribe(
      resp=>{
        this.ratedisabledbtn = false;
        console.log("resp from rate :",resp); 
        this.helper.orderRated = 1;
        this.presentToast(this.translate.instant("done"));
        this.navCtrl.setRoot(TabsPage);
        
      },err=>{
        this.ratedisabledbtn = false;
        console.log("err from rate: ",err);
        this.presentToast(this.translate.instant("serverError"))
      }
    );
    
    
  }
  dismiss(){
    // this.navCtrl.pop();
    this.navCtrl.pop();
    this.navCtrl.parent.select(0);
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
