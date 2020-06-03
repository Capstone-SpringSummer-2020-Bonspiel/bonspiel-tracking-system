import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle: EventEmitter<any> = new EventEmitter<any>();

  constructor(public router: Router) {}

  ngOnInit(): void {}

  toggleSidenav(foo: string): void {
    this.sidenavToggle.emit(foo);
  }

  signIn() {
    this.router.navigateByUrl('/admin');
  }
}
