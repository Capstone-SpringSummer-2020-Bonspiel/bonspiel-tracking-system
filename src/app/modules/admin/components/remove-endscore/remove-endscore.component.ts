import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
@Component({
  selector: 'app-remove-endscore',
  templateUrl: './remove-endscore.component.html',
  styleUrls: ['./remove-endscore.component.scss'],
})
export class RemoveEndscoreComponent implements OnInit {
  formGroup: FormGroup;

  events: any = [];
  draws: any = [];
  games: any = [];
  endScores: any = [];
  selectedDraw: any[] = [];
  selectedGames: any[] = [];

  team1;
  team2;
  displayedColumns = ['endNumber', 'team1Score', 'team2Score'];

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
          endCtrl: ['', Validators.required],
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
    const selectedEventId = this.getCtrlValue(0).eventCtrl;

    // Get draws
    this.spinnerService.on();
    this.apiService
      .getDraws(selectedEventId)
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
    const selectedEventId = this.getCtrlValue(0).eventCtrl;
    const selectedDrawId = this.getCtrlValue(1).drawCtrl;
    this.selectedDraw = this.draws.filter((x) => x.id === selectedDrawId);

    // Get games
    this.spinnerService.on();
    this.apiService.getGames(selectedEventId).subscribe((res: any) => {
      this.games = res;
      if (res === null || res === undefined) {
        this.notificationService.showError('Could not fetch games', 'ERROR');
        this.spinnerService.off();
        return;
      }
      this.selectedGames = this.games.filter(
        (x) => x.draw_id === selectedDrawId
      );

      this.spinnerService.off();
    });
  }

  getEndScores() {
    const selectedEventId = this.getCtrlValue(0).eventCtrl;
    const selectedDrawId = this.getCtrlValue(1).drawCtrl;
    const selectedGameId = this.getCtrlValue(2).gameCtrl;
    console.log(`selectedGameId= ${selectedGameId}`);
    this.spinnerService.on();
    this.apiService.getScoresByEvent(selectedEventId).subscribe((res: any) => {
      const eventScores = res;
      this.endScores = eventScores.filter(
        (x) => x.game_id === selectedGameId && x.endscore_id != null
      );
      this.spinnerService.off();
      this.endScores.sort((a, b) => (a.end_number > b.end_number ? 1 : -1));
      const selectedGame = this.games.filter(
        (x) => x.game_id === selectedGameId
      );
      this.team1 = selectedGame[0].team_name1;
      this.team2 = selectedGame[0].team_name2;
      console.log('endScores= ');
      console.log(this.endScores);
    });
  }

  onClickRemove(stepper: MatStepper) {
    const endId = this.getCtrlValue(3).endCtrl;

    // Remove end
    this.spinnerService.on();
    this.apiService
      .removeEndScore(endId)
      .subscribe(
        (res: any) => {
          console.log(res);

          this.notificationService.showSuccess(
            'End Score has been removed',
            ''
          );
          stepper.reset();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError(error.message, 'ERROR');
        }
      )
      .add(() => {
        this.spinnerService.off();
      });
  }
}
