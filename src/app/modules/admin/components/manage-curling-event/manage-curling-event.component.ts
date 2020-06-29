import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-curling-event',
  templateUrl: './manage-curling-event.component.html',
  styleUrls: ['./manage-curling-event.component.scss']
})

export class ManageCurlingEventComponent implements OnInit {

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: SpinnerService) { }

  selectedEventId = null;
  allEventData = null;
  selectedEvent = null;
  newEditEvent = null;
  eventTypes = ["Pools", "Champion"];
  eventCompleted = ["Yes", "No"];


  ngOnInit(): void {
    this.spinner.on();

    this.api
      .currentEventId$
      .subscribe((eventId) => {
        this.selectedEventId = eventId;
        console.log(this.selectedEventId);

        this.api
          .getEvents()
          .subscribe((res: any) => {
            console.log('[DEBUG] eventObtain() in schedule component:');
            console.log(res);
            this.allEventData = res;

            this.dataProcess();
            this.spinner.off();
          })
      })
  }

  dataProcess(): void {
    var key = 0;
    for (let i = 0; i < this.allEventData.length; i++) {
      if (this.allEventData[i].id == this.selectedEventId) {
        this.selectedEvent = this.allEventData[i];
        key = 1;
      }
    }
    if (key == 0) {
      console.log("Didn't find the selected event id, something wrong.")
    } else if (key == 1) {
      console.log("Target selected event found, selectedEvent updated.")
    }
  }

  //Edit event data check to make sure data follow requirement
  triggerDataCheck(): void {
    // Name can be changed without distress
    // begin_date must be before end_date
    // If completed is true, begin date and end date is before or at present. Similarly, if completed is false, begin and/or end dates are in future. 
    // Also, all draws must have ‘start’ between begin and end dates
    // If completed is changed from false to true, all games must be indicated as finished 
    // Info can be changed without distress
    // Event_Type is one of ‘pool’, ‘bracket’, ‘championship’ or ‘friendly’
    // If event_type is to be changed, there should be NO pools or brackets associated with said eventId
  }

  //the trigger event that send updated info to database
  triggerEditEvent(): void {

  }

  //the trigger event that send remove command to database
  triggerRemoveEvent(): void {

  }
}

export interface eventData {
  name: String,
  begin_date: Date,
  end_date: Date,
  completed: Boolean,
  info: String,
  event_type: String
};
