import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
  username = null;
  isSuperAdmin = null;

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
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordConfirming });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Get current user
    this.accountService.user$.subscribe((user) => {
      this.username = user.username;
      this.isSuperAdmin = user.isSuperAdmin;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    if (!this.username) {
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
    this.accountService.changePassword(this.username, this.f.password.value, String(this.isSuperAdmin))
      .subscribe(
        data => {
          console.log('PASSWORD CHANGED');
          this.notificationService.showSuccess('Your password was successfully changed', '');
          this.loading = false;
        },
        error => {
          console.log('PASSWORD NOT CHANGED');
          this.notificationService.showError('Something went wrong', ''),
            this.loading = false;
        });
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    }
  }
}