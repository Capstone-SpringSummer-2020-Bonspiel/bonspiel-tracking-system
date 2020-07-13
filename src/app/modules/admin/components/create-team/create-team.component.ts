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
    private api: ApiService,
    private spinner: SpinnerService,
    private notifier: NotificationService
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrlName: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrlNote: [''],
      secondCtrlOrg: [null],
    });
    this.spinner.on();
    this.api.getAllOrganizations().subscribe((res: any) => {
      this.organizations = res;
      this.organizations.sort((a, b) => (a.full_name > b.full_name ? 1 : -1));
      this.spinner.off();
      console.log('organizations=');
      console.log(this.organizations);
    });
  }

  onClickSubmit() {
    const name = this.firstFormGroup.value.firstCtrlName;
    const note = this.secondFormGroup.value.secondCtrlNote;
    const org = this.secondFormGroup.value.secondCtrlOrg;
    console.log(`name= ${name}`);
    console.log(`note= ${note}`);
    console.log(`org= ${org}`);
    this.api.createTeam(name, note, org).subscribe(
      (res: any) => this.notifier.showSuccess('Team has been created', ''),
      (error) => {
        console.log(error);
        this.notifier.showError('Something went wront', '');
      }
    );
  }
}
