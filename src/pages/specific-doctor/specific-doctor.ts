import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';


@IonicPage(
  {
    name:"specific-doctor"
  }
)
@Component({
  selector: 'page-specific-doctor',
  templateUrl: 'specific-doctor.html',
})
export class SpecificDoctorPage {
  
  // disableButton=true;
  Specialization="";
  spText;
  SpecializationArray=[];
  accessToken;
  doctors=[];
  langDirection;

  first;
  second;
  third;
  fourth
  last;
  
  cost:number=0;
  choosenDoctors=[];
  rate;

  tostClass ;
  scrollHeight="0px";
  index;
  offline=false;
  searchValue;
  showLoading=true;

  orderBTn = false;

  constructor(public helper:HelperProvider, public toastCtrl: ToastController,
    public storage: Storage,  public events: Events,
    public service:LoginserviceProvider, public navCtrl: NavController,
     public navParams: NavParams, public translate: TranslateService) {

      this.langDirection = this.helper.lang_direction;
      
      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.spText=this.translate.instant("chooseSpecialization");

      this.events.subscribe('statusChanged', (data) => {
        console.log(" event status changed ",data);
        // data.status;
        // data.id;

        for(var k=0;k<this.doctors.length;k++)
        {
          
          if(this.doctors[k].id == data.id)
          {
            if(data.status == "1")
            {
              this.doctors[k].color="green";
              this.doctors[k].offline=false;
              console.log("call sort function from status changed");
              this.sortDoctors();

            }else if (data.status == "0")
            {
              this.doctors[k].color="grey";
              this.doctors[k].offline=true;
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

        for(var k=0;k<this.doctors.length;k++)
        {
          
          if(this.doctors[k].id == data.id)
          {
            if(data.status == "1")
            {
              this.doctors[k].color="green";
              this.doctors[k].offline=false;
              console.log("call sort function from status");
                this.sortDoctors();

            }else if (data.status == "0")
            {
              this.doctors[k].color="grey";
              this.doctors[k].offline=true;
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
      
      
      // if(k == (this.doctors.length -1))
      //   {
      //     console.log("call sort function");
      //     this.sortDoctors();
      //   }

    }
          
  }
  }



  });

  this.events.subscribe('getBusyDoctor', (data) => {
    console.log(" event getBusyDoctor ",data);
    // data.status;
    // data.id;

    for(var k=0;k<this.doctors.length;k++)
    {
      
      if(this.doctors[k].id == data.id)
      {
        if(data.status == "1")
        {
          this.doctors[k].color="red";
          this.doctors[k].offline=true;
          console.log("call sort function from get busy");
                this.sortDoctors();

        }else if (data.status == "0")
        {
          this.doctors[k].color="green";
          this.doctors[k].offline=false;
          this.helper.getDoctorStatus(data.id);
          console.log("call sort function from get busy");
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

    for(var k=0;k<this.doctors.length;k++)
    {
      
      if(this.doctors[k].id == data.id)
      {
        if(data.status == "1")
        {
          this.doctors[k].color="red";
          this.doctors[k].offline=true;
          console.log("call sort function from busy changed");
                this.sortDoctors();

        }else if (data.status == "0")
        {
          this.doctors[k].color="green";
          this.doctors[k].offline=false;
          this.helper.getDoctorStatus(data.id);
          console.log("call sort function from busy changed");
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

  ionViewDidLoad() {
    

    
    console.log('ionViewDidLoad SpecificDoctorPage');
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.showLoading=false;
      this.service.getSpecializations(this.accessToken).subscribe(
        resp=>{
          this.showLoading=true;
          console.log("getSpecializations resp: ",resp);
          for(var i=0;i<JSON.parse(JSON.stringify(resp)).length;i++){
            console.log("sp: ",resp[i].value);
            //this.Specialization=resp[0].value;
            //this.Specialization=this.translate.instant("chooseSpecialization");
           // this.SpecializationArray.push(resp[i].value);
            this.SpecializationArray.push(resp[i]);
            // this.SpecializationChecked();
            

          }
         

        },
        err=>{
          this.showLoading=true;
          console.log("getSpecializations error: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
    });

    //this.initializeDoctors();
  }

  SpecializationChecked(){
    var id;
    console.log("all Specialization: ",this.SpecializationArray);
    console.log(this.Specialization);
    if(this.searchValue){
    for(var i=0;i<this.SpecializationArray.length;i++){
      if(this.Specialization == this.SpecializationArray[i].value)
      {
        id = this.SpecializationArray[i].id;
        break;
      }
    }
    console.log("id: ",id);
    this.showLoading = false;
    // this.service.getDoctorInSpecificSpecialization(id,this.accessToken)
    this.service.getDoctorsByName(this.searchValue,id,this.accessToken)
    .subscribe(
    
      resp =>{
        this.showLoading = true;
        console.log("getDoctorInSpecificSpecialization resp: ",resp);
        let doctorData =JSON.parse(JSON.stringify(resp));
        console.log(doctorData["results"].length);
        this.doctors=[];  
        for(var i=0;i<doctorData["results"].length;i++){
            console.log("doctor: ",doctorData["results"][i]);  
            if(doctorData["results"][i].nickname)
            doctorData["results"][i].doctorName = doctorData["results"][i].nickname;
            else 
            doctorData["results"][i].doctorName = doctorData["results"][i].name;

            if(doctorData["results"][i].busy == "1")
            {
              doctorData["results"][i].color="red";
              doctorData["results"][i].offline=true;
            }else if (doctorData["results"][i].busy == "0")
            {
              if(doctorData["results"][i].online  == "1")
                {
                  doctorData["results"][i].color="green";
                  doctorData["results"][i].offline=false;
                
  
                }else if (doctorData["results"][i].online  == "0")
                {
                  doctorData["results"][i].color="grey";
                  doctorData["results"][i].offline=true;
                  
                }
             
            }


            this.doctors.push(doctorData["results"][i]);
          }
          if(this.doctors.length >= 3)
          {
            this.scrollHeight = "385px";
          
          }else{
            this.scrollHeight = "260px";
          }
          for(i=0;i<this.doctors.length;i++)
          {
  /*
            this.doctors[i].distanceVal =10000;
            this.doctors[i].offline=true;
            this.helper.getDoctorStatus(this.doctors[i].id);
            this.helper.statusChanged(this.doctors[i].id);
            this.helper.getDoctorlocation(this.doctors[i].id);
            this.helper.trackDoctor(this.doctors[i].id);
            this.helper.getBusyDoctor(this.doctors[i].id);
            this.helper.busyDoctorChanged(this.doctors[i].id);
            
*/
 
            /* */
            //this.DoctorsArray[i].distanceVal = 10000;
            //this.DoctorsArray[i].offline = true;
            this.helper.getDoctorStatus(this.doctors[i].id);
            //this.helper.statusChanged(this.DoctorsArray[i].id);
            //this.helper.getDoctorlocation(this.DoctorsArray[i].id);

            //this.helper.trackDoctor(this.DoctorsArray[i].id);
            
            this.helper.getBusyDoctor(this.doctors[i].id);
            //this.helper.busyDoctorChanged(this.DoctorsArray[i].id);
            /* */

            // this.doctors[i].availability="0";

            // if(this.doctors[i].availability == "1")
            // {
            //   this.doctors[i].color="green";
            //   this.doctors[i].offline=false;
            // }else{
            //   this.doctors[i].color="grey";
            //   this.doctors[i].offline=true;
            // }

          }
          //this.getDistanceAndDuration(0);

          if(this.doctors.length == 0)
          {
            this.presentToast(this.translate.instant("noSearchResult"));
          }
      },
      err=>{
        this.showLoading=true;
        console.log("getDoctorInSpecificSpecialization error: ",err);
        this.presentToast(this.translate.instant("serverError"));
        
      }
    );
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
        this.doctors[i].duration = respObj.routes[0].legs[0].duration.text;
        console.log("distance from array ",this.doctors[i].distance);
        }

        if(i == (this.doctors.length -1))
        {
          console.log("call sort function");
          this.sortDoctors();
        }

        // if( this.index < this.doctors.length)
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
    console.log("doc before sort ",this.doctors);
    // this.doctors.sort(function(a,b){
    //   return a.distanceVal - b.distanceVal;
    // });

    //sort by nearest
    // this.doctors.sort((a,b)=>a.distanceVal-b.distanceVal); 

    //sort by nearest & online
    this.doctors.sort((a,b)=>{
      if(a.offline == false || b.offline == false)
        return a.distanceVal-b.distanceVal;
  
    });
    
    console.log("doc after sort ",this.doctors);
  }

  initializeDoctors() {
    // this.doctors = [{"name":"ali","cost":"200","rate":"4","specialization":"specialization1","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
    // {"name":"mohamed","cost":"300","rate":"2.5","specialization":"specialization2","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
    // {"name":"ahmed","cost":"400","rate":"2","specialization":"specialization3","profile_pic":"assets/imgs/avatar-ts-jessie.png"}];

  }

  getItems(ev) {
    var searchVal = ev.target.value;
    var id ;
    this.searchValue = searchVal;

    if(this.searchValue)
    {
    console.log("search value: ",searchVal);
    for(var i=0;i<this.SpecializationArray.length;i++){
      if(this.Specialization == this.SpecializationArray[i].value)
      {
        id = this.SpecializationArray[i].id;
        break;
      }else{
        id="";
        
      }
    }
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.showLoading = false;
      this.service.getDoctorsByName(searchVal,id,this.accessToken).subscribe(
        resp=>{
          this.showLoading = true;
          this.choosenDoctors=[];
          console.log("getDoctorsByName resp: ",resp);
          let doctorData =JSON.parse(JSON.stringify(resp));
          console.log(doctorData["results"].length);
          this.doctors=[];  
          for(var i=0;i<doctorData["results"].length;i++){
            console.log("doctor: ",doctorData["results"][i]);  
            if(doctorData["results"][i].nickname)
            doctorData["results"][i].doctorName = doctorData["results"][i].nickname;
            else 
            doctorData["results"][i].doctorName = doctorData["results"][i].name;

            if(doctorData["results"][i].busy == "1")
            {
              doctorData["results"][i].color="red";
              doctorData["results"][i].offline=true;
            }else if (doctorData["results"][i].busy == "0")
            {
              if(doctorData["results"][i].online  == "1")
                {
                  doctorData["results"][i].color="green";
                  doctorData["results"][i].offline=false;
                
  
                }else if (doctorData["results"][i].online  == "0")
                {
                  doctorData["results"][i].color="grey";
                  doctorData["results"][i].offline=true;
                  
                }
             
            }

            this.doctors.push(doctorData["results"][i]);
          }
          if(this.doctors.length >= 3)
          {
            this.scrollHeight = "385px";
          
          }else{
            this.scrollHeight = "260px";
          }
          for(i=0;i<this.doctors.length;i++)
          {
            /*
            this.doctors[i].distanceVal =10000;
            this.doctors[i].offline=true;
            this.helper.getDoctorStatus(this.doctors[i].id);
            this.helper.statusChanged(this.doctors[i].id);
            this.helper.getDoctorlocation(this.doctors[i].id);
            this.helper.trackDoctor(this.doctors[i].id);
            this.helper.getBusyDoctor(this.doctors[i].id);
            this.helper.busyDoctorChanged(this.doctors[i].id);
            */
             
            /* */
            //this.DoctorsArray[i].distanceVal = 10000;
            //this.DoctorsArray[i].offline = true;
            this.helper.getDoctorStatus(this.doctors[i].id);
            //this.helper.statusChanged(this.DoctorsArray[i].id);
            //this.helper.getDoctorlocation(this.DoctorsArray[i].id);

            //this.helper.trackDoctor(this.DoctorsArray[i].id);
            
            this.helper.getBusyDoctor(this.doctors[i].id);
            //this.helper.busyDoctorChanged(this.DoctorsArray[i].id);
            /* */

            
            // this.doctors[i].availability="0";

            // if(this.doctors[i].availability == "1")
            // {
            //   this.doctors[i].color="green";
            //   this.doctors[i].offline=false;
            // }else{
            //   this.doctors[i].color="grey";
            //   this.doctors[i].offline=true;
            // }

          }
          //this.getDistanceAndDuration(0);

          if(this.doctors.length == 0)
          {
            this.presentToast(this.translate.instant("noSearchResult"));
          }
          // if(this.doctors.length == 0)
          // {
          //   this.presentToast(this.translate.instant("noSearchResult"));
          // }

        },
        err=>{
          this.showLoading = true;
          console.log("getDoctorsByName error: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
    });
  }else{
    this.doctors = [];
    if(this.doctors.length >= 3)
          {
            this.scrollHeight = "385px";
          
          }else{
            this.scrollHeight = "260px";
          }
  }
  }

  doctorChecked(item , event){
    if(item.checked == true)
    {
      //this.cost += parseInt(item.cost);
      this.choosenDoctors.push(item);
    }
    else
    {
      //this.cost -= parseInt(item.cost);
      for(var i=0;i<this.choosenDoctors.length;i++){
        if(item.name == this.choosenDoctors[i].name )
          this.choosenDoctors.splice(i,1);
      }
    } 

      
  }
  sendOrder(){
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
      this.service.saveOrder(doctorsId,this.accessToken).subscribe(
        resp => {
          if(JSON.parse(JSON.stringify(resp)).success ){
          console.log("saveOrder resp: ",resp);
          var newOrder = JSON.parse(JSON.stringify(resp));
          

          this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id);
          this.helper.orderStatusChanged(newOrder.order.id);

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
  validateDiscountCode(){
    

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

  dismiss(){
    this.navCtrl.pop();
  }
  searchIcon(){
    if( !this.searchValue  && this.Specialization)
      this.presentToast(this.translate.instant('enterdoctor'));
    else if (this.searchValue && ! this.Specialization)
      this.presentToast(this.translate.instant('chooseSpecialization'));
    else if (!this.searchValue && !this.Specialization)
      this.presentToast(this.translate.instant('enterDoctorAndSpecilaization'));
  }
}
