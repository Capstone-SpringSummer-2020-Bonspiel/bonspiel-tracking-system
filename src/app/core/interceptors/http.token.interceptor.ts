import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // start by retrieving the JWT string from Local Storage directly
    const idToken = localStorage.getItem("id_token");

    // then we are going to check if the JWT is present
    // if the JWT is present, then we will clone the HTTP headers, and add an extra Authorization header, which will contain the JWT
    // if the JWT is not present, then the request goes through to the server unmodified
    if (idToken) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${idToken}`)
      });

      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
