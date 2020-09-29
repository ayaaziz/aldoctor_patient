import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperProvider } from '../helper/helper';
import 'rxjs/add/operator/timeout';


@Injectable()
export class LoginserviceProvider {

  constructor(public helper:HelperProvider, public http: HttpClient) {
    console.log('Hello LoginserviceProvider Provider');
  }
  getData(){
    return this.http.get('https://jsonplaceholder.typicode.com/posts');
  }
  getGovernerates(){
    return this.http.get(this.helper.serviceUrl+'api/get/lkps/governerates');
    /*this.http.get(this.helper.serviceUrl+'api/get/lkps/governerates')
    .subscribe(
      data=>{
        this.presentToast("from service gov resp: "+JSON.stringify(data));
        resp=data;
        
      },
      err =>{
        this.presentToast("from service gov error: "+JSON.stringify(err));
        error=err;
        
      }
    );*/
  }
  getCities(id){
    // return this.http.get(this.helper.serviceUrl+'api/get/lkps/cities?governerate_id='+id);
    
    return this.http.get(this.helper.serviceUrl+'api/get/lkps/cities?governerate_id='+id+'&patient=1');

  }

  getAllZones() {
    var lang = this.helper.currentLang;
    // let serviceUrl = this.helper.serviceUrl +'api/get/lkps/cities?lang='+lang;
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/cities?lang='+lang+'&patient=1';

    return this.http.get(serviceUrl);
  }

  getAccessToken(authSuccessCallback,authFailureCallback) {

    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
    let params = new HttpParams().set('client_id', '2').set('client_secret', 'SWMX2z5hAtB7DD5l29bwZ7s3gCxmLGgp8JKX8w7p').set('grant_type', 'client_credentials');
    let serviceUrl = this.helper.serviceUrl + 'oauth/token';
    this.http.post(serviceUrl, params, { headers: headers })
    .timeout(10000)    
    .subscribe(
      data => {
        
        console.log("form getAccessToken: ",JSON.stringify(data))
        authSuccessCallback(data)
      },
      err => {
        
        authFailureCallback("");
      }
    )
}  

userRegister(userData,access_token,SuccessCallback,FailureCallback) {
  // var userImg=" ";
  // if(userData.img != null){
  //   let userImage = userData.img.split(',')[1];
  //   userImg = userImage.replace(/\+/g,",");
  // }
  console.log("gender: ",userData.gender);
  console.log("fname: ",userData.firstname);
  console.log("lname: ",userData.secondname);
  console.log("userData.city_id: ",userData.city_id);
  let headers = new HttpHeaders();
  // +" "+userData.secondname+" "+userData.surname
  let parameter = new HttpParams().set('name',userData.firstname)
  .set('phone','2'+userData.phone).set('birth_date',userData.birthdate)
  .set('address',userData.address+"-"+userData.city+"-"+userData.country)
  .set('password',userData.password).set('city',userData.city)
  .set('country',userData.country).set('gender',userData.gender)
  .set('terms',"1").set('email',userData.email).set('city_id',userData.city_id)
  .set("profile_pic",userData.img ).set('profile_pic_ext','jpeg');

      

  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
  let serviceUrl = this.helper.serviceUrl +'api/user/register';
  this.http.post(serviceUrl,parameter,{headers: headers })
  .timeout(10000)
   .subscribe(
    data => {
      
            //console.log("form user register",JSON.stringify(data))
            SuccessCallback(data)
            
    },
    err => {
      
      FailureCallback("-2")
    }
  )

}
userLogin(email,password,access_token,SuccessCallback,FailureCallback) {
  //this.presentToast("from user login service");
  let headers = new HttpHeaders();
      // let params={
      //   'email' :email,
      //   'password' :password
      // }
      
      let parameter = new HttpParams().set('email','2'+email).set('password',password).set('app_type','0');
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/login';
      this.http.post(serviceUrl,parameter,{headers: headers })
      .timeout(10000)
       .subscribe(
        data => {
              //this.presentToast("su data: "+JSON.stringify(data));
                console.log("from login: ",JSON.stringify(data))
                SuccessCallback(data)
        },
        err => {
         //this.presentToast("failure from login service");
          FailureCallback("-2")
        }
      )
   
    }

