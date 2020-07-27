import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-remove-pool',
  templateUrl: './remove-pool.component.html',
  styleUrls: ['./remove-pool.component.scss']
})
export class RemovePoolComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;

  allPoolData: null;
  allEventData: null;
  selectedEvent: null;
  selectedPool: null;
  submitResult: Number;
  selectedPoolId: Number;
  selectedEventId: 0;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
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
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        // this.apiService.getPool(this.selectedEventId).subscribe((res: any) => {
        //   this.allPoolData = res;
        //   this.selectedPool = res[0];
        //   this.selectedPoolId = res[0].id;
        // })

        this.spinnerService.off();
      })

    this.zeroFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.firstFormGroup = this.fb.group({
      poolCtrl: ['', Validators.required],
    });
  }
  onEventSelected(event: any) {
    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.selectedEvent = event.value;
    this.selectedEventId = event.value.id;

    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.apiService.getPool(this.selectedEventId).subscribe((res: any) => {
      this.allPoolData = res;
      this.selectedPool = res[0];
      if (res[0]) {
        this.selectedPoolId = res[0].id;
      }
    })
  }
  onPoolSelected(pool: any) {
    console.log(this.allEventData);
    console.log('the selected Pool is:');
    console.log(this.allEventData);
    console.log(pool.value);

    this.selectedPool = pool.value;
    this.selectedPoolId = pool.value.id;
  }

  onClickSubmit(stepper) {
    //Remove Pool
    console.log("Event Select: ")
    console.log(this.selectedEventId)
    console.log("Pool Delete: ")
    console.log(this.selectedPoolId)

    this.spinnerService.on();
    this.apiService
      .removePool(String(this.selectedPoolId))
      .subscribe(
        (res: any) => {
          this.notificationService.showSuccess('Pool has been successfully deleted!', '');
          this.spinnerService.off();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Pool deleted failed!', '');
          this.spinnerService.off();
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });


  }
}
