
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationPage } from '../pages/notification/notification';
import { LoginPage } from '../pages/login/login';
import { SliderPage } from '../pages/slider/slider';
import { ProfilePage } from '../pages/profile/profile';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HelperProvider } from '../providers/helper/helper';
import { HttpClientModule } from '@angular/common/http';
import { OrderhistoryPage } from '../pages/orderhistory/orderhistory';
import { Ionic2RatingModule } from 'ionic2-rating';
import { LoginserviceProvider } from '../providers/loginservice/loginservice';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Market } from '@ionic-native/market';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { OrderModule } from 'ngx-order-pipe';
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
import { Network } from '@ionic-native/network';
import { FollowOrderForPlcPage} from '../pages/follow-order-for-plc/follow-order-for-plc';
//import { SliderPage } from '../pages/slider/slider';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


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
    SliderPage,
    //CancelorderPage,
    ProfilePage,
   // SignupPage,
    OrderhistoryPage,
    FollowOrderForPlcPage
    // SliderPage
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
    OrderModule,
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
    FollowOrderForPlcPage,
    LoginPage,
    SliderPage,
    ProfilePage,
    //SignupPage,
    OrderhistoryPage
    // SliderPage
    //OrderDoctorPage,
    //DoctorEvaluationPage,
    //SpecializationsPage,
    //SpecificDoctorPage
  ],
  providers: [
    SocialSharing,
    // AppRate ,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HelperProvider,
    HttpClient,
    LoginserviceProvider,
    //Storage,
    Camera,
    Geolocation,
    Diagnostic,
    LocationAccuracy,  
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
    Network,
    Market,
    FileTransfer,
    FileTransferObject,
    File,
  ]
})
export class AppModule {}
