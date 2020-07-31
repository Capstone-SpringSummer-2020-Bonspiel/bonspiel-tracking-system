import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {

  loadingText = 'Loading...';
  quotes = [
    "IT ORIGINATED IN 16TH-CENTURY SCOTLAND",
    "CURLING STONES ARE MADE FROM RARE GRANITE",
    "THE SPORT MADE ITS OLYMPIC DEBUT 74 YEARS BEFORE IT BECAME AN OFFICIAL SPORT",
    "IT’S NICKNAMED “THE ROARING GAME”",
    "PLAYERS WEAR TWO DIFFERENT TYPES OF SHOES",
    "THE SPORT HAS HAD AT LEAST ONE NOTABLE BADASS",
    "POLITENESS IS REQUIRED",
    "IT’S SEEN ITS FAIR SHARE OF SCANDALS",
  ]
  i = 0;
  quotesLen = this.quotes.length;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private spinnerService: SpinnerService
  ) {
    this.shuffleArray(this.quotes);
    this.setLoadingText();
  }

  ngOnInit(): void {
    this.spinnerService.spinner$.subscribe((data) => {
      if (data.state !== undefined || data.state !== null) {
        this.toggleSpinner(data.state);
      }
    });
  }

  ngOnDestroy() { }

  toggleSpinner(state) {
    if (state === true) {
      this.ngxSpinnerService.show();
    } else if (state === false) {
      this.ngxSpinnerService.hide();
      setTimeout(() => {
        this.setLoadingText();
      }, 500);
    }
  }

  setLoadingText() {
    this.loadingText = this.quotes[this.i++];

    // Reset to the beginning if we reached the end of the array
    if (this.i > (this.quotesLen - 1)) {
      this.i = 0;
    }
  }

  shuffleArray(array) {
    // Randomize array in-place using Durstenfeld shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}
