import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';
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
  image="assets/imgs/avatar-ts-jessie.png";
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
  // @ViewChild('fireSElect') sElement;
 
  //DoctorsArray = [];

  DoctorsArray=[{"name":"pharmacy 1","cost":"200","rate":"4","specialization":"specialization1","profile_pic":"assets/imgs/default-avatar.png"},
  {"name":"pharmacy 1","cost":"300","rate":"3","specialization":"specialization2","profile_pic":"assets/imgs/default-avatar.png"},
  {"name":"pharmacy 1","cost":"400","rate":"2","specialization":"specialization3","profile_pic":"assets/imgs/default-avatar.png"}];



  cost:number=0;
  choosenDoctors=[];

  constructor(public translate: TranslateService, 
    public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider, public toastCtrl: ToastController, 
    public storage: Storage, 
    public srv:ProvidedServicesProvider,
  public service:LoginserviceProvider,
  public camera: Camera,
  public actionSheetCtrl: ActionSheetController) {

      this.langDirection = this.helper.lang_direction;
      this.translate.use(this.helper.currentLang);
      this.accessToken = this.helper.accessToken;

      var recievedData = this.navParams.get('data');
      this.type_id = recievedData.type_id;
      this.lat = recievedData.lat;
      this.lng = recievedData.lng;
      console.log("order service recievedData: ",recievedData);
      console.log("type id: ",this.type_id);

      if(this.type_id == "1")
      {
        this.title = this.translate.instant("pharmacy");
        this.serviceTitle = this.translate.instant("nearbyPharmacy");
        this.medicalprescriptionImage = this.translate.instant("medicalprescription");
      }

  }

  colclicked(){
    // console.log("s element: ",this.sElement);
  //this.sElement.ionChange();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderServicePage');

    
      this.srv.nearbyservices(this.type_id,this.lat,this.lng,this.accessToken).subscribe(
        resp=>{
          
          console.log("nearbyservice resp: ",resp);
          
         

        },
        err=>{
          console.log("nearbyservice error: ",err);
        }
      );
  



  }

  
  doctorChecked(item , event){
    console.log("doctor checked",item);
    if(item.checked == true)
      {
  //      this.cost += parseInt(item.cost);
        this.choosenDoctors.push(item);
      }
    else
      {
    //    this.cost -= parseInt(item.cost);
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
    if(this.choosenDoctors.length > 3 )
    {
      this.presentToast(this.translate.instant("check3doctors"));
    }else if (this.choosenDoctors.length<1){
      this.presentToast(this.translate.instant("checkAtleastone"));
    }else{
      var doctorsId="";
      for(var j=0;j<this.choosenDoctors.length;j++)
      {
        doctorsId += this.choosenDoctors[j].id+",";
      }
      console.log("doctors id: ",doctorsId);
      this.service.saveOrder(doctorsId,this.accessToken).subscribe(
        resp => {
          console.log("saveOrder resp: ",resp);
          this.presentToast(this.translate.instant("ordersent"));
          // this.navCtrl.pop();
          this.navCtrl.push('remaining-time-to-accept');
        },
        err=>{
          console.log("saveOrder error: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );    
    }
    
  }

  showDoctorProfile(item){
    console.log("card item ",item);
    item.specialization = this.Specialization;
    console.log("item after add specialization: ",item);
    this.navCtrl.push('doctor-profile',{
      data:item
    });
  }

  validate(){
    console.log("validation") ;
    var code = this.first+this.second+this.third+this.fourth+this.last;
    this.service.validateDiscountCode(this.accessToken,code).subscribe(
      resp =>{
        console.log("resp from validateDiscountCode: ",resp);
      },
      err=>{
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
      position: 'bottom'
    });
    toast.present();
  }

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
    
    }, (err) => {
     
     });
  }

}
