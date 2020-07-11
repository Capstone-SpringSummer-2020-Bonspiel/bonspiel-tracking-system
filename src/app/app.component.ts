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
  withCredentials: true,
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

  curlingEvents = [];

  reason = '';

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    public router: Router,
    private apiService: ApiService,
    private http: HttpClient,
    private accountService: AccountService
  ) { }

  ngOnInit() {

    console.log('APP COMPONENT STARTED!');

    let dateNow = new Date().getTime();  // epoch in milliseconds 
    let token = localStorage.getItem('user');

    if (token) {

      console.log('we have a token!');

      let myToken = JSON.parse(token);
      let expiryAt = new Date(myToken.expiryAt).getTime();
      let maxAge = myToken.maxAge;

      // Case: token has expired, logout
      if (dateNow > (expiryAt - 15000) || expiryAt === NaN) {
        console.log('logout!');
        this.accountService.logout();
      }

      // Case: token exists, token is valid, we want to refresh token
      else {
        setInterval(() => {
          let token = JSON.parse(localStorage.getItem('user'));
          if (token) {
            console.log(`execute setTimeout() in ${(new Date(token.expiryAt).getTime() - new Date().getTime() - 15000) / 1000} secs`);
          }
        }, 1000);

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
        this.curlingEvents.length = 0;

        // Re-populate the array
        const events: any = res;
        for (const event of events) {
          this.curlingEvents.push(event);
        }

        // Set the current event
        this.apiService
          .currentEventId$
          .subscribe((eventId) => {
            this.apiService.changeEvent(this.curlingEvents.find((e) => e.id === eventId));
          });

        // console.log('[DEBUG] curlingEvents');
        // console.log(this.curlingEvents);
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
    this.apiService.changeEvent(this.curlingEvents.find((e) => e.id === newEvent.id));
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
}
