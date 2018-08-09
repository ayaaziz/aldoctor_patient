import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TranslateService } from '@ngx-translate/core';



@IonicPage({
  name:'centers'
})
@Component({
  selector: 'page-centers',
  templateUrl: 'centers.html',
})
export class CentersPage {

  langDirection="";

  constructor(public helper: HelperProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.langDirection = this.helper.lang_direction;
      console.log("lang ffrom centers",this.langDirection);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CentersPage');
  }

}
