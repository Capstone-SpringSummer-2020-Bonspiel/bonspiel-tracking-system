import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { parseHostBindings } from '@angular/compiler';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {
  //columnsToDisplay: string[] = this.displayedColumns.slice();
  animal: string;
  name: string;
  selectedEvent = null;
  currentEvent = null;
  currentEventId = null;
  eventGameData = null;
  eventDrawData = null;
  totalGame = 0;
  totalDraw = 0;
  finalDrawData: gameData[] = [];
  finalEventData: drawData[] = [];
  sheetSize = 0;
  i = 0;
  p = 0;


  constructor(private api: ApiService, public dialog: MatDialog, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.spinner.on();
    this.api
      .currentEventId
      .subscribe((eventId) => {
        this.currentEventId = eventId;
        console.log(this.currentEventId);

        this.api
          .getEvents()
          .subscribe((res: any) => {
            console.log('[DEBUG] ngOnInit() in schedule component:');
            console.log(res);

            this.selectedEvent = res[res.length - 1];
            this.currentEvent = res;
            // console.log("This currentEvent Below:");
            // console.log(this.currentEvent);
            // console.log("This selectedEvent Below:")
            // console.log(this.selectedEvent);

            this.spinner.off();
            this.eventObtain(this.selectedEvent.id);

            // this.dataProcess();
            // console.log("FINAL DATA SET BELOW:");
            // console.log(this.finalEventData);
          });
      });


  }

  // dataSource = this.finalEventData;
  // displayedColumns: String[] = [
  //   'drawinfo',
  //   'track_a',
  //   'track_b',
  //   'track_c',
  //   'track_d'
  // ];

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
    console.log(value.value);
    console.log(value.value.id);

    this.eventObtain(value.value.id);
  }

  eventObtain(targetNum: Number) {
    console.log("Obtain Data From Database");
    this.spinner.on();
    this.api
      .getGames(targetNum)
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.eventGameData = res;
        this.totalGame = res.length;
        this.eventGameData.sort(this.eventGameData.draw_id, this.eventGameData.id);
        // console.log("ThisEventGameDataBelow:");
        // console.log(this.eventGameData);
        // test passed, data here
        this.spinner.off();
      });
    this.spinner.on();
    this.api
      .getDraws(targetNum)
      .subscribe((res: any) => {
        console.log('[DEBUG] eventObtain() in schedule component:');
        console.log(res);
        this.eventDrawData = res;
        this.totalDraw = res.length;
        this.eventDrawData.sort(this.eventDrawData.startTime);
        // console.log("ThisEventDrawDataBelow:");
        // console.log(this.eventDrawData);
        // test parseHostBindings, data here
        this.spinner.off();
        this.dataProcess();
      });
  }

  dataProcess(): void {
    // console.log("-----------------------");
    // console.log("ThisEventGameDataBelow:");
    // console.log(this.eventGameData);
    // console.log("ThisEventDrawDataBelow:");
    // console.log(this.eventDrawData);
    // console.log("-----------------------");

    this.finalEventData = [];
    this.p = 0;
    this.i = 0;

    for (this.p = 0; this.p < this.totalDraw; this.p++) {
      this.finalEventData.push({
        drawId: this.p + 1,
        eventDrawId: this.eventDrawData[this.p].id,
        drawName: this.eventDrawData[this.p].name,
        startTime: this.eventDrawData[this.p].start,
        videoUrl: this.eventDrawData[this.p].video_url,
        games: [],
      });
      // console.log(this.p + " Draw Data Has been Added. -----------+");
      // console.log(this.finalEventData[this.p]);
    }

    this.p = 0;
    this.i = 0;
    for (this.p = 0; this.p < this.totalDraw; this.p++) {
      for (this.i = 0; this.i < this.totalGame; this.i++) {
        if (this.finalEventData[this.p].eventDrawId == this.eventGameData[this.i].draw_id) {
          this.finalEventData[this.p].games.push({
            gameId: this.i + 1,
            eventGameId: this.eventGameData[this.i].id,
            name: this.eventGameData[this.i].notes,
            team1: this.eventGameData[this.i].team_name1,
            team1Id: this.eventGameData[this.i].curlingteam1_id,
            team2: this.eventGameData[this.i].team_name2,
            team2Id: this.eventGameData[this.i].curlingteam2_id,
            finished: this.eventGameData[this.i].finished,
            winnerId: this.eventGameData[this.i].null,
            winnerTo: this.eventGameData[this.i].winner,
          });
          // console.log(this.p + " Game Data Has Been Updated. ---------------++");
          // console.log(this.finalEventData[this.p]);
        }
      }
    }
    console.log("Final Dataset Below:");
    console.log(this.finalEventData);
  }

  dataSource = this.finalEventData;
  displayedColumns: String[] = [
    'drawinfo',
    'track_a',
    'track_b',
    'track_c',
    'track_d'
  ];
}

// export interface DialogData {
//   animal: string;
//   name: string;
// }


export interface gameData {
  gameId: Number; // the id of game in this event
  eventGameId: Number; //the id of game in the database
  name: String;
  team1: String;
  team1Id: Number;
  team2: String;
  team2Id: Number;
  finished: Boolean;
  winnerId: Number;
  winnerTo: Number;
}
export interface drawData {
  drawId: Number; // the id of draw in this event
  eventDrawId: Number // the id of draw in the databse
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
    GAME_DATA.push({ gameId: 4 * (i - 1) + n, eventGameId: 1, name: "testid", team1: "team1", team2: "team2", team1Id: 1, team2Id: 2, finished: true, winnerId: 1, winnerTo: 20 });
  }
  SCHEDULE_DATA1.push({ drawId: i, eventDrawId: 0, drawName: "Testgame", startTime: "Independence Day", videoUrl: "CCC", games: GAME_DATA });
}