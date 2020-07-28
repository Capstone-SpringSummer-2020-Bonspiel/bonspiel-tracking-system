import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TeamDialogOverviewComponent } from '@app/modules/visitor/components/team-dialog-overview/team-dialog-overview.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-endscores',
  templateUrl: './endscores.component.html',
  styleUrls: ['./endscores.component.scss']
})
export class EndscoresComponent implements OnInit, OnChanges {
  @Input() displayedColumns: string[];
  columnsToDisplay: string[] = [];
  @Input() data;

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  ngOnChanges() {
    this.columnsToDisplay = this.displayedColumns.slice();

    // console.log('ON CHANGES!');
    // console.log('displayedColumns', this.displayedColumns);
    // console.log('columnsToDisplay', this.columnsToDisplay);
    // console.log('data', this.data);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(TeamDialogOverviewComponent, {
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
    });
  }
}
