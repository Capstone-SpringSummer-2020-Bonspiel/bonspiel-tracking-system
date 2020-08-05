import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-bracket',
  templateUrl: './edit-bracket.component.html',
  styleUrls: ['./edit-bracket.component.scss']
})
export class EditBracketComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  events: any[] = [];
  selectedEvent = null;

  brackets: any[] = [];
  selectedBracket = null;


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.zeroFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.firstFormGroup = this.fb.group({
      bracketCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      bracketNameCtrl: ['', Validators.required],
    });

    this.getBracketEvents();
  }

  getBracketEvents() {
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        this.events = res.filter(x => x.event_type === 'brackets');
        this.events.sort((a, b) => a.name > b.name ? 1 : -1);
        console.log('events');
        console.log(this.events);
        this.spinnerService.off();;
      })
  }

  selectEvent() {
    this.selectedEvent = this.events.filter(x => x.id === this.zeroFormGroup.value.eventCtrl)[0];
    console.log('selectedEvent');
    console.log(this.selectedEvent);

    this.spinnerService.on();
    this.apiService.getBracket(this.selectedEvent.id).subscribe((res: any) => {
      this.brackets = res;
      this.brackets.sort((a, b) => a.name > b.name ? 1 : -1);
      console.log('brackets');
      console.log(this.brackets);
      this.spinnerService.off();
    });
  }

  selectBracket() {
    this.selectedBracket = this.brackets.filter(x => x.id === this.firstFormGroup.value.bracketCtrl)[0];
    this.secondFormGroup.controls.bracketNameCtrl.setValue(this.selectedBracket.name);
  }

  onClickSubmit(stepper) {
    const bracketName = this.secondFormGroup.value.bracketNameCtrl;

    this.spinnerService.on();
    this.apiService
      .editBracket(bracketName, this.selectedEvent.id, this.selectedBracket.id)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Bracket has been modified', '');

          // Reset the form and validation
          stepper.reset();

          let formGroups = [this.zeroFormGroup, this.firstFormGroup, this.secondFormGroup];

          for (let formGroup of formGroups) {
            formGroup.reset();
            Object.keys(formGroup.controls).forEach((key) => {
              formGroup.controls[key].setErrors(null);
            });
          }
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err.message, 'ERROR');
        })
      .add(
        () => {
          this.spinnerService.off();
          this.getBracketEvents();
        });


  }
}
