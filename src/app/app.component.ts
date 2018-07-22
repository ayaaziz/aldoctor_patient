import { Component, ViewChild } from '@angular/core';
import {Nav, Platform, NavController, MenuController ,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { NotificationPage } from '../pages/notification/notification';
import { LoginPage } from '../pages/login/login';
// import  Moment  from 'angular-moment'
import { TranslateService } from '@ngx-translate/core';
import { DoctorEvaluationPage } from '../pages/doctor-evaluation/doctor-evaluation';
import { Storage } from '@ionic/storage';
import { SpecializationsPage } from '../pages/specializations/specializations';
import { SpecificDoctorPage } from '../pages/specific-doctor/specific-doctor';
import { OrderDoctorPage } from '../pages/order-doctor/order-doctor';
//import { CancelorderPage } from '../pages/cancelorder/cancelorder';
//import { FolloworderPage } from '../pages/followorder/followorder';
import { HelperProvider } from '../providers/helper/helper';
//import { VerifycodePage } from '../pages/verifycode/verifycode';
import { SocialSharing } from '@ionic-native/social-sharing';

// import { AppRate } from '@ionic-native/app-rate';
//import { AboutAppPage } from '../pages/about-app/about-app';
//import { ConditionsPage } from '../pages/conditions/conditions';
//import { ContactusPage } from '../pages/contactus/contactus';


import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { AboutAppPage } from '../pages/about-app/about-app';

import { LoginserviceProvider } from '../providers/loginservice/loginservice';

@Component({
  templateUrl: 'app.html',
  providers:[Push]
})
export class MyApp {
  @ViewChild(Nav) navctrl:Nav;
  @ViewChild("content") nav: NavController
  rootPage:any;
  dir:any;
  langDirection:string;
  image="assets/imgs/default-avatar.png";  
  name="";
  constructor(public service:LoginserviceProvider, private alertCtrl: AlertController, private push: Push,public storage:Storage,public socialSharing:SocialSharing,public helper:HelperProvider,public menu:MenuController,public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public translate: TranslateService) {
    console.log("current lang: ",this.helper.currentLang);
    if(this.helper.currentLang == 'ar'){
      this.dir="right";
    }else{
      this.dir="left";
    }
    
    
    //this.menu.toggle('left');
    
    // if (this.helper.currentLang == 'ar')
    // {
    //   this.dir="right"
    //   this.translate.use('ar');
    //   this.helper.currentLang = 'ar';
    //   this.translate.setDefaultLang('ar');
    //   this.helper.lang_direction = 'rtl';
    //   this.langDirection = "rtl";
    //   this.platform.setDir('rtl',true)
    // }
    // else{
    //   this.dir="left"
    //   this.translate.use('en');
    //   this.helper.currentLang = 'en';
    //   this.translate.setDefaultLang('en');
    //   this.helper.lang_direction = 'ltr';
    //   this.langDirection = "ltr";
    //   this.platform.setDir('ltr',true)
    // }
 
    this.pushnotification();

    // storage.get('language').then((val) => {
    //     this.helper.currentLang=val.lang;
    //     this.helper.lang_direction=val.langdir;
    //     console.log("language val ",val);
    //     if(this.helper.currentLang == 'ar'){
    //       this.dir="right";
    //       this.platform.setDir('rtl',true);
    //     }else{
    //       this.dir="left";
    //       this.platform.setDir('ltr',true);
    //     }
    //     this.langDirection = this.helper.lang_direction;
    //     this.translate.use(this.helper.currentLang);
    // });

    // storage.get("access_token").then((val)=>{
    //   if (val)
    //     this.rootPage = TabsPage;
    //   else  
    //     this.rootPage = LoginPage;
    // });
    
    storage.get("user_info").then((val) => {
      if (val){
        console.log(" if get user info from storage",val);
        this.image=val.profile_pic;
        this.name=val.name;
        this.rootPage = TabsPage;
        
        // this.rootPage = LoginPage;
      } else{
        console.log("else get user info from storage",val);
        this.rootPage = LoginPage;
        //this.rootPage = TabsPage;
      }
    });

    platform.ready().then(() => {

      //translate.setDefaultLang('en');
      // translate.use('en');
      statusBar.styleDefault();
      splashScreen.hide();
      this.defaultLang();
      //this.initializeApp();
      //splashScreen.show();
    });
   
 
 
  }
  defaultLang(){
    this.translate.use('ar');
    this.helper.currentLang = 'ar';
    this.translate.setDefaultLang('ar');
    this.helper.lang_direction = 'rtl';
    this.langDirection = "rtl";
    this.platform.setDir('rtl',true);


  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log("openpage:");
    if(this.helper.currentLang == 'ar'){
      this.dir="right";
    }else{
      this.dir="left";
    }
    
    this.nav.setRoot(page.component);
  }

  share()
  {
    console.log("share app");
    this.socialSharing.share(" الدكتور" , null , null ,"http://itrootsdemos.com/aldoctor").then(() => {
      console.log("success")
      this.menu.close();
    }).catch(() => {
      console.log("not available")
    });
  }
  
  // cancel()
  // {
  //   this.navctrl.push(CancelorderPage)
  //   this.menu.close()

  // }
  // follow()
  // {
  //   this.navctrl.push(FolloworderPage)
  //   this.menu.close()
  // }
  apprate()
  {
    // this.platform.ready().then(()=>{
    //   this.appRate.preferences.storeAppURL = {
    //     ios: 'ca-app-pub-8649488555231154/7752535828',
    //     android: 'market://details?id=com.itroots.eldahayan',
    //   },
      
      
    //   this.appRate.preferences.customLocale={
    //     title: 'قيم تطبيق المريض ',
    //      message: 'اذا اعجبك تطبيق  المريض , هل تمانع من اخذ دقيقه لتقيمه؟ شكرا لدعمك ',
    //       rateButtonLabel: 'قيم البرنامج الان',
    //      cancelButtonLabel:'الغاء',
    //        laterButtonLabel:'ذكرني لاحقا'
         
    //   },
    //   this.appRate.promptForRating(false);
    
    //        this.appRate.preferences.callbacks={
    //         onButtonClicked: function (buttonIndex) {
              
    //           if (buttonIndex == 3) {
    //             this.storage.set("Rate", -1);
    //           }
    //           else if (buttonIndex == 2) {
    //             let today = Moment();
    //             let afterMonth = today.add(15, 'days').format('DD-MM-YYYY');
                
    //             this.storage.set("Rate", afterMonth);
                
    //           }
    
    //         }
    //       }
    
       
    //       try {
    //         let rateVal = this.storage.get("Rate").then((val) => {
        
    //      if (val == null) {
    //            var today = Moment();
    //            var afterMonth = today.add(7, 'days').format('DD-MM-YYYY');
    //            this.storage.set("Rate", afterMonth);
              
    //          }
    //          else if (val != -1) {
    //            var checkforRate = Moment().format('DD-MM-YYYY');
              
    
    //            if (Moment(checkforRate, 'DD-MM-YYYY').isAfter(Moment(val, 'DD-MM-YYYY'))) {
                
    //              var today = Moment();
    //              var afterMonth = today.add(15, 'days').format('DD-MM-YYYY');
    //              this.storage.set("Rate", afterMonth);
                
    //              this.appRate.promptForRating(true);
    //            }
    
    //          }
    //          });
    //        }
    //        catch (ex) {
    //          var today = Moment();
    //          var afterMonth = today.add(7, 'days').format('DD-MM-YYYY');
    //          this.storage.set("Rate", afterMonth);
             
    //        }
    
    // }).catch((err)=>{
    //   console.log(err)
    // });
    }
    openAboutapppage()
    {
      this.navctrl.push('about-app');
      this.menu.close();

    }
    setting(){
      this.navctrl.push('settings');
      this.menu.close();
    }

    logout()
    {
      this.storage.get("access_token").then(data=>{
        //this.accessToken = data;
        this.service.updateNotification(0,data).subscribe(
          resp=>{
            console.log("resp from updateNotification ",resp);
            this.storage.remove("access_token");
            this.storage.remove("refresh_token");
            this.storage.remove("user_info");
            this.storage.remove("language");
            
            this.navctrl.push(LoginPage);
            this.menu.close();
            
          },err=>{
            console.log("err from updateNotification ",err);
          }
        );
      });

     
    }
    contact()
    {
      this.navctrl.push('contact-us')
      this.menu.close()
    }
    opensuggest()
    {
     // alert("here")
      this.navctrl.push('conditions')
      this.menu.close()

    }

    pushnotification() {
      let options: PushOptions
        options = {
          android: {
            //senderID: "403805018537",
           icon: "icon",
           iconColor: "#64B5F6",
           forceShow: true,
           clearNotifications: false
          },
          ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
          }
        }
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('notification').subscribe((notification: any) => {
        console.log("notification " + JSON.stringify(notification))
        if (this.platform.is('ios')) {
          console.log("notification1")
          if (notification.additionalData.foreground == true) {
            console.log("notification2" + notification.additionalData["title"] + " rr " + notification.additionalData["message"])
  
            let alert = this.alertCtrl.create({
              title: notification["title"],
              message: notification["message"],
              buttons: [
                {
                  text: 'إلغاء',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'عرض',
                  handler: () => {
                    console.log('Buy clicked');
                    if (notification.additionalData["gcm.notification.orderid"] == "0" || notification.additionalData["gcm.notification.type"] == "1" || notification.additionalData["gcm.notification.type"] == "3") {
                      // this.storage.get('access_token').then((val) => {
  
                      //   if (!(val == null)) {
                      //     this.helper.appAccess = val
                          this.nav.setRoot(TabsPage).then(() => {
                            this.nav.push('OfferModelPage', { TypeName: notification.additionalData["gcm.notification.type"], NameItem: notification.additionalData["gcm.notification.ID"], pageName: "notification",Sub_category_name_ar: notification["title"] })
                            console.log("noti id type" + notification.additionalData["gcm.notification.ID"] + " " + notification.additionalData["gcm.notification.type"])
                          })
                      //   }
                      // })
  
                    }
                    
                  }
                }
              ]
            });
            alert.present();
  
          }
          else {
                      // this.storage.get('access_token').then((val) => {
                      //   if (!(val == null)) {
                      //     this.helper.appAccess = val

  //                     var orderobject={"orderId":"","order_status":"",
  // "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":""};
  // orderobject.orderId =  notification["OrderID"];
  // this.nav.push('follow-order',{
  //   data:orderobject
  // });

                          this.nav.setRoot(TabsPage).then(() => {
                          this.nav.push('OfferModelPage', { TypeName: notification.additionalData["gcm.notification.type"], NameItem: notification.additionalData["gcm.notification.ID"], pageName: "notification",Sub_category_name_ar: notification["title"] })
                          })
                          console.log("noti id type" + notification.additionalData["gcm.notification.ID"] + " " + notification.additionalData["gcm.notification.type"])
                      //   }
                      // })
                    }
        }
  //android
        else {
          console.log("notification from android",notification);
          console.log("android");
          this.helper.notification=notification;
          var orderStatus = notification.additionalData.order_status;
          if(orderStatus == "5")
            this.nav.push('rate-doctor',{
              data:{
                doctorId:notification.additionalData.doctorId,
                orderId:notification.additionalData.orderId}
            });

          if (notification.additionalData.type == "0" || notification.additionalData.type == "1" || notification.additionalData.type == "3") {
            // this.storage.get('access_token').then((val) => {
  
              // if (!(val == null)) {
              //   this.helper.appAccess = val
                this.nav.setRoot(TabsPage).then(() => {
                  
                  this.nav.push('OfferModelPage', { TypeName: notification.additionalData.type, NameItem: notification.additionalData.ID, pageName: "notification",Sub_category_name_ar: notification.message})
                })
             // }
            //})
          }
        }
        //returns view controller obj 
  
  
      });
      pushObject.on('registration').subscribe((registration: any) => {
        console.log("registraion : ",registration);
        console.log("registrationId " + registration.registrationId)
        this.helper.registration = registration.registrationId;

      });
  
      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }

    
    initializeApp() {
      //get app language from offline data.
      this.storage.get("LanguageApp").then((val) => {
  
        if (val == null) {
          // if offline lang value not saved get mobile language.
          var userLang = navigator.language.split('-')[0];
          // check if mobile lang is arabic.
          if (userLang == 'ar') {
            this.translate.use('ar');
            this.helper.currentLang = 'ar';
            this.translate.setDefaultLang('ar');
            this.helper.lang_direction = 'rtl';
            this.langDirection = "rtl";
            this.platform.setDir('rtl', true)
            //  this.menuDirection = "right";
          }
          else {
            // if mobile language isn't arabic then make application language is English.
  
            this.translate.setDefaultLang('en');
            this.translate.use('en');
            this.helper.currentLang = 'en';
            this.helper.lang_direction = 'ltr';
            this.langDirection = "ltr";
            this.platform.setDir('ltr', true)
            //   this.menuDirection = "left";
          }
        }
        //If application language is saved offline and it is arabic.
        else if (val == 'ar') {
          this.translate.use('ar');
          this.helper.currentLang = 'ar';
          this.translate.setDefaultLang('ar');
          this.helper.lang_direction = 'rtl';
          this.langDirection = "rtl";
          this.platform.setDir('rtl', true)
          // this.menuDirection = "right";
  
        }
        //If application language is saved offline and it is English.
        else if (val == 'en') {
          this.translate.setDefaultLang('en');
          this.translate.use('en');
          this.helper.currentLang = 'en';
          this.langDirection = "ltr";
          this.helper.lang_direction = 'ltr';
          this.platform.setDir('ltr', true)
          // this.menuDirection = "left";
        }
      });
  
    }
  
}
