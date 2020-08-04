import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss'],
})
export class EditTeamComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  organizations: any[] = [];
  teams: any[] = [];
  selectedTeam: any;


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      teamCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      secondCtrlName: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      thirdCtrlNote: [''],
      thirdCtrlOrg: [null],
    });

    this.getTeamsAndOrganizations();
  }

  getTeamsAndOrganizations() {
    this.spinnerService.on();
    this.apiService.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      console.log('this.teams');
      console.log(this.teams);
      this.apiService.getAllOrganizations().subscribe((res: any) => {
        this.organizations = res;
        this.organizations.sort((a, b) => (a.full_name > b.full_name ? 1 : -1));
        this.spinnerService.off();
      });
    });
  }

  getTeamId() {
    this.selectedTeam = this.teams.filter(x => x.id === this.firstFormGroup.value.teamCtrl)[0];
    console.log('this.selectedTeam ', this.selectedTeam);

    this.secondFormGroup.controls.secondCtrlName.setValue(this.selectedTeam.team_name);

    this.thirdFormGroup.controls.thirdCtrlNote.setValue(this.selectedTeam.note);
  }

  onClickSubmit(stepper: MatStepper) {
    const name = this.secondFormGroup.value.secondCtrlName;
    const note = this.thirdFormGroup.value.thirdCtrlNote;
    const org = this.thirdFormGroup.value.thirdCtrlOrg;

    this.spinnerService.on();

    this.apiService
      .editTeam(this.selectedTeam.id, name, note, org)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Team has been modified', '');

          // Reset the form and validation
          stepper.reset();

          let formGroups = [this.firstFormGroup, this.secondFormGroup, this.thirdFormGroup];

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
        this.getTeamsAndOrganizations();
      });
  }
}
