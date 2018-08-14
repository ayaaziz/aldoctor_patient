import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController ,ActionSheetController ,Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TabsPage } from '../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';



@IonicPage({
  name:'follow-order-for-plc'
})
@Component({
  selector: 'page-follow-order-for-plc',
  templateUrl: 'follow-order-for-plc.html',
  providers: [Diagnostic, LocationAccuracy]
})
export class FollowOrderForPlcPage {

  doctorData;
  doctorId;
  doctorName;
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
  photosForApi=[];
  
  imageFlag = true;
  image;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage,public service: LoginserviceProvider,
    public diagnostic: Diagnostic,public locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,public helper:HelperProvider,
    public translate: TranslateService,
    public toastCtrl: ToastController, public alertCtrl: AlertController,
    public events: Events,public camera: Camera,
    public actionSheetCtrl: ActionSheetController)
    {  
      this.langDirection = this.helper.lang_direction;
    
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.type_id = this.helper.type_id;

      console.log("langdir: ",this.langDirection);
      this.translate.use(this.helper.currentLang);
      this.doctorData = this.navParams.get('data');
      console.log("data from follow order:",this.doctorData);
    
      this.doctorId = this.doctorData.doctorId;
      console.log("doctorid: ",this.doctorId," orderid: ",this.doctorData.orderId);
      // if(this.doctorData.order_status && this.doctorData.order_status == "7")
      //   this.disableCancelBtn = true;
      // else
      //   this.disableCancelBtn = false;
  
      if(this.type_id == "1"){
        this.callService = this.translate.instant("callPharmacy");
        this.serviceName = this.translate.instant("pharmacyName");
        this.serviceTxt = this.translate.instant("pharmacyServiceTxt");
        this.completeServiceTxt = this.translate.instant("pharmacycmpServiceTxt");
        this.hint = "";
        this.medicalprescriptionImage = this.translate.instant("medicalprescription");
        this.sendprescription = " ارسال "+this.medicalprescriptionImage;
      }  
      else if(this.type_id == "2"){
        this.callService = this.translate.instant("calllab");
        this.serviceName = this.translate.instant("labName");
        this.serviceTxt = this.translate.instant("labServiceTxt");
        this.completeServiceTxt = this.translate.instant("pharmacycmpServiceTxt");
        this.hint = this.translate.instant("labHint");
        this.medicalprescriptionImage = this.translate.instant("requiredTests");
        this.sendprescription = " ارسال "+this.medicalprescriptionImage;
      }
      else if(this.type_id == "3"){
        this.callService = this.translate.instant("callcenter");
        this.serviceName = this.translate.instant("centerName2");
        this.serviceTxt = this.translate.instant("labServiceTxt");
        this.completeServiceTxt = this.translate.instant("pharmacycmpServiceTxt");
        this.hint = this.translate.instant("labHint");
        this.medicalprescriptionImage = this.translate.instant("requiredRadiologies");
        this.sendprescription = " ارسال "+this.medicalprescriptionImage;
      }
      
        this.storage.get("access_token").then(data=>{
        this.accessToken = data;
        this.service.getServiceProfile(this.doctorId,this.accessToken).subscribe(
          resp =>{
            console.log("resp from getserviceprofile in followorder: ",resp);
            var tempData = JSON.parse(JSON.stringify(resp)).user;
            if (tempData.nickname)
              this.doctorName = tempData.nickname;
            else 
              this.doctorName = tempData.name;
              
            this.doctorRate = tempData.rate;
            this.doctorSpecialization = tempData.speciality; 
            this.OrderCost = tempData.extraInfo.discount;
            this.phone = tempData.phone;
            console.log("phone",this.phone);          
   
           
            this.helper.getDoctorlocation(this.doctorId);

          },err=>{
            console.log("error from getserviceprofile in followorder:",err);
          }
  
        );
      });
      this.events.subscribe('location', (data) => {
        console.log(" event location ",data);
        if(data.location){
          this.doctorLocation = data.location;
          this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
            resp=>{
  
              var respObj = JSON.parse(JSON.stringify(resp));  
              console.log("duration txt",respObj.routes[0].legs[0].duration.text);
              // var dur = respObj.routes[0].legs[0].duration.text;
              // console.log("distance : ",respObj.routes[0].legs[0].distance.text);

              // if(dur.includes("hours"))
              //   dur = dur.replace("hours","س");

              // if(dur.includes("mins"))
              //   dur = dur.replace("mins","د");

              // if(dur.includes("min"))
              //   dur = dur.replace("min","د");
    
              // if (dur.includes("hour"))
              //   dur = dur.replace("hour","س");

              // this.duration = dur;
              var number = 0;
              if(this.type_id == "1")
                number = 20*60;
              else if (this.type_id == "2" || this.type_id == "3")
                number = 30*60;
              
              console.log("duration value",respObj.routes[0].legs[0].duration.value);
              var dur = respObj.routes[0].legs[0].duration.value;
              
              var d = Number(dur+number);
              var h = Math.floor(d/3600);
              var m = Math.floor(d % 3600 /60);
              var s = Math.floor(d % 3600 % 60);
              console.log("h ", h,"m: ",m,"s: ",s);  
              // var hdisplay = h > 0 ? h + (h == 1 ? "hour, ":"hours, "):"";
              // var mdisplay = m > 0 ? m + (m == 1 ? "minute, ":"minutes, "):"";
              // var sdisplay = s > 0 ? s + (s == 1 ? "second, ":"seconds, "):"";

              var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
              var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

              console.log(" time : ",hdisplay+mdisplay);
              this.duration  = hdisplay+mdisplay;

            },
            err=>{
              console.log("err from getDurationAndDistance: ",err);
            }
          );
    
          
        }
        });
        this.events.subscribe('locationChanged', (data) => {
          console.log(" event location changed",data);
          if(data.location){
            this.doctorLocation = data.location;
            console.log("doctor location",this.doctorLocation);
            this.service.getDurationAndDistance(this.lat,this.lng,this.doctorLocation.split(',')[0],this.doctorLocation.split(',')[1]).subscribe(
            resp=>{
              var respObj = JSON.parse(JSON.stringify(resp));
              console.log("duration",respObj.routes[0].legs[0].duration.text);
              var dur = respObj.routes[0].legs[0].duration.text;
              console.log("distance txt: ",respObj.routes[0].legs[0].distance.text);

              // if(dur.includes("hours"))
              //   dur = dur.replace("hours","س");

              // if(dur.includes("mins"))
              //   dur = dur.replace("mins","د");

              // if(dur.includes("min"))
              //   dur = dur.replace("min","د");
    
              // if (dur.includes("hour"))
              //   dur = dur.replace("hour","س");

              // this.duration = dur;
              var number = 0;
              if(this.type_id == "1")
                number = 20*60;
              else if (this.type_id == "2" || this.type_id == "3")
                number = 30*60;
              
              console.log("duration value",respObj.routes[0].legs[0].duration.value);
              var dur = respObj.routes[0].legs[0].duration.value;
              
              var d = Number(dur+number);
              var h = Math.floor(d/3600);
              var m = Math.floor(d % 3600 /60);
              var s = Math.floor(d % 3600 % 60);
              console.log("h ", h,"m: ",m,"s: ",s);  
              
              var hdisplay = h > 0 ? h + (h == 1 ? " س ":" س "):"";
              var mdisplay = m > 0 ? m + (m == 1 ? " د ":" د "):"";

              console.log(" time : ",hdisplay+mdisplay);
              this.duration  = hdisplay+mdisplay;


        },
        err=>{
          console.log("err from getDurationAndDistance: ",err);
        }
      );

          }

          });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowOrderForPlcPage');

    if(!navigator.onLine)
      this.presentToast(this.translate.instant("checkNetwork"));

    if(this.helper.detectLocation == false)
      this.test();
    else{
      this.lat = this.helper.lat;
      this.lng = this.helper.lon;

    }
    

    this.events.subscribe('status8', (data) => {
      console.log("notification event status 8");
      this.helper.trackDoctor(this.doctorId); 
    });
    this.events.subscribe('status5', (data) => {
      console.log("notification event status 5",data);
      this.navCtrl.push(TabsPage);
      this.navCtrl.push('rate-doctor',{
        data:{
          doctorId:data.doctorId,
          orderId:data.orderId
        }
      });
      
    });
    this.events.subscribe('status7', (data) => {
      console.log("notification event status 7");

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

    this.service.cancelMsg(this.accessToken).subscribe(
      resp=>{
        console.log("cancel msg resp",resp);
        this.presentCancelConfirm(JSON.parse(JSON.stringify(resp)).message);
      }
    );
  }
  dismiss(){
    this.navCtrl.pop();
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
      quality: 100,
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
      
      if(this.photosForApi.length == 2)
        this.imageFlag = false;

      console.log("all photos ",this.photos,"length",this.photos.length);
      console.log("photos for api",this.photosForApi,"length",this.photosForApi.length);
    

    }, (err) => {
     
     });
  }
  sendprescriptionImages(){
    

    if(this.photosForApi.length == 0 && this.type_id == 2)
    {
      this.presentToast(this.translate.instant("atleastOneimageforLab"));
    }else if(this.photosForApi.length == 0 && this.type_id == 3)
    {
      this.presentToast(this.translate.instant("atleastOneimageforcenter"));
    }else if(this.photosForApi.length == 0 && this.type_id == 1)
    {
      this.presentToast(this.translate.instant("atleastOneimageforpharmacy"));
    }else{

    }
  }
  deletePhoto(index){
    console.log("photo index",index);
    this.photos.splice(index, 1);
    this.photosForApi.splice(index,1);
    this.imageFlag = true;
  }
  serviceRate(){
    this.navCtrl.push('rate-service',
  {data:
    {
      "doctorId":this.doctorData.doctorId, 
      "orderId":this.doctorData.orderId
    }
  });
  }

  
}
