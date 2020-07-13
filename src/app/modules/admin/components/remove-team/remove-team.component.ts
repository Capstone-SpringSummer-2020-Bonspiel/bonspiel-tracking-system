import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
@Component({
  selector: 'app-remove-team',
  templateUrl: './remove-team.component.html',
  styleUrls: ['./remove-team.component.scss'],
})
export class RemoveTeamComponent implements OnInit {
  firstFormGroup: FormGroup;

  teams: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstFormCtrl: ['', Validators.required],
    });
    this.spinner.on();
    this.api.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      console.log(`teams=`);
      console.log(this.teams);
      this.spinner.off();
    });
  }

  getTeamId() {}

  onClickSubmit() {
    const teamId = this.firstFormGroup.value.firstFormCtrl;
    console.log(`teamId= ${teamId}`);
    this.api.removeTeam(teamId).subscribe(
      (res: any) => this.notifier.showSuccess('Team has been deleted', ''),
      (error) => {
        console.log(error);
        this.notifier.showError('Something went wrong', '');
      }
    );
  }
}
