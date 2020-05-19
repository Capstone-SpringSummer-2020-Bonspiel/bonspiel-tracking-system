import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/http/api.service';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private apiService: ApiService, public dialog: MatDialog) {
    this.apiService.testAPI().subscribe((res) => {
      console.log(res);
    });
  }

  ngOnInit(): void { }
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
    game2: [(i - 1) * 5 + 2, 'teamC', 'teamD', (i - 1) * 1 + 2, (i - 1) * 1 + 3],
    game3: [(i - 1) * 5 + 3, 'teamE', 'teamF', (i - 1) * 1 + 3, (i - 1) * 1 + 4],
    game4: [(i - 1) * 5 + 4, 'teamG', 'teamH', (i - 1) * 1 + 4, (i - 1) * 1 + 5],
    game5: [(i - 1) * 5 + 5, 'teamI', 'teamJ', (i - 1) * 1 + 5, (i - 1) * 1 + 0]
  })
}