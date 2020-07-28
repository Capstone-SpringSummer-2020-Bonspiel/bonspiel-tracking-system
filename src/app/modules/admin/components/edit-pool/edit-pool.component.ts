import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-pool',
  templateUrl: './edit-pool.component.html',
  styleUrls: ['./edit-pool.component.scss']
})
export class EditPoolComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  allPoolData: null;
  selectedPool: { name: 'Defaultname'; }
  selectedPoolId: Number;

  allEventData: null;
  selectedEvent: null;
  selectedEventId: 0;

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
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        this.selectedEvent = res[0];
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        // this.apiService.getPool(this.selectedEventId).subscribe((res: any) => {
        //   console.log(res)
        //   this.allPoolData = res;
        //   this.selectedPool = res[0];
        //   // this.selectedPoolId = res[0].id;
        // })

        this.spinnerService.off();
      })

    this.zeroFormGroup = this._formBuilder.group({
      eventCtrl: ['', Validators.required],
    });
    this.firstFormGroup = this._formBuilder.group({
      poolCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      eventNameCtrl: ['', Validators.required],
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
      console.log(res)
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
    //Edit Pool
    const poolName = this.secondFormGroup.value.eventNameCtrl;
    console.log("Event Select: ")
    console.log(this.selectedEventId)
    console.log("Pool Delete: ")
    console.log(this.selectedPoolId)

    this.spinnerService.on();
    this.apiService
      .editPool(poolName, String(this.selectedEventId), String(this.selectedPoolId))
      .subscribe(
        (res: any) => {
          this.notificationService.showSuccess('Pool has been successfully modified!', '');
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Pool modified failed!');
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });


  }

}
