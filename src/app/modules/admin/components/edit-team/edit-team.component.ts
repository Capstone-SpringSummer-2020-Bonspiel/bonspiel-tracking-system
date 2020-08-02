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
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
      secondCtrlNote: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      thirdCtrlOrg: [null],
    });

    this.spinnerService.on();

    this.getTeamsAndOrganizations();
  }

  getTeamsAndOrganizations() {
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
    this.selectedTeam = this.teams.filter(x => x.id === this.firstFormGroup.value.firstCtrl)[0];
    console.log('this.selectedTeam ', this.selectedTeam);

    this.secondFormGroup.controls.secondCtrl.setValue(this.selectedTeam.team_name);

    this.secondFormGroup.controls.secondCtrlNote.setValue(this.selectedTeam.note);
  }

  onClickSubmit(stepper: MatStepper) {
    const name = this.secondFormGroup.value.secondCtrl;
    const note = this.secondFormGroup.value.secondCtrlNote;
    const org = this.thirdFormGroup.value.thirdCtrlOrg;

    this.spinnerService.on();

    this.apiService
      .editTeam(this.selectedTeam.id, name, note, org)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Team has been modified', '');
          this.spinnerService.off();
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'ERROR');
          this.spinnerService.off();
        }
      )
      .add(() => {
        stepper.reset();
        // Reset the form and validation
        let formGroups = [this.firstFormGroup, this.secondFormGroup];
        for (let formGroup of formGroups) {
          formGroup.reset();
          Object.keys(formGroup.controls).forEach((key) => {
            formGroup.controls[key].setErrors(null);
          });
        }
        this.getTeamsAndOrganizations();
      });
  }
}
