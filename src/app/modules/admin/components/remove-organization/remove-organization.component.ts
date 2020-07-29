import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-remove-organization',
  templateUrl: './remove-organization.component.html',
  styleUrls: ['./remove-organization.component.scss']
})
export class RemoveOrganizationComponent implements OnInit {
  organizations: null;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    // Initialize form group
    this.formGroup = this.fb.group({
      organizationCtrl: ['', Validators.required],
    });

    console.log(this.formGroup);

    this.getOrganizations();
  }

  getOrganizations() {
    // Get organizations
    this.spinnerService.on();
    this.apiService.getAllOrganizations()
      .subscribe(
        (res: any) => {
          console.log('[DEBUG] eventObtain() in schedule component:');
          console.log(res);
          this.organizations = res;
        })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const orgId = String(this.formGroup.get('organizationCtrl').value.id);

    // Remove organization
    this.spinnerService.on();
    this.apiService.removeOrganization(orgId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Organization has been removed', '');
          stepper.reset();
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Organization deleted failed!');
          this.spinnerService.off();
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
