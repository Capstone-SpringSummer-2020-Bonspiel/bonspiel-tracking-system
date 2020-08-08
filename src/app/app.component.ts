import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { NotificationService } from './shared/services/notification.service';
import { ApiService } from '@core/api/api.service';
import { AccountService } from './core/_services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'bonspiel-tracking-system';

  events: string[] = [];
  opened: boolean;

  currentCurlingEvents = [];
  pastCurlingEvents = [];

  reason = '';

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    public router: Router,
    private apiService: ApiService,
    private http: HttpClient,
    private accountService: AccountService
  ) { }

  ngOnInit() {

    // console.log('APP COMPONENT STARTED!');

    // JWT Authentication
    let dateNow = new Date().getTime();  // epoch in milliseconds 
    let token = JSON.parse(localStorage.getItem('user'));

    if (token) {

      // console.log('we have a token!');

      // Case: token is invalid, logout
      if (!this.isValidToken(token)) {
        console.log('token expired; logout!');
        this.accountService.logout();
      }

      let expiryAt = new Date(token.expiryAt).getTime();
      let maxAge = token.maxAge;

      // Case: token has expired, logout
      if (dateNow > (expiryAt - 15000) || expiryAt === NaN) {
        console.log('token expired; logout!');
        this.accountService.logout();
      }

      // Case: token exists, token is valid, we want to refresh token
      else {
        // // Countdown timer
        // setInterval(() => {
        //   let token = JSON.parse(localStorage.getItem('user'));
        //   if (token) {
        //     console.log(`refresh token in ${(new Date(token.expiryAt).getTime() - new Date().getTime() - 15000) / 1000} secs`);
        //   }
        // }, 1000);

        setTimeout(() => {
          this.refreshToken();  // do an initial refresh

          setInterval(() => {
            this.refreshToken();  // then, refresh every 9.75 minutes
          }, maxAge - 15000);
        }, (expiryAt - new Date().getTime() - 15000));  // try to refresh within the window (between 9:30 & 10 minutes)
      }
    }

    // Get all curling events
    this.apiService
      .getEvents()
      .subscribe((res: any) => {

        // Clear array
        this.currentCurlingEvents.length = 0;

        // Re-populate the array
        const events: any = res;
        for (const event of events) {
          if (event.completed === true) {
            this.pastCurlingEvents.push(event);
          } else {
            this.currentCurlingEvents.push(event);
          }
        }

        this.currentCurlingEvents = this.currentCurlingEvents.sort((a, b) => {
          let c = new Date(a);
          let d = new Date(b);
          return c > d ? 1 : -1;
        });

        this.pastCurlingEvents = this.pastCurlingEvents.sort((a, b) => {
          let c = new Date(a);
          let d = new Date(b);
          return c > d ? 1 : -1;
        });

        console.log('currentCurlingEvents:', this.currentCurlingEvents);
        console.log('pastCurlingEvents:', this.pastCurlingEvents);

        // // Set to most recent event if current value is null
        // // Otherwise, set it to current value
        // let sorted = this.currentCurlingEvents;

        // if (sorted.length === 0) {
        //   sorted = this.pastCurlingEvents;
        // }

        // console.log('sorted', sorted);

        // let previousEventId = this.apiService.currentEventId;
        // let previousEvent = this.apiService.currentEvent;

        // // console.log('PREVIOUS', previousEventId, previousEvent);

        // if (previousEventId === null) {
        //   this.apiService.changeEventId(sorted[0].id);
        // } else {
        //   this.apiService.changeEventId(previousEventId);
        // }

        // if (previousEvent === null) {
        //   this.apiService.changeEvent(sorted[0]);
        // } else {
        //   this.apiService.changeEventId(previousEvent);
        // }

        // // console.log('[DEBUG] curlingEvents', this.currentCurlingEvents);
      });
  }

  loadNewEvent(newEvent: any) {
    console.log('[DEBUG] loadNewEvent() in app component:');
    console.log(newEvent);

    // Redirect to Home page
    if (this.router.url !== '/') {
      this.router.navigateByUrl('/')
    }

    this.apiService.changeEventId(newEvent.id);
    let found = this.currentCurlingEvents.find((e) => e.id === newEvent.id);
    if (!found) {
      found = this.pastCurlingEvents.find((e) => e.id === newEvent.id)
    }
    this.apiService.changeEvent(found);
    this.sidenav.close();
  }

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
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
          this.accountService.userSubject.next(newUser);
        });
  }

  isValidToken(token) {
    if (!token) {
      return false;
    }

    const propertiesToTest = [
      'token',
      'expiration'
    ];
    if (propertiesToTest.every(x => x in token)) {
      return true;
    }

    return false;
  }

  // getCurlingEvents(completed) {
  //   return this.curlingEvents.filter(e => e.completed === completed);
  // }
}
