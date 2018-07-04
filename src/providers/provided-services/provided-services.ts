import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperProvider } from '../helper/helper';

@Injectable()
export class ProvidedServicesProvider {

  constructor(public helper:HelperProvider, public http: HttpClient) {
    console.log('Hello ProvidedServicesProvider Provider');
  }
  nearbyservices(type_id,lat,lon,access_token){

    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/nearby?service_id=3&type_id='+type_id+'&lat='+lat+'&lng='+lon;
    console.log("service request ",serviceUrl);
    return this.http.get(serviceUrl,{headers: headers });

  }

}
