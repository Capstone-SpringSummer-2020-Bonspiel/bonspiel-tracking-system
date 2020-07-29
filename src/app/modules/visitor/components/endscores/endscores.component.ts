import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TeamDialogOverviewComponent } from '@app/modules/visitor/components/team-dialog-overview/team-dialog-overview.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-endscores',
  templateUrl: './endscores.component.html',
  styleUrls: ['./endscores.component.scss'],
})
export class EndscoresComponent implements OnInit, OnChanges {
  @Input() displayedColumns: string[];
  columnsToDisplay: string[] = [];
  @Input() data;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // console.log(this.data);
  }

  ngOnChanges() {
    this.columnsToDisplay = this.displayedColumns.slice();

    // console.log('ON CHANGES!');
    // console.log('displayedColumns', this.displayedColumns);
    // console.log('columnsToDisplay', this.columnsToDisplay);
    // console.log('data', this.data);
  }

  openDialog(teamId): void {
    const dialogRef = this.dialog.open(TeamDialogOverviewComponent, {
      width: 'auto',
      data: teamId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }
}
