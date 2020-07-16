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
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

@Component({
  selector: 'app-remove-draw',
  templateUrl: './remove-draw.component.html',
  styleUrls: ['./remove-draw.component.scss'],
})
export class RemoveDrawComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  eventNames: any[] = [];
  eventDraws: any[] = [];
  selectedDraw;
  allGames: any[] = [];
  selectedDrawGames: any[] = [];
  drawDisplayedColumns: string[] = ['event_id', 'name', 'start', 'video_url'];
  gameDisplayedColumns: string[] = ['name', 'team_name1', 'team_name2'];

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
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
      this.eventNames = res;
      this.eventNames.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  getEventDraws() {
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    this.spinnerService.on();
    this.apiService.getDraws(selectedEventID).subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notificationService.showError('Could not fetch draws', 'ERROR');
        this.spinnerService.off();
        return;
      }
      this.eventDraws = res;
      this.eventDraws.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getDrawGames() {
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    const selectedDrawID = this.secondFormGroup.value.secondCtrl;
    this.selectedDraw = this.eventDraws.filter((x) => x.id === selectedDrawID);
    this.spinnerService.on();
    this.apiService.getGames(selectedEventID).subscribe((res: any) => {
      this.allGames = res;
      if (res === null || res === undefined) {
        this.notificationService.showError('Could not fetch games', 'ERROR');
        this.spinnerService.off();
        return;
      }
      this.selectedDrawGames = this.allGames.filter(
        (x) => x.draw_id === selectedDrawID
      );

      this.spinnerService.off();
    });
  }

  deleteDraw(stepper: MatStepper) {
    const selectedDrawID = this.secondFormGroup.value.secondCtrl;

    this.spinnerService.off();

    this.apiService
      .deleteDraw(selectedDrawID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Draw has been deleted', '');
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
