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
  @Output() sidenavToggle: EventEmitter<any> = new EventEmitter<any>();

  constructor(public router: Router,
    private api: ApiService,
    private spinner: SpinnerService) { }

  ngOnInit(): void { }

  signIn() {
    this.router.navigateByUrl('/admin');
  }
}
