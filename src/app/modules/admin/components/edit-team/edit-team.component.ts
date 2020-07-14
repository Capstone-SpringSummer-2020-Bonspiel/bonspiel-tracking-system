import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
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
  selectedTeamId;

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
      secondCtrlNote: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrlOrg: [null],
    });

    this.spinnerService.on();
    this.apiService.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      this.apiService.getAllOrganizations().subscribe((res: any) => {
        this.organizations = res;
        this.organizations.sort((a, b) => (a.full_name > b.full_name ? 1 : -1));
        this.spinnerService.off();
      });
    });
  }

  getTeamId() {
    this.selectedTeamId = this.firstFormGroup.value.firstCtrl;
  }

  onClickSubmit() {
    const name = this.secondFormGroup.value.secondCtrl;
    const note = this.secondFormGroup.value.secondCtrlNote;
    const org = this.thirdFormGroup.value.thirdCtrlOrg;
    this.apiService.editTeam(this.selectedTeamId, name, note, org).subscribe(
      (res: any) =>
        this.notificationService.showSuccess('Team has been created', ''),
      (error) => {
        this.notificationService.showError('Something went wrong', '');
      }
    );
  }
}
