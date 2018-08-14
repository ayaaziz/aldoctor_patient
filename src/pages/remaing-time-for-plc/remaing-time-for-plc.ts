import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';

@IonicPage({
  name:'remaining-time-for-plc'
})
@Component({
  selector: 'page-remaing-time-for-plc',
  templateUrl: 'remaing-time-for-plc.html',
})
export class RemaingTimeForPlcPage {

  time;
  timer;
  notification;
  orderStatus;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider,public events: Events) {

     var data =  this.navParams.get('data');
     console.log("data from remaing time for plc",data);
     
     if(data == 1)
     {
       this.time = 120;

     }else if (data == 0){
       this.time = 45;
     }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemaingTimeForPlcPage');
    
    
    this.timer =setInterval(()=>{
      
      this.time--;
      if(this.time <= 0){
        console.log("timer off");
       clearTimeout(this.timer);
       this.navCtrl.setRoot('order-not-accepted');
       
      }   
    
  },1000);


  this.events.subscribe('status0', (data) => {
    console.log("status0",data);
    clearTimeout(this.timer);
    
    this.navCtrl.setRoot('order-not-accepted');
  });

  this.events.subscribe('status2', (data) => {
    console.log("status2",data);
    clearTimeout(this.timer);
    this.navCtrl.setRoot('follow-order',
    {data:
      { "orderId":data.orderId, 
        "doctorId":data.doctorId
      }
    });
  });

  
  
  
  }

}