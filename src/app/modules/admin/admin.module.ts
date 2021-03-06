import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from './dashboard.service';

import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';

import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './components/widgets/area/area.component';
import { CardComponent } from './components/widgets/card/card.component';
import { PieComponent } from './components/widgets/pie/pie.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component'
import { CreateDrawComponent } from './components/create-draw/create-draw.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { CreateBracketComponent } from './components/create-bracket/create-bracket.component';
import { CreatePoolComponent } from './components/create-pool/create-pool.component';
import { CreateCurlerComponent } from './components/create-curler/create-curler.component';
import { CreateEndscoreComponent } from './components/create-endscore/create-endscore.component';
import { AddTeamToEventComponent } from './components/add-team-to-event/add-team-to-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { EditDrawComponent } from './components/edit-draw/edit-draw.component';
import { EditGameComponent } from './components/edit-game/edit-game.component';
import { EditBracketComponent } from './components/edit-bracket/edit-bracket.component';
import { EditPoolComponent } from './components/edit-pool/edit-pool.component';
import { EditEndscoreComponent } from './components/edit-endscore/edit-endscore.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { EditOrganizationComponent } from './components/edit-organization/edit-organization.component';
import { EditCurlerComponent } from './components/edit-curler/edit-curler.component';
import { RemoveEventComponent } from './components/remove-event/remove-event.component';
import { RemoveDrawComponent } from './components/remove-draw/remove-draw.component';
import { RemoveGameComponent } from './components/remove-game/remove-game.component';
import { RemoveTeamFromEventComponent } from './components/remove-team-from-event/remove-team-from-event.component';
import { RemoveTeamComponent } from './components/remove-team/remove-team.component';
import { RemoveCurlerComponent } from './components/remove-curler/remove-curler.component';
import { RemoveOrganizationComponent } from './components/remove-organization/remove-organization.component';
import { RemoveEndscoreComponent } from './components/remove-endscore/remove-endscore.component';
import { RemovePoolComponent } from './components/remove-pool/remove-pool.component';
import { RemoveBracketComponent } from './components/remove-bracket/remove-bracket.component';

import { AdminRoutingModule } from './admin-routing.module';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { TournamentBracketComponent } from './components/tournament-bracket/tournament-bracket.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PasswordComponent } from './components/password/password.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { InstructionalsComponent } from './components/instructionals/instructionals.component';
import { FaqsComponent } from './components/faqs/faqs.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SetDefaultEventComponent } from './components/set-default-event/set-default-event.component';

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
    CreateBracketComponent,
    CreatePoolComponent,
    CreateDrawComponent,
    CreateCurlerComponent,
    CreateEndscoreComponent,
    CreateOrganizationComponent,
    AddTeamToEventComponent,
    EditGameComponent,
    EditEventComponent,
    EditBracketComponent,
    EditPoolComponent,
    EditDrawComponent,
    EditEndscoreComponent,
    EditTeamComponent,
    EditOrganizationComponent,
    EditCurlerComponent,
    RemoveTeamFromEventComponent,
    RemoveTeamComponent,
    RemoveCurlerComponent,
    RemoveOrganizationComponent,
    RemoveGameComponent,
    RemoveEndscoreComponent,
    RemoveDrawComponent,
    RemovePoolComponent,
    RemoveBracketComponent,
    RemoveEventComponent,
    CreateEventComponent,
    CreateGameComponent,
    CreateTeamComponent,
    TournamentBracketComponent,
    PasswordComponent,
    FileUploadComponent,
    InstructionalsComponent,
    FaqsComponent,
    SetDefaultEventComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatRippleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    HighchartsChartModule,
    MatStepperModule,
    MatFormFieldModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    NgxChartsModule,
    NgxGraphModule,
    // BrowserModule,
    FormsModule,
    PdfViewerModule
  ],
  providers: [DashboardService],
  bootstrap: [InstructionalsComponent, FaqsComponent]

})
export class AdminModule { }
