import { Component , ViewChild} from '@angular/core';
import {ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Events } from 'ionic-angular';


@IonicPage(
  {
    name : 'order-doctor'
  }
)
@Component({
  selector: 'page-order-doctor',
  templateUrl: 'order-doctor.html',
})
export class OrderDoctorPage {
  accessToken;
  Specialization="";
  SpecializationArray=[];
  DoctorsArray = [];
  langDirection;
  spId;
  spValue;

  
  first;
  second;
  third;
  fourth
  last;
  tostClass ;
  index;

  scrollHeight="0px";
  offline=false;

  @ViewChild('fireSElect') sElement;

  //color;
 
  // DoctorsArray=[{"name":"ali","cost":"200","rate":"4","specialization":"specialization1","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
  // {"name":"mohamed","cost":"300","rate":"2.5","specialization":"specialization2","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
  // {"name":"ahmed","cost":"400","rate":"2","specialization":"specialization3","profile_pic":"assets/imgs/avatar-ts-jessie.png"}];



  cost:number=0;
  choosenDoctors=[];

  constructor(public helper:HelperProvider, public toastCtrl: ToastController, 
    public storage: Storage, public events: Events,
    public service:LoginserviceProvider,public navCtrl: NavController, 
    public navParams: NavParams,  public translate: TranslateService) {

     
        this.langDirection = this.helper.lang_direction;
        if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
        else
        this.tostClass="toastLeft"; 

        this.translate.use(this.helper.currentLang);
        var datafromsp =  this.navParams.get('data');
        this.spId = datafromsp.id;
        this.spValue = datafromsp.sp;
        this.Specialization = this.spValue;
        console.log("construct id ",this.spId," value ",this.spValue);
    

        this.events.subscribe('statusChanged', (data) => {
          console.log(" event status changed ",data);
          // data.status;
          // data.id;

          for(var k=0;k<this.DoctorsArray.length;k++)
          {
            
            if(this.DoctorsArray[k].id == data.id)
            {
              if(data.status == "online")
              {
                this.DoctorsArray[k].color="green";
                this.DoctorsArray[k].offline=false;

              }else if (data.status == "offline")
              {
                this.DoctorsArray[k].color="grey";
                this.DoctorsArray[k].offline=true;
              }
            }
            
          }


        });
        this.events.subscribe('status', (data) => {
          console.log(" event status ",data);
          // data.status;
          // data.id;

          for(var k=0;k<this.DoctorsArray.length;k++)
          {
            
            if(this.DoctorsArray[k].id == data.id)
            {
              if(data.status == "online")
              {
                this.DoctorsArray[k].color="green";
                this.DoctorsArray[k].offline=false;

              }else if (data.status == "offline")
              {
                this.DoctorsArray[k].color="grey";
                this.DoctorsArray[k].offline=true;
              }
            } 
          }
        });

        this.events.subscribe('locationChanged', (data) => {
          console.log(" event location changed ",data);

        });
  this.events.subscribe('location', (data) => {
    console.log(" event location ",data);
    if(data.location){
    for(var k=0;k<this.DoctorsArray.length;k++)
    {   
      if(this.DoctorsArray[k].id == data.id)
      {
        this.DoctorsArray[k].lat = data.location.split(',')[0];
        this.DoctorsArray[k].lng = data.location.split(',')[1];
      }
            
    }
    }



    });

  }
  colclicked(){
    console.log("s element: ",this.sElement);
  //this.sElement.ionChange();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDoctorPage');
   
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.service.getSpecializations(this.accessToken).subscribe(
        resp=>{
          
          console.log("getSpecializations resp: ",resp);
          for(var i=0;i<JSON.parse(JSON.stringify(resp)).length;i++){
            console.log("sp: ",resp[i].value);
            //this.Specialization=resp[0].value;
            // this.SpecializationArray.push(resp[i].value);
            this.SpecializationArray.push(resp[i]);
            // this.SpecializationChecked();

          }
          this.SpecializationChecked();
         

        },
        err=>{
          console.log("getSpecializations error: ",err);
        }
      );
    });

   
    // this.events.subscribe('statusChanged', (data) => {
    //   console.log(" event status changed ",data);
    //   // data.status;
    //   // data.id;

    //   for(var k=0;k<this.DoctorsArray.length;k++)
    //   {
        
    //     if(this.DoctorsArray[k].id == data.id)
    //     {
    //       if(data.status == "online")
    //       {
    //         this.DoctorsArray[k].color="green";
    //         this.DoctorsArray[k].offline=false;

    //       }else if (data.status == "offline")
    //       {
    //         this.DoctorsArray[k].color="grey";
    //         this.DoctorsArray[k].offline=true;
    //       }
    //     }
        
    //   }


    // });
  
  }

  SpecializationChecked(){
    var id;
    console.log("all Specialization: ",this.SpecializationArray);
    console.log(this.Specialization);
    for(var i=0;i<this.SpecializationArray.length;i++){
      if(this.Specialization == this.SpecializationArray[i].value)
      {
        id = this.SpecializationArray[i].id;
        break;
      }
    }
    console.log("get doctor sp id: ",id);
    this.service.getDoctorInSpecificSpecialization(id,this.accessToken).subscribe(
      resp =>{
        console.log("getDoctorInSpecificSpecialization resp: ",resp);
        let doctorData =JSON.parse(JSON.stringify(resp));
        console.log("doctors data",doctorData["results"]);
        this.DoctorsArray=[];  
        for(var i=0;i<doctorData["results"].length;i++){
            console.log("doctor: ",doctorData["results"][i]);  
            this.DoctorsArray.push(doctorData["results"][i]);
          }
          
        if(this.DoctorsArray.length >= 3)
        {
          this.scrollHeight = "385px";
        
        }else{
          this.scrollHeight = "260px";
        }
          for(i=0;i<this.DoctorsArray.length;i++)
          {
            
            //this.helper.userId=this.DoctorsArray[i].id;
            this.helper.intializeFirebase(this.DoctorsArray[i].id);
            this.helper.getDoctorStatus(this.DoctorsArray[i].id);
            this.helper.trackDoctor(this.DoctorsArray[i].id);
            this.helper.getDoctorlocation(this.DoctorsArray[i].id);
            
            // if(this.DoctorsArray[i].availability == "1")
            // {
            //   this.DoctorsArray[i].color="green";
            //   this.DoctorsArray[i].offline=false;
            // }else{
            //   this.DoctorsArray[i].color="grey";
            //   this.DoctorsArray[i].offline=true;
            // }
          }


           this.getDistanceAndDuration(0);
          
          if(this.DoctorsArray.length == 0)
          {
            console.log("if = 0");
            this.presentToast(this.translate.instant("noSearchResult"));
          }
      },
      err=>{
        console.log("getDoctorInSpecificSpecialization error: ",err);
      }
    );
    
  }

  getDistanceAndDuration(i){
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
        console.log("doctor ",this.DoctorsArray[this.index]);
        console.log("get data from google api",resp);
        var respObj = JSON.parse(JSON.stringify(resp));
        console.log("duration : ",respObj.routes[0].legs[0].duration.text);
        console.log("distance : ",respObj.routes[0].legs[0].distance.text);
       console.log("doctor from array in get duration ",this.DoctorsArray[this.index]);
        this.DoctorsArray[this.index].distance = respObj.routes[0].legs[0].distance.text;
        this.DoctorsArray[this.index].distanceVal = respObj.routes[0].legs[0].distance.value;
        this.DoctorsArray[this.index].duration = respObj.routes[0].legs[0].duration.text;
        console.log("distance from array ",this.DoctorsArray[this.index].distance);
  
        if( this.index < this.DoctorsArray.length)
        {
          this.index++;
          this.getDistanceAndDuration(this.index);
          console.log("if index")
        }else{
          console.log("else index")
          //this.sortDoctors(); 
        }
      },
      err=>{
        console.log("get err from google api",err);
      }
    );
  }
  sortDoctors(){
    console.log("doc before sort ",this.DoctorsArray);
    this.DoctorsArray.sort(function(a,b){

      return a.distanceVal - b.distanceVal;
    });
    console.log("doc after sort ",this.DoctorsArray);
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
          if(JSON.parse(JSON.stringify(resp)).success ){
          console.log("saveOrder resp: ",resp);
          this.presentToast(this.translate.instant("ordersent"));
          // this.navCtrl.pop();
          this.navCtrl.push('remaining-time-to-accept');
          }else{
            this.presentToast(this.translate.instant("serverError"));
          }
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

}
