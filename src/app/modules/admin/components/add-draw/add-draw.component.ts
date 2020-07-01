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
      dateControl: ['', Validators.required],
      secondCtrlUrl: ['', Validators.required],
    });

    this.api.getEvents().subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notifier.showError('Could not fetch curling events', 'ERROR');
        this.spinner.off();
        return;
      }
      this.eventNames = res;
      console.log('eventNames:');
      console.log(this.eventNames);
    });
  }

  loadEventID() {
    console.log('loadEventID()');
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventID= ${selectedEventID}`);
    this.selectedEvent = this.eventNames.filter(
      (x) => x.id === selectedEventID
    );
    console.log('selectedEvent');
    console.log(this.selectedEvent);
    // this.dateFilter = (d: Date | null): boolean => {
    //   const day = d || new Date().toISOString();
    //   console.log(day);
    //   console.log(JSON.stringify(this.selectedEvent));
    //   return day >= new Date('2020-06-15');
    // };
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
