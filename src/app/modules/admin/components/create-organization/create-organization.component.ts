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
  // secondFormGroup: FormGroup;

  feedBackData: null;

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      secondCtrl: ['', Validators.required],
    });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required],
    // });

  }

  createOrganization() {
    const fullName = this.firstFormGroup.value.firstCtrl;
    const shortName = this.firstFormGroup.value.secondCtrl;

    console.log(`full name: ${fullName}`);
    console.log(`detail info: ${shortName}`);

    this.spinnerService.on();
    this.apiService
      .createOrganization(fullName, shortName)
      .subscribe((res: any) => {
        this.feedBackData = res;
        console.log(res);

        this.apiService.getAllOrganizations().subscribe((res: any) => {
          console.log(res)
        })
        this.spinnerService.off();
      })

    // const dialogRef = this.dialog.open(Create, {
    //   data: {
    //     signal: '200',
    //     name: name,
    //     info: info,
    //     // begin_date: begin_date,
    //     // end_date: end_date,
    //     // event_type: event_type,
    //     // completed: completed,
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log("something happened.")
    // })

  }
}
