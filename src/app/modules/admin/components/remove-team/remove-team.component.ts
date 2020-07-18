import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
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
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      firstFormCtrl: ['', Validators.required],
    });
    this.spinnerService.on();
    this.apiService.getAllTeams().subscribe((res: any) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getTeamId() { }

  onClickSubmit(stepper: MatStepper) {
    const teamId = this.firstFormGroup.value.firstFormCtrl;

    this.spinnerService.on();

    this.apiService
      .removeTeam(teamId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Team has been deleted', '');
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
