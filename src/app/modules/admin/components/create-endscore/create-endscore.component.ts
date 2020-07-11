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

import * as moment from 'moment';

@Component({
  selector: 'app-create-endscore',
  templateUrl: './create-endscore.component.html',
  styleUrls: ['./create-endscore.component.scss'],
})
export class CreateEndscoreComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  eventNames: any[] = [];
  games: any[] = [];
  selectedEventId;

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

  getEventGames() {
    // this.selectedEventId = this.firstFormGroup.value.firstCtrl;
    // console.log(`selectedEventId= ${this.selectedEventId}`);
    // this.spinner.on();
    // this.api.getGames(this.selectedEventId).subscribe((res: any) => {
    //   this.games = res;
    //   this.spinner.off();
    //   console.log(`games`);
    //   console.log(this.games);
    // });
  }

  getGame() {}

  onClickSubmit() {}
}
