import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-remove-event',
  templateUrl: './remove-event.component.html',
  styleUrls: ['./remove-event.component.scss']
})
export class RemoveEventComponent implements OnInit {
  allEventData: null;
  selectedEvent: null;
  submitResult: Number;
  selectedEventId: Number;
  zeroFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        this.selectedEvent = res[0];
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        this.spinnerService.off();
      })

    this.zeroFormGroup = this._formBuilder.group({
      eventCtrl: ['', Validators.required],
    });
  }
  onEventSelected(event: any) {
    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.selectedEvent = event.value;
    this.selectedEventId = event.value.id;

    console.log('the selected event is:');
    console.log(this.selectedEvent);
  }
  onClickSubmit(stepper) {
    console.log("Event Delete: ")
    console.log(this.selectedEventId)

    this.spinnerService.on();
    this.apiService.deleteEvent(String(this.selectedEventId))
      .subscribe(
        (res: any) => {
          console.log(res)
          this.notificationService.showSuccess('Event has been successfully deleted!', '')
          this.spinnerService.off()
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Event deleted failed!');
          this.spinnerService.off();
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });
  }
  // onClickConfirm(){
  //   if(confirm("are you sure?")){
  //     this.onEventDelete();
  //     console.log("Event Deleted.");
  //   }
  // }
}
