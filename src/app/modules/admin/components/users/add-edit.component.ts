import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@core/_services';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  templateUrl: 'add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  username: string;
  isSuperAdmin: any;
  active: any;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    this.isSuperAdmin = this.route.snapshot.params['isSuperAdmin'];
    this.active = this.route.snapshot.params['active'];
    this.isAddMode = !this.username;

    console.log(this.username);
    console.log(this.isSuperAdmin);
    console.log(this.active);

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', passwordValidators],
      isSuperAdmin: [false, Validators.required],
      active: [false, Validators.required],
    });

    // Case: Edit Mode
    if (!this.isAddMode) {
      this.form.setValue({
        username: this.username,
        password: null,
        isSuperAdmin: (this.isSuperAdmin == "true"),
        active: (this.active == "true")
      });
    }
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
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    const isSuperAdmin = String(this.form.value.isSuperAdmin);
    this.accountService.createAdmin(username, password, isSuperAdmin)
      .subscribe(
        (data) => {
          this.notificationService.showSuccess('User added successfully', '');
          this.router.navigate(['/admin/users']);
        },
        (error) => {
          this.notificationService.showError('Something went wrong', '');
          this.loading = false;
        });
  }

  private updateUser() {
    const username = this.f.username.value;
    const password = null;
    const isSuperAdmin = String(this.f.isSuperAdmin.value);
    const active = String(this.f.active.value);
    this.accountService.editAdmin(username, password, isSuperAdmin, active)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['/admin/users']);
        },
        (error) => {
          this.alertService.error(error);
          this.notificationService.showError('Something went wrong', '');
          this.loading = false;
        });
  }
}