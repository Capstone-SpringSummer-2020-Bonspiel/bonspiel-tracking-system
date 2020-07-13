import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  feedBackData: any;
  allOrganizationData: null;
  selectedEventId: Number;
  selectedOrganization: any = {
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
      .getAllOrganizations()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allOrganizationData = res;
        this.selectedOrganization = res[0];
        console.log("ThisEventDataBelow:");
        console.log(this.allOrganizationData);

        this.spinner.off();
      })

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: [''],
    });
  }

  onEventSelected(event: any) {
    console.log(this.allOrganizationData);
    console.log('the selected event is:');
    console.log(this.selectedOrganization);

    this.selectedEventId = event.value;
  }

  editOrganization() {
    var name = this.selectedOrganization.name;
    if (this.firstFormGroup.value.firstCtrl != '') {
      name = this.firstFormGroup.value.firstCtrl;
    }
    var info = this.selectedOrganization.info;
    if (this.secondFormGroup.value.secondCtrl != '') {
      info = this.secondFormGroup.value.secondCtrl;
    }

    console.log(`full name: ${name}`);
    console.log(`detail info: ${info}`);

    this.feedBackData = {
      signal: 200,
      name: name,
      info: info,
    }

    // this.spinner.on();
    // this.api
    //   .editOrganization(fullName, shortName, this.selectedOrganization.id)
    //   .subscribe((res: any) => {  
    //     this.spinner.off();
    //     this.feedBackData = res;
    //   })

    // const dialogRef = this.dialog.open(EditEventDialog, {
    //   data: {
    //     signal: '200',
    //     name: name,
    //     info: info,
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log("something happened.")
    // })

  }
}

//getAllOrganizations()