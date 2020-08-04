import { Component, ViewChild } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Events } from 'ionic-angular';


@IonicPage(
  {
    name: 'order-doctor'
  }
)
@Component({
  selector: 'page-order-doctor',
  templateUrl: 'order-doctor.html',
})
export class OrderDoctorPage {
  accessToken;
  Specialization = "";
  SpecializationArray = [];
  DoctorsArray = [];
  langDirection;
  spId;
  spValue;


  first;
  second;
  third;
  fourth
  last;
  tostClass;
  index;

  scrollHeight = "0px";
  offline = false;

  loading;
  showLoading = true;

  orderBTn = true; //fasle
  myxid;

  disableDropDown = false;

  @ViewChild('fireSElect') sElement;

  //color;

  // DoctorsArray=[{"name":"ali","cost":"200","rate":"4","specialization":"specialization1","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
  // {"name":"mohamed","cost":"300","rate":"2.5","specialization":"specialization2","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
  // {"name":"ahmed","cost":"400","rate":"2","specialization":"specialization3","profile_pic":"assets/imgs/avatar-ts-jessie.png"}];



  cost: number = 0;
  choosenDoctors = [];
  refresher;
  myindexTobeoffline;

  page = 0;
  maximumPages;
  infiniteScroll;

  onlinetmpArrForSorting = [];
  offlinetmpArrForSorting = [];
  loadingAlert;
  specialization_id

