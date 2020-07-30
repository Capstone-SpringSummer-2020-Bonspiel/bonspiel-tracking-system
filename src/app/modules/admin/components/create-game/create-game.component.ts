import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { forkJoin } from 'rxjs';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss'],
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

  selectedValue1 = '';
  selectedValue2 = '';

  events: any = [];
  optionGroups: any = [
    {
      name: 'Pools',
      list: [],
    },
    {
      name: 'Brackets',
      list: [],
    },
  ];
  draws: any = [];
  games: any = [];
  teams: any = [];
  filteredTeams: any = [];

  colors = ['red', 'yellow'];
  iceSheets = ['A', 'B', 'C'];
  eventTypes = ['pools', 'brackets'];

  console = console;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.firstFormGroup = this.fb.group({
      eventIdCtrl: ['', Validators.required],
      eventTypeCtrl: [''],
    });
    this.secondFormGroup = this.fb.group({
      poolIdCtrl: [''],
      bracketIdCtrl: [null],
    });
    this.thirdFormGroup = this.fb.group({
      drawIdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this.fb.group({
      gameNameCtrl: ['', Validators.required],
      team1IdCtrl: [''],
      team2IdCtrl: [''],
      team1StoneColorCtrl: ['red', Validators.required],
      team2StoneColorCtrl: ['yellow', Validators.required],
      destWinnerCtrl: [null],
      destLoserCtrl: [null],
      iceSheetCtrl: ['', Validators.required],
      finishedCtrl: [false, Validators.required],
      winnerCtrl: [null],
      notesCtrl: [''],
    });

    console.log('fourthFormGroup', this.fourthFormGroup);

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

  setEventId(event: any, stepper: MatStepper) {
    console.log('event', event);

    if (event === undefined) {
      return;
    }

    this.selectedEventId = this.firstFormGroup.value.eventIdCtrl; // eventId
    this.spinnerService.on();
    this.fetchData();
    stepper.next();
  }

  fetchData() {
    forkJoin({
      pools: this.apiService.getPool(this.selectedEventId),
      brackets: this.apiService.getBracket(this.selectedEventId),
      draws: this.apiService.getDraws(this.selectedEventId),
      games: this.apiService.getGames(this.selectedEventId),
      teams: this.apiService.getTeamsByEventId(this.selectedEventId)
    }).subscribe(
      (res: any) => {
        this.optionGroups[0].list = res.pools; // pools
        this.optionGroups[1].list = res.brackets; // brackets
        this.games = res.games;
        this.teams = res.teams;
        this.filteredTeams = res.teams;
        this.draws = res.draws.sort((a, b) => a.start > b.start);

        console.log('pools', this.optionGroups[0].list);
        console.log('brackets', this.optionGroups[1].list);
        console.log('draws', this.draws);
        console.log('games', this.games);
        console.log('teams', this.teams);

        this.spinnerService.off();
      });
  }

  setPoolOrBracket(event, stepper: MatStepper, eventType) {
    console.log('event', event);

    if (event === undefined) {
      return;
    }

    this.firstFormGroup.controls.eventTypeCtrl.setValue(eventType);
    stepper.next();
  }

  setDrawId() {
    this.selectedDrawId = this.thirdFormGroup.value.draw; // drawId
    console.log('selectedDrawId:');
    console.log(this.selectedDrawId);
  }

  getGamesByDrawId() {
    console.log('games in selected draw:');
    console.log(this.games.filter((e) => e.draw_id === this.selectedDrawId));
  }

  onClickSubmit(stepper: MatStepper) {
    let body = {
      bracketId: this.secondFormGroup.controls.bracketIdCtrl.value || null, // bracketId
      curlingTeam1Id: this.fourthFormGroup.controls.team1IdCtrl.value || null, // curlingTeam1Id (nullable)
      curlingTeam2Id: this.fourthFormGroup.controls.team2IdCtrl.value || null, // curlingTeam2Id (nullable)
      destLoser: this.fourthFormGroup.controls.destLoserCtrl.value || null, // destLoser (nullable)
      destWinner: this.fourthFormGroup.controls.destWinnerCtrl.value || null, // destWinner (nullable)
      drawId: this.thirdFormGroup.controls.drawIdCtrl.value, // drawId
      eventType: this.firstFormGroup.controls.eventTypeCtrl.value, // eventType
      finished: this.fourthFormGroup.controls.finishedCtrl.value, // Finished
      gameName: this.fourthFormGroup.controls.gameNameCtrl.value, // gameName
      iceSheet: this.fourthFormGroup.controls.iceSheetCtrl.value, // iceSheet
      notes: this.fourthFormGroup.controls.notesCtrl.value, // notes
      poolId: this.secondFormGroup.controls.poolIdCtrl.value || null, // poolId
      stoneColor1: this.fourthFormGroup.controls.team1StoneColorCtrl.value || null, // stoneColor1
      stoneColor2: this.fourthFormGroup.controls.team2StoneColorCtrl.value || null, // stoneColor2
      winner: this.fourthFormGroup.controls.winnerCtrl.value || null, // WinnerId (nullable)
    };

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

    this.apiService
      .createGame(this.selectedEventId, body)
      .subscribe(
        (res) => {
          console.log(res);
          this.notificationService.showSuccess('Game was successfully created', '');

          // Reset the stepper, forms and validation
          stepper.reset();

          let formGroups = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup,
            this.fourthFormGroup
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
          this.notificationService.showError('Something went wrong', '');
        })
      .add(() => {
        this.spinnerService.off();
      });
  }

  disableOptions(team_id) {
    const selectedTeamId1 = this.fourthFormGroup.controls.team1IdCtrl.value;
    const selectedTeamId2 = this.fourthFormGroup.controls.team2IdCtrl.value;
    const A = [Number(selectedTeamId1), Number(selectedTeamId2)];

    if (A.includes(team_id)) {
      return true;
    }
    return false;
  }

  selectedTeams() {
    const selectedTeamId1 = this.fourthFormGroup.controls.team1IdCtrl.value;
    const selectedTeamId2 = this.fourthFormGroup.controls.team2IdCtrl.value;
    return this.teams.filter((e) => e.id === selectedTeamId1 || e.id === selectedTeamId2);
  }

  resetStepper(stepper: MatStepper) {
    stepper.reset();

    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();
  }
}
