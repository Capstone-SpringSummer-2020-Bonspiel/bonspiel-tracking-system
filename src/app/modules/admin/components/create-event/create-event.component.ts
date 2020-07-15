import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  eventTypes: any[] = [
    { value: 'pools', viewValue: 'Pools' },
    { value: 'brackets', viewValue: 'Brackets' },
    { value: 'championship', viewValue: 'Championship' },
    { value: 'friendly', viewValue: 'Friendly' },
  ];
  statusTypes: any[] = [
    { value: false, viewValue: 'In Progress' },
    { value: true, viewValue: 'Finished' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nameDataCtrl: ['', Validators.required],
      infoDataCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      typeDataCtrl: ['', Validators.required],
      condDataCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      begDateCtrl: ['', Validators.required],
      endDateCtrl: ['', Validators.required],
    });
  }

  onCreateCurlingEvent() {
    const name = this.firstFormGroup.value.nameDataCtrl;
    const info = this.firstFormGroup.value.infoDataCtrl;
    const event_type = this.secondFormGroup.value.typeDataCtrl;
    const completed = this.secondFormGroup.value.condDataCtrl;
    const begin_date = this.thirdFormGroup.value.begDateCtrl;
    const end_date = this.thirdFormGroup.value.endDateCtrl;
    console.log(`full name: ${name}`);
    console.log(`detail info: ${info}`);
    console.log(`begin-date: ${begin_date}`);
    console.log(`End-date: ${end_date}`);
    console.log(`event type: ${event_type}`);
    console.log(`complete: ${completed}`);

    this.spinnerService.on();

    this.apiService.createEvent(name, String(begin_date.toLocaleString()), String(end_date.toLocaleString()), String(completed), info, event_type)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Event has been created', '')
          this.spinnerService.off()
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Something went wrong', '');
        }
      )

    // const dialogRef = this.dialog.open(CreateEventDialog, {
    //   data: {
    //     signal: '200',
    //     name: name,
    //     info: info,
    //     begin_date: begin_date,
    //     end_date: end_date,
    //     event_type: event_type,
    //     completed: completed,
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log("something happened.")
    // })

  }
}
export interface DialogData {
  signal: String,
  name: String,
  info: String,
  begin_date: String,
  end_date: String,
  event_type: String,
  completed: String,
}

@Component({
  selector: 'create-event-dialog',
  templateUrl: 'create-event-dialog.html',
})
export class CreateEventDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}