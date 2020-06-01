import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  sideBarOpen = true;

  constructor() {}

  ngOnInit(): void {}

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
