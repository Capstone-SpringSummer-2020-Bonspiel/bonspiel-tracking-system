import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { MatStepper } from '@angular/material/stepper';
import { forkJoin } from 'rxjs';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-add-team-to-event',
  templateUrl: './add-team-to-event.component.html',
  styleUrls: ['./add-team-to-event.component.scss'],
})
export class AddTeamToEventComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  events: any = [];
  teams: any = [];

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
      eventIdCtrl: ['', Validators.required],
    });

    // Get Events and Teams
    this.spinnerService.on();
    forkJoin({
      events: this.apiService.getEvents(),
      teams: this.apiService.getAllTeams()
    }).subscribe((res: any) => {

      this.events = res.events;
      console.log('events:');
      console.log(this.events);

      this.teams = res.teams;
      this.teams.sort((a, b) => (a.team_name.toLowerCase() > b.team_name.toLowerCase() ? 1 : -1));
      console.log('teams:');
      console.log(this.teams);

      this.spinnerService.off();
    });
  }

  onClickSubmit(stepper: MatStepper) {
    const teamId = this.firstFormGroup.value.teamCtrl;
    const eventId = this.secondFormGroup.value.eventIdCtrl;

    console.log('eventId', eventId);
    console.log('teamId', teamId);

    this.spinnerService.on();
    this.apiService
      .addTeamToEvent(teamId, eventId)
      .subscribe(
        (res: any) => {
          console.log(res)
          this.notificationService.showSuccess('Pool has been created', '')

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
          this.notificationService.showError(err, 'Pool create failed!');
        })
      .add(
        () => {

          this.spinnerService.off()
        });
  }
}