  constructor(public helper: HelperProvider, public toastCtrl: ToastController,
    public storage: Storage, public events: Events, public alertCtrl: AlertController,
    public service: LoginserviceProvider, public navCtrl: NavController,
    public navParams: NavParams, public translate: TranslateService,
    public loadingCtrl: LoadingController, public app: App) {

    console.log("ordre btn", this.orderBTn);

    this.accessToken = localStorage.getItem('user_token');
    this.helper.view = "pop";

    this.langDirection = this.helper.lang_direction;
    if (this.langDirection == "rtl")
      this.tostClass = "toastRight";
    else
      this.tostClass = "toastLeft";

    this.translate.use(this.helper.currentLang);
    var datafromsp = this.navParams.get('data');
    this.spId = datafromsp.id;
    this.spValue = datafromsp.sp;
    this.specialization_id = datafromsp.specialization_id
    this.Specialization = this.spValue;
    console.log("construct id ", this.spId, " value ", this.spValue);


    // this.events.subscribe('statusChanged', (data) => {
    //   console.log(" event status changed ",data);
    //   // data.status;
    //   // data.id;

    //   for(var k=0;k<this.DoctorsArray.length;k++)
    //   {

    //     if(this.DoctorsArray[k].id == data.id)
    //     {
    //       if(data.status == "1")
    //       {
    //         this.DoctorsArray[k].color="green";
    //         this.DoctorsArray[k].offline=false;
    //         this.DoctorsArray[k].moreTxt = "متوافر";
    //         this.DoctorsArray[k].online = "1";
    //         console.log("offline false ",this.DoctorsArray[k]);
    //         console.log("call sort function from status changed");
    //        //r this.sortDoctors();

    //       }else if (data.status == "0")
    //       {
    //         this.DoctorsArray[k].color="grey";
    //         this.DoctorsArray[k].offline=true;
    //         this.DoctorsArray[k].moreTxt = "غير متوافر";
    //         this.DoctorsArray[k].online = "0";
    //         console.log("call sort function from status changed");
    //         //r this.sortDoctors();
    //       }
    //     }

    //   }

    //   this.sortDoctorsWithOnline();
    // });
    // this.events.subscribe('status', (data) => {
    //   console.log(" event status ",data);
    //   // data.status;
    //   // data.id;

    //   for(var k=0;k<this.DoctorsArray.length;k++)
    //   {

    //     if(this.DoctorsArray[k].id == data.id)
    //     {
    //       if(data.status == "1")
    //       {
    //         this.DoctorsArray[k].color="green";
    //         this.DoctorsArray[k].offline=false;
    //         this.DoctorsArray[k].moreTxt="متوافر";
    //         this.DoctorsArray[k].online = "1";
    //         console.log("offline false ",this.DoctorsArray[k]);
    //         console.log("call sort function from status");
    //       // r this.sortDoctors();

    //       }else if (data.status == "0")
    //       {
    //         this.DoctorsArray[k].color="grey";
    //         this.DoctorsArray[k].offline=true;
    //         this.DoctorsArray[k].moreTxt="غير متوافر";
    //         this.DoctorsArray[k].online = "0";
    //         console.log("call sort function whenfrom status");
    //        //r this.sortDoctors();
    //       }
    //     } 
    //   }
    //   this.sortDoctorsWithOnline();
    // });

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
    //          //r this.sortDoctors();
    //         }
    //           // if(k == (this.DoctorsArray.length -1))
    //         // {
    //         //   console.log("call sort function");
    //         //   this.sortDoctors();
    //         // }

    //       }

    //     }
    //     }

    // });
    // this.events.subscribe('location', (data) => {
    //   console.log(" event location ",data);
    //   //
    //   // for(var k=0;k<this.DoctorsArray.length;k++)
    //   // {
    //   //    if(this.DoctorsArray[k].id == data.id)
    //   //   {
    //   //     this.DoctorsArray[k].distanceVal =10000;
    //   //   }
    //   // }
    //   //

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
    //       // if(k == (this.DoctorsArray.length -1))
    //       // {
    //       //   console.log("call sort function");
    //       //   this.sortDoctors();
    //       // }

    //     }

    //   }
    //   }




    //   });

    this.events.subscribe('getBusyDoctor', (data) => {
      console.log(" event getBusyDoctor ", data);
      // data.status;
      // data.id;

      for (var k = 0; k < this.DoctorsArray.length; k++) {

        if (this.DoctorsArray[k].id == data.id) {
          if (data.status == "1") {
            this.DoctorsArray[k].color = "red";
            this.DoctorsArray[k].offline = true;
            this.DoctorsArray[k].moreTxt = "غير متوافر";
            this.DoctorsArray[k].availability = "0";
            console.log("call sort function from get busy red");
            //r  this.sortDoctors();

          } 
          // else if (data.status == "0") {
          //   this.DoctorsArray[k].color = "green";
          //   this.DoctorsArray[k].offline = false;
          //   this.DoctorsArray[k].moreTxt = "متوافر";
          //   this.DoctorsArray[k].availability = "1";
          //   console.log("doctor :(", this.DoctorsArray[k]);
          //   console.log("offline false ", this.DoctorsArray[k]);
          //   this.helper.getDoctorStatus(data.id);
          //   console.log("call sort function from get busy green");
          //   //r  this.sortDoctors();
          // }


          // else if(data.status == "0")
          // {
          //   this.helper.getDoctorStatus(data.id);
          // }
        }
      }
      this.sortDoctorsWithOnline();
    });

    this.events.subscribe('busyDoctorChanged', (data) => {
      console.log(" event busyDoctorChanged ", data);
      // data.status;
      // data.id;

      for (var k = 0; k < this.DoctorsArray.length; k++) {

        if (this.DoctorsArray[k].id == data.id) {
          if (data.status == "1") {
            this.DoctorsArray[k].color = "red";
            this.DoctorsArray[k].offline = true;
            this.DoctorsArray[k].moreTxt = "غير متوافر";
            this.DoctorsArray[k].availability = "0";

            console.log("call sort function from get busy changed");
            //r  this.sortDoctors();

          } 
          // else if (data.status == "0") {
          //   this.DoctorsArray[k].color = "green";
          //   this.DoctorsArray[k].offline = false;
          //   this.DoctorsArray[k].moreTxt = "متوافر";
          //   this.DoctorsArray[k].availability = "1";
          //   console.log("offline false ", this.DoctorsArray[k]);
          //   this.helper.getDoctorStatus(data.id);
          //   console.log("call sort function from get busy changed");
          //   //r   this.sortDoctors();
          // }


          // else if(data.status == "0")
          // {
          //   this.helper.getDoctorStatus(data.id);
          // }
        }
      }
      this.sortDoctorsWithOnline();
    });
this.disableDropDown = true;
  }
  colclicked() {
    console.log("s element: ", this.sElement);
    //this.sElement.ionChange();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDoctorPage');

    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;

    this.accessToken = localStorage.getItem('user_token');

    this.service.getSpecializations2(this.accessToken).subscribe(
      resp => {

        console.log("getSpecializations resp: ", resp);
        for (var i = 0; i < JSON.parse(JSON.stringify(resp)).length; i++) {
          console.log("sp: ", resp[i].value);
          //this.Specialization=resp[0].value;
          // this.SpecializationArray.push(resp[i].value);
          this.SpecializationArray.push(resp[i]);
          // this.SpecializationChecked();

        }
        // this.page = 0;
        this.SpecializationChecked(this.specialization_id);


      },
      err => {
        console.log("getSpecializations error: ", err);
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

  SpecializationChecked(id) {
    this.DoctorsArray = []
    this.page = 0
    //var id = this.specialization_id;
    this.specialization_id = id
    console.log("all Specialization: ", this.SpecializationArray);
    console.log(this.Specialization);
    // for(var i=0;i<this.SpecializationArray.length;i++){
    //   if(this.Specialization == this.SpecializationArray[i].value)
    //   {
    //     this.myxid = this.SpecializationArray[i].id;
    //     this.page = 0;
    //     this.DoctorsArray= [];
    //     break;
    //   }
    // }
    //console.log("get doctor sp id: ", id);
    // this.presentLoadingCustom();
    //this.showLoading = false;

    // this.loadingAlert = this.alertCtrl.create({
    //   title: '',
    //   subTitle: "يرجى الإنتظار لحين ترتيب الأطباء حسب الأقرب إليك",
    //   buttons: ['حسناً']
    // });
    // this.loadingAlert.present();


    //this.presentWaitingToast("يرجى الإنتظار لحين ترتيب الأطباء حسب الأقرب إليك");
    this.disableDropDown = true
    this.xload();
  }


  xload() {


    if (this.refresher)
      this.showLoading = true;
    else
      this.showLoading = false;

    var tempArr = [];
    this.page++;


    this.service.getDoctorInSpecificSpecialization(this.page, this.specialization_id, this.accessToken).subscribe(
      resp => {
        console.log("getDoctorInSpecificSpecialization resp: ", resp);
        // this.loading.dismiss();
        this.showLoading = true;
        console.log("this.showLoading: ", this.showLoading);
        let doctorData = JSON.parse(JSON.stringify(resp));
        console.log("doctors data", doctorData["results"]);
        // this.DoctorsArray=[];  

        for (var i = 0; i < doctorData["results"].length; i++) {
          console.log("doctor: ", doctorData["results"][i]);

          if (doctorData["results"][i].nickname)
            doctorData["results"][i].doctorName = doctorData["results"][i].nickname;
          else
            doctorData["results"][i].doctorName = doctorData["results"][i].name;


          console.log("1");

          if (!doctorData["results"][i].rate)
            doctorData["results"][i].rate = 5;


          console.log("2");


          /* edit time , replace online with availability */

          var number = 30 * 60;

          console.log("doctorData[results].timedelivertvalue: ", doctorData["results"][i].timedelivertvalue);
          var dur = doctorData["results"][i].timedelivertvalue;

          var d = Number(dur + number);
          var h = Math.floor(d / 3600);
          var m = Math.floor(d % 3600 / 60);
          var s = Math.floor(d % 3600 % 60);
          console.log("h ", h, "m: ", m, "s: ", s);

          var hdisplay = h > 0 ? h + (h == 1 ? " س " : " س ") : "";
          var mdisplay = m > 0 ? m + (m == 1 ? " د " : " د ") : "";

          console.log(" time : ", hdisplay + mdisplay);
          doctorData["results"][i].timefordelivery2 = hdisplay + mdisplay;
          console.log("doctorData[results][i].timefordelivery2: ", doctorData["results"][i].timefordelivery2)


          /* */

          /**/     //alert(doctorData["results"][i].availability)
          if (doctorData["results"][i].busy == "1" && doctorData["results"][i].availability == "1")
            doctorData["results"][i].availability = "0";
          /**/

          if (doctorData["results"][i].busy == "1") {
            console.log("3");

            doctorData["results"][i].color = "red";
            doctorData["results"][i].offline = true;
            doctorData["results"][i].moreTxt = "غير متوافر";
          } else if (doctorData["results"][i].busy == "0") {
            console.log("4");

            if (doctorData["results"][i].availability == "1") {
              console.log("5");

              doctorData["results"][i].color = "green";
              doctorData["results"][i].offline = false;
              doctorData["results"][i].moreTxt = "متوافر";

            } else if (doctorData["results"][i].availability == "0") {
              console.log("6");

              doctorData["results"][i].color = "grey";
              doctorData["results"][i].offline = true;
              doctorData["results"][i].moreTxt = "غير متوافر";

            }

            console.log("7");
          }else{
            doctorData["results"][i].color = "grey";
            doctorData["results"][i].offline = true;
            doctorData["results"][i].moreTxt = "غير متوافر";
          }

          /* */
          console.log("8");


          tempArr.push(doctorData["results"][i]);
          this.DoctorsArray.push(doctorData["results"][i]);
        }
        if (tempArr.length > 0) {
          this.sortDoctorsWithOnline();

          this.xload();
        }
        else{
          this.disableDropDown = false
        }
        // else{
        //   this.sortDoctorsWithdistance();
        // }



        if (this.DoctorsArray.length >= 3) {
          // this.scrollHeight = "385px";
          this.scrollHeight = "615px";

        } else {
          this.scrollHeight = "260px";
        }
        for (i = 0; i < this.DoctorsArray.length; i++) {

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


          //this.helper.getDoctorStatus(this.DoctorsArray[i].id);


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

        if (this.DoctorsArray.length == 0) {
          console.log("if = 0");
          if (this.page == 1)
            this.presentToast(this.translate.instant("noSearchResult"));
        }
        //if(this.refresher)
        // this.refresher.complete();
        this.loadingAlert.dismiss()

      },
      err => {
        this.disableDropDown =false
        this.showLoading = true;
        this.loadingAlert.dismiss()
        // this.presentToast(this.translate.instant("serverError"));
        console.log("getDoctorInSpecificSpecialization error: ", err);
        //if(this.refresher)
        // this.refresher.complete();
      }
    );



  }
  getDistanceAndDuration(i) {

    if (this.DoctorsArray[i].offline == false) {

      console.log("online doctor i", this.DoctorsArray[i]);
      console.log("online doctor index", this.DoctorsArray[this.index]);

      console.log("doctors from array", this.DoctorsArray[i]);
      console.log("lat from helper", this.helper.lat);
      console.log("lon from helper", this.helper.lon);
      var docLat = this.DoctorsArray[i].lat;
      var docLon = this.DoctorsArray[i].lng;
      console.log("doctor lat :", docLat);
      console.log("doctor lng: ", docLon);
      console.log("doctor before duration", this.DoctorsArray[i]);
      this.index = i;


      this.service.getDurationAndDistance(this.helper.lat, this.helper.lon, docLat, docLon).subscribe(
        resp => {
          // this.index => i
          console.log("doctors", this.DoctorsArray);
          console.log("doctor ", this.DoctorsArray[i]);
          console.log("get data from google api", resp);
          var respObj = JSON.parse(JSON.stringify(resp));

          if (respObj.routes[0]) {
            console.log("duration : ", respObj.routes[0].legs[0].duration.text);
            console.log("distance : ", respObj.routes[0].legs[0].distance.text);
            console.log("doctor from array in get duration ", this.DoctorsArray[i]);

            var dis = respObj.routes[0].legs[0].distance.text;
            var disarr = dis.split(" ");
            if (disarr[1] == "km") {
              disarr[1] = "كم";
              dis = disarr.join(" ");
            } else if (disarr[1] == "m") {
              disarr[1] = "م";
              dis = disarr.join(" ");
            }
            console.log("dis from get distance", dis);

            var dur = respObj.routes[0].legs[0].duration.text;
            var durarr = dur.split(" ");
            if (durarr[1] == "mins") {
              durarr[1] = "د";
              dur = durarr.join(" ");
            } else if (durarr[1] == "h") {
              durarr[1] = "س";
              dur = durarr.join(" ");
            }


            this.DoctorsArray[i].distance = dis;
            this.DoctorsArray[i].distanceVal = respObj.routes[0].legs[0].distance.value;
            this.DoctorsArray[i].timefordelivery = dur;
            console.log("distance from array ", this.DoctorsArray[i].distance);
            //this.sortDoctors();

          }

          if (i == (this.DoctorsArray.length - 1)) {
            console.log("call sort function");
            //r  this.sortDoctors();
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
        err => {
          console.log("get err from google api", err);
        }
      );
    }
  }
  // sortDoctors(){
  //   console.log("doc before sort ",this.DoctorsArray);
  //   // this.DoctorsArray.sort(function(a,b){
  //   //   console.log("a.distanceVal: ",a.distanceVal,"b.distanceVal: ",b.distanceVal);
  //   //   return a.distanceVal - b.distanceVal;
  //   // });

  //   //sort by nearest
  //   // this.DoctorsArray.sort((a,b)=>a.distanceVal-b.distanceVal); 

  //   //sort by nearest & online
  //   this.DoctorsArray.sort((a,b)=>{
  //     if(a.offline == false || b.offline == false)
  //       return a.distanceVal-b.distanceVal;

  //   }); 

  //   console.log("doc after sort ",this.DoctorsArray);
  // }


  sortDoctorsWithOnline() {
    console.log("onlline doc before sort ", this.DoctorsArray);

    // this.DoctorsArray.sort((a,b)=>{
    //   if(a.offline == false || b.offline == false)
    //     return a.distanceVal-b.distanceVal;

    // }); 

    this.DoctorsArray.sort((a, b)=> {
      return b["availability"] - a["availability"];
    });

    console.log("online doc after sort ", this.DoctorsArray);
    var tmpstore = [];
    tmpstore = this.DoctorsArray;
    this.onlinetmpArrForSorting = [];
    this.offlinetmpArrForSorting = [];

    for (var jj = 0; jj < tmpstore.length; jj++) {
      if (tmpstore[jj].availability == "1") {
        this.onlinetmpArrForSorting.push(tmpstore[jj]);

      } else {
        this.offlinetmpArrForSorting.push(tmpstore[jj]);
      }
    }
    //alert("offline"+JSON.stringify(this.offlinetmpArrForSorting.length))
    this.sortDoctorsWithdistance();
    console.log("this.onlinetmpArrForSorting", this.onlinetmpArrForSorting);
    console.log("this.offlinetmpArrForSorting", this.offlinetmpArrForSorting);

    // var sortingarrWithDistance =  this.sortDoctorsWithdistance(tmpArrForSorting);
    // this.DoctorsArray =[];
    // this.DoctorsArray.concat( sortingarrWithDistance , offlinetmpArrForSorting);
    // console.log("this.DoctorsArray after all things: ",this.DoctorsArray);
  }
  sortDoctorsWithdistance() {
    console.log("distance doc before sort ", this.DoctorsArray);
    console.log("distance before this.onlinetmpArrForSorting", this.onlinetmpArrForSorting);


    this.onlinetmpArrForSorting.sort((a, b)=> {
      return a["distanceval"] - b["distanceval"];
    });

    this.offlinetmpArrForSorting.sort((a, b)=> {
      return a["distanceval"] - b["distanceval"];
    });

    console.log("distance after this.onlinetmpArrForSorting", this.onlinetmpArrForSorting);
    console.log("distance after this.offlinetmpArrForSorting", this.offlinetmpArrForSorting);
    // this.DoctorsArray =[];
    var xarray = [];
    xarray = this.onlinetmpArrForSorting.concat(this.offlinetmpArrForSorting);

    console.log("distance doc after sort ", this.DoctorsArray);
    console.log("xarray", xarray);
    this.DoctorsArray = xarray;
    // var yarray=[];
    // yarray = [3,4].concat([1,2]);
    // console.log("yarray",yarray);
  }




  doctorChecked(item, event) {
    console.log("doctor checked", item);
    if (item.checked == true) {
      //      this.cost += parseInt(item.cost);
      this.choosenDoctors.push(item);
      this.checkfund(item.discount, item.id);
    }
    else {
      //    this.cost -= parseInt(item.cost);
      for (var i = 0; i < this.choosenDoctors.length; i++) {
        if (item.name == this.choosenDoctors[i].name)
          this.choosenDoctors.splice(i, 1);
      }
    }


  }


  checkfund(itemPrice, itemId) {

    this.accessToken = localStorage.getItem('user_token');

    this.orderBTn = true;
    // console.log("checked itemid",itemId,"object: ",this.DoctorsArray[itemId]);
    // console.log("array",this.DoctorsArray);


    for (var g = 0; g < this.DoctorsArray.length; g++) {
      if (itemId == this.DoctorsArray[g].id) {
        this.myindexTobeoffline = g;
        this.helper.myindexTobeoffline = g;
        //this.DoctorsArray[g].offlineFororders=true;

        // localStorage.setItem('myindexTobeoffline',g);
      }

    }
    this.service.getFund(this.accessToken).subscribe(
      resp => {
        console.log("resp from getFund", resp);
        var pfunds = JSON.parse(JSON.stringify(resp)).data;



        if (pfunds.order_count == 0) {
          this.orderBTn = false;
          //   for(var k=0;k<this.DoctorsArray.length;k++)
          // {
          //   this.DoctorsArray[k].offlineFororders=false;
          // }

          //  this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=false;
        }
        else if (pfunds.order_count > 0 && pfunds.order_count < 3)
          this.fundAlert(pfunds.forfeit_patient, itemPrice, this.helper.myindexTobeoffline);
        else if (pfunds.order_count >= 3)
          this.fundStopAlert(pfunds.forfeit_patient, itemPrice, this.helper.myindexTobeoffline);






      }, err => {
        console.log("err from getFund", err);
      });
  }
  fundAlert(mony, price, id) {
    if (!price)
      price = "";

    console.log("id or index", id);
    let alert = this.alertCtrl.create({
      title: "تطبيق الدكتور",
      message: " قيمة الغرامه: " + mony + " جنيه مصرى <br>" + " قيمه الكشف: " + price + " جنيه مصرى<br>",
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
            this.orderBTn = true;

            // for(var k=0;k<this.DoctorsArray.length;k++)
            // {
            //   this.DoctorsArray[k].offlineFororders=true;
            // }

            //  this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=true;

          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('agree clicked');
            this.orderBTn = false;

            // for(var k=0;k<this.DoctorsArray.length;k++)
            // {
            //   this.DoctorsArray[k].offlineFororders=false;
            // }

            // this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=false;
          }
        }
      ]
    });
    alert.present();
  }
  fundStopAlert(mony, price, id) {
    if (!price)
      price = "";

    this.orderBTn = true;
    // for(var k=0;k<this.DoctorsArray.length;k++)
    // {
    //   this.DoctorsArray[k].offlineFororders=true;
    // }

    // this.DoctorsArray[this.helper.myindexTobeoffline].offlineFororders=true;
    let alert = this.alertCtrl.create({
      title: "تطبيق الدكتور",
      message: " قيمة الغرامه: " + mony + " جنيه مصرى <br>" + " قيمه الكشف: " + price + " جنيه مصرى<br>",
      buttons: ["حسنا"
      ]
    });

    alert.present();

  }



  sendOrder() {
    console.log("first: ", this.first);
    console.log("second: ", this.second);
    console.log("doctors: ", this.choosenDoctors);
    console.log("cost: ", this.cost);
    if (this.choosenDoctors.length > 5) {
      this.presentToast(this.translate.instant("check3doctors"));
    } else if (this.choosenDoctors.length < 1) {
      this.presentToast(this.translate.instant("checkAtleastone"));
    } else {
      var doctorsId = "";
      for (var j = 0; j < this.choosenDoctors.length; j++) {
        doctorsId += this.choosenDoctors[j].id + ",";
      }
      console.log("doctors id: ", doctorsId);

      this.orderBTn = true;

      const alertEdit = this.alertCtrl.create({
        title: 'كوبون خصم',
        inputs: [
          {
            name: 'currentFees',
            placeholder: "ادخل كود - اختياري",
            type: 'text'
          }
        ],
        buttons: [
          {
            text: "إلغاء",
            role: 'cancel',
            handler: data => {
              this.orderBTn = false
              console.log('Cancel clicked');
            }
          },
          {
            text: "اطلب الآن",
            handler: data => {
              if (String(data.currentFees).trim()) {

                this.service.checKCoupon(doctorsId, this.accessToken, this.specialization_id, String(data.currentFees).trim(), (data) => {
                  if (data.success) {
                    if (data.status == -1) {
                      this.presentToast("كوبون الخصم غير صالح")
                    }
                    else if (data.status == 2) {
                      this.presentToast("كوبون الخصم مستخدم من قبل")
                    }
                    else if (data.status == 1) {
                      let coupon_type = ""
                      if (data.coupon.type == "percent") {
                        coupon_type = data.coupon.discount + " % "
                      }
                      else {
                        coupon_type = data.coupon.discount + " جنيه "
                      }
                      let confirm = this.alertCtrl.create({
                        title: '',
                        subTitle: "سيتم خصم " + coupon_type + " من قيمة الكشف",
                        buttons: [
                          {
                            text: "إلغاء",
                            role: 'cancel',
                            handler: data => {
                              this.orderBTn = false
                              console.log('Cancel clicked');
                            }
                          },
                          {
                            text: "تأكيد الطلب",
                            handler: data2 => {
                              this.service.saveOrder(doctorsId, this.accessToken, this.choosenDoctors.length, data.coupon.id).subscribe(
                                resp => {
                                  if (JSON.parse(JSON.stringify(resp)).success) {
                                    console.log("saveOrder resp: ", resp);
                                    var newOrder = JSON.parse(JSON.stringify(resp));

                                    console.log("from order doctor", newOrder.order.id, "service id", newOrder.order.service_profile_id)

                                    this.helper.orderIdForUpdate = newOrder.order.id;
                                    //this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,this.choosenDoctors.length);
                                    //this.helper.orderStatusChanged(newOrder.order.id);


                                    this.presentToast(this.translate.instant("ordersent"));
                                    this.helper.dontSendNotification = false;

                                    // this.navCtrl.pop();
                                    this.navCtrl.setRoot('remaining-time-to-accept', { orderId: newOrder.order.id });
                                  } else {
                                    // this.presentToast(this.translate.instant("serverError"));
                                    console.log("");
                                  }
                                },
                                err => {
                                  console.log("saveOrder error: ", err);
                                  // this.presentToast(this.translate.instant("serverError"));
                                  this.orderBTn = false;
                                }
                              );
                            }
                          }]
                      });
                      confirm.present();
                    }

                  }
                  else {
                    if (data.status == -1) {
                      this.presentToast("كوبون الخصم غير صالح")
                    }
                    else if (data.status == 2) {
                      this.presentToast("كوبون الخصم مستخدم من قبل")
                    }
                    else {
                      this.presentToast("كوبون الخصم غير صالح")
                    }

                  }
                },
                  (data) => {
                    this.presentToast("خطأ في الأتصال")
                  })
              }
              else {
                this.service.saveOrder(doctorsId, this.accessToken, this.choosenDoctors.length, -1).subscribe(
                  resp => {
                    if (JSON.parse(JSON.stringify(resp)).success) {
                      console.log("saveOrder resp: ", resp);
                      var newOrder = JSON.parse(JSON.stringify(resp));

                      console.log("from order doctor", newOrder.order.id, "service id", newOrder.order.service_profile_id)

                      this.helper.orderIdForUpdate = newOrder.order.id;
                      //this.helper.createOrder(newOrder.order.id,newOrder.order.service_profile_id,this.choosenDoctors.length);
                      //this.helper.orderStatusChanged(newOrder.order.id);


                      this.presentToast(this.translate.instant("ordersent"));
                      this.helper.dontSendNotification = false;

                      // this.navCtrl.pop();
                      this.navCtrl.setRoot('remaining-time-to-accept', { orderId: newOrder.order.id });
                    } else {
                      // this.presentToast(this.translate.instant("serverError"));
                      console.log("");
                    }
                  },
                  err => {
                    console.log("saveOrder error: ", err);
                    // this.presentToast(this.translate.instant("serverError"));
                    this.orderBTn = false;
                  }
                );

              }

            }
          }
        ]
      });
      alertEdit.present()
    }

  }

  showDoctorProfile(item) {
    console.log("card item ", item);
    // item.specialization = this.Specialization;
    item.specialization = item.specialityname
    console.log("item after add specialization: ", item);

    this.navCtrl.push('doctor-profile', {
      data: item
    });
  }

  validate() {
    console.log("validation");
    var code = this.first + this.second + this.third + this.fourth + this.last;
    this.service.validateDiscountCode(code, this.accessToken).subscribe(
      resp => {
        console.log("resp from validateDiscountCode: ", resp);
        if (JSON.parse(JSON.stringify(resp)).valid) {
          this.presentToast(this.translate.instant("validDiscountCode"));
        } else {
          this.presentToast(this.translate.instant("notValidDiscountCode"));
        }
      },
      err => {
        // this.presentToast(this.translate.instant("serverError"));
        console.log("err from validateDiscountCode: ", err);
      }
    );
  }
  dismiss() {
    this.navCtrl.pop();
  }
  private presentWaitingToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'bottom',
      cssClass: this.tostClass
    });
    toast.present();
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

  doRefresh(ev) {
    console.log("refresh", ev);
    // this.photos =[];
    // this.photosForApi = [];
    this.choosenDoctors = [];
    this.refresher = ev;

    this.page = 0;
    this.DoctorsArray = [];

    this.SpecializationChecked(this.specialization_id);

  }
  ionViewWillEnter() {
    console.log("ionViewWillEnter : page = ", this.page)
    // this.page = 0;
  }


}
