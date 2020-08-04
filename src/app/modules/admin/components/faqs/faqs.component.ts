import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  src = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"
  constructor() { }

  ngOnInit(): void {
  }

}
