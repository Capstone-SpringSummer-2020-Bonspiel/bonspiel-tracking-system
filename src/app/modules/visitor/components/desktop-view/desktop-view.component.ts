import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogOverviewComponent } from '@app/modules/visitor/components/team-dialog-overview/team-dialog-overview.component';
import { YoutubeDialogComponent } from '@app/modules/visitor/components/youtube-dialog/youtube-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-desktop-view',
  templateUrl: './desktop-view.component.html',
  styleUrls: ['./desktop-view.component.scss'],
})
export class DesktopViewComponent implements OnInit {
  displayedColumns = [
    'name',
    // 'home',
    'round_1',
    'round_2',
    'round_3',
    'round_4',
    'round_5',
    'round_6',
    'round_7',
    'round_8',
    'final_score',
  ];
  standingsColumns = ['name', 'wins', 'losses', 'ties'];
  dataSourceDraws = [];
  dataSourceGames = [];
  dataSourceStandings = [];

  panelOpenState = false;
  currentReq$ = null;

  selectedDraw = null;
  selectedPoolID = null;
  allDraws = [];
  allGames = [];
  poolBracketList = [];
  currentGames = [];
  currentStandings = [];
  currentEventId = null;
  currentEvent = null;
  allScores = [];
  currentScores = [];
  selectedPoolBracket = 'All Teams';

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.spinnerService.on();

