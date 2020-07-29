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
import { take } from 'rxjs/operators';
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
  ) {}

  ngOnInit() {
    this.spinnerService.on();

    // Get current event
    this.apiService.currentEvent$.subscribe((currentEvent) => {
      this.currentEvent = currentEvent;
      console.log(1);
    });

    // Get current event ID
    this.apiService.currentEventId$.subscribe((eventId) => {
      this.currentEventId = eventId;
      console.log(2);

      // Get draws, games and scores
      forkJoin(
        this.apiService.getDraws(this.currentEventId),
        this.apiService.getGames(this.currentEventId),
        this.apiService.getScoresByEvent(this.currentEventId)
      ).subscribe((vals: any) => {
        console.log('all values', vals);

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
      this.currentGames = this.allGames.filter(
        (x) => x.draw_id === this.selectedDraw.id
      );

      for (let game of this.currentGames) {
        const filteredScores = this.allScores.filter(
          (e) => e.game_id === game.game_id
        );
        const sortedScores = filteredScores.sort(
          (a, b) => a.end_number - b.end_number
        );

        console.log('filteredScores', filteredScores);
        console.log('sortedScores', sortedScores);

        game.displayedColumns = sortedScores.map((e) => String(e.end_number)); // [1', '2', '3', '4', '5', ...]
        game.displayedColumns.unshift('Team');
        game.displayedColumns.push('Total');
        game.displayedColumns = game.displayedColumns.filter(
          (e) => e !== 'null'
        );

        game.data = [
          {
            Team: { team: game.team_name1, team_id: game.curlingteam1_id },
            Total: 0,
          },
          {
            Team: { team: game.team_name2, team_id: game.curlingteam2_id },
            Total: 0,
          },
        ];

        let team1Total = 0;
        let team2Total = 0;

        sortedScores
          .map((e) => e.end_number)
          .forEach((end_number, i) => {
            console.log('end_number', end_number);
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

      console.log('this.currentGames', this.currentGames);

      resolve();
    });
  }

  async loadTeamStandings() {
    let pools;
    let brackets;

    await this.apiService
      .getPool(this.currentEventId)
      .toPromise()
      .then((res: any) => {
        // Convert array of objects to object
        let arr = res;
        let result = {};
        for (let i = 0; i < arr.length; i++) {
          result[arr[i].id] = {
            event_id: arr[i].event_id,
            name: arr[i].name,
            color: arr[i].color,
          };
        }

        pools = result;
        console.log('pools:');
        console.log(pools);
      });

    await this.apiService
      .getBracket(this.currentEventId)
      .toPromise()
      .then((res: any) => {
        // Convert array of objects to object
        let arr = res;
        let result = {};
        for (let i = 0; i < arr.length; i++) {
          result[arr[i].id] = {
            event_id: arr[i].event_id,
            name: arr[i].name,
            color: arr[i].color,
          };
        }

        brackets = result;
        console.log('brackets:');
        console.log(brackets);
      });

    this.allGames.forEach((e) => {
      e.pool_name = pools[e.pool_id]?.name || null;
      e.type = pools[e.pool_id]?.name ? 'Pool' : null;
      e.bracket_name = pools[e.bracket_id]?.name || null;
      e.type = pools[e.pool_id]?.name ? 'Bracket' : null;

      e.label_name =
        pools[e.pool_id]?.name || pools[e.bracket_id]?.name || null;
    });

    // Get unique names of pools & brackets
    let unique_names = [...new Set(this.allGames.map((e) => e.label_name))];
    unique_names = unique_names.filter((e) => e !== null);
    unique_names = ['All Teams'].concat(unique_names);

    console.log('unique_names:');
    console.log(unique_names);

    // Create team mapping
    let team_mapping = {};
    for (let game of this.allGames) {
      if (!team_mapping.hasOwnProperty(game.curlingteam1_id)) {
        team_mapping[game.curlingteam1_id] = game.team_name1;
      }
      if (!team_mapping.hasOwnProperty(game.curlingteam2_id)) {
        team_mapping[game.curlingteam2_id] = game.team_name2;
      }
    }

    console.log(team_mapping);

    let A = this.allGames.filter((e) => e.label_name === unique_names[1]);

    // Clear poolBracketList
    this.poolBracketList.length = 0;

    // this.poolBracketList = [
    //   [
    //     'pool 1', [
    //       {
    //         name: team_name1,
    //         wins: 0,
    //         losses: 0,
    //         ties: 0
    //       },
    //       {
    //         name: team_name2,
    //         wins: 0,
    //         losses: 0,
    //         ties: 0
    //       }
    //     ]
    //   ],
    //   ['pool 2'],
    //   ['pool 3'],
    //   ['bracket 1'],
    //   ['bracket 2']
    // ]

    for (let event_type_name of unique_names) {
      // console.log(event_type_name);

      // Get all games in a given pool or bracket
      let games = this.allGames.filter((e) => e.label_name === event_type_name);

      // Get all unique teams in a given pool or bracket
      let teams = [
        ...new Set(
          games
            .map((e) => e.curlingteam1_id)
            .concat(games.map((e) => e.curlingteam2_id))
        ),
      ];

      console.log(teams);

      // Add a counter object for each team
      let to_add = [
        event_type_name, // Cattle-A
        [], // List of team standings
      ];

      for (let team_id of teams) {
        to_add[1].push({
          team_name: team_mapping[team_id],
          team_id: team_id,
          wins: 0,
          losses: 0,
          ties: 0,
        });
      }

      // Tally up the scores
      for (let game of games) {
        // Increment ties...
        if (game.finished === true && game.winner === null) {
          to_add[1].find((e) => e.team_id === game.curlingteam1_id).ties++;
          to_add[1].find((e) => e.team_id === game.curlingteam2_id).ties++;
        }

        // Increment win...
        else if (
          game.finished === true &&
          game.winner === game.curlingteam1_id
        ) {
          to_add[1].find((e) => e.team_id === game.curlingteam1_id).wins++;
          to_add[1].find((e) => e.team_id === game.curlingteam2_id).losses++;
        }

        // Increment losses...
        else if (
          game.finished === true &&
          game.winner === game.curlingteam2_id
        ) {
          to_add[1].find((e) => e.team_id === game.curlingteam2_id).wins++;
          to_add[1].find((e) => e.team_id === game.curlingteam1_id).losses++;
        }
      }

      this.poolBracketList.push(to_add);
    }

    // Combine all lists for All Teams list

    console.log(this.poolBracketList);

    let totals = {};
    for (let arr of this.poolBracketList.slice(1)) {
      for (let game of arr[1]) {
        if (!totals.hasOwnProperty(game.team_id)) {
          // console.log('creating');
          // console.log(game);

          totals[game.team_id] = game;
        } else {
          // console.log('adding');
          // console.log(totals[game.team_id]);
          // console.log(game);

          // console.log('before');
          // console.log(totals[game.team_id].wins);

          totals[game.team_id].wins += game.wins;
          totals[game.team_id].losses += game.losses;
          totals[game.team_id].ties += game.ties;

          // console.log('after');
          // console.log(totals[game.team_id].wins);
        }
      }
    }

    console.log(totals);

    this.selectedPoolBracket = this.poolBracketList[0][0];
    this.poolBracketList[0][1] = Object.values(totals);
    this.dataSourceStandings = Object.values(totals);
    this.dataSourceStandings.sort((a, b) => a.wins - b.wins).reverse();

    console.log('this.dataSourceStandings');

    console.log('poolBracketList:');
    console.log(this.poolBracketList);
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

    this.dataSourceStandings = this.poolBracketList.find(
      (e) => e[0] === event.value
    )[1];
    this.dataSourceStandings.sort((a, b) => a.wins - b.wins).reverse();
  }
}
