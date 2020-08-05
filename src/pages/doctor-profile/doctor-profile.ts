import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,App,AlertController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';


@IonicPage(
  {
    name:'doctor-profile'
  }
)
@Component({
  selector: 'page-doctor-profile',
  templateUrl: 'doctor-profile.html',
})
export class DoctorProfilePage {
  
  langDirection: string;
  doctorProfile;
  image;
  name;
  specialization;
  rate;
  services=[];
  accessToken;

  tostClass ;

  offline;
  bio;
  location;
  serviceId;
  offlinefororders;
  spec_id;

  slogn;
  slognImage;

  constructor( public toastCtrl: ToastController, 
    public storage: Storage, public app:App,
    public service:LoginserviceProvider,public alertCtrl: AlertController,
    public helper: HelperProvider, public navCtrl: NavController,
     public navParams: NavParams,public translate: TranslateService) {

    this.langDirection = this.helper.lang_direction;
    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

    this.accessToken = localStorage.getItem('user_token');
    this.helper.view = "pop";

    this.translate.use(this.helper.currentLang);
    
    this.doctorProfile = navParams.get('data');
    console.log("from doctor profile: ",this.doctorProfile);
    this.image = this.doctorProfile.profile_pic;
    this.name = this.doctorProfile.doctorName;
    this.specialization = this.doctorProfile.specialization;
    this.spec_id = this.doctorProfile.speciality_id;
    this.rate = this.doctorProfile.rate;
    this.bio = this.doctorProfile.bio;
    this.location = this.doctorProfile.address;
    this.services = this.doctorProfile.speciality_services;
    this.serviceId = this.doctorProfile.id;

    
    //ayaaaaaaaaa
    this.slogn = this.doctorProfile.slogn;
    this.slognImage = this.doctorProfile.slogn_image;
    /////////////
    
    if(this.doctorProfile.offline == true )//|| this.doctorProfile.offlineFororders == true
      this.offline = "1";
    else
      this.offline = "0";
    // this.services = ["any thing","any thing","any thing"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorProfilePage');
    if(!navigator.onLine)
    this.presentToast(this.translate.instant("checkNetwork"));
  }
  dismiss(){
    this.navCtrl.pop();
  }
  
  sendOrder(){

    if(this.offline == "1")
    {
      this.presentToast(this.translate.instant("doctoroffline"));
    }
    else{
     this.checkfund();
     // this.completeOrders();
     }
  }


