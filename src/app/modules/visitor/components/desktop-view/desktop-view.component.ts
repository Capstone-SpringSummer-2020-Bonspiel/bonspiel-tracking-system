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

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.spinner.on();

    // Get current event ID
    this.api
      .currentEventId$
      .subscribe((eventId) => {
        this.spinner.on();

        this.currentEventId = eventId;
        // this.currentEventId = 5;  // DEBUGGING
        console.log(`[DEBUG] currentEventId: ${this.currentEventId}`);

        // Get current event name
        this.api
          .currentEvent$
          .subscribe((currentEvent) => {
            this.currentEvent = currentEvent;
          });

        // Get current draws by event ID
        this.api
          .getDraws(this.currentEventId)
          .subscribe((res: any) => {
            console.log('[DEBUG] draws:');
            console.log(res);

            this.selectedDraw = res[res.length - 1];
            this.allDraws = res;

            // Get all games by event ID
            this.api
              .getGames(this.currentEventId)
              .subscribe((res: any) => {
                console.log('[DEBUG] games');
                console.log(res);

                this.allGames = res;

                // Add dataSource key-value pair for Scores Tab
                for (let game of this.allGames) {
                  game.dataSource = [
                    {
                      name: game.team_name1,
                      // home: '*',
                      round_1: '5',
                      round_2: '5',
                      round_3: '5',
                      round_4: '5',
                      round_5: '5',
                      round_6: '5',
                      round_7: '5',
                      round_8: '5',
                      final_score: '5',
                    },
                    {
                      name: game.team_name2,
                      // home: '*',
                      round_1: '5',
                      round_2: '5',
                      round_3: '5',
                      round_4: '5',
                      round_5: '5',
                      round_6: '5',
                      round_7: '5',
                      round_8: '5',
                      final_score: '5',
                    },
                  ]
                }

                this.currentGames = this.allGames.filter(x => x.draw_id === this.selectedDraw.id);

                console.log(`[DEBUG] selectedDraw:`);
                console.log(this.selectedDraw);
                console.log(`[DEBUG] allDraws:`);
                console.log(this.allDraws);
                console.log(`[DEBUG] allGames:`);
                console.log(this.allGames);
                console.log(`[DEBUG] currentGames:`);
                console.log(this.currentGames);

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

                console.log('[DEBUG] buckets:');
                console.log(buckets);

                // Convert object to array
                let arr = Object.keys(buckets).map((key) => buckets[key]);

                console.log('[DEBUG] arr:');
                console.log(arr);

                const A = [];
                for (const team of arr) {

                  // Add a new container for each pool ID if it does not already exist
                  if (team.pool_id !== null && A.filter(e => e.type === 'Pool' && e.id === team.pool_id).length === 0) {
                    A.push({
                      type: 'Pool',
                      id: team.pool_id,
                      teams: []
                    });
                  }

                  // Add a a new container for each bracket ID if it does not already exist
                  if (team.bracket_id !== null && A.filter(e => e.type === 'Bracket' && e.id === team.bracket_id).length === 0) {
                    A.push({
                      type: 'Bracket',
                      id: team.bracket_id,
                      teams: []
                    });
                  }

                  // Add a a new, special container for games that don't have a pool_id & bracket_id
                  if (team.pool_id === null && team.bracket_id === null && A.filter(e => e.type === 'Other').length === 0) {
                    A.push({
                      type: 'Other',
                      id: '',
                      teams: []
                    });
                  }

                  // Add teams to the corresponding pool container ...
                  if (team.pool_id !== null) {
                    const found = A.find(e => e.type === 'Pool' && e.id === team.pool_id);
                    if (found) {
                      found.teams.push(team);
                    }
                  }

                  // ... or bracket container ...
                  else if (team.bracket_id !== null) {
                    const found = A.find(e => e.type === 'Bracket' && e.id === team.bracket_id);
                    if (found) {
                      found.teams.push(team);
                    }
                  }

                  // ... or other container
                  else {
                    const found = A.find(e => e.type === 'Other');
                    if (found) {
                      found.teams.push(team);
                    }
                  }
                }

                console.log('[DEBUG] A:');
                console.log(A);

                this.dataSourceAllStandings.length = 0;  // Clear array
                this.dataSourceAllStandings = A;         // Populate array

                console.log('[DEBUG] dataSourceAllStandings');
                console.log(this.dataSourceAllStandings);

                this.spinner.off();
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
      console.log('The dialog was closed');
    });
  }

  openYoutubeDialog(video_url): void {
    console.log(`video_url  ==>  ${video_url}`);
    const dialogRef = this.dialog.open(YoutubeDialogComponent, {
      width: '800px',
      data: { youtube_link: video_url },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Youtube dialog was closed');
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
    console.log('the selected draw is:');
    console.log(event.value);

    // Set the current selected draw
    this.selectedDraw = event.value;

    console.log('BEFORE');
    console.log(this.currentGames);
    console.log(this.selectedDraw.id);

    // Load games by draw ID
    this.currentGames = this.allGames.filter(
      (e) => e.draw_id === this.selectedDraw.id
    );

    console.log('AFTER');
    console.log(this.currentGames);
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
  pool_id: number;
  bracket_id: number;
}
