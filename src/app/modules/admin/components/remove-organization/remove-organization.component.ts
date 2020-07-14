import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

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
    private apiService: ApiService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.on();
    this.apiService
      .getAllOrganizations()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allOrganizationData = res;
        console.log("ThisEventDataBelow:");
        console.log(this.allOrganizationData);

        this.spinnerService.off();
      })
  }
  onOrganizationSelected(event: any) {
    console.log(this.allOrganizationData);
    console.log('the selected organization is:');
    console.log(this.selectedOrganization);

    this.selectedOrganizationId = event.value.id;
  }
  onOrganizationDelete() {
    console.log("Organization Delete: ")
    console.log(this.selectedOrganizationId)

    this.spinnerService.on();
    this.apiService
      .removeOrganization(String(this.selectedOrganizationId))
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
  // onClickConfirm(){
  //   if(confirm("are you sure?")){
  //     this.onEventDelete();
  //     console.log("Event Deleted.");
  //   }
  // }
}
