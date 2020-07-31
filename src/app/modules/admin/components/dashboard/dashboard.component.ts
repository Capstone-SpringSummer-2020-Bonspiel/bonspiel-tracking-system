import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DashboardService } from './../../dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '@core/api/api.service';
import { Timestamp } from 'rxjs';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatAccordion } from '@angular/material/expansion';

export interface Event {
  id: number;
  name: string;
  event_type: string;
  info: string;
  completed: boolean;
  begin_date: Date;
  end_date: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  /**************************************************************************/

  @ViewChild('paginatorTop', { static: false }) paginatorTop: MatPaginator;
  @ViewChild('paginatorBottom', { static: false })
  paginatorBottom: MatPaginator;
  @ViewChild('mainTableSort', { static: false }) mainTableSort: MatSort;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  selection = new SelectionModel<any>(true, []);
  expandedElement: any;
  objectKeys = Object.keys;
  selectedColumn = 'all';
  defaultFilterPredicate: any;

  draws: any;
  games: any;

  teamColors = {
    color1: null,
    color2: null,
  }

  filterColumns = [
    {
      name: 'all',
      header: 'All',
    },
    {
      name: 'id',
      header: 'ID',
    },
    {
      name: 'name',
      header: 'Name',
    },
    {
      name: 'event_type',
      header: 'Event Type',
    },
    {
      name: 'completed',
      header: 'Completed?',
    },
    {
      name: 'begin_date',
      header: 'Start Date',
    },
    {
      name: 'end_date',
      header: 'End Date',
    },
  ];

  menuItems = [
    {
      category: 'myCategory',
      label: 'Set Homepage Default Event',
      option: 'setHomepageDefaultEvent',
      icon: 'home',
      tooltip: '',
    },
    {
      category: 'myCategory',
      label: 'Export to CSV',
      option: 'exportCSV',
      icon: 'get_app',
      tooltip: '',
    },
    {
      category: 'myCategory',
      label: 'Some Batch Function',
      option: 'someBatchFunction',
      icon: 'done_all',
      tooltip: '',
    },
    // {
    //   category: 'myCategory',
    //   label: 'Delete Events',
    //   option: 'deleteEvents',
    //   icon: 'delete_forever',
    //   tooltip: '',
    // },
    {
      category: 'myCategory',
      label: 'Refresh Data',
      option: 'refreshData',
      icon: 'refresh',
      tooltip: '',
    },
  ];

  keyToLabel = {
    'bracket_id': 'Bracket ID',
    'curlingteam1_id': 'Curling Team 1 ID',
    'curlingteam2_id': 'Curling Team 2 ID',
    'draw_id': 'Draw ID',
    'event_type': 'Event Type',
    'finished': 'Finished?',
    'game_id': 'Game ID',
    'game_name': 'Game Name',
    'ice_sheet': 'Ice Sheet',
    'loser_dest': 'Loser Destination Game',
    'notes': 'Notes',
    'pool_id': 'Pool ID',
    'stone_color1': 'Stone Color 1',
    'stone_color2': 'Stone Color 2',
    'team_name1': 'Team Name 1',
    'team_name2': 'Team Name 2',
    'winner': 'Winner',
    'winner_dest': 'Winner Destination Game',
  }

  /**************************************************************************/

  columns = [
    {
      name: 'arrow',
      header: '',
    },
    {
      name: 'checkbox',
      header: '',
    },
    {
      name: 'id',
      header: 'ID',
    },
    {
      name: 'name',
      header: 'Name',
    },
    {
      name: 'event_type',
      header: 'Event Type',
    },
    {
      name: 'completed',
      header: 'Status',
    },
    {
      name: 'begin_date',
      header: 'Start Date',
    },
    {
      name: 'end_date',
      header: 'End Date',
    },
  ];

  columnsTable = {
    arrow: '',
    id: 'ID',
    name: 'Name',
    event_type: 'Event Type',
    info: 'Info',
    completed: 'Status',
    begin_date: 'Start Date',
    end_date: 'End Date',
  };
  displayedColumns: string[] = this.columns.map((e) => e.name);
  dataSource = new MatTableDataSource<Event>([]);

  tournamentBracketData = [];

  selectedEvent = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dashboardService: DashboardService,
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.spinnerService.on();

