import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, NavController, MenuController, AlertController, ActionSheetController, Events, ToastController, IonicApp } from 'ionic-angular';
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
import { Market } from '@ionic-native/market';
//import { AboutAppPage } from '../pages/about-app/about-app';
//import { ConditionsPage } from '../pages/conditions/conditions';
//import { ContactusPage } from '../pages/contactus/contactus';


import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { AboutAppPage } from '../pages/about-app/about-app';

import { LoginserviceProvider } from '../providers/loginservice/loginservice';
import { RefreshTokenInterceptorProvider } from '../providers/refresh-token-interceptor/refresh-token-interceptor';

import * as firebase from 'firebase/app';
import { HomePage } from '../pages/home/home';
import { FollowOrderForPlcPage } from '../pages/follow-order-for-plc/follow-order-for-plc';
import { stagger } from '@angular/core/src/animation/dsl';
import { SliderPage } from '../pages/slider/slider';


var firebaseConfig = {
  apiKey: "AIzaSyBPvbu83CtqeV67AihfGfwxKRzq4ExENNo",
  authDomain: "aldoctor-b33ed.firebaseapp.com",
  databaseURL: "https://aldoctor-b33ed.firebaseio.com",
  projectId: "aldoctor-b33ed",
  storageBucket: "aldoctor-b33ed.appspot.com",
  messagingSenderId: "381921023811"
};

@Component({
  templateUrl: 'app.html',
  providers: [Push]
})
export class MyApp {
  @ViewChild(Nav) navctrl: Nav;
  @ViewChild("content") nav: NavController
  rootPage: any;
  dir: any;
  langDirection: string;
  image = "assets/imgs/default-avatar.png";
  name = "";

  app_share = "item_unselected";
  app_rate = "item_unselected";
  app_logout = "item_unselected";
  app_about = "item_unselected";
  app_contact = "item_unselected";
  app_conditions = "item_unselected";
  app_complaint = "item_unselected";

  backBtnFlag = false;
  tostClass;

  userLoged;

  accessToken;

