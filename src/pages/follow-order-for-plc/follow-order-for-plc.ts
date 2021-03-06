import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController ,ActionSheetController ,Events, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TabsPage } from '../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';
import { HomePage } from '../home/home';

// {
//   name:'follow'
// }
// @IonicPage()
@Component({
  selector: 'page-follow-order-for-plc',
  templateUrl: 'follow-order-for-plc.html',
  providers: [Diagnostic, LocationAccuracy,LocalNotifications]
})
export class FollowOrderForPlcPage {

  doctorData;
  doctorId;
  doctorName = "";
  doctorSpecialization;
  doctorLocation;
  doctorRate;
  OrderCost;
  
  langDirection;
  accessToken;
  notification;
  orderStatus;
  duration="0";

  lat=31.037933; 
  lng=31.381523;
  disableCancelBtn = false;
  tostClass;
  phone;

  type_id;
  callService;
  serviceName;
  serviceTxt;
  completeServiceTxt;
  medicalprescriptionImage;
  sendprescription;
  hint;
  photos=[];
  //photos = ["assets/imgs/testImage.jpeg"];
  // photos = ["assets/imgs/empty-image.png","assets/imgs/empty-image.png"];
  photosForApi=[];
  
  imageFlag = true;
  image;
  notificationFlag=false;
  orderId;

  imageExt=[];
  UpdateorderBTn = false;
  plcimage;
  // receivedImage = "0";
  editFlag =false;
  orderFiles = [];
  disabled2btn ;
  refreshOrderStatus;
  refresher;
  refreshOrderMsg;
  status11alertDisabled = false;
  status8alertdiabled = false;
  status12alertdisabled = false;
  hideCont = true;
  hidenote = true;
  contDate = "";
  contNotes = "";

