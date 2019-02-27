import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';


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
  constructor(public navCtrl: NavController,
    public helper: HelperProvider,
     public navParams: NavParams) {
    this.image = this.navParams.get('data');
    this.helper.view = "pop";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullscreenPage');
  }
  dismiss(){
    this.navCtrl.pop();
  }
  

}
