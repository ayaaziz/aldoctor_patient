import { Component } from '@angular/core';
import {  ToastController, ActionSheetController , IonicPage, NavController, NavParams ,Events} from 'ionic-angular';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage({
  name:'order-specific-service'
})
@Component({
  selector: 'page-order-specific-service',
  templateUrl: 'order-specific-service.html',
})
export class OrderSpecificServicePage {
  type_id;
  title;
  servicetitle;
  medicalprescriptionImage;
  image="assets/imgs/empty-image.png";
  lat;
  lng;

  accessToken;
  Specialization="";
  SpecializationArray=[];
  
  langDirection;

  
  first;
  second;
  third;
  fourth
  last;
  // photos = ["assets/imgs/empty-image.png","assets/imgs/empty-image.png"];
 photos = [];
  photosForApi=[];
  doctors = [];

  
  // doctors=[{"id":1,lat:"",lng:"","distanceVal":10000,"distance":"","timefordelivery":"","name":"pharmacy 1","color":"grey","offline":true,"place":"mansoura","cost":"200","rate":"4","specialization":"specialization1","profile_pic":"assets/imgs/default-avatar.png"},
  // {"id":2,lat:"",lng:"","distanceVal":10000,"distance":"","timefordelivery":"","name":"pharmacy 2","color":"grey","offline":true,"place":"mansoura","cost":"300","rate":"3","specialization":"specialization2","profile_pic":"assets/imgs/default-avatar.png"},
  // {"id":3,lat:"",lng:"","distanceVal":10000,"distance":"","timefordelivery":"","name":"pharmacy 3","color":"grey","offline":true,"place":"mansoura","cost":"400","rate":"2","specialization":"specialization3","profile_pic":"assets/imgs/default-avatar.png"}];


  cost:number=0;
  choosenDoctors=[];
  tostClass ;
  spText;
  rate;
  scrollHeight="0px";
  index;
  offline=false;
  searchValue;
  showLoading=true;
  orderBTn = false;
  imageFlag = true;

