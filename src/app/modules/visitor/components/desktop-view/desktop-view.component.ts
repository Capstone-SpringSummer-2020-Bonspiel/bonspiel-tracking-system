import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogOverviewComponent } from '@app/modules/visitor/components/team-dialog-overview/team-dialog-overview.component';
import { YoutubeDialogComponent } from '@app/modules/visitor/components/youtube-dialog/youtube-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-desktop-view',
  templateUrl: './desktop-view.component.html',
  styleUrls: ['./desktop-view.component.scss'],
})
export class DesktopViewComponent implements OnInit {
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
  dataSourceDrawGames = BONSPIEL_DATA_DRAW_GAMES;
  dataSourceAllStandings = BONSPIEL_DATA_ALL_STANDING;

  panelOpenState = false;
  currentReq$ = null;

  selectedDraw = null;
  currentDraws = null;

  constructor(private api: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    //this.dataSourceStandings.sort = this.sort;
    // const sortState: Sort = { active: 'wins', direction: 'desc' };
    // this.sort.active = sortState.active;
    // this.sort.direction = sortState.direction;
    // this.sort.sortChange.emit(sortState);

    this.api
      .adHocQuery('SELECT * FROM public.draw ORDER BY id ASC')
      .subscribe((res: any) => {
        console.log(res);

        this.selectedDraw = res.rows[res.rows.length - 1];
        this.currentDraws = res.rows;
      });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
      data: { youtube_link: team.video_url },
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

  convertToAlpha(num) {
    return String.fromCharCode(num + 65);
  }
  onDrawSelected(value: string) {
    console.log('the selected draw is ' + value);
    this.selectedDraw = value;
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
  date: Date;
  game_1: Game[];
  game_2: Game[];
  game_3: Game[];
  youtube_link: string;
}
export interface Standing {
  name: string;
  wins: string;
  losses: string;
}

// Begin dummy data
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

var BONSPIEL_DATA_DRAW_GAMES: Game[][] = [];
for (let i = 0; i < 3; i++) {
  BONSPIEL_DATA_DRAW_GAMES.push([]);
  for (let j = 0; j <= 1; j++) {
    BONSPIEL_DATA_DRAW_GAMES[i].push({
      name: `Team ${String.fromCharCode(i * 2 + j * 1 + 65)}`,
      home: j % 2 === 0 ? '*' : '',
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
}

// Dummy data for a standing
const BONSPIEL_DATA_STANDING: Standing[] = [];
const BONSPIEL_DATA_STANDING2: Standing[] = [];

for (let i = 1; i <= 6; i++) {
  BONSPIEL_DATA_STANDING.push({
    name: `team_${i}`,
    wins: Math.floor(Math.random() * 10 + 1).toString(),
    losses: Math.floor(Math.random() * 10 + 1).toString(),
  });
}
for (let i = 1; i <= 6; i++) {
  BONSPIEL_DATA_STANDING2.push({
    name: `team_${i}`,
    wins: Math.floor(Math.random() * 10 + 1).toString(),
    losses: Math.floor(Math.random() * 10 + 1).toString(),
  });
}

var BONSPIEL_DATA_ALL_STANDING: Standing[][] = [
  BONSPIEL_DATA_STANDING,
  BONSPIEL_DATA_STANDING2,
  BONSPIEL_DATA_STANDING,
  BONSPIEL_DATA_STANDING2,
];
