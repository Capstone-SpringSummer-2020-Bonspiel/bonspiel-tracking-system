import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/core/_services';
import { NotificationService } from '@app/shared/services/notification.service';
import { SpinnerService } from '@app/shared/services/spinner.service';

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
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
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

  instructionals() {
    this.router.navigate(['/admin/instructionals']);
  }

  faqs() {
    this.router.navigate(['/admin/faqs']);
  }

  feedback() {
    // SPINNER TEST
    this.spinnerService.on();
    setTimeout(() => {
      this.spinnerService.off();
    }, 2000);
  }

  changePassword() {
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
