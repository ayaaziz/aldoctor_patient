import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  name:'view-rates'
})
@Component({
  selector: 'page-view-rates',
  templateUrl: 'view-rates.html',
})
export class ViewRatesPage {

  langDirection:any;
  accessToken;
  page=1;
  maximumPages;
  refresher;
  showLoading=true;
  tostClass ;
  data = [];
  serviceId;

  constructor(
    public navCtrl: NavController, public navParams: NavParams
    ,public toastCtrl: ToastController,public helper:HelperProvider,
    public service:LoginserviceProvider,public translate:TranslateService
    ) {

      this.accessToken = localStorage.getItem('user_token');
      this.helper.view = "pop";
      
      this.langDirection = this.helper.lang_direction;
      this.translate.use(this.helper.currentLang);
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.serviceId = this.navParams.get('data');

  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter ViewRatesPage');
    this.helper.view = "NotificationPage"; 
    this.accessToken = localStorage.getItem('user_token');
      
    this.data=[];
    this.page=1;
    this.loadNotification();

    this.accessToken = localStorage.getItem('user_token');

}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRatesPage');
    
  }
  loadNotification(infiniteScroll?) {
    this.showLoading = false;
    this.service.getReviews(this.serviceId,this.page,this.accessToken).subscribe(
      resp=>{
        this.showLoading = true;
        console.log("resp from getReviews : ",resp);
        var notificatoionResp = JSON.parse(JSON.stringify(resp)).rate;
        
        if (notificatoionResp.last_pag)
          this.maximumPages = notificatoionResp.last_page;

        for(var i=0;i<notificatoionResp.length;i++){
          console.log("remark ",notificatoionResp[i].remark);
          
          if(notificatoionResp[i].remark){
            if(notificatoionResp[i].usr)
              notificatoionResp[i].notificationimage=notificatoionResp[i].usr.profile_pic;
            else
            notificatoionResp[i].notificationimage="assets/imgs/default-avatar.png";
          
  
            notificatoionResp[i].notificationDate = notificatoionResp[i].created_at.split(" ")[0];
            this.data.push(notificatoionResp[i]);
     
          }
               
        }
        
    

        if(this.data.length == 0)
        {
         this.presentToast("لا يوجد تعليقات"); 
        }
        if (infiniteScroll) {
          infiniteScroll.complete();
        }

      },
      err=>{
        this.showLoading = true;
        console.log("err from getReviews: ",err);
      }
    );

  
  }
 
  refreshNotification() {
    
    this.service.getReviews(this.serviceId,"1",this.accessToken).subscribe(
      resp=>{
        this.showLoading = true;
        console.log("resp from getReviews : ",resp);
        if(this.refresher){
          this.data=[];
        }
        var notificatoionResp = JSON.parse(JSON.stringify(resp)).rate;
       
        if (notificatoionResp.last_pag)
          this.maximumPages = notificatoionResp.last_page;
       
        for(var i=0;i<notificatoionResp.length;i++){
          
          console.log("remark ",notificatoionResp[i].remark);
          
          if(notificatoionResp[i].remark){

            if(notificatoionResp[i].usr)
              notificatoionResp[i].notificationimage=notificatoionResp[i].usr.profile_pic;
            else
              notificatoionResp[i].notificationimage="assets/imgs/default-avatar.png";
                
            notificatoionResp[i].notificationDate = notificatoionResp[i].created_at.split(" ")[0];
            this.data.push(notificatoionResp[i]);
          }
          
        }
        if(this.data.length == 0)
        {
          this.presentToast("لا يوجد تعليقات"); 
        }
    


        if(this.refresher){
          this.refresher.complete();
        }
      },
      err=>{
        this.showLoading = true;
        console.log("err from getNotifications: ",err);
      }
    );

  
  }

  loadMore(infiniteScroll) {
    console.log("load more");
    this.page++;
    this.loadNotification(infiniteScroll);
 
    if (this.page == this.maximumPages) {
      infiniteScroll.enable(false);
    }
  }

  doRefresh(ev){
    console.log("refresh",ev);
    this.refresher = ev;
    
    this.refreshNotification();
    
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

}
