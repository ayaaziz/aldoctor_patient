import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';


@IonicPage({
  name:'centers'
})
@Component({
  selector: 'page-centers',
  templateUrl: 'centers.html',
})
export class CentersPage {

  langDirection="";
  specializations;
  specializations1=[];
  specializations2=[];


  hideElement=true;
  color="white";
  labelColor="grey";
  accessToken ;
  tostClass ;
  searchValue;
  showLoading=true;
  //helpersArr=[{phone:12,fabDir:"top"},{phone:34,fabDir:"top"},{phone:56,fabDir:"top"}];
  helpersArr=[];
top="right";
helpers2 = true;
helpers3 = true;
phone;
phone2;
phone3;

  constructor(public helper: HelperProvider,
    public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage, public srv : ProvidedServicesProvider,
    public service:LoginserviceProvider,public toastCtrl: ToastController,
    public translate: TranslateService) {

      this.langDirection = this.helper.lang_direction;
      console.log("lang ffrom centers",this.langDirection);
      
      this.accessToken = localStorage.getItem('user_token');


      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

        this.helper.view = "pop";
        
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad CentersPage');
    this.initializeHelper();
    this.initializeSpecializations();
    
  }

  ionViewWillEnter(){
    console.log("will enter");
    for(var j=0;j<this.specializations1.length;j++){
      this.specializations1[j].spClass = "spUnselceted";
      this.specializations1[j].status = '0';
      
    }
    for(var j=0;j<this.specializations2.length;j++){
      this.specializations2[j].spClass = "spUnselceted";
      this.specializations2[j].status = '0';
      
    }
  }
  initializeHelper(){
    this.service.getuserProfile(this.accessToken).subscribe(
      resp=>{
        console.log("resp from getuserProfile ",resp);
        console.log("city_id",JSON.parse(JSON.stringify(resp)).extraInfo.city_id);
        this.service.getHelperTelephones(JSON.parse(JSON.stringify(resp)).extraInfo.city_id,this.accessToken).subscribe(
          resp=>{
            console.log("resp from getHelperTelephones",resp);
            this.helpersArr = JSON.parse(JSON.stringify(resp));
      
      
             //top bottom right left 
          if(this.helpersArr.length == 1)
          {
            this.helpersArr[0].fabDir="right";
            this.phone = this.helpersArr[0].value;
          }
          else if (this.helpersArr.length == 2)
          {
            this.helpersArr[0].fabDir="right";
            this.helpersArr[1].fabDir="left ";
            this.helpers2 = false;
            this.helpers3 = true;
            this.phone = this.helpersArr[0].value;
            this.phone2 = this.helpersArr[1].value;
      
          }
          else if (this.helpersArr.length == 3)
          {
            this.helpersArr[0].fabDir="right";
            this.helpersArr[1].fabDir="left ";
            this.helpersArr[2].fabDir="top";
            this.helpers2 = false;
            this.helpers3 = false;
            this.phone = this.helpersArr[0].value;
            this.phone2 = this.helpersArr[1].value;
            this.phone3 = this.helpersArr[2].value;
          }else{
            this.helpersArr[0].fabDir="right";
            this.helpersArr[1].fabDir="left ";
            this.helpersArr[2].fabDir="top";
            this.helpers2 = false;
            this.helpers3 = false;
            this.phone = this.helpersArr[0].value;
            this.phone2 = this.helpersArr[1].value;
            this.phone3 = this.helpersArr[2].value;
          }
      
          },
          err=>{
            console.log("errfrom getHelperTelephones",err);
          });
   
          
      }
      ,err=>{
        console.log("can't getuserProfile ",err);
      });
    
  }
  initializeSpecializations() {
  
 
  //   this.specializations = [
  //   {"name":"specialization1","image":""},
  //   {"name":"specialization2","image":""},
  //   {"name":"specialization3","image":""},
  //   {"name":"specialization4","image":""},
  //   {"name":"specialization5","image":""},
  //   {"name":"specialization6","image":""}];
  //   this.specializations1=[   
  //      {"value":"دوبلر","status":'0',"image":"assets/icon/baby.png","image_selected":"assets/icon/baby2.png"},
  //   {"value":"اكس راي","status":'0',"image":"assets/icon/premolar1.png","image_selected":"assets/icon/premolar2.png"},
  //   {"value":"ايكو","status":'0',"image":"assets/icon/brain.png","image_selected":"assets/icon/brain2.png"}
  //   //,{"value":"باطنه وقلب","status":'0',"image":"assets/icon/heart.png","image_selected":"assets/icon/heart2.png"}
  // ];
  //   this.specializations2=[{"value":"سونار","status":'0',"image":"assets/icon/ear1.png","image_selected":"assets/icon/ear2.png"},
  //   {"value":"رسم مخ","status":'0',"image":"assets/icon/pregnancy1.png","image_selected":"assets/icon/pregnancy2.png"},
  //   {"value":"الكل","status":'0',"image":"assets/icon/science1.png","image_selected":"assets/icon/science2.png"}
  //   //,{"name":"كلى","status":'0',"image":"assets/icon/kidneys1.png","image_selected":"assets/icon/kidneys2.png"}
  // ];
   
  

    
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;
this.accessToken = localStorage.getItem('user_token');

      this.showLoading = false;
      
      this.srv.getXrayCenters(this.accessToken).subscribe(
        resp=>{
      
          this.showLoading = true;
      
          console.log("getXrayCenters resp: ",resp);
          var specializationData = JSON.parse(JSON.stringify(resp));
          this.specializations1 = [];
          this.specializations2 = [];
          for(var i=0;i<(specializationData.length/2);i++){
    
            specializationData[i].spClass ="spUnselceted";
            this.specializations1.push(specializationData[i]);
          }
    
          for(var j=Math.ceil(specializationData.length/2);j<specializationData.length;j++){
    
            specializationData[j].spClass ="spUnselceted";
            this.specializations2.push(specializationData[j]);
            
          }
         
          // console.log("sp1 ",this.specializations1);
          // console.log("sp2 ",this.specializations2);

          // if(this.specializations1.length == this.specializations2.length)
          // {
          //   this.specializations2.push({id:0
          //     ,image:"http://aldoctor-app.com/aldoctortest/public/images/specialities/etc1.png"
          //     ,image_selected:"http://aldoctor-app.com/aldoctortest/public/images/specialities/etc2.png"
          //     ,value:"أخري",
          //     spClass:"spUnselceted"});
          // }else if (this.specializations1.length > this.specializations2.length)        
          // {
          //   this.specializations2.push({id:0
          //     ,image:"http://aldoctor-app.com/aldoctortest/public/images/specialities/etc1.png"
          //     ,image_selected:"http://aldoctor-app.com/aldoctortest/public/images/specialities/etc2.png"
          //     ,value:"أخري",
          //     spClass:"spUnselceted"});
          // }else {
          //   this.specializations1.push({id:0
          //     ,image:"http://aldoctor-app.com/aldoctortest/public/images/specialities/etc1.png"
          //     ,image_selected:"http://aldoctor-app.com/aldoctortest/public/images/specialities/etc2.png"
          //     ,value:"أخري",
          //     spClass:"spUnselceted"});
          // }
    

              console.log("sp1 ",this.specializations1);
          console.log("sp2 ",this.specializations2);

          
          for(var j=0;j<this.specializations1.length;j++){
            this.specializations1[j].status = '0';
          }
          for(var j=0;j<this.specializations2.length;j++){
            this.specializations2[j].status = '0';
          }

        },
        err=>{
          this.showLoading = true;
          console.log("getSpecializations error: ",err);
          this.presentToast(this.translate.instant("serverError"));
        }
      );
    // });

   
  }

  
  getItems(ev) {
    
    
    
    var val = ev.target.value;
this.searchValue = val;
console.log("sp item search val ",val);

    if (val && val.trim() != '') {
      val = this.textArabicNumbersReplacment(val);
      console.log("search val after replacement",val);
      
      this.specializations1 = this.specializations1.filter((item) => {
        return (this.textArabicNumbersReplacment(item.value).toLowerCase().indexOf(val.toLowerCase()) > -1); //item.value.toLowerCase().indexOf(val.toLowerCase()
      });
      this.specializations2 = this.specializations2.filter((item)=>{
        return (this.textArabicNumbersReplacment(item.value).toLowerCase().indexOf(val.toLowerCase()) > -1); //item.value.toLowerCase().indexOf(val.toLowerCase()
      });
      console.log("centers sp1",this.specializations1);
      console.log("centers sp2",this.specializations2);
      
      if(this.specializations2.length == 0 && this.specializations1.length == 0)
      {
        this.presentToast(this.translate.instant('noSearchResult'));
        this.initializeSpecializations();
      }
   
    }else{
      this.initializeSpecializations();
    }
  }

