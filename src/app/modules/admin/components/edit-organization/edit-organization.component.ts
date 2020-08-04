import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss'],
})
export class EditOrganizationComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;

  organizations: any[] = [];
  selectedOrganization = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.zeroFormGroup = this.fb.group({
      organizationCtrl: ['', Validators.required],
    });
    this.firstFormGroup = this.fb.group({
      eventFullCtrl: ['', Validators.required],
      eventShortCtrl: ['', Validators.required],
    });

    this.getEvents();
  }

  getEvents() {
    this.spinnerService.on();
    this.apiService.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.organizations.sort((a, b) => (a.full_name > b.full_name ? 1 : -1));
      console.log('organizations:');
      console.log(this.organizations);

      this.spinnerService.off();
    });
  }

  selectOrganization() {
    this.selectedOrganization = this.organizations.filter(x => x.id === this.zeroFormGroup.value.organizationCtrl)[0];

    this.firstFormGroup.controls.eventFullCtrl.setValue(
      this.selectedOrganization.full_name
    );
    this.firstFormGroup.controls.eventShortCtrl.setValue(
      this.selectedOrganization.short_name
    );

    console.log('selectedOrganization');
    console.log(this.selectedOrganization);
  }

  onClickSubmit(stepper) {
    //Edit Organization
    const fullName = this.firstFormGroup.value.eventFullCtrl;
    const shortName = this.firstFormGroup.value.eventShortCtrl;

    this.spinnerService.on();
    this.apiService
      .editOrganization(
        fullName,
        shortName,
        this.selectedOrganization.id
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Organization has been modified', '');

          // Reset the form and validation
          stepper.reset();

          let formGroups = [this.zeroFormGroup, this.firstFormGroup];

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'ERROR');
        }
      )
      .add(() => {
        this.spinnerService.off();
        this.getEvents();
      });
  }
}

