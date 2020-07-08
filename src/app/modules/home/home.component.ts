import { Component } from '@angular/core';

import { User } from '@core/_models';
import { AccountService } from '@core/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  user: User;

  constructor(private accountService: AccountService) {
    this.user = this.accountService.userValue;
  }
}