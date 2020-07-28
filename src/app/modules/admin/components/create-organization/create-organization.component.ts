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
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      eventFullCtrl: ['', Validators.required],
      eventShortCtrl: ['', Validators.required],
    });
  }

  onClickSubmit(stepper) {
    //Create Organization
    const fullName = this.firstFormGroup.value.eventFullCtrl;
    const shortName = this.firstFormGroup.value.eventShortCtrl;

    console.log(`full name: ${fullName}`);
    console.log(`detail info: ${shortName}`);

    this.spinnerService.on();
    this.apiService
      .createOrganization(fullName, shortName)
      .subscribe(
        (res: any) => {
          console.log(res);
          // this.apiService.getAllOrganizations().subscribe((res: any) => {
          //   console.log("display Organization:")
          //   console.log(res)
          // })
          this.notificationService.showSuccess('Organization has been created!', '')
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Organization create failed!');
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });
  }
}
