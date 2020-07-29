import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

// @IonicPage({
//   name:'slider'
// })
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {

  @ViewChild(Slides) slides: Slides;

  search:string;
  // slides:any[];
  myslides = ["assets/imgs/1.jpg","assets/imgs/2.jpg","assets/imgs/3.jpg","assets/imgs/4.jpg"];
  // mySlideOptions = {
  //   pager:true
  // };

  image = "assets/imgs/1.png";
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("this.slide",this.slides);
    console.log('Current index is', currentIndex);
    
    this.slides.slideTo(currentIndex+1);
  }
 
  

  goToSlide() {
    // this.slides.slideTo(2, 500);
  }
  constructor(public storage: Storage, public navCtrl: NavController,
     public navParams: NavParams) {
      this.goToSlide();
    }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad SliderPage');
    this.image  = "assets/imgs/1.png";
    this.storage.set("slider",{
      "sliderAppeared":"1"
    }).then(data=>{
      console.log("set storage showSlider ",data);
      

    }).catch(data=>{
      console.log("catch storage showSlider",data);
    });

    
  }
  next(){
    this.slides.slideNext();
  }
  prev(){
    this.slides.slidePrev();
  }

  changeImage(img){
    console.log("vchangeImage(image): ",img);
    
    var num = parseInt(img.split("/")[2].split(".")[0])+1;
    console.log("num",num);
    if(num>=0 && num <=6)
      // this.image = "assets/imgs/"+num+".jpg";
      //ayaaaaaaa
      this.image = "assets/imgs/"+num+".png";

    else
      this.navCtrl.setRoot(LoginPage);
    console.log("this.image",this.image);
    
  }
}
