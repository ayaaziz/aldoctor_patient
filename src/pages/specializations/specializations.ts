import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';


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
  specializations1;
  specializations2;

  langDirection;
  hideElement=true;
  color="white";
  labelColor="grey";

  constructor(public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams) {
      this.langDirection = this.helper.lang_direction;
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
    this.specializations = [
    {"name":"specialization1","image":""},
    {"name":"specialization2","image":""},
    {"name":"specialization3","image":""},
    {"name":"specialization4","image":""},
    {"name":"specialization5","image":""},
    {"name":"specialization6","image":""}];
    this.specializations1=[   
       {"name":"اطفال","status":'0',"image":"assets/icon/baby.png","image2":"assets/icon/baby2.png"},
    {"name":"جراحات الفم","status":'0',"image":"assets/icon/premolar1.png","image2":"assets/icon/premolar2.png"},
    {"name":"مخ واعصاب","status":'0',"image":"assets/icon/brain.png","image2":"assets/icon/brain2.png"},
    {"name":"باطنه وقلب","status":'0',"image":"assets/icon/heart.png","image2":"assets/icon/heart2.png"}];
    this.specializations2=[{"name":"انف واذن","status":'0',"image":"assets/icon/ear1.png","image2":"assets/icon/ear2.png"},
    {"name":"نساء وتوليد","status":'0',"image":"assets/icon/pregnancy1.png","image2":"assets/icon/pregnancy2.png"},
    {"name":"تغذيه","status":'0',"image":"assets/icon/science1.png","image2":"assets/icon/science2.png"},
    {"name":"كلى","status":'0',"image":"assets/icon/kidneys1.png","image2":"assets/icon/kidneys2.png"}];
   

  }


  getItems(ev) {
    
    this.initializeSpecializations();
    
    var val = ev.target.value;

    
    if (val && val.trim() != '') {
      this.specializations = this.specializations.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  dismiss(){
    this.navCtrl.pop();
  }

  chooseSp(ev,i,item){
    console.log("i = ",i);
    console.log("item",item);
    if(item.status == '0')
      item.status = '1';
    else if(item.status == '1')
      item.status = '0';

    console.log("item",item);
    console.log("event: ",ev);
    this.navCtrl.push('order-doctor');
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
}
