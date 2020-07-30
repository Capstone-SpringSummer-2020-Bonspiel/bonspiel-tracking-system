import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent implements OnInit {
  firstFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.firstFormGroup = this.fb.group({
      eventFullCtrl: ['', Validators.required],
      eventShortCtrl: ['', Validators.required],
    });
  }

  onClickSubmit(stepper) {
    const fullName = this.firstFormGroup.value.eventFullCtrl;
    const shortName = this.firstFormGroup.value.eventShortCtrl;

    console.log('fullName', fullName);
    console.log('shortName', shortName);

    this.spinnerService.on();
    this.apiService
      .createOrganization(fullName, shortName)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Organization has been created!', '')

          // Reset the stepper, form and validation
          stepper.reset();
          this.firstFormGroup.reset();
          Object.keys(this.firstFormGroup.controls).forEach((key) => {
            this.firstFormGroup.controls[key].setErrors(null);
          });
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Organization create failed!');
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
