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
    this.spinner.on();

    this.api.adHocQuery('SELECT * FROM public.curlingevent ORDER BY id ASC').subscribe((res: any) => {
      console.log('adHocQuery in header:');
      console.log(res);

      for (const row of res.rows) {
        this.currentEvents.push(row);
      }

      this.spinner.off();
    });
  }

  toggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  signIn() {
    this.router.navigateByUrl('/admin');
  }
}