  patientId;
  currentFees;
  orderDetails;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage,public service: LoginserviceProvider,
    public diagnostic: Diagnostic,public locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,public helper:HelperProvider,
    public translate: TranslateService,public srv:ProvidedServicesProvider,
    public toastCtrl: ToastController, public alertCtrl: AlertController,
    public events: Events,public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private localNotifications: LocalNotifications,
    private modalCtrl:ModalController)
    {  
      this.accessToken = localStorage.getItem('user_token');
      this.helper.view = "follow";
      
    //   document.removeEventListener('pause',()=>{
    //     console.log("removeEventListener pause")
    //   })

    //   document.removeEventListener('resume',()=>{
    //    console.log("removeEventListener resume")
    //  })
      this.langDirection = this.helper.lang_direction;
    
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.type_id = this.helper.type_id;

      console.log("ayaaaaa type_id: "+this.type_id);

      console.log("langdir: ",this.langDirection);
      this.translate.use(this.helper.currentLang);
      this.doctorData = this.navParams.get('data2');

      console.log("data from follow order:",this.doctorData);
    
      this.doctorId = this.doctorData.doctorId;
      this.orderId = this.doctorData.orderId;

      if(this.doctorData.order_status && (this.doctorData.order_status == "8" || this.doctorData.order_status == "7"))
      {
        console.log("order status from navParams",this.doctorData.order_status);
        this.disableCancelBtn = true;
        
      }  

      this.srv.getOrderDetails(this.orderId,this.accessToken).subscribe(
        resp=>{
          console.log("orderDetails ",resp);
          var myorder = JSON.parse(JSON.stringify(resp)).order;

          // ayaaaaa
          this.orderDetails = myorder;

          console.log("order details: "+ JSON.stringify(myorder));


          //ayaaaaaaaa
          this.patientId = myorder.patient_id;
          console.log("patientId for nursing: "+this.patientId);
          ////////////
       
          if(myorder.status == 13 )
          {
            
            
            if(myorder.date)
            {
              this.hideCont = false;
              this.contDate = myorder.date;
            }
            else
            {
              this.hideCont = true;
              this.contDate = "";
            }

            if(myorder.remark)
            {
              this.hidenote = false;
              this.contNotes = myorder.remark;
            }
            else
            {
              this.hidenote = true;
              this.contNotes ="";
            }
              
          }
          if(myorder.files)
          {
            //this.disabled2btn = true;
            //this.imageFlag = false;
            this.orderFiles = myorder.files;

            for(var i=0;i<this.orderFiles.length;i++)
            {
              this.photos.push(this.helper.serviceUrl+this.orderFiles[i].path);
    //          this.photosForApi.push(this.helper.serviceUrl+this.orderFiles[i]);
              // this.photosForApi.push(encodeURIComponent(this.photos[i].split(',')[1]));      
            }
            console.log("photos",this.photos);

            if(this.orderFiles.length == 2)
            {
              this.imageFlag = false;
              this.disabled2btn = true;
            }
            else if(this.orderFiles.length == 1)
            {
              this.imageFlag = true;
              this.disabled2btn = false;
            }
              
          
            }else{
            this.disabled2btn = false;
          }
            
        },
        err=>{
          console.log("orderDetailsErr",err);
        }
      );
      // if(this.doctorData.receivedImage){

      //   this.receivedImage = this.doctorData.receivedImage;
      //   console.log("received image",this.receivedImage);
      // }
      console.log("doctorid: ",this.doctorId," orderid: ",this.doctorData.orderId);
      // if(this.doctorData.order_status && this.doctorData.order_status == "7")
      //   this.disableCancelBtn = true;
      // else
      //   this.disableCancelBtn = false;
  
      if(this.doctorData.order_status && (this.doctorData.order_status == "8" || this.doctorData.order_status == "7"))
        this.disableCancelBtn = true;
      else
        this.disableCancelBtn = false;

      if(this.type_id == "1"){
        this.callService = this.translate.instant("callPharmacy");
        this.serviceName = this.translate.instant("pharmacyName");
        this.serviceTxt = this.translate.instant("pharmacyServiceTxt");
        this.completeServiceTxt = this.translate.instant("pharmacycmpServiceTxt");
        this.hint = "";
        this.medicalprescriptionImage = this.translate.instant("medicalprescription");
        this.sendprescription = " إرسال "+this.medicalprescriptionImage;
      }  
      else if(this.type_id == "3"){
        this.callService = this.translate.instant("calllab");
        this.serviceName = this.translate.instant("labName");
        this.serviceTxt = this.translate.instant("labServiceTxt");
        this.completeServiceTxt = this.translate.instant("pharmacycmpServiceTxt");
        this.hint = this.translate.instant("labHint");
        this.medicalprescriptionImage = this.translate.instant("requiredTests");
        this.sendprescription = " إرسال "+this.medicalprescriptionImage;
      }
      else if(this.type_id == "2"){
        this.callService = this.translate.instant("callcenter");
        this.serviceName = this.translate.instant("centerName2");
        this.serviceTxt = this.translate.instant("labServiceTxt");
        this.completeServiceTxt = this.translate.instant("pharmacycmpServiceTxt");
        this.hint = this.translate.instant("labHint");
        this.medicalprescriptionImage = this.translate.instant("requiredRadiologies");
        this.sendprescription = " إرسال "+this.medicalprescriptionImage;
      }
      else if(this.type_id == "5"){
        // this.callService = this.translate.instant("callcenter");
        // this.serviceName = this.translate.instant("centerName2");
        this.serviceTxt = this.translate.instant("nurseServiceTxt");
        this.completeServiceTxt = this.translate.instant("pharmacycmpServiceTxt");
        this.hint = this.translate.instant("labHint");
        // this.medicalprescriptionImage = this.translate.instant("requiredRadiologies");
        // this.sendprescription = " إرسال "+this.medicalprescriptionImage;
      }

      
        // this.storage.get("access_token").then(data=>{
        // this.accessToken = data;
        // this.storage.get('orderImages').then(val=>{
        //   if(val){
        //     console.log("if from follow order for plc images",val);
        //     this.photos = val;
        //     // this.photos.push("assets/imgs/testImage.jpeg");
        //     for(var i=0;i<this.photos.length;i++)
        //     {
        //       this.photosForApi.push(encodeURIComponent(this.photos[i].split(',')[1]));
              
        //     }
        //     if(val.length == 2)
        //       this.imageFlag = false;
        //     else if(val.length == 1)
        //       this.imageFlag = true;

              
        //   }else{
        //     console.log("else from follow order for plc");
        //     this.imageFlag = true;
        //     this.editFlag = true;
        //   }
         
        // }).catch(err=>{
        //   console.log("catch from follow order for plc",err);
        //   this.imageFlag = true;
        //   this.editFlag = true;
        // });

        this.accessToken = localStorage.getItem('user_token');

        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in followorder: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            
            if (tempData.nickname)
              this.doctorName = tempData.nickname;
            else 
              this.doctorName = tempData.name;
              
            console.log("doctor name from getServiceProfile",this.doctorName);

            this.doctorRate = tempData.rate;
            this.doctorSpecialization = tempData.speciality; 
            this.OrderCost = tempData.extraInfo.discount;
            this.phone = tempData.phone;
            this.plcimage= tempData.profile_pic;
            
            console.log("phone",this.phone);          
            
            // this.locationNode(tempData.locationNode);
            this.locationNode(tempData.extraInfo.extra_info);
            
            // this.helper.getDoctorlocation(this.doctorId);

          },err=>{
            console.log("error from getserviceprofile in followorder:",err);
          }
  
        );
      // });
      
      // this.events.subscribe('location', (data) => {
      //   console.log(" event location ",data);
      //   if(data.location){
      //     this.doctorLocation = data.location;
      //     this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
      //       resp=>{
  
      //         var respObj = JSON.parse(JSON.stringify(resp));  
      //         console.log("duration txt",respObj.routes[0].legs[0].duration.text);
      //         // var dur = respObj.routes[0].legs[0].duration.text;
      //         // console.log("distance : ",respObj.routes[0].legs[0].distance.text);

      //         // if(dur.includes("hours"))
      //         //   dur = dur.replace("hours","س");

      //         // if(dur.includes("mins"))
      //         //   dur = dur.replace("mins","د");

      //         // if(dur.includes("min"))
      //         //   dur = dur.replace("min","د");
    
      //         // if (dur.includes("hour"))
      //         //   dur = dur.replace("hour","س");

      //         // this.duration = dur;
      //         var number = 0;
      //         if(this.type_id == "1")
      //           number = 30*60;
      //         else if (this.type_id == "2" || this.type_id == "3")
      //           number = 30*60;
              
      //         console.log("duration value",respObj.routes[0].legs[0].duration.value);
      //         var dur = respObj.routes[0].legs[0].duration.value;
              
      //         var d = Number(dur+number);
      //         var h = Math.floor(d/3600);
      //         var m = Math.floor(d % 3600 /60);
      //         var s = Math.floor(d % 3600 % 60);
      //         console.log("h ", h,"m: ",m,"s: ",s);  
      //         // var hdisplay = h > 0 ? h + (h == 1 ? "hour, ":"hours, "):"";
      //         // var mdisplay = m > 0 ? m + (m == 1 ? "minute, ":"minutes, "):"";
      //         // var sdisplay = s > 0 ? s + (s == 1 ? "second, ":"seconds, "):"";

      //         var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
      //         var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

      //         console.log(" time : ",hdisplay+mdisplay);
      //         this.duration  = hdisplay+mdisplay;
      //         console.log("doc name from distance & duration",this.doctorName);
      //         if(this.notificationFlag == false && h == 0 && m == 30 && this.type_id == "1") //|| m <= 30
      //         {
      //           console.log("20--- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
      //           this.scheduleNotification(m);
      //         }  

      //         // if(this.notificationFlag == false && h == 0 && m == 30 && this.type_id == "2" ) //|| m <= 30 , || this.type_id == "3"
      //         // {
      //         //   console.log("30-- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
      //         //   this.scheduleNotification(m);
      //         // }  
              
      //         // if(this.notificationFlag == false && h == 0 && m == 30 && this.type_id == "3" ) //|| m <= 30 , || this.type_id == "3"
      //         // {
      //         //   console.log("30-- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
      //         //   this.scheduleNotification(m);
      //         // } 

      //       },
      //       err=>{
      //         console.log("err from getDurationAndDistance: ",err);
      //       }
      //     );
    
          
      //   }
      //   });


      //   this.events.subscribe('locationChanged', (data) => {
      //     console.log(" event location changed",data);
      //     if(data.location){
      //       this.doctorLocation = data.location;
      //       console.log("doctor location",this.doctorLocation);
      //       this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
      //       resp=>{
      //         var respObj = JSON.parse(JSON.stringify(resp));
      //         console.log("duration",respObj.routes[0].legs[0].duration.text);
      //         var dur = respObj.routes[0].legs[0].duration.text;
      //         console.log("distance txt: ",respObj.routes[0].legs[0].distance.text);

      //         // if(dur.includes("hours"))
      //         //   dur = dur.replace("hours","س");

      //         // if(dur.includes("mins"))
      //         //   dur = dur.replace("mins","د");

      //         // if(dur.includes("min"))
      //         //   dur = dur.replace("min","د");
    
      //         // if (dur.includes("hour"))
      //         //   dur = dur.replace("hour","س");

      //         // this.duration = dur;
      //         var number = 0;
      //         if(this.type_id == "1")
      //           number = 30*60;
      //         else if (this.type_id == "2" || this.type_id == "3")
      //           number = 30*60;
              
      //         console.log("duration value",respObj.routes[0].legs[0].duration.value);
      //         var dur = respObj.routes[0].legs[0].duration.value;
              
      //         var d = Number(dur+number);
      //         var h = Math.floor(d/3600);
      //         var m = Math.floor(d % 3600 /60);
      //         var s = Math.floor(d % 3600 % 60);
      //         console.log("h ", h,"m: ",m,"s: ",s);  
              
      //         var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
      //         var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

      //         console.log(" time : ",hdisplay+mdisplay);
      //         this.duration  = hdisplay+mdisplay;

      //         // if(this.notificationFlag == false && h == 0 && m <= 20 || m <= 30)
      //         //   this.scheduleNotification(m);
      //         // if(this.notificationFlag == false && h == 0 && m == 20 && this.type_id == "1") //|| m <= 30
      //         //   this.scheduleNotification(m);

      //         // if(this.notificationFlag == false && h == 0 && m == 30 && this.type_id == "2" || this.type_id == "3") //|| m <= 30
      //         //   this.scheduleNotification(m);
      //         if(this.notificationFlag == false && h == 0 && m == 30 && this.type_id == "1") //|| m <= 30
      //         {
      //           console.log("20--- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
      //           this.scheduleNotification(m);
      //         }  

      //         // if(this.notificationFlag == false && h == 0 && m == 30 && this.type_id == "2" ) //|| m <= 30 , || this.type_id == "3"
      //         // {
      //         //   console.log("30-- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
      //         //   this.scheduleNotification(m);
      //         // }  
              
      //         // if(this.notificationFlag == false && h == 0 && m == 30 && this.type_id == "3" ) //|| m <= 30 , || this.type_id == "3"
      //         // {
      //         //   console.log("30-- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
      //         //   this.scheduleNotification(m);
      //         // }
                

      //   },
      //   err=>{
      //     console.log("err from getDurationAndDistance: ",err);
      //   }
      // );

      //     }

      //     });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowOrderForPlcPage');
