import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';

import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  accessToken;
  helpersArr=[];
  from
  title

  constructor(public viewCtrl : ViewController,public service:LoginserviceProvider,
    public navCtrl: NavController, public navParams: NavParams,
    public helper: HelperProvider) {
      
      this.helper.view = "pop";
      this.accessToken = localStorage.getItem('user_token');

      this.from = this.navParams.get("from")
      console.log("modal from : ",this.from)
      // specialization , 
      if(this.from == "specialization")
        this.title = "استشارة طبية"
      else if(this.from == "medicalConsultant")
        this.title = "استشارة طبية"
      else if(this.from == "customerService")
        this.title = "خدمة عملاء"
        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
    if(this.from == "specialization")
      this.medicalConsultant();
      // this.initializeHelper();
    else if (this.from == "medicalConsultant")
      this.medicalConsultant();
    else if (this.from == "customerService")
      this.customerService()
  }

  closeModal(){
    this.viewCtrl.dismiss();  
  }

  medicalConsultant(){
    this.service.getuserProfile(this.accessToken).subscribe(
      resp=>{
        console.log("resp from getuserProfile ",resp);
        console.log("city_id",JSON.parse(JSON.stringify(resp)).extraInfo.city_id);
        this.service.getmedicalConsultants(JSON.parse(JSON.stringify(resp)).extraInfo.city_id,this.accessToken).subscribe(
          resp=>{
            console.log("resp from getHelperTelephones from modal",resp);
            this.helpersArr = JSON.parse(JSON.stringify(resp))[0].value.split(",");
            for(var i=0;i<this.helpersArr.length;i++){
              console.log("this.helpersArr[i].length : ",this.helpersArr[i].length)
              if(this.helpersArr[i].length == 11)
                this.helpersArr[i] = "2"+this.helpersArr[i]
              // else if(this.helpersArr[i].length == 12)
              // this.helpersArr[i] = "+"+this.helpersArr[i]
              if(this.helpersArr[i].length > 12){
                if(this.helpersArr[i].charAt(0) == "+")
                  this.helpersArr[i] = this.helpersArr[i].substr(1)
              }


            }
      
      
      
          },
          err=>{
            console.log("errfrom getHelperTelephones",err);
          });
   
          
      }
      ,err=>{
        console.log("can't getuserProfile ",err);
      });
   
  }

  customerService(){
    this.service.getuserProfile(this.accessToken).subscribe(
      resp=>{
        console.log("resp from getuserProfile ",resp);
        console.log("city_id",JSON.parse(JSON.stringify(resp)).extraInfo.city_id);
        this.service.getCustomerService(JSON.parse(JSON.stringify(resp)).extraInfo.city_id,this.accessToken).subscribe(
          resp=>{
            console.log("resp from getHelperTelephones from modal",resp);
            this.helpersArr = JSON.parse(JSON.stringify(resp))[0].value.split(",");
      
            for(var i=0;i<this.helpersArr.length;i++){
              console.log("this.helpersArr[i].length : ",this.helpersArr[i].length)
              if(this.helpersArr[i].length == 11)
                this.helpersArr[i] = "2"+this.helpersArr[i]

              if(this.helpersArr[i].length > 12){
                if(this.helpersArr[i].charAt(0) == "+")
                  this.helpersArr[i] = this.helpersArr[i].substr(1)
              }
                // else if(this.helpersArr[i].length == 12)
                // this.helpersArr[i] = "+"+this.helpersArr[i]

            }
      
          },
          err=>{
            console.log("errfrom getHelperTelephones",err);
          });
   
          
      }
      ,err=>{
        console.log("can't getuserProfile ",err);
      });
   
  }



  initializeHelper(){
    this.service.getuserProfile(this.accessToken).subscribe(
      resp=>{
        console.log("resp from getuserProfile ",resp);
        console.log("city_id",JSON.parse(JSON.stringify(resp)).extraInfo.city_id);
        this.service.getHelperTelephones(JSON.parse(JSON.stringify(resp)).extraInfo.city_id,this.accessToken).subscribe(
          resp=>{
            console.log("resp from getHelperTelephones from modal",resp);
            this.helpersArr = JSON.parse(JSON.stringify(resp))[0].value.split(",");
      
            for(var i=0;i<this.helpersArr.length;i++){
              console.log("this.helpersArr[i].length : ",this.helpersArr[i].length)
              if(this.helpersArr[i].length == 11)
                this.helpersArr[i] = "2"+this.helpersArr[i]
                // else if(this.helpersArr[i].length == 12)
                // this.helpersArr[i] = "+"+this.helpersArr[i]

                if(this.helpersArr[i].length > 12){
                  if(this.helpersArr[i].charAt(0) == "+")
                    this.helpersArr[i] = this.helpersArr[i].substr(1)
                }


            }
             //top bottom right left 
          // if(this.helpersArr.length == 1)
          // {
          //   this.helpersArr[0].fabDir="right";
          //   this.phone = this.helpersArr[0].value;
          // }
          // else if (this.helpersArr.length == 2)
          // {
          //   this.helpersArr[0].fabDir="right";
          //   this.helpersArr[1].fabDir="left ";
          //   this.helpers2 = false;
          //   this.helpers3 = true;
          //   this.phone = this.helpersArr[0].value;
          //   this.phone2 = this.helpersArr[1].value;
      
          // }
          // else if (this.helpersArr.length == 3)
          // {
          //   this.helpersArr[0].fabDir="right";
          //   this.helpersArr[1].fabDir="left ";
          //   this.helpersArr[2].fabDir="top";
          //   this.helpers2 = false;
          //   this.helpers3 = false;
          //   this.phone = this.helpersArr[0].value;
          //   this.phone2 = this.helpersArr[1].value;
          //   this.phone3 = this.helpersArr[2].value;
          // }else{
          //   this.helpersArr[0].fabDir="right";
          //   this.helpersArr[1].fabDir="left ";
          //   this.helpersArr[2].fabDir="top";
          //   this.helpers2 = false;
          //   this.helpers3 = false;
          //   this.phone = this.helpersArr[0].value;
          //   this.phone2 = this.helpersArr[1].value;
          //   this.phone3 = this.helpersArr[2].value;
          // }
      
          },
          err=>{
            console.log("errfrom getHelperTelephones",err);
          });
   
          
      }
      ,err=>{
        console.log("can't getuserProfile ",err);
      });
    
  }

}