  center_id= "";
  imageExt=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translate: TranslateService,  public events: Events,
    public helper:HelperProvider, public toastCtrl: ToastController, 
    public storage: Storage,public camera: Camera, 
    public srv:ProvidedServicesProvider,public service:LoginserviceProvider,
    public actionSheetCtrl: ActionSheetController) {

      this.langDirection = this.helper.lang_direction;
      
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";


      this.translate.use(this.helper.currentLang);
      
      // this.accessToken = this.helper.accessToken;

      // this.storage.get("access_token").then(data=>{
      //   //this.accessToken = this.helper.accessToken;
      //   this.accessToken = data;
      this.accessToken = localStorage.getItem('user_token');
        this.helper.accessToken = this.accessToken;

      // });

      var recievedData = this.navParams.get('data');
      this.type_id = recievedData.type_id;
      this.lat = recievedData.lat;
      this.lng = recievedData.lng;

      this.helper.type_id = this.type_id;
      
      console.log("order service recievedData: ",recievedData);
      console.log("type id: ",this.type_id);

      if(this.type_id == "1")
      {
        this.title = this.translate.instant("specificpharmacy");
        this.servicetitle = this.translate.instant("pharmacyName");
        this.medicalprescriptionImage = this.translate.instant("medicalprescription");
      }else  if(this.type_id == "3")
      {
        this.title = this.translate.instant("specificlab");
        this.servicetitle = this.translate.instant("labName");
        this.medicalprescriptionImage = this.translate.instant("requiredTests");
      } else  if(this.type_id == "2")
      {
        this.title = this.translate.instant("specificcenter");
        this.servicetitle = this.translate.instant("centerName");
        this.medicalprescriptionImage = this.translate.instant("requiredRadiologies");
      }


      this.spText=this.translate.instant("chooseSpecialization");

      this.events.subscribe('statusChanged', (data) => {
        console.log(" event status changed ",data);
    
        for(var k=0;k<this.doctors.length;k++)
        {
          
          if(this.doctors[k].id == data.id)
          {
            if(data.status == "1")
            {
              this.doctors[k].color="green";
              this.doctors[k].offline=false;
              this.doctors[k].moreTxt = "متوافر";
              console.log("call sort function from status changed");
              this.sortDoctors();

            }else if (data.status == "0")
            {
              this.doctors[k].color="grey";
              this.doctors[k].offline=true;
              this.doctors[k].moreTxt = "غير متوافر";
              console.log("call sort function from status changed");
                this.sortDoctors();
            }
          }
          
        }


      });
      this.events.subscribe('status', (data) => {
        console.log(" event status ",data);
    
        for(var k=0;k<this.doctors.length;k++)
        {
          
          if(this.doctors[k].id == data.id)
          {
            if(data.status == "1")
            {
              this.doctors[k].color="green";
              this.doctors[k].offline=false;
              this.doctors[k].moreTxt = "متوافر";

              console.log("call sort function from status");
                this.sortDoctors();

            }else if (data.status == "0")
            {
              this.doctors[k].color="grey";
              this.doctors[k].offline=true;
              this.doctors[k].moreTxt="غير متوافر";

              console.log("call sort function from status");
                this.sortDoctors();
            }
          } 
        }
      });

      this.events.subscribe('locationChanged', (data) => {
        console.log("location changed event",data);
        if(data.location){
          for(var k=0;k<this.doctors.length;k++)
          {   
            if(this.doctors[k].id == data.id)
            {
              this.doctors[k].lat = data.location.split(',')[0];
              this.doctors[k].lng = data.location.split(',')[1];
              if(this.doctors[k].offline == false)
              {
                this.getDistanceAndDuration(k);
                this.sortDoctors();
              }
              
            }
                  
          }
          }


      });
this.events.subscribe('location', (data) => {
  console.log(" event location ",data);
  if(data.location){
  for(var k=0;k<this.doctors.length;k++)
  {   
    if(this.doctors[k].id == data.id)
    {
      this.doctors[k].lat = data.location.split(',')[0];
      this.doctors[k].lng = data.location.split(',')[1];
      if(this.doctors[k].offline == false){
        this.getDistanceAndDuration(k);
      }
      
    

    }
          
  }
  }



  });

  this.events.subscribe('getBusyDoctor', (data) => {
    console.log(" event getBusyDoctor ",data);
    
    for(var k=0;k<this.doctors.length;k++)
    {
      
      if(this.doctors[k].id == data.id)
      {
        if(data.status == "1")
        {
          this.doctors[k].color="red";
          this.doctors[k].offline=true;
          this.doctors[k].moreTxt = "غير متوافر";

          console.log("call sort function from get busy");
                this.sortDoctors();

        }else if (data.status == "0")
        {
          this.doctors[k].color="green";
          this.doctors[k].offline=false;
          this.doctors[k].moreTxt = "متوافر";
          this.helper.getDoctorStatus(data.id);
          console.log("call sort function from get busy");
                this.sortDoctors();
        }

    
      } 
    }
  });

  this.events.subscribe('busyDoctorChanged', (data) => {
    console.log(" event busyDoctorChanged ",data);
    
    for(var k=0;k<this.doctors.length;k++)
    {
      
      if(this.doctors[k].id == data.id)
      {
        if(data.status == "1")
        {
          this.doctors[k].color="red";
          this.doctors[k].offline=true;
          this.doctors[k].moreTxt = "غير متوافر";

          console.log("call sort function from busy changed");
                this.sortDoctors();

        }else if (data.status == "0")
        {
          this.doctors[k].color="green";
          this.doctors[k].offline=false;
          this.doctors[k].moreTxt = "متوافر";
          this.helper.getDoctorStatus(data.id);
          console.log("call sort function from busy changed");
                this.sortDoctors();
        }


      } 
    }
  });

  

    }

  colclicked(){
    // console.log("s element: ",this.sElement);
  //this.sElement.ionChange();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSpecificServicePage');
    //this.showLoading = false;
    this.srv.nearbyservices(this.type_id,this.center_id,this.lat,this.lng,this.accessToken).subscribe(
      resp=>{
        //this.showLoading = true;
        console.log("nearbyservice resp: ",resp);
        
       

      },
      err=>{
        // this.showLoading = true;
        console.log("nearbyservice error: ",err);
      }
    );

  }

  doctorChecked(item , event){
    console.log("doctor checked",item);
    if(item.checked == true)
      {
        this.choosenDoctors.push(item);
      }
    else
      {
        for(var i=0;i<this.choosenDoctors.length;i++){
          if(item.name == this.choosenDoctors[i].name )
            this.choosenDoctors.splice(i,1);
        }
      }

  
  }
  getDistanceAndDuration(i){

    if(this.doctors[i].offline == false){

      console.log("online doctor i",this.doctors[i]);
      console.log("online doctor index",this.doctors[this.index]);

    console.log("doctors from array",this.doctors[i]);
    console.log("lat from helper",this.helper.lat);
    console.log("lon from helper",this.helper.lon);
    var docLat = this.doctors[i].lat;
    var docLon = this.doctors[i].lng;
    console.log("doctor lat :",docLat);
    console.log("doctor lng: ",docLon);
    console.log("doctor before duration",this.doctors[i]);
    this.index = i;
    
      
    this.service.getDurationAndDistance(this.helper.lat,this.helper.lon,docLat,docLon).subscribe(
      resp=>{
        console.log("doctors",this.doctors);
        console.log("doctor ",this.doctors[this.index]);
        console.log("get data from google api",resp);
        var respObj = JSON.parse(JSON.stringify(resp));
        if(respObj.routes[0])
        {
        console.log("duration : ",respObj.routes[0].legs[0].duration.text);
        console.log("distance : ",respObj.routes[0].legs[0].distance.text);
        console.log("doctor from array in get duration ",this.doctors[i]);
        this.doctors[i].distance = respObj.routes[0].legs[0].distance.text;
        this.doctors[i].distanceVal = respObj.routes[0].legs[0].distance.value;
        this.doctors[i].timefordelivery = respObj.routes[0].legs[0].duration.text;
        console.log("distance from array ",this.doctors[i].distance);
        }

        if(i == (this.doctors.length -1))
        {
          console.log("call sort function");
          this.sortDoctors();
        }

  
      },
      err=>{
        console.log("get err from google api",err);
      }
    );
  }

  }
  sortDoctors(){
    console.log("doc before sort ",this.doctors);
  
    //sort by nearest & online
    this.doctors.sort((a,b)=>{
      if(a.offline == false || b.offline == false)
        return a.distanceVal-b.distanceVal;
  
    });
    
    console.log("doc after sort ",this.doctors);
  }


  sendOrder(){
    console.log("first: ",this.first);
    console.log("second: ",this.second);
    console.log("doctors: ",this.choosenDoctors);
    console.log("cost: ",this.cost);
    // if(this.choosenDoctors.length > 3 )
    // {
    //   this.presentToast(this.translate.instant("check3doctors"));
    // }else if (this.choosenDoctors.length<1){
    //   this.presentToast(this.translate.instant("checkAtleastone"));
    // }
    if(this.choosenDoctors.length > 3 && this.type_id == 3)
    {
      this.presentToast(this.translate.instant("check3labs"));
    }else if (this.choosenDoctors.length<1 && this.type_id == 3){
      this.presentToast(this.translate.instant("checkAtleastonelab"));
    }else if(this.choosenDoctors.length > 3 && this.type_id == 2)
    {
      this.presentToast(this.translate.instant("check3centers"));
    }else if (this.choosenDoctors.length<1 && this.type_id == 2){
      this.presentToast(this.translate.instant("checkAtleastonecenter"));
    }else if(this.choosenDoctors.length > 5 && this.type_id == 1)
    {
      this.presentToast(this.translate.instant("check5pharmacies"));
    }else if (this.choosenDoctors.length<1 && this.type_id == 1){
      this.presentToast(this.translate.instant("checkAtleastonepharmacy"));
    }
    else{
      // var doctorsId="";
      // for(var j=0;j<this.choosenDoctors.length;j++)
      // {
      //   doctorsId += this.choosenDoctors[j].id+",";
      // }
      var doctorsId=[];
      for(var j=0;j<this.choosenDoctors.length;j++)
      {
        doctorsId.push(this.choosenDoctors[j].id);
      }

      console.log("doctors id: ",doctorsId);
      this.orderBTn = true;
      this.srv.saveOrder(doctorsId.join(','),this.photosForApi,this.imageExt.join(','),this.accessToken,this.choosenDoctors.length).subscribe(
        resp => {
          console.log("saveOrder resp: ",resp);
          // this.presentToast(this.translate.instant("ordersent"));
          // this.navCtrl.pop();
          // this.navCtrl.push('remaining-time-to-accept');

          if(JSON.parse(JSON.stringify(resp)).success ){
            
            this.storage.set('orderImages',this.photos).then(
              val=>{
                console.log("image saved",val);
              }
            );

            console.log("saveOrder resp: ",resp);
            var newOrder = JSON.parse(JSON.stringify(resp));
            
  
            // this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,this.choosenDoctors.length);
            // this.helper.orderStatusChanged(newOrder.order.id);
            
            
            // this.helper.createOrderForPLC(this.type_id,newOrder.order.id,newOrder.order.service_profile_id,this.choosenDoctors.length);
            // this.helper.orderStatusChangedForPLC(newOrder.order.id);

            this.helper.orderIdForUpdate = newOrder.order.id;
            
            this.presentToast(this.translate.instant("ordersent"));
            
            // this.navCtrl.push('remaining-time-to-accept');
            if(this.photosForApi.length == 0)
              this.navCtrl.setRoot('remaining-time-for-plc',{data:0,orderId:newOrder.order.id});
            else 
              this.navCtrl.setRoot('remaining-time-for-plc',{data:1,orderId:newOrder.order.id});

            }else{
              this.presentToast(this.translate.instant("serverError"));
            }

        },
        err=>{
          console.log("saveOrder error: ",err);
          this.presentToast(this.translate.instant("serverError"));
          this.orderBTn = false;
        }
      );    
    }
    
  }

  showseviceProfile(item){
    console.log("card item ",item);
    // item.specialization = this.Specialization;
    // console.log("item after add specialization: ",item);
    item.type_id = this.type_id;
    this.navCtrl.push('service-profile',{
      data:item
    });
  }

  // validate(){
  //   console.log("validation") ;
  //   var code = this.first+this.second+this.third+this.fourth+this.last;
  //   this.service.validateDiscountCode(this.accessToken,code).subscribe(
  //     resp =>{
  //       console.log("resp from validateDiscountCode: ",resp);
  //     },
  //     err=>{
  //       console.log("err from validateDiscountCode: ",err);
  //     }
  //   );
  // }
  validate(){
    console.log("validation") ;
    var code = this.first+this.second+this.third+this.fourth+this.last;
    this.service.validateDiscountCode(code, this.accessToken).subscribe(
      resp =>{
        console.log("resp from validateDiscountCode: ",resp);
        if( JSON.parse(JSON.stringify(resp)).valid)
        {
          this.presentToast(this.translate.instant("validDiscountCode"));
        }else{
          this.presentToast(this.translate.instant("notValidDiscountCode"));
        }
      },
      err=>{
        this.presentToast(this.translate.instant("serverError"));
        console.log("err from validateDiscountCode: ",err);
      }
    );
  }
  dismiss(){
    this.navCtrl.pop();
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
    
    // targetWidth: 600,
    //     targetHeight: 600,

    var options = {
      targetWidth: 600,
      targetHeight: 600,
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
 
    this.camera.getPicture(options).then((imageData) => {
   
      console.log("imageData" , imageData);
      this.image = 'data:image/jpeg;base64,' + imageData;
      
      console.log("image ",this.image);
      this.photos.push(this.image);
      // this.photosForApi.push(imageData.replace(/\+/g,","));
      
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
  getItems(ev) {
    var searchVal = ev.target.value;
    var id ;
    console.log("search value ",searchVal);
    this.showLoading = false;

      this.srv.searchServiceByName(searchVal,this.type_id,this.accessToken).subscribe(
        resp=>{
          console.log("searchServiceByName resp: ",resp);
          this.showLoading=true;
          console.log("nearbyservice resp: ",resp);
          
          let doctorData =JSON.parse(JSON.stringify(resp));
          console.log("service data",doctorData);
        console.log("doctors data",doctorData["result"]);
        this.doctors=[];  
        for(var i=0;i<doctorData["result"].length;i++){
            console.log("doctor: ",doctorData["result"][i]); 
            
            // doctorData["result"][i].color="green";
            // doctorData["result"][i].offline = false;

            doctorData["result"][i].timefordelivery = "1د";
            doctorData["result"][i].distance ="1م";
            
            doctorData["result"][i].type_id = this.type_id;
            if(doctorData["result"][i].nickname)
            doctorData["result"][i].doctorName = doctorData["result"][i].nickname;
            else 
            doctorData["result"][i].doctorName = doctorData["result"][i].name;

      

          if(doctorData["result"][i].busy == "1")
          {
            doctorData["result"][i].color="red";
            doctorData["result"][i].offline=true;
            doctorData["result"][i].moreTxt = "غير متوافر";
            
          }else if (doctorData["result"][i].busy == "0")
          {
            if(doctorData["result"][i].online  == "1")
              {
                doctorData["result"][i].color="green";
                doctorData["result"][i].offline=false;
                doctorData["result"][i].moreTxt = "متوافر";

              }else if (doctorData["result"][i].online  == "0")
              {
                doctorData["result"][i].color="grey";
                doctorData["result"][i].offline=true;
                doctorData["result"][i].moreTxt = "غير متوافر";
              }
           
          }

          


            this.doctors.push(doctorData["result"][i]);
          }
          
        if(this.doctors.length >= 3)
        {
          this.scrollHeight = "385px";
        
        }else{
          this.scrollHeight = "260px";
        }
          for(i=0;i<this.doctors.length;i++)
          {
            
            this.helper.getDoctorStatus(this.doctors[i].id);
            this.helper.getBusyDoctor(this.doctors[i].id);
            
          }
          
          if(this.doctors.length == 0)
          {
            console.log("if = 0");
            this.presentToast(this.translate.instant("noSearchResult"));
          }
          
        },
        err=>{
          console.log("getDoctorsByName error: ",err);
          this.showLoading = true;
          this.presentToast(this.translate.instant("serverError"));
        }
      );
    
  }


}
