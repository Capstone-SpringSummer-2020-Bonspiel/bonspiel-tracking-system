import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
})
export class CreateTeamComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  organizations: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrlName: ['', Validators.required],
      firstCtrlNote: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrlOrg: [null],
    });
    this.spinnerService.on();
    this.apiService.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.organizations.sort((a, b) => (a.full_name > b.full_name ? 1 : -1));
      this.spinnerService.off();
    });
  }

  onClickSubmit() {
    const name = this.firstFormGroup.value.firstCtrlName;
    const note = this.firstFormGroup.value.firstCtrlNote;
    const org = this.secondFormGroup.value.secondCtrlOrg;
    this.apiService.createTeam(name, note, org).subscribe(
      (res: any) =>
        this.notificationService.showSuccess('Team has been created', ''),
      (error) => {
        this.notificationService.showError('Something went wront', '');
      }
    );
  }
}
