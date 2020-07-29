import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@core/_models';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true
};

@Injectable({ providedIn: 'root' })
export class AccountService {
  // private userSubject: BehaviorSubject<User>;  // input
  public userSubject: BehaviorSubject<User>;  // input
  public user$: Observable<User>;               // output

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user$ = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/admin/signin`, { username, password })
      .pipe(
        map((user: any) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);

          // // Countdown timer
          // setInterval(() => {
          //   let token = JSON.parse(localStorage.getItem('user'));
          //   if (token) {
          //     console.log(`refresh token in ${(new Date(token.expiryAt).getTime() - new Date().getTime() - 15000) / 1000} secs`);
          //   }
          // }, 1000);

          // Refresh every 9.75 minutes
          setInterval(() => {
            this.refreshToken();
          }, user.maxAge - 15000);

          return user;
        }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);

    // Remove all setTimeouts for auth refreshes
    let highestTimeoutId = setTimeout(() => { });
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  register(username, password) {
    return this.http.post(`${environment.apiUrl}/api/v1/admin/register`, { username, password });
  }

  createAdmin(username, password, isSuperAdmin) {
    const body = {
      username,
      password,
      isSuperAdmin
    }
    console.log(body);
    return this.http.post(`${environment.apiUrl}/api/v1/admin/createAdmin`, body);
  }

  editAdmin(username, password, isSuperAdmin, active) {
    const body = {
      username,
      password,
      isSuperAdmin,
      active
    };
    console.log(body);
    return this.http.put(`${environment.apiUrl}/api/v1/admin/editAdmin`, body);
  }

  removeAdmin(username: string) {
    return this.http.delete(`${environment.apiUrl}/api/v1/admin/deleteAdmin/${username}`)
      .pipe(map(x => {
        // // auto logout if the logged in user deleted their own record
        // if (username == this.userValue.username) {
        //   this.logout();
        // }
        return x;
      }));
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getAllAdmins() {
    return this.http.get(`${environment.apiUrl}/api/v1/admin/admins`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(username, params) {
    return this.http.put(`${environment.apiUrl}/users/${username}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (username == this.userValue.username) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  refreshToken() {
    // Reload the cookie in the browser
    this.http.post(`${environment.apiUrl}/api/v1/admin/refresh`, {}, httpOptions)
      .subscribe(
        (user: any) => {
          console.log('JWT was refreshed');
          console.log(user);

          // refresh user details and jwt token in local storage to keep user logged in between page refreshes
          const newUser = JSON.parse(localStorage.getItem('user'));
          newUser.token = user.token;
          newUser.maxAge = user.maxAge;
          newUser.expiryAt = user.expiryAt;
          localStorage.setItem('user', JSON.stringify(newUser));
          this.userSubject.next(newUser);
        });
  }
}
