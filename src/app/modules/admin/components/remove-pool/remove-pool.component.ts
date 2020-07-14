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
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  allPoolData: null;
  allEventData: null;
  selectedPool: null;
  submitResult: Number;
  selectedPoolId: Number;
  selectedEventId: 0;

  constructor(
    private apiService: ApiService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {

    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required],
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required],
    // });


    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        this.selectedEventId = res[0].id;
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        this.apiService.getPool(this.selectedEventId).subscribe((res: any) => {
          this.allPoolData = res;
          this.selectedPool = res[0];
        })

        this.spinnerService.off();
      })
  }
  onEventSelected(event: any) {
    console.log('the selected Event is:');
    console.log(this.allEventData);

    this.selectedEventId = event.value.id;
    console.log('the selected Event ID is:');
    console.log(this.selectedEventId);

    this.apiService.getPool(this.selectedEventId).subscribe((res: any) => {
      this.allPoolData = res;
      this.selectedPool = res[0];
      this.selectedPoolId = res[0].id;
    })
  }
  onPoolSelected(event: any) {
    console.log(this.allEventData);
    console.log('the selected Pool is:');
    console.log(this.allEventData);
    console.log(event.value);

    this.selectedPoolId = event.value.id;
  }

  onPoolDelete() {
    // const targetEventId = this.firstFormGroup.value.firstCtrl;
    // const targetPoolId = this.secondFormGroup.value.secondCtrl;
    console.log("Event Select: ")
    console.log(this.selectedEventId)
    console.log("Pool Delete: ")
    console.log(this.selectedPoolId)

    this.spinnerService.on();
    this.apiService
      .removePool(String(this.selectedPoolId))
      .subscribe(
        (res: any) => {
          this.notificationService.showError('Organization has been deleted', '');
          this.spinnerService.off();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Something went wrong during delete event', '');
        })


  }
}
