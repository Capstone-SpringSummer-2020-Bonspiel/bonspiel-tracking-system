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
  animal: string;
  name: string;
  // selectedEvent = null;
  // currentEvent = null;
  // currentEventId = null;
  eventGameData = null;
  eventDrawData = null;
  totalGame = 0;
  totalDraw = 0;
  // finalDrawData: gameData[] = [];
  finalEventData: drawData[] = [];
  // sheetSize = 0;
  selectedEventId = null;
  drawSizeNumber = null;
  displayedColumns: String[]
  allEventData: null;
  selectedEvent: drawData;


  constructor(private api: ApiService, public dialog: MatDialog, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.spinner.on()

    this.api
      .getEvents()
      .subscribe((res: any) => {
        this.allEventData = res;
        this.selectedEvent = res[0];
        this.selectedEventId = res[0].id;
        console.log(this.selectedEventId);

        this.eventBegin();
        this.spinner.off()
      })

    // console.log("Test Part1");
    // console.log("Test Part2");
    // console.log("Test Part3");
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

  onEventSelected(event: any) {
    console.log(this.allEventData);
    console.log('the selected event is:');
    console.log(this.selectedEvent);
    this.selectedEventId = this.selectedEvent.id;
    // this.selectedEvent = event.value;
    this.eventBegin();
  }

  eventBegin() {
    this.spinner.on();

    this.api
      .getDraws(this.selectedEventId)
      .subscribe((res: any) => {
        // console.log('[DEBUG] eventObtain() in schedule component:');
        // console.log(res);
        this.eventDrawData = res;
        this.totalDraw = res.length;
        // this.eventDrawData.sort(this.eventDrawData.eventDrawId);
        // console.log("ThisEventDrawDataBelow:");
        // console.log(this.eventDrawData);
        // test parseHostBindings, data here

        this.api
          .getGames(this.selectedEventId)
          .subscribe((res: any) => {
            // console.log('[DEBUG] eventObtain() in schedule component:');
            // console.log(res);
            this.eventGameData = res;
            this.totalGame = res.length;
            // this.eventGameData.sort(this.eventGameData.eventDrawId);
            // console.log("ThisEventGameDataBelow:");
            // console.log(this.eventGameData);
            // test passed, data here

            this.dataProcess();
            this.spinner.off();
          })
      });

  }


  // eventObtain(targetNum: Number) {
  //   // return new Promise((resolve, reject) => {
  //   console.log("Obtain Data From Database");

  //   this.spinner.on();
  //   this.api
  //     .getDraws(targetNum)
  //     .subscribe((res: any) => {
  //       console.log('[DEBUG] eventObtain() in schedule component:');
  //       console.log(res);
  //       this.eventDrawData = res;
  //       this.totalDraw = res.length;
  //       this.eventDrawData.sort(this.eventDrawData.startTime);
  //       // console.log("ThisEventDrawDataBelow:");
  //       // console.log(this.eventDrawData);
  //       // test parseHostBindings, data here
  //     });
  //   this.api
  //     .getGames(targetNum)
  //     .subscribe((res: any) => {
  //       console.log('[DEBUG] eventObtain() in schedule component:');
  //       console.log(res);
  //       this.eventGameData = res;
  //       this.totalGame = res.length;
  //       // this.eventGameData.sort(this.eventGameData.videoUrl, this.eventGameData.id);
  //       console.log("ThisEventGameDataBelow:");
  //       console.log(this.eventGameData);
  //       // test passed, data here
  //       this.spinner.off();
  //       this.dataProcess();
  //     })
  // }

  //Data Process function, which classify the data from database
  dataProcess(): void {
    this.finalEventData = [];
    var s = 0;

    //initialize number array to count size of each draw
    for (let i = 0; i < this.totalGame; i++) {
      if (this.eventGameData[i].ice_sheet == 'A' || this.eventGameData[i].ice_sheet == 1) {
        s = 1
      } else if (this.eventGameData[i].ice_sheet == 'B' || this.eventGameData[i].ice_sheet == 2) {
        s = 2
      } else if (this.eventGameData[i].ice_sheet == 'C' || this.eventGameData[i].ice_sheet == 3) {
        s = 3
      } else if (this.eventGameData[i].ice_sheet == 'D' || this.eventGameData[i].ice_sheet == 4) {
        s = 4
      } else if (this.eventGameData[i].ice_sheet == 'E' || this.eventGameData[i].ice_sheet == 5) {
        s = 5
      } else if (this.eventGameData[i].ice_sheet == 'F' || this.eventGameData[i].ice_sheet == 6) {
        s = 6
      }
      if (this.drawSizeNumber < s) {
        this.drawSizeNumber = s;
      }
    }


    // //count the size of each draw, and update maxium number
    // for (let p = 0; p < this.totalDraw; p++) {
    //   drawSizeCount[p] = 0;
    //   for (let i = 0; i < this.totalGame; i++) {
    //     if (this.eventDrawData[p].id == this.eventGameData[i].draw_id) {
    //       drawSizeCount[p] += 1;
    //     }
    //     if (drawSizeCount[p] > this.drawSizeNumber) {
    //       this.drawSizeNumber = drawSizeCount[p]
    //     }
    //   }
    // }

    // console.log("this.drawSizeCount Data BELOW");
    // console.log(this.drawSizeNumber);


    for (let p = 0; p < this.totalDraw; p++) {
      this.finalEventData.push({
        id: p + 1,
        eventDrawId: this.eventDrawData[p].id,
        drawName: this.eventDrawData[p].name,
        startTime: this.eventDrawData[p].start,
        videoUrl: this.eventDrawData[p].video_url,
        games: []
      });
      for (let z = 0; z < this.drawSizeNumber; z++) {
        this.finalEventData[p].games.push({
          gameId: 0,
          eventGameId: 0,
          name: null,
          team1: null,
          team1Id: 0,
          team2: null,
          team2Id: 0,
          finished: null,
          winnerId: 0,
          winnerTo: 0
        })
      }
      // console.log(this.p + " Draw Data Has been Added. -----------+");
      // console.log(this.finalEventData[this.p]);
    }
    console.log("Empty Data Here");
    console.log(this.finalEventData);
    console.log(this.eventGameData);


    for (let p = 0; p < this.totalDraw; p++) {
      for (let i = 0; i < this.totalGame; i++) {
        if (this.finalEventData[p].eventDrawId == this.eventGameData[i].draw_id) {
          // console.log("this.finalEventData[p].eventDrawId" + this.finalEventData[p].eventDrawId);
          // console.log("this.eventGameData[i].draw_id" + this.eventGameData[i].draw_id);

          // console.log("this.finalEventData[p].games[s]" + this.finalEventData[p].games[s]);
          // console.log('P' + p);
          // console.log('S' + s);
          // console.log('I' + i);
          if (this.eventGameData[i].ice_sheet == 'A' || this.eventGameData[i].ice_sheet == 1) {
            s = 0
          } else if (this.eventGameData[i].ice_sheet == 'B' || this.eventGameData[i].ice_sheet == 2) {
            s = 1
          } else if (this.eventGameData[i].ice_sheet == 'C' || this.eventGameData[i].ice_sheet == 3) {
            s = 2
          } else if (this.eventGameData[i].ice_sheet == 'D' || this.eventGameData[i].ice_sheet == 4) {
            s = 3
          } else if (this.eventGameData[i].ice_sheet == 'E' || this.eventGameData[i].ice_sheet == 5) {
            s = 4
          } else if (this.eventGameData[i].ice_sheet == 'F' || this.eventGameData[i].ice_sheet == 6) {
            s = 5
          }

          this.finalEventData[p].games[s].gameId = i + 1;
          this.finalEventData[p].games[s].eventGameId = this.eventGameData[i].id;
          this.finalEventData[p].games[s].name = this.eventGameData[i].notes;
          this.finalEventData[p].games[s].team1 = this.eventGameData[i].team_name1;
          this.finalEventData[p].games[s].team1Id = this.eventGameData[i].curlingteam1_id;
          this.finalEventData[p].games[s].team2 = this.eventGameData[i].team_name2;
          this.finalEventData[p].games[s].team2Id = this.eventGameData[i].curlingteam2_id;
          this.finalEventData[p].games[s].finished = this.eventGameData[i].finished;
          this.finalEventData[p].games[s].winnerId = this.eventGameData[i].null;
          this.finalEventData[p].games[s].winnerTo = this.eventGameData[i].winner;
          // console.log(this.finalEventData[p]);


          this.displayedColumns = []
          this.displayedColumns.push('drawinfo')
          for (let p = 0; p < this.drawSizeNumber; p++) {
            this.displayedColumns.push('track_' + String.fromCharCode(97 + p))
          }
          // {
          //   gameId: i + 1,
          //   eventGameId: this.eventGameData[i].id,
          //   name: this.eventGameData[i].notes,
          //   team1: this.eventGameData[i].team_name1,
          //   team1Id: this.eventGameData[i].curlingteam1_id,
          //   team2: this.eventGameData[i].team_name2,
          //   team2Id: this.eventGameData[i].curlingteam2_id,
          //   finished: this.eventGameData[i].finished,
          //   winnerId: this.eventGameData[i].null,
          //   winnerTo: this.eventGameData[i].winner,
          // };
          // console.log(this.p + " Game Data Has Been Updated. ---------------++");
          // console.log(this.finalEventData[this.p]);
        }
      }
    }
    console.log("Final Dataset Below:");
    console.log(this.finalEventData);
  }

  //Control pannel of select event, will call to reload data
  // eventSelected(value: any) {
  //   console.log('the selected event is:');
  //   console.log(value.value);
  //   console.log(value.value.id);

  //   this.eventBegin();
  // }

  //dataSource = this.finalEventData;
  // displayedColumns: String[] = [
  //   'drawinfo',
  //   'track_a',
  //   'track_b',
  //   'track_c',
  //   'track_d',
  //   'track_e',
  //   'track_f'
  // ];
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
  id: Number; // the id of draw in this event
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
  SCHEDULE_DATA1.push({ id: i, eventDrawId: 0, drawName: "Testgame", startTime: "Independence Day", videoUrl: "CCC", games: GAME_DATA });
}