  // private appRate: AppRate,
  constructor(public events: Events, public service: LoginserviceProvider,
    private alertCtrl: AlertController, private push: Push,
    public storage: Storage, public socialSharing: SocialSharing,
    public helper: HelperProvider, public menu: MenuController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    statusBar: StatusBar, splashScreen: SplashScreen,
    public translate: TranslateService, private market: Market,
    public app: App, public toastCtrl: ToastController,
    public ionicApp:IonicApp) {
//Register event that fired when user login successfully.
events.subscribe('user:userLoginSucceeded', () => {
  this.userLoged = true
});

      events.subscribe('user:userLogedout', () => {
        this.userLoged = false;
        console.log("user loged out");
        this.storage.remove("language");
        this.storage.remove("user_info").then(() => {
              localStorage.removeItem('refresh_token');
              this.service.logmeout(()=>{},()=>{})
              localStorage.removeItem('user_token');
              this.userLoged = false;
              this.nav.setRoot(LoginPage);
              
            })
      });




    console.log("current lang: ", this.helper.currentLang);
    if (this.helper.currentLang == 'ar') {
      this.dir = "right";
    } else {
      this.dir = "left";
    }
    this.tostClass = "toastRight";
    firebase.initializeApp(firebaseConfig);
    // this.helper.checkConnection();

    this.events.subscribe('changeProfilePic', (data) => {
      console.log(" event change profile pic  ", data);
      this.image = data.pic;

      storage.get("user_info").then((val) => {
        if (val) {
          console.log(" get name for side menu", val);
          this.image = val.profile_pic;
          this.name = val.name

        }
      });


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
      if (val) {
        console.log(" verification_page from storage", val);
        // this.rootPage = 'verification-code';



        //ayaaaa
        //#region 27-10-2020
        this.accessToken = localStorage.getItem('user_token');

          this.service.getuserProfile(this.accessToken).subscribe(
              resp => {
                var newuserData = JSON.parse(JSON.stringify(resp));

                //user activared
                if(newuserData.status == "1") {

                  this.storage.remove("verification_page");

                  this.rootPage = LoginPage;
                     
                } else {
                  this.rootPage = 'verification-code';
                }
                
              },err => {
                console.log("errorrrr");
              }
            );

        //#endregion

      } else {





        console.log("else verification_page from storage", val);
        // this.rootPage = TabsPage;
        storage.get("user_info").then((val) => {
          if (val) {
            console.log(" if get user info from storage", val);
            this.image = val.profile_pic;
            this.name = val.name;
            this.rootPage = TabsPage;
            this.userLoged = true

          } else {
            console.log("else get user info from storage", val);

            // this.rootPage = 'slider';
            // this.rootPage = LoginPage;
            storage.get("slider").then((val) => {
              if (val) {
                console.log(" if get slider from storage", val);


                this.rootPage = LoginPage;


              } else {
                console.log("else get slider from storage", val);



                this.rootPage = SliderPage;

              }



            });

          }
        });






      }
    }).catch(
      (err) => {
        console.log("err from verification_page stoage", err);
        // this.rootPage = TabsPage;
        storage.get("user_info").then((val) => {
          if (val) {
            console.log(" catch get user info from storage", val);
            this.image = val.profile_pic;
            this.name = val.name;
            this.rootPage = TabsPage;


          } else {
            console.log("catch get user info from storage", val);
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
      setTimeout(()=>{

      this.pushnotification();
    }, 1000);

    

      //translate.setDefaultLang('en');
      // translate.use('en');

      //remove scroll in splash and change color to status bar
      // statusBar.overlaysWebView(false);
      // statusBar.backgroundColorByHexString("#418f6a");
      // add this line in config.xml
      // <preference name="ShowSplashScreenSpinner" value="false" />

      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString("#418f6a");
      splashScreen.hide();
      this.defaultLang();
      //this.initializeApp();
      //splashScreen.show();
    });

    if (platform.is('ios')) {
      this.helper.device_type = "0";
    } else {
      this.helper.device_type = "1";
    }

    platform.registerBackButtonAction(() => {
      console.log("back btn ");
      //  this.app.viewWillLeave.subscribe(view=>{
      //   console.log("view will leave ",view);
      //   if(view.id == "remaining-time-for-plc")
      //     this.events.publish('cancelOrder');
      //   else if (view.id == "remaining-time-to-accept")
      //     this.events.publish('cancelDoctorOrder');
      //  });
      console.log("this.app.getActiveNavs()", this.app.getActiveNavs());
      let nav = this.app.getActiveNavs()[0];
      console.log("nav: ", nav)
      console.log("view : ", this.helper.view)
      this.backBtnFlag = this.helper.backBtnInHelper;
      // && this.backBtnFlag == false
      // && this.backBtnFlag == false

      if (this.helper.view == "remaining-time-for-plc") {
        //this.backBtnFlag = true;
        // this.helper.backBtnInHelper = true;
        console.log("if to fire cancelOrder event");

        this.backpresentCancelConfirm();

      }
      else if (this.helper.view == "remaining-time-to-accept") {
        //this.backBtnFlag = true;
        // this.helper.backBtnInHelper = true;
        console.log("if to fire cancelDoctorOrder event");
        // this.events.publish('cancelDoctorOrder');
        this.backpresentCancelConfirmForDoc();

      }
      else if (this.helper.view == "HomePage" || this.helper.view == "LoginPage" || this.helper.view == "NotificationPage" || this.helper.view == "OrderhistoryPage" || this.helper.view == "ProfilePage")
        this.platform.exitApp();

      else if (this.helper.view == "pop") { 
        nav.pop();

        //ayaaaaaaaa
        let activePortal = ionicApp._overlayPortal.getActive();
        
        if (activePortal) {
          activePortal.dismiss();
        }
        ////////////

      }
      else if (this.helper.view == "follow") {
        nav.pop();
        nav.parent.select(0);
        // nav.setRoot(TabsPage);
      }
      else
        this.platform.exitApp();

    });
  }
  defaultLang() {
    this.translate.use('ar');
    this.helper.currentLang = 'ar';
    this.translate.setDefaultLang('ar');
    this.helper.lang_direction = 'rtl';
    this.langDirection = "rtl";
    this.platform.setDir('rtl', true);


  }

  menuOpened() {
    console.log("menu opened");
    this.app_share = "item_unselected";
    this.app_rate = "item_unselected";
    this.app_logout = "item_unselected";
    this.app_about = "item_unselected";
    this.app_contact = "item_unselected";
    this.app_conditions = "item_unselected";
    this.app_complaint = "item_unselected";
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
    this.app_complaint = "item_unselected";

    if (this.helper.currentLang == 'ar') {
      this.dir = "right";
    } else {
      this.dir = "left";
    }

    this.nav.setRoot(page.component);
  }

  share() {
    if (this.app_share == "item_unselected") {
      this.app_share = "item_selected";
      this.app_about = "item_unselected";
      this.app_conditions = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_logout = "item_unselected";
      this.app_rate = "item_unselected";
      this.app_complaint = "item_unselected";
    }

    console.log("share app");
 
    var shareLink;
    // if (this.platform.is('ios')) {

    //   shareLink = "https://itunes.apple.com/us/app/aldoctor-%D8%A7%D9%84%D8%AF%D9%83%D8%AA%D9%88%D8%B1/id1440723878?ls=1&mt=8";
    // } else {
    //   shareLink = "https://play.google.com/store/apps/details?id=net.ITRoots.Patient";
    // }
  
    shareLink = "http://onelink.to/78nns3";

    this.socialSharing.share("تطبيق الدكتور", null , null , shareLink).then(() => {
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
  apprate() {
    if (this.app_rate == "item_unselected") {
      this.app_rate = "item_selected";
      this.app_about = "item_unselected";
      this.app_conditions = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_logout = "item_unselected";
      this.app_share = "item_unselected";
      this.app_complaint = "item_unselected";
    }

    //     this.appRate.preferences.useLanguage = "ar";
    //     this.appRate.preferences = {
    //       // openStoreInApp: false,
    //       useLanguage:"ar",
    //       displayAppName: 'الدكتور',
    //       // usesUntilPrompt: 2,
    // //      promptAgainForEachNewVersion: false,
    //       simpleMode:true,
    //       storeAppURL: {
    //         // ios: '1216856883',
    //         android: 'market://details?id=net.ITRoots.Patient'
    //       }
    //       ,
    //       customLocale: {
    //         title: 'هل يعجبك تطبيق الدكتور؟',
    //         message: 'اذا اعجبك تطبيق الدكتور , هل تمانع من اخذ دقيقه لتقيمه؟ شكرا لدعمك',
    //         cancelButtonLabel: 'الغاء',
    //         laterButtonLabel:" ",
    //         rateButtonLabel: 'قيم الآن'
    //       },
    //       callbacks: {
    //         onRateDialogShow: function(callback){
    //           console.log('rate dialog shown!');
    //         },
    //         onButtonClicked: function(buttonIndex){
    //           console.log('Selected index: -> ' + buttonIndex);
    //           //in order
    //         }
    //       }
    //     };

    //     // Opens the rating immediately no matter what preferences you set
    //     this.appRate.promptForRating(true);
    let market 
if (this.platform.is('ios')) {
 market = "id1440723878"
}
else {
  market = "net.ITRoots.Patient"
}
    this.market.open(market);
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
  openAboutapppage() {
    if (this.app_about == "item_unselected") {
      this.app_about = "item_selected";
      this.app_share = "item_unselected";
      this.app_conditions = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_logout = "item_unselected";
      this.app_complaint = "item_unselected";
      this.app_rate = "item_unselected";
    }

    this.navctrl.push('about-app');
    this.menu.close();


  }
  setting() {
    this.navctrl.push('settings');
    this.menu.close();
    // this.platform.setDir('ltr',true);
  }

  complaints() {
    if (this.app_complaint == "item_unselected") {
      this.app_complaint = "item_selected";
      this.app_about = "item_unselected";
      this.app_conditions = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_share = "item_unselected";
      this.app_rate = "item_unselected";
      this.app_logout = "item_unselected";
    }
    this.navctrl.push('Complaints');
    this.menu.close();

  }

  logout() {

    this.helper.registeredCityId = "";
    this.helper.selectedCityId = "";


    if (this.app_logout == "item_unselected") {
      this.app_logout = "item_selected";
      this.app_about = "item_unselected";
      this.app_conditions = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_share = "item_unselected";
      this.app_rate = "item_unselected";
      this.app_complaint = "item_unselected";
    }

    // this.storage.get("access_token").then(data=>{
    var accessToken = localStorage.getItem('user_token');
    //this.accessToken = data;
    this.service.updateNotification(0, accessToken).subscribe(
      resp => {
        console.log("resp from updateNotification ", resp);
        
          this.userLoged = false;
          console.log("user loged out");
          this.storage.remove("language");
          this.storage.remove("user_info").then(() => {
                localStorage.removeItem('refresh_token');
                this.service.logmeout(()=>{},()=>{})
                localStorage.removeItem('user_token');
                this.userLoged = false;
                this.nav.setRoot(LoginPage);
                
              })
        
      }, err => {
        console.log("err from updateNotification ", err);
      }
    );
    // });


  }
  contact() {
    if (this.app_contact == "item_unselected") {
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
  opensuggest() {
    // alert("here")
    if (this.app_conditions == "item_unselected") {
      this.app_conditions = "item_selected";
      this.app_about = "item_unselected";
      this.app_share = "item_unselected";
      this.app_contact = "item_unselected";
      this.app_logout = "item_unselected";
      this.app_rate = "item_unselected";
      this.app_complaint = "item_unselected";
    }

    this.navctrl.push('conditions')
    this.menu.close()

  }

  pushnotification() {
    // android options
    //senderID: "403805018537",
    //      icon: "drawable-ldpi-icon", //icon
    //  iconColor: "#64B5F6",
    //  forceShow: false,
    //  clearNotifications: false
    //  sound: true

    let options: PushOptions
    options = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      }
    }
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log("notification " + JSON.stringify(notification))

      console.log("notification.additionalData.OrderID: "+notification.additionalData.OrderID);

      this.translate.use('ar');

      if (this.platform.is('ios')) {
        console.log("ios notification", notification);
        if (notification.additionalData["gcm.notification.OrderID"]){
        // if (notification.additionalData.foreground == true) {
        //   console.log("foreground ios notification", notification);

        //   let alert = this.alertCtrl.create({
        //     title: notification["title"],
        //     message: notification["message"],
        //     buttons: [
        //       {
        //         text: 'إلغاء',
        //         role: 'cancel',
        //         handler: () => {
        //           console.log('Cancel clicked');
        //         }
        //       },
        //       {
        //         text: 'عرض',
        //         handler: () => {
        //           console.log('show notification clicked');
        //           this.handlenotifications(notification);
        //           // if (notification.additionalData["gcm.notification.orderid"] == "0" || notification.additionalData["gcm.notification.type"] == "1" || notification.additionalData["gcm.notification.type"] == "3") {
        //           //   // this.storage.get('access_token').then((val) => {

        //           //   //   if (!(val == null)) {
        //           //   //     this.helper.appAccess = val
        //           //       this.nav.setRoot(TabsPage).then(() => {
        //           //         this.nav.push('OfferModelPage', { TypeName: notification.additionalData["gcm.notification.type"], NameItem: notification.additionalData["gcm.notification.ID"], pageName: "notification",Sub_category_name_ar: notification["title"] })
        //           //         console.log("noti id type" + notification.additionalData["gcm.notification.ID"] + " " + notification.additionalData["gcm.notification.type"])
        //           //       })
        //           //   //   }
        //           //   // })

        //           // }

        //         }
        //       }
        //     ]
        //   });
        //   alert.present();

        // }
       // else {
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
       // }

       }//end of if  !notification.additionalData.OrderID
      else{
        //ayaaaaa
        //general notification
        console.log("general notification!!");
        this.nav.setRoot(TabsPage);  
        this.nav.push(NotificationPage,{"fromNotification":true}); 
        return;
      }

      }
      //android
      else {

        console.log("android");

        console.log("notification from android", notification);
if (notification.additionalData.OrderID){
        if (notification.additionalData.type_id == "1" || notification.additionalData.type_id == "2" || notification.additionalData.type_id == "3" || notification.additionalData.type_id == "5") {
          //this.alert("type_id: "+notification.additionalData.type_id+"status: "+notification.additionalData.type_id);
          var orderId = notification.additionalData.OrderID;

          console.log("notification from status", notification.additionalData.order_status);
          console.log("id of order", notification.additionalData.OrderID, "xorderId", orderId);
          console.log("data", data);

          this.helper.type_id = notification.additionalData.type_id;

          var orderStatus = notification.additionalData.order_status;


          var data = {
            doctorId: notification.additionalData.doctorId,
            orderId: orderId
          };

          if (orderStatus == "10" || orderStatus == "3") {
            console.log("status 10 or 3");
            // this.storage.remove("orderImages"); 
            this.events.publish('status0ForPLC');
          }

          if (orderStatus == "2") {
            //this.alert("from status 2 : type_id: "+notification.additionalData.type_id+"status: "+notification.additionalData.type_id);
            this.events.publish('status2ForPLC', data);
            console.log("then back to notification status 2 after publish");
            console.log("data to follow order", "orderId", orderId
              , "doctorId", notification.additionalData.doctorId);
            this.nav.setRoot(TabsPage).then(x=>{
              console.log("then tabs")
              this.nav.push(FollowOrderForPlcPage,
                {
                  data2:
                  {
                    "orderId": orderId,
                    "doctorId": notification.additionalData.doctorId,
                    "order_status":notification.additionalData.order_status
                  }
                });
            })
            // this.nav.push(FollowOrderForPlcPage,
            //   {
            //     data2:
            //     {
            //       "orderId": orderId,
            //       "doctorId": notification.additionalData.doctorId
            //     }
            //   });

            console.log("after set pages home , followorderforplc");

          }

          //ayaaaaa
          if (orderStatus == "16") {
            this.events.publish('status2ForPLC', data);
     
            console.log("data to follow order", "orderId", orderId, "doctorId", notification.additionalData.doctorId);

            if(!notification.additionalData.foreground) {
              this.nav.setRoot(TabsPage).then(x=>{
                console.log("then tabs")
                this.nav.push(FollowOrderForPlcPage,
                  {
                    data2:
                    {
                      "orderId": orderId,
                      "doctorId": notification.additionalData.doctorId,
                      "order_status":notification.additionalData.order_status
                    }
                  });
              })
            } else {
              this.presentOrderAssigningAlert(notification.title, notification.message,orderId,notification.additionalData.doctorId,notification.additionalData.order_status);
            }
          }

          if (orderStatus == "11") {
            console.log("status 11");
            
            // this.storage.remove("orderImages");

            if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
            {
            this.events.publish('status2ForPLC', data);
            this.presentAlert(notification.title, notification.message + "<br> للأسباب التالية: <br>" + notification.additionalData.reasons);
            this.helper.removeNetworkDisconnectionListener();

            this.nav.setRoot(TabsPage);
            // this.nav.push(FollowOrderForPlcPage,
            //   {
            //     data2:
            //     {
            //       "orderId": orderId,
            //       "doctorId": notification.additionalData.doctorId
            //     }
            //   });

            }else{
              this.presentAlert(notification.title, notification.message + "<br> للأسباب التالية: <br>" + notification.additionalData.reasons);
            this.helper.removeNetworkDisconnectionListener();
            }
          }
          if (orderStatus == "8") {
            //بدء التوصيل


            if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
            {
            this.events.publish('status2ForPLC', data);
            this.presentdelivaryAlert(notification.title, notification.message,notification.additionalData.totalPrice);
            this.events.publish('status8ForPLC');

            this.nav.setRoot(TabsPage);
            this.nav.push(FollowOrderForPlcPage,
              {
                data2:
                {
                  "orderId": orderId,
                  "doctorId": notification.additionalData.doctorId
                }
              });

            }else{
              this.presentdelivaryAlert(notification.title, notification.message,notification.additionalData.totalPrice);
            this.events.publish('status8ForPLC');
            }

            
          }
          if (orderStatus == "12") {
            if (!notification.additionalData.remark)
              notification.additionalData.remark = "";

            if (!notification.additionalData.date)
              notification.additionalData.date = "";


              if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
            {
              console.log("remaining satatu 2 plc",this.helper.view);
            this.events.publish('status2ForPLC', data);
            // this.presentContOrderConfirm(notification.additionalData.OrderID, notification.additionalData.remark, notification.additionalData.date);
            // this.helper.removeNetworkDisconnectionListener();
            // this.nav.setRoot(TabsPage);
           
            }
              this.presentContOrderConfirm(notification.additionalData.OrderID, notification.additionalData.remark, notification.additionalData.date);
              this.helper.removeNetworkDisconnectionListener();
  
              
            
            

          }


          if (orderStatus == "5") {
            // if(this.helper.orderRated == 0)
            // {
            // this.events.publish('status5');

            this.helper.removeNetworkDisconnectionListener();

            //  this.storage.remove("orderImages");
            this.helper.dontSendNotification = true;

            this.nav.setRoot(TabsPage);

            this.nav.push('rate-service', {
              data: {
                doctorId: notification.additionalData.doctorId,
                orderId: notification.additionalData.OrderID
              }
            });
            //}
          }
        }
        else {
          this.helper.notification = notification;
          var orderStatus = notification.additionalData.order_status;
          var data = {
            doctorId: notification.additionalData.doctorId,
            orderId: notification.additionalData.OrderID
          };

          if (orderStatus == "10") //cancelled by doctor 0 || snap.val() == "0"
          {
            console.log("doc status 10 , don't do nay thing");
            // this.removeOrder(orderId);
            // this.events.publish('status0');
          }
          else if (orderStatus == "2") {
            this.events.publish("status2");
            this.nav.setRoot(TabsPage)
            // .then(x=>{
            //   console.log("then doctor")
            //   this.nav.push('follow-order',
            //   {
            //     data:
            //     {
            //       "orderId": data.orderId,
            //       "doctorId": data.doctorId
            //     }
            //   });
            // });
            this.nav.push('follow-order',
              {
                data:
                {
                  "orderId": data.orderId,
                  "doctorId": data.doctorId
                }
              });
          }
          else if (orderStatus == "3") //no respond
          {
            // this.removeOrder(orderId);
            // this.events.publish('status0');
            console.log("dooc status 3");
          }
          else if (orderStatus == "5" || orderStatus == "6") //5->finished , 6->finished with reorder
          {
            //this.getServiceProfileIdToRate(orderId);        
            this.nav.setRoot(TabsPage);
            this.nav.push('rate-doctor', {
              data: {
                doctorId: notification.additionalData.doctorId,
                orderId: notification.additionalData.OrderID
              }
            });

          }
          else if (orderStatus == "7") {//start detection
            if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
            {
              // this.events.publish('status7');
              this.events.publish("status2");
              this.nav.setRoot(TabsPage);
              this.nav.push('follow-order',
                {
                  data:
                  {
                    "orderId": data.orderId,
                    "doctorId": data.doctorId,
                    "order_status":orderStatus
                  }
                });
            }  
            else
            this.events.publish('status7');
          }

          else if (orderStatus == "8") { // move to patient
            if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
            {
              this.events.publish("status2");
              this.nav.setRoot(TabsPage);
              this.nav.push('follow-order',
                {
                  data:
                  {
                    "orderId": data.orderId,
                    "doctorId": data.doctorId,
                    "order_status":orderStatus
                  }
                });
                // this.events.publish('status8');
            }  else
            this.events.publish('status8');
          }
          else if (orderStatus == "12") {
            if (!notification.additionalData.remark)
              notification.additionalData.remark = "";

            if (!notification.additionalData.date)
              notification.additionalData.date = "";


              if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
            {
              console.log("remaining satatu 2 plc",this.helper.view);
            this.events.publish('status2ForPLC', data);
            // this.presentContOrderConfirm(notification.additionalData.OrderID, notification.additionalData.remark, notification.additionalData.date);
            // this.helper.removeNetworkDisconnectionListener();
            // this.nav.setRoot(TabsPage);
           
            }
              this.presentContOrderConfirm(notification.additionalData.OrderID, notification.additionalData.remark, notification.additionalData.date);
              this.helper.removeNetworkDisconnectionListener();
  
              
            
            

          }

          else if (orderStatus == "11") {
            console.log("doc status 11 ")
            if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
            {
              this.events.publish("status2");
              // this.nav.setRoot(TabsPage);
              this.presentAlert(notification.title, notification.message + "<br> للأسباب التالية: <br>" + notification.additionalData.reasons);

            }else
            this.presentAlert(notification.title, notification.message + "<br> للأسباب التالية: <br>" + notification.additionalData.reasons);

          }


          //ayaaaaaaaaaaa
          else if (orderStatus == "20") {
            if(notification.additionalData.foreground) {
              this.presentReportAlert(notification.title, notification.message,data.orderId);
              
            } else {
              this.nav.setRoot(TabsPage);
              this.nav.push('ShowReportPage',{"recievedItem": data.orderId});
            }
          }
          ///////////////




        }
      }//end of if  !notification.additionalData.OrderID
      else{
        
        //ayaaaaaaaaa
        console.log("general notification");
        this.nav.setRoot(TabsPage);  
        this.nav.push(NotificationPage,{"fromNotification":true});    
        /////////////
        
        // alert("general notification");
        // if(notification.additionalData.foreground) {
        //   this.presentReportAlert(notification.title, notification.message,data.orderId);
          
        // } else {
        //   this.nav.setRoot(TabsPage);
        //   this.nav.push("NotificationPage");          
        // }
        return
      }
      //returns view controller obj 
    }

    });
    pushObject.on('registration').subscribe((registration: any) => {
      console.log("registraion : ", registration);
      console.log("registrationId " + registration.registrationId)
      this.helper.registration = registration.registrationId;


      // if (localStorage.getItem("firebaseRegNoti")) {
      //   if (localStorage.getItem("firebaseRegNoti") == registration.registrationId) {
      //     localStorage.setItem("regChanged", "0")
      //   }
      //   else {
      //     localStorage.setItem("regChanged", "1")
      //     localStorage.setItem("firebaseRegNoti", registration.registrationId)

      //   }
      // }


    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  handlenotifications(notification) {

    console.log("ios");

    console.log("notification from ios", notification);

    if (notification.additionalData["gcm.notification.type_id"] == "1" || notification.additionalData["gcm.notification.type_id"]  == "2" || notification.additionalData["gcm.notification.type_id"]  == "3" || notification.additionalData["gcm.notification.type_id"] == "5") {
      //this.alert("type_id: "+notification.additionalData.type_id+"status: "+notification.additionalData.type_id);
      var orderId = notification.additionalData["gcm.notification.OrderID"] ;

      console.log("notification from status", notification.additionalData["gcm.notification.order_status"]);
      console.log("id of order", notification.additionalData["gcm.notification.OrderID"], "xorderId", orderId);
      console.log("data", data);

      this.helper.type_id = notification.additionalData["gcm.notification.type_id"];

      var orderStatus = notification.additionalData["gcm.notification.order_status"];


      var data = {
        doctorId: notification.additionalData["gcm.notification.doctorId"],
        orderId: orderId
      };

      if (orderStatus == "10" || orderStatus == "3") {
        console.log("status 10 or 3");
        // this.storage.remove("orderImages"); 
        this.events.publish('status0ForPLC');
      }

    
      if (orderStatus == "2") {
        //this.alert("from status 2 : type_id: "+notification.additionalData.type_id+"status: "+notification.additionalData.type_id);
        this.events.publish('status2ForPLC', data);
        console.log("back to notification status 2 after publish");
        console.log("data to follow order", "orderId", orderId
          , "doctorId", notification.additionalData["gcm.notification.doctorId"]);
        this.nav.setRoot(TabsPage);
        this.nav.push(FollowOrderForPlcPage,
          {
            data2:
            {
              "orderId": orderId,
              "doctorId": notification.additionalData["gcm.notification.doctorId"],
              "order_status":notification.additionalData["gcm.notification.order_status"]
            }
          });

        console.log("after set pages home , followorderforplc");

      }

      //ayaaaaaa
      if (orderStatus == "16") {
        this.events.publish('status2ForPLC', data);
        console.log("data to follow order", "orderId", orderId, "doctorId", notification.additionalData["gcm.notification.doctorId"]);

        if(!notification.additionalData["foreground"]) {
          this.nav.setRoot(TabsPage);
          this.nav.push(FollowOrderForPlcPage,
            {
              data2:
              {
                "orderId": orderId,
                "doctorId": notification.additionalData["gcm.notification.doctorId"],
                "order_status":notification.additionalData["gcm.notification.order_status"]
              }
            });
        } else {
          this.presentOrderAssigningAlert(notification["title"], notification["message"],orderId,notification.additionalData["gcm.notification.doctorId"],notification.additionalData["gcm.notification.order_status"]);
        }
      }

      if (orderStatus == "11") {
        console.log("status 11");
        
        // this.storage.remove("orderImages");

        if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
        {
        this.events.publish('status2ForPLC', data);
        this.presentAlert(notification["title"], notification["message"] + "<br> للأسباب التالية: <br>" + notification.additionalData["gcm.notification.reasons"]);
        this.helper.removeNetworkDisconnectionListener();

        this.nav.setRoot(TabsPage);
        // this.nav.push(FollowOrderForPlcPage,
        //   {
        //     data2:
        //     {
        //       "orderId": orderId,
        //       "doctorId": notification.additionalData["gcm.notification.doctorId"]
        //     }
        //   });

        }else{
          this.presentAlert(notification["title"], notification["message"] + "<br> للأسباب التالية: <br>" + notification.additionalData["gcm.notification.reasons"]);
        this.helper.removeNetworkDisconnectionListener();
        }
      }
      if (orderStatus == "8") {
        //بدء التوصيل


        if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
        {
        this.events.publish('status2ForPLC', data);
        this.presentdelivaryAlert(notification["title"], notification["message"],notification.additionalData["gcm.notification.totalPrice"]);
        this.events.publish('status8ForPLC');

        this.nav.setRoot(TabsPage);
        this.nav.push(FollowOrderForPlcPage,
          {
            data2:
            {
              "orderId": orderId,
              "doctorId": notification.additionalData["gcm.notification.doctorId"]
            }
          });

        }else{
          this.presentdelivaryAlert(notification.title, notification.message,notification.additionalData["gcm.notification.totalPrice"]);
        this.events.publish('status8ForPLC');
        }

        
      }
      if (orderStatus == "12") {
        if (!notification.additionalData["gcm.notification.remark"])
          notification.additionalData["gcm.notification.remark"] = "";

        if (!notification.additionalData["gcm.notification.date"])
          notification.additionalData["gcm.notification.date"] = "";


          if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
        {
          console.log("remaining satatu 2 plc",this.helper.view);
        this.events.publish('status2ForPLC', data);
        // this.presentContOrderConfirm(notification.additionalData.OrderID, notification.additionalData.remark, notification.additionalData.date);
        // this.helper.removeNetworkDisconnectionListener();
        // this.nav.setRoot(TabsPage);
       
        }
          this.presentContOrderConfirm(notification.additionalData["gcm.notification.OrderID"] , notification.additionalData["gcm.notification.remark"], notification.additionalData["gcm.notification.date"]);
          this.helper.removeNetworkDisconnectionListener();

          
        
        

      }


      if (orderStatus == "5") {
        // if(this.helper.orderRated == 0)
        // {
        // this.events.publish('status5');

        this.helper.removeNetworkDisconnectionListener();

        //  this.storage.remove("orderImages");
        this.helper.dontSendNotification = true;

        this.nav.setRoot(TabsPage);

        this.nav.push('rate-service', {
          data: {
            doctorId: notification.additionalData["gcm.notification.doctorId"],
            orderId: notification.additionalData["gcm.notification.OrderID"]
          }
        });
        //}
      }
    }
    else {
      this.helper.notification = notification;
      var orderStatus = notification.additionalData["gcm.notification.order_status"];
      var data = {
        doctorId: notification.additionalData["gcm.notification.doctorId"],
        orderId: notification.additionalData["gcm.notification.OrderID"]
      };

      if (orderStatus == "10") //cancelled by doctor 0 || snap.val() == "0"
      {
        console.log("doc status 10 , don't do nay thing");
        // this.removeOrder(orderId);
        // this.events.publish('status0');
      }
      else if (orderStatus == "2") {
        this.events.publish("status2");
        this.nav.setRoot(TabsPage);
        this.nav.push('follow-order',
          {
            data:
            {
              "orderId": data.orderId,
              "doctorId": data.doctorId
            }
          });
      }
      else if (orderStatus == "3") //no respond
      {
        // this.removeOrder(orderId);
        // this.events.publish('status0');
        console.log("dooc status 3");
      }
      else if (orderStatus == "5" || orderStatus == "6") //5->finished , 6->finished with reorder
      {
        //this.getServiceProfileIdToRate(orderId);        
        this.nav.setRoot(TabsPage);
        this.nav.push('rate-doctor', {
          data: {
            doctorId: notification.additionalData["gcm.notification.doctorId"],
            orderId: notification.additionalData["gcm.notification.OrderID"]
          }
        });

      }
      else if (orderStatus == "7") {//start detection
        if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
        {
          // this.events.publish('status7');
          this.events.publish("status2");
          this.nav.setRoot(TabsPage);
          this.nav.push('follow-order',
            {
              data:
              {
                "orderId": data.orderId,
                "doctorId": data.doctorId,
                "order_status":orderStatus
              }
            });
        }  
        else
        this.events.publish('status7');
      }
     else  if (orderStatus == "12") {
        if (!notification.additionalData["gcm.notification.remark"])
          notification.additionalData["gcm.notification.remark"] = "";

        if (!notification.additionalData["gcm.notification.date"])
          notification.additionalData["gcm.notification.date"] = "";


          if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
        {
          console.log("remaining satatu 2 plc",this.helper.view);
        this.events.publish('status2ForPLC', data);
        // this.presentContOrderConfirm(notification.additionalData.OrderID, notification.additionalData.remark, notification.additionalData.date);
        // this.helper.removeNetworkDisconnectionListener();
        // this.nav.setRoot(TabsPage);
       
        }
          this.presentContOrderConfirm(notification.additionalData["gcm.notification.OrderID"] , notification.additionalData["gcm.notification.remark"], notification.additionalData["gcm.notification.date"]);
          this.helper.removeNetworkDisconnectionListener();

          
        
        

      }
      else if (orderStatus == "8") { // move to patient
        if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
        {
          this.events.publish("status2");
          this.nav.setRoot(TabsPage);
          this.nav.push('follow-order',
            {
              data:
              {
                "orderId": data.orderId,
                "doctorId": data.doctorId,
                "order_status":orderStatus
              }
            });
            // this.events.publish('status8');
        }  else
        this.events.publish('status8');
      }
      else if (orderStatus == "11") {
        console.log("doc status 11 ")
        if (this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
        {
          this.events.publish("status2");
          // this.nav.setRoot(TabsPage);
          this.presentAlert(notification["title"], notification["message"] + "<br> للأسباب التالية: <br>" + notification.additionalData["gcm.notification.reasons"]);

        }else
        this.presentAlert(notification["title"], notification["message"] + "<br> للأسباب التالية: <br>" + notification.additionalData["gcm.notification.reasons"]);

      }


      //ayaaaaaaaaaaa
      else if (orderStatus == "20") {

        if(notification.additionalData["foreground"]) {
          this.presentReportAlert(notification["title"], notification["message"],notification.additionalData["gcm.notification.OrderID"]);
          
        } else {
          // this.events.publish("status2");
          this.nav.setRoot(TabsPage);
          this.nav.push('ShowReportPage',{"recievedItem": notification.additionalData["gcm.notification.OrderID"]});
        }
      }
      ///////////////
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


  presentAlert(title, msg) {
    console.log("enter presentAlert");
    // this.navctrl.setRoot(TabsPage);
    console.log("helper view", this.helper.view);
    if (this.helper.view == "follow" || this.helper.view == "remaining-time-to-accept" || this.helper.view == "remaining-time-for-plc")
      this.navctrl.setRoot(TabsPage);

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['موافق']
    });
    alert.present();
  }

  presentdelivaryAlert(title, msg,totalPrice) {
    
   var price = ""
   var xLe = ""
   var xpt = ""

   var totalPriceArr = totalPrice.split(".");
   xLe = totalPriceArr[0];
   xpt = totalPriceArr[1];
   console.log("xLe: "+xLe);
   console.log("xpt: "+xpt);

   console.log("type_id : ",this.helper.type_id)
   if (this.helper.type_id == 1 )
    price = "سعر الدواء : " + xLe + " جنيه " + xpt + " قرش "
    else if (this.helper.type_id == 2 )
    price = "سعر الأشعة : " + xLe + " جنيه " + xpt + " قرش "
   else if (this.helper.type_id == 3 )
    price = "سعر التحاليل : " + xLe + " جنيه "+ "و " + xpt + " قرش "

    console.log("enter presentdelivaryAlert");
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg ,
      message:  price,
      cssClass: 'foo',
      buttons: ['موافق']
    });
    alert.present();
  }

  presentReportAlert(title, msg,orderId) {
     
     console.log("enter presentdelivaryAlert");
     let alert = this.alertCtrl.create({
       title: title,
       subTitle: msg ,
      //  message:  price,
       cssClass: 'foo',
       buttons: [
         {
           text:"مشاهدة التقرير",
           handler: () => {
            this.nav.setRoot(TabsPage);
            this.nav.push('ShowReportPage',{"recievedItem": orderId});
           }
         },
         {
          text:"تم"
        }
       ]
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

  presentContOrderConfirm(order_id, remark, contDate) {
    var token = localStorage.getItem('user_token');

    //  var xxdate = contDate;
    //  var yydate = xxdate.split('T');
    //  var zzdate = yydate[1].split('.');
    //  console.log("time of notification" ,yydate[0]+" "+zzdate[0]);
    //  var ourDate = yydate[0]+" "+zzdate[0];

    if (!remark)
      remark = "";

    let alert = this.alertCtrl.create({
      title: "إكمال الطلب",
      message: remark + "<br/>" + contDate + "<br>" + " هل تريد تأكيد الموعد؟",
      buttons: [
        
        {
           text: "لاحقا",
          role: 'cancel',
          handler: () => {
            console.log("later btn handler")
            this.nav.setRoot(TabsPage);
          }

        },
        {
          text: "رفض",
          handler: () => {
            console.log('confirm contorder  disagree clicked');

            this.service.getOrderDetails(order_id, token).subscribe(
              resp => {
                console.log("getOrderStatus resp", resp);
                var myOrderStatus = JSON.parse(JSON.stringify(resp)).order.status;
                if (myOrderStatus == "4" || myOrderStatus == "10" || myOrderStatus == "11")
                  this.presentToast("لقد تم إلغاء الطلب");
                else if (myOrderStatus == "13")
                  this.presentToast("لقد تم تأكيد الموعد");

                //ayaaaa
                else if (myOrderStatus == "7" || myOrderStatus == "8")
                  this.presentToast("عفواً .. لقد تم بدء الخدمة بالفعل");
                else if (myOrderStatus == "5" || myOrderStatus == "6")
                  this.presentToast("عفواً .. لقد تم تنفيذ الخدمة بالفعل");
                /////
                else {
                  this.service.updateOrderStatusToCancel(order_id, token).subscribe(
                    resp => {
                      console.log("resp cancel contOrder", resp);
                      if (JSON.parse(JSON.stringify(resp)).success) {
                        this.presentToast("تم إلغاء الموعد");
                        console.log("الغاء");
                        this.nav.setRoot(TabsPage);
                        // this.events.publish('x');
                      }

                    }, err => {
                      console.log("err cancel contOrder", err);
                      // this.presentToast("خطأ فى الاتصال");
                    }
                  );
                }
              }, err => {
                console.log("getOrderStatus err", err);
                // this.presentToast("خطأ فى الاتصال");
              }
            );

            // this.service.updateOrderStatusToCancel(order_id,token).subscribe(
            //   resp=>{
            //     console.log("resp cancel contOrder",resp);
            //     if(JSON.parse(JSON.stringify(resp)).success)
            //     {
            //       this.presentToast("تم الغاء الموعد");
            //       console.log("الغاء")
            //       this.events.publish('x');
            //     }

            //   },err=>{
            //     console.log("err cancel contOrder",err);
            //     this.presentToast("خطأ فى الاتصال");
            //   }
            // );
          }
        },
        {
          text: "موافق",
          handler: () => {
            console.log('confirm contorder agree clicked');


            this.service.getOrderDetails(order_id, token).subscribe(
              resp => {
                console.log("getOrderStatus resp", resp);
                var myOrderStatus = JSON.parse(JSON.stringify(resp)).order.status;
                if (myOrderStatus == "4"  || myOrderStatus == "10" || myOrderStatus == "11")
                  this.presentToast("لقد تم إلغاء الطلب");
                else if (myOrderStatus == "13")
                  this.presentToast("لقد تم تأكيد الموعد");
               
                //ayaaaa
                else if (myOrderStatus == "7" || myOrderStatus == "8")
                this.presentToast("عفواً .. لقد تم بدء الخدمة بالفعل");
                else if (myOrderStatus == "5" || myOrderStatus == "6")
                this.presentToast("عفواً .. لقد تم تنفيذ الخدمة بالفعل");
                /////

                else {
                  this.service.updateOrderStatusToAgreeTime(order_id, token).subscribe(
                    resp => {
                      console.log("resp cancel contOrder", resp);
                      if (JSON.parse(JSON.stringify(resp)).success) {
                        this.presentToast("تم تأكيد الموعد");
                        console.log("تاكيد");
                        // this.events.publish('y');
                        this.nav.setRoot(TabsPage);
                      }

                    }, err => {
                      console.log("err cancel contOrder", err);
                      // this.presentToast("خطأ فى الاتصال");
                    }
                  );
                }
              }, err => {
                console.log("getOrderStatus err", err);
                // this.presentToast("خطأ فى الاتصال");
              }
            );



            // this.service.updateOrderStatusToAgreeTime(order_id,token).subscribe(
            //   resp=>{
            //     console.log("resp cancel contOrder",resp);
            //     if(JSON.parse(JSON.stringify(resp)).success)
            //     {
            //       this.presentToast("تم تأكيد الموعد");
            //       console.log("تاكيد");
            //       this.events.publish('y');
            //     }

            //   },err=>{
            //     console.log("err cancel contOrder",err);
            //     this.presentToast("خطأ فى الاتصال");
            //   }
            // );
          }
        }
      ]
      //, enableBackdropDismiss: false
    });
    alert.present();
  }

  // presentReorderConfirm(msg,orderId,custom_date,date_id) {
  //   let alert = this.alertCtrl.create({
  //     title: "تأكيد موعد الاعادة",
  //     message: msg,
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
  //           console.log('confirm reorder agree clicked');
  //           this.service.reorder(orderId,custom_date,date_id,accessToken).subscribe(
  //             resp=>{
  //               console.log("reorder resp",resp);
  //               this.presentToast( this.translate.instant("sendReorder"));
  //             },
  //             err=>{
  //               console.log("reorder err",err);
  //             }
  //           );            
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }
  alert(notification) {


    let alert = this.alertCtrl.create({
      title: "details",
      message: notification,
      buttons: [
        "ok"
      ]
    });
    alert.present();
  }

  backpresentCancelConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: "هل تريد إلغاء الطلب ؟ ",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
            //this.navCtrl.parent.select(0);
            //          this.alertApear = false;
            console.log("set alertApear to false");

            //        this.helper.backBtnInHelper = false;


          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('cancel order agree clicked');
            var token = localStorage.getItem('user_token');
            this.events.publish('cancelDoctorOrder');
            this.service.cancelorder(this.helper.idForOrderToCancelItFromBack, "", "", token).timeout(10000).subscribe(
              resp => {
                console.log("cancel order resp: ", resp);
                if (JSON.parse(JSON.stringify(resp)).success) {

                  this.presentToast(this.translate.instant("orderCancled"));

                  this.events.publish('cancelOrder');
                  this.nav.setRoot(TabsPage);
                  this.nav.parent.select(2); //1
                }
              },
              err => {
                console.log("cancel order err: ", err);
                this.presentToast(this.translate.instant("serverError"));
              }
            );




            // this.nav.setRoot(TabsPage);

            // this.nav.push('cancel-service',{orderId:this.helper.idForOrderToCancelItFromBack});

          }
        }
      ]
    });
    alert.present();
  }

  backpresentCancelConfirmForDoc() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: "هل تريد إلغاء الطلب ؟ ",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('cancel disagree clicked');

          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('cancel order agree clicked');

            var token = localStorage.getItem('user_token');
            this.events.publish('cancelDoctorOrder');
            this.service.cancelorder(this.helper.idForOrderToCancelItFromBack, "", "", token).timeout(10000).subscribe(
              resp => {
                console.log("cancel order resp: ", resp);
                if (JSON.parse(JSON.stringify(resp)).success) {

                  this.presentToast(this.translate.instant("orderCancled"));
                  this.events.publish('cancelDoctorOrder');
                  this.nav.setRoot(TabsPage);
                  this.nav.parent.select(2); //1
                }
              },
              err => {
                console.log("cancel order err: ", err);
                this.presentToast(this.translate.instant("serverError"));
              }
            );



            //this.nav.push('cancel-order',{orderId:this.helper.idForOrderToCancelItFromBack});

          }
        }
      ]
    });
    alert.present();
  }

   // ayaaaaaa
   presentOrderAssigningAlert(title, msg,orderId,doctorId,orderStatus) {
     
    console.log("enter presentdelivaryAlert");
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      cssClass: 'foo',
      buttons: [
        {
          text:"متابعة الطلب",
          handler: () => {
            this.nav.setRoot(TabsPage).then(x=>{
              console.log("then tabs")
              this.nav.push(FollowOrderForPlcPage,
                {
                  data2:
                  {
                    "orderId": orderId,
                    "doctorId": doctorId,
                    "order_status":orderStatus
                  }
                });
            })
          }
        },
        {
         text:"تم"
       }
      ]
    });
    alert.present();
  }

}

