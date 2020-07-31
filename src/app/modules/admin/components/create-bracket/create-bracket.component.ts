import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-create-bracket',
  templateUrl: './create-bracket.component.html',
  styleUrls: ['./create-bracket.component.scss']
})
export class CreateBracketComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  events: null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] getEvent() obtain data:');
        console.log(res);
        this.events = res;
        this.spinnerService.off();
      })

    this.firstFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      bracketNameCtrl: ['', Validators.required],
    });
  }

  onEventSelected(event: any, stepper: MatStepper) {
    if (event === undefined) {
      return;
    }
    stepper.next()
  }

  onClickSubmit(stepper) {
    const eventId = String(this.firstFormGroup.value.eventCtrl.id);
    const bracketName = this.secondFormGroup.value.bracketNameCtrl;
    console.log('eventId', eventId);
    console.log('bracketName', bracketName);

    this.spinnerService.on();
    this.apiService
      .createBracket(bracketName, eventId)
      .subscribe(
        (res: any) => {
          console.log(res)
          this.notificationService.showSuccess('Bracket has been created!', '')

          // Reset the stepper, forms and validation
          stepper.reset();

          let formGroups = [
            this.firstFormGroup,
            this.secondFormGroup
          ]

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Bracket create failed!');
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
