import { Component } from '@angular/core';
import { NavController , ToastController, Platform, Events, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { SpecializationsPage } from '../specializations/specializations';
import { LoginPage } from '../login/login';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { FollowOrderForPlcPage } from '../follow-order-for-plc/follow-order-for-plc';
import { FollowOrderPage } from '../follow-order/follow-order';
//import { CancelorderPage } from '../cancelorder/cancelorder';
//import { FolloworderPage } from '../followorder/followorder';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
  

})
export class HomePage {
  
  langDirection:any;
  accessToken;
  tostClass;
xxrate;
  DoctorsArray = [{distanceVal:5,offline:false},{distanceVal:1000,offline:true},{distanceVal:3,offline:false},{distanceVal:1,offline:true}];

  constructor(public service: LoginserviceProvider,public events: Events,
    public platform:Platform, public alertCtrl: AlertController,
    public translate:TranslateService,
    public helper:HelperProvider,public toastCtrl: ToastController,
     public storage: Storage, public navCtrl: NavController) 
     {
    // this.langDirection = this.helper.lang_direction;
    // this.translate.use(this.helper.currentLang);

    // var xphone = "01123659846";
    // if( xphone.toString()[0] != "2")
    //   xphone = "2"+xphone;
    //console.log("xphone: ",xphone);
    console.log("27-10-2018 helllo hhh split","27-10-2018 00:00:00:00".substring(length, 10));
    console.log("27-10-2018 helllo hhh split 11 :","27-10-2018 00:00:00:00".substring(0, 11));
    var xxdate = "2018-09-20T11:58:00.000Z"
var yydate = xxdate.split('T');
var zzdate = yydate[1].split('.');
console.log("time of notification" ,yydate[0]+" "+zzdate[0]);
    
    this.accessToken = localStorage.getItem('user_token');

    this.helper.view = "HomePage";
this.parseArabic();
    // this.helper.userId=114;
    // this.helper.intializeFirebase();
    console.log("acceeToken from localstorage", localStorage.getItem('user_token'));
    this.sortDoctors();
if(this.xxrate)
{
  console.log("value in xxrate",this.xxrate)
}else {
  console.log("non value in xxrate",this.xxrate);
}
//     var d = Number(13376+(30*60));
//     var h = Math.floor(d/3600);
//     var m = Math.floor(d % 3600 /60);
//     var s = Math.floor(d % 3600 % 60);
//     console.log("h ", h,"m: ",m,"s: ",s);  
// var hdisplay = h > 0 ? h + (h == 1 ? "hour, ":"hours, "):"";
// var mdisplay = m > 0 ? m + (m == 1 ? "minute, ":"minutes, "):"";
// var sdisplay = s > 0 ? s + (s == 1 ? "second, ":"seconds, "):"";
// console.log(" time : ",hdisplay+mdisplay);

// console.log("google time",this.toHHMMSS(3283));
// var dis ="100 km";
// var disarr = dis.split(" ");
//     if(disarr[1] == "km")
//     {
//       disarr[1]="كم";
//       dis = disarr.join(" ");
//     }else if(disarr[1] == "m"){
//       disarr[1]="م";
//       dis = disarr.join(" ");
//     }
//     console.log("dis",dis);
  
      //  var dur = "3 hours 43 mins";
      //   var durarr = dur.split(" ");
      //   if(durarr[1] == "mins" || durarr[1] == "min"  )
      //   {
      //     durarr[1]="د";
      //     // dur = durarr.join(" ");
      //   }
      //   else if (durarr[3] == "mins" || durarr[3] == "min"  ){
      //     durarr[3]="د";
      //   }
         
      //   dur = durarr.join(" ");
      //   durarr = dur.split(" ");
      //   if(durarr[1] == "hours"){
      //     durarr[1]="س";
      //     // dur = durarr.join(" ");
      //   }

      //  var dur = "3 hours 43 mins";
      //   dur = dur.replace("hours","س");
      //   dur = dur.replace("mins","د");
        
      //   dur.replace("min","د");
      //   console.log("dur ",dur);
    // this.helper.createOrder(3);
    //this.helper.orderStatusChanged(313);
    //this.helper.updateCancelOrderStatus(313);
    
    // for(var i=311;i<320;i++)
    //   this.helper.removeOrder(i);

    console.log("date", new Date().toISOString().split('T')[0]);
var date1 = new Date('2018-06-01');
var date2 = new Date('2018-05-25');

var timeDiff = Math.abs(date2.getTime() - date1.getTime());
var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
console.log("diff ",diffDays);

this.storage.get("rate_doctor").then(data=>{
      if(data){
        var rateDate = new Date(data.date);
        var currentDate = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if(diffDays == 14)
        {
          this.storage.remove("rate_doctor");

          this.navCtrl.setRoot('rate-doctor',
          {data2:
            {
              "doctorId":data.doctorId, 
              "orderId":data.orderId
            }
          });

          


        }
        
      }
    });

    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    
    this.accessToken = localStorage.getItem('user_token');

    this.service.getCountOfNotifications(this.accessToken).subscribe(
      resp=>{
        console.log("resp count of notifications",resp);
         this.events.publish('lengthdata', JSON.parse(JSON.stringify(resp)).count);
         if(JSON.parse(JSON.stringify(resp)).user_status != "1")
          this.navCtrl.setRoot(LoginPage);
        },
      err=>{
        console.log("err count of notifications",err);
      }
    );
    // });
    
    storage.get('language').then((val) => {
        console.log("language val ",val);
        this.helper.currentLang=val.lang;
        this.helper.lang_direction=val.langdir;
        console.log("language val ",val);
        if(this.helper.currentLang == 'ar'){
          
          this.platform.setDir('rtl',true);
        }else{
          
          this.platform.setDir('ltr',true);
        }
        this.langDirection = this.helper.lang_direction;
        this.translate.use(this.helper.currentLang);
        
        if(this.langDirection == "rtl")
          this.tostClass = "toastRight";
        else
          this.tostClass="toastLeft";

        console.log("lang: ",this.helper.currentLang,"dir: ",this.langDirection);

    }).catch(err=>{console.log("can't read languagestorage ")});

    
    // if (this.helper.currentLang == 'ar')
    // {
     
    //   this.translate.use('ar');
    //   this.helper.currentLang = 'ar';
    //   this.translate.setDefaultLang('ar');
    //   this.helper.lang_direction = 'rtl';
    //   this.langDirection = "rtl";
    //   this.platform.setDir('rtl',true)
    // }
    // else{
    
    //   this.translate.use('en');
    //   this.helper.currentLang = 'en';
    //   this.translate.setDefaultLang('en');
    //   this.helper.lang_direction = 'ltr';
    //   this.langDirection = "ltr";
    //   this.platform.setDir('ltr',true)
    // }



    //correct  for pending orders
    // this.service.getpendingOrders("1",this.accessToken).subscribe(resp=>{
    //   console.log("resp from getpendingOrders ",resp);
    //   var pendingOrders = JSON.parse(JSON.stringify(resp)).orders;
    //   for(var  k=0; k<pendingOrders.length; k++)
    //   {
    //     console.log("pendingOrders[k].remark",pendingOrders[k].remark);
    //     if(! pendingOrders[k].remark)
    //       pendingOrders[k].remark="";
        
    //     if(! pendingOrders[k].date)
    //       pendingOrders[k].date="";

    //     this.presentContOrderConfirm(pendingOrders[k].id,pendingOrders[k].remark, pendingOrders[k].date);
    //   }

    // })
  }
 
