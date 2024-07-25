import { Injectable } from '@angular/core';
import { AlertErrorService } from 'app/shared/alert/alert-error.service';
import { HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private alertErrorService: AlertErrorService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(null, (err: HttpErrorResponse) => {
        if (!(err.status === 401 && (err.message === '' || err.url?.includes('api/account')))) {
          if(err.status === 0){
           var  message  = { message:err.message, url: err.url}
            console.log(message)
          }else{
          this.alertErrorService.displayError(err);
          }
        }
      })
    );
  }
}
