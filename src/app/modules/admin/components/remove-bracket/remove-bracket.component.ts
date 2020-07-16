import { Component, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-remove-bracket',
  templateUrl: './remove-bracket.component.html',
  styleUrls: ['./remove-bracket.component.scss']
})
export class RemoveBracketComponent implements OnInit {
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;

  allBracketData: null;
  allEventData: null;
  selectedEvent: null;
  selectedBracket: null;
  submitResult: Number;
  selectedBracketId: Number;
  selectedEventId: Number;

  nodes = [];
  edges = [];

  curve = shape.curveLinear;

  constructor(
    private apiService: ApiService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        console.log('getEvent():');
        console.log(res);
        this.allEventData = res;
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        // this.apiService.getBracket(this.selectedEventId).subscribe((res: any) => {
        //   this.allBracketData = res;
        //   this.selectedBracket = res[0];
        //   this.selectedBracketId = res[0].id;
        // })

        this.spinnerService.off();
      })

    this.zeroFormGroup = this._formBuilder.group({
      eventCtrl: ['', Validators.required],
    });
    this.firstFormGroup = this._formBuilder.group({
      bracketCtrl: ['', Validators.required],
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
    console.log("Event Select: ")
    console.log(this.selectedEventId)
    console.log("Bracket Delete: ")
    console.log(this.selectedBracket)
    console.log(this.selectedBracketId)

    this.spinnerService.on();
    this.apiService
      .removeBracket(this.selectedBracketId)
      .subscribe(
        (res: any) => {
          this.notificationService.showSuccess('Bracket has been successfully deleted!', '');
          this.spinnerService.off();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Bracket deleted failed!', '');
          this.spinnerService.off();
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });


  }
}
