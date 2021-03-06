import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController,AlertController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';
import { FollowOrderForPlcPage } from '../follow-order-for-plc/follow-order-for-plc';
import { TabsPage } from '../tabs/tabs';


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

  customPickerOptions:any;
  

  orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
  "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
"custom_date":"","date_id":"","statusTxt":"","orderDate":"","reorderBtn":false,
"diabledesign":false,"addressSign":true,"type_id":"","diabledRate":false,
"contorder":"","remark":"","contDate":"","disableRatebtn":true,
reorderDate:"",reorderPrice:"",hasfiles:0,serviceTitle:""};

  tostClass ;
  refresher;
  swipe=0;
  page=1;
  // page = 0;
  infiniteScroll;
  filterpage=1;
  scroll = 1;
  showLoading=true;
  myId;
  maxDate ; 


  constructor(public helper:HelperProvider, public service:LoginserviceProvider,
    public storage: Storage,  public alertCtrl: AlertController,
    public translate: TranslateService, public navCtrl: NavController,
     public navParams: NavParams,public toastCtrl: ToastController) {

      this.accessToken = localStorage.getItem('user_token');

      this.langDirection = this.helper.lang_direction;

      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.maxDate  = new Date().toISOString().split('T')[0];
      console.log("this.maxDate",this.maxDate);
      
      console.log("langdir:",this.langDirection);
      this.translate.use(this.helper.currentLang);

      this.storage.get("user_info").then(
        (data) => {
            this.myId = data.id;
            console.log("myId",this.myId);
        });  



      //ayaaaaaaaaaaaaaaaaa
      this.customPickerOptions = {
        buttons: [{
          text: 'يوم',
          handler: () => {
            return false;
          }      
        }, {
          text: 'شهر',
          handler: () => {
            return false;
          }
        },{
          text: 'سنة',
          handler: () => {
            return false;
          }
        }]
      }

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

            console.log("ordersData[j].status: "+ordersData[j].status);
            
            console.log("ratings length",ordersData[j].ratings.length);
              for(var r=0; r < ordersData[j].ratings.length; r++)
              { console.log("ordersData[j].ratings[r].user_id",ordersData[j].ratings[r].user_id,"orderID",ordersData[j].id);
              
                if(this.myId == ordersData[j].ratings[r].user_id)
                {
                  this.orderobject.rate = ordersData[j].ratings[r].rate;
                  console.log("object after rate",this.orderobject);
                }
                  
                // else
                //   this.orderobject.rate = "";

              }
              console.log("object after rate2",this.orderobject);

            
            //ayaaaaaaaa
            this.orderobject.hasfiles = ordersData[j].hasfiles; 
            console.log("hasFiles ",this.orderobject.hasfiles);


            if(ordersData[j].status == "10" ) //canceled by doctor 0, || ordersData[j].status == "3"
            {  
              ordersData[j].color = "red";
              ordersData[j].rated = "1";
            }
            else if(ordersData[j].status == "5") //finished
              ordersData[j].color="grey";
            
            if(ordersData[j].is_reorder == "1")  // is_reorder,reorder
              ordersData[j].color = "green";
            
            // if(ordersData[j].rated == "0")
            //   ordersData[j].color = "yellow";

            if(ordersData[j].status == "4" || ordersData[j].status == "11") //ordersData[j].status == "0" ||
            {
              ordersData[j].statusTxt = "ملغي" ;
              ordersData[j].color = "red";
              ordersData[j].rated = "1";
            }
            // else if (ordersData[j].status == "10" || ordersData[j].status == "11")
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
            else if(ordersData[j].status == "2" || ordersData[j].status == "8" || ordersData[j].status == "7" || ordersData[j].status == "12" || ordersData[j].status == "13"){
              ordersData[j].statusTxt = "قيد التنفيذ";
              ordersData[j].color = "green";
            }

            //ayaaaaaaaa
            //order accepted from admin
            else if (ordersData[j].status == "16") { 
              // ordersData[j].statusTxt= " متابعة " + ordersData[j].entity_service_Name;
              ordersData[j].statusTxt= "متابعة";
              ordersData[j].color = "green";

              this.orderobject.serviceTitle = ordersData[j].entity_service_Name;
            }
            //rejected from admin
            else if (ordersData[j].status == "17")
            { 
              this.orderobject.name = "طلب خدمة تمريض";
              ordersData[j].statusTxt ="مرفوض" ;
              ordersData[j].color = "red";
            } 
            //canceled by admin
            else if (ordersData[j].status == "18")
            { 
              // this.orderobject.name = "طلب خدمة تمريض";
              ordersData[j].statusTxt ="ملغي" ;
              ordersData[j].color = "red";
              ordersData[j].rated = "1";
            }  
            ////////
     
            if(ordersData[j].status == "8" || ordersData[j].status == "5" || ordersData[j].status =="6" || ordersData[j].status == "7" || ordersData[j].status == "16")
              this.orderobject.disableRatebtn = false;
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
              //this.orderobject.rate = serviceProfile.rate;
              // this.orderobject.rate = ordersData[j].ratedvalue;
              console.log("ratings length",ordersData[j].ratings.length);
              for(var r=0; r < ordersData[j].ratings.length; r++)
              { console.log("ordersData[j].ratings[r].user_id",ordersData[j].ratings[r].user_id,"orderID",ordersData[j].id);
              
                if(this.myId == ordersData[j].ratings[r].user_id)
                {
                  this.orderobject.rate = ordersData[j].ratings[r].rate;
                  console.log("object after rate",this.orderobject);
                }
                  
                // else
                //   this.orderobject.rate = "";

              }
              console.log("object after rate2",this.orderobject);
              // if(ordersData[j].ratings[0])
              //   this.orderobject.rate = ordersData[j].ratings[0].rate;
              
              //ayaaa
              if(ordersData[j].service_id && (ordersData[j].service_id == "3" || ordersData[j].service_id == "5"))
              {
                this.orderobject.diabledesign = true;
                this.orderobject.addressSign = false;
                this.orderobject.diabledRate = false;
               // this.orderobject.specialization = serviceProfile.entity.address;
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

              if( ordersData[j].is_reorder == "1" && ordersData[j].reorder_done == "0")
                this.orderobject.reorder = "1";

                // if( ordersData[j].reorderstatus == "4" )
                // this.orderobject.reorder = "0";

              // this.orderobject.reorder = ordersData[j].reorder;
              this.orderobject.contorder = ordersData[j].contorder;
              

              

              if (ordersData[j].status == "12")
                this.orderobject.contorder = "1";
              else if(ordersData[j].status == "4" || ordersData[j].status == "13" || ordersData[j].status == "3" || ordersData.status == "11")
                this.orderobject.contorder = "0";
              else 
                this.orderobject.contorder = "0";
              
              

              this.orderobject.rated = ordersData[j].rated;
              this.orderobject.remark = ordersData[j].remark;
              
              this.orderobject.orderId = ordersData[j].id;
              this.orderobject.order_status = ordersData[j].status;
              this.orderobject.statusTxt = ordersData[j].statusTxt;
              
              // if(ordersData[j].status == "0"){
              //   this.orderobject.statusTxt = "قيد التنفيذ";
              //   this.orderobject.color = "green";
              // }
              
              if(ordersData[j].status == "0"){
                this.orderobject.statusTxt = "تم الإرسال";
                this.orderobject.color = "green";
                this.orderobject.rated  = "1";
              }
              if(ordersData[j].status == "3"){
                this.orderobject.statusTxt = "لا يوجد استجابة";
                this.orderobject.color = "red";
                this.orderobject.rated  = "1";
              }

              //.split(" ")[0]
              this.orderobject.orderDate = ordersData[j].created_at_new;
              
              if(ordersData[j].date){
                console.log("J : ",j,"ordersData[j].date : ",ordersData[j].date)
                this.orderobject.contDate = ordersData[j].date;
              }
             
              // console.log("ordersData[j].date ",ordersData[j].date);

              // if(ordersData[j].reorder == "1")
              if(ordersData[j].is_reorder == "1" || ordersData[j].contorder == "1")
              {
                console.log("ordersData[j].date ",ordersData[j].date);
                console.log("order date only",ordersData[j].date.split(" ")[0]);
                
                console.log("today",new Date().toISOString().split('T')[0]);
                
                this.orderobject.reorderDate =  ordersData[j].date;
                console.log("ordersData[j]id:",ordersData[j].id);
                console.log("ordersData[j].service_profile",ordersData[j].service_profile);
                //console.log(".doctor.price",ordersData[j].service_profile.doctor.price);
                if(ordersData[j].service_profile.service_id == "2")
                  this.orderobject.reorderPrice = ordersData[j].service_profile.doctor.price;
                else
                this.orderobject.reorderPrice="";
                
                if(new Date().toISOString().split('T')[0] == ordersData[j].date.split(" ")[0] ){
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
              console.log("id",this.orderobject.orderId,"item.reorder",this.orderobject.reorder); 
              

              this.data.push(this.orderobject);

              this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
                  "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
                  "custom_date":"","date_id":"","statusTxt":"","orderDate":"","reorderBtn":false,
                  "diabledesign":false,"addressSign":true,"type_id":"","diabledRate" :false,
                  "contorder":"","remark":"","contDate":"","disableRatebtn":true,
                  reorderDate:"",reorderPrice:"",hasfiles:0,serviceTitle:""};
          
                    
            }
            else{
              console.log("else no service profile","orderID",ordersData[j].id);
              this.orderobject.diabledesign = true;
              this.orderobject.addressSign = true;
              this.orderobject.diabledRate = true;

              this.orderobject.orderId = ordersData[j].id;
              
              if(ordersData[j].status == "3")
                this.orderobject.name = "لا يوجد استجابه"; //تم رفض الطلب
              else if (ordersData[j].status == "0")
                this.orderobject.name = "تم إرسال الطلب";
              else if (ordersData[j].status == "10")
                this.orderobject.name = "مرفوض";
              else if (ordersData[j].status == "4")
                this.orderobject.name = "ملغى";

              ////ayaaaaaaaaaaa
              //pending from admin
              else if (ordersData[j].status == "15")
              { 
                this.orderobject.name = "طلب خدمة تمريض";
                this.orderobject.statusTxt="في انتظار موافقة الأدمن";
                this.orderobject.color = "orange";
              }
              //rejected from admin
              else if (ordersData[j].status == "17")
              { 
                this.orderobject.name = "طلب خدمة تمريض";
                this.orderobject.statusTxt ="مرفوض" ;
                this.orderobject.color = "red";
              } 
              //canceled by admin
              else if (ordersData[j].status == "18")
              { 
                this.orderobject.name = "طلب خدمة تمريض";
                this.orderobject.statusTxt ="ملغي" ;
                this.orderobject.color = "red";
              }         
              //////////////////////
                
              this.orderobject.profile_pic = "assets/imgs/default-avatar.png";
              this.orderobject.orderDate = ordersData[j].created_at_new; //.split(" ")[0]
              this.data.push(this.orderobject);
              console.log("ordres data",this.data);
              this.orderobject={"orderId":"","order_status":"","color":"","reorder":"","rated":"",
              "name":"","specialization":"","profile_pic":"","rate":"","doctor_id":"",
              "custom_date":"","date_id":"","statusTxt":"","orderDate":"","reorderBtn":false,
              "diabledesign":false ,"addressSign":true,"type_id":"","diabledRate":false,
              "contorder":"","remark":"","contDate":"","disableRatebtn":true,
              reorderDate:"",reorderPrice:"",hasfiles:0,serviceTitle:""};
      
           
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
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;


    this.accessToken = localStorage.getItem('user_token');

    if(this.refresher)
      this.showLoading = true;
    else
      this.showLoading = false;
          // this.showLoading = false;

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
    // });
  }
  getOrders(){
    
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
    this.accessToken = localStorage.getItem('user_token');
    
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
  //  });


  }

  refreshFilterOrders(){
    
    if(this.refresher)
      this.showLoading = true;
    else
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
    
    if(! this.from)
      this.presentToast(this.translate.instant("enterfrom"));
    else{
      var date1 = new Date(this.to);
      var date2 = new Date(this.from);
    
      if(date2 > date1)
        this.presentToast(this.translate.instant("fromGreaterThanTo"));
      else
        this.respFromFilterOrders();
    }
    
      


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
    console.log("will enter get orders");
    this.helper.view = "OrderhistoryPage";
    this.cancelTxt = this.translate.instant("canceltxt");
    this.doneTxt = this.translate.instant("doneTxt");
    this.to="";
    this.from="";
    this.data=[];
    this.page=1;
    // this.page=0;
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

    //item.order_status == "0"||

    //ayaaa
if(item.order_status == "2" || item.order_status=="8" || item.order_status =="7" || item.order_status =="13" ||item.order_status =="12" || item.order_status =="16" || item.order_status =="18")
{
  // this.navCtrl.setRoot('follow-order',{
  //   data:item
  // });
if(item.type_id == "1" || item.type_id == "2" || item.type_id == "3" ||  item.type_id == "5"  )
{
  this.helper.type_id  = item.type_id;
  this.navCtrl.push(FollowOrderForPlcPage,
  {data2:
    {"orderId":item.orderId, 
      "doctorId":item.doctor_id,
      "order_status":item.order_status
    }
  });


}else{
  this.navCtrl.push('follow-order',
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
  rateagain(item,ev){

    // ayaaaaaaa
    ev.stopPropagation();
    ///////


    console.log("item from rate function ",item);
    if(item.type_id == "1" || item.type_id == "2" || item.type_id == "3" || item.type_id == "5")
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
   // this.presentConfirm(item);
    item.reorderBtn = true;
   //

    this.checkfund(item);
  }

  presentConfirm(item , msgStatus,money) {

    var msg = "";
    if(msgStatus == 0)
      msg= this.translate.instant("confirmReorderMsg")+"<br>"+"موعد الإعادة : "+item.reorderDate+"<br>"+" قيمة الإعادة: "+item.reorderPrice +" جنيه مصرى ";
    else if(msgStatus == 1)
      msg = this.translate.instant("confirmReorderMsg")+"<br>"+"موعد الإعادة : "+item.reorderDate+"<br>"+" قيمة الإعادة: "+item.reorderPrice +" جنيه مصرى "+"<br>"+"قيمة الغرامة: "+money+" جنيه مصرى ";
    let alert = this.alertCtrl.create({
      title: this.translate.instant("confirmReorder"),
      message: msg,
      buttons: [
      //   {
      //     text: "لاحقا",
      //    role: 'cancel',
      //    handler: () => {
      //      console.log("later btn handler")
         
      //    }

      //  },
        {
          text: this.translate.instant("disagree"),
           
          handler: () => {
            console.log('disagree clicked');
            item.reorderBtn = true;
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('confirm reorder agree clicked');
            if(! item.custom_date)
              item.custom_date="";
            this.service.reorder(item.orderId,item.custom_date,item.date_id,this.accessToken).subscribe(
              resp=>{
                console.log("reorder resp",resp);
                if(JSON.parse(JSON.stringify(resp)).running == "-1")
                {
                  this.presentToast( "لقد تم إرسال طلب إعادة الكشف بالفعل");
                }else{
                  this.helper.orderIdForUpdate = JSON.parse(JSON.stringify(resp)).OrderID;
                console.log("this.helper.orderIdForUpdate",this.helper.orderIdForUpdate);
                
                this.presentToast( this.translate.instant("sendReorder"));

                this.navCtrl.setRoot('remaining-time-to-accept',{orderId:JSON.parse(JSON.stringify(resp)).OrderID});

                }
                
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

contorder(item){
   console.log("item from contorder",item);
  this.presentContOrderConfirm(item);
  
}

presentContOrderConfirm(item) {
  if (!item.remark)
  item.remark = "";

  let alert = this.alertCtrl.create({
    title: this.translate.instant("contorder"),
    message: item.remark+"<br/>"+item.contDate+"<br>"+" هل تريد تأكيد الموعد؟",
    buttons: [
      {
        text: "لاحقا",
       role: 'cancel',
       handler: () => {
         console.log("later btn handler")
        

       }

     },
      {
        text:"رفض",
      
        handler: () => {
          console.log('confirm contorder disagree clicked');
          this.service.updateOrderStatusToCancel(item.orderId,this.accessToken).subscribe(
            resp=>{
              console.log("resp cancel contOrder",resp);
              if(JSON.parse(JSON.stringify(resp)).success){
                this.presentToast("تم الغاء الموعد");
                this.navCtrl.setRoot(TabsPage);
                // this.navCtrl.parent.select(2);

              }
               


            },err=>{
              console.log("err cancel contOrder",err);
            }
          );
        }
      },
      {
        text: this.translate.instant("agree"),
        handler: () => {
          console.log('confirm contorder agree clicked');
          this.service.updateOrderStatusToAgreeTime(item.orderId,this.accessToken).subscribe(
            resp=>{
              console.log("resp cancel contOrder",resp);
              if(JSON.parse(JSON.stringify(resp)).success)
                this.presentToast("تم تأكيد الموعد");
            },err=>{
              console.log("err cancel contOrder",err);
            }
          );
          
        }
      }
    ]
  });
  alert.present();
}



checkfund(item){
  this.accessToken = localStorage.getItem('user_token');
  this.service.getFund(this.accessToken).subscribe(
    resp=>{
      console.log("resp from getFund",resp);
      var pfunds = JSON.parse(JSON.stringify(resp)).data;
      
      if(pfunds.order_count == 0)
        this.presentConfirm(item,0,0);
      else if(pfunds.order_count>0 && pfunds.order_count<3)
        this.presentConfirm(item,1,pfunds.forfeit_patient);
      else if(pfunds.order_count >= 3)          
        this.fundStopAlert(item,pfunds.forfeit_patient);
      
    },err=>{
      console.log("err from getFund",err);
    });
}

fundStopAlert(item,money){
    let alert = this.alertCtrl.create({
      title:  this.translate.instant("confirmReorder"),
      message:"موعد الإعادة : "+item.reorderDate+"<br>"+" قيمة الإعادة: "+item.reorderPrice +" جنيه مصرى "+"<br>"+"قيمة الغرامة: "+money+" جنيه مصرى ",
      buttons: ["حسنا"
      ]
    });

    alert.present();
  
}

//ayaaaaaa
openReport(orderId) {
  this.navCtrl.push("ShowReportPage", {recievedItem : orderId});
}



}
