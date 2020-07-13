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
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
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

    this.spinnerService.on();
    this.apiService.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.spinnerService.off();
      console.log('organizations:');
      console.log(this.organizations);
    });
  }

  getOrgTeams() {
    console.log('getOrgTeams()');
    this.selectedOrganizationID = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedOrgID= ${this.selectedOrganizationID}`);
    this.spinnerService.on();
    this.apiService.getTeamsByEventId(this.selectedOrganizationID).subscribe((res: any) => {
      this.teams = res;
      this.spinnerService.off();
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
    this.apiService
      .createCurler(
        name,
        position,
        this.selectedOrganizationID.toString(),
        this.selectedTeamID.toString()
      )
      .subscribe(
        (res: any) => this.notificationService.showSuccess('Curler has been created', ''),
        (error) => {
          console.log(error);
          this.notificationService.showError('Something went wrong', '');
        }
      );
  }
}
