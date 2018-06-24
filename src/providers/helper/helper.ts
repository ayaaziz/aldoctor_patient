import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class HelperProvider {

  public lang_direction = "ltr";
  public currentLang = 'en';
  public serviceUrl: string = "http://itrootsdemos.com/aldoctor/public/";
  public registration;

  constructor(public http: HttpClient) {
    console.log('Hello HelperProvider Provider');
  }

}
