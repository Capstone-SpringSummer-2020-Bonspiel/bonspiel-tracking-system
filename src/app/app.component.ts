import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'bonspiel-tracking-system';

  events: string[] = [];
  opened: boolean;

  navLinks = [
    {
      label: 'Route 1',
      path: '/home',
      icon: 'home',
    },
    {
      label: 'Schedule',
      path: '/schedule',
      icon: 'drag_handle',
    },
    {
      label: 'Team',
      path: '/teamlist',
      icon: 'add_box',
    },
    {
      label: 'Route 4',
      path: '/',
      icon: 'playlist_add',
    },
    {
      label: 'Route 5',
      path: '/',
      icon: 'account_tree',
    },
  ];

  reason = '';

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public router: Router) {}

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
}
