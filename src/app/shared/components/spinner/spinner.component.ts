import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  loadingText = 'Loading...';

  constructor(
    private spinner: NgxSpinnerService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.spinner$.subscribe((data) => {
      if (data.state !== undefined || data.state !== null) {
        this.toggleSpinner(data.state);
      }
    });
  }

  ngOnDestroy() {}

  toggleSpinner(state) {
    if (state === true) {
      this.spinner.show();
    } else if (state === false) {
      this.spinner.hide();
    }
  }
}
