import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/core/_services';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  isSidebarOpen = true;
  currentUser = null;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.accountService.user$.subscribe(user => this.currentUser = user);
  }

  toggleSideBar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  editAdmin() {
    this.router.navigate(['/admin/password']);
  }

  manageUsers() {
    if (this.currentUser.isSuperAdmin) {
      this.router.navigate(['/admin/users']);
    } else {
      console.log('ACCESS DENIED');
      this.notificationService.showError('Access Denied', '');
    }
  }

  logout() {
    this.accountService.logout();
  }
}