  sortDoctors(){

    console.log("doc before sort ",this.DoctorsArray);
    // this.DoctorsArray.sort(function(a,b){
    //   console.log("a.distanceVal: ",a.distanceVal,"b.distanceVal: ",b.distanceVal);
    //   return a.distanceVal - b.distanceVal;
    // });

    this.DoctorsArray.sort((a,b)=>{
      if(!a.offline || !b.offline)
        return a.distanceVal-b.distanceVal;
  
    }); 
    console.log("doc after sort ",this.DoctorsArray);
  }

  orderDoctor(){
  
     this.navCtrl.push('search-for-doctor');
  }
  orderPharmacy(){
    this.navCtrl.push('search-for-pharmacy',{data:
      {
      //  title:"searchForPharmacy",
      //  btn1:"SearchByNearestPharmacies",
      //  btn2:"SearchBySpecificPharmacy",
       type_id:"1"  
      },
    });
  }
  orderLab(){
    this.navCtrl.push('search-for-pharmacy',{data:
      {
      //  title:"searchForPharmacy",
      //  btn1:"SearchByNearestPharmacies",
      //  btn2:"SearchBySpecificPharmacy",
       type_id:"3"  
      },
    });
  }
  orderCenter(){
    this.navCtrl.push('search-for-pharmacy',{data:
      {
      //  title:"searchForPharmacy",
      //  btn1:"SearchByNearestPharmacies",
      //  btn2:"SearchBySpecificPharmacy",
       type_id:"2"  
      },
    });
    
  }

