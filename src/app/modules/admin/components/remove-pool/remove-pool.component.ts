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
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

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
    this.firstFormGroup = this.fb.group({
      eventCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      poolCtrl: ['', Validators.required],
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

  getPools(stepper: MatStepper) {
    const eventId = this.firstFormGroup.controls.eventCtrl.value;
    console.log('eventId', eventId);

    // Get pools
    this.spinnerService.on();
    this.apiService
      .getPool(eventId)
      .subscribe((res: any) => {
        this.pools = res;
        this.pools.sort((a, b) => (a.name > b.name ? 1 : -1));
        console.log('pools:');
        console.log(this.pools);

        stepper.next();
      })
      .add(() => {
        this.spinnerService.off();
      });
  }

  onClickRemove(stepper: MatStepper) {
    const poolId = this.secondFormGroup.controls.poolCtrl.value;

    // Remove pool
    this.spinnerService.on();
    this.apiService
      .removePool(poolId)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.notificationService.showSuccess('Pool has been removed', '');

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
          console.log(err.message);
          this.notificationService.showError(err.message, 'Pool deleted failed!');
        })
      .add(
        () => {
          this.spinnerService.off()
        });
  }
}
