import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController,Platform,AlertController} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { ProvidedServicesProvider } from '../../providers/provided-services/provided-services';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';



@IonicPage({
  name:'search-for-pharmacy'
})
@Component({
  selector: 'page-search-for-pharmacy',
  templateUrl: 'search-for-pharmacy.html',
  providers: [Diagnostic, LocationAccuracy]
})
export class SearchForPharmacyPage {

  @ViewChild('map') mapElement;
  map: any;
  lat=31.037933; 
  lng=31.381523;
  doctorsLoc=[{lat:31.205753,lng:29.924526},{lat:29.952654,lng:30.921919}];
  langDirection;
  type_id;

  btn;
  title;
  btn1;
  btn2;

  constructor(public service:ProvidedServicesProvider,public storage: Storage,
    public helper:HelperProvider, public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,public platform: Platform,
    public diagnostic: Diagnostic, public translate: TranslateService,
     private geolocation: Geolocation, public toastCtrl: ToastController,
     public navCtrl: NavController, public navParams: NavParams) {

      this.langDirection = this.helper.lang_direction;
      this.btn = this.navParams.get('data');
      console.log("btn txt ",this.btn);
      // this.title = this.translate.instant(this.btn.title);
      // this.btn1 = this.translate.instant(this.btn.btn1);
      // this.btn2 = this.translate.instant(this.btn.btn2);
      this.type_id = this.btn.type_id;
      console.log("btn txt ",this.btn);
      console.log("type_id = ",this.type_id);
      if(this.type_id == "1"){
        this.title = this.translate.instant("searchForPharmacy");
        this.btn1 = this.translate.instant("SearchByNearestPharmacies");
        this.btn2 = this.translate.instant("SearchBySpecificPharmacy");
      }else if(this.type_id == "2"){
        this.title = this.translate.instant("searchForLab");
        this.btn1 = this.translate.instant("SearchByNearestLab");
        this.btn2 = this.translate.instant("SearchBySpecificLab");
      }else if(this.type_id == "3"){
        this.title = this.translate.instant("searchForCenter");
        this.btn1 = this.translate.instant("SearchByNearestCenter");
        this.btn2 = this.translate.instant("SearchBySpecificCenter");
      }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchForPharmacyPage');
    this.test();
    this.initMap();
  }
  dismiss(){
    console.log("dismiss");
    this.navCtrl.setRoot(TabsPage);
  }
  test(){
    this.diagnostic.isGpsLocationEnabled().then(
      a=>{
        
        console.log("from gps opened resp",a);
        if(a)
        {
         
        this.getUserLocation();
        }
        else
        {
          this.presentConfirm();        
          
        }
      }
    ).catch(
      a=>{
        console.log("from gps opened err",a);
        this.presentToast("can't get location ");
        this.diagnostic.switchToLocationSettings();
      }
    );
      
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("accessLocation"),
      message: this.translate.instant("msgAccessLocation"),
      buttons: [
        {
          text: this.translate.instant("disagree"),
          role: 'cancel',
          handler: () => {
            console.log('disagree clicked');
          }
        },
        {
          text: this.translate.instant("agree"),
          handler: () => {
            console.log('agree clicked');
            this.diagnostic.switchToLocationSettings();
            this.getUserLocation();
          }
        }
      ]
    });
    alert.present();
  }
  
  accessToken;
  getUserLocation(){
    
      this.geolocation.getCurrentPosition().then((resp) => {
  
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        console.log("resp: ", resp);
        this.initMapwithUserLocation();
        this.storage.get("access_token").then(data=>{
          this.accessToken = data;
          this.helper.accessToken = this.accessToken;
          this.service.nearbyservices(this.type_id,this.lat,this.lng,this.accessToken).subscribe(
            resp =>{
              console.log("resp from nearby services: ",resp);
              var docsData = JSON.parse(JSON.stringify(resp)).result;
              console.log("res ",docsData,"lenght: ",docsData.lenght);
              this.doctorsLoc = [];
              for (let element in docsData) {
                console.log("element ",docsData[element]);
                if(docsData[element].location != null)
                  this.doctorsLoc.push( docsData[element].location);
  
               }
               console.log("doctorsLoc",this.doctorsLoc);
               this.initMapWithDoctorsLocation();
             
  
            },err=>{
              console.log("err from nearby doctors: ",err);
            }
          );
       
        });
  
        
      }).catch((error) => {
        console.log('Error getting location', error);
        this.initMap();
      
        
      });
  
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
  initMapwithUserLocation(){
  
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
  
    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      icon: { 
        url : 'assets/icon/location.png',
        size: new google.maps.Size(71, 71),
        scaledSize: new google.maps.Size(25, 25) 
      }
  
     
    });
  
    
  }
  initMapWithDoctorsLocation(){
  
    let latlng = new google.maps.LatLng(this.lat,this.lng);
    var mapOptions={
     center:latlng,
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP,
  
    };
    this.map=  new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      icon: { 
        url : 'assets/icon/location.png',
        size: new google.maps.Size(71, 71),
        scaledSize: new google.maps.Size(25, 25) 
      }
  
     
    });
  
  
    var markers, i;
  
    for (i = 0; i < this.doctorsLoc.length; i++) {  
      console.log("pin doctors om map",this.doctorsLoc);
  
      markers = new google.maps.Marker({
        position: new google.maps.LatLng(this.doctorsLoc[i].lat, this.doctorsLoc[i].lng),
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: { 
          url : 'assets/icon/location.png',
          size: new google.maps.Size(71, 71),
          scaledSize: new google.maps.Size(25, 25) 
         }
      });
    
    }
    
    
  
  }
  
   
  SearchBySpecificService(event){
    console.log("event from SearchBySpecificPharmacy",event);
    console.log("event from SearchBySpecificPharmacy",event.target.innerText);
    switch(event.target.innerText){
      case  this.translate.instant("SearchBySpecificPharmacy"):{
        this.navCtrl.push('order-specific-service',{
          data:{
            type_id:1,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }
      case  this.translate.instant("SearchBySpecificLab"):{
        this.navCtrl.push('order-specific-service',{
          data:{
            type_id:2,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }
      case  this.translate.instant("SearchBySpecificCenter"):{
        console.log("in case specific center")
        this.navCtrl.push('order-specific-service',{
          data:{
            type_id:3,
            lat:this.lat,
            lng:this.lng
          }
        });
        break;
      }
      case  this.translate.instant("SearchBySpecific..."):{
        
        break;
      }

    }
    
      
  
  }
  SearchByNearestService(event){
    console.log("event from SearchByNearestPharmacies",event);
    console.log("event from SearchByNearestPharmacies",event.target.innerText);
    console.log("center translate",this.translate.instant("SearchByNearestCenter"))
    switch(event.target.innerText){
      case  this.translate.instant("SearchByNearestPharmacies"):{
        this.navCtrl.push('order-service',{data:{
          type_id:1,
          lat:this.lat,
          lng:this.lng
        }});
        break;
      }
      case  this.translate.instant("SearchByNearestLab"):{
        this.navCtrl.push('order-service',{data:{
          type_id:2,
          lat:this.lat,
          lng:this.lng
        }});
        break;
      }
      case  this.translate.instant("SearchByNearestCenter"):{
        console.log("in case nearest center")
        this.navCtrl.push('order-service',{data:{
          type_id:3,
          lat:this.lat,
          lng:this.lng
        }});
        break;
      }
      case  this.translate.instant("SearchByNearest..."):{
        
        break;
      }

    }  
    
  
  }

    
    private presentToast(text) {
      let toast = this.toastCtrl.create({
        message: text,
        duration: 4000,
        position: 'bottom'
      });
      toast.present();
    }
  
  
}