  dismiss(){
    this.navCtrl.pop();
  }

  chooseSp(ev,i,item){
    console.log("i = ",i);
    console.log("item",item);
    if(item.status == '0')
    {
      console.log("ev from status 0 ",ev);
    
      item.status = '1';
 
    }
    else if(item.status == '1')
    {
      console.log("ev from status 1 ",ev);
      item.status = '0';
      
      
    }
    item.spClass = "spSelected";
    console.log("item",item);
    console.log("event: ",ev);
    //this.navCtrl.push('order-doctor',{data:{id:item.id,sp:item.value}});
    console.log("item.id",item.id);
    this.navCtrl.push('order-service',{data:{
          type_id:2,
          lat:this.helper.lat,
          lng:this.helper.lon,
          center_id : item.id
        }});
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
  searchIcon(){
    if( !this.searchValue )
      this.presentToast(this.translate.instant('enterSearchValForCenters'));
  }
  
  textArabicNumbersReplacment(strText) {
    // var strTextFiltered = strText.Trim().replace(" ", "");
   console.log("strText",strText);
    // var strTextFiltered = strText.trim();
     var strTextFiltered = strText;
    //
    // strTextFiltered = strTextFiltered.replace('ي', 'ى');
    strTextFiltered = strTextFiltered.replace(/[\ي]/g, 'ى');
    // strTextFiltered = strTextFiltered.replace('ئ', 'ى');
    strTextFiltered = strTextFiltered.replace(/[\ئ]/g, 'ى');
    //
    // strTextFiltered = strTextFiltered.replace('أ', 'ا');
    strTextFiltered = strTextFiltered.replace(/[\أ]/g, 'ا');
    // strTextFiltered = strTextFiltered.replace('إ', 'ا');
    strTextFiltered = strTextFiltered.replace(/[\إ]/g, 'ا');
    // strTextFiltered = strTextFiltered.replace('آ', 'ا');
    strTextFiltered = strTextFiltered.replace(/[\آ]/g, 'ا');
    // strTextFiltered = strTextFiltered.replace('ء', 'ا');
    strTextFiltered = strTextFiltered.replace(/[\ء]/g, 'ا');
    //كاشيده
    strTextFiltered = strTextFiltered.replace(/[\u0640]/g, '');
    // التنوين  Unicode Position              
    strTextFiltered = strTextFiltered.replace(/[\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652]/g, '');
    // چ
    strTextFiltered = strTextFiltered.replace(/[\u0686]/g, 'ج');
    // ڤ
    strTextFiltered = strTextFiltered.replace(/[\u06A4]/g, 'ف');
    //                
    // strTextFiltered = strTextFiltered.replace('ة', 'ه');
    strTextFiltered = strTextFiltered.replace(/[\ة]/g, 'ه');
    // strTextFiltered = strTextFiltered.replace('ؤ', 'و');
    strTextFiltered = strTextFiltered.replace(/[\ؤ]/g, 'و');
    //
    strTextFiltered = strTextFiltered.replace(/[\٩]/g, '9');
    strTextFiltered = strTextFiltered.replace(/[\٨]/g, '8');
    strTextFiltered = strTextFiltered.replace(/[\٧]/g, '7');
    strTextFiltered = strTextFiltered.replace(/[\٦]/g, '6');
    strTextFiltered = strTextFiltered.replace(/[\٥]/g, '5');
    strTextFiltered = strTextFiltered.replace(/[\٤]/g, '4');
    strTextFiltered = strTextFiltered.replace(/[\٣]/g, '3');
    strTextFiltered = strTextFiltered.replace(/[\٢]/g, '2');
    strTextFiltered = strTextFiltered.replace(/[\١]/g, '1');
    strTextFiltered = strTextFiltered.replace(/[\٠]/g, '0');
    //
    console.log("strtxt after replacement",strTextFiltered);
    return strTextFiltered;
    //
  }


}
