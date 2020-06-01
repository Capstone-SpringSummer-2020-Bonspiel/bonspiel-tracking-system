import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogOverviewComponent } from '@app/modules/visitor/components/team-dialog-overview/team-dialog-overview.component';
import { YoutubeDialogComponent } from '@app/modules/visitor/components/youtube-dialog/youtube-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss'],
})
export class VisitorComponent implements OnInit {
  displayedColumns = [
    'name',
    'home',
    'round_1',
    'round_2',
    'round_3',
    'round_4',
    'round_5',
    'round_6',
    'round_7',
    'round_8',
    'final_score',
  ];

  standingsColumns = ['name', 'wins', 'losses'];
  dataSourceGame = BONSPIEL_DATA_GAME;
  dataSourceStandings = new MatTableDataSource(BONSPIEL_DATA_STANDING);

  panelOpenState = false;

  currentReq$ = null;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    public spinner: SpinnerService,
    public notifier: NotificationService
  ) {}

  ngOnInit(): void {
    const start = new Date().getTime();
    this.spinner.on();
    this.currentReq$ = this.apiService.testAPI().subscribe((res) => {
      setTimeout(() => {
        this.currentReq$ = null;
        const end = new Date().getTime();
        this.notifier.showSuccess(
          `Query took ${((end - start) / 1000).toString()} seconds.`,
          ''
        );
        console.log(res);
        this.spinner.off();
      }, 5000);
    });
  }

  @HostListener('document:keyup', ['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    const ESC_KEYCODE = 27;

    // Case: ESC character
    if (event.keyCode === ESC_KEYCODE && this.currentReq$ !== null) {
      // Cancel current HTTP request
      this.currentReq$.unsubscribe();
      this.currentReq$ = null;
      this.spinner.off();
      this.notifier.showWarning('Request Cancelled!', '');
      // this.notifier.showSuccess('', '');
      // this.notifier.showError('', '');
      // this.notifier.showInfo('', '');
      console.log('Request cancelled!');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeamDialogOverviewComponent, {
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openYoutubeDialog(team): void {
    console.log(`team  ==>  `);
    console.log(team);
    const dialogRef = this.dialog.open(YoutubeDialogComponent, {
      width: '800px',
      data: { youtube_link: team.youtube_link },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Youtube dialog was closed');
    });
  }

  getFinalScore(team) {
    return (
      Number(team.round_1) +
      Number(team.round_2) +
      Number(team.round_3) +
      Number(team.round_4) +
      Number(team.round_5) +
      Number(team.round_6) +
      Number(team.round_7) +
      Number(team.round_8)
    );
  }
}

export interface Game {
  name: string;
  home: string;
  round_1: string;
  round_2: string;
  round_3: string;
  round_4: string;
  round_5: string;
  round_6: string;
  round_7: string;
  round_8: string;
  final_score: string;
}

export interface Draw {
  name: string;
  games: Game[];
}
export interface Standing {
  name: string;
  wins: string;
  losses: string;
}

// Dummy data for Games
const BONSPIEL_DATA_GAME: Game[] = [];

for (let i = 1; i <= 2; i++) {
  BONSPIEL_DATA_GAME.push({
    name: `team_${i}`,
    home: i % 2 === 0 ? '*' : '',
    round_1: Math.floor(Math.random() * 10 + 1).toString(),
    round_2: Math.floor(Math.random() * 10 + 1).toString(),
    round_3: Math.floor(Math.random() * 10 + 1).toString(),
    round_4: Math.floor(Math.random() * 10 + 1).toString(),
    round_5: Math.floor(Math.random() * 10 + 1).toString(),
    round_6: Math.floor(Math.random() * 10 + 1).toString(),
    round_7: Math.floor(Math.random() * 10 + 1).toString(),
    round_8: Math.floor(Math.random() * 10 + 1).toString(),
    final_score: '0',
  });
}

// Dummy data for a standing
const BONSPIEL_DATA_STANDING: Standing[] = [];

for (let i = 1; i <= 6; i++) {
  BONSPIEL_DATA_STANDING.push({
    name: `team_${i}`,
    wins: Math.floor(Math.random() * 10 + 1).toString(),
    losses: Math.floor(Math.random() * 10 + 1).toString(),
  });
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
