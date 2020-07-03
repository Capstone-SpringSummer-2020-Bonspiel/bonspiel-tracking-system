import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';


@Component({
  selector: 'app-create-curling-event',
  templateUrl: './create-curling-event.component.html',
  styleUrls: ['./create-curling-event.component.scss'],
})


export class CreateCurlingEventComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fouthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;

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

  constructor(private _formBuilder: FormBuilder, private api: ApiService, private spinner: SpinnerService, private notifier: NotificationService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });
    this.fouthFormGroup = this._formBuilder.group({
      fouthCtrl: ['', Validators.required],
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required],
    });
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required],
    });
  }

  createCurlingEvent() {
    const name = this.firstFormGroup.value.firstCtrl;
    const info = this.secondFormGroup.value.secondCtrl;
    const event_type = this.thirdFormGroup.value.thirdCtrl;
    const completed = this.fouthFormGroup.value.fouthCtrl;
    const begin_date = this.fifthFormGroup.value.fifthCtrl;
    const end_date = this.sixthFormGroup.value.sixthCtrl;
    console.log(`full name: ${name}`);
    console.log(`detail info: ${info}`);
    console.log(`begin-date: ${begin_date}`);
    console.log(`End-date: ${end_date}`);
    console.log(`event type: ${event_type}`);
    console.log(`complete: ${completed}`);
  }
}
