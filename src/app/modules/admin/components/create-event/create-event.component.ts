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
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  eventDetails = [
    { value: 'Bonspiel', label: 'Bonspiel' },
    { value: 'Championship', label: 'Championship' },
    { value: 'Playdowns', label: 'Playdowns' },
  ];

  eventTypes: any[] = [
    { value: 'pools', label: 'Pool' },
    { value: 'brackets', label: 'Bracket' },
    { value: 'championship', label: 'Championship' },
    { value: 'friendly', label: 'Friendly' },
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
  ) { }

  ngOnInit() {
    // Initialize form group
    this.firstFormGroup = this.fb.group({
      eventNameCtrl: ['', Validators.required],
      eventInfoCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      eventTypeCtrl: ['', Validators.required],
      eventFinishedCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      eventStartCtrl: ['', Validators.required],
      eventEndCtrl: ['', Validators.required],
    });
  }

  onClickSubmit(stepper: MatStepper) {
    const name = this.firstFormGroup.controls.eventNameCtrl.value;
    const begin_date = String(this.thirdFormGroup.controls.eventStartCtrl.value.toLocaleString());
    const end_date = String(this.thirdFormGroup.controls.eventEndCtrl.value.toLocaleString());
    const completed = String(this.secondFormGroup.controls.eventFinishedCtrl.value);
    const info = this.firstFormGroup.controls.eventInfoCtrl.value;
    const event_type = this.secondFormGroup.controls.eventTypeCtrl.value;

    this.spinnerService.on();
    this.apiService.createEvent(name, begin_date, end_date, completed, info, event_type)
      .subscribe(
        (res) => {
          console.log(res);
          this.notificationService.showSuccess('Event has been created!', '');

          // Reset the stepper, forms and validation
          stepper.reset();

          let formGroups = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup
          ]

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err.message);
          this.notificationService.showError(err.message, 'Event create failed!');
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
