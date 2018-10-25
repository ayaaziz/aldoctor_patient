import { Component } from '@angular/core';
import {ToastController, IonicPage, NavController, NavParams , Events} from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import 'rxjs/add/operator/timeout';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';




@IonicPage({
  name:'cancel-order'
})
@Component({
  selector: 'page-cancel-order',
  templateUrl: 'cancel-order.html',
})
export class CancelOrderPage {

  // reasons = [{"id":"1","value":"any reason"},
  // {"id":"2","value":"any reason"},
  // {"id":"3","value":"any reason"}];
  reasons=[];
  userReasons = [] ;
  orderId;
  accessToken;
  desc = "" ;
  langDirection;
  tostClass ;
  CancelBtn =true;
  logout ;

  constructor(public storage: Storage,public helper:HelperProvider, 
    public service:LoginserviceProvider,public translate: TranslateService,
    public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public events: Events) {
   this.orderId =  this.navParams.get('orderId');
   this.langDirection = this.helper.lang_direction;

   this.logout = this.helper.logout;

   this.events.publish('enableTabs', true);

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
    console.log('ionViewDidLoad CancelOrderPage');
    // this.storage.get("access_token").then(data=>{
      // this.accessToken = data;
      this.accessToken = localStorage.getItem('user_token');
      
      if (navigator.onLine) {
      this.service.cancelreasons(this.accessToken).timeout(10000).subscribe(
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
          //  this.helper.updateCancelOrderStatus(this.orderId);
            this.presentToast(this.translate.instant("orderCancled"));     
            // this.navCtrl.setRoot(OrderhistoryPage);
         
            // this.navCtrl.pop();
            // this.navCtrl.setRoot(HomePage);
            // this.navCtrl.parent.select(1);
            
            // this.events.publish('cancelDoctorOrder');
            
            if(this.logout == false)
            {
              this.navCtrl.setRoot(TabsPage);
              this.navCtrl.parent.select(2); //1
  
            }else if (this.logout == true)
            {
              this.userLogout();
            }
           
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

    userLogout(){

      this.accessToken = localStorage.getItem('user_token');

      this.service.updateNotification(0,this.accessToken).subscribe(
        resp=>{
          console.log("resp from updateNotification for logout ",resp);
          this.storage.remove("access_token");
          this.storage.remove("refresh_token");
          this.storage.remove("user_info");
          this.storage.remove("language");
          
          this.navCtrl.setRoot(LoginPage);
          
          
        },err=>{
          console.log("err from updateNotification for logout ",err);
        }
      );

    }
}
