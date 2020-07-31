import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { YoutubeDialogComponent } from '@app/modules/visitor/components/youtube-dialog/youtube-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatSort, Sort } from '@angular/material/sort';
import { take, first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-desktop-view',
  templateUrl: './desktop-view.component.html',
  styleUrls: ['./desktop-view.component.scss'],
})
export class DesktopViewComponent implements OnInit {
  standingsColumns = ['name', 'wins', 'losses', 'ties'];
  dataSourceStandings = [];

  panelOpenState = false;
  currentReq$ = null;

  allDraws = [];
  allGames = [];
  allScores = [];
  selectedDraw = null;
  poolBracketList = [];
  currentGames = [];
  currentEventId = null;
  currentEvent = null;
  selectedPoolBracket = 'All Teams';

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.spinnerService.on();

    // Get current event
    this.apiService.currentEvent$.subscribe((currentEvent) => {
      if (currentEvent === null) {
        return;
      }

      this.currentEvent = currentEvent;
      // console.log(1);
      // console.log('currentEvent', this.currentEvent);
    });

    // Get current event ID
    this.apiService.currentEventId$.subscribe((eventId) => {
      if (eventId === null) {
        return;
      }

      this.currentEventId = eventId;
      // console.log(2);
      // console.log('currentEventId', this.currentEventId);

      // Get draws, games and scores
      forkJoin(
        this.apiService.getDraws(this.currentEventId),
        this.apiService.getGames(this.currentEventId),
        this.apiService.getScoresByEvent(this.currentEventId)
      ).subscribe((vals: any) => {
        // console.log('all values', vals);

        this.allDraws = vals[0];
        this.allGames = vals[1];
        this.allScores = vals[2];

        this.selectedDraw = this.allDraws[this.allDraws.length - 1];
        // this.notificationService.showInfo(this.selectedDraw.video_url, '');  // DEBUGGING

        this.loadGames().then((res) => {
          this.spinnerService.off();
        });

        this.loadTeamStandings();
      });
    });
  }

  loadGames() {
    return new Promise((resolve, reject) => {
      // console.log('---------------------------------------------------------------');
      this.currentGames = this.allGames.filter((x) => x.draw_id === this.selectedDraw.id);
      // console.log('currentGames', this.currentGames);

      for (let game of this.currentGames) {
        const filteredScores = this.allScores.filter((e) => e.game_id === game.game_id);
        const sortedScores = filteredScores.sort((a, b) => a.end_number - b.end_number);

        // console.log('filteredScores', filteredScores);
        // console.log('sortedScores', sortedScores);

        // Create n columns; 8 or more endscores
        let len = Math.max(sortedScores.length, 8);
        game.displayedColumns = Array.from(Array(len), (_, i) => String(i + 1));
        game.displayedColumns.unshift('Team');
        game.displayedColumns.push('Total');
        game.displayedColumns = game.displayedColumns.filter((e) => e !== 'null');

        game.data = [
          {
            Team: { team: game.team_name1, team_id: game.curlingteam1_id },
            1: '-',
            2: '-',
            3: '-',
            4: '-',
            5: '-',
            6: '-',
            7: '-',
            8: '-',
            Total: 0,
          },
          {
            Team: { team: game.team_name2, team_id: game.curlingteam2_id },
            1: '-',
            2: '-',
            3: '-',
            4: '-',
            5: '-',
            6: '-',
            7: '-',
            8: '-',
            Total: 0,
          },
        ];

        let team1Total = 0;
        let team2Total = 0;

        sortedScores
          .map((e) => e.end_number)
          .forEach((end_number, i) => {
            // console.log('end_number', end_number);
            if (end_number === null) {
              return;
            } else if (sortedScores[i].curlingteam1_scored === true) {
              game.data[0][end_number] = sortedScores[i].score || 0;
              game.data[1][end_number] = 0;
              team1Total += sortedScores[i].score;
            } else if (sortedScores[i].curlingteam1_scored === false) {
              game.data[0][end_number] = 0;
              game.data[1][end_number] = sortedScores[i].score || 0;
              team2Total += sortedScores[i].score;
            }
          });

        game.data[0]['Total'] = team1Total;
        game.data[1]['Total'] = team2Total;
      }

      // console.log('this.currentGames', this.currentGames);

      resolve();
    });
  }

  async loadTeamStandings() {
    // console.log('---------------------------------------------------------------');

    // Lookup tables
    let pools = {};
    let brackets = {};

    await this.apiService
      .getPool(this.currentEventId)
      .toPromise()
      .then((res: any) => {
        // Convert array of objects to object
        let arr = res;
        for (let i = 0; i < arr.length; i++) {
          pools[arr[i].id] = {
            event_id: arr[i].event_id,
            name: arr[i].name,
            color: arr[i].color,
          };
        }
      });

    await this.apiService
      .getBracket(this.currentEventId)
      .toPromise()
      .then((res: any) => {
        // Convert array of objects to object
        let arr = res;
        for (let i = 0; i < arr.length; i++) {
          brackets[arr[i].id] = {
            event_id: arr[i].event_id,
            name: arr[i].name,
            color: arr[i].color,
          };
        }
      });

    // console.log('pools', pools);
    // console.log('brackets', brackets);

    /*************************************************************************/

    // Use lookup tables to add pool/bracket names as properties to each game
    this.allGames.forEach((game) => {

      if (game.pool_id !== null) {

        game.pool_name = pools[game.pool_id].name;
        game.label_name = pools[game.pool_id].name;

      } else if (game.bracket_id !== null) {

        game.bracket_name = brackets[game.bracket_id].name;
        game.label_name = brackets[game.bracket_id].name;

      } else {

        game.label_name = 'Other';
        // console.log('==========>', game);

      }
    });

    // console.log('allGames', this.allGames);

    /*************************************************************************/

    // Get unique names of pools & brackets which is used for dropdown list
    let unique_event_type_names = ['All Teams', ...new Set(this.allGames.map((game) => game.label_name))];

    // console.log('unique_event_type_names', unique_event_type_names);

    /*************************************************************************/

    // Create team mapping for all teams in the event
    let team_mapping = {};
    for (let game of this.allGames) {
      if (!team_mapping.hasOwnProperty(game.curlingteam1_id)) {
        team_mapping[game.curlingteam1_id] = game.team_name1;
      }
      if (!team_mapping.hasOwnProperty(game.curlingteam2_id)) {
        team_mapping[game.curlingteam2_id] = game.team_name2;
      }
    }

    // console.log('team_mapping', team_mapping);

    /*************************************************************************/

    // Clear poolBracketList
    this.poolBracketList.length = 0;

    // Populate poolBracketList (loop through each pool/bracket)
    for (let event_type_name of unique_event_type_names) {

      // console.log('---------------------------------------   ', event_type_name);

      // Get all games in a single pool or bracket
      let games = this.allGames.filter((e) => e.label_name === event_type_name);

      // Get all unique teams in a single pool or bracket
      let teams = [...new Set(games.map((e) => e.curlingteam1_id).concat(games.map((e) => e.curlingteam2_id)))];

      // console.log('teams ====>', teams);
      // console.log('games ====>', games);

      // If no teams exist, skip
      if (teams.length === 0) {
        continue;
      }

      // Add an array for each team
      let to_add = {
        event_type_name: event_type_name, // batchUploadBracket1 (pool or bracket)
        list: [],              // List of team standings
      };

      // Add a JSON object for each team in a single pool or bracket
      for (let team_id of teams) {
        to_add.list.push({
          team_name: team_mapping[team_id],
          team_id: team_id,
          wins: 0,
          losses: 0,
          ties: 0,
        });
      }

      // Tally up the scores
      for (let game of games) {

        // Skip if game is not finished...
        if (game.finished !== true) {
          // console.log('not finished');
          continue;
        }

        // Increment ties...
        if (game.winner === null) {
          to_add.list.find((e) => e.team_id === game.curlingteam1_id).ties++;
          to_add.list.find((e) => e.team_id === game.curlingteam2_id).ties++;
          // console.log('tie', game.team_name1, game.team_name2);
          continue;
        }

        // Increment win...
        if (game.winner === game.curlingteam1_id) {
          to_add.list.find((e) => e.team_id === game.curlingteam1_id).wins++;
          to_add.list.find((e) => e.team_id === game.curlingteam2_id).losses++;
          // console.log('winner', game.team_name1);
          // console.log('loser', game.team_name2);
          continue;
        }

        // Increment losses...
        if (game.winner === game.curlingteam2_id) {
          to_add.list.find((e) => e.team_id === game.curlingteam2_id).wins++;
          to_add.list.find((e) => e.team_id === game.curlingteam1_id).losses++;
          // console.log('winner', game.team_name2);
          // console.log('loser', game.team_name1);
          continue;
        }

      }

      this.poolBracketList.push(to_add);
    }

    // console.log('poolBracketList', this.poolBracketList);

    // Combine all lists for All Teams list
    let totals = {};
    for (let arr of this.poolBracketList) {
      for (let game of arr.list) {
        if (!totals.hasOwnProperty(game.team_id)) {
          totals[game.team_id] = Object.assign({}, game);
        } else {
          totals[game.team_id].wins += game.wins;
          totals[game.team_id].losses += game.losses;
          totals[game.team_id].ties += game.ties;
        }
      }
    }

    // console.log('totals', totals);

    // Prepend All Teams list to poolBracketList
    this.poolBracketList.unshift({
      event_type_name: 'All Teams',
      list: Object.values(totals)
    });

    // Set All Teams as default for selectedPoolBracket and dataSourceStandings
    this.selectedPoolBracket = this.poolBracketList[0].event_type_name;
    this.dataSourceStandings = Object.values(totals);
    this.dataSourceStandings.sort((a, b) => a.wins - b.wins).reverse();

    // console.log('dataSourceStandings', this.dataSourceStandings);
  }

  openYoutubeDialog() {
    const url = this.selectedDraw.video_url;
    if (this.validateYouTubeUrl(url)) {
      const dialogRef = this.dialog.open(YoutubeDialogComponent, {
        width: '800px',
        data: { youtube_link: url },
      });

      dialogRef.afterClosed().subscribe((result) => {
        // console.log('Youtube dialog was closed');
      });
    }
  }

  validateYouTubeUrl(url) {
    if (url != undefined || url != '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        return true;
      } else {
        return false;
      }
    }
  }

  convertToAlpha(num) {
    return String.fromCharCode(num + 65);
  }

  onDrawSelected(event: any) {
    this.selectedDraw = event.value;
    console.log('selectedDraw', this.selectedDraw);

    this.loadGames();
  }

  onTeamSelected(event: any) {
    console.log('the selected team is:');
    console.log(event.value);

    this.dataSourceStandings = this.poolBracketList.find((e) => e.event_type_name === event.value).list;
    this.dataSourceStandings.sort((a, b) => a.wins - b.wins).reverse();
  }
}
