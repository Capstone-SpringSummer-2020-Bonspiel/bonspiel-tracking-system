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
  formGroup: FormGroup;
  teams: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Initialize form group
    this.formGroup = this.fb.group({
      teamIdCtrl: ['', Validators.required],
    });

    console.log(this.formGroup);

    this.getTeams();
  }

  getTeams() {
    // Get teams
    this.spinnerService.on();
    this.apiService.getAllTeams()
      .subscribe(
        (res: any) => {
          this.teams = res;
          this.teams.sort((a, b) => (a.team_name > b.team_name ? 1 : -1));

        })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const teamId = this.formGroup.get('teamIdCtrl').value;

    // Delete team
    this.spinnerService.on();
    this.apiService
      .deleteTeam(teamId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Team has been removed', '');

          // Reset the stepper
          stepper.reset();

          // // Reset the form and validation
          // this.formGroup.reset()
          // Object.keys(this.formGroup.controls).forEach(key => {
          //   this.formGroup.controls[key].setErrors(null)
          // });

          // Re-fetch teams
          this.getTeams();
        },
        (err) => {
          console.log(err.message);
          this.notificationService.showError(err.message, 'Something went wrong');
        }
      )
      .add(() => {
        this.spinnerService.off();
      });
  }
}
