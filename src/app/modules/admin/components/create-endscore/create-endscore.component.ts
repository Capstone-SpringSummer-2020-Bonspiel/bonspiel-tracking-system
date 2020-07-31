import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-create-endscore',
  templateUrl: './create-endscore.component.html',
  styleUrls: ['./create-endscore.component.scss'],
})
export class CreateEndscoreComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  events: any[] = [];
  draws: any[] = [];
  games: any[] = [];
  endScores: any[] = [];
  selectedEventId;
  selectedDrawId;
  selectedGameId;
  team1;
  team2;
  isGameFinished;
  displayedColumns = ['endNumber', 'team1Score', 'team2Score'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      drawIdCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      gameIdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this.fb.group({
      endNumberCtrl: ['', Validators.required],
      team1ScoreCtrl: ['', Validators.required],
      team2ScoreCtrl: ['', Validators.required],
    });

    this.spinnerService.on();
    this.apiService.getEvents().subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notificationService.showError(
          'Could not fetch curling events',
          'ERROR'
        );
        this.spinnerService.off();
        return;
      }
      this.spinnerService.off();
      this.events = res;
      console.log('events:');
      console.log(this.events);
    });
  }

  getEventDraws(stepper: MatStepper) {
    this.selectedEventId = this.firstFormGroup.value.eventCtrl;

    this.spinnerService.on();
    this.apiService.getDraws(this.selectedEventId).subscribe((res: any) => {
      this.draws = res;
      this.spinnerService.off();
      console.log('draws');
      console.log(this.draws);

      stepper.next();
    });
  }

  getDrawGames(stepper: MatStepper) {
    this.selectedDrawId = this.secondFormGroup.value.drawIdCtrl;

    this.spinnerService.on();
    this.apiService.getGames(this.selectedEventId).subscribe((res: any) => {
      this.games = res.filter((x) => x.draw_id === this.selectedDrawId);
      this.spinnerService.off();
      console.log('games');
      console.log(this.games);

      stepper.next();
    });
  }

  getEndScores(stepper: MatStepper) {
    this.selectedGameId = this.thirdFormGroup.value.gameIdCtrl;

    this.spinnerService.on();
    this.apiService.getScoresByEvent(this.selectedEventId).subscribe((res: any) => {
      const eventScores = res;
      this.endScores = eventScores.filter(
        (x) => x.game_id === this.selectedGameId && x.endscore_id != null
      );
      this.spinnerService.off();
      this.endScores.sort((a, b) => (a.end_number > b.end_number ? 1 : -1));
      const selectedGame = this.games.filter(
        (x) => x.game_id === this.selectedGameId
      );
      this.team1 = selectedGame[0].team_name1;
      this.team2 = selectedGame[0].team_name2;
      console.log('endScores= ');
      console.log(this.endScores);
      this.isGameFinished = selectedGame[0].finished;
      console.log(`isGameFinished= ${this.isGameFinished}`);

      stepper.next();
    });
  }

  onClickSubmit(stepper: MatStepper) {
    var blank = 'false';
    var curlingTeam1Scored;
    var score;
    const endNumber = this.fourthFormGroup.value.endNumberCtrl;
    const team1Score = this.fourthFormGroup.value.team1ScoreCtrl;
    const team2Score = this.fourthFormGroup.value.team2ScoreCtrl;
    if (team2Score < 0 || team1Score < 0) {
      this.notificationService.showError('Scores must be positive values', '');
      return;
    } else if (team1Score > 0 && team2Score > 0) {
      this.notificationService.showError('Only one positive score allowed', '');
      return;
    } else if (team1Score === 0 && team2Score === 0) {
      curlingTeam1Scored = 'false';
      score = 0;
    } else if (team1Score > 0 && team2Score === 0) {
      curlingTeam1Scored = 'true';
      score = team1Score;
    } else if (team1Score === 0 && team2Score > 0) {
      curlingTeam1Scored = 'false';
      score = team2Score;
    }

    this.spinnerService.on();
    this.apiService.createEndScore(this.selectedGameId, endNumber, blank, curlingTeam1Scored, score)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('End Score has been created', '');

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
