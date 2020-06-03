import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  selectedValue: string;

  eventTypes: any[] = [
    { value: 'bracket', viewValue: 'Bracket' },
    { value: 'pool', viewValue: 'Pool' },
    { value: 'championship', viewValue: 'Championship' }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService) { }

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

    this.api.fetchCurlingEvents().subscribe((data) => {
      console.log('test sql:');
      console.log(data);
    });
  }

  createOrganization() {
    this.spinner.on();

    const fullName = this.firstFormGroup.value.firstCtrl;
    const shortName = this.secondFormGroup.value.secondCtrl;
    const eventType = this.thirdFormGroup.value.thirdCtrl;
    console.log(`full name: ${fullName}`);
    console.log(`short name: ${shortName}`);
    console.log(`event type: ${eventType}`);

    this.api.createCurlingEvent(fullName, eventType, `info: short name is ${shortName}`, false, Date.now(), Date.now())
      .subscribe((data) => {
        console.log('res:');
        console.log(data);
        this.spinner.off();
      }, (err) => {
        console.log(err);
        this.spinner.off();
      });
  }
}
