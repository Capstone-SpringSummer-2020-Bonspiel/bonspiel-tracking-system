import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
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
  secondFormGroup: FormGroup;

  feedBackData: null;

  eventTypes: any[] = [
    { value: 'pool', viewValue: 'Pool' },
    { value: 'bracket', viewValue: 'Bracket' },
    { value: 'championship', viewValue: 'Championship' },
    { value: 'friendly', viewValue: 'Friendly' },
  ];
  statusTypes: any[] = [
    { value: false, viewValue: 'In Progress' },
    { value: true, viewValue: 'Finished' },
  ];

  constructor(private _formBuilder: FormBuilder, private api: ApiService, private spinner: SpinnerService, private notifier: NotificationService, public dialog: MatDialog) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

  }

  createOrginization() {
    const fullName = this.firstFormGroup.value.firstCtrl;
    const shortName = this.secondFormGroup.value.secondCtrl;

    console.log(`full name: ${fullName}`);
    console.log(`detail info: ${shortName}`);

    // this.spinner.on();
    // this.api
    //   .createEvent(name, begin_date, end_date, completed, info, event_type)
    //   .subscribe((res: any) => {
    //     this.feedBackData = res;
    //     console.log(res);
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log("something happened.")
    //     })
    //     this.spinner.off();
    //   })

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
