import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperProvider } from '../helper/helper';

@Injectable()
export class ProvidedServicesProvider {

  constructor(public helper:HelperProvider, public http: HttpClient) {
    console.log('Hello ProvidedServicesProvider Provider');
  }
  nearbyservices(type_id,centerId,lat,lon,access_token){

    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/nearby?service_id=3&type_id='+type_id+'&lat='+lat+'&lng='+lon+'&center_id='+centerId;
    console.log("service request ",serviceUrl);
    return this.http.get(serviceUrl,{headers: headers });

  }
 
  searchServiceByName(searchName,type_id,access_token){
    //request
    var lat = this.helper.lat;
    var lon = this.helper.lon;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/nearby?service_id=3&type_id='+type_id+'&name='+searchName+'&lat='+lat+'&lng='+lon;
    return this.http.get(serviceUrl,{headers: headers });
  
  }

  saveOrder(doctorsId ,images,files_ext,access_token,serviceNmber){
    let headers = new HttpHeaders();
    console.log("lat from service ",this.helper.lat);
    console.log("lon from service ",this.helper.lon);
    
    let userLocation = this.helper.lat + "," + this.helper.lon;

    let parameter = new HttpParams().set('doctor_id',doctorsId).
    set('extra',userLocation).set('files',images)
    .set('service_id','3').set('type_id',this.helper.type_id)
    .set('fiels_ext',files_ext).set('service_number',serviceNmber);
    
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/create';
    return this.http.post(serviceUrl,parameter,{headers: headers });

    
  }
  getXrayCenters(access_token){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/specialities-xray';
    return this.http.get(serviceUrl,{headers: headers });
  }
  
  rateWords(type_id,access_token){
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  
    var serviceUrl;
    if(type_id == "1")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharmacy-rate-criteriea';
    else if (type_id == "2")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/center-rate-criteriea';
    else if (type_id == "3")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-rate-criteriea';

    
    return this.http.get(serviceUrl,{headers: headers });
  }
  reteWordsComments(rateId,type_id,access_token){
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-rate-criteriea?rate='+rateId;
    var serviceUrl;
    if(type_id == "1")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharmacy-rate-criteriea?rate='+rateId;
    else if (type_id == "2")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/center-rate-criteriea?rate='+rateId;
    else if (type_id == "3")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-rate-criteriea?rate='+rateId;

    
    return this.http.get(serviceUrl,{headers: headers });
  }
  cancelreasons(type_id,access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
     
      // let serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-cancel-reasons?lang='+lang;
      var serviceUrl;
    if(type_id == "1")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharma-cancel-reasons?lang='+lang;
    else if (type_id == "2")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/t7alel-cancel-reasons?lang='+lang;
    else if (type_id == "3")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/ashe3a-cancel-reasons?lang='+lang;

      return this.http.get(serviceUrl,{headers: headers })
      
  }

editOrderToSendImages(orderId , images ,files_ext, access_token){
  
  let headers = new HttpHeaders();
  
  let parameter = new HttpParams().set('order_id',orderId)
  .set('files',images).set('fiels_ext',files_ext);
  
  
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl +'api/orders/updatefiles';
  return this.http.post(serviceUrl,parameter,{headers: headers });

}

}
