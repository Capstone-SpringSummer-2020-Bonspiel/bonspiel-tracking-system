import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from './dashboard.service';

import { RouterModule } from '@angular/router';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './components/widgets/area/area.component';
import { CardComponent } from './components/widgets/card/card.component';
import { PieComponent } from './components/widgets/pie/pie.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { CreateCurlingTeamComponent } from './components/create-curling-team/create-curling-team.component';
import { CreateCurlingEventComponent } from './components/create-curling-event/create-curling-event.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { AddDrawComponent } from './components/add-draw/add-draw.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    CreateOrganizationComponent,
    CreateCurlingTeamComponent,
    CreateCurlingEventComponent,
    AddDrawComponent,
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
    MatStepperModule,
    MatFormFieldModule,
    BrowserModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTabsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
  ],
  providers: [DashboardService],
})
export class AdminModule {}
