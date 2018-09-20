import { Component, ViewChild } from '@angular/core';
import {App, Nav, Platform, NavController, MenuController ,AlertController,ActionSheetController,Events,ToastController} from 'ionic-angular';
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
import { AppRate } from '@ionic-native/app-rate';
//import { AboutAppPage } from '../pages/about-app/about-app';
//import { ConditionsPage } from '../pages/conditions/conditions';
//import { ContactusPage } from '../pages/contactus/contactus';


import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { AboutAppPage } from '../pages/about-app/about-app';

import { LoginserviceProvider } from '../providers/loginservice/loginservice';
import { RefreshTokenInterceptorProvider } from '../providers/refresh-token-interceptor/refresh-token-interceptor';

import * as firebase from 'firebase/app';
import { HomePage } from '../pages/home/home';

var firebaseConfig  = {
  apiKey: "AIzaSyBPvbu83CtqeV67AihfGfwxKRzq4ExENNo",
  authDomain: "aldoctor-b33ed.firebaseapp.com",
  databaseURL: "https://aldoctor-b33ed.firebaseio.com",
  projectId: "aldoctor-b33ed",
  storageBucket: "aldoctor-b33ed.appspot.com",
  messagingSenderId: "381921023811"
};

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

  app_share = "item_unselected";
  app_rate = "item_unselected";
  app_logout = "item_unselected";
  app_about = "item_unselected";
  app_contact = "item_unselected";
  app_conditions = "item_unselected";

  backBtnFlag = false;
  tostClass;


  constructor(public events: Events,public service:LoginserviceProvider, 
    private alertCtrl: AlertController, private push: Push,
    public storage:Storage,public socialSharing:SocialSharing,
    public helper:HelperProvider,public menu:MenuController,
    public platform: Platform, private appRate: AppRate,
    public actionSheetCtrl: ActionSheetController,
    statusBar: StatusBar, splashScreen: SplashScreen,
    public translate: TranslateService,
  public app:App, public toastCtrl: ToastController) {

  
            
    console.log("current lang: ",this.helper.currentLang);
    if(this.helper.currentLang == 'ar'){
      this.dir="right";
    }else{
      this.dir="left";
    }
    this.tostClass = "toastRight";
    firebase.initializeApp(firebaseConfig);  
    // this.helper.checkConnection();
    
    this.events.subscribe('changeProfilePic', (data) => {
      console.log(" event change profile pic  ",data);
      this.image = data.pic;
      });

    
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

    storage.get("verification_page").then((val) => {
      if (val){
        console.log(" verification_page from storage",val);
        this.rootPage = 'verification-code';
     
      } else{
        console.log("else verification_page from storage",val);
       // this.rootPage = TabsPage;
       storage.get("user_info").then((val) => {
        if (val){
          console.log(" if get user info from storage",val);
          this.image=val.profile_pic;
          this.name=val.name;
          this.rootPage = TabsPage;
          
         
        } else{
          console.log("else get user info from storage",val);
          this.rootPage = LoginPage;
         
        }
      });

        
      }
    }).catch(
      (err)=>{
        console.log("err from verification_page stoage",err);
       // this.rootPage = TabsPage;
       storage.get("user_info").then((val) => {
        if (val){
          console.log(" catch get user info from storage",val);
          this.image=val.profile_pic;
          this.name=val.name;
          this.rootPage = TabsPage;
          
         
        } else{
          console.log("catch get user info from storage",val);
          this.rootPage = LoginPage;
         
        }
      });
      }
    );

    // storage.get("user_info").then((val) => {
    //   if (val){
    //     console.log(" if get user info from storage",val);
    //     this.image=val.profile_pic;
    //     this.name=val.name;
    //     this.rootPage = TabsPage;
        
    //     // this.rootPage = LoginPage;
    //   } else{
    //     console.log("else get user info from storage",val);
    //     this.rootPage = LoginPage;
    //     //this.rootPage = TabsPage;
    //   }
    // });

    platform.ready().then(() => {

      //translate.setDefaultLang('en');
      // translate.use('en');
      
      //remove scroll in splash and change color to status bar
      // statusBar.overlaysWebView(false);
      // statusBar.backgroundColorByHexString("#418f6a");
      // add this line in config.xml
      // <preference name="ShowSplashScreenSpinner" value="false" />

      statusBar.styleDefault();
      splashScreen.hide();
      this.defaultLang();
      //this.initializeApp();
      //splashScreen.show();
    });
   
    if(platform.is('ios'))
    {
      this.helper.device_type="0";
    }else{
      this.helper.device_type="1";
    }
    
    platform.registerBackButtonAction(()=>{
       console.log("back btn ");
      //  this.app.viewWillLeave.subscribe(view=>{
      //   console.log("view will leave ",view);
      //   if(view.id == "remaining-time-for-plc")
      //     this.events.publish('cancelOrder');
      //   else if (view.id == "remaining-time-to-accept")
      //     this.events.publish('cancelDoctorOrder');
      //  });
      console.log("this.app.getActiveNavs()",this.app.getActiveNavs());
      let nav = this.app.getActiveNavs()[0];
      console.log("nav: ",nav)
      console.log("view : ",this.helper.view)
      this.backBtnFlag  = this.helper.backBtnInHelper;

      if(this.helper.view == "remaining-time-for-plc" && this.backBtnFlag == false)
      {
        //this.backBtnFlag = true;
        // this.helper.backBtnInHelper = true;
        console.log("if to fire cancelOrder event");
        this.events.publish('cancelOrder');
        
      } 
      else if (this.helper.view == "remaining-time-to-accept" && this.backBtnFlag == false)
      {
        //this.backBtnFlag = true;
        // this.helper.backBtnInHelper = true;
        console.log("if to fire cancelDoctorOrder event");
        this.events.publish('cancelDoctorOrder');
        
      } 
      else if (this.helper.view == "HomePage" || this.helper.view == "LoginPage" || this.helper.view == "NotificationPage" || this.helper.view == "OrderhistoryPage" ||this.helper.view == "ProfilePage")
        this.platform.exitApp();
      else if (this.helper.view == "pop")
        nav.pop();
      else
        this.platform.exitApp();
        
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

  menuOpened(){
    console.log("menu opened");
    this.app_share = "item_unselected";
    this.app_rate = "item_unselected";
    this.app_logout = "item_unselected";
    this.app_about = "item_unselected";
    this.app_contact = "item_unselected";
    this.app_conditions = "item_unselected";
  }
  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log("openpage:");
    this.app_share = "item_unselected";
    this.app_rate = "item_unselected";
    this.app_logout = "item_unselected";
    this.app_about = "item_unselected";
    this.app_contact = "item_unselected";
    this.app_conditions = "item_unselected";

    if(this.helper.currentLang == 'ar'){
      this.dir="right";
    }else{
      this.dir="left";
    }
    
    this.nav.setRoot(page.component);
  }

  share()
  {
    if(this.app_share == "item_unselected")
    {
      this.app_share = "item_selected";
      this.app_about = "item_unselected";
      this.app_conditions = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_logout = "item_unselected";
      this.app_rate = "item_unselected";
    }
      
    console.log("share app");
    // this.presentActionSheet();
    // this.navctrl.push('share-app');
    // this.menu.close();

    //share msg , share subject,files,link
    //http://aldoctor-app.com/aldoctortest/public/uploads/1533654003.png
    this.socialSharing.share( "الدكتور", "" , "http://aldoctor-app.com/aldoctor/public/uploads/1536061747.jpeg" ,"https://play.google.com/store/apps/details?id=net.ITRoots.Patient").then(() => {
      console.log("success")
      this.menu.close();
     
    }).catch(() => {
      console.log("not available");
      
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
    if(this.app_rate == "item_unselected")
    {
      this.app_rate = "item_selected";
      this.app_about = "item_unselected";
      this.app_conditions = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_logout = "item_unselected";
      this.app_share = "item_unselected";
    }

    this.appRate.preferences.useLanguage = "ar";
    this.appRate.preferences = {
      // openStoreInApp: false,
      useLanguage:"ar",
      displayAppName: 'الدكتور',
      // usesUntilPrompt: 2,
//      promptAgainForEachNewVersion: false,
      simpleMode:true,
      storeAppURL: {
        // ios: '1216856883',
        android: 'market://details?id=net.ITRoots.Patient'
      }
      ,
      customLocale: {
        title: 'هل يعجبك تطبيق الدكتور؟',
        message: 'اذا اعجبك تطبيق الدكتور , هل تمانع من اخذ دقيقه لتقيمه؟ شكرا لدعمك',
        cancelButtonLabel: 'الغاء',
        laterButtonLabel:" ",
        rateButtonLabel: 'قيم الآن'
      },
      callbacks: {
        onRateDialogShow: function(callback){
          console.log('rate dialog shown!');
        },
        onButtonClicked: function(buttonIndex){
          console.log('Selected index: -> ' + buttonIndex);
          //in order
        }
      }
    };

    // Opens the rating immediately no matter what preferences you set
    this.appRate.promptForRating(true);


    // this.platform.ready().then(()=>{
    //   this.appRate.preferences.storeAppURL = {
    //     ios: 'app id',
    //     android: 'market://details?id=net.ITRoots.Patient',
    //   },
      
      
    //   this.appRate.preferences.customLocale={
    //     title:  'هل يعجبك تطبيق الدكتور؟',
    //      message: 'اذا اعجبك تطبيق  الدكتور , هل تمانع من اخذ دقيقه لتقيمه؟ شكرا لدعمك ',
    //       rateButtonLabel: 'قيم الان',
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
    //         }     
    //     }
    
    // }).catch((err)=>{
    //   console.log(err)
    // });

  }
    openAboutapppage()
    {
      if(this.app_about == "item_unselected")
      {
        this.app_about = "item_selected";
        this.app_share = "item_unselected";
        this.app_conditions = "item_unselected";
        this.app_contact = "item_unselected";
        this.app_logout = "item_unselected";
        this.app_rate = "item_unselected";
      }

      this.navctrl.push('about-app');
      this.menu.close();
     

    }
    setting(){
      this.navctrl.push('settings');
      this.menu.close();
    }

    logout()
    {
      if(this.app_logout == "item_unselected")
      {
        this.app_logout = "item_selected";
        this.app_about = "item_unselected";
        this.app_conditions = "item_unselected";
        this.app_contact = "item_unselected";
        this.app_share = "item_unselected";
        this.app_rate = "item_unselected";
      }

      this.storage.get("access_token").then(data=>{
        //this.accessToken = data;
        this.service.updateNotification(0,data).subscribe(
          resp=>{
            console.log("resp from updateNotification ",resp);
            this.storage.remove("access_token");
            this.storage.remove("refresh_token");
            this.storage.remove("user_info");
            this.storage.remove("language");
            
            this.navctrl.setRoot(LoginPage);
            this.menu.close();
            
          },err=>{
            console.log("err from updateNotification ",err);
          }
        );
      });

     
    }
    contact()
    { 
      if(this.app_contact == "item_unselected")
      {
        this.app_contact = "item_selected";
        this.app_about = "item_unselected";
        this.app_conditions = "item_unselected";
        this.app_share = "item_unselected";
        this.app_logout = "item_unselected";
        this.app_rate = "item_unselected";
      }

      this.navctrl.push('contact-us')
      this.menu.close()
    }
    opensuggest()
    {
     // alert("here")
     if(this.app_conditions == "item_unselected")
     {
       this.app_conditions = "item_selected";
       this.app_about = "item_unselected";
       this.app_share = "item_unselected";
       this.app_contact = "item_unselected";
       this.app_logout = "item_unselected";
       this.app_rate = "item_unselected";
     }

      this.navctrl.push('conditions')
      this.menu.close()

    }

    pushnotification() {
      let options: PushOptions
        options = {
          android: {
            //senderID: "403805018537",
     //      icon: "drawable-ldpi-icon", //icon
          //  iconColor: "#64B5F6",
          //  forceShow: false,
          //  clearNotifications: false
           sound: true
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
        
        this.translate.use('ar');

        if (this.platform.is('ios')) {
          console.log("ios notification",notification);
          if (notification.additionalData.foreground == true) {
            console.log("foreground ios notification" ,notification);
  
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
                    console.log('show notification clicked');
                    this.handlenotifications(notification);
                    // if (notification.additionalData["gcm.notification.orderid"] == "0" || notification.additionalData["gcm.notification.type"] == "1" || notification.additionalData["gcm.notification.type"] == "3") {
                    //   // this.storage.get('access_token').then((val) => {
  
                    //   //   if (!(val == null)) {
                    //   //     this.helper.appAccess = val
                    //       this.nav.setRoot(TabsPage).then(() => {
                    //         this.nav.push('OfferModelPage', { TypeName: notification.additionalData["gcm.notification.type"], NameItem: notification.additionalData["gcm.notification.ID"], pageName: "notification",Sub_category_name_ar: notification["title"] })
                    //         console.log("noti id type" + notification.additionalData["gcm.notification.ID"] + " " + notification.additionalData["gcm.notification.type"])
                    //       })
                    //   //   }
                    //   // })
  
                    // }
                    
                  }
                }
              ]
            });
            alert.present();
  
          }
          else {
            this.handlenotifications(notification);
                      // this.storage.get('access_token').then((val) => {
                      //   if (!(val == null)) {
                      //     this.helper.appAccess = val

  //                     var orderobject={"orderId":"","order_status":"",
  // "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":""};
  // orderobject.orderId =  notification["OrderID"];
  // this.nav.push('follow-order',{
  //   data:orderobject
  // });

                          // this.nav.setRoot(TabsPage).then(() => {
                          // this.nav.push('OfferModelPage', { TypeName: notification.additionalData["gcm.notification.type"], NameItem: notification.additionalData["gcm.notification.ID"], pageName: "notification",Sub_category_name_ar: notification["title"] })
                          // })
                          // console.log("noti id type" + notification.additionalData["gcm.notification.ID"] + " " + notification.additionalData["gcm.notification.type"])
                      //   }
                      // })
                    }
        }
  //android
        else {

          console.log("android");
          console.log("notification from android",notification);
          
          if (notification.additionalData.type_id == "1" || notification.additionalData.type_id == "2" || notification.additionalData.type_id == "3"){

            console.log("notification from type_id",notification.additionalData.type_id);

            this.helper.type_id = notification.additionalData.type_id;

            var orderStatus = notification.additionalData.order_status;
            
            var data = {
              doctorId:notification.additionalData.doctorId,
              orderId:notification.additionalData.orderId
            };

            if(orderStatus == "10" || orderStatus == "3") 
            {
              console.log("status 10 or 3");
              this.storage.remove("orderImages"); 
              this.events.publish('status0ForPLC');
            } 
         
            if(orderStatus == "2")
              this.events.publish('status2ForPLC',data );
            
            if(orderStatus == "11")
            {
              console.log("status 11");
              this.presentAlert(notification.title,notification.message);
              this.helper.removeNetworkDisconnectionListener();
              this.storage.remove("orderImages");
              
            }
            if(orderStatus == "8")
            {
              //بدء التوصيل
              this.presentdelivaryAlert(notification.title,notification.message);
              this.events.publish('status8ForPLC');
            }
            if(orderStatus == "12")
            {
              this.presentContOrderConfirm(notification.additionalData.orderId,notification.additionalData.remark,notification.additionalData.date);
            }
            
            
            if(orderStatus == "5")
            { 
              // if(this.helper.orderRated == 0)
              // {
               // this.events.publish('status5');
               this.helper.removeNetworkDisconnectionListener();

               this.storage.remove("orderImages");
                this.helper.dontSendNotification = true;
                
                this.nav.setRoot(TabsPage);

                this.nav.push('rate-service',{
                  data:{
                    doctorId:notification.additionalData.doctorId,
                    orderId:notification.additionalData.orderId
                  }
                });
              //}
          }  
          }
          else{
          this.helper.notification=notification;
          var orderStatus = notification.additionalData.order_status;
          if(orderStatus == "8")
            this.events.publish('status8');
          // if(orderStatus == "5")
          //   this.events.publish('status5');
          if(orderStatus == "7")
            this.events.publish('status7');
          if(orderStatus == "5" || orderStatus == "6")
          { //
            if(this.helper.orderRated == 0)
            {
            this.events.publish('status5'); //
            // this.nav.push('rate-doctor',{
            //   data:{
            //     doctorId:notification.additionalData.doctorId,
            //     orderId:notification.additionalData.orderId}
            // });
            }
          } //
          // if (notification.additionalData.type == "0" || notification.additionalData.type == "1" || notification.additionalData.type == "3") {
          //   // this.storage.get('access_token').then((val) => {
  
          //     // if (!(val == null)) {
          //     //   this.helper.appAccess = val
          //       this.nav.setRoot(TabsPage).then(() => {
                  
          //         this.nav.push('OfferModelPage', { TypeName: notification.additionalData.type, NameItem: notification.additionalData.ID, pageName: "notification",Sub_category_name_ar: notification.message})
          //       })
          //    // }
          //   //})
          // }


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

    handlenotifications(notifications){
    
      console.log("handle notifications",notifications);

      this.helper.notification=notifications;      
      var orderStatus = notifications.additionalData.order_status;
        
      var data = {
        doctorId:notifications.additionalData.doctorId,
        orderId:notifications.additionalData.orderId
      };

      if (notifications.additionalData.type_id == "1" || notifications.additionalData.type_id == "2" || notifications.additionalData.type_id == "3"){

        this.helper.type_id = notifications.additionalData.type_id;

        if(orderStatus == "10" || orderStatus == "3") 
          this.events.publish('status0ForPLC');
     
        if(orderStatus == "2")
          this.events.publish('status2ForPLC',data );

        if(orderStatus == "5" )
          this.nav.push('rate-service',data);  
      }
      else{

        if(orderStatus == "8")
          this.events.publish('status8');
        if(orderStatus == "7")
          this.events.publish('status7');
        if(orderStatus == "5" || orderStatus == "6")
        { 
          if(this.helper.orderRated == 0)
            this.events.publish('status5'); 
        } 

      }


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
  
    presentActionSheet() { 
    
      let actionSheet = this.actionSheetCtrl.create({
        title: this.translate.instant("SelectImageSource"),
        buttons: [
          {
            text: `Share via Facebook <ion-icon ios="logo-facebook" md="logo-facebook"></ion-icon>`,
            handler: () => {
             // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
     //         this.getPhoto();
            }
          },
          {
            text: this.translate.instant("UseCamera"),
            handler: () => {
             // this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          // {
          //   text: this.translate.instant("cancelTxt"),
          //   role: 'cancel'
          // }
        ]
      });
      actionSheet.present();
    }
  

presentAlert(title,msg) {
  console.log("enter presentAlert");
  this.navctrl.setRoot(TabsPage);
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['موافق']
      });
      alert.present();
}

presentdelivaryAlert(title,msg) {
  console.log("enter presentdelivaryAlert");
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: msg,
    buttons: ['موافق']
  });
  alert.present();
}
    // presentCancelConfirm() {
    //   let alert = this.alertCtrl.create({
    //     title: this.translate.instant("confirmCancelOrder"),
    //     message: "هل تريد الغاء الطلب ؟ ",
    //     buttons: [
    //       {
    //         text: this.translate.instant("disagree"),
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('disagree clicked');
    //         }
    //       },
    //       {
    //         text: this.translate.instant("agree"),
    //         handler: () => {
    //           console.log('cancel order agree clicked');
              
    //           this.navCtrl.push('cancel-service',{orderId:this.orderId});
              
    //         } 
    //       }
    //     ]
    //   });
    //   alert.present();
    // }
    ionViewWillLeave() {
      console.log('app will leave')
     }

presentContOrderConfirm(order_id,remark,contDate) {
       var token = localStorage.getItem('user_token');
       
       var xxdate = contDate;
       var yydate = xxdate.split('T');
       var zzdate = yydate[1].split('.');
       console.log("time of notification" ,yydate[0]+" "+zzdate[0]);
       var ourDate = yydate[0]+" "+zzdate[0];
       
      let alert = this.alertCtrl.create({
        title: this.translate.instant("contorder"),
        message: remark+"<br/>"+ourDate+"<br>"+" هل تريد تأكيد الموعد؟",
        buttons: [
          {
            text: this.translate.instant("disagree"),
            role: 'cancel',
            handler: () => {
              console.log('confirm contorder  disagree clicked');

              this.service.updateOrderStatusToCancel(order_id,token).subscribe(
                resp=>{
                  console.log("resp cancel contOrder",resp);
                  if(JSON.parse(JSON.stringify(resp)).success)
                  {
                    this.presentToast("تم الغاء الموعد");
                    console.log("الغاء")
                    this.events.publish('x');
                  }
                    
                },err=>{
                  console.log("err cancel contOrder",err);
                  this.presentToast("خطأ فى الاتصال");
                }
              );
            }
          },
          {
            text: this.translate.instant("agree"),
            handler: () => {
              console.log('confirm contorder agree clicked');

              this.service.updateOrderStatusToAgreeTime(order_id,token).subscribe(
                resp=>{
                  console.log("resp cancel contOrder",resp);
                  if(JSON.parse(JSON.stringify(resp)).success)
                  {
                    this.presentToast("تم تأكيد الموعد");
                    console.log("تاكيد");
                    this.events.publish('y');
                  }
                    
                },err=>{
                  console.log("err cancel contOrder",err);
                  this.presentToast("خطأ فى الاتصال");
                }
              );
            }
          }
        ]
      });
      alert.present();
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

