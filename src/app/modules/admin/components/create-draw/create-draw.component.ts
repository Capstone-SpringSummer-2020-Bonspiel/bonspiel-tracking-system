import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
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
  selectedDraw;
  selectedEvent;
  drawDisplayedColumns: string[] = [
    'event_id',
    'name',
    'start',
    'video_url',
    'actions',
  ];

  //datetimepicker stuff
  public date: Date;
  public disabled = false;
  public showSpinners = true;

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
  });
  public dateControl = new FormControl(new Date());
  //end datetimepicker

  constructor(
    private _formBuilder: FormBuilder,
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService
  ) {}

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

    this.spinner.on();
    this.api.getEvents().subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notifier.showError('Could not fetch curling events', 'ERROR');
        this.spinner.off();
        return;
      }
      this.spinner.off();
      this.eventNames = res;
      console.log('eventNames:');
      console.log(this.eventNames);
    });
  }

  getEvent() {
    console.log('getEvent()');
    this.selectedEventId = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventID= ${this.selectedEventId}`);
    this.selectedEvent = this.eventNames.filter(
      (x) => x.id === this.selectedEventId
    );
    console.log('selectedEvent');
    console.log(this.selectedEvent);
  }

  onClickSubmit() {
    const newDrawName = this.secondFormGroup.value.secondCtrlName;
    const newDrawStart = this.secondFormGroup
      .get('secondCtrlDate')
      .value?.toLocaleString();
    const newDrawUrl = this.secondFormGroup.value.secondCtrlUrl;

    this.api
      .createDraw(
        this.selectedEventId.toString(),
        newDrawName,
        newDrawStart,
        newDrawUrl
      )
      .subscribe(
        (res: any) => this.notifier.showSuccess('Draw has been created', ''),
        (error) => {
          console.log(error);
          this.notifier.showError('Something went wrong', '');
        }
      );
  }
}
