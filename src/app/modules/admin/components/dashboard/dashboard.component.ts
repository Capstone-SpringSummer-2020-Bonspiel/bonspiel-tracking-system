import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '@app/core/api/api.service';
import { Timestamp } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SpinnerService } from '@app/shared/services/spinner.service';

export interface Organization {
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
})
export class DashboardComponent implements OnInit {
  bigChart = [];
  cards = [];
  pieChart = [];

  columns = [
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
      name: 'info',
      header: 'Info',
    },
    {
      name: 'completed',
      header: 'Status',
    },
    {
      name: 'start_date',
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
    status: 'Status',
    start_date: 'Start Date',
    end_date: 'End Date',
  };
  displayedColumns: string[] = this.columns.map((e) => e.name);
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dashboardService: DashboardService,
    private api: ApiService,
    private spinner: SpinnerService
  ) {}

  ngOnInit() {
    this.api.testSQL().subscribe((data: any) => {
      console.log('test sql:');
      console.log(data);

      this.dataSource = new MatTableDataSource<Organization>(data.rows);
    });

    this.bigChart = this.dashboardService.bigChart();
    this.cards = this.dashboardService.cards();
    this.pieChart = this.dashboardService.pieChart();

    this.dataSource.paginator = this.paginator;
  }
}
