// import { NgModule, ErrorHandler } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
// import { MyApp } from './app.component';

// import { AboutPage } from '../pages/about/about';
// import { ContactPage } from '../pages/contact/contact';
// import { HomePage } from '../pages/home/home';
// import { TabsPage } from '../pages/tabs/tabs';

// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { LoginserviceProvider } from '../providers/loginservice/loginservice';
// import { HttpClient , HttpClientModule} from '@angular/common/http';
// import { HelperProvider } from '../providers/helper/helper';

// @NgModule({
//   declarations: [
//     MyApp,
//     AboutPage,
//     ContactPage,
//     HomePage,
//     TabsPage
//   ],
//   imports: [
//     BrowserModule,
//     IonicModule.forRoot(MyApp),
//     HttpClientModule
//   ],
//   bootstrap: [IonicApp],
//   entryComponents: [
//     MyApp,
//     AboutPage,
//     ContactPage,
//     HomePage,
//     TabsPage
//   ],
//   providers: [
//     StatusBar,
//     SplashScreen,
//     {provide: ErrorHandler, useClass: IonicErrorHandler},
//     LoginserviceProvider,
//     HttpClient,
//     HelperProvider
//   ]
// })
// export class AppModule {}


import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//import { VerifycodePage } from '../pages/verifycode/verifycode';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
//import { CancelorderPage } from '../pages/cancelorder/cancelorder';
//import { FolloworderPage } from '../pages/followorder/followorder';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationPage } from '../pages/notification/notification';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
//import { SignupPage } from '../pages/signup/signup';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HelperProvider } from '../providers/helper/helper';
import { HttpClientModule } from '@angular/common/http';
import { OrderhistoryPage } from '../pages/orderhistory/orderhistory';
import { AppRate } from '@ionic-native/app-rate';
import { Ionic2RatingModule } from 'ionic2-rating';
import { LoginserviceProvider } from '../providers/loginservice/loginservice';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
//import { OrderDoctorPage } from '../pages/order-doctor/order-doctor';
//import { DoctorEvaluationPage } from '../pages/doctor-evaluation/doctor-evaluation';
//import {SpecializationsPage} from '../pages/specializations/specializations';
//import { SpecificDoctorPage } from '../pages/specific-doctor/specific-doctor';
//import { AboutAppPage } from '../pages/about-app/about-app';
//import { IonicImageLoader } from 'ionic-image-loader';
//import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
//import { ImagePicker } from '@ionic-native/image-picker';
//import { Base64 } from '@ionic-native/base64';
import { Geolocation } from '@ionic-native/geolocation';
import { ProvidedServicesProvider } from '../providers/provided-services/provided-services';
//import { RefreshToken1InterceptorProvider } from '../providers/refresh-token1-interceptor/refresh-token1-interceptor';
import { RefreshTokenInterceptorProvider } from '../providers/refresh-token-interceptor/refresh-token-interceptor';
//import { ConditionsPage } from '../pages/conditions/conditions';
//import { ContactusPage } from '../pages/contactus/contactus';

// import { AngularFireModule } from 'angularfire2';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
// import { AngularFireAuth } from '../../node_modules/angularfire2/auth';
// import { AngularFireDatabase } from '../../node_modules/angularfire2/database';
// import { AngularFireDatabaseModule } from 'angularfire2/database';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

// export const firebaseConfig = {
//   apiKey: "AIzaSyDnAX0CQbbsMYuOTJ66ox_F0GwzPM4XPXY",
//   authDomain: "angularfire2-list-example.firebaseapp.com",
//   databaseURL: "https://angularfire2-list-example.firebaseio.com",
//   storageBucket: "",
//   messagingSenderId: "609067141823"
// };

var firebaseConfig  = {
  apiKey: "AIzaSyBPvbu83CtqeV67AihfGfwxKRzq4ExENNo",
  authDomain: "aldoctor-b33ed.firebaseapp.com",
  databaseURL: "https://aldoctor-b33ed.firebaseio.com",
  projectId: "aldoctor-b33ed",
  storageBucket: "aldoctor-b33ed.appspot.com",
  messagingSenderId: "381921023811"
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    //ContactusPage,
    HomePage,
    TabsPage,
    NotificationPage,
    //AboutAppPage,
    LoginPage,
    //CancelorderPage,
    ProfilePage,
   // SignupPage,
    OrderhistoryPage,
    //VerifycodePage,
    //ConditionsPage,
  //  OrderDoctorPage,
    //DoctorEvaluationPage,
    //SpecializationsPage,
    //FolloworderPage,
    //SpecificDoctorPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    // IonicModule.forRoot(MyApp, {
    //   tabsHideOnSubPages: true
    // }),
    //IonicStorageModule.forRoot(),
    IonicStorageModule.forRoot({ name: '__mydb', driverOrder: ['sqlite', 'websql', 'indexeddb'] }) ,
    HttpModule,
    HttpClientModule,
    Ionic2RatingModule ,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    
    // AngularFireModule.initializeApp(firebaseConfig),  
    // AngularFirestoreModule,
    //IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    //ContactusPage,
    //AboutAppPage,
    //ConditionsPage,
    MyApp,
    AboutPage,
    //FolloworderPage,
    ContactPage,
    //CancelorderPage,
    //VerifycodePage,
    HomePage,
    TabsPage,
    NotificationPage,
    LoginPage,
    ProfilePage,
    //SignupPage,
    OrderhistoryPage,
    //OrderDoctorPage,
    //DoctorEvaluationPage,
    //SpecializationsPage,
    //SpecificDoctorPage
  ],
  providers: [
    SocialSharing,
    AppRate ,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HelperProvider,
    HttpClient,
    LoginserviceProvider,
    //Storage,
    Camera,
    //BackgroundGeolocation,
    //ImagePicker,
    //Base64,
    Geolocation,
    ProvidedServicesProvider,
    // RefreshToken1InterceptorProvider,
    RefreshTokenInterceptorProvider,
    // AngularFireAuth,
    // AngularFireDatabase,
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptorProvider, multi: true },

  ]
})
export class AppModule {}
