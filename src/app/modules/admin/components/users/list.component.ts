import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@core/_services';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  users = null;

  constructor(private accountService: AccountService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.accountService.getAllAdmins()
      .pipe(first())
      .subscribe(users => {
        this.users = users;
        this.users.sort((a, b) => (a.username > b.username) ? 1 : -1);

        // Add isDeleting property
        this.users = this.users.map((el) => {
          var o = Object.assign({}, el);
          o.isDeleting = false;
          return o;
        })
        console.log(this.users);
      });
  }

  deleteUser(username: string) {
    const user = this.users.find(x => x.username === username);
    user.isDeleting = true;
    this.accountService.removeAdmin(username)
      .subscribe(
        (res) => {
          this.users = this.users.filter(x => x.username !== username)
          console.log(res);
          this.notificationService.showSuccess(`${username} was successfully deleted`, '');
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(`Something went wrong`, '');
        });
  }
}