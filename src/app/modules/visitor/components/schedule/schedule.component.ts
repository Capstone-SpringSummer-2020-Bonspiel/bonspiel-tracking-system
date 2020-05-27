/*
export interface PeriodicElement {
  drawnum: number;
  drawdate: string;
  A: any[];
  B: any[];
  C: any[];
  D: any[];
  E: any[];
}

const ELEMENT_DATA: PeriodicElement[] = [
  { drawnum: 1, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 2, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 3, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 4, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 5, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 6, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 7, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 8, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 9, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
  { drawnum: 10, drawdate: '2020-01-10', A: ["A", 1, 1, 'D'], B: ["A", 1, 1, 'D'], C: ["A", 1, 1, 'D'], D: ["A", 1, 1, 'D'], E: ["A", 1, 1, 'D'] },
];


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class TableDynamicColumnsExample {
  displayedColumns: string[] = ['drawnum', 'drawdate', 'A', 'B', 'C', 'D', 'E'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data: PeriodicElement[] = ELEMENT_DATA;
}
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/http/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
//import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {
  displayedColumns = [
    'draw',
    'track_a',
    'track_b',
    'track_c',
    'track_d',
    'track_e',
  ];
  dataSource = SCHEDULE_DATA;
  panelOpenState = false;

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

export interface draw {
  drawnum: Number;
  drawtime: Date;
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
    game1: [11, 'teamA', 'teamB', 13, 15],
    game2: [(i - 1) * 5 + 2, 'team_${i}', 'team_${i}', (i - 1) * 1 + 2, (i - 1) * 1 + 3],
    game3: [(i - 1) * 5 + 3, 'team_${i}', 'team_${i}', (i - 1) * 1 + 3, (i - 1) * 1 + 4],
    game4: [(i - 1) * 5 + 4, 'team_${i}', 'team_${i}', (i - 1) * 1 + 4, (i - 1) * 1 + 5],
    game5: [(i - 1) * 5 + 5, 'team_${i}', 'team_${i}', (i - 1) * 1 + 5, (i - 1) * 1 + 0]
  })
}
