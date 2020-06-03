import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
//import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {
  dataSource = SCHEDULE_DATA;
  displayedColumns = [
    'drawnum',
    'drawdate',
    'A',
    'B',
    'C',
    'D',
    'E',
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  animal: string;
  name: string;

  constructor(private apiService: ApiService, public dialog: MatDialog) {
    this.apiService.testAPI().subscribe((res) => {
      console.log(res);
    });
  }
  ngOnInit(): void { }
  openDialog(): void {
    const dialogRef = this.dialog.open(TeamDialogOverviewComponent, {
      width: 'auto',
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}

export interface DialogData {
  animal: string;
  name: string;
}


export interface drawData {
  drawnum: Number;
  drawdate: String;
  limit: Number;
  A: [any, any, any, any];
  B: [any, any, any, any];
  C: [any, any, any, any];
  D: [any, any, any, any];
  E: [any, any, any, any];
}

const SCHEDULE_DATA: drawData[] = [
  { drawnum: 1, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 2, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 3, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 4, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 5, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 6, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 7, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 8, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 9, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 10, drawdate: '2020-01-10', limit: 5, A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
];
/*
export interface finalData {
  drawnum: Number;
  drawdate: String;
  detail: String[];
}

const FINAL_DATA: finalData[] = []
for (let i = 0; i < SCHEDULE_DATA.length; i++) {
  FINAL_DATA[i].drawnum = SCHEDULE_DATA[i].drawnum;
  FINAL_DATA[i].drawdate = SCHEDULE_DATA[i].drawdate;
  for (let n = 0; i < SCHEDULE_DATA[i].limit; i++) {
    FINAL_DATA[i].detail[n] = "Team: " + SCHEDULE_DATA[i].A[0] + '\n' + "Team: " + SCHEDULE_DATA[i].A[3] + '\n' + "Winner to " + SCHEDULE_DATA[i].A[1] + '\n' + "Losser to " + SCHEDULE_DATA[i].A[3];
  }


}
*/
/*
export interface GameInfo {
  GameNumber: Number;
  Team_1: String;
  Team_2: String;
  WinTo: Number;
  LossTo: Number;
}

export interface DrawInfo {
  DrawNumber: number;
  DrawDate: string;
  GamesData: GameInfo[];
}

export interface ScheduleInfo {
  FieldSize: 5;
  MatchName: String;
  DrawsData: DrawInfo[];
}

const SCHEDULE_DATA: ScheduleInfo = {
  FieldSize: 5,
  MatchName: "Test_Championships",
  DrawsData: [],
};
var GAME_DATA: GameInfo[] = [];

for (let i = 1; i < 11; i++) {
  GAME_DATA = [];
  for (let n = 1; n < 5; n++) {
    GAME_DATA.push({
      GameNumber: i * 5 + n,
      Team_1: "Team_1",
      Team_2: "Team_2",
      WinTo: n + 5,
      LossTo: n + 4,
    })
  }
  SCHEDULE_DATA.DrawsData.push({
    DrawNumber: i,
    DrawDate: "Anytime",
    GamesData: GAME_DATA,
  })
}
*/
/*
export class TableDynamicColumnsExample {
  displayedColumns: string[] = ['drawnum', 'drawdate', 'A', 'B', 'C', 'D', 'E'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data: PeriodicElement[] = ELEMENT_DATA;
}
*/


///////----------------------------------------------------------------------------

/*
export interface draw {
  drawnum: Number;
  drawtime: Date;
  gamenumber: Number;
  game1: [number, string, string, number, number];
  game2: [number, string, string, number, number];
  game3: [number, string, string, number, number];
  game4: [number, string, string, number, number];
  game5: [number, string, string, number, number];
}
const SCHEDULE_DATA: draw[] = [];

// test data
for (let i = 1; i < 10; i++) {
  SCHEDULE_DATA.push({
    drawnum: i,
    drawtime: null,
    gamenumber: 5,
    game1: [11, 'teamA', 'teamB', 13, 15],
    game2: [(i - 1) * 5 + 2, 'team_${i}', 'team_${i}', (i - 1) * 1 + 2, (i - 1) * 1 + 3],
    game3: [(i - 1) * 5 + 3, 'team_${i}', 'team_${i}', (i - 1) * 1 + 3, (i - 1) * 1 + 4],
    game4: [(i - 1) * 5 + 4, 'team_${i}', 'team_${i}', (i - 1) * 1 + 4, (i - 1) * 1 + 5],
    game5: [(i - 1) * 5 + 5, 'team_${i}', 'team_${i}', (i - 1) * 1 + 5, (i - 1) * 1 + 0]
  })
}
*/