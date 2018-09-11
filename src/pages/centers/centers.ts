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
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad CentersPage');
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
      this.specializations1 = this.specializations1.filter((item) => {
        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.specializations2 = this.specializations2.filter((item)=>{
        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
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


}
