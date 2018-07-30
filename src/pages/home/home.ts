import { Component } from '@angular/core';
import { NavController , ToastController, Platform, Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { SpecializationsPage } from '../specializations/specializations';
import { LoginPage } from '../login/login';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
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

  DoctorsArray = [{distanceVal:5,offline:false},{distanceVal:1000,offline:true},{distanceVal:3,offline:false},{distanceVal:1,offline:true}];

  constructor(public service: LoginserviceProvider,public events: Events,
    public platform:Platform,public translate:TranslateService,public helper:HelperProvider,public toastCtrl: ToastController, public storage: Storage, public navCtrl: NavController) {
    // this.langDirection = this.helper.lang_direction;
    // this.translate.use(this.helper.currentLang);

    // this.helper.userId=114;
    // this.helper.intializeFirebase();
    this.sortDoctors();
    // this.helper.createOrder(3);
    //this.helper.orderStatusChanged(313);
    //this.helper.updateCancelOrderStatus(313);

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

    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
    this.service.getCountOfNotifications(this.accessToken).subscribe(
      resp=>{
        console.log("resp count of notifications",resp);
         this.events.publish('lengthdata', JSON.parse(JSON.stringify(resp)).count);
      },
      err=>{
        console.log("err count of notifications",err);
      }
    );
    });
    
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
       type_id:"2"  
      },
    });
  }
  orderCenter(){
    this.navCtrl.push('search-for-pharmacy',{data:
      {
      //  title:"searchForPharmacy",
      //  btn1:"SearchByNearestPharmacies",
      //  btn2:"SearchBySpecificPharmacy",
       type_id:"3"  
      },
    });
  }

  rate(){
    
    this.navCtrl.setRoot('rate-doctor',
  {data:
    {"doctorId":28, 
      "orderId":177
    }
  });
  }

  follow(){
  this.navCtrl.setRoot('follow-order',
  {data:
    {"orderId":201, 
      "doctorId":114
    }
  });

  }
  activate(){
    this.navCtrl.setRoot("remaining-time-to-accept");
  }
  cancel(){
    this.navCtrl.push('cancel-order',{orderId:201});
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
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));
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
}
