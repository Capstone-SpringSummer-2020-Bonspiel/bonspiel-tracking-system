import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-remove-event',
  templateUrl: './remove-event.component.html',
  styleUrls: ['./remove-event.component.scss']
})
export class RemoveEventComponent implements OnInit {
  allEventData: null;
  selectedEvent: null;
  submitResult: Number;

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: SpinnerService,) { }

  ngOnInit(): void {
    this.spinner.on();
    this.api
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        this.spinner.off();
      })
  }
  onEventSelected(event: any) {
    console.log(this.allEventData);
    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.selectedEvent = event.value;
  }
  onEventDelete() {
    console.log("Event Delete: ")
    console.log(this.selectedEvent)
    this.submitResult = 200;

    // this.spinner.on();
    // this.api
    //   .deleteEvent(this.selectedEvent.id)
    //   .subscribe((res: any) => {
    //     this.spinner.off();
    //   })
  }
  // onClickConfirm(){
  //   if(confirm("are you sure?")){
  //     this.onEventDelete();
  //     console.log("Event Deleted.");
  //   }
  // }
}