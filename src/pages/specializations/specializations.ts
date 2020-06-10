import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController ,ModalController} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Storage } from '@ionic/storage';

import { TranslateService } from '@ngx-translate/core';



@IonicPage(
  {
    name:'specializations-page'
  }
)
@Component({
  selector: 'page-specializations',
  templateUrl: 'specializations.html',
})
export class SpecializationsPage {

  @ViewChild('i') simage1;
  // @ViewChild('image2') simage2;
  specializations;
  specializations1=[];
  specializations2=[];

  langDirection;
  hideElement=true;
  color="white";
  labelColor="grey";
  accessToken ;
  tostClass ;
  searchValue;
  showLoading=true;
  helpersArr=[];
  helpers2 = true;
  helpers3 = true;
  phone;
  phone2;
  phone3;
  refresher;

  specialityCities = [];
  currentCityId;
  cities_service = [];

  constructor(public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams,public storage: Storage,
     public service:LoginserviceProvider,public toastCtrl: ToastController,
     public translate: TranslateService,public modalCtrl: ModalController
    ) {

      this.accessToken = localStorage.getItem('user_token');

      this.langDirection = this.helper.lang_direction;
      this.helper.view = "pop";
      

      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      this.currentCityId = this.helper.city_id;
      console.log("this.currentCityId****** "+this.currentCityId);
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpecializationsPage');
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
  initializeSpecializations() {
    // this.specializations = [
    // {"name":"specialization1","image":""},
    // {"name":"specialization2","image":""},
    // {"name":"specialization3","image":""},
    // {"name":"specialization4","image":""},
    // {"name":"specialization5","image":""},
    // {"name":"specialization6","image":""}];
    // this.specializations1=[   
    //    {"name":"اطفال","status":'0',"image":"assets/icon/baby.png","image2":"assets/icon/baby2.png"},
    // {"name":"جراحات الفم","status":'0',"image":"assets/icon/premolar1.png","image2":"assets/icon/premolar2.png"},
    // {"name":"مخ واعصاب","status":'0',"image":"assets/icon/brain.png","image2":"assets/icon/brain2.png"},
    // {"name":"باطنه وقلب","status":'0',"image":"assets/icon/heart.png","image2":"assets/icon/heart2.png"}];
    // this.specializations2=[{"name":"انف واذن","status":'0',"image":"assets/icon/ear1.png","image2":"assets/icon/ear2.png"},
    // {"name":"نساء وتوليد","status":'0',"image":"assets/icon/pregnancy1.png","image2":"assets/icon/pregnancy2.png"},
    // {"name":"تغذيه","status":'0',"image":"assets/icon/science1.png","image2":"assets/icon/science2.png"},
    // {"name":"كلى","status":'0',"image":"assets/icon/kidneys1.png","image2":"assets/icon/kidneys2.png"}];
   

    // var arr1 = [10,20,30];
    // console.log("lenght of arr1",arr1.length);
    // console.log("lenght of arr1/2",arr1.length/2);
    // for(var i=0 ;i<arr1.length;i++ )
    // {
    //   console.log("item ",arr1[i]);
    // }
    // for(var j=0;j<arr1.length/2;j++)
    // {
    //   console.log("item /2",arr1[j]);
    // }
    // this.storage.get("access_token").then(data=>{
    //   this.accessToken = data;

    this.accessToken = localStorage.getItem('user_token');
    
      this.showLoading = false;
      

      this.service.getSpecializations(this.accessToken).subscribe(
        resp=>{
      
          this.showLoading = true;
      
          console.log("getSpecializations resp: ",resp);
          var specializationData = JSON.parse(JSON.stringify(resp));

          // //ayaaaaaa
          // for(var x = 0; x < specializationData.length -1; x++) {
          //   // specializationData[x].cities_service = JSON.parse(specializationData[x].cities_service);

          //   //cities array
          //   // this.cities_service = JSON.parse(specializationData[x].cities_service);

          //   console.log("specializationData[x].cities_service "+specializationData[x].cities_service);

          

            
          // }
          // ////////


          this.specializations1 = [];
          this.specializations2 = [];
          for(var i=0;i<(specializationData.length/2);i++) {
            specializationData[i].spClass ="spUnselceted";


            //ayaaaaaaaaaa
            if(this.checkIfServiceInZone(JSON.parse(specializationData[i].cities_service))) {
              specializationData[i].isInZone = true;
            }

            this.specializations1.push(specializationData[i]);
          }
      
          for(var j=Math.ceil(specializationData.length/2);j<specializationData.length;j++){
            specializationData[j].spClass ="spUnselceted";


            //ayaaaaaaaaaa
            if(this.checkIfServiceInZone(JSON.parse(specializationData[j].cities_service))) {
              specializationData[j].isInZone = true;
            }

            this.specializations2.push(specializationData[j]); 
          }

                      
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

  //ayaaaaaaaa
  checkIfServiceInZone(serviceCitiesArr) {
  return serviceCitiesArr.find(cityId => {
      return cityId == this.helper.city_id
    })
  }

  
  getItems(ev) {
    
    // this.initializeSpecializations();
    
    var val = ev.target.value;
this.searchValue = val;
console.log("sp item search val ",val);

    if (val && val.trim() != '') {
      val = this.textArabicNumbersReplacment(val);
      this.specializations1 = this.specializations1.filter((item) => {
        return (this.textArabicNumbersReplacment(item.value).toLowerCase().indexOf(val.toLowerCase()) > -1) ;//(item.value.toLowerCase().indexOf(val.toLowerCase()) > -1)
      });
      this.specializations2 = this.specializations2.filter((item)=>{
        return (this.textArabicNumbersReplacment(item.value).toLowerCase().indexOf(val.toLowerCase()) > -1);//(item.value.toLowerCase().indexOf(val.toLowerCase()) > -1)
      });
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
    this.navCtrl.push('order-doctor',{data:{id:item.id,sp:item.value,specialization_id:item.id}});
    // ev.target.style.color="white";
    // ev.target.style.background-color="#016a38";
    // console.log("event: ",ev.target);
    // ev.target.className +=" x";
    // this.hideElement=false;
    // this.color="#016a38";
    // this.labelColor="white";
    // console.log("simage1" ,this.simage1);
    //console.log("simage2" ,this.simage2);
    // this.simage1.nativeElement.src="assets/icon/science2.png";
    //this.simage2.nativeElement.attributes.style.nodeValue="width:60px;height:60px;display:inherit";
    
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
      this.presentToast(this.translate.instant('enterSearchVal'));
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

  openModal(){
  
    var modalPage = this.modalCtrl.create('ModalPage',{from:"specialization"});
    modalPage.present();
  }
  
  doRefresh(ev){
    console.log("refresh",ev);
    this.refresher = ev;
    // if(this.refresher){
      this.refresher.complete();
    // }
    this.initializeSpecializations();

  }

}
