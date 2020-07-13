import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { forkJoin } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-remove-game',
  templateUrl: './remove-game.component.html',
  styleUrls: ['./remove-game.component.scss']
})
export class RemoveGameComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  selectedEventId = null;
  selectedDrawId = null;
  selectedTeam1Id = undefined;
  selectedTeam2Id = undefined;
  selectedTeam1StoneColor = 'red';
  selectedTeam2StoneColor = 'yellow';
  finished = false;

  events: any = [];
  optionGroups: any = [
    {
      name: 'Pools',
      list: []
    },
    {
      name: 'Brackets',
      list: []
    }
  ];
  draws: any = [];
  games: any = [];
  teams: any = [];

  colors = ['red', 'yellow'];
  iceSheets = ['A', 'B', 'C'];
  eventTypes = ['friendly', 'pools', 'brackets', 'championship'];

  console = console;

  constructor(private formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      eventId: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      gameId: [null],
    });

    this.getEvents();
  }

  getEvents() {
    // Get list of existing events
    this.apiService.getEvents().subscribe((res) => {
      this.events = res;
      console.log('events:');
      console.log(this.events);
    });
  }

  setEventId() {
    this.selectedEventId = this.firstFormGroup.value.eventId;  // eventId
    console.log('selectedEventId:');
    console.log(this.selectedEventId);
  }

  getGamesByEventId() {
    this.apiService.getGames(this.selectedEventId).subscribe((res) => {
      this.games = res;
      console.log('games:');
      console.log(this.games);
    });
  }

  onClickSubmit(stepper: MatStepper) {
    this.spinner.on();

    this.apiService.removeGame(this.secondFormGroup.controls.gameId.value).subscribe((res) => {
      console.log(res);
      this.spinner.off();
      stepper.next();
    });
  }

  resetStepper(stepper: MatStepper) {
    stepper.reset();

    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
  }
}
