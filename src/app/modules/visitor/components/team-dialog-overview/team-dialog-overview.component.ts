import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-team-dialog-overview',
  templateUrl: './team-dialog-overview.component.html',
  styleUrls: ['./team-dialog-overview.component.scss'],
})
export class TeamDialogOverviewComponent implements OnInit {
  teamId: any;
  team: any;
  teamName: any;

  constructor(
    private apiService: ApiService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<TeamDialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.teamId = data;
    console.log(this.teamId);
  }

  ngOnInit(): void {
    this.spinnerService.on();
    this.apiService.getTeams(this.teamId).subscribe((res: any) => {
      this.team = res;
      console.log('team');
      console.log(this.team);
      if (this.team.length >= 1) {
        this.teamName = this.team[0].curlingteam_name;
      }
      this.spinnerService.off();
    });
  }
}
