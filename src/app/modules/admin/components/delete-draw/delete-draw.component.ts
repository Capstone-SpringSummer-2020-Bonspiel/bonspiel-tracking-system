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
  selector: 'app-delete-draw',
  templateUrl: './delete-draw.component.html',
  styleUrls: ['./delete-draw.component.scss'],
})
export class DeleteDrawComponent implements OnInit {
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

  selectEvent() {
    console.log('selectEvent()');
    const selectedEventID = this.firstFormGroup.value.firstCtrl;
    console.log(`selectedEventID= ${selectedEventID}`);
    this.selectedEvent = this.eventNames.filter(
      (x) => x.id === selectedEventID
    );
    this.spinner.on();
    this.api.getDraws(selectedEventID).subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notifier.showError('Could not fetch draws', 'ERROR');
        this.spinner.off();
        return;
      }
      this.eventDraws = res;
      console.log('eventDraws:');
      console.log(this.eventDraws);
      this.spinner.off();
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
    this.spinner.on();
    this.api.getGames(selectedEventID).subscribe((res: any) => {
      this.allGames = res;
      if (res === null || res === undefined) {
        this.notifier.showError('Could not fetch games', 'ERROR');
        this.spinner.off();
        return;
      }
      this.selectedDrawGames = this.allGames.filter(
        (x) => x.draw_id === selectedDrawID
      );

      this.spinner.off();
      console.log(
        `selectedDrawGames for event: ${selectedEventID}, draw: ${selectedDrawID}`
      );
      console.log(this.selectedDrawGames);
    });
  }

  deleteDraw() {
    console.log('deleteDraw()');
    const selectedDrawID = this.secondFormGroup.value.secondCtrl;
    const query: string = `DELETE FROM draw WHERE id = ${selectedDrawID}`;
    this.api.adHocQuery(query).subscribe((res: any) => {
      console.log(res);
    });
  }

  // onClickSubmit(stepper: MatStepper) {
  //   const payload = {
  //     drawID: this.secondFormGroup.value.secondCtrl,
  //   };
  // }
}
