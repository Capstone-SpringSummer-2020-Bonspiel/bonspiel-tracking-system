import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  events: any[] = [];
  selectedEvent = null;

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
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.zeroFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.firstFormGroup = this.fb.group({
      nameCtrl: ['', Validators.required],
      infoCtrl: [''],
    });
    this.secondFormGroup = this.fb.group({
      typeCtrl: [''],
      conditionCtrl: [''],
    });
    this.thirdFormGroup = this.fb.group({
      startCtrl: [''],
      endCtrl: [''],
    });

    this.getEvents();
  }

  getEvents() {
    this.spinnerService.on();
    this.apiService.getEvents().subscribe((res: any) => {
      this.events = res;
      this.events.sort((a, b) => a.name > b.name ? 1 : -1);
      console.log('events');
      console.log(this.events);
      this.spinnerService.off();
    });
  }

  selectEvent() {
    this.selectedEvent = this.events.filter(x => x.id === this.zeroFormGroup.value.eventCtrl)[0];
    console.log('selectedEvent');
    console.log(this.selectedEvent);
    this.firstFormGroup.controls.nameCtrl.setValue(this.selectedEvent.name)
    this.firstFormGroup.controls.infoCtrl.setValue(this.selectedEvent.info);
  }

  onClickSubmit(stepper: MatStepper) {
    const name = this.firstFormGroup.value.nameCtrl;
    const info = this.firstFormGroup.value.infoCtrl || (this.selectedEvent.info ? this.selectedEvent.info : "");
    const type = this.secondFormGroup.value.typeCtrl || this.selectedEvent.event_type;
    const condition = this.secondFormGroup.value.conditionCtrl || this.selectedEvent.completed;
    // const beginDate = this.thirdFormGroup.value.startCtrl || this.selectedEvent.begin_date;
    // const endDate = this.thirdFormGroup.value.endCtrl || this.selectedEvent.end_date;

    var beginDate = null;
    var adjustBeginDate = null;
    if (this.thirdFormGroup.value.startCtrl) {
      beginDate = String(this.thirdFormGroup.controls.startCtrl.value.toLocaleString());
    } else {
      adjustBeginDate = new Date(this.selectedEvent.begin_date)
      beginDate = String(adjustBeginDate.toLocaleString());
    }

    var endDate = null;
    var adjustEndTime = null;
    if (this.thirdFormGroup.value.endCtrl) {
      adjustEndTime = new Date(this.thirdFormGroup.controls.endCtrl.value.getTime() + (23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000));
      endDate = String(adjustEndTime.toLocaleString());
    } else {
      adjustEndTime = new Date(this.selectedEvent.end_date)
      endDate = String(adjustEndTime.toLocaleString());
    }

    // console.log(this.selectedEvent.begin_date)
    // console.log(this.selectedEvent.end_date)
    // console.log('----------------')
    // console.log(beginDate)
    // console.log(endDate)
    // console.log("final data ---------------------")
    // console.log(`full name: ${name}`);
    // console.log(`detail info: ${info}`);
    // console.log(`event type: ${type}`);
    // console.log(`complete: ${condition}`);
    // console.log(`begin-date: ${beginDate}`);
    // console.log(`End-date: ${endDate}`);

    this.spinnerService.on();
    this.apiService.editEvent(name, info, type, condition, beginDate, endDate, this.selectedEvent.id)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess(
            'Event has been modified',
            ''
          );
          // Reset the form and validation
          stepper.reset();

          let formGroups = [this.zeroFormGroup, this.firstFormGroup, this.secondFormGroup, this.thirdFormGroup];

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
        })
      .add(
        () => {
          this.spinnerService.off();
          this.getEvents();
        });

  }
}