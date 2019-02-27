import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HelperProvider } from '../helper/helper';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class RefreshTokenInterceptorProvider implements HttpInterceptor {

  constructor(  public helper: HelperProvider, private injector: Injector,
     public storage: Storage, public http: HttpClient ) {
      console.log('Hello RefreshTokenInterceptorProvider Provider');
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
  //   console.log("intercept",request);

  //   return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
  //     const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
      
  //     console.log("intercept errorResponse ",errorResponse );
      
  //     if (errorResponse.status === 401 ) {
        
  //       const http = this.injector.get(HttpClient);
  //       let headers = new HttpHeaders()
  //       headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
  //        //this.storage.get("user_login_token").then((val)=>{
         
  //       let params = new HttpParams().set('refresh_token', localStorage.getItem('refresh_token'))
  //       return http.post<any>(this.helper.serviceUrl+`api/refresh`, params, { headers: headers })
  //         .flatMap(data => {
           
  //           localStorage.setItem('user_token', data.access_token)
  //           localStorage.setItem('refresh_token', data.refresh_token)
  //           const cloneRequest = request.clone({setHeaders: {'Authorization': `Bearer ${data.access_token}`}});

  //           return next.handle(cloneRequest);
  //         });
  //      // })
  //     }

  //     return Observable.throw(errorResponse);
  //   });

  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //alert("here token")
    return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
      //alert(JSON.stringify(errorResponse.url))
      if ( errorResponse.url == this.helper.serviceUrl+`api/login`) {
        return Observable.throw(errorResponse);
    }
     else if (errorResponse.status === 401 && errorResponse.url != this.helper.serviceUrl+`api/refresh`) {
        
        const http = this.injector.get(HttpClient);
        let headers = new HttpHeaders()
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
                
        let params = new HttpParams().set('refresh_token', localStorage.getItem('refresh_token'))
        return http.post<any>(this.helper.serviceUrl+`api/refresh`, params, { headers: headers })
          .flatMap(data => {
           
            localStorage.setItem('user_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
            const cloneRequest = request.clone({setHeaders: {'Authorization': `Bearer ${data.access_token}`}});
            return next.handle(cloneRequest);
           
          })
          .catch( err => {
            // this.helper.userlogout()
            return Observable.throw(errorResponse);
          }
          )
       // })
      }
      else if (errorResponse.status === 401){
        this.helper.userlogout()
        return;
      }
      else{
        return Observable.throw(errorResponse);
      }
    });

  }


}