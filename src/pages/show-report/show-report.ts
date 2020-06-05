import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component({
  selector: 'page-show-report',
  templateUrl: 'show-report.html',
})
export class ShowReportPage {

  orderFiles;
  photos = [];
  files = [];
  accessToken;
  item;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public service:LoginserviceProvider,
              public helper:HelperProvider) {

      this.item = this.navParams.get('recievedItem');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowReportPage');

    //ayaaaaa
  this.accessToken = localStorage.getItem('user_login_token');
  this.service.getOrderDetails(this.item.orderId,this.accessToken).subscribe(
    resp=> {

      console.log("myorder*** "+JSON.stringify(resp));

      var myorder = JSON.parse(JSON.stringify(resp)).order;


      if(myorder.files.length > 0)
      {
        this.orderFiles = myorder.files;

        for(var i=0;i<this.orderFiles.length;i++) {

          if(this.orderFiles[i].type == 2) {

            let fileExt = this.orderFiles[i].path.split('.').pop();
            if(fileExt == "jpeg" || fileExt == "png" || fileExt == "jpg" || fileExt =="BMP" || fileExt == "gif") {
              this.photos.push({id:this.orderFiles[i].id,path:this.helper.serviceUrl+this.orderFiles[i].path});    
            } else {
              // let fileName = this.orderFiles[i].path.split('/').pop();
              // this.files.push({id:this.orderFiles[i].id,path:this.orderFiles[i].fileName});    
              this.files.push({id:this.orderFiles[i].id,path:this.helper.serviceUrl+this.orderFiles[i].path,fileName:this.orderFiles[i].fileName}); 
              console.log(this.files[0].path);   
            }
          }
        }
      }  
    },
    err=> {
      console.log("refresh",err);
    });
  }


  fullScreen(index){
    console.log("image clicked",index)
    this.navCtrl.push('full-screen',{data:this.photos[index].path});
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
