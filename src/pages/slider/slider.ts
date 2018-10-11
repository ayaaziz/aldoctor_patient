import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';


@IonicPage()
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SliderPage');
  }

}
