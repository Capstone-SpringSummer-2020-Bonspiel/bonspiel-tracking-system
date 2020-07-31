import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { MatStepper } from '@angular/material/stepper';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-remove-pool',
  templateUrl: './remove-pool.component.html',
  styleUrls: ['./remove-pool.component.scss'],
})
export class RemovePoolComponent implements OnInit {
  formGroup: FormGroup;

  events: any = [];
  pools: any = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
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
          poolCtrl: ['', Validators.required],
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

  getPools() {
    // Get pools
    this.spinnerService.on();
    this.apiService
      .getPool(this.getCtrlValue(0).eventCtrl)
      .subscribe((res: any) => {
        this.pools = res;
        this.pools.sort((a, b) => (a.name > b.name ? 1 : -1));
        console.log('pools:');
        console.log(this.pools);
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const poolId = this.getCtrlValue(1).poolCtrl;

    // Remove pool
    this.spinnerService.on();
    this.apiService
      .removePool(poolId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Pool has been removed', '');
        },
        (err) => {
          console.log(err.message);
          this.notificationService.showError(err.message, 'Pool deleted failed!');
        })
      .add(
        () => {
          stepper.reset();
          this.spinnerService.off()
        });


  }
}
