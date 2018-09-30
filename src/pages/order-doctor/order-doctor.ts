import { Component , ViewChild} from '@angular/core';
import {ToastController, IonicPage, NavController, NavParams,LoadingController ,App} from 'ionic-angular';
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

  loading;
  showLoading=true;

  orderBTn = false;
  

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
    public navParams: NavParams,  public translate: TranslateService,
    public loadingCtrl: LoadingController, public app:App) {

     console.log("ordre btn",this.orderBTn);

     this.accessToken = localStorage.getItem('user_token');
     this.helper.view = "pop";

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
                this.DoctorsArray[k].moreTxt = "غير متوافر";
                console.log("call sort function from status changed");
                this.sortDoctors();
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
              if(data.status == "1")
              {
                this.DoctorsArray[k].color="green";
                this.DoctorsArray[k].offline=false;
                this.DoctorsArray[k].moreTxt="متوافر";
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

        this.events.subscribe('locationChanged', (data) => {
          console.log("location changed event",data);

          if(data.location){
            for(var k=0;k<this.DoctorsArray.length;k++)
            {   
              if(this.DoctorsArray[k].id == data.id)
              {
                this.DoctorsArray[k].lat = data.location.split(',')[0];
                this.DoctorsArray[k].lng = data.location.split(',')[1];
                if(this.DoctorsArray[k].offline == false)
                {
                  this.getDistanceAndDuration(k);
                  this.sortDoctors();
                }
                  // if(k == (this.DoctorsArray.length -1))
                // {
                //   console.log("call sort function");
                //   this.sortDoctors();
                // }
                
              }
                    
            }
            }

        });
  this.events.subscribe('location', (data) => {
    console.log(" event location ",data);
    //
    // for(var k=0;k<this.DoctorsArray.length;k++)
    // {
    //    if(this.DoctorsArray[k].id == data.id)
    //   {
    //     this.DoctorsArray[k].distanceVal =10000;
    //   }
    // }
    //

    if(data.location){
    for(var k=0;k<this.DoctorsArray.length;k++)
    {   
      if(this.DoctorsArray[k].id == data.id)
      {
        this.DoctorsArray[k].lat = data.location.split(',')[0];
        this.DoctorsArray[k].lng = data.location.split(',')[1];
        if(this.DoctorsArray[k].offline == false)
        {  
          this.getDistanceAndDuration(k);
        }
        // if(k == (this.DoctorsArray.length -1))
        // {
        //   console.log("call sort function");
        //   this.sortDoctors();
        // }
        
      }
            
    }
    }

    


    });

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
            this.DoctorsArray[k].moreTxt = "غير متوافر";
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
          // else if(data.status == "0")
          // {
          //   this.helper.getDoctorStatus(data.id);
          // }
        } 
      }
    });

    this.events.subscribe('busyDoctorChanged', (data) => {
      console.log(" event busyDoctorChanged ",data);
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
            this.DoctorsArray[k].moreTxt = "غير متوافر";

            
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

          // else if(data.status == "0")
          // {
          //   this.helper.getDoctorStatus(data.id);
          // }
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
   
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;

    this.accessToken = localStorage.getItem('user_token');
    
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
    // });

   
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
    // this.presentLoadingCustom();
    this.showLoading = false;

    this.service.getDoctorInSpecificSpecialization(id,this.accessToken).subscribe(
      resp =>{
        console.log("getDoctorInSpecificSpecialization resp: ",resp);
        // this.loading.dismiss();
        this.showLoading=true;
        console.log("this.showLoading: ",this.showLoading);
        let doctorData =JSON.parse(JSON.stringify(resp));
        console.log("doctors data",doctorData["results"]);
        this.DoctorsArray=[];  
        for(var i=0;i<doctorData["results"].length;i++){
            console.log("doctor: ",doctorData["results"][i]);  
            if(doctorData["results"][i].nickname)
            doctorData["results"][i].doctorName = doctorData["results"][i].nickname;
            else 
            doctorData["results"][i].doctorName = doctorData["results"][i].name;

/**/            

          if(doctorData["results"][i].busy == "1")
          {
            doctorData["results"][i].color="red";
            doctorData["results"][i].offline=true;
            doctorData["results"][i].moreTxt = "غير متوافر";
          }else if (doctorData["results"][i].busy == "0")
          {
            if(doctorData["results"][i].online  == "1")
              {
                doctorData["results"][i].color="green";
                doctorData["results"][i].offline=false;
                doctorData["results"][i].moreTxt = "متوافر";

              }else if (doctorData["results"][i].online  == "0")
              {
                doctorData["results"][i].color="grey";
                doctorData["results"][i].offline=true;
                doctorData["results"][i].moreTxt = "غير متوافر";
                
              }
           
          }

          /* */


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
            // this.helper.intializeFirebase(this.DoctorsArray[i].id);
            
            /* 
            this.DoctorsArray[i].distanceVal = 10000;
            this.DoctorsArray[i].offline = true;
            this.helper.getDoctorStatus(this.DoctorsArray[i].id);
            this.helper.statusChanged(this.DoctorsArray[i].id);
            this.helper.getDoctorlocation(this.DoctorsArray[i].id);
            this.helper.trackDoctor(this.DoctorsArray[i].id);
            this.helper.getBusyDoctor(this.DoctorsArray[i].id);
            this.helper.busyDoctorChanged(this.DoctorsArray[i].id);
             */
            
            /* */
            //this.DoctorsArray[i].distanceVal = 10000;
            //this.DoctorsArray[i].offline = true;
            this.helper.getDoctorStatus(this.DoctorsArray[i].id);
            //this.helper.statusChanged(this.DoctorsArray[i].id);
            //this.helper.getDoctorlocation(this.DoctorsArray[i].id);

            //this.helper.trackDoctor(this.DoctorsArray[i].id);
            
            this.helper.getBusyDoctor(this.DoctorsArray[i].id);
            //this.helper.busyDoctorChanged(this.DoctorsArray[i].id);
            /* */
            
           
            // if(this.DoctorsArray[i].availability == "1")
            // {
            //   this.DoctorsArray[i].color="green";
            //   this.DoctorsArray[i].offline=false;
            // }else{
            //   this.DoctorsArray[i].color="grey";
            //   this.DoctorsArray[i].offline=true;
            // }
          }
          


           //this.getDistanceAndDuration(0);
          
          if(this.DoctorsArray.length == 0)
          {
            console.log("if = 0");
            this.presentToast(this.translate.instant("noSearchResult"));
          }
      },
      err=>{
        this.showLoading = true;
        this.presentToast(this.translate.instant("serverError"));
        console.log("getDoctorInSpecificSpecialization error: ",err);
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
        // this.index => i
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
        //this.sortDoctors();

      }

        if(i == (this.DoctorsArray.length -1))
        {
          console.log("call sort function");
          this.sortDoctors();
        }

        // if( this.index < this.DoctorsArray.length)
        // {
        //   this.index++;
        //   this.getDistanceAndDuration(this.index);
        //   console.log("if index")
        // }else{
        //   console.log("else index")
        //   //this.sortDoctors(); 
        // }
      },
      err=>{
        console.log("get err from google api",err);
      }
    );
  }
  }
  sortDoctors(){
    console.log("doc before sort ",this.DoctorsArray);
    // this.DoctorsArray.sort(function(a,b){
    //   console.log("a.distanceVal: ",a.distanceVal,"b.distanceVal: ",b.distanceVal);
    //   return a.distanceVal - b.distanceVal;
    // });

    //sort by nearest
    // this.DoctorsArray.sort((a,b)=>a.distanceVal-b.distanceVal); 

    //sort by nearest & online
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

   this.orderBTn = true;

      this.service.saveOrder(doctorsId,this.accessToken,this.choosenDoctors.length).subscribe(
        resp => {
          if(JSON.parse(JSON.stringify(resp)).success ){
          console.log("saveOrder resp: ",resp);
          var newOrder = JSON.parse(JSON.stringify(resp));
          
console.log("from order doctor",newOrder.order.id,"service id",newOrder.order.service_profile_id)
         
          this.helper.orderIdForUpdate = newOrder.order.id;
          this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,this.choosenDoctors.length);
          this.helper.orderStatusChanged(newOrder.order.id);

          
          this.presentToast(this.translate.instant("ordersent"));
          this.helper.dontSendNotification = false;
          
          // this.navCtrl.pop();
          this.navCtrl.setRoot('remaining-time-to-accept',{orderId:newOrder.order.id});
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

  presentLoadingCustom() {
     this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      duration: 5000
    });
  
    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  
    this.loading.present();
  }

}
