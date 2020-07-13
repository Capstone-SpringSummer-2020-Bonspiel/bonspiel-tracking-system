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
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrlNote: [''],
      thirdCtrlOrg: [null],
    });

    this.spinner.on();
    this.api.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      console.log(`teams=`);
      console.log(this.teams);
      this.api.getAllOrganizations().subscribe((res: any) => {
        this.organizations = res;
        this.organizations.sort((a, b) => (a.full_name > b.full_name ? 1 : -1));
        this.spinner.off();
        console.log('organizations=');
        console.log(this.organizations);
      });
    });
  }

  getTeamId() {
    this.selectedTeamId = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedTeamId= ${this.selectedTeamId}`);
  }

  onClickSubmit() {
    const name = this.secondFormGroup.value.secondCtrl;
    const note = this.thirdFormGroup.value.thirdCtrlNote;
    const org = this.thirdFormGroup.value.thirdCtrlOrg;
    console.log(`name= ${name}`);
    console.log(`note= ${note}`);
    console.log(`org= ${org}`);
    this.api.editTeam(this.selectedTeamId, name, note, org).subscribe(
      (res: any) => this.notifier.showSuccess('Team has been created', ''),
      (error) => {
        console.log(error);
        this.notifier.showError('Something went wrong', '');
      }
    );
  }
}
