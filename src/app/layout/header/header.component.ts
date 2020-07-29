import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { AccountService } from '@app/core/_services';
import { User } from '@app/core/_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle: EventEmitter<any> = new EventEmitter<any>();

  isSignedIn: User;

  constructor(
    public router: Router,
    private spinnerService: SpinnerService,
    private accountService: AccountService
  ) {
    this.accountService.user$.subscribe(user => {
      this.isSignedIn = user;
    });
  }

  ngOnInit(): void { }

  signIn() {
    this.router.navigateByUrl('/account/login');
  }

  managerView() {
    this.router.navigateByUrl('/admin');
  }

  signOut() {
    this.accountService.logout();
  }
}
