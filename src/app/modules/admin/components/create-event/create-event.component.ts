import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  formGroup: FormGroup;

  eventDetails = [
    { value: 'Bonspiel', label: 'Bonspiel' },
    { value: 'Championship', label: 'Championship' },
    { value: 'Playdowns', label: 'Playdowns' },
  ];

  eventTypes: any[] = [
    { value: 'pools', label: 'Pool' },
    { value: 'brackets', label: 'Bracket' },
    { value: 'championship', label: 'Championship' },
    // { value: 'friendly', label: 'Friendly' },
  ];

  statusTypes: any[] = [
    { value: false, label: 'Not Started' },
    { value: false, label: 'In Progress' },
    { value: true, label: 'Finished' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // Initialize form group
    this.formGroup = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          eventNameCtrl: ['', Validators.required],
          eventInfoCtrl: ['', Validators.required],
        }),
        this.fb.group({
          eventTypeCtrl: ['', Validators.required],
          eventFinishedCtrl: ['', Validators.required],
        }),
        this.fb.group({
          eventStartCtrl: ['', Validators.required],
          eventEndCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  // Returns a FormArray with the name 'formArray'
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  onClickSubmit(stepper: MatStepper) {
    const name = this.formGroup.value.formArray[0].eventNameCtrl;
    const info = this.formGroup.value.formArray[0].eventInfoCtrl;
    const event_type = this.formGroup.value.formArray[1].eventTypeCtrl;
    const completed = String(this.formGroup.value.formArray[1].eventFinishedCtrl);
    const begin_date = String(this.formGroup.value.formArray[2].eventStartCtrl.toLocaleString());
    const end_date = String(this.formGroup.value.formArray[2].eventEndCtrl.toLocaleString());

    // Create Event
    this.spinnerService.on();
    this.apiService.createEvent(name, info, event_type, completed, begin_date, end_date)
      .subscribe(
        (res) => {
          console.log(res);
          this.notificationService.showSuccess('Event has been created!', '');

          // Reset the stepper
          stepper.reset();

          // Reset the form and validation
          this.formGroup.reset()
          Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.controls[key].setErrors(null)
          });
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Event create failed!');
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });
  }
}

export interface DialogData {
  signal: String;
  name: String;
  info: String;
  begin_date: String;
  end_date: String;
  event_type: String;
  completed: String;
}

@Component({
  selector: 'create-event-dialog',
  templateUrl: 'create-event-dialog.html',
})
export class CreateEventDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
