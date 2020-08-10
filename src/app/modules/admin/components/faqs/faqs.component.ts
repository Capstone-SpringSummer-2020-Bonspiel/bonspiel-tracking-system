import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
  // template: `
  // <pdf-viewer [src]="pdfSrc" 
  //             [render-text]="true"
  //             style="display: block;"
  // ></pdf-viewer>
  // `
})
export class FaqsComponent implements OnInit {
  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdfSrc = "https://github.com/Capstone-SpringSummer-2020-Bonspiel/bonspiel-tracking-system/raw/dev/src/assets/pdf/FAQ.pdf"
  constructor() { }

  ngOnInit(): void {
  }
  // onFileSelected() {
  //   let $img: any = document.querySelector('#file');

  //   if (typeof (FileReader) !== 'undefined') {
  //     let reader = new FileReader();

  //     reader.onload = (e: any) => {
  //       this.pdfSrc = e.target.result;
  //     };

  //     reader.readAsArrayBuffer($img.files[0]);
  //   }
  // }
}
