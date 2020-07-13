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
  fouthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  selectedEvent: any = {
    name: 'name',
    info: 'info',
    begin_date: 'Date',
    end_date: 'Date',
    event_type: 'String',
    completed: true,
  }
  feedBackData: any;
  allEventData: null;
  selectedEventId: Number;

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
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        this.spinnerService.off();
      })

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: [''],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: [''],
    });
    this.fouthFormGroup = this._formBuilder.group({
      fouthCtrl: [''],
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: [''],
    });
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: [''],
    });
  }

  onEventSelected(event: any) {
    console.log(this.allEventData);
    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.selectedEventId = event.value;
  }

  onEditCurlingEvent() {
    var name = this.selectedEvent.name;
    if (this.firstFormGroup.value.firstCtrl != '') {
      name = this.firstFormGroup.value.firstCtrl;
    }
    var info = this.selectedEvent.info;
    if (this.secondFormGroup.value.secondCtrl != '') {
      info = this.secondFormGroup.value.secondCtrl;
    }
    var event_type = this.selectedEvent.event_type;
    if (this.thirdFormGroup.value.thirdCtrl != '') {
      event_type = this.thirdFormGroup.value.thirdCtrl;
    }
    var completed = this.selectedEvent.completed;
    if (this.fouthFormGroup.value.fouthCtrl != '') {
      completed = this.fouthFormGroup.value.fouthCtrl;
    }
    var begin_date = this.selectedEvent.begin_date;
    if (this.fifthFormGroup.value.fifthCtrl != '') {
      begin_date = this.fifthFormGroup.value.fifthCtrl;
    }
    var end_date = this.selectedEvent.end_date;
    if (this.sixthFormGroup.value.sixthCtrl != '') {
      end_date = this.sixthFormGroup.value.sixthCtrl;
    }

    console.log(`full name: ${name}`);
    console.log(`detail info: ${info}`);
    console.log(`begin-date: ${begin_date}`);
    console.log(`End-date: ${end_date}`);
    console.log(`event type: ${event_type}`);
    console.log(`complete: ${completed}`);

    this.feedBackData = {
      signal: 200,
      name: name,
      info: info,
      begin_date: begin_date,
      end_date: end_date,
      event_type: event_type,
      completed: completed,
    }

    // this.spinnerService.on();
    // this.apiService
    //   .editEvent(name, begin_date, end_date, completed, info, event_type, this.selectedEvent)
    //   .subscribe((res: any) => {  
    //     this.spinnerService.off();
    //     this.feedBackData = res;
    //   })

    const dialogRef = this.dialog.open(EditEventDialog, {
      data: {
        signal: '200',
        name: name,
        info: info,
        begin_date: begin_date,
        end_date: end_date,
        event_type: event_type,
        completed: completed,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("something happened.")
    })

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