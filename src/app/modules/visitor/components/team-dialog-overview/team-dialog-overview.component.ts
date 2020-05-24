import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-team-dialog-overview',
  templateUrl: './team-dialog-overview.component.html',
  styleUrls: ['./team-dialog-overview.component.scss'],
})
export class TeamDialogOverviewComponent implements OnInit {
  constructor(private spinner: SpinnerService) {}

  ngOnInit(): void {}
}
