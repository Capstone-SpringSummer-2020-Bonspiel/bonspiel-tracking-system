import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
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
      thirdCtrlPosition: ['', Validators.required],
    });

    this.spinnerService.on();
    this.apiService.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.organizations.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getAllTeams() {
    this.selectedOrganizationID = this.firstFormGroup.value.firstCtrl;
    this.spinnerService.on();
    this.apiService.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getTeamId() {
    this.selectedTeamID = this.secondFormGroup.value.secondCtrl;
  }

  onClickSubmit(stepper: MatStepper) {
    const name = this.thirdFormGroup.value.thirdCtrlName;
    const position = this.thirdFormGroup.value.thirdCtrlPosition;

    this.spinnerService.on();

    this.apiService
      .createCurler(
        name,
        position,
        this.selectedOrganizationID.toString(),
        this.selectedTeamID.toString()
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Curler has been created', '');
          stepper.reset();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError(error.message, 'ERROR');
        }
      )
      .add(() => {
        this.spinnerService.off();
      });
  }
}
