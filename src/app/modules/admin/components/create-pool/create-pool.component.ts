import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-create-pool',
  templateUrl: './create-pool.component.html',
  styleUrls: ['./create-pool.component.scss']
})
export class CreatePoolComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  events: null;
  selectedEventId: Number;
  selectedEvent: any = {
    shortName: 'shortname',
    fullName: 'fullname',
  }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] getEvent() obtain data:');
        console.log(res);
        this.events = res;
        this.selectedEvent = res[0];
        this.selectedEventId = res[0].id;

        this.spinnerService.off();
      })

    this.firstFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      poolNameCtrl: ['', Validators.required],
    });
  }
  onEventSelected(event: any, stepper: MatStepper) {
    if (event === undefined) {
      return;
    }
    stepper.next()
  }

  onClickSubmit(stepper) {
    const eventId = String(this.firstFormGroup.value.eventCtrl.id);
    const poolName = this.secondFormGroup.value.poolNameCtrl;
    console.log('eventId', eventId);
    console.log('poolName', poolName);

    this.spinnerService.on();
    this.apiService
      .createPool(poolName, eventId)
      .subscribe(
        (res: any) => {
          console.log(res)
          this.notificationService.showSuccess('Pool has been created!', '')

          // Reset the stepper, forms and validation
          stepper.reset();

          let formGroups = [
            this.firstFormGroup,
            this.secondFormGroup
          ]

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err.message);
          this.notificationService.showError(err.message, 'Pool create failed!');
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
