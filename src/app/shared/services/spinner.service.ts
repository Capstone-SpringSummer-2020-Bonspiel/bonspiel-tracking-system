import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private subject = new BehaviorSubject({
    state: undefined,
  });
  spinner$ = this.subject.asObservable();

  constructor() {}

  on() {
    this.subject.next({ state: true });
  }

  off() {
    this.subject.next({ state: false });
  }
}
