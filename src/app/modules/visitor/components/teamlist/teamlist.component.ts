import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/http/api.service';
import { MatDialog } from '@angular/material/dialog';
//import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
//import { Address } from 'cluster';

@Component({
  selector: 'app-teamlist',
  templateUrl: './Teamlist.component.html',
  styleUrls: ['./Teamlist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TeamlistComponent {
  dataSource = teamdata;
  displayedColumns = [
    'teamid',
    'teamname',
    'teamtotgame',
    'teamwinnum',
    'teamwinrate',
  ];
  expandedData: oneteam | null;

  constructor(private apiService: ApiService, public dialog: MatDialog) {
    this.apiService.testAPI().subscribe((res) => {
      console.log(res);
    });
  }
  ngOnInit(): void { }
}

export interface onemember {
  memberimage: String;
  membername: String;
  membergender: String;
  membertotgame: Number;
  memberwingame: Number;
  memberwinrate: Number;
}


export interface oneteam {
  teamid: Number;
  teamname: String;
  teamtotgame: Number;
  teamwinnum: Number;
  teamwinrate: Number;
  member: onemember[];
}

const teamdata: oneteam[] = [];
var memberdata: onemember[] = [];
//test data
for (let i = 1; i < 6; i++) {
  memberdata = [];
  for (let n = 1; n < 5; n++) {
    memberdata.push({ memberimage: "abc", membername: `team_${i}`, membergender: 'male', membertotgame: 1, memberwingame: 5, memberwinrate: 0.5 });
  }
  teamdata.push({
    teamid: i,
    teamname: `team_${i}`,
    teamtotgame: 10,
    teamwinnum: 6,
    teamwinrate: 0.6,
    member: memberdata,
  })
}
for (let i = 6; i < 10; i++) {
  for (let n = 1; n < 3; n++) {
    memberdata = [];
    memberdata.push({ memberimage: "www.teamusa.org/-/media/TeamUSA/Headshots/2018OlympicTeam/Curling/geving_aileen_150x250.jpg?mh=250&mw=150&hash=56175E6CD1195207C985AB62E4555246EEA50C65", membername: 'member_${i}', membergender: 'male', membertotgame: 1, memberwingame: 5, memberwinrate: 0.5 });
    memberdata.push({ memberimage: "www.teamusa.org/-/media/TeamUSA/Headshots/2018OlympicTeam/Curling/geving_aileen_150x250.jpg?mh=250&mw=150&hash=56175E6CD1195207C985AB62E4555246EEA50C65", membername: 'member_${i}', membergender: 'male', membertotgame: 1, memberwingame: 5, memberwinrate: 0.5 });
  }
  teamdata.push({
    teamid: i,
    teamname: `team_${i}`,
    teamtotgame: 10,
    teamwinnum: 6,
    teamwinrate: 0.6,
    member: memberdata,
  })
}

/*
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
*/