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

  draws = ['Draw 1', 'Draw 2', 'Draw 3', 'Draw 4', 'Draw 5'];

  standingsColumns = ['name', 'wins', 'losses'];
  dataSourceDraw = BONSPIEL_DATA_DRAW;
  dataSourceStandings = new MatTableDataSource(BONSPIEL_DATA_STANDING);
  dataSourceSelect = BONSPIEL_DATA_DRAW_ARR;

  panelOpenState = false;
  currentReq$ = null;

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSourceStandings.sort = this.sort;
    const sortState: Sort = { active: 'wins', direction: 'desc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    const start = new Date().getTime();
    this.currentReq$ = this.apiService.testAPI().subscribe((res) => {});
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
  onDrawSelected(value: string) {
    console.log('the selected draw is ' + value);
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
const BONSPIEL_DATA_GAME2: Game[] = [];

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
  BONSPIEL_DATA_GAME2.push({
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

const BONSPIEL_DATA_DRAW: Draw = {
  name: 'Draw 1',
  date: new Date(),
  game_1: BONSPIEL_DATA_GAME,
  game_2: BONSPIEL_DATA_GAME,
  game_3: BONSPIEL_DATA_GAME,
  youtube_link: 'https://www.youtube.com/embed/zesl6jZnSDM',
};

const BONSPIEL_DATA_DRAW2: Draw = {
  name: 'Draw 2',
  date: new Date(),
  game_1: BONSPIEL_DATA_GAME2,
  game_2: BONSPIEL_DATA_GAME2,
  game_3: BONSPIEL_DATA_GAME2,
  youtube_link: 'https://www.youtube.com/embed/Kwz-cicOUFk',
};

const BONSPIEL_DATA_DRAW_ARR: Draw[] = [];
for (let i = 1; i <= 5; i++) {
  BONSPIEL_DATA_DRAW_ARR.push({
    name: `Draw ${i}`,
    date: new Date(),
    game_1: BONSPIEL_DATA_GAME,
    game_2: BONSPIEL_DATA_GAME,
    game_3: BONSPIEL_DATA_GAME,
    youtube_link: 'https://www.youtube.com/embed/zesl6jZnSDM',
  });
}
// Dummy data for a standing
const BONSPIEL_DATA_STANDING: Standing[] = [];

for (let i = 1; i <= 10; i++) {
  BONSPIEL_DATA_STANDING.push({
    name: `team_${i}`,
    wins: Math.floor(Math.random() * 10 + 1).toString(),
    losses: Math.floor(Math.random() * 10 + 1).toString(),
  });
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
