import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-add-team-to-event',
  templateUrl: './add-team-to-event.component.html',
  styleUrls: ['./add-team-to-event.component.scss']
})
export class AddTeamToEventComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  events: any = [];
  teams: any = [];

  constructor(private fb: FormBuilder,
    private apiService: ApiService,) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      teamCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });

    this.getAllTeams();
    this.getEvents();
  }

  getEvents() {
    // Get list of existing events
    this.apiService.getEvents().subscribe((res) => {
      this.events = res;
      // console.log('events:');
      // console.log(this.events);
    });
  }

  getAllTeams() {
    // Get teams
    this.apiService.getAllTeams().subscribe((res) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name) ? 1 : -1);
      // console.log('teams:');
      // console.log(this.teams);
    });
  }

  onClickSubmit() {

  }

  resetStepper(stepper: MatStepper) {
    stepper.reset();

    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
  }
}
