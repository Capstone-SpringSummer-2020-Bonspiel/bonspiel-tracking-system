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
  // questions = [
  //   'What line must a rock pass to be considered in play?',
  //   'To start a regular game of curling you need how many players altogether? (Remember, there are two teams per game.)',
  //   'Where did the game of curling originate?',
  //   "If a team's rock is the closest to this, that team scores points in that end. What is it?",
  //   'Before a curling game can start, one team must throw the first rock/stone. How is this determined?',
  //   'What is the throw called when a rock rotates toward the outer lines of the curling sheet?',
  //   'What is another name for a curling team?',
  //   'If a team accidentally touches a rock in play, that team has committed which rule infraction?',
  //   'Approximately how much beer was delivered and stored to be served in the Brier Patch for the 2001 Brier?',
  //   'In a regular curling game, how many rocks/stones can be on the ice at any one time? (Hint: there are two teams on the ice during a game and each player gets to throw two rocks.)',
  //   'What is the name of the person who calls the shots in a game?',
  //   // '',
  //   // '',
  //   // '',
  //   // '',
  // ]
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
