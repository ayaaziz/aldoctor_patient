import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';

@IonicPage({
  name:'rate-service'
})
@Component({
  selector: 'page-rate-service',
  templateUrl: 'rate-service.html',
})
export class RateServicePage {

  review="";
  moreReview= "";
  reviewArray = [];
  doctorName;
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
  
  type_id = "";

  ratedisabledbtn = false;
  ratesIDS=[];
  hideText = true;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,public service: LoginserviceProvider,
    public storage: Storage, public srv: ProvidedServicesProvider,
    public helper:HelperProvider,public translate: TranslateService) {

      this.accessToken = localStorage.getItem('user_token');
      this.helper.view = "pop";

      this.langDirection = this.helper.lang_direction;
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

        console.log("thus.type",this.helper.type_id);
      this.type_id = this.helper.type_id;
      
      
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


      // this.storage.get("access_token").then(data=>{
      //   this.accessToken = data;
      // this.accessToken = localStorage.getItem('user_token');
      

      // this.srv.updateOrderStatus(this.orderId,this.accessToken,this.type_id).subscribe(
      //   resp=>{
      //     console.log("resp updateOrderStatus",resp);
      //     this.helper.dontSendNotification = false;
      //     // this.helper.dontSendNotification  = false;
      //   },err=>{
      //     console.log("err updateOrderStatus",err);
      //     // this.helper.dontSendNotification  = false;
      //   }
      // );
      


        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in doctor rate: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            // this.doctorName = tempData.name;
            if(tempData.nickname)
              this.doctorName = tempData.nickname;
            else 
              this.doctorName = tempData.name;

            this.image = tempData.profile_pic;

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

      this.srv.rateWords( this.type_id , this.accessToken).subscribe(
        resp=>{
          console.log("rateWords resp ",resp);
          var reteWordsResp = JSON.parse(JSON.stringify(resp));
          console.log("length ",reteWordsResp.length,"...");
          console.log(reteWordsResp[0].value); //translation.value
          this.rateWordsWithId = [];
          this.rateWordsWithId=reteWordsResp;
            // this.rateWord = reteWordsResp[0].value;//translation.value
            // this.rateCommentsFromApi();    
          

        },err=>{
          console.log("ratewords err",err);
        }
      );
    // });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RateServicePage');
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));
  }

  rateWordsFromApi(rateIndex){
    this.srv.rateWords(this.type_id,this.accessToken).subscribe(
      resp=>{
        console.log("rateWords resp ",resp);
        var reteWordsResp = JSON.parse(JSON.stringify(resp));
        console.log("length ",reteWordsResp.length);
        
        this.rateWordsWithId = [];
        this.rateWordsWithId=reteWordsResp;

          this.rateWord = reteWordsResp[rateIndex].value;//translation.value
        
        this.rateCommentsFromApi();

      },err=>{
        console.log("ratewords err",err);
      }
    );

  }
  rateCommentsFromApi(){
    this.rateArray=[];
    for(var h=0;h<this.rateWordsWithId.length;h++){
      if(this.rateWord == this.rateWordsWithId[h].value)//translation.value
      {

        this.srv.reteWordsComments(this.rateWordsWithId[h].id,this.type_id,this.accessToken).subscribe(
          resp=>{
            console.log("comments from api",resp);
            console.log("res from rate ",resp);
            var rateCriteriea = JSON.parse(JSON.stringify(resp));
            console.log(rateCriteriea.length);
            
            for(var i=0;i<rateCriteriea.length;i++){
              this.rateArray.push({value:rateCriteriea[i].value,id:rateCriteriea[i].id,status:0}); //translation.value
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
      this.rateWordsFromApi(4);
    }else if(this.rate == "4"){
      this.rateWordsFromApi(3);
      this.note = this.translate.instant("notes");
    }else if(this.rate == "3"){
      this.rateWordsFromApi(2);
      this.note = this.translate.instant("notes");
    }else if(this.rate == "2"){
      this.rateWordsFromApi(1);
      this.note = this.translate.instant("notes");
    }else if(this.rate == "1"){
      this.rateWordsFromApi(0);
      this.note = this.translate.instant("notes");
    }
    this.hideText = false;
   

  }
  rateClicked(event,item){
    console.log("event ",event);
    console.log(event.target.innerText  );
    this.review += " ";
    this.review += event.target.innerText;

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
    if(this.rate){

    this.ratedisabledbtn = true;
    this.review += " ";
    this.review += this.moreReview;
    console.log("all review ",this.review);
    console.log("ratesIds",this.ratesIDS,"more review",this.moreReview);

    this.accessToken = localStorage.getItem('user_token');

    this.service.rateDoctor(this.doctorId,this.rate,this.moreReview,this.ratesIDS.join(","),this.userId,this.orderId,this.accessToken).subscribe(
      resp=>{
        console.log("resp from rate :",resp); 
        this.ratedisabledbtn = false;
        this.helper.orderRated = 1;
        this.presentToast(this.translate.instant("done"));
        console.log("this.helper.dontSendNotification from rate: ",this.helper.dontSendNotification);
        // if(this.helper.dontSendNotification == false)
        // {
        //   this.srv.updateOrderStatus(this.orderId,this.accessToken,this.type_id).subscribe(
        //     resp=>{
        //       console.log("resp updateOrderStatus",resp);
        //       this.helper.dontSendNotification = false;
        //       // this.helper.dontSendNotification  = false;
        //     },err=>{
        //       console.log("err updateOrderStatus",err);
        //       // this.helper.dontSendNotification  = false;
        //     }
        //   );
          
        // }
        

        this.navCtrl.setRoot(TabsPage);
        
      },err=>{
        console.log("err from rate: ",err);
        this.ratedisabledbtn = false;
        this.presentToast(this.translate.instant("serverError"));
        
      }
    );
    
  }else{
    this.presentToast("اختر تقييم للخدمه");
  }
  
  }
  dismiss(){
    // this.navCtrl.pop();
    this.navCtrl.setRoot(TabsPage);
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