    changePassword(oldPass,newPass,confirmPass,access_token){
      let headers = new HttpHeaders();
     
      let parameter = new HttpParams().set('current_password',oldPass).set('password',newPass).set('password_confirmation',confirmPass)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/change_password';
      return this.http.post(serviceUrl,parameter,{headers: headers });
      
    }
    editUser(name,add,dob,email,cityId,access_token){
      let headers = new HttpHeaders();

      let parameter = new HttpParams().set('name',name)
      .set('birth_date',dob).set('email',email)
      .set('address',add)
      .set('city_id',cityId);
      
      //.set('phone',phone)
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/edit';
      return this.http.post(serviceUrl,parameter,{headers: headers });

    }
  changeProfilePic(profilePic,access_token){
    let headers = new HttpHeaders();
      // let imgdata=profilePic.split(',')[1]; imgdata.replace(/\+/g,",")
      let parameter = new HttpParams().set('profile_pic',profilePic)
      .set('profile_pic_ext','jpeg');
      console.log("parameters from service: ",parameter);
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/change_profile_img';
      return this.http.post(serviceUrl,parameter,{headers: headers });

  }
  getuserProfile(access_token){
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/user';
      return this.http.get(serviceUrl,{headers: headers });

  }

  activateUser(ActivationCode,access_token,SuccessCallback,FailureCallback) {
    
    let headers = new HttpHeaders();
   
    let parameter = new HttpParams().set('code',ActivationCode)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/activate';
    this.http.post(serviceUrl,parameter,{headers: headers })
     
     .subscribe(
      data => {
              console.log(JSON.stringify(data))
               SuccessCallback(data)
      },
      err => {
        
        FailureCallback("-2")
      }
    )
 
  }


  getSpecializations2(access_token){
    console.log("sp:",this.helper.currentLang);
    //return this.http.get(this.helper.serviceUrl+'api/get/lkps/specialities');
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/specialities?lang='+lang+"&all=1"+"&city_id="+this.helper.city_id;
    console.log("request : ",serviceUrl);
    return this.http.get(serviceUrl,{headers: headers });

    
  }
  

  getSpecializations(access_token){
    console.log("sp:",this.helper.currentLang);
    //return this.http.get(this.helper.serviceUrl+'api/get/lkps/specialities');
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/specialities?lang='+lang;
    console.log("request : ",serviceUrl);
    return this.http.get(serviceUrl,{headers: headers });

    
  }



  getDoctorInSpecificSpecialization(page,id,access_token){
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/users/search?type=2&speciality_id='+id+'&lat='+this.helper.lat+'&long='+this.helper.lon+'&city_id='+this.helper.city_id+'&page='+page;
    return this.http.get(serviceUrl,{headers: headers });

  }
  getDoctorsByName(page,doctorName,speciality_id,access_token){
    
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/users/search?type=2&name='+doctorName+'&speciality_id='+speciality_id+'&lat='+this.helper.lat+'&long='+this.helper.lon+'&city_id='+this.helper.city_id+'&page='+page;
    return this.http.get(serviceUrl,{headers: headers });

  }
  
