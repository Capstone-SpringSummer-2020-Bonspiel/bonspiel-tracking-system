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

  feedBackData: any;

  allEventData: null;
  selectedEventId: Number;
  selectedEvent: any = {
    shortName: 'shortname',
    fullName: 'fullname',
  }

  constructor(
    private _formBuilder: FormBuilder,
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.spinner.on();
    this.api
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        this.selectedEvent = res[0];
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        this.spinner.off();
      })

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [''],
    });

  }
  onEventSelected(event: any) {
    console.log(this.allEventData);
    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.selectedEventId = event.value;
  }

  onCreatePool() {
    const bracketName = this.firstFormGroup.value.firstCtrl;
    console.log(`full name: ${bracketName}`);

    // this.spinner.on();
    // this.api
    //   .createPool(bracketName, this.selectedEvent.id)
    //   .subscribe((res: any) => {  
    //     this.spinner.off();
    //     this.feedBackData = res;
    //   })
  }
}