    // Get all events
    this.apiService.getEvents().subscribe((rows: any) => {
      if (rows === null || rows === undefined) {
        this.notificationService.showError('Could not fetch curling events', 'ERROR');
        this.spinnerService.off();
        return;
      }

      const newData = this.dataSource.data;
      this.dataSource.sort = this.mainTableSort;

      for (let row of rows) {
        newData.push(row);
        // console.log(row);
      }
      this.dataSource.data = newData;
      this.spinnerService.off();
    });

    this.dataSource.paginator = this.paginator;
    this.defaultFilterPredicate = this.dataSource.filterPredicate;
  }

  /**************************************************************************/

  syncPaginatorTop(event: PageEvent) {
    this.paginatorTop.pageIndex = event.pageIndex;
    this.paginatorTop.pageSize = event.pageSize;
    this.paginatorTop.page.emit(event);
  }

  // Whether the number of selected elements matches the total number of rows
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Selects all rows if they are not all selected; otherwise clear selection
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  // The label for the checkbox on the passed row
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onClickTabs(event: MatTabChangeEvent, sample: any) {
    console.log('event => ', event);
    console.log('index => ', event.index);
    console.log('tab => ', event.tab);
    console.log('sample => ', sample);

    switch (event.index) {
      case 0:
        // this.loadEventInfo(sample.id);  
        break;

      case 1:
        this.loadBracket(sample.id);
        break;

      case 2:
        this.loadDraws(sample.id);
        break;

      default:
        break;
    }
  }

  loadBracket(eventId) {
    console.log('bracket view tab!');

    this.spinnerService.on();

    this.apiService.getTournamentBracketData(eventId).subscribe((data: any) => {
      // let payload = [data.nodes, data.edges];
      console.log('tournamentBracketData', data);

      // data.nodes.forEach(e => delete e.data);
      // data.nodes.forEach(e => delete e.dimension);
      // data.nodes.forEach(e => delete e.meta);
      // data.nodes.forEach(e => delete e.position);
      // data.edges.forEach(e => e.label = '');

      // this.tournamentBracketData = data;

      this.spinnerService.off();
    });
  }

  loadDraws(eventId) {
    this.spinnerService.on();

    // Get all draws + games
    this.apiService.getDraws(eventId).subscribe(rows => {
      this.draws = rows;
      console.log(this.draws);
      this.apiService.getGames(eventId).subscribe((rows: any[]) => {
        // Convert integer to alpha
        this.games = rows;
        console.log(this.games);
        this.spinnerService.off();
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    console.log('filtered dataSource:', this.dataSource);
  }

  updFilterPredicate() {
    console.log(`selectedColumn: |${this.selectedColumn}|`);

    this.applyFilter(this.dataSource.filter);

    if (this.selectedColumn === 'all') {
      this.dataSource.filterPredicate = this.defaultFilterPredicate;
    } else {
      // Define how a filter value should be applied on your data when a filter value is given
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        console.log('data:', data);
        return data[this.selectedColumn]
          .toLowerCase()
          .includes(filter.trim().toLowerCase());
      };
    }

    console.log('this.dataSource:', this.dataSource);
  }

  exportCSV() {
    this.notificationService.showSuccess('Exported CSV', '');
  }

  someBatchFunction() {
    this.notificationService.showWarning('Some batch function...', '');
  }

  deleteEvents() {
    this.notificationService.showError('Event deleted!', '');
  }

  refreshData() {
    console.log('selectedEvent', this.selectedEvent);

    if (this.selectedEvent === null) {
      return;
    }

    const eventId = this.selectedEvent.id;
    console.log('refreshing eventId', eventId);

    this.loadBracket(eventId);
    this.loadDraws(eventId);
  }

  filterGames(draw_id) {
    if (!this.games) {
      return [];
    }
    return this.games.filter(e => e.draw_id === draw_id);
  }

  convertKeyToLabel(key) {
    return this.keyToLabel[key];
  }

  setHomepageDefaultEvent() {
    console.log('dataSource', this.dataSource);
    console.log('selection', this.selection);

    if (this.selection.selected.length !== 1) {
      this.notificationService.showError('You must select a single Event', '');
      return;
    }
    const eventId = this.selection.selected[0].id;
    this.notificationService.showSuccess(`Event ID ${eventId} is set to the default Homepage`, '');
    this.selection.clear();
  }

  setSelectedEvent(event) {
    this.selectedEvent = event;
  }
}
