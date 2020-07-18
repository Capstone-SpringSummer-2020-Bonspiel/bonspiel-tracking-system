import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-remove-event',
  templateUrl: './remove-event.component.html',
  styleUrls: ['./remove-event.component.scss']
})
export class RemoveEventComponent implements OnInit {
  events: null;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    // Get events
    this.spinnerService.on();
    this.apiService.getEvents()
      .subscribe(
        (res: any) => {
          console.log('[DEBUG] eventObtain() in schedule component:');
          console.log(res);

          this.events = res;

          console.log('events');
          console.log(this.events);
        })
      .add(() => {
        this.spinnerService.off();
      })

    // Initialize form group
    this.formGroup = this.fb.group({
      eventIdCtrl: ['', Validators.required],
    });
  }

  onClickRemove(stepper: MatStepper) {
    const eventId = String(this.formGroup.value.eventIdCtrl.id);

    // Remove event
    this.spinnerService.on();
    this.apiService.deleteEvent(eventId)
      .subscribe(
        (res: any) => {
          console.log(res)
          this.notificationService.showSuccess('Event has been successfully deleted!', '')

          // Reset the stepper
          stepper.reset();

          // Reset the form and validation
          this.formGroup.reset()
          Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.controls[key].setErrors(null)
          });
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'Something went wrong');
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
