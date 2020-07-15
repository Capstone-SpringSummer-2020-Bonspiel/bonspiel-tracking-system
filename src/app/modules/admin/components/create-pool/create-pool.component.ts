import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-pool',
  templateUrl: './create-pool.component.html',
  styleUrls: ['./create-pool.component.scss']
})
export class CreatePoolComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;

  allEventData: null;
  selectedEventId: Number;
  selectedEvent: any = {
    shortName: 'shortname',
    fullName: 'fullname',
  }

  constructor(
    private _formBuilder: FormBuilder,
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
        this.allEventData = res;
        this.selectedEvent = res[0];

        this.spinnerService.off();
      })

    this.firstFormGroup = this._formBuilder.group({
      nameDataCtrl: ['', Validators.required],
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

  onCreatePool() {
    const poolName = this.firstFormGroup.value.nameDataCtrl;
    console.log('SELECTED EVENT ID');
    console.log(this.selectedEventId)
    console.log('NEW BRACKET NAME:');
    console.log(poolName);

    this.spinnerService.on();
    this.apiService
      .createPool(poolName, String(this.selectedEventId))
      .subscribe(
        (res: any) => {

          this.apiService.getPool(this.selectedEventId).subscribe((res: any) => {
            console.log("display pool for event:")
            console.log(res)
          })
          this.notificationService.showSuccess('Pool has been created', '')
          this.spinnerService.off();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Something went wrong when adding pool', '');
        })
  }
}
