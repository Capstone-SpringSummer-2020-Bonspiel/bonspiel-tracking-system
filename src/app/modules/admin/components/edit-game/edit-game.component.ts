import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { MatStepper } from '@angular/material/stepper';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.scss'],
})
export class EditGameComponent implements OnInit {
  formGroup: FormGroup;

  events: any = [];
  draws: any = [];
  games: any = [];
  teams: any = [];
  pools: any = [];
  brackets: any = [];
  selectedDraw: any = [];
  selectedGame: any = [];


  colors = ['red', 'yellow'];
  iceSheets = ['A', 'B', 'C'];
  eventTypes = ['pools', 'brackets'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Initialize form group
    this.formGroup = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          eventCtrl: ['', Validators.required],
        }),
        this.fb.group({
          drawCtrl: ['', Validators.required],
        }),
        this.fb.group({
          gameCtrl: ['', Validators.required],
        }),
        this.fb.group({
          poolCtrl: [''], bracketCtrl: [''], newDrawCtrl: [''],
        }),
        this.fb.group({
          gameNameCtrl: [''],
          team1IdCtrl: [''],
          team1StoneColorCtrl: [''],
          team2IdCtrl: [''],
          team2StoneColorCtrl: [''],
          iceSheetCtrl: [''],
          winnerCtrl: [''],
          destWinnerCtrl: [''],
          destLoserCtrl: [''],
          notesCtrl: [''],
          finishedCtrl: ['']
        }),
      ]),
    });

    console.log(this.formGroup);

    this.getEvents();
  }

  // Returns a FormArray with the name 'formArray'
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  getCtrlValue(index) {
    return this.formGroup.get('formArray').value[index];
  }

  getEvents() {
    // Get events
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res) => {
        this.events = res;
        this.events.sort((a, b) => (a.name > b.name ? 1 : -1));
        console.log('events:');
        console.log(this.events);
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  getDrawsAndTeams() {
    const selectedEventID = this.getCtrlValue(0).eventCtrl;

    // Get draws
    this.spinnerService.on();
    this.apiService
      .getDraws(selectedEventID)
      .subscribe((res: any) => {
        if (res === null || res === undefined) {
          this.notificationService.showError('Could not fetch draws', 'ERROR');
          return;
        }
        this.draws = res;
        this.draws.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.apiService.getTeamsByEventId(selectedEventID).subscribe((res: any) => {
          this.teams = res;
          this.teams.sort((a, b) => (a.name > b.name ? 1 : -1));
        })
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  getGames() {
    const selectedEventID = this.getCtrlValue(0).eventCtrl;
    const selectedDrawID = this.getCtrlValue(1).drawCtrl;
    this.selectedDraw = this.draws.filter((x) => x.id === selectedDrawID);

    // Get games
    this.spinnerService.on();
    this.apiService.getGames(selectedEventID).subscribe((res: any) => {
      this.games = res;
      if (res === null || res === undefined) {
        this.notificationService.showError('Could not fetch games', 'ERROR');
        this.spinnerService.off();
        return;
      }
      this.games = this.games.filter((x) => x.draw_id === selectedDrawID);
      console.log('games:');
      console.log(this.games);
      this.spinnerService.off();
    });
  }

  getGameId() {
    this.selectedGame = this.games.filter(
      (x) => x.game_id === this.getCtrlValue(2).gameCtrl
    )[0];
    console.log('selectedGame');
    console.log(this.selectedGame);
    this.getPoolsByEventId();
    this.getBracketsByEventId();
    this.getDrawsAndTeams();
    this.selectedGame.draw_name = this.draws.filter(x => x.id === this.selectedGame.draw_id)[0].name;
  }

  getPoolsByEventId() {
    const selectedEventId = this.getCtrlValue(0).eventCtrl;
    this.spinnerService.on();
    this.apiService.getPool(selectedEventId).subscribe((res: any) => {
      this.pools = res;
      console.log('pools');
      console.log(this.pools);
      if (this.pools.length != 0) {
        this.selectedGame.pool_name = this.pools.filter(x => x.id === this.selectedGame.pool_id)[0].name;
      }
    });

  }

  getBracketsByEventId() {
    const selectedEventId = this.getCtrlValue(0).eventCtrl;
    this.spinnerService.on();
    this.apiService.getBracket(selectedEventId).subscribe((res: any) => {
      this.brackets = res;
      console.log('brackets');
      console.log(this.brackets);
      if (this.brackets.length != 0) {
        this.selectedGame.bracket_name = this.brackets.filter(x => x.id === this.selectedGame.bracket_id)[0].name;
      }
      this.spinnerService.off();
    });
  }

  disableOptions(team_id) {
    const selectedTeamId1 = this.getCtrlValue(4).team1IdCtrl;
    const selectedTeamId2 = this.getCtrlValue(4).team2IdCtrl;
    const A = [Number(selectedTeamId1), Number(selectedTeamId2)];

    if (A.includes(team_id)) {
      return true;
    }
    return false;
  }

  selectedTeams() {
    const selectedTeamId1 = this.getCtrlValue(4).team1IdCtrl ? this.getCtrlValue(4).team1IdCtrl : this.selectedGame.teamname_1;
    const selectedTeamId2 = this.getCtrlValue(4).team2IdCtrl ? this.getCtrlValue(4).team2IdCtrl : this.selectedGame.teamname_2;
    return this.teams.filter((e) => e.id === selectedTeamId1 || e.id === selectedTeamId2);
  }




  onClickSubmit(stepper: MatStepper) {
    console.log('bracketCtrl');
    console.log(this.getCtrlValue(3).bracketCtrl);
    console.log('poolCtrl');
    console.log(this.getCtrlValue(3).poolCtrl);
    console.log('newDrawCtrl');
    console.log(this.getCtrlValue(3).newDrawCtrl);
    let body = {
      notes: this.getCtrlValue(4).notesCtrl || this.selectedGame.notes,
      gameName: this.getCtrlValue(4).gameNameCtrl || this.selectedGame.game_name,
      bracketId: this.getCtrlValue(3).bracketCtrl ? this.getCtrlValue(3).bracketCtrl : this.selectedGame.bracket_id,
      poolId: this.getCtrlValue(3).poolCtrl ? this.getCtrlValue(3).poolCtrl : this.selectedGame.pool_id,
      drawId: this.getCtrlValue(3).newDrawCtrl || this.selectedGame.draw_id,
      curlingTeam1Id: this.getCtrlValue(4).team1IdCtrl || this.selectedGame.curlingteam1_id,
      curlingTeam2Id: this.getCtrlValue(4).team2IdCtrl || this.selectedGame.curlingteam2_id,
      stoneColor1: this.getCtrlValue(4).team1StoneColorCtrl || this.selectedGame.stone_color1,
      stoneColor2: this.getCtrlValue(4).team2StoneColorCtrl || this.selectedGame.stone_color2,
      destLoser: this.getCtrlValue(4).destLoserCtrl || this.selectedGame.loser_dest,
      destWinner: this.getCtrlValue(4).destWinnerCtrl || this.selectedGame.winner_dest,
      iceSheet: this.getCtrlValue(4).iceSheetCtrl || this.selectedGame.ice_sheet,
      finished: this.getCtrlValue(4).finishedCtrl || this.selectedGame.finished,
      winner: this.getCtrlValue(4).winnerCtrl || this.selectedGame.winner
    }

    console.log(body);

    //this.selectedGame.game_id;
    this.spinnerService.on();
    this.apiService.editGame(this.selectedGame.game_id, body)
      .subscribe((res: any) => {
        console.log(res);
        this.notificationService.showSuccess('Game has been modified', '');
        this.spinnerService.off();
      },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'ERROR');
          this.spinnerService.off();
        })
      .add(() => {
        stepper.reset();
        this.formGroup.reset();
        Object.keys(this.formGroup.controls).forEach((key) => {
          this.formGroup.controls[key].setErrors(null);
        })
        this.getEvents();
      })
  }
}
