import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
      .getAllOrganizations()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allOrganizationData = res;
        this.selectedOrganization = res[0];
        console.log("ThisEventDataBelow:");
        console.log(this.allOrganizationData);

        this.spinnerService.off();
      })

    this.zeroFormGroup = this._formBuilder.group({
      organizationCtrl: ['', Validators.required],
    });
  }
  onOrganizationSelected(event: any) {
    console.log('the selected event is:');
    console.log(this.selectedOrganization);

    this.selectedOrganization = event.value;
    this.selectedOrganizationId = event.value.id;

    console.log('the selected event is:');
    console.log(this.selectedOrganization);
  }
  onClickSubmit(stepper) {
    //Remove Organization
    console.log("Organization Delete: ")
    console.log(this.selectedOrganizationId)

    this.spinnerService.on();
    this.apiService
      .removeOrganization(String(this.selectedOrganizationId))
      .subscribe(
        (res: any) => {
          this.notificationService.showSuccess('Organization has been successfully deleted!', '');
          this.spinnerService.off();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Organization deleted failed!', '');
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
