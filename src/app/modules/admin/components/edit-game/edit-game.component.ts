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
  pools: any = [];
  brackets: any = [];
  selectedDraw: any = [];
  selectedGame: any = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) {}

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
          poolCtrl: ['', Validators.required],
        }),
        this.fb.group({
          bracketCtrl: ['', Validators.required],
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

  getDraws() {
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

  getPoolsByEventId() {
    const selectedEventId = this.getCtrlValue(0).eventCtrl;
    this.spinnerService.on();
    this.apiService.getPool(selectedEventId).subscribe((res: any) => {
      this.pools = res.rows;
      console.log('pools');
      console.log(this.pools);
      this.spinnerService.off();
    });
  }

  getBracketsByEventId() {
    const selectedEventId = this.getCtrlValue(0).eventCtrl;
    this.spinnerService.on();
    this.apiService.getBracket(selectedEventId).subscribe((res: any) => {
      this.brackets = res;
      console.log('brackets');
      console.log(this.brackets);
      this.spinnerService.off();
    });
  }

  getGameId() {
    this.selectedGame = this.games.filter(
      (x) => x.game_id === this.getCtrlValue(2).gameCtrl
    );
    console.log('selectedGame');
    console.log(this.selectedGame);
  }

  onClickSubmit(stepper: MatStepper) {}
}
