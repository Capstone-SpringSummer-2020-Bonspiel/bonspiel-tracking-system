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
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  allBracketData: null;
  allEventData: null;
  selectedBracket: null;
  submitResult: Number;
  selectedBracketId: Number;
  selectedEventId: 0;

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

    // // Create nodes
    // for (let i = 0; i < 20; i++) {
    //   this.nodes.push({
    //     id: String.fromCharCode(97 + i),
    //     label: String.fromCharCode(97 + i).toUpperCase()
    //   });
    // }
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allEventData = res;
        this.selectedEventId = res[0].id;
        console.log("ThisEventDataBelow:");
        console.log(this.allEventData);

        this.apiService.getBracket(this.selectedEventId).subscribe((res: any) => {
          this.allBracketData = res;
          this.selectedBracket = res[0];
        })

        this.spinnerService.off();
      })

    this.nodes = [
      { id: '801', label: '24 vs. 16' },
      { id: '803', label: '26 vs. 30' },
      { id: '804', label: '18 vs. 22' },
      { id: '802', label: '37 vs. 15' },
      { id: '807', label: '34 vs. 31' },
      { id: '808', label: '17 vs. 35' },
      { id: '806', label: '23 vs. 27' },
      { id: '805', label: '38 vs. 28' },
      { id: '809', label: '32 vs. 25' },
      { id: '814', label: '16 vs. 15' },
      { id: '811', label: '20 vs. 29' },
      { id: '812', label: '33 vs. 19' },
      { id: '810', label: '36 vs. 21' },
      { id: '815', label: '22 vs. 36' },
      { id: '813', label: '24 vs. 37' },
      { id: '817', label: '38 vs. 27' },
      { id: '818', label: '28 vs. 23' },
      { id: '816', label: '28 vs. 30' },
      { id: '824', label: '19 vs. 29' },
      { id: '822', label: '21 vs. 25' },
      { id: '821', label: '36 vs. 32' },
      { id: '820', label: '17 vs. 31' },
      { id: '819', label: '35 vs. 34' },
      { id: '828', label: '23 vs. 17' },
      { id: '827', label: '27 vs. 34' },
      { id: '826', label: '15 vs. 18' },
      { id: '825', label: '26 vs. 24' },
      { id: '823', label: '33 vs. 20' },
      { id: '832', label: '28 vs. 31' },
      { id: '831', label: '38 vs. 35' },
      { id: '830', label: '16 vs. 30' },
      { id: '840', label: '29 vs. 25' },
      { id: '829', label: '22 vs. 37' },
      { id: '839', label: '36 vs. 33' },
      { id: '835', label: '32 vs. 20' },
      { id: '836', label: '19 vs. 21' },
      { id: '834', label: '15 vs. 23' },
      { id: '833', label: '24 vs. 34' },
      { id: '837', label: '35 vs. 22' },
      { id: '838', label: '16 vs. 28' },
      { id: '844', label: '19 vs. 15' },
      { id: '842', label: '25 vs. 16' },
      { id: '843', label: '20 vs. 24' },
      { id: '841', label: '33 vs. 22' },
    ];

    // Create edges
    this.edges = [
      { id: '', source: '801', target: '814', label: '' },
      { id: '', source: '803', target: '816', label: '' },
      { id: '', source: '804', target: '816', label: '' },
      { id: '', source: '802', target: '814', label: '' },
      { id: '', source: '807', target: '820', label: '' },
      { id: '', source: '808', target: '820', label: '' },
      { id: '', source: '806', target: '818', label: '' },
      { id: '', source: '805', target: '818', label: '' },
      { id: '', source: '809', target: '822', label: '' },
      { id: '', source: '814', target: '826', label: '' },
      { id: '', source: '811', target: '824', label: '' },
      { id: '', source: '812', target: '824', label: '' },
      { id: '', source: '810', target: '822', label: '' },
      { id: '', source: '815', target: '825', label: '' },
      { id: '', source: '813', target: '825', label: '' },
      { id: '', source: '817', target: '827', label: '' },
      { id: '', source: '818', target: '828', label: '' },
      { id: '', source: '816', target: '826', label: '' },
      { id: '', source: '824', target: '836', label: '' },
      { id: '', source: '822', target: '836', label: '' },
      { id: '', source: '821', target: '835', label: '' },
      { id: '', source: '820', target: '828', label: '' },
      { id: '', source: '819', target: '827', label: '' },
      { id: '', source: '828', target: '834', label: '' },
      { id: '', source: '827', target: '833', label: '' },
      { id: '', source: '826', target: '834', label: '' },
      { id: '', source: '825', target: '833', label: '' },
      { id: '', source: '823', target: '835', label: '' },
      { id: '', source: '832', target: '838', label: '' },
      { id: '', source: '831', target: '837', label: '' },
      { id: '', source: '830', target: '838', label: '' },
      { id: '', source: '840', target: '842', label: '' },
      { id: '', source: '829', target: '837', label: '' },
      { id: '', source: '839', target: '841', label: '' },
      { id: '', source: '835', target: '843', label: '' },
      { id: '', source: '836', target: '844', label: '' },
      { id: '', source: '834', target: '844', label: '' },
      { id: '', source: '833', target: '843', label: '' },
      { id: '', source: '837', target: '841', label: '' },
      { id: '', source: '838', target: '842', label: '' },
      // {
      //   id: '',
      //   source: 'b',
      //   target: 'a',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'c',
      //   target: 'a',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'd',
      //   target: 'b',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'e',
      //   target: 'b',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'f',
      //   target: 'c',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'g',
      //   target: 'c',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'h',
      //   target: 'd',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'i',
      //   target: 'd',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'j',
      //   target: 'e',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'k',
      //   target: 'e',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'l',
      //   target: 'f',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'm',
      //   target: 'f',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'n',
      //   target: 'g',
      //   label: ''
      // },
      // {
      //   id: '',
      //   source: 'o',
      //   target: 'g',
      //   label: ''
      // }
    ];
  }
  onEventSelected(event: any) {
    console.log('the selected Event is:');
    console.log(this.allEventData);

    this.selectedEventId = event.value.id;
    console.log('the selected Event ID is:');
    console.log(this.selectedEventId);

    this.apiService.getPool(this.selectedEventId).subscribe((res: any) => {
      this.allBracketData = res;
      this.selectedBracket = res[0];
      this.selectedBracketId = res[0].id;
    })
  }
  onBracketSelected(event: any) {
    console.log(this.allEventData);
    console.log('the selected Pool is:');
    console.log(this.allEventData);
    console.log(event.value);

    this.selectedBracketId = event.value.id;
  }
  onBracketDelete() {
    // const targetEventId = this.firstFormGroup.value.firstCtrl;
    // const targetPoolId = this.secondFormGroup.value.secondCtrl;
    console.log("Event Select: ")
    console.log(this.selectedEventId)
    console.log("Bracket Delete: ")
    console.log(this.selectedBracketId)

    this.spinnerService.on();
    this.apiService
      .removeBracket(String(this.selectedBracketId))
      .subscribe(
        (res: any) => {
          this.notificationService.showError('Organization has been deleted', '');
          this.spinnerService.off();
        },
        (error) => {
          console.log(error);
          this.notificationService.showError('Something went wrong during delete event', '');
        })


  }
}
