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
  selector: 'app-edit-draw',
  templateUrl: './edit-draw.component.html',
  styleUrls: ['./edit-draw.component.scss'],
})
export class EditDrawComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  events: any[] = [];
  selectedEvent = null;

  draws: any[] = [];
  selectedDraw = null;

  minDate: Date;
  maxDate: Date;

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
      drawCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      nameCtrl: [''],
      dateCtrl: [''],
      urlCtrl: [''],
    });

    this.getEvents();
  }

  getEvents() {
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
      this.events.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  getEventDraws() {
    this.selectedEvent = this.events.filter((x) => x.id === this.firstFormGroup.value.eventCtrl)[0];
    this.spinnerService.on();
    this.apiService.getDraws(this.selectedEvent.id).subscribe((res: any) => {
      if (res === null || res === undefined) {
        this.notificationService.showError('Could not fetch draws', 'ERROR');
        this.spinnerService.off();
        return;
      }
      this.draws = res;
      this.draws.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getDraw() {
    this.selectedDraw = this.draws.filter((x) => x.id === this.secondFormGroup.value.drawCtrl)[0];
    this.minDate = new Date(this.selectedEvent.begin_date.toString());
    this.maxDate = new Date(this.selectedEvent.end_date.toString());
    console.log('selectedDraw', this.selectedDraw);

    this.thirdFormGroup.controls.nameCtrl.setValue(this.selectedDraw.name);
    this.thirdFormGroup.controls.urlCtrl.setValue(this.selectedDraw.video_url);

  }

  onClickSubmit(stepper: MatStepper) {

    console.log('thirdFormGroup', this.thirdFormGroup);

    const newDrawName = this.thirdFormGroup.value.nameCtrl || this.selectedDraw.name;
    const newDrawStart = this.thirdFormGroup.get('dateCtrl').value?.toLocaleString() || this.selectedDraw.start;
    const newDrawUrl = this.thirdFormGroup.value.urlCtrl || this.selectedDraw.video_url;

    this.spinnerService.on();

    this.apiService
      .editDraw(this.selectedDraw.id, newDrawName, newDrawStart, newDrawUrl)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Draw has been modified', '');
          stepper.reset();

          // Reset the form and validation
          let formGroups = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup
          ]

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'ERROR');
        }
      )
      .add(() => {
        this.spinnerService.off();
        this.getEvents();
      });
  }
}
