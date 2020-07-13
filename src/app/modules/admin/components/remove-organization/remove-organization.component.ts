import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-remove-organization',
  templateUrl: './remove-organization.component.html',
  styleUrls: ['./remove-organization.component.scss']
})
export class RemoveOrganizationComponent implements OnInit {
  allOrganizationData: null;
  selectedOrganization: null;
  submitResult: Number;
  selectedOrganizationId: Number;

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private spinner: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinner.on();
    this.api
      .getAllOrganizations()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allOrganizationData = res;
        console.log("ThisEventDataBelow:");
        console.log(this.allOrganizationData);

        this.spinner.off();
      })
  }
  onOrganizationSelected(event: any) {
    console.log(this.allOrganizationData);
    console.log('the selected event is:');
    console.log(this.selectedOrganization);

    this.selectedOrganizationId = event.value;
  }
  onOrganizationDelete() {
    console.log("Event Delete: ")
    console.log(this.selectedOrganizationId)
    this.submitResult = 200;

    // this.spinner.on();
    // this.api
    //   .deleteOrganization(this.selectedEventId)
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
