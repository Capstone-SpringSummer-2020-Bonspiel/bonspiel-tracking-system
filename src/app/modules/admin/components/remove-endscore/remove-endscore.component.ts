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
  selector: 'app-remove-endscore',
  templateUrl: './remove-endscore.component.html',
  styleUrls: ['./remove-endscore.component.scss'],
})
export class RemoveEndscoreComponent implements OnInit {
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
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService
  ) {}

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
    });

    this.spinner.on();
    this.api.getEvents().subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notifier.showError('Could not fetch curling events', 'ERROR');
        this.spinner.off();
        return;
      }
      this.spinner.off();
      this.eventNames = res;
      console.log('eventNames:');
      console.log(this.eventNames);
    });
  }

  getEventDraws() {
    this.selectedEventId = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventId= ${this.selectedEventId}`);
    this.spinner.on();
    this.api.getDraws(this.selectedEventId).subscribe((res: any) => {
      this.draws = res;
      this.spinner.off();
      console.log('draws');
      console.log(this.draws);
    });
  }

  getDrawGames() {
    this.selectedDrawId = this.secondFormGroup.value.secondCtrl;
    console.log(`selectedDrawId= ${this.selectedDrawId}`);
    this.spinner.on();
    this.api.getGames(this.selectedEventId).subscribe((res: any) => {
      this.games = res.filter((x) => x.draw_id === this.selectedDrawId);
      this.spinner.off();
      console.log('games');
      console.log(this.games);
    });
  }

  getEndScores() {
    this.selectedGameId = this.thirdFormGroup.value.thirdCtrl;
    console.log(`selectedGameId= ${this.selectedGameId}`);
    this.spinner.on();
    this.api.getScoresByEvent(this.selectedEventId).subscribe((res: any) => {
      const eventScores = res;
      this.endScores = eventScores.filter(
        (x) => x.game_id === this.selectedGameId && x.endscore_id != null
      );
      this.spinner.off();
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
    const endId = this.fourthFormGroup.value.fourthCtrlEndId;
    console.log(`endId= ${endId}`);
    this.api.removeEndScore(endId).subscribe(
      (res: any) => this.notifier.showSuccess('End Score has been removed', ''),
      (error) => {
        console.log(error);
        this.notifier.showError(error, '');
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
