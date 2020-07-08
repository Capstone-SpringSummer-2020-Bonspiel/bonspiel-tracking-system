import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  isSidebarOpen = true;

  constructor(private router: Router) { }

  ngOnInit() { }

  toggleSideBar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  manageUsers() {
    this.router.navigate(['/admin/users']);
  }
}
