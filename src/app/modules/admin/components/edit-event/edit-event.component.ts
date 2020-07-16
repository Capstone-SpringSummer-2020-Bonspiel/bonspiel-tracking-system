import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  selectedEvent: any = {
    name: 'name',
    info: 'info',
    begin_date: 'Date',
    end_date: 'Date',
    event_type: 'String',
    completed: true,
  }

  allEventData: null;
  selectedEventId: Number;

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
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        this.selectedEvent = res[0];
        this.selectedEventId = res[0].id;
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        this.spinnerService.off();
      })

    this.firstFormGroup = this._formBuilder.group({
      eventNameCtrl: [''],
      eventInfoCtrl: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      eventTypeCtrl: [''],
      eventFinishedCtrl: [''],
    });
    this.thirdFormGroup = this._formBuilder.group({
      eventStartCtrl: ['', Validators.required],
      eventEndCtrl: ['', Validators.required],
    });
  }

  onEventSelected(event: any) {
    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.selectedEvent = event.value;
    this.selectedEventId = event.value.id;

    console.log('the selected event is:');
    console.log(this.selectedEvent);
  }

  onClickSubmit(stepper) {
    //Edit Event
    var name = this.selectedEvent.name;
    if (this.firstFormGroup.value.eventNameCtrl != '') {
      name = this.firstFormGroup.value.eventNameCtrl;
    }
    var info = this.selectedEvent.info;
    if (this.firstFormGroup.value.eventInfoCtrl != '') {
      info = this.firstFormGroup.value.eventInfoCtrl;
    }
    var event_type = this.selectedEvent.event_type;
    if (this.secondFormGroup.value.eventTypeCtrl != '') {
      event_type = this.secondFormGroup.value.eventTypeCtrl;
    }
    var completed = this.selectedEvent.completed;
    if (this.secondFormGroup.value.eventFinishedCtrl != '') {
      completed = this.secondFormGroup.value.eventFinishedCtrl;
    }
    var begin_date = this.selectedEvent.begin_date;
    if (this.thirdFormGroup.value.eventStartCtrl != '') {
      begin_date = this.thirdFormGroup.value.eventStartCtrl;
    }
    var end_date = this.selectedEvent.end_date;
    if (this.thirdFormGroup.value.eventEndCtrl != '') {
      end_date = this.thirdFormGroup.value.eventEndCtrl;
    }
    console.log(`full name: ${name}`);
    console.log(`detail info: ${info}`);
    console.log(`begin-date: ${begin_date}`);
    console.log(`End-date: ${end_date}`);
    console.log(`event type: ${event_type}`);
    console.log(`complete: ${completed}`);

    this.spinnerService.on();
    this.apiService.editEvent(name, String(begin_date.toLocaleString()), String(end_date.toLocaleString()), String(completed), info, event_type, String(this.selectedEventId))
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Event has been successfully modified!', '')
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Event modified Failed!', '');
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });
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
  selector: 'edit-event-dialog',
  templateUrl: 'edit-event-dialog.html',
})
export class EditEventDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

// export interface Event {
//   name: String,
//   info: String,
//   begin_date: Date,
//   end_date: Date,
//   event_type: String,
//   completed: Boolean,
// }