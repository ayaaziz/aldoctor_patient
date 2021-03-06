import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController ,ActionSheetController, App,AlertController} from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';

import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage({
  name:'service-profile'
})
@Component({
  selector: 'page-service-profile',
  templateUrl: 'service-profile.html',
})
export class ServiceProfilePage {

  langDirection: string;
  doctorProfile;
  image;
  name;
  address;
  phone;
  specialization;
  rate;
  services=[];
  accessToken;
  tostClass;

  photosForApi=[];
  photos= [];
  //photos = ["assets/imgs/empty-image.png","assets/imgs/empty-image.png"];

  offline;
  medicalprescriptionImage;
  type_id;

  imageFlag = true;
  image2;
  imageExt=[];
  phone2;
  phone2Apear =  true;
  center_id = "";
  serviceId;
  hideServices = true;

  slogn;
  slognImage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public alertCtrl: AlertController,
    public storage: Storage, public app:App,
    public service:LoginserviceProvider,public srv:ProvidedServicesProvider,
    public helper: HelperProvider,public translate: TranslateService,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController) {
      
      this.accessToken = localStorage.getItem('user_token');
      this.helper.view = "pop";
      

    var data = this.navParams.get('data');
    console.log("data from service-profile ", data);
    this.langDirection = this.helper.lang_direction;
    if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";
    this.translate.use(this.helper.currentLang);
    
    this.image = data.profile_pic;
    this.name = data.name;
    this.rate = data.rate;
    this.serviceId = data.id;
    //this.phone="0123456";
    //this.address="address";
    
    // this.services = this.doctorProfile.SpecialityServices;
    this.services = [];

    this.doctorProfile = navParams.get('data');
    console.log("from doctor profile: ",this.doctorProfile);
    this.image = this.doctorProfile.profile_pic;
    this.name = this.doctorProfile.doctorName;
    // this.specialization = this.doctorProfile.specialization;
    this.rate = this.doctorProfile.rate;
    this.phone = this.doctorProfile.phone;

     //ayaaaaaaaaa
     this.slogn = this.doctorProfile.slogn;
     this.slognImage = this.doctorProfile.slogn_image;
     /////////////

    if(this.doctorProfile.entity.phone)
    {
      this.phone2 = this.doctorProfile.entity.phone;
      this.phone2Apear = false; 
    }
      
    
    this.address = this.doctorProfile.extraInfo.address;
    this.services = this.doctorProfile.speciality_services;
    // this.services[0].price = "";
    
    this.type_id = this.doctorProfile.type_id;
    
    if(this.doctorProfile.offline == true)
      this.offline = "1";
    else
      this.offline = "0";

      if(this.type_id == "1")
      {
        // this.title = this.translate.instant("pharmacy");
        // this.serviceTitle = this.translate.instant("nearbyPharmacy");
        this.medicalprescriptionImage = this.translate.instant("medicalprescription");
        this.hideServices = true;
      }else if(this.type_id == "3")
      {
        // this.title = this.translate.instant("lap");
        // this.serviceTitle = this.translate.instant("nearbyLab");
        this.medicalprescriptionImage = this.translate.instant("requiredTests");
        this.hideServices = true; //false
      }else if(this.type_id == "2")
      {
        // this.title = this.translate.instant("center");
        // this.serviceTitle = this.translate.instant("nearbyCenter");
        this.medicalprescriptionImage = this.translate.instant("requiredRadiologies");
        this.hideServices = false;
      }else if(this.type_id == "4")
      {
        // this.title = this.translate.instant("center");
        // this.serviceTitle = this.translate.instant("nearbyCenter");

        //this.medicalprescriptionImage = this.translate.instant("requiredRadiologies");
        this.hideServices = false;
      }
      //ayaaaaa
      else if(this.type_id == "5") {
        this.hideServices = false;
      }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceProfilePage');
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));
  }
  dismiss(){
    this.navCtrl.pop();
  }
  
  sendOrder(){
    if(this.offline == "1")
    {
      this.presentToast(this.translate.instant("doctoroffline"));
    }else{
      // if(this.type_id == "2")
       // this.checkfund();
      // else
        this.completeOrders();
    }
  
  }

  completeOrders(){

    this.offline = "1";

    console.log("orderId from doctorProfile: ",this.doctorProfile.id);
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    this.accessToken = localStorage.getItem('user_token');

      this.srv.saveOrder(this.doctorProfile.id,this.photosForApi,this.imageExt.join(','),this.accessToken,1,this.center_id).subscribe(
        resp => {
          
          // this.showLoading=true;
          if(JSON.parse(JSON.stringify(resp)).success ){

            this.storage.set('orderImages',this.photos).then(
              val=>{
                console.log("image saved",val);
              }
            );
            
          console.log("saveOrder resp: ",resp);
          var newOrder = JSON.parse(JSON.stringify(resp));
          
console.log("from order doctor",newOrder.order.id,"service id",newOrder.order.service_profile_id)
          // this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,1);
          // this.helper.orderStatusChanged(newOrder.order.id);

          // this.helper.createOrderForPLC(this.type_id,newOrder.order.id,newOrder.order.service_profile_id,1);
          // this.helper.orderStatusChangedForPLC(newOrder.order.id);

          this.helper.orderIdForUpdate = newOrder.order.id;
          
          this.presentToast(this.translate.instant("ordersent"));
          this.helper.dontSendNotification = false;
          
          this.offline = "0";
          // this.navCtrl.pop();
          // this.navCtrl.setRoot('remaining-time-to-acceptfor');
          if(this.photosForApi.length == 0)
            this.navCtrl.setRoot('remaining-time-for-plc',{data:0,orderId:newOrder.order.id,type_id:this.type_id});
          else 
            this.navCtrl.setRoot('remaining-time-for-plc',{data:1,orderId:newOrder.order.id,type_id:this.type_id});

          }else{
            this.presentToast(this.translate.instant("serverError"));
          }
        },
        err=>{
          // this.showLoading=true;
          this.offline = "0";
          console.log("saveOrder error: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
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

  presentActionSheet() { 
    if(this.imageFlag == true)
    {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant("SelectImageSource"),
      buttons: [
        {
          text: this.translate.instant("LoadfromLibrary"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  
          }
        },
        {
          text: this.translate.instant("UseCamera"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
       
      ]
    });
    actionSheet.present();
  }else{
    this.presentToast(this.translate.instant("maxNumberOFIMages"));
  }

  }
  public takePicture(sourceType) {
    
    var options = {
      targetWidth: 600,
      targetHeight: 600,
      quality: 80, //20
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
//  this.photos = [];
    this.camera.getPicture(options).then((imageData) => {
   
      this.image2 = 'data:image/jpeg;base64,' + imageData;

      this.photos.push(this.image2);
      this.photosForApi.push(encodeURIComponent(imageData));
      this.imageExt.push("jpeg");

      if(this.photosForApi.length == 2)
        this.imageFlag = false;

      console.log("all photos ",this.photos,"length",this.photos.length);
      console.log("photos for api",this.photosForApi,"length",this.photosForApi.length);
    

    }, (err) => {
     
     });
  }
  deletePhoto(index){
    console.log("photo index",index);
    this.photos.splice(index, 1);
    this.photosForApi.splice(index,1);
    this.imageExt.pop();
    this.imageFlag = true;
  }

  fullScreen(index){
    console.log("image clicked",index)
    this.navCtrl.push('full-screen',{data:this.photos[index]});
  }
  viewRates(){
    console.log("viewRates");
    this.navCtrl.push('view-rates',{data:this.serviceId});
  }


  checkfund(){

    this.accessToken = localStorage.getItem('user_token');
   
    this.service.getFund(this.accessToken).subscribe(
      resp=>{
        console.log("resp from getFund",resp);
        var pfunds = JSON.parse(JSON.stringify(resp)).data;
      
       
           
            if(pfunds.order_count == 0)
              this.completeOrders();
            else if(pfunds.order_count>0 && pfunds.order_count<3)
              this.fundAlert(pfunds.forfeit_patient,this.doctorProfile.price);
          else if(pfunds.order_count >= 3)          
            this.fundStopAlert(pfunds.forfeit_patient,this.doctorProfile.price);

          

       
        
        
      },err=>{
        console.log("err from getFund",err);
      });
  }
  fundAlert(mony,price){
    if(!price)
    price="";
    var msg;
  
  // if(this.type_id == "2")
  //   msg = "مبلغ الغرامه: "+mony +"<br>"+ " مبلغ الخدمه: "+price+"<br>";
  // else 
  //   msg =  "مبلغ الغرامه: "+mony +"<br>";

    if(this.type_id == "2")
      msg = " قيمة الغرامه: "+mony +" جنيه مصرى <br>"+ " قيمة الأشعه: "+price+" جنيه مصرى<br>";
    else 
      msg = " قيمة الغرامه: "+mony +" جنيه مصرى <br>"


    let alert = this.alertCtrl.create({
      title: "تطبيق الدكتور",
      message:msg,
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
  
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('agree clicked');
   //         this.orderBTn = false;

            // for(var k=0;k<this.DoctorsArray.length;k++)
            // {
            //   this.DoctorsArray[k].offlineFororders=false;
            // }

            // this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=false;
            this.completeOrders();
          }
        }
      ]
    });
    alert.present();
  }
  fundStopAlert(mony,price){
    if(!price)
      price="";

     var msg; 
    // if(this.type_id == "2")
    //   msg = "مبلغ الغرامه: "+mony +"<br>"+ " مبلغ الخدمه: "+price+"<br>";
    // else 
    //   msg =  "مبلغ الغرامه: "+mony +"<br>";

    if(this.type_id == "2")
      msg = " قيمة الغرامه: "+mony +" جنيه مصرى <br>"+ " قيمة الأشعه: "+price+" جنيه مصرى<br>";
    else 
      msg = " قيمة الغرامه: "+mony +" جنيه مصرى <br>"


    // this.orderBTn = true;
    // for(var k=0;k<this.DoctorsArray.length;k++)
    // {
    //   this.DoctorsArray[k].offlineFororders=true;
    // }
    
    // this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=true;
      let alert = this.alertCtrl.create({
        title: "تطبيق الدكتور",
        message:msg,
        buttons: ["حسنا"
        ]
      });

      alert.present(); 
      
    
  }



}
