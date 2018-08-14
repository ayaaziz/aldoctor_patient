import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform} from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage({
  name:'share-app'
})
@Component({
  selector: 'page-share-app',
  templateUrl: 'share-app.html',
})
export class ShareAppPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform   : Platform,
    public SocialSharing:SocialSharing) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareAppPage');
  }


  public sendTo   : any;
   public subject  : string = 'app title';
   public message  : string = 'app msg';
   public image    : string	= 'http://aldoctor-app.com/aldoctortest/public/uploads/1533654003.png';
   public uri      : string	= 'https://play.google.com/store/apps/details?id=net.ITRoots.Patient';


  



   shareViaEmail()
   {
      this.platform.ready()
      .then(() =>
      {
         this.SocialSharing.canShareViaEmail()
         .then(() =>
         {
          this.SocialSharing.shareViaEmail(this.message, this.subject, this.sendTo)
            .then((data) =>
            {
               console.log('Shared via Email');
            })
            .catch((err) =>
            {
               console.log('Not able to be shared via Email');
            });
         })
         .catch((err) =>
         {
            console.log('Sharing via Email NOT enabled');
         });
      });
   }



   shareViaFacebook()
   {
      this.platform.ready()
      .then(() =>
      {
        this.SocialSharing.canShareVia('com.apple.social.facebook', this.message, this.image, this.uri)
         .then((data) =>
         {

            this.SocialSharing.shareViaFacebook(this.message, this.image, this.uri)
            .then((data) =>
            {
               console.log('Shared via Facebook');
            })
            .catch((err) =>
            {
               console.log('Was not shared via Facebook');
            });

         })
         .catch((err) =>
         {
            console.log('Not able to be shared via Facebook');
         });

      });
   }




   shareViaInstagram()
   {
      this.platform.ready()
      .then(() =>
      {

         this.SocialSharing.shareViaInstagram(this.message, this.image)
         .then((data) =>
         {
            console.log('Shared via shareViaInstagram');
         })
         .catch((err) =>
         {
            console.log('Was not shared via Instagram');
         });

      });
   }




   sharePicker()
   {
      this.platform.ready()
      .then(() =>
      {

         this.SocialSharing.share(this.message, this.subject, this.image, this.uri)
         .then((data) =>
         {
            console.log('Shared via SharePicker');
         })
         .catch((err) =>
         {
            console.log('Was not shared via SharePicker');
         });

      });
   }




   shareViaTwitter()
   {
      this.platform.ready()
      .then(() =>
      {

         this.SocialSharing.canShareVia('com.apple.social.twitter', this.message, this.image, this.uri)
         .then((data) =>
         {

            this.SocialSharing.shareViaTwitter(this.message, this.image, this.uri)
            .then((data) =>
            {
               console.log('Shared via Twitter');
            })
            .catch((err) =>
            {
               console.log('Was not shared via Twitter');
            });

         });

      })
      .catch((err) =>
      {
         console.log('Not able to be shared via Twitter');
      });
   }



}
