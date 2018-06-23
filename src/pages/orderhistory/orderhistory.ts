import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';


@IonicPage()
@Component({
  selector: 'page-orderhistory',
  templateUrl: 'orderhistory.html',
})
export class OrderhistoryPage {
  //{"name":"ahmed","specialization":"specialization1","rate":"2","profile_pic":"assets/imgs/avatar-ts-jessie.png"},
//  {"name":"ahmed","specialization":"specialization2","rate":"2.5","profile_pic":"assets/imgs/avatar-ts-jessie.png"}
  langDirection;    
  data=[];
  from;
  to;
  rate=4;
  cancelTxt;
  doneTxt;
  accessToken;
  SpecializationArray=[];
  color="grey";

  orderobject={"orderId":"",
  "name":"","specialization":"","profile_pic":"","rate":""};

  constructor(public helper:HelperProvider, public service:LoginserviceProvider,public storage: Storage, 
    public translate: TranslateService, public navCtrl: NavController,
     public navParams: NavParams) {
      this.langDirection = this.helper.lang_direction;
      console.log("langdir:",this.langDirection);
      this.translate.use(this.helper.currentLang);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderhistoryPage');
    this.getOrders();
  }
  getOrders(){
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.service.getSpecializations(this.accessToken).subscribe(
        resp=>{
          for(var i=0;i<JSON.parse(JSON.stringify(resp)).length;i++){
            console.log("sp: ",resp[i].value);
            // this.SpecializationArray.push(resp[i].value);
            this.SpecializationArray.push(resp[i]);

          }
 
      //   },
      //   err=>{

      //   }
      // );
      this.service.getUserOrders(this.accessToken).subscribe(
        resp=>{
          
         console.log("getUserOrders resp: ",resp);
         var ordersData =JSON.parse(JSON.stringify(resp)).orders;
         console.log("orders: ",ordersData);
          for(var j=0;j<ordersData.length;j++){
            console.log("status ",ordersData[j].status);
          
            if(ordersData[j].status == 0)
              this.color = "grey";
            else if(ordersData[j].status == 1)
              this.color="green";
            else if(ordersData[j].status == 2)
              this.color = "red";
            this.orderobject.orderId = ordersData[j].id;
            console.log("order id:", ordersData[j].id);

            this.service.getServiceProfile(ordersData[j].service_profile_id,this.accessToken).subscribe(
              resp =>{
               // console.log("get service id resp",resp);
                var serviceProfile = JSON.parse(JSON.stringify(resp)).user;
                for(var k=0;k<this.SpecializationArray.length;k++){
                 // console.log("serviceProfile.speciality_id",serviceProfile.extraInfo.speciality_id)
                  if(serviceProfile.extraInfo.speciality_id == this.SpecializationArray[k].id)
                  {
                   /* console.log("name: ",serviceProfile.name,
                    "image: ",serviceProfile.profile_pic,"rate: ",serviceProfile.rate,
                  " sp: ",this.SpecializationArray[k].value);*/
                  this.orderobject.name = serviceProfile.name;
                  this.orderobject.profile_pic = serviceProfile.profile_pic;
                  this.orderobject.rate = serviceProfile.rate;
                  this.orderobject.specialization = this.SpecializationArray[k].value;


                  this.data.push(this.orderobject);
                  this.orderobject={"orderId":"",
                  "name":"","specialization":"","profile_pic":"","rate":""};
                
                      break;
                  }

                }

              },
              err=>{
                console.log("get service id err",err);
              }
            );
          }
         
        },
        err=>{

        }
      );
        },
        err=>{
          console.log("getUserOrders error: ",err);
        }
      );
    });


  }
  dateFromChanged(event){
    this.data=[];
    console.log("to: ",this.to);
    console.log("from: ",this.from);
    this.service.filterOrder(this.from,this.to,this.accessToken).subscribe(
      resp=>{
        console.log("resp from filter resp",resp);

        console.log("getUserOrders resp: ",resp);
        var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        console.log("orders: ",ordersData);
         for(var j=0;j<ordersData.length;j++){
           console.log("status ",ordersData[j].status);
         
           if(ordersData[j].status == 0)
             this.color = "grey";
           else if(ordersData[j].status == 1)
             this.color="green";
           else if(ordersData[j].status == 2)
             this.color = "red";
           this.orderobject.orderId = ordersData[j].id;
           console.log("order id:", ordersData[j].id);

           this.service.getServiceProfile(ordersData[j].service_profile_id,this.accessToken).subscribe(
             resp =>{
              // console.log("get service id resp",resp);
               var serviceProfile = JSON.parse(JSON.stringify(resp)).user;
              //this.data=[];
               for(var k=0;k<this.SpecializationArray.length;k++){
                // console.log("serviceProfile.speciality_id",serviceProfile.extraInfo.speciality_id)
                 if(serviceProfile.extraInfo.speciality_id == this.SpecializationArray[k].id)
                 {
                  /* console.log("name: ",serviceProfile.name,
                   "image: ",serviceProfile.profile_pic,"rate: ",serviceProfile.rate,
                 " sp: ",this.SpecializationArray[k].value);*/
                 this.orderobject.name = serviceProfile.name;
                 this.orderobject.profile_pic = serviceProfile.profile_pic;
                 this.orderobject.rate = serviceProfile.rate;
                 this.orderobject.specialization = this.SpecializationArray[k].value;


                 this.data.push(this.orderobject);
                 this.orderobject={"orderId":"",
                 "name":"","specialization":"","profile_pic":"","rate":""};
               
                     break;
                 }

               }

             },
             err=>{
               console.log("get service id err",err);
             }
           );
         }
      },err=>{
        console.log("resp from filter err",err);
      }
    );
  }
  dateToChanged(event){
    this.data=[];
    var currentDate = new Date().toLocaleDateString();
    console.log("current date",currentDate);
    console.log("to: ",this.to);
    console.log("from: ",this.from);
    this.service.filterOrder(this.from,this.to,this.accessToken).subscribe(
      resp=>{
        console.log("resp to filter resp",resp);

        console.log("getUserOrders resp: ",resp);
        var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        console.log("orders: ",ordersData);
         for(var j=0;j<ordersData.length;j++){
           console.log("status ",ordersData[j].status);
         
           if(ordersData[j].status == 0)
             this.color = "grey";
           else if(ordersData[j].status == 1)
             this.color="green";
           else if(ordersData[j].status == 2)
             this.color = "red";
           this.orderobject.orderId = ordersData[j].id;
           console.log("order id:", ordersData[j].id);

           this.service.getServiceProfile(ordersData[j].service_profile_id,this.accessToken).subscribe(
             resp =>{
              // console.log("get service id resp",resp);
               var serviceProfile = JSON.parse(JSON.stringify(resp)).user;
              //  this.data=[];
               for(var k=0;k<this.SpecializationArray.length;k++){
                // console.log("serviceProfile.speciality_id",serviceProfile.extraInfo.speciality_id)
                 if(serviceProfile.extraInfo.speciality_id == this.SpecializationArray[k].id)
                 {
                  /* console.log("name: ",serviceProfile.name,
                   "image: ",serviceProfile.profile_pic,"rate: ",serviceProfile.rate,
                 " sp: ",this.SpecializationArray[k].value);*/
                 this.orderobject.name = serviceProfile.name;
                 this.orderobject.profile_pic = serviceProfile.profile_pic;
                 this.orderobject.rate = serviceProfile.rate;
                 this.orderobject.specialization = this.SpecializationArray[k].value;


                 this.data.push(this.orderobject);
                 this.orderobject={"orderId":"",
                 "name":"","specialization":"","profile_pic":"","rate":""};
               
                     break;
                 }

               }

             },
             err=>{
               console.log("get service id err",err);
             }
           );
         }

      },err=>{
        console.log("resp to filter err",err);
      }
    );
  }
  ionViewWillEnter() {
    this.cancelTxt = this.translate.instant("canceltxt");
    this.doneTxt = this.translate.instant("doneTxt");
    // this.getSpecializationsData()
  }
  followOrder(item){
    console.log("order: ",item);
    this.navCtrl.push('follow-order',{
      data:item
    });

  }
}
