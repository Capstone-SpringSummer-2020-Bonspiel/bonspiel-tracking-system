import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { first, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AccountService, AlertService } from '@core/_services';
import { User } from '@app/core/_models';
import { NotificationService } from '@app/shared/services/notification.service';
import { SpinnerService } from '@app/shared/services/spinner.service';

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
  // username = null;
  // isSuperAdmin = null;
  currentUser = null;
  username = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private spinner: SpinnerService
  ) {
    console.log('PASSWORD COMPONENT STARTED!');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordConfirming });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.spinner.on();
    console.log('ngOnInit started in password component');
    // Get current user
    this.accountService.user$
      .pipe(first())
      .subscribe((user) => {
        this.accountService.getAllAdmins()
          .pipe(first())
          .subscribe(
            (res: any) => {
              // console.log(res);
              this.currentUser = res.find(e => e.username === user.username);
              // console.log(this.currentUser);
              // console.log(user);

              this.spinner.off();
              console.log('password component');
            },
            (err) => {
              // console.log();
            })
          .add(() => {
            this.spinner.off();
            console.log('password component');
          });
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    if (!this.currentUser.username) {
      return;
    }

    console.log();

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      if (this.f.password.value.length < 6 || this.f.confirmPassword.value.length < 6) {
        this.notificationService.showError('Your password must be at least 6 characters long', '');
      }
      if (this.f.password.value !== this.f.confirmPassword.value) {
        this.notificationService.showError('Your passwords must match', '');
      }
      return;
    }

    this.loading = true;
    const username = this.currentUser.username;
    const password = this.f.password.value;
    const isSuperAdmin = String(this.currentUser.issuperadmin);
    const active = String(this.currentUser.active)

    this.accountService.editAdmin(username, password, isSuperAdmin, active)
      .subscribe(
        (res) => {
          console.log('PASSWORD CHANGED');
          this.notificationService.showSuccess('Your password was successfully changed', '');
          this.loading = false;
        },
        (err) => {
          console.log('PASSWORD NOT CHANGED');
          this.notificationService.showError('Something went wrong', '');
          this.loading = false;
          this.form.reset();
        })
      .add(() => {
        this.form.reset()
        Object.keys(this.form.controls).forEach(key => {
          this.form.controls[key].setErrors(null)
        });
      });
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    }
  }
}