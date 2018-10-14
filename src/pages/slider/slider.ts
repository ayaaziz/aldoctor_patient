import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage({
  name:'slider'
})
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {

  @ViewChild(Slides) slides: Slides;

  search:string;
  // slides:any[];
  myslides = ["assets/imgs/avatar-ts-jessie.png","assets/imgs/default-avatar.png","assets/imgs/empty-image.png"];
  mySlideOptions = {
    pager:true
  };

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
  }

  constructor(public storage: Storage, public navCtrl: NavController,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad SliderPage');
    this.storage.set("user_info",{
      "showSlider":"1"
    }).then(data=>{
      console.log("set storage showSlider ",data);
      

    }).catch(data=>{
      console.log("catch storage showSlider",data);
    });

    
  }

}