  completeOrders(){



    console.log("orderId from doctorProfile: ",this.doctorProfile.id);
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    
    this.accessToken = localStorage.getItem('user_token');

    // const alertEdit = this.alertCtrl.create({
    //   title:  'كوبون خصم',
    //   inputs: [
    //     { 
    //       name: 'currentFees',
    //       placeholder: "ادخل كود - اختياري",
    //       type: 'text'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: "إلغاء",
    //       role: 'cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: "اطلب الآن",
    //       handler: data => {
    //         if (String(data.currentFees).trim()) {
    //          //alert(this.spec_id)
    //           this.service.checKCoupon(this.doctorProfile.id,this.accessToken,this.spec_id,String(data.currentFees).trim(),(data)=>{
    //             if(data.success){
    //               if(data.status == -1){
    //                 this.presentToast("كوبون الخصم غير صالح")
    //               }
    //               else if(data.status == 2){
    //                 this.presentToast("كوبون الخصم مستخدم من قبل")
    //               }
    //               else if(data.status == 1){
    //                 let coupon_type = ""
    //                 if(data.coupon.type == "percent"){
    //                   coupon_type = data.coupon.discount +" % "
    //                 }
    //                 else{
    //                   coupon_type = data.coupon.discount+ " جنيه "
    //                 }
    //                 let confirm = this.alertCtrl.create({
    //                   title: '',
    //                   subTitle: "سيتم خصم "+coupon_type+" من قيمة الكشف",
    //                   buttons: [
    //                     {
    //                       text: "إلغاء",
    //                       role: 'cancel',
    //                       handler: data => {
    //                         console.log('Cancel clicked');
    //                       }
    //                     },
    //                     {
    //                     text: "تأكيد الطلب",
    //                     handler: data2 => {
    //                       this.service.saveOrder(this.doctorProfile.id,this.accessToken,1,data.coupon.id).subscribe(
    //                         resp => {
    //                           if(JSON.parse(JSON.stringify(resp)).success ){
    //                           console.log("saveOrder resp: ",resp);
    //                           var newOrder = JSON.parse(JSON.stringify(resp));
                                
    //                           this.helper.orderIdForUpdate = newOrder.order.id;
                              
    //                           this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,1);
    //                           //this.helper.orderStatusChanged(newOrder.order.id);
                      
    //                           this.presentToast(this.translate.instant("ordersent"));
    //                           this.helper.dontSendNotification = false;
                              
    //                           // this.navCtrl.pop();
    //                           this.navCtrl.setRoot('remaining-time-to-accept',{orderId:newOrder.order.id});
    //                           }else{
    //                             this.presentToast(this.translate.instant("serverError"));
    //                           }
    //                         },
    //                         err=>{
    //                           console.log("saveOrder error: ",err);
    //                           this.presentToast(this.translate.instant("serverError"));
    //                         }
    //                       );
    //                     }
    //                   }]
    //                 });
    //                 confirm.present();
    //               }
                  
    //             }
    //             else{
    //               if(data.status == -1){
    //                 this.presentToast("كوبون الخصم غير صالح")
    //               }
    //               else if(data.status == 2){
    //                 this.presentToast("كوبون الخصم مستخدم من قبل")
    //               }
    //               else{
    //                 this.presentToast("كوبون الخصم غير صالح")
    //               }
                
    //             }
               
    //           },
    //           (data)=>{
    //             this.presentToast("خطأ في الأتصال")
    //           })
    //         }
    //         else{
    //           this.service.saveOrder(this.doctorProfile.id,this.accessToken,1,-1).subscribe(
    //             resp => {
    //               if(JSON.parse(JSON.stringify(resp)).success ){
    //               console.log("saveOrder resp: ",resp);
    //               var newOrder = JSON.parse(JSON.stringify(resp));
                    
    //               this.helper.orderIdForUpdate = newOrder.order.id;
                  
    //               this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,1);
    //               //this.helper.orderStatusChanged(newOrder.order.id);
          
    //               this.presentToast(this.translate.instant("ordersent"));
    //               this.helper.dontSendNotification = false;
                  
    //               // this.navCtrl.pop();
    //               this.navCtrl.setRoot('remaining-time-to-accept',{orderId:newOrder.order.id});
    //               }else{
    //                 this.presentToast(this.translate.instant("serverError"));
    //               }
    //             },
    //             err=>{
    //               console.log("saveOrder error: ",err);
    //               this.presentToast(this.translate.instant("serverError"));
    //             }
    //           );
              
    //         }
            
    //       }
    //     }
    //   ]
    // });   
    // alertEdit.present()

    this.service.saveOrder(this.doctorProfile.id,this.accessToken,1,-1).subscribe(
      resp => {
        if(JSON.parse(JSON.stringify(resp)).success ){
        console.log("saveOrder resp: ",resp);
        var newOrder = JSON.parse(JSON.stringify(resp));
          
        this.helper.orderIdForUpdate = newOrder.order.id;
        
        this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,1);
        //this.helper.orderStatusChanged(newOrder.order.id);

        this.presentToast(this.translate.instant("ordersent"));
        this.helper.dontSendNotification = false;
        
        // this.navCtrl.pop();
        this.navCtrl.setRoot('remaining-time-to-accept',{orderId:newOrder.order.id});
        }else{
          this.presentToast(this.translate.instant("serverError"));
        }
      },
      err=>{
        console.log("saveOrder error: ",err);
        this.presentToast(this.translate.instant("serverError"));
      }
    );
   
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
  viewRates(){
    console.log("viewRates");
    this.navCtrl.push('view-rates',{data:this.serviceId});
  }

  checkfund(){

    this.accessToken = localStorage.getItem('user_token');
   
    this.service.getFund(this.accessToken).subscribe(
      resp=>{
        console.log("resp from getFund",resp);
        var pfunds = JSON.parse(JSON.stringify(resp)).data;
      
       
           
            if(pfunds.order_count == 0)
              this.completeOrders();
            else if(pfunds.order_count>0 && pfunds.order_count<3)
              this.fundAlert(pfunds.forfeit_patient,this.doctorProfile.discount);
          else if(pfunds.order_count >= 3)          
            this.fundStopAlert(pfunds.forfeit_patient,this.doctorProfile.discount);

          

       
        
        
      },err=>{
        console.log("err from getFund",err);
      });
  }
  fundAlert(mony,price){
    if(!price)
    price="";

  
    let alert = this.alertCtrl.create({
      title: "تطبيق الدكتور",
      message:" قيمة الغرامه: "+mony +" جنيه مصرى <br>"+ " قيمه الكشف: "+price+" جنيه مصرى<br>",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
  //          this.orderBTn = true;

            // for(var k=0;k<this.DoctorsArray.length;k++)
            // {
            //   this.DoctorsArray[k].offlineFororders=true;
            // }

          //  this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=true;

          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('agree clicked');
   //         this.orderBTn = false;

            // for(var k=0;k<this.DoctorsArray.length;k++)
            // {
            //   this.DoctorsArray[k].offlineFororders=false;
            // }

            // this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=false;
            this.completeOrders();
          }
        }
      ]
    });
    alert.present();
  }
  fundStopAlert(mony,price){
    if(!price)
      price="";

    // this.orderBTn = true;
    // for(var k=0;k<this.DoctorsArray.length;k++)
    // {
    //   this.DoctorsArray[k].offlineFororders=true;
    // }
    
    // this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=true;
      let alert = this.alertCtrl.create({
        title: "تطبيق الدكتور",
        message:" قيمة الغرامه: "+mony +" جنيه مصرى <br>"+ " قيمه الكشف: "+price+" جنيه مصرى<br>",
        buttons: ["حسنا"
        ]
      });

      alert.present();
    
  }


}
