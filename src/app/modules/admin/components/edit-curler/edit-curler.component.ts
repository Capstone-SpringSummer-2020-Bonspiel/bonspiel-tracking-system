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
  selectedCurler;
  throwingOrders = [
    { value: 'lead', viewValue: 'Lead' },
    { value: 'second', viewValue: 'Second' },
    { value: 'third', viewValue: 'Third' },
    { value: 'fourth', viewValue: 'Fourth' },
    { value: 'alternate', viewValue: 'Alternate' },
  ];
  positions = [
    { value: 'skip', viewValue: 'Skip' },
    { value: 'vice', viewValue: 'Vice' },
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
      thirdCtrlName: [''],
      thirdCtrlThrowing: [''],
      thirdCtrlPosition: [''],
      thirdCtrlTeam: [''],
      thirdCtrlOrg: [''],
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
    console.log(`orgID = ${this.selectedOrganizationID}`);
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
    this.selectedCurler = this.curlers.find(
      (x) => x.id === this.secondFormGroup.value.secondCtrl
    );
    this.selectedCurler.organization = this.organizations.find(
      (x) => x.id === this.selectedCurler.affiliation
    );
    console.log('selectedcurler');
    console.log(this.selectedCurler);
  }

  onClickSubmit(stepper: MatStepper) {
    const newName =
      this.thirdFormGroup.value.thirdCtrlName || this.selectedCurler.name;
    const newPosition =
      this.thirdFormGroup.value.thirdCtrlPosition ||
      this.selectedCurler.position;
    const newTeam =
      this.thirdFormGroup.value.thirdCtrlTeam.toString() ||
      this.selectedCurler.curlingteam_id;
    const newOrg =
      this.thirdFormGroup.value.thirdCtrlOrg.toString() ||
      this.selectedCurler.affiliation;
    const newThrowing =
      this.thirdFormGroup.value.thirdCtrlThrowing ||
      this.selectedCurler.throwing_order;

    console.log(`this.selectedCurler.id= ${this.selectedCurler.id}`);
    console.log(`newname = ${newName}`);
    console.log(`new Position = ${newPosition}`);
    console.log(`new Team= ${newTeam}`);
    console.log(`new Org= ${newOrg}`);
    console.log(`new Throwing= ${newThrowing}`);
    this.spinnerService.on();

    this.apiService
      .editCurler(
        newName,
        newPosition,
        newOrg,
        newTeam,
        null,
        newThrowing,
        this.selectedCurler.id
      )
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
