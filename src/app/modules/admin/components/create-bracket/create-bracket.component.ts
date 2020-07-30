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
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;

  allEventData: null;
  selectedEventId: Number = undefined;
  selectedEvent: any = undefined;

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
        this.allEventData = res;
        this.spinnerService.off();
      })

    this.firstFormGroup = this.fb.group({
      eventNameCtrl: ['', Validators.required],
    });
  }

  onEventSelected(event: any, stepper: MatStepper) {
    console.log('the selected event is:');
    console.log(this.selectedEvent);

    if (this.selectedEvent === undefined) {
      this.selectedEvent = undefined;
      this.selectedEventId = undefined;
    } else {
      this.selectedEvent = event.value;
      this.selectedEventId = event.value.id;
      stepper.next()
    }
  }

  onClickSubmit(stepper) {
    //Create Bracket
    const bracketName = this.firstFormGroup.value.eventNameCtrl;
    console.log('SELECTED EVENT ID');
    console.log(this.selectedEventId)
    console.log('NEW BRACKET NAME:');
    console.log(bracketName);

    this.spinnerService.on();
    this.apiService
      .createBracket(bracketName, String(this.selectedEvent.id))
      .subscribe((res: any) => {
        // this.apiService.getBracket(this.selectedEventId).subscribe((res: any) => {
        //   console.log("display bracket for event:")
        //   console.log(res)
        // })
        console.log(res)
        this.notificationService.showSuccess('Bracket has been created!', '')
      },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Bracket create failed!');
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });
  }
}
