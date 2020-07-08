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
  selector: 'app-edit-draw',
  templateUrl: './edit-draw.component.html',
  styleUrls: ['./edit-draw.component.scss'],
})
export class EditDrawComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  eventNames: any[] = [];
  eventDraws: any[] = [];
  selectedEvent;
  selectedDrawId;

  minDate;
  maxDate;

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
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrlName: ['', Validators.required],
      thirdCtrlDate: ['', Validators.required],
      thirdCtrlUrl: [''],
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
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventID= ${selectedEventID}`);
    this.selectedEvent = this.eventNames.filter(
      (x) => x.id === selectedEventID
    );
    this.spinner.on();
    this.api.getDraws(selectedEventID).subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notifier.showError('Could not fetch draws', 'ERROR');
        this.spinner.off();
        return;
      }
      this.eventDraws = res;
      console.log('eventDraws:');
      console.log(this.eventDraws);
      this.spinner.off();
    });
  }

  getDraw() {
    console.log('getDraw()');
    this.selectedDrawId = this.secondFormGroup.value.secondCtrl;
    console.log(`selectedDrawID: ${this.selectedDrawId}`);
    this.minDate = new Date(this.selectedEvent[0].begin_date.toString());
    this.maxDate = new Date(this.selectedEvent[0].end_date.toString());
    console.log(this.minDate);
    console.log(this.maxDate);
  }

  onClickSubmit() {
    const newDrawName = this.thirdFormGroup.value.thirdCtrlName;
    const newDrawStart = this.thirdFormGroup
      .get('thirdCtrlDate')
      .value?.toLocaleString();
    const newDrawUrl = this.thirdFormGroup.value.thirdCtrlUrl;

    this.api
      .editDraw(this.selectedDrawId, newDrawStart, newDrawStart, newDrawUrl)
      .subscribe(
        (res: any) => this.notifier.showSuccess('Draw has been modified', ''),
        (error) => {
          console.log(error);
          this.notifier.showError('Something went wrong', '');
        }
      );
  }
}
