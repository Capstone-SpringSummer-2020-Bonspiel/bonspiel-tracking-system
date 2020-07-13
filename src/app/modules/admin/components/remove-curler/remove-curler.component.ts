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
  selector: 'app-remove-curler',
  templateUrl: './remove-curler.component.html',
  styleUrls: ['./remove-curler.component.scss'],
})
export class RemoveCurlerComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  organizations: any[] = [];
  teams: any[] = [];
  selectedOrganizationID;
  selectedTeamID;
  selectedTeam;
  selectedCurlerID;
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
      thirdCtrl: ['', Validators.required],
    });

    this.spinnerService.on();
    const query = 'SELECT * from organization';
    this.apiService.adHocQuery(query).subscribe((res: any) => {
      this.organizations = res.rows;
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
    this.spinnerService.on();
    this.apiService.getTeams(this.selectedTeamID).subscribe((res: any) => {
      this.selectedTeam = res;
      this.spinnerService.off();
      console.log('selectedTeam: ');
      console.log(this.selectedTeam);
    });
  }

  getCurlerId() {
    console.log('getCurlerId()');
    this.selectedCurlerID = this.thirdFormGroup.value.thirdCtrl;
    console.log(`selectedCurlerID= ${this.selectedCurlerID}`);
  }

  onClickSubmit() {
    console.log('onClickSubmit()');
    console.log(`selectedOrgID= ${this.selectedOrganizationID}`);
    console.log(`selectedTeamID= ${this.selectedTeamID}`);
    this.apiService.removeCurler(this.selectedCurlerID).subscribe(
      (res: any) => this.notificationService.showSuccess('Curler has been removed', ''),
      (error) => {
        console.log(error);
        this.notificationService.showError('Something went wrong', '');
      }
    );
  }
}
