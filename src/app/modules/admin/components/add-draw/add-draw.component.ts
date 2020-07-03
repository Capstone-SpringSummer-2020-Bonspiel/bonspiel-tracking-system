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

@Component({
  selector: 'app-add-draw',
  templateUrl: './add-draw.component.html',
  styleUrls: ['./add-draw.component.scss'],
})
export class AddDrawComponent implements OnInit {
  dateFilter;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  eventNames: any[] = [];
  eventDraws: any[] = [];
  selectedDraw;
  selectedEvent;
  drawDisplayedColumns: string[] = [
    'event_id',
    'name',
    'start',
    'video_url',
    'actions',
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrlName: ['', Validators.required],
      secondCtrlDate: ['', Validators.required],
      secondCtrlUrl: ['', Validators.required],
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

  selectEvent() {
    console.log('selectEvent()');
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventID= ${selectedEventID}`);
    this.selectedEvent = this.eventNames.filter(
      (x) => x.id === selectedEventID
    );
    console.log('selectedEvent');
    console.log(this.selectedEvent);
  }

  loadDrawInfo() {
    const newDrawName = this.secondFormGroup.value.secondCtrlName;
    const newDrawStart = this.secondFormGroup.value.secondCtrlDate;
    const newDrawUrl = this.secondFormGroup.value.secondCtrlUrl;
    console.log(`newDrawName= ${newDrawName}`);
    console.log(`newDrawStart= ${newDrawStart}`);
    console.log(`newDrawUrl= ${newDrawUrl}`);
  }
}
