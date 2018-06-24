import { Component } from '@angular/core';
import { NavController , ToastController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { SpecializationsPage } from '../specializations/specializations';
//import { CancelorderPage } from '../cancelorder/cancelorder';
//import { FolloworderPage } from '../followorder/followorder';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  langDirection:any;
  constructor(public platform:Platform,public translate:TranslateService,public helper:HelperProvider,public toastCtrl: ToastController, public storage: Storage, public navCtrl: NavController) {
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
 
  orderDoctor(){
  
    this.navCtrl.push('search-for-doctor');
  }
  sp(){
    this.navCtrl.push(SpecializationsPage);
  }
  // follow()
  // {
  //   this.navCtrl.push(FolloworderPage)
  // }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }

  ionViewDidLoad(){
  //   this.storage.ready().then(() => {
    
  //     this.storage.set('data',"samar").then(
  //       (data)=>{this.presentToast("set then data from home:"+data)},
  //     (error)=>{this.presentToast("set then error from home : "+error)});

  // });
  }

}
