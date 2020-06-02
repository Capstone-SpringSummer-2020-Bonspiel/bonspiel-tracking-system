import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/http/api.service';
import { MatDialog } from '@angular/material/dialog';
//import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
//import { Address } from 'cluster';

@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: ['./teamlist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})



export class TeamlistComponent {
  dataSource = TEAM_DATA;
  displayedColumns = [
    'teamId',
    'teamName',
    'teamTotalGame',
    'teamWinGame',
    'teamWinRate',
    'teamMemberNumber',
  ];
  expandedElement: Team | null;

  constructor(private apiService: ApiService, public dialog: MatDialog) {
    this.apiService.testAPI().subscribe((res) => {
      console.log(res);
    });
  }
  ngOnInit(): void { }
}

export interface Member {
  memberImage: String;
  memberName: String;
  memberGender: String;
  memberTotalGame: Number;
  memberWinGame: Number;
  memberWinRate: Number;
}

export interface Team {
  teamId: Number;
  teamName: String;
  teamTotalGame: Number;
  teamWinGame: Number;
  teamWinRate: Number;
  member: Member[];
  teamMemberNumber;
}

const TEAM_DATA: Team[] = [];
var memberData: Member[] = [];

//test data
for (let i = 1; i < 6; i++) {
  memberData = [];
  for (let n = 1; n < 5; n++) {
    memberData.push({ memberImage: "abc", memberName: `member_${i}`, memberGender: 'male', memberTotalGame: 1, memberWinGame: 5, memberWinRate: 0.5 });
  }
  TEAM_DATA.push({
    teamId: i,
    teamName: `team_${i}`,
    teamTotalGame: 10,
    teamWinGame: 6,
    teamWinRate: 0.6,
    member: memberData,
    teamMemberNumber: 4,
  })
}
for (let i = 6; i < 15; i++) {
  for (let n = 1; n < 3; n++) {
    memberData = [];
    memberData.push({ memberImage: "123123", memberName: `member_${i}`, memberGender: 'male', memberTotalGame: 1, memberWinGame: 5, memberWinRate: 0.5 });
    memberData.push({ memberImage: "123123", memberName: `member_${i}`, memberGender: 'male', memberTotalGame: 1, memberWinGame: 5, memberWinRate: 0.5 });
  }
  TEAM_DATA.push({
    teamId: i,
    teamName: `team_${i}`,
    teamTotalGame: 10,
    teamWinGame: 6,
    teamWinRate: 0.6,
    member: memberData,
    teamMemberNumber: 2,
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