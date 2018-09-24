import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams,ActionSheetController ,Events, App} from 'ionic-angular';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage({
  name:'order-service'
})
@Component({
  selector: 'page-order-service',
  templateUrl: 'order-service.html',
})
export class OrderServicePage {

  type_id;
  title;
  serviceTitle;
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
  
   //DoctorsArray=[{"moreTxt":"xx","id":1,lat:"",lng:"","distanceVal":10000,"distance":"","timefordelivery":"","name":"pharmacy 1","color":"grey","offline":true,"place":"mansoura","cost":"200","rate":"4","specialization":"specialization1","profile_pic":"assets/imgs/default-avatar.png"}];
  //  ,
  //  {"id":2,lat:"",lng:"","distanceVal":10000,"distance":"","timefordelivery":"","name":"pharmacy 2","color":"grey","offline":true,"place":"mansoura","cost":"300","rate":"3","specialization":"specialization2","profile_pic":"assets/imgs/default-avatar.png"},
  // {"id":3,lat:"",lng:"","distanceVal":10000,"distance":"","timefordelivery":"","name":"pharmacy 3","color":"grey","offline":true,"place":"mansoura","cost":"400","rate":"2","specialization":"specialization3","profile_pic":"assets/imgs/default-avatar.png"}];
  
   DoctorsArray=[];


  cost:number=0;
  choosenDoctors=[];
  tostClass ;

  
  spId;
  spValue;

  
  
  index;

  scrollHeight="0px";
  offline=false;

  loading;
  showLoading=true;

  orderBTn = false;
  
  photosForApi=[];
  //photos = ["assets/imgs/empty-image.png","assets/imgs/empty-image.png"];
  photos=[];
  imageFlag = true;

  center_id = "" ;
  imageExt=[];
  refresher;


