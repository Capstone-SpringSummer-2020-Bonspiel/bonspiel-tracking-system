import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
// import { TeamDialogOverviewComponent } from '../../components/team-dialog-overview/team-dialog-overview.component';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { parseHostBindings } from '@angular/compiler';
import { KeyboardNavigationFocusBorderOptionsObject } from 'highcharts';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {
  // animal: string;
  // name: string;

  eventGameData = null;
  eventDrawData = null;
  totalGame = 0;
  totalDraw = 0;
  finalEventData: drawData[] = [];
  finalData: any[] = [];

  drawSizeNumber = null;
  displayedColumns: String[]
  extraColumns: String[];
  allEventData: null;
  selectedEvent: null;
  selectedEventId = null;

  tableSize: Number;
  tableColumn: any[] = [];


  constructor(private apiService: ApiService, public dialog: MatDialog, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.on()

    //first API, read all event data
    this.apiService
      .getEvents()
      .subscribe((res: any) => {
        this.allEventData = res;
        this.selectedEvent = res[0];
        this.selectedEventId = res[0].id;
        console.log(this.selectedEventId);
        console.log(this.selectedEvent);

        //second API, read all draw data
        this.apiService
          .getDraws(this.selectedEventId)
          .subscribe((res: any) => {
            this.eventDrawData = res;
            this.totalDraw = res.length;

            //third API, read all game data
            this.apiService
              .getGames(this.selectedEventId)
              .subscribe((res: any) => {
                this.eventGameData = res;
                this.totalGame = res.length;

                this.dataProcess();
                this.spinnerService.off();
              })
          });
      })
  }

  //select event function
  onEventSelected(event: any) {
    console.log('the selected event is:');
    console.log(event);

    this.selectedEvent = event.value;
    this.selectedEventId = event.value.id;

    console.log('the selected event is:');
    console.log(this.selectedEvent);

    this.eventBegin();
  }

  //select the new event and running the follow
  eventBegin() {
    this.spinnerService.on();

    this.apiService
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

        this.apiService
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
            this.spinnerService.off();
          })
      });

  }

  //Data Process function, which classify the data from database
  dataProcess(): void {
    this.finalEventData = [];
    var s = 0;

    //initialize number array to count size of each draw
    this.tableColumn = []
    this.tableSize = 0;
    for (let i = 0; i < this.totalGame; i++) {
      if (this.eventGameData[i].ice_sheet.charCodeAt(0) >= 48 && this.eventGameData[i].ice_sheet.charCodeAt(0) <= 57) {
        this.tableColumn.push(this.eventGameData[i].ice_sheet.charCodeAt(0) - 48)
        this.eventGameData[i].ice_sheet = this.eventGameData[i].ice_sheet.charCodeAt(0) - 48
      }
      else if (this.eventGameData[i].ice_sheet.charCodeAt(0) >= 65 && this.eventGameData[i].ice_sheet.charCodeAt(0) <= 90) {
        this.tableColumn.push(this.eventGameData[i].ice_sheet.charCodeAt(0) - 64)
        this.eventGameData[i].ice_sheet = this.eventGameData[i].ice_sheet.charCodeAt(0) - 64
      }
      else if (this.eventGameData[i].ice_sheet.charCodeAt(0) >= 97 && this.eventGameData[i].ice_sheet.charCodeAt(0) <= 122) {
        this.tableColumn.push(this.eventGameData[i].ice_sheet.charCodeAt(0) - 96)
        this.eventGameData[i].ice_sheet = this.eventGameData[i].ice_sheet.charCodeAt(0) - 96
      }
    }
    this.tableColumn = this.tableColumn.sort()
    // console.log(this.tableColumn)

    let n = 0;
    for (let i = 0; i < this.tableColumn.length; i++) {
      if (this.tableColumn[i] !== this.tableColumn[n]) {
        n++;
        this.tableColumn[n] = this.tableColumn[i]
      }
    }
    this.tableColumn.splice(n + 1)
    this.tableSize = this.tableColumn.length;
    this.drawSizeNumber = this.tableSize;
    this.tableColumn.push(0);
    this.tableColumn.sort();

    //process data to create the final dataset
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
          winnerTo: 0,
          loserTo: 0,
          winnerTG: null,
          loserTG: null,
        })
      }
      // console.log(this.p + " Draw Data Has been Added. -----------+");
      // console.log(this.finalEventData[this.p]);
    }

    //assign data from backend to new format
    for (let p = 0; p < this.totalDraw; p++) {
      for (let i = 0; i < this.totalGame; i++) {
        if (this.finalEventData[p].eventDrawId == this.eventGameData[i].draw_id) {
          // console.log("this.finalEventData[p].eventDrawId" + this.finalEventData[p].eventDrawId);
          // console.log("this.eventGameData[i].draw_id" + this.eventGameData[i].draw_id);

          // console.log("this.finalEventData[p].games[s]" + this.finalEventData[p].games[s]);
          // console.log('P' + p);
          // console.log('S' + s);
          // console.log('I' + i);
          if (this.eventGameData[i].ice_sheet == 1) {
            s = 0
          } else if (this.eventGameData[i].ice_sheet == 2) {
            s = 1
          } else if (this.eventGameData[i].ice_sheet == 3) {
            s = 2
          } else if (this.eventGameData[i].ice_sheet == 4) {
            s = 3
          } else if (this.eventGameData[i].ice_sheet == 5) {
            s = 4
          } else if (this.eventGameData[i].ice_sheet == 6) {
            s = 5
          }

          this.finalEventData[p].games[s].gameId = i + 1;
          this.finalEventData[p].games[s].eventGameId = this.eventGameData[i].game_id;
          this.finalEventData[p].games[s].name = this.eventGameData[i].game_name;
          this.finalEventData[p].games[s].team1 = this.eventGameData[i].team_name1;
          this.finalEventData[p].games[s].team1Id = this.eventGameData[i].curlingteam1_id;
          this.finalEventData[p].games[s].team2 = this.eventGameData[i].team_name2;
          this.finalEventData[p].games[s].team2Id = this.eventGameData[i].curlingteam2_id;
          this.finalEventData[p].games[s].finished = this.eventGameData[i].finished;
          this.finalEventData[p].games[s].winnerId = this.eventGameData[i].winner;
          this.finalEventData[p].games[s].winnerTo = this.eventGameData[i].winner_dest;
          this.finalEventData[p].games[s].loserTo = this.eventGameData[i].loser_dest;
          // console.log(this.finalEventData[p]);

        }
      }
    }

    for (let p = 0; p < this.totalDraw; p++) {
      for (let i = 0; i < this.drawSizeNumber; i++) {
        if (this.finalEventData[p].games[i].team1 != null) {
          // console.log(this.finalEventData[p].games[i])
          for (let a = 0; a < this.totalGame; a++) {
            if (this.eventGameData[a].game_id == this.finalEventData[p].games[i].winnerTo) {
              this.finalEventData[p].games[i].winnerTG = this.eventGameData[a].game_name
            }
            if (this.eventGameData[a].game_id == this.finalEventData[p].games[i].loserTo) {
              this.finalEventData[p].games[i].loserTG = this.eventGameData[a].game_name
            }
          }
        }
      }
    }
    console.log("Final Dataset Below:");
    console.log(this.finalEventData);
    console.log("draw size:" + this.drawSizeNumber);

    this.displayedColumns = []
    this.extraColumns = []
    this.displayedColumns.push('Draw')
    for (let p = 1; p < this.drawSizeNumber + 1; p++) {
      this.displayedColumns.push('track_' + String.fromCharCode(96 + p))
      this.extraColumns.push(String.fromCharCode(96 + p))
    } console.log(this.displayedColumns)
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
  loserTo: Number;
  winnerTG: String;
  loserTG: String;
}
export interface drawData {
  id: Number; // the id of draw in this event
  eventDrawId: Number // the id of draw in the databse
  drawName: String;
  startTime: String;
  videoUrl: String;
  games: gameData[];
}

// test data below
// const SCHEDULE_DATA1: drawData[] = []
// var GAME_DATA: gameData[] = []
// for (let i = 1; i < 10; i++) {
//   GAME_DATA = [];
//   for (let n = 1; n < 5; n++) {
//     GAME_DATA.push({ gameId: 4 * (i - 1) + n, eventGameId: 1, name: "testid", team1: "team1", team2: "team2", team1Id: 1, team2Id: 2, finished: true, winnerId: 1, winnerTo: 20, loserTo: 20, winnerTG: "String", loserTG: "String" });
//   }
//   SCHEDULE_DATA1.push({ id: i, eventDrawId: 0, drawName: "Testgame", startTime: "Independence Day", videoUrl: "CCC", games: GAME_DATA });
// }