import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { DashboardService } from 'src/app/modules/admin/dashboard.service';

// import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
// import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './components/widgets/area/area.component';
import { CardComponent } from './components/widgets/card/card.component';
import { PieComponent } from './components/widgets/pie/pie.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    HighchartsChartModule,
  ],
  providers: [DashboardService],
})
export class AdminModule {}
