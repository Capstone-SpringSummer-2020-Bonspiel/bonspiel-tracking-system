import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-pool',
  templateUrl: './edit-pool.component.html',
  styleUrls: ['./edit-pool.component.scss']
})
export class EditPoolComponent implements OnInit {
  allBracketData: null;
  selectedBracketData: null;
  allPoolData: null;
  selectedPoolData: null;

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // this.spinnerService.on();
    // this.apiService
    //   .getBracket('1')
    //   .subscribe((res: any) => {
    //     console.log('[DEBUG] eventObtain() in bracket component:');
    //     console.log(res);
    //     this.allBracketData = res;
    //     this.selectedBracketData = res[0];
    //     console.log(res);

    //     this.spinnerService.off();
    //   })

    this.spinnerService.on();
    this.apiService
      .getPool('1')
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.allPoolData = res;
        this.selectedPoolData = res[0];

        this.spinnerService.off();
      })
  }

}
