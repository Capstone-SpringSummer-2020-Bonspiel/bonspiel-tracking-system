import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-remove-team-from-event',
  templateUrl: './remove-team-from-event.component.html',
  styleUrls: ['./remove-team-from-event.component.scss']
})
export class RemoveTeamFromEventComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  events: any = [];
  teams: any = [];

  selectedEvent = '';
  selectedTeam = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      teamCtrl: ['', Validators.required],
    });

    this.getEvents();
  }

  getEvents() {
    this.apiService.getEvents().subscribe((res) => {
      this.events = res;
      console.log('events:');
      console.log(this.events);
    });
  }

  getTeamsByEventId(stepper: MatStepper) {
    const eventId = this.firstFormGroup.get('eventCtrl').value;

    this.apiService.getTeamsByEventId(eventId).subscribe((res) => {
      this.teams = res;
      this.teams.sort((a, b) => (a.team_name > b.team_name) ? 1 : -1);
      console.log('teams:');
      console.log(this.teams);

      stepper.next();
    });
  }

  setSelections(stepper: MatStepper) {
    this.selectedEvent = this.events.find(e => e.id === this.firstFormGroup.get('eventCtrl').value).name;
    this.selectedTeam = this.teams.find(e => e.id === this.secondFormGroup.get('teamCtrl').value).team_name;

    stepper.next();
  };

  onClickRemove(stepper: MatStepper) {

  }
}
