import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-set-default-event',
  templateUrl: './set-default-event.component.html',
  styleUrls: ['./set-default-event.component.scss']
})
export class SetDefaultEventComponent implements OnInit {
  firstFormGroup: FormGroup;

  events: any[] = [];
  selectedEvent = null;

  pools: any[] = [];
  selectedPool = null;

  defaultEventId = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) {

  }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      eventIdCtrl: ['', Validators.required],
    });

    this.getEvents();
  }

  getEvents() {
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        this.events = res;
        for (var i = 0; i < this.events.length; i++) {
          this.events[i].active_flag = false;
        }
        this.events.sort((a, b) => a.name > b.name ? 1 : -1);
        console.log('sorted Events', this.events);

        this.apiService.currentEventId$.subscribe(res => {
          this.defaultEventId = res;
          this.selectedEvent = this.events.find(e => e.id === this.defaultEventId);
          this.selectedEvent.active_flag = true;

          console.log('defaultEventId', this.defaultEventId);
          this.spinnerService.off();
        });
      })
  }

  onClickSubmit(stepper) {
    const eventId = this.firstFormGroup.value.eventIdCtrl;

    this.spinnerService.on();
    this.apiService
      .setDefaultEventId(eventId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Default Event has been successfully set!', '');

          // Reset the form and validation
          stepper.reset();

          let formGroups = [this.firstFormGroup];

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'ERROR');
        })
      .add(
        () => {
          this.spinnerService.off();
          this.getEvents();
        });


  }

}
