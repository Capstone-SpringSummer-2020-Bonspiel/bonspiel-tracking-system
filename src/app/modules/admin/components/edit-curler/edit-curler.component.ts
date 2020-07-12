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
  selector: 'app-edit-curler',
  templateUrl: './edit-curler.component.html',
  styleUrls: ['./edit-curler.component.scss'],
})
export class EditCurlerComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

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
      thirdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrlName: ['', Validators.required],
      fourthCtrlPosition: ['', Validators.required],
    });

    this.spinner.on();
    this.api.getAllOrgs().subscribe((res: any) => {
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
    this.spinner.on();
    this.api.getTeam(this.selectedTeamID).subscribe((res: any) => {
      this.selectedTeam = res;
      this.spinner.off();
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
    const name = this.fourthFormGroup.value.fourthCtrlName;
    const position = this.fourthFormGroup.value.fourthCtrlPosition;
    console.log(`name= ${name}`);
    console.log(`position= ${position}`);
    this.api
      .editCurler(
        name,
        position,
        this.selectedOrganizationID.toString(),
        this.selectedTeamID.toString(),
        this.selectedCurlerID
      )
      .subscribe(
        (res: any) => this.notifier.showSuccess('Curler has been modified', ''),
        (error) => {
          console.log(error);
          this.notifier.showError('Something went wrong', '');
        }
      );
  }
}
