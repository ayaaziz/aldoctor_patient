import { Component } from '@angular/core';
import {ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { OrderhistoryPage } from '../orderhistory/orderhistory';




@IonicPage({
  name:'cancel-order'
})
@Component({
  selector: 'page-cancel-order',
  templateUrl: 'cancel-order.html',
})
export class CancelOrderPage {

  reasons = [{"id":"1","value":"any reason"},
  {"id":"2","value":"any reason"},
  {"id":"3","value":"any reason"}];
  userReasons = [] ;
  orderId;
  accessToken;
  desc;
  langDirection;


  constructor(public storage: Storage,public helper:HelperProvider, 
    public service:LoginserviceProvider,public translate: TranslateService,
    public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController) {
   this.orderId =  this.navParams.get('orderId');
   this.langDirection = this.helper.lang_direction;
    this.translate.use(this.helper.currentLang);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelOrderPage');
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.service.cancelreasons(this.accessToken).subscribe(
        resp=>{
          console.log("resp from cancelreasons: ", resp);
        },err=>{
          console.log("error from cancelreasons: ",err);
        }

      );   
   
   
    });
  }
  reasonChecked(item , event){
    if(item.checked == true)
      {
        console.log("reason checked ",item);
        this.userReasons.push(item.id);
      }
    else
      {
        console.log("reason unchecked ",item);
        for(var i=0;i<this.userReasons.length;i++){
          if(item.id == this.userReasons[i] )
            this.userReasons.splice(i,1);
        }
      }

  
  }
  cancelOrder(){
    console.log("user reasons",this.userReasons.join());
    console.log("desc: ",this.desc);
    console.log("order id from cancle: ",this.orderId);
      this.service.cancelorder(this.orderId,this.userReasons.join(),this.desc,this.accessToken).subscribe(
        resp => {
          console.log("cancel order resp: ",resp);
          this.presentToast(this.translate.instant("orderCancled"));     
          this.navCtrl.setRoot(OrderhistoryPage);
        },
        err=>{
          console.log("cancel order err: ", err);
        }
      );
    }
  

    private presentToast(text) {
      let toast = this.toastCtrl.create({
        message: text,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }

    dismiss(){
      this.navCtrl.pop();
    }

}
