import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperProvider } from '../helper/helper';

@Injectable()
export class ProvidedServicesProvider {

  constructor(public helper:HelperProvider, public http: HttpClient) {
    console.log('Hello ProvidedServicesProvider Provider');
  }
  nearbyservices(page,type_id,centerId,lat,lon,access_token){

    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/nearby?service_id=3&type_id='+type_id+'&lat='+lat+'&lng='+lon+'&center_id='+centerId+'&city_id='+this.helper.city_id+'&page='+page;
    console.log("service request ",serviceUrl);
    return this.http.get(serviceUrl,{headers: headers });

  }
 
  searchServiceByName(page,searchName,type_id,access_token){
    //request
    var lat = this.helper.lat;
    var lon = this.helper.lon;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/nearby?service_id=3&type_id='+type_id+'&name='+searchName+'&lat='+lat+'&lng='+lon+'&city_id='+this.helper.city_id+'&page='+page;
    return this.http.get(serviceUrl,{headers: headers });
  
  }

  saveOrder(doctorsId ,images,files_ext,access_token,serviceNmber,centerId){
    let headers = new HttpHeaders();
    console.log("lat from service ",this.helper.lat);
    console.log("lon from service ",this.helper.lon);
    
    let userLocation = this.helper.lat + "," + this.helper.lon;

    let parameter = new HttpParams().set('doctor_id',doctorsId).
    set('extra',userLocation).set('files',images)
    .set('service_id','3').set('type_id',this.helper.type_id)
    .set('fiels_ext',files_ext).set('service_number',serviceNmber)
    .set('entity_service_id',centerId);
    
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/create';
    return this.http.post(serviceUrl,parameter,{headers: headers });

    
  }

  saveOrderForNursingServices(NursingType ,DayHours,MonthDays,PreferedTime,PreferedGender,DayNumbers,WeekDays,TotalPrice,access_token){
    let headers = new HttpHeaders();
    console.log("lat from service ",this.helper.lat);
    console.log("lon from service ",this.helper.lon);
    
    let userLocation = this.helper.lat + "," + this.helper.lon;

    let parameter = new HttpParams().set('doctor_id',"").set("DayNumbers",DayNumbers).set("WeekDays",WeekDays).set("TotalPrice",TotalPrice).
    set('extra',"").set('files',"").set("MonthDays",MonthDays).set("PreferedTime",PreferedTime).set("PreferedGender",PreferedGender)
    .set('service_id','5').set('type_id',this.helper.type_id).set("NursingType",NursingType).set("DayHours",DayHours)
    .set('fiels_ext',"").set('service_number',"")
    .set('entity_service_id',"");
    
    
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
  
  getnursingCenters(access_token){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/specialities-nursing';
    return this.http.get(serviceUrl,{headers: headers });
  }

  rateWords(type_id,access_token){
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  
    var serviceUrl;
    // if(type_id == "1")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharmacy-rate-criteriea';
    // else if (type_id == "2")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/center-rate-criteriea';
    // else if (type_id == "3")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-rate-criteriea';

      if(type_id == "1")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-pharmacy-rate-criteriea';
    else if (type_id == "3")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-center-rate-criteriea';
    else if (type_id == "2")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-xray-rate-criteriea';
    else if (type_id == "5")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-nursing-rate-criteriea';

      
    return this.http.get(serviceUrl,{headers: headers });
  }
  reteWordsComments(rateId,type_id,access_token){
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-rate-criteriea?rate='+rateId;
    var serviceUrl;
    // if(type_id == "1")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharmacy-rate-criteriea?rate='+rateId;
    // else if (type_id == "2")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/center-rate-criteriea?rate='+rateId;
    // else if (type_id == "3")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/xray-rate-criteriea?rate='+rateId;

    if(type_id == "1")
    serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-pharmacy-rate-criteriea?rate='+rateId;
  else if (type_id == "3")
    serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-center-rate-criteriea?rate='+rateId;
  else if (type_id == "2")
    serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-xray-rate-criteriea?rate='+rateId;
    else if (type_id == "5")
    serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-nursing-rate-criteriea?rate='+rateId;
  
    return this.http.get(serviceUrl,{headers: headers });
  }
  cancelreasons(type_id,access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
     
      // let serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-cancel-reasons?lang='+lang;
      var serviceUrl;
    // if(type_id == "1")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/pharma-cancel-reasons?lang='+lang;
    // else if (type_id == "2")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/t7alel-cancel-reasons?lang='+lang;
    // else if (type_id == "3")
    //   serviceUrl = this.helper.serviceUrl +'api/get/lkps/ashe3a-cancel-reasons?lang='+lang;

    
      if(type_id == "1")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-pharmacy-cancel-reasons?lang='+lang;
    else if (type_id == "3")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-center-cancel-reasons?lang='+lang;
    else if (type_id == "2")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-xray-cancel-reasons?lang='+lang;
      else if (type_id == "5")
      serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-nursing-cancel-reasons?lang='+lang;

    
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
updateOrderStatus(orderId,access_token,type){
  let headers = new HttpHeaders();
  let parameter = new HttpParams().set("order_id",orderId).set("status",'5').set('type',type); 
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl +'api/orders/update';
  return this.http.post(serviceUrl,parameter,{headers: headers });

}
getOrderDetails(id,access_token){
  
  let headers = new HttpHeaders();

  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
     
  let serviceUrl = this.helper.serviceUrl +'api/orders/get/'+id;

  return this.http.get(serviceUrl,{headers: headers });
}


getUserZone(lat , lng , access_token){
    
  let headers = new HttpHeaders();
  let parameter = new HttpParams().set('lat',lat)
  .set('lng',lng);
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl +'api/user/zone';
  return this.http.post(serviceUrl,parameter,{headers: headers });
  
}

 // /api/contact
 complains(text,access_token){
  let headers = new HttpHeaders();
  let parameter = new HttpParams().set('text',text);
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl +'api/contact';
  return this.http.post(serviceUrl,parameter,{headers: headers });
}

updateUserLocation(latLng,location,access_token){
  let headers = new HttpHeaders();
  let parameter = new HttpParams().set('address',location).set('location',latLng);
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl +'api/updateLocation';
  return this.http.post(serviceUrl,parameter,{headers: headers });
}

getaddress(lat,lng){
    
  var url = "https:maps.googleapis.com/maps/api/geocode/json?address="+lat+","+lng+"&key="+this.helper.key;
  console.log("google api url ",url);
  return this.http.get(url);
}


}