this.helper.view = "follow";
    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));

    if(this.helper.detectLocation == false)
      this.test();
    else{
      this.lat = this.helper.lat;
      this.lng = this.helper.lon;

    }
    

    // this.events.subscribe('status8', (data) => {
    //   console.log("notification event status 8");
    //   this.helper.trackDoctor(this.doctorId); 
    // });

    // this.events.subscribe('status5', (data) => {
    //   console.log("notification event status 5",data);
    //   this.navCtrl.push(TabsPage);
    //   this.navCtrl.push('rate-doctor',{
    //     data:{
    //       doctorId:data.doctorId,
    //       orderId:data.orderId
    //     }
    //   });
      
    // });
    this.events.subscribe('x',()=>{
      console.log("x fired");
      this.navCtrl.setRoot(TabsPage);
      
    });

    this.events.subscribe('y',()=>{
      console.log("y fired");
      this.navCtrl.setRoot(TabsPage);
    });

    this.events.subscribe('status8ForPLC', (data) => {
      console.log("notification event status8ForPLC");

      this.disableCancelBtn = true;
    });
  }

  test(){
    this.diagnostic.isGpsLocationEnabled().then(
      a=>{
        console.log("from gps opened resp",a);
        if(a)
          this.getUserLocation();
        else
          this.presentConfirm();        
      }
    ).catch(
      a=>{
        console.log("from gps opened err",a);
        this.diagnostic.switchToLocationSettings();
      }
    );
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("accessLocation"),
      message: this.translate.instant("msgAccessLocation"),
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
            this.diagnostic.switchToLocationSettings();
            this.getUserLocation();
          }
        }
      ]
    });
    alert.present();
  }
  presentCancelConfirm(cancelMsg) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmCancelOrder"),
      message: cancelMsg,
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
            console.log('cancel order agree clicked');
            this.navCtrl.push('cancel-service',{orderId:this.doctorData.orderId});
            
          }
        }
      ]
    });
    alert.present();
  }
  getUserLocation(){
  console.log("get user location");
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log("user location resp: ", resp);
      
    }).catch((error) => {
      console.log('Error getting location', error);
      this.lat = this.helper.lat;
      this.lng = this.helper.lon;
    });
}

