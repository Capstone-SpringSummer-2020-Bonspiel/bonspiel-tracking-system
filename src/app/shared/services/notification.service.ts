import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  defaultPositionClass = {
    timeOut: 30000,
    extendedTimeOut: 100,
    tapToDismiss: true,
    debug: false,
    fadeOut: 10,
    positionClass: 'toast-top-center',
  };

  constructor(private toastr: ToastrService) { }

  showSuccess(message, title) {
    this.toastr.success(message, title, this.defaultPositionClass);
  }

  showError(message, title) {
    this.toastr.error(message, title, this.defaultPositionClass);
  }

  showInfo(message, title) {
    this.toastr.info(message, title, this.defaultPositionClass);
  }

  showWarning(message, title) {
    this.toastr.warning(message, title, this.defaultPositionClass);
  }
}
