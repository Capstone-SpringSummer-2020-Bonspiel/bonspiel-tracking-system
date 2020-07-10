import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/core/_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  isSidebarOpen = true;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() { }

  toggleSideBar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  changePassword() {
    this.router.navigate(['/admin/password']);
  }

  manageUsers() {
    this.router.navigate(['/admin/users']);
  }

  logout() {
    this.accountService.logout();
  }
}