    // Get current event ID
    this.apiService.currentEventId$.subscribe((eventId) => {
      // this.currentEventId = 5;  // DEBUGGING
      // console.log(`[DEBUG] currentEventId: ${this.currentEventId}`);
      this.currentEventId = eventId;

      // Get current event name
      this.apiService.currentEvent$.subscribe((currentEvent) => {
        this.currentEvent = currentEvent;
      });

      // Get current draws by event ID
      this.apiService.getDraws(this.currentEventId).subscribe((res: any) => {
        // console.log('[DEBUG] draws:');
        // console.log(res);

        this.allDraws = res;
        this.selectedDraw = res[res.length - 1];

        // Get all games by event ID
        this.apiService.getGames(this.currentEventId).subscribe((res: any) => {
          // console.log('[DEBUG] games');
          // console.log(res);

          this.allGames = res;

          this.apiService
            .getScoresByEvent(this.currentEventId)
            .subscribe(async (res: any) => {
              this.allScores = res;

              // Add dataSource key-value pair for Scores Tab
              for (let game of this.allGames) {
                game.dataSource = [
                  {
                    name: game.team_name1,
                    round_1: '0',
                    round_2: '2',
                    round_3: '0',
                    round_4: '0',
                    round_5: '2',
                    round_6: '0',
                    round_7: '1',
                    round_8: '0',
                    rounds: ['0',
                      '2',
                      '0',
                      '0',
                      '2',
                      '0',
                      '1',
                      '0'],
                    final_score: '',
                  },
                  {
                    name: game.team_name2,
                    round_1: '0',
                    round_2: '0',
                    round_3: '2',
                    round_4: '1',
                    round_5: '0',
                    round_6: '2',
                    round_7: '0',
                    round_8: '5',
                    rounds: ['0',
                      '2',
                      '0',
                      '0',
                      '2',
                      '0',
                      '1',
                      '0'],
                    final_score: '',
                  },
                ];
              }

              this.currentGames = this.allGames.filter(
                (x) => x.draw_id === this.selectedDraw.id
              );

              this.currentGames.forEach((game) =>
                this.allScores.forEach((score) => {
                  if (score.game_id === game.game_id)
                    this.currentScores.push(score);
                })
              );

              console.log('this.allGames:');
              console.log(this.allGames);

              /************************************************************************/

              let pools;
              let brackets;

              await this.apiService.getPool(this.currentEventId)
                .toPromise()
                .then(
                  (res: any) => {
                    // console.log('pools:');
                    // console.log(res);

                    // Convert array of objects to object
                    let arr = res;
                    let result = {};
                    for (let i = 0; i < arr.length; i++) {
                      result[arr[i].id] = {
                        event_id: arr[i].event_id,
                        name: arr[i].name,
                        color: arr[i].color
                      }
                    }

                    pools = result;
                    console.log('pools:');
                    console.log(pools);
                  });

              await this.apiService.getBracket(this.currentEventId)
                .toPromise()
                .then(
                  (res: any) => {
                    // console.log('pools:');
                    // console.log(res);

                    // Convert array of objects to object
                    let arr = res;
                    let result = {};
                    for (let i = 0; i < arr.length; i++) {
                      result[arr[i].id] = {
                        event_id: arr[i].event_id,
                        name: arr[i].name,
                        color: arr[i].color
                      }
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

                e.label_name = pools[e.pool_id]?.name || pools[e.bracket_id]?.name || null;
              })

              // Get unique names of pools & brackets
              let unique_names = [...new Set(this.allGames.map((e) => e.label_name))];
              unique_names = unique_names.filter(e => e !== null);
              unique_names = ['All Teams'].concat(unique_names);

              console.log('unique_names:');
              console.log(unique_names);

              // Create team mapping
              let team_mapping = {};
              for (let game of this.allGames) {
                if (!(team_mapping.hasOwnProperty(game.curlingteam1_id))) {
                  team_mapping[game.curlingteam1_id] = game.team_name1
                }
                if (!(team_mapping.hasOwnProperty(game.curlingteam2_id))) {
                  team_mapping[game.curlingteam2_id] = game.team_name2
                }
              }

              console.log(team_mapping);

              let A = this.allGames.filter((e) => e.label_name === unique_names[1]);

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
                let teams = [...new Set(games.map((e) => e.curlingteam1_id).concat(games.map((e) => e.curlingteam2_id)))];

                console.log(teams);

                // Add a counter object for each team
                let to_add = [
                  event_type_name,  // Cattle-A
                  []                // List of team standings
                ];

                for (let team_id of teams) {
                  to_add[1].push({
                    team_name: team_mapping[team_id],
                    team_id: team_id,
                    wins: 0,
                    losses: 0,
                    ties: 0
                  })
                }

                // Tally up the scores
                for (let game of games) {

                  // Increment ties...
                  if (game.finished === true && game.winner === null) {
                    to_add[1].find(e => e.team_id === game.curlingteam1_id).ties++;
                    to_add[1].find(e => e.team_id === game.curlingteam2_id).ties++;
                  }

                  // Increment win...
                  else if (game.finished === true && game.winner === game.curlingteam1_id) {
                    to_add[1].find(e => e.team_id === game.curlingteam1_id).wins++;
                    to_add[1].find(e => e.team_id === game.curlingteam2_id).losses++;
                  }

                  // Increment losses...
                  else if (game.finished === true && game.winner === game.curlingteam2_id) {
                    to_add[1].find(e => e.team_id === game.curlingteam2_id).wins++;
                    to_add[1].find(e => e.team_id === game.curlingteam1_id).losses++;
                  }

                }

                this.poolBracketList.push(to_add);
              }

              // Combine all lists for All Teams list


              console.log(this.poolBracketList);

              let totals = {};
              for (let arr of this.poolBracketList.slice(1)) {
                for (let game of arr[1]) {
                  if (!(totals.hasOwnProperty(game.team_id))) {
                    // console.log('creating');
                    // console.log(game);

                    totals[game.team_id] = game
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

              console.log('this.dataSourceStandings');

              console.log('poolBracketList:');
              console.log(this.poolBracketList);

              this.spinnerService.off();
            });
        });
      });
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  openDialog(): void {
    const dialogRef = this.dialog.open(TeamDialogOverviewComponent, {
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }

  openYoutubeDialog(video_url): void {
    // console.log(`video_url  ==>  ${video_url}`);
    const dialogRef = this.dialog.open(YoutubeDialogComponent, {
      width: '800px',
      data: { youtube_link: video_url },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('Youtube dialog was closed');
    });
  }

  getFinalScore(team) {
    return (
      Number(team.round_1) +
      Number(team.round_2) +
      Number(team.round_3) +
      Number(team.round_4) +
      Number(team.round_5) +
      Number(team.round_6) +
      Number(team.round_7) +
      Number(team.round_8)
    );
  }

  convertToAlpha(num) {
    return String.fromCharCode(num + 65);
  }

  onDrawSelected(event: any) {
    // console.log('the selected draw is:');
    // console.log(event.value);

    // Set the current selected draw
    this.selectedDraw = event.value;

    // console.log('BEFORE');
    // console.log(this.currentGames);
    // console.log(this.selectedDraw.id);

    // Load games by draw ID
    this.currentGames = this.allGames.filter(
      (e) => e.draw_id === this.selectedDraw.id
    );

    this.currentScores = [];
    this.currentGames.forEach((game) =>
      this.allScores.forEach((score) => {
        if (score.game_id === game.game_id) this.currentScores.push(score);
      })
    );
    console.log('[DEBUG] currentScores:');
    console.log(this.currentScores);

    // console.log('AFTER');
    // console.log(this.currentGames);
  }

  onTeamSelected(event: any) {
    console.log('the selected team is:');
    console.log(event.value);

    this.dataSourceStandings = this.poolBracketList.find((e) => e[0] === event.value)[1];
  }
}

export interface Game {
  name: string;
  // home: string;
  round_1: string;
  round_2: string;
  round_3: string;
  round_4: string;
  round_5: string;
  round_6: string;
  round_7: string;
  round_8: string;
  final_score: string;
}

export interface Draw {
  name: string;
  date: Date;
  game_1: Game[];
  game_2: Game[];
  game_3: Game[];
  youtube_link: string;
}
export interface Standing {
  name: string;
  wins: number;
  losses: number;
  ties: number;
  pool_id: number;
  bracket_id: number;
}
