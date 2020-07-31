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

  eventNames: any[] = [];
  eventDraws: any[] = [];
  selectedEvent;
  selectedDrawId;
  selectedDraw;

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
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      thirdCtrlName: ['', Validators.required],
      thirdCtrlDate: ['', Validators.required],
      thirdCtrlUrl: [''],
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
      this.eventDraws.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  getDraw() {
    this.selectedDrawId = this.secondFormGroup.value.secondCtrl;
    this.selectedDraw = this.eventDraws.filter((x) => x.id === this.selectedDrawId);
    this.minDate = new Date(this.selectedEvent[0].begin_date.toString());
    this.maxDate = new Date(this.selectedEvent[0].end_date.toString());
    console.log('selectedDraw', this.selectedDraw);


  }

  onClickSubmit(stepper: MatStepper) {

    console.log('thirdFormGroup', this.thirdFormGroup);

    const newDrawName = this.thirdFormGroup.value.thirdCtrlName;
    const newDrawStart = this.thirdFormGroup
      .get('thirdCtrlDate')
      .value?.toLocaleString();
    const newDrawUrl = this.thirdFormGroup.value.thirdCtrlUrl;

    this.spinnerService.on();

    this.apiService
      .editDraw(this.selectedDrawId, newDrawName, newDrawStart, newDrawUrl)
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
      });
  }
}
