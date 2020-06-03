import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/api/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  sideBarOpen = true;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    const payload = 'SELECT * FROM public.curlingevent ORDER BY id ASC';
    this.api.adHocQuery(payload).subscribe((res) => {
      console.log(res);
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
