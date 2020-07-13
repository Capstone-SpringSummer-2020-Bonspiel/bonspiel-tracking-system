import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { forkJoin } from 'rxjs';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
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
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      eventId: ['', Validators.required],
      eventType: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      poolId: [''],
      bracketId: [null],
    });
    this.thirdFormGroup = this.formBuilder.group({
      drawId: ['', Validators.required],
    });
    this.fourthFormGroup = this.formBuilder.group({
      gameName: [''],
      team1Id: [''],
      team1StoneColor: ['red', Validators.required],
      team2Id: [''],
      team2StoneColor: ['yellow', Validators.required],
      destWinner: [null],
      destLoser: [null],
      iceSheet: ['', Validators.required],
      finished: [false, Validators.required],
      winner: [null],
      notes: [''],
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

  getPoolsBracketsByEventId() {
    // Get pools/brackets
    forkJoin({
      pools: this.apiService.adHocQuery(`SELECT * FROM pool WHERE event_id = ${this.selectedEventId} ORDER BY id ASC`),
      brackets: this.apiService.adHocQuery(`SELECT * FROM bracket WHERE event_id = ${this.selectedEventId} ORDER BY id ASC`),
    }).subscribe((res: any) => {
      this.optionGroups[0].list = res.pools.rows;     // pools
      this.optionGroups[1].list = res.brackets.rows;  // brackets
    });

    // Get games
    this.apiService.getGames(this.selectedEventId).subscribe((res) => {
      this.games = res;
      console.log('games:');
      console.log(this.games);
    });
  }

  getTeamsByEventId() {
    // Get teams
    this.apiService.getTeamsByEventId(this.selectedEventId).subscribe((res) => {
      this.teams = res;
      console.log('teams:');
      console.log(this.teams);
    });
  }

  getDrawsByEventId() {
    this.apiService.getDraws(this.selectedEventId).subscribe((res: any) => {
      this.draws = res.sort((a, b) => a.start > b.start);
      console.log('draws:');
      console.log(this.draws);
    });
  }

  setDrawId() {
    this.selectedDrawId = this.thirdFormGroup.value.draw;  // drawId
    console.log('selectedDrawId:');
    console.log(this.selectedDrawId);
  }

  getGamesByDrawId() {
    console.log('games in selected draw:');
    console.log(this.games.filter((e) => e.draw_id === this.selectedDrawId));
  }

  onClickSubmit(stepper: MatStepper) {
    let body = {
      bracketId: this.secondFormGroup.controls.bracketId.value || null,          // bracketId
      curlingTeam1Id: this.fourthFormGroup.controls.team1Id.value || null,       // curlingTeam1Id (nullable)
      curlingTeam2Id: this.fourthFormGroup.controls.team2Id.value || null,       // curlingTeam2Id (nullable)
      destLoser: this.fourthFormGroup.controls.destLoser.value || null,          // destLoser (nullable)
      destWinner: this.fourthFormGroup.controls.destWinner.value || null,        // destWinner (nullable)
      drawId: this.thirdFormGroup.controls.drawId.value,                         // drawId
      eventType: this.firstFormGroup.controls.eventType.value,                   // eventType
      finished: this.fourthFormGroup.controls.finished.value,                    // Finished
      gameName: this.fourthFormGroup.controls.gameName.value,                    // gameName
      iceSheet: this.fourthFormGroup.controls.iceSheet.value,                    // iceSheet
      notes: this.fourthFormGroup.controls.notes.value,                          // notes
      poolId: this.secondFormGroup.controls.poolId.value || null,                // poolId
      stoneColor1: this.fourthFormGroup.controls.team1StoneColor.value || null,  // stoneColor1
      stoneColor2: this.fourthFormGroup.controls.team2StoneColor.value || null,  // stoneColor2
      winner: this.fourthFormGroup.controls.winner.value || null,                // WinnerId (nullable)
    }

    console.log(body);

    // Convert all values to string
    for (var k in body) {
      // if (body[k] === "null") {
      //   body[k] = null;
      // } else {
      if (Number.isInteger(body[k] || typeof body[k] === 'boolean')) {
        body[k] = String(body[k]);
      }
    }

    console.log(body);

    this.spinnerService.on();

    this.apiService.createGame(this.selectedEventId, body).subscribe((res) => {
      console.log(res);
      this.spinnerService.off();
      stepper.next();
    });
  }

  updateTeams(teamNum) {
    console.log(this.fourthFormGroup);
    if (teamNum === 1) {
      const selectedTeamId = this.fourthFormGroup.controls.team1Id.value;
      this.selectedTeam1Id = selectedTeamId;
    } else if (teamNum === 2) {
      const selectedTeamId = this.fourthFormGroup.controls.team2Id.value;
      this.selectedTeam2Id = selectedTeamId;
    }
  }

  filterTeams() {
    return this.teams.filter(e => e.id !== this.selectedTeam1Id).filter(e => e.id !== this.selectedTeam2Id);
  }

  selectedTeams() {
    return this.teams.filter(e => e.id === this.selectedTeam1Id || e.id === this.selectedTeam2Id);
  }

  resetStepper(stepper: MatStepper) {
    stepper.reset();

    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();
  }
}

