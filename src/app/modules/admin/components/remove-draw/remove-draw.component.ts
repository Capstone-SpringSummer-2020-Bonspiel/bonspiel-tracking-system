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
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

@Component({
  selector: 'app-remove-draw',
  templateUrl: './remove-draw.component.html',
  styleUrls: ['./remove-draw.component.scss'],
})
export class RemoveDrawComponent implements OnInit {
  formGroup: FormGroup;

  events: any[] = [];
  draws: any[] = [];
  games: any[] = [];
  selectedDraw: any[] = [];
  selectedGames: any[] = [];
  drawDisplayedColumns: string[] = ['event_id', 'name', 'start', 'video_url'];
  gameDisplayedColumns: string[] = ['name', 'team_name1', 'team_name2'];

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
        })
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
    this.apiService.getEvents()
      .subscribe((res: any) => {
        console.log(res);
        this.events = res;
        this.events.sort((a, b) => (a.name > b.name ? 1 : -1));
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  getDraws() {
    const selectedEventID = this.getCtrlValue(0).eventCtrl;

    // Get draws
    this.spinnerService.on();
    this.apiService.getDraws(selectedEventID)
      .subscribe(
        (res: any) => {
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

  getDrawGames() {
    const selectedEventID = this.getCtrlValue(0).eventCtrl;
    const selectedDrawID = this.getCtrlValue(1).drawCtrl;
    this.selectedDraw = this.draws.filter((x) => x.id === selectedDrawID);

    // Get games
    this.spinnerService.on();
    this.apiService.getGames(selectedEventID)
      .subscribe(
        (res: any) => {
          this.games = res;
          if (res === null || res === undefined) {
            this.notificationService.showError('Could not fetch games', 'ERROR');
            this.spinnerService.off();
            return;
          }
          this.selectedGames = this.games.filter(
            (x) => x.draw_id === selectedDrawID
          );

          this.spinnerService.off();
        });
  }

  onClickRemove(stepper: MatStepper) {
    const selectedDrawID = this.getCtrlValue(1).drawCtrl;

    // Delete draw
    this.spinnerService.on();
    this.apiService.deleteDraw(selectedDrawID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Draw has been removed', '');

          // Reset the stepper
          stepper.reset();

          // // Reset the form and validation
          // this.formGroup.reset()
          // Object.keys(this.formGroup.controls).forEach(key => {
          //   this.formGroup.controls[key].setErrors(null)
          // });

          // Re-fetch events
          this.getEvents();
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'Something went wrong');
        }
      )
      .add(() => {
        this.spinnerService.off();
      });
  }
}
