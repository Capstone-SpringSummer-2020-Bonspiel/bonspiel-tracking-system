import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
//import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SpinnerService } from '@app/shared/services/spinner.service';
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
    'teamNote',
  ];
  expandedElement: Team | null;
  curlingteam = null;
  currentEventId = null;
  selectedEvent = null;
  currentEvent = null;

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.spinner.on();
    const query1 = "SELECT * FROM public.curlingteam ORDER BY id ASC";

    this.api.adHocQuery(query1).subscribe((res: any) => {
      console.log(res);
      console.log(res.rows);
      this.curlingteam = res.rows;
      this.spinner.off();
    })
    this.api
      .currentEventId
      .subscribe((eventId) => {
        this.currentEventId = eventId;

        this.api
          .getTeams(this.currentEventId)
          .subscribe((res: any) => {
            console.log('[DEBUG] ngOnInit() in schedule component:');
            console.log(res);

            this.selectedEvent = res[res.length - 1];
            this.currentEvent = res;

            this.spinner.off();
          });
      });
  }
}

export interface Member {
  memberImage: String;
  memberName: String;
  memberGender: String;
  memberPosition: String;
}

export interface Team {
  teamId: Number;
  teamName: String;
  teamNote: String;
  member: Member[];
}

const TEAM_DATA: Team[] = [];
var memberData: Member[] = [];

//test data
for (let i = 1; i < 6; i++) {
  memberData = [];
  for (let n = 1; n < 5; n++) {
    memberData.push({ memberImage: "abc", memberName: `member_${i}`, memberGender: 'male', memberPosition: "A" });
  }
  TEAM_DATA.push({
    teamId: i,
    teamName: `team_${i}`,
    teamNote: "Nothing Special",
    member: memberData,
  })
}
for (let i = 6; i < 15; i++) {
  for (let n = 1; n < 3; n++) {
    memberData = [];
    memberData.push({ memberImage: "123123", memberName: `member_${i}`, memberGender: 'male', memberPosition: "A" });
    memberData.push({ memberImage: "123123", memberName: `member_${i}`, memberGender: 'male', memberPosition: "A" });
  }
  TEAM_DATA.push({
    teamId: i,
    teamName: `team_${i}`,
    teamNote: "Nothing Special",
    member: memberData,
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