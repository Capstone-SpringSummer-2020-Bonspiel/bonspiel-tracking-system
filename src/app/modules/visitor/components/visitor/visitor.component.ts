import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss'],
})
export class VisitorComponent implements OnInit {
  public currentWindowWidth: number;

  currentReq$ = null;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    public spinner: SpinnerService,
    public notifier: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth;
    const start = new Date().getTime();
    this.spinner.on();
    this.currentReq$ = this.apiService.testAPI().subscribe((res) => {
      setTimeout(() => {
        this.currentReq$ = null;
        const end = new Date().getTime();
        this.notifier.showSuccess(
          `Query took ${((end - start) / 1000).toString()} seconds.`,
          ''
        );
        console.log(res);
        this.spinner.off();
      }, 5000);
    });
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    const ESC_KEYCODE = 27;

    // Case: ESC character
    if (event.keyCode === ESC_KEYCODE && this.currentReq$ !== null) {
      // Cancel current HTTP request
      this.currentReq$.unsubscribe();
      this.currentReq$ = null;
      this.spinner.off();
      this.notifier.showWarning('Request Cancelled!', '');
      // this.notifier.showSuccess('', '');
      // this.notifier.showError('', '');
      // this.notifier.showInfo('', '');
      console.log('Request cancelled!');
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }
}
