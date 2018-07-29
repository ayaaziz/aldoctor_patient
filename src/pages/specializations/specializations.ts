import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
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


  constructor(public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams,public storage: Storage,
     public service:LoginserviceProvider,public toastCtrl: ToastController,
     public translate: TranslateService
    ) {
      this.langDirection = this.helper.lang_direction;

      if(this.langDirection == "rtl")
        this.tostClass = "toastRight";
      else
        this.tostClass="toastLeft";

      // this.storage.get("access_token").then(data=>{
      //   this.accessToken = data;

      // });
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpecializationsPage');
    this.initializeSpecializations();
  }

  ionViewWillEnter(){
    console.log("will enter");
    for(var j=0;j<this.specializations1.length;j++){
      this.specializations1[j].status = '0';
    }
    for(var j=0;j<this.specializations2.length;j++){
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
    this.storage.get("access_token").then(data=>{
      this.accessToken = data;

      this.showLoading = false;
      
      this.service.getSpecializations(this.accessToken).subscribe(
        resp=>{
      
          this.showLoading = true;
      
          console.log("getSpecializations resp: ",resp);
          var specializationData = JSON.parse(JSON.stringify(resp));
          this.specializations1 = [];
          this.specializations2 = [];
          for(var i=0;i<specializationData.length/2;i++){
            this.specializations1.push(specializationData[i]);
          }
          for(var j=(specializationData.length/2);j<specializationData.length;j++){
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
    });

   
  }

  
  getItems(ev) {
    
    // this.initializeSpecializations();
    
    var val = ev.target.value;
this.searchValue = val;
console.log("sp item search val ",val);

    if (val && val.trim() != '') {
      this.specializations1 = this.specializations1.filter((item) => {
        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.specializations2 = this.specializations2.filter((item)=>{
        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
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
    console.log("item",item);
    console.log("event: ",ev);
    this.navCtrl.push('order-doctor',{data:{id:item.id,sp:item.value}});
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
}