  rate(){
    
    this.navCtrl.push('rate-doctor',
  {data:
    {"doctorId":89, 
      "orderId":177
    }
  });
  }

  follow(){
    console.log("follow ")
  this.navCtrl.setRoot('follow-order',
  {data:
    {"orderId":334, 
      "doctorId":232
    }
  });

  }
  followOrderForPlc(){
    this.helper.type_id="2";
    this.navCtrl.setRoot(FollowOrderForPlcPage,
  {data2:
    {"orderId":207, 
      "doctorId":237
    }
  });

  }
  activate(){
    this.navCtrl.setRoot("remaining-time-to-accept");
  }
  cancel(){
    this.navCtrl.push('cancel-order',{orderId:201});
    
    //this.navCtrl.push('cancel-service',{orderId:201});
  }
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }

  ionViewDidLoad(){

    this.service.registerFirebase(this.helper.registration,localStorage.getItem('user_token')).subscribe(
      resp=>{})
    // if(!navigator.onLine)
    //   this.presentToast(this.translate.instant("checkNetwork"));


  //   this.storage.ready().then(() => {
    
  //     this.storage.set('data',"samar").then(
  //       (data)=>{this.presentToast("set then data from home:"+data)},
  //     (error)=>{this.presentToast("set then error from home : "+error)});

  // });
  }




//   ionViewDidEnter(){
//     console.log("did enter");
//   this.storage.get('language').then((val) => {
//     console.log("language val ",val);
//     this.helper.currentLang=val.lang;
//     this.helper.lang_direction=val.langdir;
//     console.log("language val ",val);
//     if(this.helper.currentLang == 'ar'){
      
//       this.platform.setDir('rtl',true);
//     }else{
      
//       this.platform.setDir('ltr',true);
//     }
//     this.langDirection = this.helper.lang_direction;
//     this.translate.use(this.helper.currentLang);

//     console.log("lang: ",this.helper.currentLang,"dir: ",this.langDirection);

// }).catch(err=>{console.log("can't read languagestorage ")});

// }

// toHHMMSS(time) {
// //   // var sec_num = parseInt(seconds, 10); // don't forget the second param
// //   var sec_num = seconds;
// //   var hours   = Math.floor(sec_num / 3600);
// //   var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
// //   var second = sec_num - (hours * 3600) - (minutes * 60);
// //   var hour,min,sec;
// //   if (hours   < 10) {hour  = "0"+hours;}
// //   if (minutes < 10) {min = "0"+minutes;}
// //   if (seconds < 10) {sec = "0"+seconds;}
// //   return hour+':'+min+':'+sec;
// var minutes = Math.floor(time / 60);
// var seconds = time - minutes * 60;
// var hours = Math.floor(time / 3600);
// time = time - hours * 3600;
// }

