import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {
  dataSource = SCHEDULE_DATA1;

  displayedColumns: String[] = [
    'drawinfo',
    'track_a',
    'track_b',
    'track_c',
    'track_d'
  ];
  //columnsToDisplay: string[] = this.displayedColumns.slice();
  animal: string;
  name: string;
  selectedEvent = null;
  currentEvent = null;
  currentEventId = null;


  constructor(private api: ApiService, public dialog: MatDialog, private spinner: SpinnerService) { }

  ngOnInit(): void {
    console.log("ABCDEFG");
    console.log(SCHEDULE_DATA1);
    this.api
      .currentEventId
      .subscribe((eventId) => {
        this.currentEventId = eventId;

        this.api
          .getEvents()
          .subscribe((res: any) => {
            console.log('[DEBUG] ngOnInit() in schedule component:');
            console.log(res);

            this.selectedEvent = res[res.length - 1];
            this.currentEvent = res;

            this.spinner.off();
          });
      });
  }

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

  eventSelected(value: any) {
    console.log('the selected event is:');
    console.log(value.value)

    this.selectedEvent = value.value;
  }
}

// export interface DialogData {
//   animal: string;
//   name: string;
// }


export interface gameData {
  gameId: Number;
  name: String;
  team1: String;
  team1Id: Number;
  team2: String;
  team2Id: Number;
  finished: Boolean;
  winnerTo: Number;
}
export interface drawData {
  drawId: Number;
  drawName: String;
  startTime: String;
  videoUrl: String;
  games: gameData[];
}

const SCHEDULE_DATA1: drawData[] = []
var GAME_DATA: gameData[] = []
for (let i = 1; i < 10; i++) {
  GAME_DATA = [];
  for (let n = 1; n < 5; n++) {
    GAME_DATA.push({ gameId: 4 * (i - 1) + n, name: "testid", team1: "team1", team2: "team2", team1Id: 1, team2Id: 2, finished: true, winnerTo: 20 });
  }
  SCHEDULE_DATA1.push({ drawId: i, drawName: "Testgame", startTime: "Independence Day", videoUrl: "CCC", games: GAME_DATA });
}