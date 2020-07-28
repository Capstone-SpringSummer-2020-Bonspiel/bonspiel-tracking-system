import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { VisitorComponent } from './components/visitor/visitor.component';
import { TeamDialogOverviewComponent } from './components/team-dialog-overview/team-dialog-overview.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { TeamlistComponent } from './components/teamlist/teamlist.component';
import { YoutubeDialogComponent } from './components/youtube-dialog/youtube-dialog.component';
import { MobileViewComponent } from './components/mobile-view/mobile-view.component';

import { DesktopViewComponent } from './components/desktop-view/desktop-view.component';
import { EndscoresComponent } from './components/endscores/endscores.component';

@NgModule({
  declarations: [
    VisitorComponent,
    TeamDialogOverviewComponent,
    YoutubeDialogComponent,
    ScheduleComponent,
    TeamlistComponent,
    MobileViewComponent,
    DesktopViewComponent,
    EndscoresComponent,
  ],

  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    YouTubePlayerModule,
    MatCardModule,
    MatTooltipModule,
    MatTabsModule,
    MatSortModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
  ],
  exports: [VisitorComponent, YoutubeDialogComponent],
})
export class VisitorModule { }
