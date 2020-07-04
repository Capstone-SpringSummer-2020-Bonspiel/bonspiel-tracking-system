import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  // We are receiving the result of the login call, containing the JWT and the expiresIn property,
  // and we are passing it directly to the setSession method
  login(email: string, password: string) {
    return this.http.post<any>('/api/login', { email, password })
      .do(res => this.setSession)
      .shareReplay();
  }

  // Inside setSession, we are storing the JWT directly in Local Storage in the id_token key entry
  // We are taking the current instant and the expiresInproperty, and using it to calculate the expiration timestamp
  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  // Then we are saving also the expiration timestamp as a numeric value in the expires_at Local Storage entry
  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
