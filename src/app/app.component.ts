import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
      path: '/',
      icon: 'home',
    },
    {
      label: 'Route 2',
      path: '/',
      icon: 'drag_handle',
    },
    {
      label: 'Route 3',
      path: '/',
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

  constructor(public router: Router) {}
}
