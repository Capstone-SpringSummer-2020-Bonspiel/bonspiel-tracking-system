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
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstFormCtrl: ['', Validators.required],
    });
    this.spinnerService.on();
    this.apiService.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getTeamId() {}

  onClickSubmit() {
    const teamId = this.firstFormGroup.value.firstFormCtrl;
    this.apiService.removeTeam(teamId).subscribe(
      (res: any) =>
        this.notificationService.showSuccess('Team has been deleted', ''),
      (error) => {
        this.notificationService.showError('Something went wrong', '');
      }
    );
  }
}
