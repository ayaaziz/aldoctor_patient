import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage({
  name:'full-screen'
})
@Component({
  selector: 'page-fullscreen',
  templateUrl: 'fullscreen.html',
})
export class FullscreenPage {
  // image = "assets/imgs/empty-image.png";
  image;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.image = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullscreenPage');
  }
  dismiss(){
    this.navCtrl.pop();
  }
  

}