ionViewDidEnter(){
  this.helper.view = "HomePage"; 
  if(localStorage.getItem("regChanged") == "1"){
    var firebaseRegNoti= localStorage.getItem("firebaseRegNoti");
    this.accessToken = localStorage.getItem('user_token');

    this.service.registerFirebase(firebaseRegNoti,this.accessToken).subscribe(
      resp=>{
        console.log("registerFirebase resp from home",resp);
      },err=>{
        console.log("registerFirebase err from home",err);
      }
    );
    
  }
}

 parseArabic(){ // PERSIAN, ARABIC, URDO
  var yas ="٠١٢٣٤٥٦٧٨٩";
  console.log("yas",yas);
  yas = yas.replace('/[٠١٢٣٤٥٦٧٨٩]/g', (d) =>
  {  
    return String( d.charCodeAt(0) - 1632);                
  }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g,  (d)=> 
      { return String(d.charCodeAt(0) - 1776); })
  ;
  console.log("yas2:",yas);
}

presentContOrderConfirm(order_id,remark,contDate) {

  var token = localStorage.getItem('user_token');
  
  // var xxdate = contDate;
  // var yydate = xxdate.split('T');
  // var zzdate = yydate[1].split('.');
  // console.log("time of notification" ,yydate[0]+" "+zzdate[0]);
  // var ourDate = yydate[0]+" "+zzdate[0];
  
 let alert = this.alertCtrl.create({
   title: "اكمال الطلب",
   message: remark+"<br/>"+contDate+"<br>"+" هل تريد تأكيد الموعد؟",
   buttons: [
     {
       text: "الغاء",
       role: 'cancel',
       handler: () => {
         console.log('confirm contorder  disagree clicked');

         this.service.getOrderDetails(order_id,token).subscribe(
           resp=>{
              console.log("getOrderStatus resp",resp);
              var myOrderStatus = JSON.parse(JSON.stringify(resp)).order.status;
              if(myOrderStatus == "4" )
                this.presentToast("لقد تم الغاء الطلب");
              else if(myOrderStatus == "13")
                this.presentToast("لقد تم تأكيد الموعد");
              else
              {
                this.service.updateOrderStatusToCancel(order_id,token).subscribe(
                  resp=>{
                    console.log("resp cancel contOrder",resp);
                    if(JSON.parse(JSON.stringify(resp)).success)
                    {
                      this.presentToast("تم الغاء الموعد");
                      console.log("الغاء")
                      //this.events.publish('x');
                    }
                      
                  },err=>{
                    console.log("err cancel contOrder",err);
                    this.presentToast("خطأ فى الاتصال");
                  }
                );

              }
           },err=>{
            console.log("getOrderStatus err",err);
            this.presentToast("خطأ فى الاتصال");
           }
         );
        //  this.service.updateOrderStatusToCancel(order_id,token).subscribe(
        //    resp=>{
        //      console.log("resp cancel contOrder",resp);
        //      if(JSON.parse(JSON.stringify(resp)).success)
        //      {
        //        this.presentToast("تم الغاء الموعد");
        //        console.log("الغاء")
        //        //this.events.publish('x');
        //      }
               
        //    },err=>{
        //      console.log("err cancel contOrder",err);
        //      this.presentToast("خطأ فى الاتصال");
        //    }
        //  );
       }
     },
     {
       text: "موافق",
       handler: () => {
         console.log('confirm contorder agree clicked');

         this.service.getOrderDetails(order_id,token).subscribe(
          resp=>{
             console.log("getOrderStatus resp",resp);
             var myOrderStatus = JSON.parse(JSON.stringify(resp)).order.status;
             if(myOrderStatus == "4" )
               this.presentToast("لقد تم الغاء الطلب");
             else if(myOrderStatus == "13")
               this.presentToast("لقد تم تأكيد الموعد");
             else
              {

              

         this.service.updateOrderStatusToAgreeTime(order_id,token).subscribe(
           resp=>{
             console.log("resp cancel contOrder",resp);
             if(JSON.parse(JSON.stringify(resp)).success)
             {
               this.presentToast("تم تأكيد الموعد");
               console.log("تاكيد");
              //  this.events.publish('y');
             }
               
           },err=>{
             console.log("err cancel contOrder",err);
             this.presentToast("خطأ فى الاتصال");
           }
         );
        }
          },err=>{

            console.log("getOrderStatus err",err);
            this.presentToast("خطأ فى الاتصال");
            
          });
       }
     }
   ]
 });
 alert.present();
}

slider(){
  console.log("slider");
  this.navCtrl.push('slider');
}
}
