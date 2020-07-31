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
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      orgIdCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      teamIdCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      curlerNameCtrl: ['', Validators.required],
      curlerThrowingOrderCtrl: [''],
      curlerPositionCtrl: [''],
    });

    this.spinnerService.on();
    this.apiService.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.organizations.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getAllTeams() {
    this.selectedOrganizationID = this.firstFormGroup.value.orgIdCtrl;
    this.spinnerService.on();
    this.apiService.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getTeamId() {
    this.selectedTeamID = this.secondFormGroup.value.teamIdCtrl;
  }

  onClickSubmit(stepper: MatStepper) {
    const name = this.thirdFormGroup.value.curlerNameCtrl;
    const throwingOrder = this.thirdFormGroup.value.curlerThrowingOrderCtrl || null;
    const position = this.thirdFormGroup.value.curlerPositionCtrl || null;
    const photoObj = null;

    this.spinnerService.on();
    this.apiService
      .createCurler(name, position, this.selectedOrganizationID.toString(), this.selectedTeamID.toString(), photoObj, throwingOrder)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Curler has been created', '');

          // Reset the stepper, forms and validation
          stepper.reset();

          let formGroups = [
            this.firstFormGroup,
            this.secondFormGroup
          ]

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'ERROR');
        }
      )
      .add(() => {
        this.spinnerService.off();
      });
  }
}
