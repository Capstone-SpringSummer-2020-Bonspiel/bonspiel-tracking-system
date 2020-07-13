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
  selectedEvent;
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
      console.log('eventNames:');
      console.log(this.eventNames);
    });
  }

  getEvent() {
    console.log('getEvent()');
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventID= ${selectedEventID}`);
    this.selectedEvent = this.eventNames.filter(
      (x) => x.id === selectedEventID
    );
    this.spinnerService.on();
    this.apiService.getDraws(selectedEventID).subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notificationService.showError('Could not fetch draws', 'ERROR');
        this.spinnerService.off();
        return;
      }
      this.eventDraws = res;
      console.log('eventDraws:');
      console.log(this.eventDraws);
      this.spinnerService.off();
    });
  }

  getDrawGames() {
    console.log('getDrawGames()');
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    const selectedDrawID = this.secondFormGroup.value.secondCtrl;
    console.log(`selectedDrawID: ${selectedDrawID}`);
    this.selectedDraw = this.eventDraws.filter((x) => x.id === selectedDrawID);
    console.log('selectedDraw:');
    console.log(this.selectedDraw);
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
      console.log(
        `selectedDrawGames for event: ${selectedEventID}, draw: ${selectedDrawID}`
      );
      console.log(this.selectedDrawGames);
    });
  }

  deleteDraw() {
    console.log('deleteDraw()');
    const selectedDrawID = this.secondFormGroup.value.secondCtrl;

    this.apiService.deleteDraw(selectedDrawID).subscribe(
      (res: any) => {
        console.log(res);
        this.notificationService.showSuccess('Draw has been deleted!', '');
      },
      (error) => {
        console.log(error);
        this.notificationService.showError('Something went wrong', '');
      }
    );
  }
}
