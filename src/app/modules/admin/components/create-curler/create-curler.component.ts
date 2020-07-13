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

@Component({
  selector: 'app-create-curler',
  templateUrl: './create-curler.component.html',
  styleUrls: ['./create-curler.component.scss'],
})
export class CreateCurlerComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  organizations: any[] = [];
  teams: any[] = [];
  selectedOrganizationID;
  selectedTeamID;
  positions = [
    { value: 'skip', viewValue: 'Skip' },
    { value: 'vice', viewValue: 'Vice' },
    { value: 'second', viewValue: 'Second' },
    { value: 'lead', viewValue: 'Lead' },
    { value: 'fourth', viewValue: 'Fourth' },
    { value: 'alternate', viewValue: 'Alternate' },
  ];
  constructor(
    private _formBuilder: FormBuilder,
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrlName: ['', Validators.required],
      thirdCtrlPosition: ['', Validators.required],
    });

    this.spinner.on();
    this.api.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.spinner.off();
      console.log('organizations:');
      console.log(this.organizations);
    });
  }

  getOrgTeams() {
    console.log('getOrgTeams()');
    this.selectedOrganizationID = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedOrgID= ${this.selectedOrganizationID}`);
    this.spinner.on();
    this.api.getTeamsByEventId(this.selectedOrganizationID).subscribe((res: any) => {
      this.teams = res;
      this.spinner.off();
      console.log('teams:');
      console.log(this.teams);
    });
  }

  getTeamId() {
    console.log('getTeamId()');
    this.selectedTeamID = this.secondFormGroup.value.secondCtrl;
    console.log(`selectedTeamID= ${this.selectedTeamID}`);
  }

  onClickSubmit() {
    console.log('onClickSubmit()');
    console.log(`selectedOrgID= ${this.selectedOrganizationID}`);
    console.log(`selectedTeamID= ${this.selectedTeamID}`);
    const name = this.thirdFormGroup.value.thirdCtrlName;
    const position = this.thirdFormGroup.value.thirdCtrlPosition;
    console.log(`name= ${name}`);
    console.log(`position= ${position}`);
    this.api
      .createCurler(
        name,
        position,
        this.selectedOrganizationID.toString(),
        this.selectedTeamID.toString()
      )
      .subscribe(
        (res: any) => this.notifier.showSuccess('Curler has been created', ''),
        (error) => {
          console.log(error);
          this.notifier.showError('Something went wrong', '');
        }
      );
  }
}
