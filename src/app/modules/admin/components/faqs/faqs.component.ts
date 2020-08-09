import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  src = "https://github.com/Capstone-SpringSummer-2020-Bonspiel/bonspiel-tracking-system/blob/master/src/assets/test_sample.pdf"
  constructor() { }

  ngOnInit(): void {
  }

}
