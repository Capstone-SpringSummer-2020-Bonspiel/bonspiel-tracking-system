import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-remove-bracket',
  templateUrl: './remove-bracket.component.html',
  styleUrls: ['./remove-bracket.component.scss'],
})
export class RemoveBracketComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  events: any = [];
  brackets: any = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Initialize form group
    this.firstFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      bracketCtrl: ['', Validators.required],
    });

    this.loadEvents();
  }

  loadEvents() {
    // Get events
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res) => {
        this.events = res;
        this.events.sort((a, b) => (a.name > b.name ? 1 : -1));
        console.log('events:');
        console.log(this.events);
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  getBrackets(stepper: MatStepper) {
    const eventId = this.firstFormGroup.controls.eventCtrl.value;
    console.log('eventId', eventId);

    // Get brackets
    this.spinnerService.on();
    this.apiService
      .getBracket(eventId)
      .subscribe((res: any) => {
        this.brackets = res;
        this.brackets.sort((a, b) => (a.name > b.name ? 1 : -1));
        console.log('brackets:');
        console.log(this.brackets);

        stepper.next();
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const bracketId = this.secondFormGroup.controls.bracketCtrl.value;

    // Remove bracket
    this.spinnerService.on();
    this.apiService
      .removeBracket(bracketId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Bracket has been removed', '');

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
          this.notificationService.showError(err.message, 'Bracket deleted failed!');
          this.spinnerService.off();
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
