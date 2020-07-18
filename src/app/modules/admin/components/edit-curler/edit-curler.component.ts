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
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-edit-curler',
  templateUrl: './edit-curler.component.html',
  styleUrls: ['./edit-curler.component.scss'],
})
export class EditCurlerComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  organizations: any[] = [];
  curlers: any[] = [];
  teams: any[] = [];
  selectedOrganizationID;
  selectedTeamID;
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
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      thirdCtrlName: ['', Validators.required],
      thirdCtrlPosition: ['', Validators.required],
      thirdCtrlTeam: ['', Validators.required],
      thirdCtrlOrg: ['', Validators.required],
    });

    this.spinnerService.on();
    this.apiService.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.organizations.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.apiService.getAllTeams().subscribe((res: any) => {
        this.teams = res;
        this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
        this.spinnerService.off();
      });
    });
  }
  getOrgCurlers() {
    this.selectedOrganizationID = this.firstFormGroup.value.firstCtrl;
    this.spinnerService.on();
    this.apiService
      .getCurlersByOrganization(this.selectedOrganizationID)
      .subscribe((res: any) => {
        this.curlers = res;
        this.curlers.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.spinnerService.off();
      });
  }

  getCurlerId() {
    this.selectedCurlerID = this.secondFormGroup.value.secondCtrl;
  }

  onClickSubmit(stepper: MatStepper) {
    const newName = this.thirdFormGroup.value.thirdCtrlName || null;
    const newPosition = this.thirdFormGroup.value.thirdCtrlPosition || null;
    const newTeam = this.thirdFormGroup.value.thirdCtrlTeam.toString() || null;
    const newOrg = this.thirdFormGroup.value.thirdCtrlOrg.toString() || null;

    this.spinnerService.on();

    this.apiService
      .editCurler(newName, newPosition, newOrg, newTeam, this.selectedCurlerID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Curler has been modified', '');
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
