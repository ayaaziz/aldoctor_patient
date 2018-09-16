import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import 'rxjs/add/operator/timeout';

import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';
import { HomePage } from '../home/home';


@IonicPage({
  name:'cancel-service'
})
@Component({
  selector: 'page-cancel-service',
  templateUrl: 'cancel-service.html',
})
export class CancelServicePage {

  reasons=[];
  userReasons = [] ;
  orderId;
  accessToken;
  desc = "";
  langDirection;
  tostClass ;
  CancelBtn =true;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage,public helper:HelperProvider, 
    public srv : ProvidedServicesProvider,
    public service:LoginserviceProvider,public translate: TranslateService,
    public toastCtrl: ToastController) {

      this.orderId =  this.navParams.get('orderId');
      this.langDirection = this.helper.lang_direction;
      this.helper.view = "";
      this.helper.view = "pop";

      this.accessToken = localStorage.getItem('user_token');
      
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";
      
      this.translate.use(this.helper.currentLang);
      console.log("orderId from cancel order: ",this.orderId);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelServicePage');
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    this.accessToken = localStorage.getItem('user_token');
    
      if (navigator.onLine) {
      this.srv.cancelreasons(this.helper.type_id, this.accessToken).timeout(10000).subscribe(
        resp=>{

          console.log("resp from cancelreasons: ", resp);
          var cancelationReasons = JSON.parse(JSON.stringify(resp));
          console.log("l = ",cancelationReasons.length);
          
          for(var i=0;i<cancelationReasons.length;i++){
            console.log("reasons ",cancelationReasons[i]);
            this.reasons.push(cancelationReasons[i]);
          }
          
        },err=>{
          console.log("error from cancelreasons: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }

      );  
    }else{
      this.presentToast(this.translate.instant("checkNetwork"));
    } 
   
   
    // });

  }
reasonChecked(item , event){
    if(item.checked == true)
      {
        console.log("reason checked ",item);
        this.userReasons.push(item.id);
        if(this.userReasons.length == 0 )
          this.CancelBtn = true;
        else
          this.CancelBtn = false;
      }
    else
      {
        console.log("reason unchecked ",item);
        for(var i=0;i<this.userReasons.length;i++){
          if(item.id == this.userReasons[i] )
            this.userReasons.splice(i,1);
        }
        
        if( this.userReasons.length == 0 )
          this.CancelBtn = true;
        else
          this.CancelBtn = false;

      }

  
  }
  cancelOrder(){
    console.log("user reasons",this.userReasons.join());
    console.log("desc: ",this.desc);
    console.log("order id from cancle: ",this.orderId);
    if (navigator.onLine) {
      this.service.cancelorder(this.orderId,this.userReasons.join(),this.desc,this.accessToken).timeout(10000).subscribe(
        resp => {
          console.log("cancel order resp: ",resp);
          if(JSON.parse(JSON.stringify(resp)).success)
          {
            this.helper.view = "";
            // this.helper.updateCancelOrderStatus(this.orderId);
            this.presentToast(this.translate.instant("orderCancled"));     
            // this.navCtrl.setRoot(OrderhistoryPage);
            this.navCtrl.pop();
            this.navCtrl.setRoot(HomePage);
            this.navCtrl.parent.select(1);

          }
        },
        err=>{
          console.log("cancel order err: ", err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
    }else{
      this.presentToast(this.translate.instant("checkNetwork"));
    }
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

    dismiss(){
      this.navCtrl.pop();
    }

    notesevent(){
      console.log("desc....",this.desc);
      // if(this.desc && this.userReasons.length == 0)
      // this.CancelBtn = false;
      // else
      // this.CancelBtn = true;
    }

}
