import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class HelperProvider {

  public lang_direction ='ltr';
  public currentLang ='en';
  public serviceUrl: string = "http://itrootsdemos.com/aldoctor/public/";
  public registration;
  public device_type="1";
  //if(platfrom==ios )
  //0 -> ios , 1-> android

  constructor(public http: HttpClient) {
    console.log('Hello HelperProvider Provider');
  }

}
