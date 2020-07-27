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
  standingsColumns = ['name', 'wins', 'losses'];
  dataSourceDraws = [];
  dataSourceGames = [];
  dataSourceAllStandings = [];

  panelOpenState = false;
  currentReq$ = null;

  selectedDraw = null;
  selectedPoolID = null;
  allDraws = [];
  allGames = [];
  buckets = [];
  currentGames = [];
  currentStandings = [];
  currentEventId = null;
  currentEvent = null;
  allScores = [];
  currentScores = [];

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.spinnerService.on();

    // Get current event ID
    this.apiService.currentEventId$.subscribe((eventId) => {
      this.spinnerService.on();

      this.currentEventId = eventId;
      // this.currentEventId = 5;  // DEBUGGING
      // console.log(`[DEBUG] currentEventId: ${this.currentEventId}`);

      // Get current event name
      this.apiService.currentEvent$.subscribe((currentEvent) => {
        this.currentEvent = currentEvent;
      });

      // Get current draws by event ID
      this.apiService.getDraws(this.currentEventId).subscribe((res: any) => {
        // console.log('[DEBUG] draws:');
        // console.log(res);

        this.selectedDraw = res[res.length - 1];
        this.allDraws = res;

        // Get all games by event ID
        this.apiService.getGames(this.currentEventId).subscribe((res: any) => {
          // console.log('[DEBUG] games');
          // console.log(res);

          this.allGames = res;

          this.apiService
            .getScoresByEvent(this.currentEventId)
            .subscribe((res: any) => {
              this.allScores = res;

              this.currentGames = this.allGames.filter(
                (x) => x.draw_id === this.selectedDraw.id
              );

              this.currentGames.forEach((game) =>
                this.allScores.forEach((score) => {
                  if (score.game_id === game.game_id)
                    this.currentScores.push(score);
                })
              );

              //sort by gameid then end number
              this.currentScores.sort(
                (a, b) => a.game_id - b.game_id || a.end_number - b.end_number
              );

              console.log(`[DEBUG] currentGames:`);
              console.log(this.currentGames);
              console.log('[DEBUG] this.currentScores');
              console.log(this.currentScores);
              let B = [];

              // Add dataSource key-value pair for Scores Tab
              for (let game of this.currentGames) {
                B.push({
                  name: game.team_name1,
                  scores: [],
                  total: 0,
                });
                B.push({
                  name: game.team_name2,
                  scores: [],
                  total: 0,
                });
              }

              for (let score of this.currentScores) {
                const team1 = B.find((e) => e.name === score.team_name1);
                const team2 = B.find((e) => e.name === score.team_name2);
                if (score.curlingteam1_scored) {
                  team1.scores.push({
                    end: score.end_number,
                    score: score.score,
                  });
                  team1.total += score.score;
                  team2.scores.push({ end: score.end_number, score: 0 });
                } else if (score.blank) {
                  team1.scores.push({ end: score.end_number, score: 0 });
                  team2.scores.push({ end: score.end_number, score: 0 });
                } else {
                  team2.scores.push({
                    end: score.end_number,
                    score: score.score,
                  });
                  team2.total += score.score;
                  team1.scores.push({ end: score.end_number, score: 0 });
                }
              }

              for (let game of this.currentGames) {
                const team1 = B.find((e) => e.name === game.team_name1);
                const team2 = B.find((e) => e.name === game.team_name2);
                game.dataSource = [team1, team2];
              }
              console.log(`[DEBUG] currentGames:`);
              console.log(this.currentGames);

              console.log('[DEBUG] B:');
              console.log(B);

              // console.log(`[DEBUG] selectedDraw:`);
              // console.log(this.selectedDraw);
              // console.log(`[DEBUG] allDraws:`);
              // console.log(this.allDraws);
              // console.log(`[DEBUG] allGames:`);
              // console.log(this.allGames);
              // console.log(`[DEBUG] currentGames:`);
              // console.log(this.currentGames);
              // console.log('[DEBUG] allScores:');
              // console.log(this.allScores);
              // console.log('[DEBUG] currentScores:');
              // console.log(this.currentScores);
              // console.log('[DEBUG] game.dataSource:');
              //console.log(game.dataSource);

              // Populate all standings
              let buckets = {};
              for (let game of this.allGames) {
                if (isNaN(game.winner)) {
                  continue;
                }

                if (!buckets.hasOwnProperty(game.curlingteam1_id)) {
                  buckets[game.curlingteam1_id] = {
                    name: game.team_name1,
                    team_id: game.curlingteam1_id,
                    wins: 0,
                    losses: 0,
                    pool_id: game.pool_id,
                    bracket_id: game.bracket_id,
                  };
                }

                if (!buckets.hasOwnProperty(game.curlingteam2_id)) {
                  buckets[game.curlingteam2_id] = {
                    name: game.team_name2,
                    team_id: game.curlingteam2_id,
                    wins: 0,
                    losses: 0,
                    pool_id: game.pool_id,
                    bracket_id: game.bracket_id,
                  };
                }

                if (game.winner === game.curlingteam1_id) {
                  buckets[game.curlingteam1_id].wins++;
                  buckets[game.curlingteam2_id].losses++;
                } else {
                  buckets[game.curlingteam2_id].wins++;
                  buckets[game.curlingteam1_id].losses++;
                }
              }

              // console.log('[DEBUG] buckets:');
              // console.log(buckets);

              // Convert object to array
              let arr = Object.keys(buckets).map((key) => buckets[key]);

              // console.log('[DEBUG] arr:');
              // console.log(arr);

              const A = [];

              //Add a new container for all teams
              A.push({
                type: 'All Teams',
                id: '',
                teams: [],
              });

              for (const team of arr) {
                // Add a new container for each pool ID if it does not already exist
                if (
                  team.pool_id !== null &&
                  A.filter((e) => e.type === 'Pool' && e.id === team.pool_id)
                    .length === 0
                ) {
                  A.push({
                    type: 'Pool',
                    id: team.pool_id,
                    teams: [],
                  });
                }

                // Add a a new container for each bracket ID if it does not already exist
                if (
                  team.bracket_id !== null &&
                  A.filter(
                    (e) => e.type === 'Bracket' && e.id === team.bracket_id
                  ).length === 0
                ) {
                  A.push({
                    type: 'Bracket',
                    id: team.bracket_id,
                    teams: [],
                  });
                }

                // Add a a new, special container for games that don't have a pool_id & bracket_id
                if (
                  team.pool_id === null &&
                  team.bracket_id === null &&
                  A.filter((e) => e.type === 'Other').length === 0
                ) {
                  A.push({
                    type: 'Other',
                    id: '',
                    teams: [],
                  });
                }

                // Add teams to the corresponding pool container ...
                if (team.pool_id !== null) {
                  const found = A.find(
                    (e) => e.type === 'Pool' && e.id === team.pool_id
                  );
                  if (found) {
                    found.teams.push(team);
                  }
                }

                // ... or bracket container ...
                else if (team.bracket_id !== null) {
                  const found = A.find(
                    (e) => e.type === 'Bracket' && e.id === team.bracket_id
                  );
                  if (found) {
                    found.teams.push(team);
                  }
                }

                // ... or other container
                else {
                  const found = A.find((e) => e.type === 'Other');
                  if (found) {
                    found.teams.push(team);
                  }
                }
                // Add team to the 'All Teams' container
                if (team.name !== null) {
                  const found = A.find((e) => e.type === 'All Teams');
                  if (found) {
                    found.teams.push(team);
                  }
                }
              }

              // If event type is 'Other' then 'All Teams' is redundant
              if (
                A.find((e) => e.type === 'Other') &&
                A.find((e) => e.type === 'All Teams')
              ) {
                A.splice(0, 1);
              }

              // console.log('[DEBUG] A:');
              // console.log(A);

              this.dataSourceAllStandings.length = 0; // Clear array
              this.dataSourceAllStandings = A; // Populate array

              //reverse sort losses, sort wins
              this.dataSourceAllStandings.forEach((group) => {
                group.teams.sort((a, b) => (a.losses > b.losses ? 1 : -1));
                group.teams.sort((a, b) => (a.wins > b.wins ? -1 : 1));
              });

              //console.log('[DEBUG] dataSourceAllStandings');
              //console.log(this.dataSourceAllStandings);

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

    let B = [];

    // Add dataSource key-value pair for Scores Tab
    for (let game of this.currentGames) {
      B.push({
        name: game.team_name1,
        scores: [],
        total: 0,
      });
      B.push({
        name: game.team_name2,
        scores: [],
        total: 0,
      });
    }

    for (let score of this.currentScores) {
      const team1 = B.find((e) => e.name === score.team_name1);
      const team2 = B.find((e) => e.name === score.team_name2);
      if (score.curlingteam1_scored) {
        team1.scores.push({
          end: score.end_number,
          score: score.score,
        });
        team1.total += score.score;
        team2.scores.push({ end: score.end_number, score: 0 });
      } else if (score.blank) {
        team1.scores.push({ end: score.end_number, score: 0 });
        team2.scores.push({ end: score.end_number, score: 0 });
      } else {
        team2.scores.push({
          end: score.end_number,
          score: score.score,
        });
        team2.total += score.score;
        team1.scores.push({ end: score.end_number, score: 0 });
      }
    }

    for (let game of this.currentGames) {
      const team1 = B.find((e) => e.name === game.team_name1);
      const team2 = B.find((e) => e.name === game.team_name2);
      game.dataSource = [team1, team2];
    }

    // console.log('AFTER');
    // console.log(this.currentGames);
  }
}