private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 4000,
    position: 'bottom',
    cssClass: this.tostClass
  });
  toast.present();
}

  cancelOrder(){
    this.navCtrl.push('cancel-service',{orderId:this.doctorData.orderId});
    // this.service.cancelMsg(this.accessToken).subscribe(
    //   resp=>{
    //     console.log("cancel msg resp",resp);
    //     this.presentCancelConfirm(JSON.parse(JSON.stringify(resp)).message);
    //   }
    // );
  }
  dismiss(){
    this.navCtrl.pop();
    // this.navCtrl.parent.select(0); 
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
      //this.presentToast(this.translate.instant(""));
    }
    
  }
  public takePicture(sourceType) {
    console.log("take image");
    var options = {
      targetWidth: 600,
      targetHeight: 600,
      quality: 80, //20,40
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
   
      this.image = 'data:image/jpeg;base64,' + imageData;
      
      this.photos.push(this.image);
      this.photosForApi.push(encodeURIComponent(imageData));
      
      this.imageExt.push("jpeg");
      console.log("image ext",this.imageExt);
      //this.receivedImage = 1;

      if(this.photosForApi.length == 2)
        this.imageFlag = false;

      if(this.photos.length == 2)
        this.disabled2btn = true;

      console.log("all photos ",this.photos,"length",this.photos.length);
      console.log("photos for api",this.photosForApi,"length",this.photosForApi.length);
    
      this.sendprescriptionImagesUpdated();

    }, (err) => {
     
     });
  }
  sendprescriptionImages(){
    
    console.log("editflag",this.editFlag);
    // if(!this.orderFiles)
    // {
    // if(this.receivedImage == "1")
    // {
      if(this.photosForApi.length == 0 && this.type_id == 3)
      {
        this.presentToast(this.translate.instant("atleastOneimageforLab"));
      }else if(this.photosForApi.length == 0 && this.type_id == 2)
      {
        this.presentToast(this.translate.instant("atleastOneimageforcenter"));
      }else if(this.photosForApi.length == 0 && this.type_id == 1)
      {
        this.presentToast(this.translate.instant("atleastOneimageforpharmacy"));
      }else{
        this.accessToken = localStorage.getItem('user_token');
        this.UpdateorderBTn = true;
        this.srv.editOrderToSendImages(this.orderId,this.photosForApi,this.imageExt,this.accessToken).subscribe(
          resp=>{
            console.log("resp from editOrderToSendImages",resp);
            if(JSON.parse(JSON.stringify(resp)).success == true)
            {
              this.imageExt = [];
              this.photosForApi = [];
              this.storage.set('orderImages',this.photos).then(
                val=>{
                  console.log("image saved",val);
                }
              );
              
              this.presentToast("تم الإرسال");
              // this.receivedImage = "1";
     //         this.photosForApi = [];
    //          this.photos = [];
              this.UpdateorderBTn = false;
              
              if(this.photos.length == 2)
                this.imageFlag = false;
              else
                this.imageFlag = true;

            }else{
              this.UpdateorderBTn = false;
            }  
            
          },err=>{
            console.log("err from editOrderToSendImages",err);
            this.presentToast(this.translate.instant("serverError"));
            this.UpdateorderBTn = false;
            
          }
        );
      }

    // }else{
    //   this.presentToast(" لم يتم تعديل "+this.medicalprescriptionImage);
    // }

   
  }

  sendprescriptionImagesUpdated(){
    
    console.log("editflag",this.editFlag);
    
      if(this.photos.length == 0 && this.type_id == 3)
      {
        this.presentToast(this.translate.instant("atleastOneimageforLab"));
      }else if(this.photos.length == 0 && this.type_id == 2)
      {
        this.presentToast(this.translate.instant("atleastOneimageforcenter"));
      }else if(this.photos.length == 0 && this.type_id == 1)
      {
        this.presentToast(this.translate.instant("atleastOneimageforpharmacy"));
      }else{
        this.accessToken = localStorage.getItem('user_token');
        this.UpdateorderBTn = true;
        this.srv.editOrderToSendImages(this.orderId,this.photosForApi,this.imageExt,this.accessToken).subscribe(
          resp=>{
            console.log("resp from editOrderToSendImages",resp);
            if(JSON.parse(JSON.stringify(resp)).success == true)
            {
              this.imageExt = [];
              this.photosForApi = [];
              this.storage.set('orderImages',this.photos).then(
                val=>{
                  console.log("image saved",val);
                }
              );
              
              this.presentToast("تم الإرسال");
              // this.receivedImage = "1";
     //         this.photosForApi = [];
    //          this.photos = [];
              this.UpdateorderBTn = false;
              
              if(this.photos.length == 2)
                this.imageFlag = false;
              else
                this.imageFlag = true;

            }else{
              this.UpdateorderBTn = false;
            }  
            
          },err=>{
            console.log("err from editOrderToSendImages",err);
            this.presentToast(this.translate.instant("serverError"));
            this.UpdateorderBTn = false;
            
          }
        );
      }

    // }else{
    //   this.presentToast(" لم يتم تعديل "+this.medicalprescriptionImage);
    // }

   
  }

  deletePhoto(index){
    console.log("photo index",index);
    this.photos.splice(index, 1);
    this.photosForApi.splice(index,1);
    this.imageExt.pop();
    this.imageFlag = true;
    this.editFlag = true;
  }
  serviceRate(){

    // if(this.receivedImage == "0")
    // {
    //   this.presentToast(this.translate.instant(" ادخل "+this.medicalprescriptionImage));
    // }else if(this.receivedImage == "1"){
      
    // if(this.orderFiles.length == 2 || this.orderFiles.length == 1 || this.photos.length == 1 || this.photos.length == 2)
      // {
        this.accessToken = localStorage.getItem('user_token');
        this.srv.updateOrderStatus(this.doctorData.orderId,this.accessToken,this.type_id).subscribe(
          resp=>{
            console.log("resp updateOrderStatus",resp);
            this.helper.dontSendNotification = false;
            // this.helper.dontSendNotification  = false;
          },err=>{
            console.log("err updateOrderStatus",err);
            // this.helper.dontSendNotification  = false;
          }
        );
      this.navCtrl.push('rate-service',
      {data:
      {
      "doctorId":this.doctorData.doctorId, 
      "orderId":this.doctorData.orderId
      }
      });

    // }else 
    // {
    //   this.presentToast(this.translate.instant(" ادخل "+this.medicalprescriptionImage));
    // }
    
  }

  

  scheduleNotification(m) {
    this.notificationFlag = true;
    var txt = "";
    // if(this.type_id == "1")
    //   txt = "سوف يصلك الطلب ف خلال "+m+" دقيقه";
    // else if (this.type_id == "2" || this.type_id == "3")
    //   txt = "سوف يصلك الطلب ف خلال "+m+" دقيقه";
    if(this.type_id == "1")
      txt =  " سوف يصلك الطلب من قبل " + this.doctorName ;
    
    // else if (this.type_id == "2" || this.type_id == "3")
    //   txt =  " سوف يصلك الطلب من قبل " + this.doctorName ;

//+ 1 * 1000

    this.localNotifications.schedule({
      id: 1,
      title: "تطبيق الدكتور (#"+this.orderId+" ) ",
      text:txt,
      data: { mydata: 'My hidden message' },
      trigger:{ at: new Date(new Date().getTime())}
    });
  }


  fullScreen(index){
    console.log("image clicked",index)
    this.navCtrl.push('full-screen',{data:this.photos[index]});
  }

  doRefresh(ev){

  this.refresher = ev;
  this.getOrderStatus();
    
  }

  getOrderStatus(){


    this.srv.getOrderDetails(this.orderId,this.accessToken).subscribe(
      resp=>{
        console.log("orderDetails ",resp);
        var myorder = JSON.parse(JSON.stringify(resp)).order;
        
        this.refreshOrderStatus = myorder.status;

        if(this.refreshOrderStatus == "11" && this.status11alertDisabled == false)
        {
          this.status11alertDisabled = true;
          console.log("status 11 from refresh");
          this.presentAlert("تطبيق الدكتور (#"+this.orderId+" ) "," تم الغاء الطلب من قبل " + this.doctorName);
          this.helper.removeNetworkDisconnectionListener();
          this.storage.remove("orderImages");      
        }

        //ayaa
        if((this.refreshOrderStatus == "8" || this.refreshOrderStatus == "7") && this.status8alertdiabled == false)
        {
          //بدء التوصيل
          this.status8alertdiabled = true;
          this.presentdelivaryAlert("تطبيق الدكتور (#"+this.orderId+" ) "," تم بدء توجه المتخصص لدي " + this.doctorName + "  اليك "); //+this.orderId
          this.events.publish('status8ForPLC');
        }
        if(this.refreshOrderStatus == "12" && this.status12alertdisabled== false)
        {
          this.status12alertdisabled = true;

          if(! myorder.remark)
            myorder.remark="";
          if(! myorder.date)
            myorder.date = "";
            
          this.presentContOrderConfirm(this.orderId,myorder.remark,myorder.date);
          this.helper.removeNetworkDisconnectionListener();
        }
        if(this.refreshOrderStatus == "5")
        { 
          this.helper.removeNetworkDisconnectionListener();
          this.storage.remove("orderImages");
          this.helper.dontSendNotification = true;

          this.navCtrl.setRoot(TabsPage);
          this.navCtrl.push('rate-service',{
            data:{
              doctorId:this.doctorId,
              orderId:this.orderId
            }
          });
        }

        if(this.refresher){
          this.refresher.complete();
        }  
      },
      err=>{
        console.log("orderDetailsErr",err);
        this.presentToast("خطأ فى الاتصال");
        if(this.refresher){
          this.refresher.complete();
        }

      }
    );
    
  }

  presentAlert(title,msg) {
    console.log("refresh enter presentAlert");
    this.navCtrl.setRoot(TabsPage);
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: msg,
          buttons: ['موافق']
        });
        alert.present();
  }

  presentdelivaryAlert(title,msg) {
    console.log("refresh enter presentdelivaryAlert");
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['موافق']
    });
    alert.present();
  }

  
  presentContOrderConfirm(order_id,remark,contDate) {
    var token = localStorage.getItem('user_token');
    
    // var xxdate = contDate;
    // var yydate = xxdate.split('T');
    // var zzdate = yydate[1].split('.');
    // console.log("time of notification" ,yydate[0]+" "+zzdate[0]);
    // var ourDate = yydate[0]+" "+zzdate[0];
    

    if(!remark )
      remark = "";
      
   let alert = this.alertCtrl.create({
     title: "إكمال الطلب",
     message: remark+"<br/>"+contDate+"<br>"+" هل تريد تأكيد الموعد؟",
     buttons: [
      {
        text: "لاحقا",
       role: 'cancel',
       handler: () => {
         console.log("later btn handler")
        

       }

     },
       {
         text: "إلغاء",
        //  role: 'cancel',
         handler: () => {
           console.log('confirm contorder  disagree clicked');

           this.service.updateOrderStatusToCancel(order_id,token).subscribe(
             resp=>{
               console.log("resp cancel contOrder",resp);
               if(JSON.parse(JSON.stringify(resp)).success)
               {
                 this.presentToast("تم إلغاء الموعد");
                 console.log("الغاء")
                 this.events.publish('x');
               }
                 
             },err=>{
               console.log("err cancel contOrder",err);
              //  this.presentToast("خطأ فى الاتصال");
             }
           );
         }
       },
       {
         text: "موافق",
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
              //  this.presentToast("خطأ فى الاتصال");
             }
           );
         }
       }
     ]
    //  ,

    //  enableBackdropDismiss : false
   });
   alert.present();
 }
 locationNode(docLocation){
  if(docLocation){
    this.doctorLocation = docLocation;

    

    var patientLoc  = this.lat +","+this.lng;
var DoctorLoc = this.doctorLocation.split(',')[0] +","+this.doctorLocation.split(',')[1];
this.accessToken = localStorage.getItem('user_token');  
        this.service.durationbetweenDoctorAndPatient(patientLoc,DoctorLoc,this.accessToken).subscribe(resp=>{
          console.log("resp from durationbetweenDoctorAndPatient",resp);
          var dur = JSON.parse(JSON.stringify(resp)).routes[0].legs[0].duration.value;
          console.log("durVal : ",dur);

          var number = 0;
        if(this.type_id == "1")
          number = 20*60;
        else if (this.type_id == "2" || this.type_id == "3")
          number = 30*60;

        
        var d = Number(dur+number);
        var h = Math.floor(d/3600);
        var m = Math.floor(d % 3600 /60);
        var s = Math.floor(d % 3600 % 60);
        console.log("h ", h,"m: ",m,"s: ",s);  
        
        var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
        var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

        console.log(" time : ",hdisplay+mdisplay);
        this.duration  = hdisplay+mdisplay;
        console.log("doc name from distance & duration",this.doctorName);
        if(this.notificationFlag == false && h == 0 && m == 20 && this.type_id == "1") //|| m <= 30
        {
          console.log("20--- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
          // this.scheduleNotification(m);
        }  

        },err=>{
          console.log("err from durationbetweenDoctorAndPatient",err);
        });

    // this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
    //   resp=>{

    //     var respObj = JSON.parse(JSON.stringify(resp));  
    //     console.log("duration txt",respObj.routes[0].legs[0].duration.text);
        
    //     var number = 0;
    //     if(this.type_id == "1")
    //       number = 20*60;
    //     else if (this.type_id == "2" || this.type_id == "3")
    //       number = 30*60;
        
    //     console.log("duration value",respObj.routes[0].legs[0].duration.value);
    //     var dur = respObj.routes[0].legs[0].duration.value;
        
    //     var d = Number(dur+number);
    //     var h = Math.floor(d/3600);
    //     var m = Math.floor(d % 3600 /60);
    //     var s = Math.floor(d % 3600 % 60);
    //     console.log("h ", h,"m: ",m,"s: ",s);  
        
    //     var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
    //     var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

    //     console.log(" time : ",hdisplay+mdisplay);
    //     this.duration  = hdisplay+mdisplay;
    //     console.log("doc name from distance & duration",this.doctorName);
    //     if(this.notificationFlag == false && h == 0 && m == 20 && this.type_id == "1") //|| m <= 30
    //     {
    //       console.log("20--- m: ",m," flag: ",this.notificationFlag," type_id: ",this.type_id);
    //       this.scheduleNotification(m);
    //     }  

        
    //   },
    //   err=>{
    //     console.log("err from getDurationAndDistance: ",err);
    //   }
    // );

    
  }
  
 }

 

ionViewWillEnter(){
  console.log("will enter from follow order for plc");
  this.helper.view = "follow";
}

//ayaaaaaaaaaa
medicalConsultant() {
  console.log("medicalConsultant");
  var modalPage = this.modalCtrl.create('ModalPage',{from:"medicalConsultant"});
  modalPage.present();
}


  //ayaaaaaaaaaa
  useCoupon() {

    console.log("currentFees: "+this.currentFees);

    if (String(this.currentFees).trim()) {
      //alert(this.spec_id)
       this.service.checKCoupon2(this.orderId,this.patientId,this.doctorId,this.accessToken,"",String(this.currentFees).trim(),(data)=>{
         if(data.success){
           if(data.status == -1){
             this.presentToast("كوبون الخصم غير صالح");
             this.currentFees = "";
           }
           else if(data.status == 2){
             this.presentToast("كوبون الخصم مستخدم من قبل");
             this.currentFees = "";
           }
           else if(data.status == 1){
             let coupon_type = ""
             if(data.coupon.type == "percent"){
               coupon_type = data.coupon.discount +" % "
             }
             else{
               coupon_type = data.coupon.discount+ " جنيه "
             }
             let confirm = this.alertCtrl.create({
               title: '',
               subTitle: "سيتم خصم "+coupon_type+" من قيمة الكشف",
               buttons: [
                 {
                   text: "تم",
                   handler: () => {
                    this.currentFees = "";
                   }
                 },
             ]
             });
             confirm.present();
           }
           else if(data.status == 8){
            this.presentToast("تم إدخال كوبون خصم لهذا الطلب من قبل");
            this.currentFees = "";
          }
           
         }
         else{
           if(data.status == -1){
             this.presentToast("كوبون الخصم غير صالح")
           }
           else if(data.status == 2){
             this.presentToast("كوبون الخصم مستخدم من قبل")
           }
           else{
             this.presentToast("كوبون الخصم غير صالح")
           }
           this.currentFees = "";         
         }
        
       },
       (data)=>{
         this.presentToast("خطأ في الأتصال")
       })
     }
  }
  ////////////////////


}
