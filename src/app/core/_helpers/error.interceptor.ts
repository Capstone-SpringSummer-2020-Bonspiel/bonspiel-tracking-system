import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '@core/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(err => {
          if (err.status === 401) {
            // console.log('INTERCEPT ERROR!');
            // console.log(request);
            // auto logout if 401 response returned from api
            this.accountService.logout();
          }

          console.log(`error intercept:`);
          console.log(err);

          const error = err.error.message || err.statusText;
          return throwError(error);
        }));
  }
}