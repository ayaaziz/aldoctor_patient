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
    return this.http.get(this.helper.serviceUrl+'api/get/lkps/cities?governerate_id='+id);
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
  let headers = new HttpHeaders();
  let parameter = new HttpParams().set('name',userData.firstname+" "+userData.secondname+" "+userData.surname)
  .set('phone',userData.phone).set('birth_date',userData.birthdate)
  .set('address',userData.address)
  .set('password',userData.password).set('city',userData.city)
  .set('country',userData.country).set('gender',userData.gender)
  .set('terms',"1").set('email',userData.email)
  .set("profile_pic",userData.img );

      

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
      
      let parameter = new HttpParams().set('email',email).set('password',password)
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
    editUser(name,phone,add,dob,email,access_token){
      let headers = new HttpHeaders();

      let parameter = new HttpParams().set('name',name)
      .set('birth_date',dob).set('phone',phone).set('email',email)
      .set('address',add);
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
      let serviceUrl = this.helper.serviceUrl +'api/edit';
      return this.http.post(serviceUrl,parameter,{headers: headers });

    }
  changeProfilePic(profilePic,access_token){
    let headers = new HttpHeaders();
      let imgdata=profilePic.split(',')[1];
      let parameter = new HttpParams().set('profile_pic',imgdata.replace(/\+/g,","))
      .set('profile_pic_ext','png');
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
  
  getDoctorInSpecificSpecialization(id,access_token){
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/users/search?type=2&speciality_id='+id;
    return this.http.get(serviceUrl,{headers: headers });

  }
  getDoctorsByName(doctorName,speciality_id,access_token){
    
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/users/search?type=2&name='+doctorName+'&speciality_id='+speciality_id;
    return this.http.get(serviceUrl,{headers: headers });

  }
  saveOrder(doctorsId ,access_token){
    let headers = new HttpHeaders();
    
    let parameter = new HttpParams().set('doctor_id',doctorsId);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/orders/create';
    return this.http.post(serviceUrl,parameter,{headers: headers });

    
  }
  getUserOrders(access_token){
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/users/my-orders';
    return this.http.get(serviceUrl,{headers: headers });
    

  }
  filterOrder(after,before,access_token){
    let headers = new HttpHeaders();
    
    // let parameter = new HttpParams().set('before','2018-06-20').
    // set('after','2018-06-20');2018-06-18,after,from=2018-06-17&before,to=2018-06-18
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +"api/users/my-orders?after="+after+"&before="+before;
    return this.http.get(serviceUrl,{headers: headers });
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
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/about';
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
      let serviceUrl = this.helper.serviceUrl +'api/get/lkps/users-cancel-reasons?lang='+lang;
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
  nearbyDooctors(lat,lon,access_token){

    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl+ 'api/nearby?service_id=2&lat='+lat+'&lng='+lon;
    return this.http.get(serviceUrl,{headers: headers });

  }
  getDurationAndDistance(sLat,sLon,dLat,dLon){
    //https://maps.googleapis.com/maps/api/directions/json?origin=31.0657632,31.6421222&destination=31.037933,31.381523
    var url = 'https://maps.googleapis.com/maps/api/directions/json?origin='+sLat+','+sLon+'&destination='+dLat+','+dLon+'&key='+this.helper.key;
    console.log("googlw api url ",url);
    return this.http.get(url);
  }
  rateDoctor(docId,rate,notes,userId,orderId,access_token){
    let headers = new HttpHeaders();
      // let parameter = new HttpParams().set('user_id',docId)
      // .set('rate',rate).set('remark',notes);
      let parameter = new HttpParams().set('service_profile_id',docId)
      .set('rate',rate).set('remark',notes).set('order_id',orderId)
      .set('is_reorder','0').set('user_id',userId);
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
  readNotification(access_token){
//api/notifications/read/{id} (post)
    let headers = new HttpHeaders();
    
    // let parameter = new HttpParams().set('notifications',status);
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/notifications/read/1';
    return this.http.post(serviceUrl,{headers: headers });

  }

 
  rateCriteriea(rate,access_token){
    // http://itrootsdemos.com/aldoctor/public/api/get/lkps/rate-criteriea?rate=1&type=rate-criteriea
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+access_token);
    let serviceUrl = this.helper.serviceUrl +'api/get/lkps/rate-criteriea?rate='+rate;
    return this.http.get(serviceUrl,{headers: headers });

  }
}
