import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import { ImagePicker } from '@ionic-native/image-picker';
//import { Base64 } from '@ionic-native/base64';
import { Jsonp } from '@angular/http/src/http';

//import { ImageLoaderConfig } from 'ionic-image-loader';



// @IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  name;
  phone;
  dob;
  address;

  //image="http://itrootsdemos.com/aldoctor/public/images/default-avatar.png";
  image="assets/imgs/default-avatar.png";
  langDirection: string;

  profileImg = "";
  imgPreview = 'assets/imgs/avatar-ts-jessie.png';
  
  tostClass ;

  constructor(//private imagePicker: ImagePicker,
    //private base64: Base64,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
     public helper: HelperProvider, public toastCtrl: ToastController,
      public storage: Storage, public navCtrl: NavController, 
      public navParams: NavParams,public translate: TranslateService,
      public service: LoginserviceProvider,
     // private imageLoaderConfig: ImageLoaderConfig
    )
  {
    
        this.langDirection = this.helper.lang_direction;
        
        if(this.langDirection == "rtl")
          this.tostClass = "toastRight";
        else
          this.tostClass="toastLeft";

        this.translate.use(this.helper.currentLang);
    // this.langDirection='rtl';
    console.log("language: ",this.langDirection);
    this.image="assets/imgs/default-avatar.png"; 
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    

  }
  newuserData;
  ionViewWillEnter(){
    this.storage.ready().then(() => {
    
      // this.storage.get('data').then(data=>{
      //   this.presentToast('simple data from profile'+data);
      //   this.name=data;
      // });
      this.storage.get("user_info").then((data) => {
          if(data){
        console.log("profile from storage: ",data);
        //this.presentToast("all profile from storage: "+data);
        this.name = data.name;
        this.phone = data.phone;
        this.dob = data.dob;
        this.address = data.add;
        if(data.profile_pic)
          this.image = data.profile_pic;
       // this.image = "http://itrootsdemos.com/aldoctor/public/images/default-avatar.png";
        
        //this.presentToast("image->profile: "+this.image);
          }
          else{
            this.storage.get("access_token").then(data=>{
              this.accessToken = data;
              this.service.getuserProfile(this.accessToken).subscribe(
                resp=>{
                  this.newuserData = JSON.parse(JSON.stringify(resp));
                  this.storage.set("user_info",{
                    "id":this.newuserData.id,
                    "name":this.newuserData.name,
                    "email":this.newuserData.email,
                    "phone":this.newuserData.phone,
                    "dob":this.newuserData.user_info.birth_date,
                    "add":this.newuserData.extraInfo.address,
                    "profile_pic":this.newuserData.profile_pic
                  }).then((data)=>{
                    //this.presentToast("set then data from signup: "+data)
                  },(error)=>{
                  //  this.presentToast("set then error from signup: "+error)
                  });
                  this.name = this.newuserData.name;
                  this.dob =this.newuserData.user_info.birth_date;
                  this.phone = this.newuserData.phone;
                  this.address =this.newuserData.extraInfo.address;
                 this.image = this.newuserData.profile_pic;

                },err=>{

                }
              );
            });
          }
      }
    );
  
  });
    
  }
  
  changeProfilePic(){
    console.log("change profile pic");
  }

  changePassword(){
    console.log("change password");
    this.navCtrl.push('change-password');

  }
  editProfile(){
    console.log("edit profile");
    this.navCtrl.push('edit-profile');

  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 7000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
  }

  accessToken;
  newDataTosaveImage;
  /*getPhoto(){
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          this.imgPreview = results[i];
          this.image = results[i];
          this.base64.encodeFile(results[i]).then((base64File: string) => {
            //this.regData.avatar = base64File;
            this.profileImg = base64File;
            

    //        this.presentToast("image: "+this.image);
            this.storage.get("user_info").then(
              (data) => {
                  if(data){
                    this.newDataTosaveImage = data;
                    this.newDataTosaveImage.profile_pic=this.image;
                    this.storage.set("user_info",this.newDataTosaveImage);
                  }
              });    

            this.storage.get("access_token").then(data=>{
              this.accessToken = data;
              console.log("image to api: ",this.profileImg);
              this.service.changeProfilePic(this.profileImg,this.accessToken).subscribe(
                resp =>{
                  console.log("resp from api: ",resp);
                  this.image=JSON.parse(JSON.stringify(resp)).profile_pic;
                  //this.image = "http://itrootsdemos.com/aldoctor/public/uploads/1528288759.png";
                  //this.presentToast("resp fro.m change photo: "+JSON.stringify(resp));
                  console.log("resp fro.m change photo: "+JSON.stringify(resp));
                }
                ,err=>{
                  this.presentToast("err from change photo: "+ JSON.stringify(err));
                }
              );
            })
            
          }, (err) => {
            console.log(err);
          });
      }
    }, (err) => { });
  
  }*/

  presentActionSheet() { 
    
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant("SelectImageSource"),
      buttons: [
        {
          text: this.translate.instant("LoadfromLibrary"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
   //         this.getPhoto();
          }
        },
        {
          text: this.translate.instant("UseCamera"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
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


  // public takePicture() {
  //   // Create options for the Camera Dialog
  //   var options = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true
  //   };
 
  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64:
  //     //this.presentToast("load image");
  //     this.profileImg = 'data:image/jpeg;base64,' + imageData;
  //     //this.presentToast(this.profileImg);
  //     this.storage.get("user_info").then(
  //       (data) => {
  //           if(data){
  //             this.newDataTosaveImage = data;
  //             this.newDataTosaveImage.profile_pic=this.image;
  //             this.storage.set("user_info",this.newDataTosaveImage);
  //           }
  //       });    

  //     this.storage.get("access_token").then(data=>{
  //       this.accessToken = data;
  //       console.log("image to api: ",this.profileImg);
  //       this.service.changeProfilePic(this.profileImg,this.accessToken).subscribe(
  //         resp =>{
  //           console.log("resp from api: ",resp);
  //           this.image=JSON.parse(JSON.stringify(resp)).profile_pic;
  //           //this.image = "http://itrootsdemos.com/aldoctor/public/uploads/1528288759.png";
  //           this.presentToast("resp fro.m change photo: "+JSON.stringify(resp));
  //         }
  //         ,err=>{
  //           this.presentToast("err from change photo: "+ JSON.stringify(err));
  //         }
  //       );
  //     })
  //   }, (err) => {
  //     // Handle error
  //    });
  // }


  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
 
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //this.presentToast("load image");
      this.profileImg = 'data:image/jpeg;base64,' + imageData;
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.imgPreview = 'data:image/jpeg;base64,' + imageData;
      
      
      this.storage.get("user_info").then(
        (data) => {
            if(data){
              this.newDataTosaveImage = data;
              this.newDataTosaveImage.profile_pic=this.image;
              this.storage.set("user_info",this.newDataTosaveImage);
            }
        });    

      this.storage.get("access_token").then(data=>{
        this.accessToken = data;
        console.log("image to api: ",this.profileImg);
        this.service.changeProfilePic(this.profileImg,this.accessToken).subscribe(
          resp =>{
            console.log("resp from api: ",resp);
            if(JSON.parse(JSON.stringify(resp)).success == true)
            {
              this.image=JSON.parse(JSON.stringify(resp)).user.profile_pic;
              console.log("resp fro.m change photo: "+JSON.stringify(resp));
            }
            //this.image=JSON.parse(JSON.stringify(resp)).profile_pic;
            //this.image = "http://itrootsdemos.com/aldoctor/public/uploads/1528288759.png";
            //this.presentToast("resp fro.m change photo: "+JSON.stringify(resp));
            //console.log("resp fro.m change photo: "+JSON.stringify(resp));
          }
          ,err=>{
            this.presentToast("err from change photo: "+ JSON.stringify(err));
          }
        );
      })
      
      //this.presentToast(this.profileImg);
    }, (err) => {
      // Handle error
     });
  }
  
  changePhone(){
    console.log("change phone");
    this.navCtrl.push('change-phone');
  }
}
