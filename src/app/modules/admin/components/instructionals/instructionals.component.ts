import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructionals',
  templateUrl: './instructionals.component.html',
  // templateUrl: './groundRules.html',
  styleUrls: ['./instructionals.component.scss']
})
export class InstructionalsComponent implements OnInit {
  src = "https://github.com/Capstone-SpringSummer-2020-Bonspiel/bonspiel-tracking-system/raw/dev/src/assets/pdf/BatchUploadRule.pdf"
  // src = "assets\img\curler-silhouette.jpg"

  constructor() { }

  ngOnInit(): void {
  }

}
