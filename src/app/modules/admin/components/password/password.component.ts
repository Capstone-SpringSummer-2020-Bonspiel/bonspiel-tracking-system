import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@core/_services';
import { User } from '@app/core/_models';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  currentUsername = null;
  currentIsSuperAdmin = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Get current user
    this.accountService.user$.subscribe((user) => {
      this.currentUsername = user.username;
      this.currentIsSuperAdmin = user.isSuperAdmin;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    if (!this.currentUsername) {
      return;
    }

    console.log();


    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.changePassword(this.currentUsername, this.f.password.value, this.currentIsSuperAdmin)
      .subscribe(
        data => {
          console.log('PASSWORD CHANGED');
          this.notificationService.showSuccess('Your password was successfully changed', '');
          this.loading = false;
        },
        error => {
          console.log('PASSWORD NOT CHANGED');
          this.notificationService.showSuccess('Unable to sign in.  Invalid username/password combination.', ''),
            this.loading = false;
        });
  }
}