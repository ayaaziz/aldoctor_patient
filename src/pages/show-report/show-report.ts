import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Platform } from 'ionic-angular/platform/platform';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-show-report',
  templateUrl: 'show-report.html',
  providers: [LocalNotifications]
})
export class ShowReportPage {

  orderFiles;
  photos = [];
  files = [];
  accessToken;
  orderId;
  photoUrl = "";
  loading;
  tostClass;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public service:LoginserviceProvider,
              public helper:HelperProvider,
              private transfer: FileTransfer,
              private file: File,
              private loadingCtrl: LoadingController,
              private toastCtrl:ToastController,
              private translate:TranslateService,
              private androidPermissions:AndroidPermissions,
              private platform:Platform,
              private localNotifications: LocalNotifications,
              private fileOpener:FileOpener) {

      this.orderId = this.navParams.get('recievedItem');

    this.tostClass = "toastRight";

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ShowReportPage');

    this.accessToken = localStorage.getItem('user_login_token');
    this.service.getOrderDetails(this.orderId,this.accessToken).subscribe(
      resp => {

        console.log("myorder*** "+JSON.stringify(resp));

        var myorder = JSON.parse(JSON.stringify(resp)).order;


        if(myorder.files.length > 0)
        {
          this.orderFiles = myorder.files;

          for(var i=0;i<this.orderFiles.length;i++) {

            if(this.orderFiles[i].type == 2) {

              let fileExt = this.orderFiles[i].path.split('.').pop();
              if(fileExt == "jpeg" || fileExt == "png" || fileExt == "jpg" || fileExt =="BMP" || fileExt == "gif") {
                this.photos.push({id:this.orderFiles[i].id,path:this.helper.serviceUrl+this.orderFiles[i].path,fileName:this.orderFiles[i].fileName});    
              } else {
                // let fileName = this.orderFiles[i].path.split('/').pop();
                // this.files.push({id:this.orderFiles[i].id,path:this.orderFiles[i].fileName});    
                this.files.push({id:this.orderFiles[i].id,path:this.helper.serviceUrl+this.orderFiles[i].path,fileName:this.orderFiles[i].fileName}); 
                console.log(this.files[0].path);   
              }
            }
          }
        }  
      },
      err=> {
        console.log("refresh",err);
      });
  }


  fullScreen(index){
    console.log("image clicked",index)
    this.navCtrl.push('full-screen',{data:this.photos[index].path});
  }

  dismiss(){
    this.navCtrl.pop();
  }

  async download(photo) {

    // this.presentLoading();

    const fileTransfer: FileTransferObject = this.transfer.create();

    console.log("photo path drom download: "+photo.path);

    // let arrName  = photo.fileName.split('.');
    // console.log("photo name: "+ arrName[0] + ".jpg");

    // externalRootDirectory
    await fileTransfer.download(photo.path, this.file.externalRootDirectory + '/Download/' + photo.fileName).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.photoUrl = entry.toURL();
      console.log('photoUrl: ' + this.photoUrl);

      // this.loading.dismiss();
      this.presentToast(this.translate.instant("imgDownloaded"));

        this.localNotifications.schedule({
          title: " الدكتور",
          text:  "تم تحميل الصورة",
        });

        this.localNotifications.on("click").subscribe(() => {
          let extinsion  = photo.fileName.split('.').pop();
          console.log("click on local notification")
          this.fileOpener.open(this.photoUrl, 'image/'+extinsion);
          this.photoUrl = "";
        })
      

    }, (error) => {
      console.log("errrrrrrrorrrrrrr: "+JSON.stringify(error));
      // handle error
    });
  }


  downloadFile(photo) {

    console.log("photo path: "+photo.path);

    if(this.platform.is('ios')) {

      this.presentLoading();

      const fileTransfer: FileTransferObject = this.transfer.create();

      fileTransfer.download(photo.path, this.file.dataDirectory + photo.fileName).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        this.photoUrl = entry.toURL();
        console.log('photoUrl: ' + this.photoUrl);
  
        this.loading.dismiss();
        this.presentToast(this.translate.instant("imgDownloaded"));
  
      }, (error) => {
        // handle error
      });
    } else {
      console.log("android platform");
      this.getPermission(photo);
    }
  }
  
  getPermission(photo) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          console.log("has permission 1");
          this.download(photo);
        } 
        else {
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
            .then(status => {
              if(status.hasPermission) {
                console.log("has permission 2");
                this.download(photo);
              }
            });
        }
      });
  }


  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "",
      duration: 5000
    });

    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    this.loading.present();
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
