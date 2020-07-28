import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
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
  formGroup: FormGroup;

  events: any = [];
  brackets: any = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Initialize form group
    this.formGroup = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          eventCtrl: ['', Validators.required],
        }),
        this.fb.group({
          bracketCtrl: ['', Validators.required],
        }),
      ]),
    });

    console.log(this.formGroup);

    this.getEvents();
  }

  // Returns a FormArray with the name 'formArray'
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }

  getCtrlValue(index) {
    return this.formGroup.get('formArray').value[index];
  }

  getEvents() {
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

  getBrackets() {
    // Get brackets
    this.spinnerService.on();
    this.apiService
      .getBracket(this.getCtrlValue(0).eventCtrl)
      .subscribe((res) => {
        this.brackets = res;
        console.log('brackets:');
        console.log(this.brackets);
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const bracketId = this.getCtrlValue(1).bracketCtrl;

    // Remove bracket
    this.spinnerService.on();
    this.apiService
      .removeBracket(bracketId)
      .subscribe(
        (res: any) => {
          console.log(res);

          this.notificationService.showSuccess('Bracket has been removed', '');
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Bracket deleted failed!');
          this.spinnerService.off();
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });


  }
}
