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

  allBracketData: null;
  selectedBracket: any = { name: 'SampleName', }
  selectedBracketId: Number;

  allEventData: null;
  selectedEventId: Number;
  selectedEvent: null;

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
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        this.selectedEvent = res[0];
        // this.selectedEventId = res[0].id;
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        // this.apiService.getBracket(this.selectedEventId).subscribe((res: any) => {
        //   this.allBracketData = res;
        //   this.selectedBracket = res[0];
        //   if (res[0]) {
        //     this.selectedBracketId = res[0].id;
        //   }
        // })

        this.spinnerService.off();
      })

    this.zeroFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.firstFormGroup = this.fb.group({
      bracketCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      eventNameCtrl: ['', Validators.required],
    });
  }
  onEventSelected(event: any) {
    console.log('the selected event is:');
    console.log(event);

    this.selectedEvent = event.value;
    this.selectedEventId = event.value.id;

    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.apiService.getBracket(this.selectedEventId).subscribe((res: any) => {
      console.log(res)
      this.allBracketData = res;
      this.selectedBracket = res[0];
      if (res[0]) {
        this.selectedBracketId = res[0].id;
      }
    })
  }
  onBracketSelected(bracket: any) {
    console.log(this.allEventData);
    console.log('the selected Pool is:');
    console.log(bracket.value);

    this.selectedBracket = bracket.value;
    this.selectedBracketId = bracket.value.id;
  }
  onClickSubmit(stepper) {
    //Remove Bracket
    const bracketName = this.secondFormGroup.value.eventNameCtrl;
    console.log("Event Select: ")
    console.log(this.selectedEventId)
    console.log("Bracket selected: ")
    console.log(this.selectedBracket)
    console.log(this.selectedBracketId)

    this.spinnerService.on();
    this.apiService
      .editBracket(bracketName, String(this.selectedEventId), String(this.selectedBracketId))
      .subscribe(
        (res: any) => {
          this.notificationService.showSuccess('Bracket has been successfully deleted!', '');
          this.spinnerService.off();
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
