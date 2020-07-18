import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@core/_services';
import { User } from '@app/core/_models';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log('LOGIN SUCCESSFUL!!!!!!!');
          console.log(this.returnUrl);

          if (this.returnUrl.includes('admin')) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.router.navigateByUrl('/admin');
          }
        },
        (err) => {
          console.log('LOGIN UNSUCCESSFUL......');
          console.log(err);
          // this.alertService.error(error);
          this.alertService.error('Unable to sign in.  Invalid username/password combination.');
          this.loading = false;
        });
  }
}