  constructor(public translate: TranslateService,  public events: Events,
    public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider, public toastCtrl: ToastController, 
    public storage: Storage, public app:App,
    public srv:ProvidedServicesProvider,
  public service:LoginserviceProvider,
  public camera: Camera,
  public actionSheetCtrl: ActionSheetController) {

    this.accessToken = localStorage.getItem('user_token');

      this.langDirection = this.helper.lang_direction;
      this.helper.view = "pop";
      
       
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.translate.use(this.helper.currentLang);
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
      
      console.log("recievedData.center_id",recievedData.center_id);

      if(recievedData.center_id)
      {console.log("from if recievedData.center_id",recievedData.center_id);
        this.center_id = recievedData.center_id;
      }else if(recievedData.center_id == 0)
      {
        console.log("else if recievedData.center_id == 0 ");
        this.center_id = recievedData.center_id;
      }
      
      // this.spId = datafromsp.id;
      // this.spValue = datafromsp.sp;
      // this.Specialization = this.spValue;

      console.log("construct id ",this.spId," value ",this.spValue);
  
      console.log("order service recievedData: ",recievedData);
      console.log("type id: ",this.type_id);

      if(this.type_id == "1")
      {
        this.title = this.translate.instant("pharmacy");
        this.serviceTitle = this.translate.instant("nearbyPharmacy");
        this.medicalprescriptionImage = this.translate.instant("medicalprescription");
      }else if(this.type_id == "3")
      {
        this.title = this.translate.instant("lap");
        this.serviceTitle = this.translate.instant("nearbyLab");
        this.medicalprescriptionImage = this.translate.instant("requiredTests");
      }else if(this.type_id == "2")
      {
        this.title = this.translate.instant("center");
        this.serviceTitle = this.translate.instant("nearbyCenter");
        this.medicalprescriptionImage = this.translate.instant("requiredRadiologies");
      }



      this.events.subscribe('statusChanged', (data) => {
        console.log(" event status changed ",data);
  
        for(var k=0;k<this.DoctorsArray.length;k++)
        {
          
          if(this.DoctorsArray[k].id == data.id)
          {
            if(data.status == "1")
            {
              this.DoctorsArray[k].color="green";
              this.DoctorsArray[k].offline=false;
              this.DoctorsArray[k].moreTxt = "متوافر";
              console.log("offline false ",this.DoctorsArray[k]);
              console.log("call sort function from status changed");
              this.sortDoctors();

            }else if (data.status == "0")
            {
              this.DoctorsArray[k].color="grey";
              this.DoctorsArray[k].offline=true;
              this.DoctorsArray[k].moreTxt="غير متوافر";

              console.log("call sort function from status changed");
              this.sortDoctors();
            }
          }
          
        }


      });
      this.events.subscribe('status', (data) => {
        console.log(" event status ",data);
  
        for(var k=0;k<this.DoctorsArray.length;k++)
        {
          
          if(this.DoctorsArray[k].id == data.id)
          {
            if(data.status == "1")
            {
              this.DoctorsArray[k].color="green";
              this.DoctorsArray[k].offline=false;
              this.DoctorsArray[k].moreTxt = "متوافر";
              console.log("offline false ",this.DoctorsArray[k]);
              console.log("call sort function from status");
              this.sortDoctors();

            }else if (data.status == "0")
            {
              this.DoctorsArray[k].color="grey";
              this.DoctorsArray[k].offline=true;
              this.DoctorsArray[k].moreTxt="غير متوافر";

              console.log("call sort function whenfrom status");
              this.sortDoctors();
            }
          } 
        }
      });

      // this.events.subscribe('locationChanged', (data) => {
      //   console.log("location changed event",data);

      //   if(data.location){
      //     for(var k=0;k<this.DoctorsArray.length;k++)
      //     {   
      //       if(this.DoctorsArray[k].id == data.id)
      //       {
      //         this.DoctorsArray[k].lat = data.location.split(',')[0];
      //         this.DoctorsArray[k].lng = data.location.split(',')[1];
      //         if(this.DoctorsArray[k].offline == false)
      //         {
      //           this.getDistanceAndDuration(k);
      //           this.sortDoctors();
      //         }
  
              
      //       }
                  
      //     }
      //     }

      // });
// this.events.subscribe('location', (data) => {
//   console.log(" event location ",data);
  

//   if(data.location){
//   for(var k=0;k<this.DoctorsArray.length;k++)
//   {   
//     if(this.DoctorsArray[k].id == data.id)
//     {
//       this.DoctorsArray[k].lat = data.location.split(',')[0];
//       this.DoctorsArray[k].lng = data.location.split(',')[1];
//       if(this.DoctorsArray[k].offline == false)
//       {  
//         this.getDistanceAndDuration(k);
//       }
     
      
//     }
          
//   }
//   }

  


//   });

  this.events.subscribe('getBusyDoctor', (data) => {
    console.log(" event getBusyDoctor ",data);
    // data.status;
    // data.id;

    for(var k=0;k<this.DoctorsArray.length;k++)
    {
      
      if(this.DoctorsArray[k].id == data.id)
      {
        if(data.status == "1")
        {
          this.DoctorsArray[k].color="red";
          this.DoctorsArray[k].offline=true;
          this.DoctorsArray[k].moreTxt="غير متوافر";

          console.log("call sort function from get busy red");
              this.sortDoctors();

        }else if (data.status == "0")
        {
          this.DoctorsArray[k].color="green";
          this.DoctorsArray[k].offline=false;
          this.DoctorsArray[k].moreTxt = "متوافر";
          console.log("doctor :(",this.DoctorsArray[k]);
          console.log("offline false ",this.DoctorsArray[k]);
          this.helper.getDoctorStatus(data.id);
          console.log("call sort function from get busy green");
              this.sortDoctors();
        }
  
      } 
    }
  });

  this.events.subscribe('busyDoctorChanged', (data) => {
    console.log(" event busyDoctorChanged ",data);
  
    for(var k=0;k<this.DoctorsArray.length;k++)
    {
      
      if(this.DoctorsArray[k].id == data.id)
      {
        if(data.status == "1")
        {
          this.DoctorsArray[k].color="red";
          this.DoctorsArray[k].offline=true;
          this.DoctorsArray[k].moreTxt="غير متوافر";

          console.log("call sort function from get busy changed");
              this.sortDoctors();

        } else if (data.status == "0")
        {
          this.DoctorsArray[k].color="green";
          this.DoctorsArray[k].offline=false;
          this.DoctorsArray[k].moreTxt = "متوافر";
          console.log("offline false ",this.DoctorsArray[k]);
          this.helper.getDoctorStatus(data.id);
          console.log("call sort function from get busy changed");
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

    console.log('ionViewDidLoad OrderServicePage');
    this.Loadfunc();
    // this.showLoading = false;
    // // this.storage.get("access_token").then(data=>{
    // //   //this.accessToken = this.helper.accessToken;
    // //   this.accessToken = data;
    // this.accessToken = localStorage.getItem('user_token');


    //   this.srv.nearbyservices(this.type_id,this.center_id,this.lat,this.lng,this.accessToken).subscribe(
    //     resp=>{
    //       this.showLoading=true;
    //       console.log("nearbyservice resp: ",resp);
          
    //       let doctorData =JSON.parse(JSON.stringify(resp));
    //       console.log("service data",doctorData);
    //     console.log("doctors data",doctorData["result"]);
    //     this.DoctorsArray=[];  
    //     for(var i=0;i<doctorData["result"].length;i++){
    //         console.log("doctor: ",doctorData["result"][i]); 
            
    //         // doctorData["result"][i].color="green";
    //         // doctorData["result"][i].offline = false;
            
    //         // doctorData["result"][i].timefordelivery = "2د";
    //         // doctorData["result"][i].distance = "2كم";
            
    //         doctorData["result"][i].type_id = this.type_id;
    //         if(doctorData["result"][i].nickname)
    //         doctorData["result"][i].doctorName = doctorData["result"][i].nickname;
    //         else 
    //         doctorData["result"][i].doctorName = doctorData["result"][i].name;

      

    //       if(doctorData["result"][i].busy == "1")
    //       {
    //         doctorData["result"][i].color="red";
    //         doctorData["result"][i].offline=true;
    //         doctorData["result"][i].moreTxt="غير متوافر";

    //       }else if (doctorData["result"][i].busy == "0")
    //       {
    //         if(doctorData["result"][i].online  == "1")
    //           {
    //             doctorData["result"][i].color="green";
    //             doctorData["result"][i].offline=false;
    //             doctorData["result"][i].moreTxt = "متوافر";
              

    //           }else if (doctorData["result"][i].online  == "0")
    //           {
    //             doctorData["result"][i].color="grey";
    //             doctorData["result"][i].offline=true;
    //             doctorData["result"][i].moreTxt="غير متوافر";
                
    //           }
           
    //       }

          


    //         this.DoctorsArray.push(doctorData["result"][i]);
    //       }
          
    //     if(this.DoctorsArray.length >= 3)
    //     {
    //       this.scrollHeight = "385px";
        
    //     }else{
    //       this.scrollHeight = "260px";
    //     }
    //       for(i=0;i<this.DoctorsArray.length;i++)
    //       {
            
    //         this.helper.getDoctorStatus(this.DoctorsArray[i].id);
    //         this.helper.getBusyDoctor(this.DoctorsArray[i].id);
            
    //       }
          
    //       if(this.DoctorsArray.length == 0)
    //       {
    //         console.log("if = 0");
    //         this.presentToast(this.translate.instant("noSearchResult"));
    //       }
          
    //     },
    //     err=>{
    //       console.log("nearbyservice error: ",err);
    //       this.showLoading = true;
    //       this.presentToast(this.translate.instant("serverError"));
    //     }
    //   );
    // // });



  }
Loadfunc(){
  
  if(this.refresher)
    this.showLoading = true;
  else
    this.showLoading = false;
    
    this.accessToken = localStorage.getItem('user_token');


      this.srv.nearbyservices(this.type_id,this.center_id,this.lat,this.lng,this.accessToken).subscribe(
        resp=>{
          this.showLoading=true;
          
          
          console.log("nearbyservice resp: ",resp);
          
          let doctorData =JSON.parse(JSON.stringify(resp));
          
          console.log("service data",doctorData);
        console.log("doctors data",doctorData["result"]);
        this.DoctorsArray=[];  
        for(var i=0;i<doctorData["result"].length;i++){
            console.log("doctor: ",doctorData["result"][i]); 
            
            // doctorData["result"][i].timefordelivery = "1د";
            // doctorData["result"][i].distance = "1م";

            doctorData["result"][i].type_id = this.type_id;
            if(doctorData["result"][i].nickname)
            doctorData["result"][i].doctorName = doctorData["result"][i].nickname;
            else 
            doctorData["result"][i].doctorName = doctorData["result"][i].name;

            if(! doctorData["result"][i].rate)
              doctorData["result"][i].rate = 5;


          if(doctorData["result"][i].busy == "1")
          {
            doctorData["result"][i].color="red";
            doctorData["result"][i].offline=true;
            doctorData["result"][i].moreTxt="غير متوافر";

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
                doctorData["result"][i].moreTxt="غير متوافر";
                
              }
           
          }

          


            this.DoctorsArray.push(doctorData["result"][i]);
          }
          
        if(this.DoctorsArray.length >= 3)
        {
          this.scrollHeight = "385px";
        
        }else{
          this.scrollHeight = "260px";
        }
          for(i=0;i<this.DoctorsArray.length;i++)
          {
            
            this.helper.getDoctorStatus(this.DoctorsArray[i].id);
            this.helper.getBusyDoctor(this.DoctorsArray[i].id);
            
          }
          
          if(this.DoctorsArray.length == 0)
          {
            console.log("if = 0");
            this.presentToast(this.translate.instant("noSearchResult"));
          }
          if(this.refresher)
            this.refresher.complete();
        },
        err=>{
          console.log("nearbyservice error: ",err);
          this.showLoading = true;
          this.presentToast(this.translate.instant("serverError"));
          if(this.refresher)
            this.refresher.complete();
          
        }
      );



}

  getDistanceAndDuration(i){

    if(this.DoctorsArray[i].offline == false){
      
      console.log("online doctor i",this.DoctorsArray[i]);
      console.log("online doctor index",this.DoctorsArray[this.index]);

      console.log("doctors from array",this.DoctorsArray[i]);
    console.log("lat from helper",this.helper.lat);
    console.log("lon from helper",this.helper.lon);
    var docLat = this.DoctorsArray[i].lat;
    var docLon = this.DoctorsArray[i].lng;
    console.log("doctor lat :",docLat);
    console.log("doctor lng: ",docLon);
    console.log("doctor before duration",this.DoctorsArray[i]);
    this.index = i;

    
    this.service.getDurationAndDistance(this.helper.lat,this.helper.lon,docLat,docLon).subscribe(
      resp=>{
        
        console.log("doctors",this.DoctorsArray);
        console.log("doctor ",this.DoctorsArray[i]);
        console.log("get data from google api",resp);
        var respObj = JSON.parse(JSON.stringify(resp));
        
        if(respObj.routes[0])
        {
        console.log("duration : ",respObj.routes[0].legs[0].duration.text);
        console.log("distance : ",respObj.routes[0].legs[0].distance.text);
        console.log("doctor from array in get duration ",this.DoctorsArray[i]);
        
        var dis = respObj.routes[0].legs[0].distance.text;
        var disarr = dis.split(" ");
        if(disarr[1] == "km")
        {
          disarr[1]="كم";
          dis = disarr.join(" ");
        }else if(disarr[1] == "m"){
          disarr[1]="م";
          dis = disarr.join(" ");
        }
        console.log("dis from get distance",dis);

        var dur = respObj.routes[0].legs[0].duration.text;
        var durarr = dur.split(" ");
        if(durarr[1] == "mins")
        {
          durarr[1]="د";
          dur = durarr.join(" ");
        }else if(durarr[1] == "h"){
          durarr[1]="س";
          dur = durarr.join(" ");
        }

        
        this.DoctorsArray[i].distance = dis;
        this.DoctorsArray[i].distanceVal = respObj.routes[0].legs[0].distance.value;
        this.DoctorsArray[i].timefordelivery = dur;
        console.log("distance from array ",this.DoctorsArray[i].distance);


      }

        if(i == (this.DoctorsArray.length -1))
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
    console.log("doc before sort ",this.DoctorsArray);
  
    this.DoctorsArray.sort((a,b)=>{
      if(a.offline == false || b.offline == false)
        return a.distanceVal-b.distanceVal;
  
    }); 

    console.log("doc after sort ",this.DoctorsArray);
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
  sendOrder(){
    console.log("first: ",this.first);
    console.log("second: ",this.second);
    console.log("doctors: ",this.choosenDoctors);
    console.log("cost: ",this.cost);
    
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
    //  this.showLoading=false;   \n doctorsId
    console.log("choosenDoctors ,, ",doctorsId.join(','));
      this.srv.saveOrder(doctorsId.join(','),this.photosForApi,this.imageExt.join(','),this.accessToken,this.choosenDoctors.length,this.center_id).subscribe(
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
          //this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,this.choosenDoctors.length);
          // this.helper.orderStatusChanged(newOrder.order.id);
          
            // this.helper.createOrderForPLC(this.type_id,newOrder.order.id,newOrder.order.service_profile_id,this.choosenDoctors.length);
            // this.helper.orderStatusChangedForPLC(newOrder.order.id);
            this.helper.orderIdForUpdate = newOrder.order.id;
            
          this.presentToast(this.translate.instant("ordersent"));
          // this.navCtrl.pop();
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
          // this.showLoading=true;
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
    this.service.validateDiscountCode(code ,this.accessToken).subscribe(
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
//  this.photos = [];
    this.camera.getPicture(options).then((imageData) => {
   
      this.image = 'data:image/jpeg;base64,' + imageData;

      this.photos.push(this.image);
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

  doRefresh(ev){
    console.log("refresh",ev);
    // this.photos =[];
    // this.photosForApi = [];
    this.choosenDoctors = [];
    this.refresher = ev;
    this.Loadfunc();
    
    
  }
  
  fullScreen(index){
    console.log("image clicked",index)
    this.navCtrl.push('full-screen',{data:this.photos[index]});
  }

}