  saveOrder(doctorsId ,access_token,serviceNumber,coupon_id){
    let headers = new HttpHeaders();
    console.log("lat from service ",this.helper.lat);
    console.log("lon from service ",this.helper.lon);

    let userLocation = this.helper.lat + "," + this.helper.lon;

    let parameter = new HttpParams().set('doctor_id',doctorsId).
    set('extra',userLocation).set('service_id','2').set('service_number',serviceNumber).set('coupon_id',coupon_id);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/create';
    return this.http.post(serviceUrl,parameter,{headers: headers });

    
  }
  getUserOrders(page,access_token){
    // var lang = this.helper.currentLang;
    // let headers = new HttpHeaders();
    
    // headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl +'api/users/my-orders?lang='+lang;
    // return this.http.get(serviceUrl,{headers: headers });

    //4.8
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('page',page)
    .set('lang',lang).set('status',"1");
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/users/my-orders';
    return this.http.post(serviceUrl,parameter,{headers: headers });
    

  }
  filterOrder(after,before,page,access_token){
    // var lang = this.helper.currentLang;
    // let headers = new HttpHeaders();
    
    // // let parameter = new HttpParams().set('before','2018-06-20').
    // // set('after','2018-06-20');2018-06-18,after,from=2018-06-17&before,to=2018-06-18
    
    // headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl +"api/users/my-orders?after="+after+"&before="+before;
    // return this.http.get(serviceUrl,{headers: headers });
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('page',page)
    .set('lang',lang).set('status',"1");
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +"api/users/my-orders?after="+after+"&before="+before;
    return this.http.post(serviceUrl,parameter,{headers: headers });
    
  }
  getServiceProfile(id,access_token){
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/user/'+id;
    return this.http.get(serviceUrl,{headers: headers });

  }
  validateDiscountCode(code,access_token){
    let headers = new HttpHeaders();
    
    let parameter = new HttpParams().set('code',code);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/check-code';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }


  registerFirebase(firebase_registeration_id, access_token) {
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('firebase_registeration_id',firebase_registeration_id).set('device_type',this.helper.device_type).set('firebase_lang',this.helper.currentLang == "en" ? "0" : "1")
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/update-firebase';
    return this.http.post(serviceUrl,parameter,{headers: headers });
    //  .subscribe(
    //   data => {
    //     console.log("from registerFirebase resp: ",data);
    //           console.log(JSON.stringify(data));
             
    //   },
    //   err => {
    //     console.log("from registerFirebase err: ",err);
        
    //   }
    // )
   
  }


  AboutApplication(access_token){
    
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/about-us?lang=ar';
      return this.http.get(serviceUrl,{headers: headers })
      
  }
  Conditions(access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-use-conditions?lang='+lang;
      return this.http.get(serviceUrl,{headers: headers })
      
  }
  ContactUs(access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/contact-users?lang='+lang;
      return this.http.get(serviceUrl,{headers: headers })
      
  }
 
  cancelreasons(access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      //let serviceUrl = this.helper.serviceUrl +'api/get/lkps/cancel-reasons';
      //let serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-cancel-reasons?lang='+lang;
      // users-doctor-cancel-reasons
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-doctor-cancel-reasons?lang='+lang;
      return this.http.get(serviceUrl,{headers: headers })
      
  }
  cancelorder(orderid,reason_ids,description,access_token){
    let headers = new HttpHeaders();
      let parameter = new HttpParams().set('order_id',orderid)
      .set('reason_ids',reason_ids).set('description',description);
      console.log("parameters from service: ",parameter);
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/orders/cancel';
      return this.http.post(serviceUrl,parameter,{headers: headers });

  }
  nearbyDooctors(page,lat,lon,access_token){

    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/nearby?service_id=2&lat='+lat+'&lng='+lon+'&page='+page;
    return this.http.get(serviceUrl,{headers: headers });

  }
  getDurationAndDistance(sLat,sLon,dLat,dLon){
    //https://maps.googleapis.com/maps/api/directions/json?origin=31.0657632,31.6421222&destination=31.037933,31.381523
    var url = 'https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?origin='+sLat+','+sLon+'&destination='+dLat+','+dLon+'&key='+this.helper.key;
    console.log("googlw api url ",url);
    return this.http.get(url);
  }
  rateDoctor(docId,rate,notes,ratesIds,userId,orderId,access_token){
    let headers = new HttpHeaders();
      // let parameter = new HttpParams().set('user_id',docId)
      // .set('rate',rate).set('remark',notes);
      let parameter = new HttpParams().set('service_profile_id',docId)
      .set('rate',rate).set('remark',notes).set('order_id',orderId)
      .set('is_reorder','0').set('user_id',userId).set('rate_criteria_ids',ratesIds);
      
      console.log("parameters from service: ",parameter);
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/users/rate';
      return this.http.post(serviceUrl,parameter,{headers: headers });
  }

  getNotifications(page,access_token){
    
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/notifications?page='+page;
    console.log("access token ",access_token,"headers from getNotifications",headers , "request ",serviceUrl);
    return this.http.get(serviceUrl,{headers: headers });
    
  }
  getCountOfNotifications(access_token){
   
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/notifications-count';
    console.log("access token ",access_token,"headers from getCountOfNotifications",headers , "request ",serviceUrl);
    return this.http.get(serviceUrl,{headers: headers });

  }
  updateNotification(status,access_token){
    
    let headers = new HttpHeaders();
    //notifications -> 1, 0
    let parameter = new HttpParams().set('notifications',status);
    console.log("parameters from service: ",parameter);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/notifications-update';
    return this.http.post(serviceUrl,parameter,{headers: headers });
  }
//   readNotification(access_token){
// //api/notifications/read/{id} (post)
// //read properity -> null or date when clicked
// console.log("access token from read notification",access_token);
//     let headers = new HttpHeaders();
    
//     // let parameter = new HttpParams().set('notifications',status);
    
//     headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
//     console.log("headers from read notifications",headers);
//     let serviceUrl = this.helper.serviceUrl +'api/notifications/read/1';
//     return this.http.post(serviceUrl,{headers: headers });

//   }
  readNotification(access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set("","");
    console.log("parameters from service: ",parameter);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/notifications/read/1';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }

  checKCoupon(docid,access_token,speciality_id,code,SuccessCallBack,FailCallBack){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('code',code)
    .set('speciality_id',speciality_id).set('doctor_ids',docid);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/validateCoupon';
    this.http.post(serviceUrl,parameter,{headers: headers }).subscribe(data=>{
      SuccessCallBack(data)
    },
    err=>{
      FailCallBack("-1")
    })
  }

  //ayaaaaaaaa
  checKCoupon2(orderId,patientId,docid,access_token,speciality_id,code,SuccessCallBack,FailCallBack){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('code',code)
    .set('speciality_id',speciality_id).set('doctor_ids',docid)
    .set('order_id',orderId).set('patient_id',patientId);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/validateCoupon';
    this.http.post(serviceUrl,parameter,{headers: headers }).subscribe(data=>{
      SuccessCallBack(data)
    },
    err=>{
      FailCallBack("-1")
    })
  }
 
  rateCriteriea(rate,access_token){
    // http://itrootsdemos.com/aldoctor/public/api/get/lkps/rate-criteriea?rate=1&type=rate-criteriea
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/rate-criteriea?rate='+rate;
    //let serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-rate-criteriea?rate='+rate;
    
    return this.http.get(serviceUrl,{headers: headers });

  }
  reorder(orderId , custom_date ,date_id,access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('order_id',orderId)
    .set('date_id',date_id).set('custom_date',custom_date);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/create-reorder';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }
  cancelMsg(access_token){
    let headers = new HttpHeaders();
    var lang = this.helper.currentLang;
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/cancelMessage?lang='+lang;
    return this.http.get(serviceUrl,{headers: headers });

  }
  forgetPassword(phone){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('phone','2'+phone);
    
    //headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/forget';
    return this.http.post(serviceUrl,parameter);
  }
  changePhoneNumber(phone,access_token){
    console.log("access token from change phone",access_token);
    let headers = new HttpHeaders();
    if( phone.toString()[0] != "2")
        phone= '2'+phone;

    let parameter = new HttpParams().set('phone',phone);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/change-phone';
    return this.http.post(serviceUrl,parameter,{headers: headers });  
  }
  resendActivationCode(phone,access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set("phone",phone);
    // console.log("parameters from service: ",parameter);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/resend-activation';
    return this.http.post(serviceUrl,parameter,{headers: headers });
  }
  rateWords(access_token){
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    
    // let serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-rate-criteriea';
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-doctor-rate-criteriea';
    
    return this.http.get(serviceUrl,{headers: headers });
  }
  reteWordsComments(rateId,access_token){
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-rate-criteriea?rate='+rateId;
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/patient-doctor-rate-criteriea?rate='+rateId;
    return this.http.get(serviceUrl,{headers: headers });
  }

  checkUserPass(pass,access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set("current_password",pass);
    // console.log("parameters from service: ",parameter);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/check_password';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }

  checkPhoneWithCode(phone,code,access_token){
    let headers = new HttpHeaders();
    console.log("phone from checkPhoneWithCode",phone);
    if( phone.toString()[0] != "2")
        phone= '2'+phone;
    
    console.log("phone from checkPhoneWithCode after if",phone);

    let parameter = new HttpParams().set("phone",phone).set("code",code);
    // console.log("parameters from service: ",parameter);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/change-phone-code';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }
  updateOrderStatus(orderId,access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set("order_id",orderId).set("status",'3'); 
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/update';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }

  updateOrderStatusToCancel(orderId,access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set("order_id",orderId).set("status",'4'); 
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/update';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }


  updateOrderStatusToAgreeTime(orderId,access_token){
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set("order_id",orderId).set("status",'13'); 
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/update';
    return this.http.post(serviceUrl,parameter,{headers: headers });

  }

  getReviews(serviceId,page,access_token){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl+ 'api/user/rates/'+serviceId +'/'+page;
    let serviceUrl = this.helper.serviceUrl+ 'api/user/rates/'+serviceId +'/'+ page +'?page='+page;

    return this.http.get(serviceUrl,{headers: headers });
    
  }
  getpendingOrders(page,access_token){
  
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('page',page)
    .set('lang',lang).set('status',"12");
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/users/my-orders';
    return this.http.post(serviceUrl,parameter,{headers: headers });
    
  }

  getHelperTelephones(id,access_token){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/get/lkps/cities-phone?city_id='+id;
    return this.http.get(serviceUrl,{headers: headers });
  }

  getmedicalConsultants(id,access_token){

    // http://aldoctor-app.com/aldoctorfinaltest/public/api/get/lkps/medical-consultation?city_id=null
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl+ 'api/get/lkps/medical-consultation?city_id='+id;
    let serviceUrl = this.helper.serviceUrl+ 'api/get/lkps/medical-consultation?city_id=null';
    return this.http.get(serviceUrl,{headers: headers });
  }

  getCustomerService(id,access_token){

    // http://aldoctor-app.com/aldoctorfinaltest/public/api/get/lkps/customer-service?city_id=null
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    // let serviceUrl = this.helper.serviceUrl+ 'api/get/lkps/customer-service?city_id='+id;
    let serviceUrl = this.helper.serviceUrl+ 'api/get/lkps/customer-service?city_id=null';
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

  getContactEmail(access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/contact-users-email?lang='+lang;
      return this.http.get(serviceUrl,{headers: headers })
      
  }
  getContactPhone(access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/contact-users-phone?lang='+lang;
      return this.http.get(serviceUrl,{headers: headers })
      
  }
  getContactMobile(access_token){
    var lang = this.helper.currentLang;
    let headers = new HttpHeaders();

      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/contact-users-mobile?lang='+lang;
      return this.http.get(serviceUrl,{headers: headers })
      
  }


  getOrderDetails(id,access_token){
  
    let headers = new HttpHeaders();
  
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
       
    let serviceUrl = this.helper.serviceUrl +'api/orders/get/'+id;
  
    return this.http.get(serviceUrl,{headers: headers });
  } 

  getFund(access_token){

    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('','');
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/patient/forfeit';
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
  

  logmeout(SuccessCallback, FailureCallback){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem('user_token'));
    let serviceUrl = this.helper.serviceUrl +'api/logmeout';
    this.http.get(serviceUrl,{headers: headers })
    .timeout(10000)
    .subscribe( 
     data => {
             SuccessCallback(data)
     },
     err => {
       
       FailureCallback("-2")
     }
   )
  }

  UserForgetPassword(code,phone,SuccessCallback,FailureCallback) {
    // let loader = this.loadingCtrl.create({
    //   content: "",
    // });
    //  loader.present();
    let headers = new HttpHeaders();
    // let params={
    //   'email' :email,
    //   'password' :password
    // }
    let parameter = new HttpParams().set('phone',phone).set('code',code)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let serviceUrl = this.helper.serviceUrl +'api/forget';
    this.http.post(serviceUrl,parameter,{headers: headers })
     .timeout(10000)
     .subscribe(
      data => {
       // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
              console.log(JSON.stringify(data))
               SuccessCallback(data)
      },
      err => {
       // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        FailureCallback("-2")
      }
    )
 
  }

  UserForgetPasswordSendPhone(phone,SuccessCallback,FailureCallback) {
    // let loader = this.loadingCtrl.create({
    //   content: "",
    // });
    //  loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('phone',phone)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let serviceUrl = this.helper.serviceUrl +'api/changeMe';
    this.http.post(serviceUrl,parameter,{headers: headers })
     .timeout(10000)
     .subscribe(
      data => {
        // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
              console.log(JSON.stringify(data))
               SuccessCallback(data)
      },
      err => {
        // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        FailureCallback("-2")
      }
    )
 
  }

  durationbetweenDoctorAndPatient(patloc,docloc,access_token){
    let headers = new HttpHeaders();
     
      let parameter = new HttpParams().set('patient_route',patloc).set('dpls_route',docloc).set('lang','ar')
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/getDirection';
      return this.http.post(serviceUrl,parameter,{headers: headers });
  }

  //ayaaaaaaaaa
  //filter home services using zone
  getHomeZoneServices(lat,lng,access_token) {       
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('lat',lat).set('lng',lng);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/user/HomeZone';
    return this.http.post(serviceUrl,parameter,{headers: headers });
  }
}

