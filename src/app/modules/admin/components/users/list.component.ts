import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@core/_services';
import { NotificationService } from '@app/shared/services/notification.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { Router } from '@angular/router';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit, OnDestroy {
  users = null;
  // getAllAdmins$;

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private spinner: SpinnerService,
    private router: Router
  ) {
    // this.getAllAdmins$ = this.accountService.getAllAdmins()
  }

  ngOnInit() {
    // this.fetchAllAdmins();

    this.spinner.on();
    // this.getAllAdmins$
    this.accountService.getAllAdmins()
      .pipe(first())
      .subscribe(
        (users) => {
          this.users = users;
          this.users.sort((a, b) => (a.username > b.username) ? 1 : -1);

          // Add isDeleting property
          this.users = this.users.map((el) => {
            var o = Object.assign({}, el);
            o.isDeleting = false;
            return o;
          })
          console.log(this.users);
          this.spinner.off();
        },
        (err) => {
          console.log('err');
        })
      .add(() => {
        console.log('list component');
      });
  }

  ngOnDestroy() {
    // if (this.getAllAdmins$) {
    //   this.getAllAdmins$.unsubscribe();
    // }
  }

  fetchAllAdmins() {
    this.spinner.on();
    // this.getAllAdmins$
    this.accountService.getAllAdmins()
      .pipe(first())
      .subscribe(
        (users) => {
          this.users = users;
          this.users.sort((a, b) => (a.username > b.username) ? 1 : -1);

          // Add isDeleting property
          this.users = this.users.map((el) => {
            var o = Object.assign({}, el);
            o.isDeleting = false;
            return o;
          })
          console.log(this.users);
          this.spinner.off();
        },
        (err) => {
          console.log('err');
        })
      .add(() => {
        console.log('list component');
      });
  }

  deleteUser(username: string) {
    // isDeleting is used for loading spinner
    const user = this.users.find(x => x.username === username);
    user.isDeleting = true;

    // Remove user
    this.spinner.on();
    this.accountService.removeAdmin(username)
      .subscribe(
        (res) => {
          this.users = this.users.filter(x => x.username !== username)
          console.log(res);
          this.notificationService.showError(`${username} was successfully deleted`, '');
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(`Something went wrong`, '');
        })
      .add(() => {
        this.spinner.off();
      });
  }

  approveUser(username: string) {
    this.spinner.on();
    const user = this.users.find(e => e.username === username);
    this.accountService.editAdmin(user.username, null, user.issuperadmin, 'true')
      .subscribe(
        (res) => {
          // console.log(res);
          this.notificationService.showSuccess('User was approved', '');
          this.fetchAllAdmins();
        },
        (err) => {
          // console.log(err);
        })
      .add(() => {
        this.spinner.off();
      });
  }

  rejectUser(username: string) {
    this.deleteUser(username);
  }
}