import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { forkJoin } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-remove-game',
  templateUrl: './remove-game.component.html',
  styleUrls: ['./remove-game.component.scss'],
})
export class RemoveGameComponent implements OnInit {
  formGroup: FormGroup;

  events: any = [];
  games: any = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    // Initialize form group
    this.formGroup = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          eventCtrl: ['', Validators.required],
        }),
        this.fb.group({
          gameCtrl: ['', Validators.required],
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

  getGames() {
    // Get games
    this.spinnerService.on();
    this.apiService
      .getGames(this.getCtrlValue(0).eventCtrl)
      .subscribe((res) => {
        this.games = res;
        console.log('games:');
        console.log(this.games);
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const gameId = this.getCtrlValue(1).gameCtrl;

    // Remove game
    this.spinnerService.on();
    this.apiService
      .removeGame(gameId)
      .subscribe(
        (res) => {
          console.log(res);

          this.notificationService.showSuccess('Game was removed', '');
          stepper.reset();
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'ERROR');
        }
      )
      .add(() => {
        this.spinnerService.off();
      });
  }
}
