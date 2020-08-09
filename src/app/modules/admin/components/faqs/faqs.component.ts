import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  src = "https://github.com/Capstone-SpringSummer-2020-Bonspiel/bonspiel-tracking-system/raw/dev/src/assets/FAQ.pdf"
  constructor() { }

  ngOnInit(): void {
  }

}
