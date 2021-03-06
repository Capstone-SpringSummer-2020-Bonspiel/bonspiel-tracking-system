import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-pool',
  templateUrl: './edit-pool.component.html',
  styleUrls: ['./edit-pool.component.scss']
})
export class EditPoolComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  events: any[] = [];
  selectedEvent = null;

  pools: any[] = [];
  selectedPool = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      poolCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.fb.group({
      poolNameCtrl: ['', Validators.required],
    });

    this.getPoolEvents();
  }

  getPoolEvents() {
    this.spinnerService.on();
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        this.events = res.filter(x => x.event_type === 'pools');
        this.events.sort((a, b) => a.name > b.name ? 1 : -1);
        console.log('events');
        console.log(this.events);
        this.spinnerService.off();
      })
  }

  selectEvent() {
    this.selectedEvent = this.events.filter(x => x.id === this.firstFormGroup.value.eventCtrl)[0];
    console.log('selectedEvent');
    console.log(this.selectedEvent);

    this.spinnerService.on();
    this.apiService.getPool(this.selectedEvent.id).subscribe((res: any) => {
      this.pools = res;
      this.pools.sort((a, b) => a.name > b.name ? 1 : -1);
      console.log('pools');
      console.log(this.pools);
      this.spinnerService.off();
    })
  }

  selectPool() {
    this.selectedPool = this.pools.filter(x => x.id === this.secondFormGroup.value.poolCtrl)[0];
    this.thirdFormGroup.controls.poolNameCtrl.setValue(this.selectedPool.name);
  }

  onClickSubmit(stepper) {
    const newpoolName = this.thirdFormGroup.value.eventNameCtrl;

    this.spinnerService.on();
    this.apiService
      .editPool(newpoolName, this.selectedEvent.id, this.selectedPool.id)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Pool has been successfully modified!', '');

          // Reset the form and validation
          stepper.reset();

          let formGroups = [this.firstFormGroup, this.secondFormGroup, this.thirdFormGroup];

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
          this.getPoolEvents();
        });


  }

}
