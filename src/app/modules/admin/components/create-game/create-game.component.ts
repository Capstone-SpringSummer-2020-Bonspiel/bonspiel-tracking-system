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
  selectedTeam1StoneColor = 'Red';
  selectedTeam2StoneColor = 'Yellow';
  finished = false;
  payload = {
    eventType: '', // eventType,
    notes: '', // notes,
    bracketId: '', // bracketId,
    poolId: '', // poolId,
    drawId: '', // drawId,
    curlingTeam1Id: '', // curlingTeam1Id (nullable),
    curlingTeam2Id: '', // curlingTeam2Id (nullable),
    stoneColor1: '', // stoneColor1,
    stoneColor2: '', // stoneColor2,
    winnerFromGame: '', // winnerFromGame (nullable),
    loserFromGame: '', // loserFromGame (nullable),
    iceSheet: '', // iceSheet,
    finished: '', // Finished,
    winnerId: '', // WinnerId (nullable)
  }

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

  colors = ['Red', 'Yellow'];
  iceSheets = ['A', 'B', 'C'];

  console = console;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      eventTypeCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      poolBracketCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      drawCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this.formBuilder.group({
      team1Id: [''],
      team1StoneColor: ['Red', Validators.required],
      team2Id: [''],
      team2StoneColor: ['Yellow', Validators.required],
      winnerFromGame: [''],
      loserFromGame: [''],
      iceSheet: ['', Validators.required],
      finished: [false, Validators.required],
      winnerId: [''],
    });

    // Get list of existing events
    this.api.getEvents().subscribe((res) => {
      this.events = res;
      console.log('events:');
      console.log(this.events);
    });
  }

  setEventId() {
    this.selectedEventId = this.firstFormGroup.value.eventTypeCtrl;  // eventId
    console.log('selectedEventId:');
    console.log(this.selectedEventId);
  }

  getPoolsBracketsByEventId() {
    // Get pools/brackets
    forkJoin({
      pools: this.api.adHocQuery(`SELECT * FROM pool WHERE event_id = ${this.selectedEventId} ORDER BY id ASC`),
      brackets: this.api.adHocQuery(`SELECT * FROM bracket WHERE event_id = ${this.selectedEventId} ORDER BY id ASC`),
    }).subscribe((res: any) => {
      this.optionGroups[0].list = res.pools.rows;     // pools
      this.optionGroups[1].list = res.brackets.rows;  // brackets
    });

    // Get games
    this.api.getGames(this.selectedEventId).subscribe((res) => {
      this.games = res;
      console.log('games:');
      console.log(this.games);
    });
  }

  getTeamsByEventId() {
    // Get teams
    this.api.getTeams(this.selectedEventId).subscribe((res) => {
      this.teams = res;
      console.log('teams:');
      console.log(this.teams);
    });
  }

  getDrawsByEventId() {
    this.api.getDraws(this.selectedEventId).subscribe((res: any) => {
      this.draws = res.sort((a, b) => a.start > b.start);
      console.log('draws:');
      console.log(this.draws);
    });
  }

  setDrawId() {
    this.selectedDrawId = this.thirdFormGroup.value.drawCtrl;  // drawId
    console.log('selectedDrawId:');
    console.log(this.selectedDrawId);
  }

  getGamesByDrawId() {
    console.log('games in selected draw:');
    console.log(this.games.filter((e) => e.draw_id === this.selectedDrawId));
  }

  onClickSubmit(stepper: MatStepper) {
    const payload = {
      eventType: this.firstFormGroup.controls.eventTypeCtrl, // eventType,
      notes: '', // notes,
      bracketId: '', // bracketId,
      poolId: '', // poolId,
      drawId: '', // drawId,
      curlingTeam1Id: '', // curlingTeam1Id (nullable),
      curlingTeam2Id: '', // curlingTeam2Id (nullable),
      stoneColor1: '', // stoneColor1,
      stoneColor2: '', // stoneColor2,
      winnerFromGame: '', // winnerFromGame (nullable),
      loserFromGame: '', // loserFromGame (nullable),
      iceSheet: '', // iceSheet,
      finished: '', // Finished,
      winnerId: '', // WinnerId (nullable)
    }

    stepper.next();
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
    return this.teams.filter(e => e.team_id !== this.selectedTeam1Id).filter(e => e.team_id !== this.selectedTeam2Id);
  }

  selectedTeams() {
    return this.teams.filter(e => e.team_id === this.selectedTeam1Id || e.team_id === this.selectedTeam2Id);
  }

  resetStepper(stepper: MatStepper) {
    stepper.reset();

    // Reset stone colors
    this.fourthFormGroup = this.formBuilder.group({
      team1Id: [''],
      team1StoneColor: ['Red', Validators.required],
      team2Id: [''],
      team2StoneColor: ['Yellow', Validators.required],
      winnerFromGame: [''],
      loserFromGame: [''],
      iceSheet: ['', Validators.required],
      finished: [true, Validators.required],
      winnerId: [''],
    });
  }
}

