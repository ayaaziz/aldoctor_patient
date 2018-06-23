import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

//import {GoogleMap} from '@ionic-native/google-maps';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';


@IonicPage({
  name:'follow-order'
})
@Component({
  selector: 'page-follow-order',
  templateUrl: 'follow-order.html',
})
export class FollowOrderPage {
  @ViewChild('map') mapElement;
  doctorData;
  doctorName;
  doctorSpecialization;
  doctorRate;
  OrderCost;
  map: any;
  langDirection;

  lat=31.037933; 
  lng=31.381523;

  constructor(public helper:HelperProvider,public navCtrl: NavController,
     public navParams: NavParams,public translate: TranslateService) {
       console.log("follow order");
    this.langDirection = this.helper.lang_direction;
    console.log("langdir: ",this.langDirection);
    this.translate.use(this.helper.currentLang);
    this.doctorData = this.navParams.get('data');
    console.log("data from follow order:",this.doctorData);
    this.doctorName = this.doctorData.name;
    this.doctorRate = this.doctorData.rate;
    this.doctorSpecialization = this.doctorData.specialization;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowOrderPage');
    this.initMap();
  }
  initMap(){
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP,

    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
   
  }
  cancelOrder(){
    this.navCtrl.push('cancel-order',{orderId:this.doctorData.orderId});

  }

}
