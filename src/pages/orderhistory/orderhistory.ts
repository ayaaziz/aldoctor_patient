import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController,AlertController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';


// @IonicPage()
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
  ordersArray=[];

  

  orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
  "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
"custom_date":"","date_id":"","statusTxt":"","orderDate":"","reorderBtn":false,
"diabledesign":false,"addressSign":true,"type_id":"","diabledRate":false};

  tostClass ;
  refresher;
  swipe=0;
  page=1;
  infiniteScroll;
  filterpage=1;
  scroll = 1;
  showLoading=true;

  
  constructor(public helper:HelperProvider, public service:LoginserviceProvider,
    public storage: Storage,  public alertCtrl: AlertController,
    public translate: TranslateService, public navCtrl: NavController,
     public navParams: NavParams,public toastCtrl: ToastController) {

      this.langDirection = this.helper.lang_direction;

      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      
      console.log("langdir:",this.langDirection);
      this.translate.use(this.helper.currentLang);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderhistoryPage');
   // this.getOrders();
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
  respFromGetOrders(resp)
  {
    console.log("order in page 1",resp);
          var ordersData =JSON.parse(JSON.stringify(resp)).orders;
          this.ordersArray = [];
          this.ordersArray = ordersData;
          

          for(var j=0;j<ordersData.length;j++){
            
            if(ordersData[j].status == "10" ) //canceled by doctor 0, || ordersData[j].status == "3"
            {  
              ordersData[j].color = "red";
              ordersData[j].rated = "1";
            }
            else if(ordersData[j].status == "5") //finished
              ordersData[j].color="grey";
            
            if(ordersData[j].is_reorder == "1")
              ordersData[j].color = "green";
            
            // if(ordersData[j].rated == "0")
            //   ordersData[j].color = "yellow";

            if(ordersData[j].status == "4") //ordersData[j].status == "0" ||
            {
              ordersData[j].statusTxt = "ملغي" ;
              ordersData[j].color = "red";
              ordersData[j].rated = "1";
            }
            else if (ordersData[j].status == "10")
            {
              ordersData[j].statusTxt ="مرفوض" ;
              ordersData[j].color = "red";
              ordersData[j].rated = "1";
            }
            else if (ordersData[j].status == "3")
            {
              ordersData[j].statusTxt ="لا يوجد استجابه" ;
              ordersData[j].color = "red";
              ordersData[j].rated = "1";
            }
            else if (ordersData[j].status == "5" || ordersData[j].status == "6" )
            { 
              ordersData[j].statusTxt="تم التنفيذ";
              ordersData[j].color = "grey";
            }
            else if(ordersData[j].status == "2" || ordersData[j].status=="8" || ordersData[j].status=="7"){
              ordersData[j].statusTxt = "قيد التنفيذ";
              ordersData[j].color = "green";
            }

              
            // if(ordersData[j].reorder == "1")
            //   ordersData[j].color = "green";

            

            var serviceProfile = ordersData[j].theServiceProfile;
            if(serviceProfile){

            if(serviceProfile.nickname)
              this.orderobject.name = serviceProfile.nickname;
            else 
              this.orderobject.name = serviceProfile.name;


          
              // this.orderobject.name = serviceProfile.name;
              this.orderobject.profile_pic = serviceProfile.profile_pic;
              this.orderobject.rate = serviceProfile.rate;
              // this.orderobject.rate = ordersData[j].ratedvalue;
              
              if(ordersData[j].service_id && ordersData[j].service_id == "3" )
              {
                this.orderobject.diabledesign = true;
                this.orderobject.addressSign = false;
                this.orderobject.diabledRate = false;
                this.orderobject.specialization = serviceProfile.entity.address;
                this.orderobject.type_id = serviceProfile.entity.type_id;

              }  
              else{
                this.orderobject.diabledesign = false;
                this.orderobject.addressSign = true;
                this.orderobject.diabledRate = false;
                this.orderobject.specialization = serviceProfile.speciality;

              }
                
              
              this.orderobject.doctor_id = serviceProfile.id;
              this.orderobject.color = ordersData[j].color;
              // this.orderobject.reorder = ordersData[j].reorder;
              this.orderobject.reorder = ordersData[j].is_reorder;
              this.orderobject.rated = ordersData[j].rated;
              
              
              this.orderobject.orderId = ordersData[j].id;
              this.orderobject.order_status = ordersData[j].status;
              this.orderobject.statusTxt = ordersData[j].statusTxt;
              this.orderobject.orderDate = ordersData[j].created_at.split(" ")[0];
              
              // console.log("ordersData[j].date ",ordersData[j].date);

              // if(ordersData[j].reorder == "1")
              if(ordersData[j].is_reorder == "1")
              {
                console.log("ordersData[j].date ",ordersData[j].date);
                console.log("today",new Date().toISOString().split('T')[0]);
                
                if(new Date().toISOString().split('T')[0] == ordersData[j].date ){
                  console.log("==")
                  this.orderobject.reorderBtn = false;
                }else{
                  console.log("!=")
                  this.orderobject.reorderBtn = true;
                }


                this.orderobject.custom_date = ordersData[j].custom_date;
                this.orderobject.date_id = ordersData[j].date_id;

              } else{
                this.orderobject.custom_date ="";
                this.orderobject.date_id = "";
              } 

              this.data.push(this.orderobject);

              this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
                  "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
                  "custom_date":"","date_id":"","statusTxt":"","orderDate":"","reorderBtn":false,
                  "diabledesign":false,"addressSign":true,"type_id":"","diabledRate" :false};
          
                    
            }
            else{

              this.orderobject.diabledesign = true;
              this.orderobject.addressSign = true;
              this.orderobject.diabledRate = true;

              this.orderobject.orderId = ordersData[j].id;
              
              if(ordersData[j].status == "3")
                this.orderobject.name = "لا يوجد استجابه"; //تم رفض الطلب
              else if (ordersData[j].status == "0")
                this.orderobject.name = "تم ارسال الطلب";
                
              this.orderobject.profile_pic = "assets/imgs/default-avatar.png";
              this.orderobject.orderDate = ordersData[j].created_at.split(" ")[0];
              this.data.push(this.orderobject);
              console.log("ordres data",this.data);
              this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
              "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
              "custom_date":"","date_id":"","statusTxt":"","orderDate":"","reorderBtn":false,
              "diabledesign":false ,"addressSign":true,"type_id":"","diabledRate":false};
      
           
            }
          }
           
          
          if(this.data.length == 0)
          {
            this.presentToast(this.translate.instant("noOrders"));
          }
          
          if(this.refresher){
            this.refresher.complete();
          }
          if (this.infiniteScroll) {
            this.infiniteScroll.complete();
          }
          if(this.swipe)
            this.swipe = 0;
  }

  refreshOrders(){
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.showLoading = false;

      this.service.getUserOrders(1,this.accessToken).subscribe(
        resp=>{
          if(this.refresher){
            this.data = [];
            this.page = 1;
            this.filterpage=1;
            this.scroll = 1;
          }
          this.showLoading = true;
          this.respFromGetOrders(resp);
          
        },
        err=>{
          this.showLoading = true;
          console.log("refresh",err);
        }
      );
    });
  }
  getOrders(){
    
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;
      this.showLoading = false;
      this.service.getUserOrders(this.page,this.accessToken).subscribe(
        resp=>{
          this.showLoading = true;
          var ordersData =JSON.parse(JSON.stringify(resp)).orders;
          if(ordersData.length == 0)
            this.scroll = 0;
          //  this.page=1;
          //  this.infiniteScroll.enable(false);
          
          if(resp)
            this.respFromGetOrders(resp);
          else
            this.infiniteScroll.enable(false);
 
        },
        err=>{
          this.showLoading = true;
          console.log("order in page 1",err);
        }
      );
//       this.service.getSpecializations(this.accessToken).subscribe(
//         resp=>{
//           for(var i=0;i<JSON.parse(JSON.stringify(resp)).length;i++){
//             console.log("sp: ",resp[i].value);
//             // this.SpecializationArray.push(resp[i].value);
//             this.SpecializationArray.push(resp[i]);

//           }
// //  if(this.refresher){
// //           this.refresher.complete();
// //  }
//       //   },
//       //   err=>{

//       //   }
//       // );
//       this.service.getUserOrders(1,this.accessToken).subscribe(
//         resp=>{
          
//          console.log("getUserOrders resp: ",resp);
//          var ordersData =JSON.parse(JSON.stringify(resp)).orders;
//          this.ordersArray = [];
//          this.ordersArray = ordersData;

//          console.log("orders: ",ordersData);
//           for(var j=0;j<ordersData.length;j++){
//             console.log("status ",ordersData[j].status );
//             // ordersData[j].status="7";
//             if(ordersData[j].status == "0") //canceled by doctor
//               ordersData[j].color = "red";
//             else if(ordersData[j].status == "5") //finished
//               ordersData[j].color="grey";
            
//             if(ordersData[j].reorder == "1")
//               ordersData[j].color = "green";
            
//             if(ordersData[j].rated == "0")
//               ordersData[j].color = "yellow";

//             // this.orderobject.orderId = ordersData[j].id;
//             // this.orderobject.order_status = ordersData[j].status;

//             console.log("orderStatus: " ,this.orderobject.order_status , "orderid: ",this.orderobject.orderId);


//             console.log("order id:", ordersData[j].id, "order :",ordersData[j]);
//             var serviceProfile = ordersData[j].theServiceProfile;
//             if(serviceProfile){
//             for(var k=0;k<this.SpecializationArray.length;k++){
//               //      // console.log("serviceProfile.speciality_id",serviceProfile.extraInfo.speciality_id)
//               if(serviceProfile.doctor.speciality_id == this.SpecializationArray[k].id)
//                     {
//                   this.orderobject.name = serviceProfile.name;
//                   this.orderobject.profile_pic = serviceProfile.profile_pic;
//                   this.orderobject.rate = serviceProfile.rate;
//                   this.orderobject.specialization = this.SpecializationArray[k].value;
//                   this.orderobject.doctor_id = serviceProfile.id;
//                   this.orderobject.color = ordersData[j].color;
//                   this.orderobject.reorder = ordersData[j].reorder;
//                   this.orderobject.rated = ordersData[j].rated;
//                   this.orderobject.orderId = ordersData[j].id;
//                   this.orderobject.order_status = ordersData[j].status;
//                   if(ordersData[j].reorder == "1")
//                   {
//                     this.orderobject.custom_date = ordersData[j].custom_date;
//                     this.orderobject.date_id = ordersData[j].date_id;

//                   } else{
//                     this.orderobject.custom_date ="";
//                     this.orderobject.date_id = "";

//                   } 

//                   this.data.push(this.orderobject);

//                   this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
//                   "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
//                   "custom_date":"","date_id":""};
//                     }
//                     //break;
//             }
//           }
//             // this.service.getServiceProfile(ordersData[j].service_profile_id,this.accessToken).subscribe(
//             //   resp =>{
//             //    // console.log("get service id resp",resp);
//             //     var serviceProfile = JSON.parse(JSON.stringify(resp)).user;
//             //     for(var k=0;k<this.SpecializationArray.length;k++){
//             //      // console.log("serviceProfile.speciality_id",serviceProfile.extraInfo.speciality_id)
//             //       if(serviceProfile.extraInfo.speciality_id == this.SpecializationArray[k].id)
//             //       {
//             //        /* console.log("name: ",serviceProfile.name,
//             //         "image: ",serviceProfile.profile_pic,"rate: ",serviceProfile.rate,
//             //       " sp: ",this.SpecializationArray[k].value);*/
//             //       this.orderobject.name = serviceProfile.name;
//             //       this.orderobject.profile_pic = serviceProfile.profile_pic;
//             //       this.orderobject.rate = serviceProfile.rate;
//             //       this.orderobject.specialization = this.SpecializationArray[k].value;
//             //       this.orderobject.doctor_id = serviceProfile.id;

//             //       this.data.push(this.orderobject);
//             //       this.orderobject={"orderId":"",
//             //       "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":""};
                
//             //           break;
//             //       }

//             //     }

//             //   },
//             //   err=>{
//             //     console.log("get service id err",err);
//             //   }
//             // );
//           }
//           if(this.data.length == 0)
//           {
//             this.presentToast(this.translate.instant("noOrders"));
//           }
//           //this.refresher.complete(); 
//           if(this.refresher){
//             this.refresher.complete();
//             }

//           if(this.swipe)
//             this.swipe = 0;
//         },
//         err=>{

//         }
//       );
//         },
//         err=>{
//           console.log("getUserOrders error: ",err);
//         }
//       );
   });


  }

  refreshFilterOrders(){
    this.showLoading = false;
    this.service.filterOrder(this.from,this.to,1,this.accessToken).subscribe(
      resp=>{

        this.showLoading = true;
        console.log("resp from refresh filter resp",resp);
        if(this.refresher){
          this.data = [];
         
        }    
        var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        if(ordersData.length == 0)
          this.scroll = 0;  
          // this.filterpage=1;
          //this.infiniteScroll.complete();

        this.respFromGetOrders(resp);
        
        
      },err=>{
        this.showLoading = true;
        console.log("resp from filter err",err);
      }
    );
  }
  respFromFilterOrders()
  {
    this.showLoading = false;
    this.service.filterOrder(this.from,this.to,this.filterpage,this.accessToken).subscribe(
      resp=>{
        this.showLoading = true;

        console.log("resp from filter resp",resp);
        
        var ordersData =JSON.parse(JSON.stringify(resp)).orders;
        if(ordersData.length == 0)
          this.scroll = 0;  
          // this.filterpage=1;
          //this.infiniteScroll.complete();

        this.respFromGetOrders(resp);
        
        
      },err=>{
        this.showLoading = true;
        console.log("resp from filter err",err);
      }
    );
  }

  dateFromChanged(event){
    this.data=[];
    console.log("to: ",this.to);
    console.log("from: ",this.from);
    // console.log("date", new Date().toISOString().split('T')[0]);
    var date1 = new Date(this.to);
    var date2 = new Date(this.from);
    
    if(date2 > date1)
      this.presentToast(this.translate.instant("fromGreaterThanTo"));
    else
      this.respFromFilterOrders();

    // var timeDiff = Math.abs(date1.getTime() - date2.getTime());
    // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    // console.log("order history diff ",diffDays);

    
   
  }
  
  dateToChanged(event){
    this.data=[];
    var currentDate = new Date().toLocaleDateString();
    console.log("current date",currentDate);
    console.log("to: ",this.to);
    console.log("from: ",this.from);
    
    var date1 = new Date(this.to);
    var date2 = new Date(this.from);
    
    if(date2 > date1)
      this.presentToast(this.translate.instant("fromGreaterThanTo"));
    else
      this.respFromFilterOrders();


    //this.respFromFilterOrders();
    
    
    // this.service.filterOrder(this.from,this.to,this.filterpage,this.accessToken).subscribe(
    //   resp=>{
    //     console.log("resp to filter resp",resp);
    //     this.respFromGetOrders(resp);
    //     // console.log("getUserOrders resp: ",resp);
    //     // var ordersData =JSON.parse(JSON.stringify(resp)).orders;
    //     // this.ordersArray= [];
    //     // this.ordersArray = ordersData;
    //     // console.log("orders: ",ordersData);
    //     //  for(var j=0;j<ordersData.length;j++){
    //     //    console.log("status ",ordersData[j].status);
           
    //     //   if(ordersData[j].status == "0") //canceled by doctor
    //     //     ordersData[j].color = "red";
    //     //   else if(ordersData[j].status == "2") //accepted by doctor
    //     //     ordersData[j].color="green";
    //     //   else if(ordersData[j].status == "5") //finished
    //     //     ordersData[j].color="grey";
    //     //   else if(ordersData[j].status == "" )
    //     //     ordersData[j].color = "white";
    //     //   else 
    //     //     ordersData[j].color = "orange";

    //     //   //  this.orderobject.orderId = ordersData[j].id;
    //     //   //  this.orderobject.order_status = ordersData[j].status;

    //     //     console.log("order id:", ordersData[j].id);
    //     //     var serviceProfile = ordersData[j].theServiceProfile;
    //     //   console.log(this.SpecializationArray);
    //     //     for(var k=0;k<this.SpecializationArray.length;k++){
    //     //      console.log("serviceProfile.doctor.speciality_id",serviceProfile.doctor.speciality_id,"k=",k);
    //     //      console.log("sp id...: ", this.SpecializationArray[k].id);
    //     //       if(serviceProfile.doctor.speciality_id == this.SpecializationArray[k].id)
    //     //             {
    //     //           this.orderobject.name = serviceProfile.name;
    //     //           this.orderobject.profile_pic = serviceProfile.profile_pic;
    //     //           this.orderobject.rate = serviceProfile.rate;
    //     //           this.orderobject.specialization = this.SpecializationArray[k].value;
    //     //           this.orderobject.doctor_id = serviceProfile.id;
    //     //           this.orderobject.color = ordersData[j].color;
    //     //           this.orderobject.reorder = ordersData[j].reorder;
    //     //           this.orderobject.rated = ordersData[j].rated;
    //     //           this.orderobject.orderId = ordersData[j].id;
    //     //           this.orderobject.order_status = ordersData[j].status;

    //     //           this.data.push(this.orderobject);
    //     //           this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
    //     //           "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
    //     //           "custom_date":"","date_id":""};
    //     //             }
    //     //             //break;
    //     //     }

    //     //   //  this.service.getServiceProfile(ordersData[j].service_profile_id,this.accessToken).subscribe(
    //     //   //    resp =>{
    //     //   //     // console.log("get service id resp",resp);
    //     //   //      var serviceProfile = JSON.parse(JSON.stringify(resp)).user;
    //     //   //     //  this.data=[];
    //     //   //      for(var k=0;k<this.SpecializationArray.length;k++){
    //     //   //       // console.log("serviceProfile.speciality_id",serviceProfile.extraInfo.speciality_id)
    //     //   //        if(serviceProfile.extraInfo.speciality_id == this.SpecializationArray[k].id)
    //     //   //        {
    //     //   //         /* console.log("name: ",serviceProfile.name,
    //     //   //          "image: ",serviceProfile.profile_pic,"rate: ",serviceProfile.rate,
    //     //   //        " sp: ",this.SpecializationArray[k].value);*/
    //     //   //        this.orderobject.name = serviceProfile.name;
    //     //   //        this.orderobject.profile_pic = serviceProfile.profile_pic;
    //     //   //        this.orderobject.rate = serviceProfile.rate;
    //     //   //        this.orderobject.specialization = this.SpecializationArray[k].value;
    //     //   //         this.orderobject.doctor_id = serviceProfile.id;

    //     //   //        this.data.push(this.orderobject);
    //     //   //        this.orderobject={"orderId":"","order_status":"",
    //     //   //        "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":""};
               
    //     //   //            break;
    //     //   //        }

    //     //   //      }

    //     //   //    },
    //     //   //    err=>{
    //     //   //      console.log("get service id err",err);
    //     //   //    }
    //     //   //  );
    //     //  }
    //     //  if(this.data.length == 0)
    //     //  {
    //     //    this.presentToast(this.translate.instant("noOrders"));
    //     //  }

    //   },err=>{
    //     console.log("resp to filter err",err);
    //   }
    // );
  }
  ionViewWillEnter() {
    console.log("will enter get orders")
    this.cancelTxt = this.translate.instant("canceltxt");
    this.doneTxt = this.translate.instant("doneTxt");
    this.to="";
    this.from="";
    this.data=[];
    this.page=1;
    this.getOrders();

    // this.getSpecializationsData()
  }
  followOrder(item){
    console.log("follow item ",item);
    console.log("data length: ", this.data.length);
    console.log("ordersArray: ",this.ordersArray);
    // for(var k=0;k<this.ordersArray[k].length;k++)
    // {
    //   if(parseInt( this.ordersArray[k].service_profile_id) == item.doctor_id)
    //   {
    //     console.log("id from ordersArray : ",this.ordersArray[k].id);
    //     item.orderId=this.ordersArray[k].id;
    //     break;
    //   }
    // }

    /*
    console.log("order: ",item);
    if(item.order_status == "7"){
       this.navCtrl.push('follow-order',{
        data:item
      });
    }
    */
    
    // else{
    //   this.navCtrl.push('follow-order',{
    //     data:item
    //   });
    // }

    /*
      1 started 
      2 accepted by doctor 
      0 cancelled by doctor
      3 no respond 
      5 finished
      6 finshed with reorder
      7 start detection
      8 move to paient 
    */
if(item.order_status == "2" || item.order_status=="8" || item.order_status =="7")
{
  // this.navCtrl.setRoot('follow-order',{
  //   data:item
  // });
if(item.type_id == "1" || item.type_id == "2" || item.type_id == "3"  )
{
  this.helper.type_id  = item.type_id;
  this.navCtrl.setRoot('follow-order-for-plc',
  {data:
    {"orderId":item.orderId, 
      "doctorId":item.doctor_id
    }
  });


}else{
  this.navCtrl.setRoot('follow-order',
        {data:
          {"orderId":item.orderId, 
            "doctorId":item.doctor_id,
            "order_status":item.order_status
          }
        });

}
  

        
}
}
  doRefresh(ev){
    console.log("refresh",ev);
    this.refresher = ev;
    if(this.to || this.from)
    {
      // this.filterpage=1;
      // this.respFromFilterOrders();
      this.refreshFilterOrders();
    }else{
     
      this.refreshOrders();
    }
    
    
  }
  rateagain(item){
    console.log("item from rate function ",item);
    if(item.type_id == "1" || item.type_id == "2" || item.type_id == "3")
    {
      this.helper.type_id  = item.type_id;

      this.navCtrl.push('rate-service',
      {data:
        {
        "doctorId":item.doctor_id, 
        "orderId":item.orderId
        }
      });

    }else{
      this.navCtrl.push("rate-doctor",{data:{doctorId:item.doctor_id,
        orderId:item.orderId}});
    }
    

  }
  reorder(item){
    console.log("item from reorder",item);
    this.presentConfirm(item);
  }

  presentConfirm(item) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmReorder"),
      message: this.translate.instant("confirmReorderMsg"),
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
            console.log('confirm reorder agree clicked');
            this.service.reorder(item.orderId,item.custom_date,item.date_id,this.accessToken).subscribe(
              resp=>{
                console.log("reorder resp",resp);
                this.presentToast( this.translate.instant("sendReorder"));
              },
              err=>{
                console.log("reorder err",err);
              }
            );            
          }
        }
      ]
    });
    alert.present();
  }


  loadMore(infiniteScroll) {
    console.log("load more");
    this.infiniteScroll = infiniteScroll;
    if(this.scroll == 1)
    {
    if(this.to || this.from)
    {
      this.filterpage ++;
      this.respFromFilterOrders();
    }else{
      this.page++;
      this.getOrders();
    }
  }else{
    this.infiniteScroll.complete();
  }  
    //this.loadNotification(infiniteScroll);
 
    // if (this.page == this.maximumPages) {
    //   infiniteScroll.enable(false);
    // }
    
  }

  


  swipeUp(event: any): any {
    console.log('Swipe Up', event);
    // let loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
  
    // loading.present();
    // loading.dismiss();
}

swipeDown(event: any): any {
    console.log('Swipe Down', event);
    this.swipe=1;
    this.getOrders();
    // let loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: `
    //     <div class="custom-spinner-container">
    //       <div class="custom-spinner-box"></div>
    //     </div>`,
    //   duration: 5000
    // });
  
    // loading.present();
}



}
