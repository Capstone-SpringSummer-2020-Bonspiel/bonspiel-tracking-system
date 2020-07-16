import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

import * as moment from 'moment';

@Component({
  selector: 'app-create-draw',
  templateUrl: './create-draw.component.html',
  styleUrls: ['./create-draw.component.scss'],
})
export class CreateDrawComponent implements OnInit {
  dateFilter;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  eventNames: any[] = [];
  eventDraws: any[] = [];
  selectedEventId;
  selectedEvent;
  drawDisplayedColumns: string[] = [
    'event_id',
    'name',
    'start',
    'video_url',
    'actions',
  ];

  date: Date;
  showSpinners = true;
  minDate: Date;
  maxDate: Date;

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.date = new Date();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrlName: ['', Validators.required],
      secondCtrlDate: ['', Validators.required],
      secondCtrlUrl: [''],
    });

    this.spinnerService.on();
    this.apiService.getEvents().subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notificationService.showError(
          'Could not fetch curling events',
          'ERROR'
        );
        this.spinnerService.off();
        return;
      }
      this.spinnerService.off();
      this.eventNames = res;
    });
  }

  getEvent() {
    this.selectedEventId = this.firstFormGroup.value.firstCtrl;
    this.selectedEvent = this.eventNames.filter(
      (x) => x.id === this.selectedEventId
    );
    this.minDate = new Date(this.selectedEvent[0].begin_date.toString());
    this.maxDate = new Date(this.selectedEvent[0].end_date.toString());
  }

  onClickSubmit(stepper: MatStepper) {
    const newDrawName = this.secondFormGroup.value.secondCtrlName;
    const newDrawStart = this.secondFormGroup
      .get('secondCtrlDate')
      .value?.toLocaleString();
    const newDrawUrl = this.secondFormGroup.value.secondCtrlUrl;

    this.spinnerService.on();

    this.apiService.createDraw(this.selectedEventId.toString(), newDrawName, newDrawStart, newDrawUrl)
      .subscribe(
        (res: any) => {
          this.notificationService.showSuccess('Draw has been created', '');
          stepper.reset();
        },
        (error) => {
          this.notificationService.showError('Something went wrong', '');
        },
        () => {
          this.spinnerService.off()
        });
    ;
  }
}
