import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { NotificationService } from './shared/services/notification.service';
import { ApiService } from './core/api/api.service';

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

  constructor(public router: Router, private api: ApiService) { }

  ngOnInit() {
    // Get all curling events
    this.api
      .getEvents()
      .subscribe((res: any) => {
        this.curlingEvents.length = 0;  // Clear array

        // Re-populate the array
        const events: any = res;
        for (const event of events) {
          this.curlingEvents.push(event);
        }

        console.log('[DEBUG] curlingEvents');
        console.log(this.curlingEvents);
      });
  }

  loadNewEvent(event: any) {
    console.log('[DEBUG] loadNewEvent() in app component:');
    console.log(event);

    this.api.changeEventId(event.id);
    this.sidenav.close();
  }

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
}
