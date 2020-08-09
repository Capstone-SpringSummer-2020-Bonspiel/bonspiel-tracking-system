import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructionals',
  templateUrl: './instructionals.component.html',
  // templateUrl: './groundRules.html',
  styleUrls: ['./instructionals.component.scss']
})
export class InstructionalsComponent implements OnInit {
  src = "https://nbviewer.jupyter.org/github/Capstone-SpringSummer-2020-Bonspiel/bonspiel-tracking-system/blob/dev/src/assets/pdf/BUR.pdf"
  // src = "assets\img\curler-silhouette.jpg"

  constructor() { }

  ngOnInit(): void {
  }

}
