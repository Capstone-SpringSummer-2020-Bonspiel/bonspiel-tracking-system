import { Component, OnInit } from '@angular/core';
import { ApiService } from '@core/api/api.service';

import { User } from '@core/_models';
import { AccountService } from '@app/core/_services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  user: User;
  sideBarOpen = true;

  constructor(
    private apiService: ApiService,
    private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;
    // console.log('user:');
    // console.log(this.user);
  }

  ngOnInit(): void { }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
