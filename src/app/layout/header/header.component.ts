import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentEvents = [];

  @Output() sidenavToggle: EventEmitter<any> = new EventEmitter<any>();

  constructor(public router: Router,
    private api: ApiService,
    private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.api.currentEvents$.subscribe(events => {
      this.currentEvents.length = 0;
      for (const event of events) {
        this.currentEvents.push(event);
      }
    })
  }

  signIn() {
    this.router.navigateByUrl('/admin');
  }
}
