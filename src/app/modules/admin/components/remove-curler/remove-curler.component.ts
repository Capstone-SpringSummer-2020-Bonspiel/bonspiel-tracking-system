import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
@Component({
  selector: 'app-remove-curler',
  templateUrl: './remove-curler.component.html',
  styleUrls: ['./remove-curler.component.scss'],
})
export class RemoveCurlerComponent implements OnInit {
  formGroup: FormGroup;
  organizations: any[] = [];
  curlers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Initialize form group
    this.formGroup = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          organizationIdCtrl: ['', Validators.required],
        }),
        this.fb.group({
          curlerIdCtrl: ['', Validators.required],
        })
      ]),
    });

    console.log(this.formGroup);

    this.getOrganizations();
  }

  // Returns a FormArray with the name 'formArray'
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  getCtrlValue(index) {
    return this.formGroup.get('formArray').value[index];
  }

  getOrganizations() {
    // Get organizations
    this.spinnerService.on();
    this.apiService.getAllOrganizations()
      .subscribe(
        (res: any) => {
          console.log(res);
          this.organizations = res;
          this.organizations.sort((a, b) => (a.name > b.name ? 1 : -1));
        })
      .add(() => {
        this.spinnerService.off();
      });
  }

  getCurlersByOrganizationId() {
    const organizationId = this.getCtrlValue(0).organizationIdCtrl;

    // Get curlers by organization ID
    this.spinnerService.on();
    this.apiService
      .getCurlersByOrganization(organizationId)
      .subscribe((res: any) => {
        console.log(res);
        this.curlers = res;
        this.curlers.sort((a, b) => (a.name > b.name ? 1 : -1));
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const curlerId = this.getCtrlValue(1).curlerIdCtrl;

    // Remove curler
    this.spinnerService.on();
    this.apiService
      .removeCurler(curlerId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Curler has been removed', '');

          // Reset the stepper
          stepper.reset();

          // Reset the form and validation
          this.formGroup.reset()
          Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.controls[key].setErrors(null)
          });

          // Re-fetch events
          this.getOrganizations();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError(error.message, 'ERROR');
        }
      )
      .add(() => {
        this.spinnerService.off();
      });
  }
}
