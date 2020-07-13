import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-edit-endscore',
  templateUrl: './edit-endscore.component.html',
  styleUrls: ['./edit-endscore.component.scss'],
})
export class EditEndscoreComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  eventNames: any[] = [];
  draws: any[] = [];
  games: any[] = [];
  endScores: any[] = [];
  selectedEventId;
  selectedDrawId;
  selectedGameId;
  selectedEndNumberId;
  team1;
  team2;
  displayedColumns = ['endNumber', 'team1Score', 'team2Score'];

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrlEndId: ['', Validators.required],
      fourthCtrlTeam1Score: ['', Validators.required],
      fourthCtrlTeam2Score: ['', Validators.required],
    });

    this.spinnerService.on();
    this.apiService.getEvents().subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notificationService.showError('Could not fetch curling events', 'ERROR');
        this.spinnerService.off();
        return;
      }
      this.spinnerService.off();
      this.eventNames = res;
      console.log('eventNames:');
      console.log(this.eventNames);
    });
  }

  getEventDraws() {
    this.selectedEventId = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventId= ${this.selectedEventId}`);
    this.spinnerService.on();
    this.apiService.getDraws(this.selectedEventId).subscribe((res: any) => {
      this.draws = res;
      this.spinnerService.off();
      console.log('draws');
      console.log(this.draws);
    });
  }

  getDrawGames() {
    this.selectedDrawId = this.secondFormGroup.value.secondCtrl;
    console.log(`selectedDrawId= ${this.selectedDrawId}`);
    this.spinnerService.on();
    this.apiService.getGames(this.selectedEventId).subscribe((res: any) => {
      this.games = res.filter((x) => x.draw_id === this.selectedDrawId);
      this.spinnerService.off();
      console.log('games');
      console.log(this.games);
    });
  }

  getEndScores() {
    this.selectedGameId = this.thirdFormGroup.value.thirdCtrl;
    console.log(`selectedGameId= ${this.selectedGameId}`);
    this.spinnerService.on();
    this.apiService.getScoresByEvent(this.selectedEventId).subscribe((res: any) => {
      const eventScores = res;
      this.endScores = eventScores.filter(
        (x) => x.game_id === this.selectedGameId && x.endscore_id != null
      );
      this.spinnerService.off();
      this.endScores.sort(compare);
      const selectedGame = this.games.filter(
        (x) => x.game_id === this.selectedGameId
      );
      this.team1 = selectedGame[0].team_name1;
      this.team2 = selectedGame[0].team_name2;
      console.log('endScores= ');
      console.log(this.endScores);
    });
  }

  onClickSubmit() {
    var blank = false;
    var curlingTeam1Scored;
    var score;
    this.selectedEndNumberId = this.fourthFormGroup.value.fourthCtrlEndId;
    const team1Score = this.fourthFormGroup.value.fourthCtrlTeam1Score;
    const team2Score = this.fourthFormGroup.value.fourthCtrlTeam2Score;
    if (team2Score < 0 || team1Score < 0) {
      this.notificationService.showError('Scores must be positive values', '');
      return;
    } else if (team1Score > 0 && team2Score > 0) {
      this.notificationService.showError('Only one positive score allowed', '');
      return;
    } else if (team1Score === 0 && team2Score === 0) {
      curlingTeam1Scored = false;
      score = 0;
    } else if (team1Score > 0 && team2Score === 0) {
      curlingTeam1Scored = true;
      score = team1Score;
    } else if (team1Score === 0 && team2Score > 0) {
      curlingTeam1Scored = false;
      score = team2Score;
    }
    console.log(`gameId= ${this.selectedGameId}`);
    console.log(`endID = ${this.selectedEndNumberId}`);
    console.log(`blank= ${blank}`);
    console.log(`curlingTeam1Scored= ${curlingTeam1Scored}`);
    console.log(`score= ${score}`);
    this.apiService
      .editEndScore(this.selectedEndNumberId, blank, curlingTeam1Scored, score)
      .subscribe(
        (res: any) =>
          this.notificationService.showSuccess('End Score has been modified', ''),
        (error) => {
          console.log(error);
          this.notificationService.showError('Something went wrong', '');
        }
      );
  }
}

// Helper Function
function compare(a, b) {
  const endA = a.end_number;
  const endB = b.end_number;

  return endA > endB ? 1 : -1;
}
