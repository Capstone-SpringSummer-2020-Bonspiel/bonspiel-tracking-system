import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitorComponent } from './modules/visitor/components/visitor/visitor.component';
import { TeamlistComponent } from './modules/visitor/components/teamlist/teamlist.component';
import { ScheduleComponent } from './modules/visitor/components/schedule/schedule.component';
import { AdminComponent } from './modules/admin/components/admin/admin.component';
import { DashboardComponent } from './modules/admin/components/dashboard/dashboard.component';
import { CreateOrganizationComponent } from './modules/admin/components/create-organization/create-organization.component';
import { CreateCurlingEventComponent } from './modules/admin/components/create-curling-event/create-curling-event.component';
import { CreateCurlingTeamComponent } from './modules/admin/components/create-curling-team/create-curling-team.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AddTeamToEventComponent } from './modules/admin/components/add-team-to-event/add-team-to-event.component';
import { CreateBracketComponent } from './modules/admin/components/create-bracket/create-bracket.component';
import { CreateCurlerComponent } from './modules/admin/components/create-curler/create-curler.component';
import { CreateDrawComponent } from './modules/admin/components/create-draw/create-draw.component';
import { CreateEndscoreComponent } from './modules/admin/components/create-endscore/create-endscore.component';
import { CreateEventComponent } from './modules/admin/components/create-event/create-event.component';
import { CreateGameComponent } from './modules/admin/components/create-game/create-game.component';
import { CreatePoolComponent } from './modules/admin/components/create-pool/create-pool.component';
import { CreateTeamComponent } from './modules/admin/components/create-team/create-team.component';
import { EditBracketComponent } from './modules/admin/components/edit-bracket/edit-bracket.component';
import { EditCurlerComponent } from './modules/admin/components/edit-curler/edit-curler.component';
import { EditDrawComponent } from './modules/admin/components/edit-draw/edit-draw.component';
import { EditEndscoreComponent } from './modules/admin/components/edit-endscore/edit-endscore.component';
import { EditGameComponent } from './modules/admin/components/edit-game/edit-game.component';
import { EditEventComponent } from './modules/admin/components/edit-event/edit-event.component';
import { EditOrganizationComponent } from './modules/admin/components/edit-organization/edit-organization.component';
import { EditTeamComponent } from './modules/admin/components/edit-team/edit-team.component';
import { EditPoolComponent } from './modules/admin/components/edit-pool/edit-pool.component';
import { RemoveBracketComponent } from './modules/admin/components/remove-bracket/remove-bracket.component';
import { RemoveCurlerComponent } from './modules/admin/components/remove-curler/remove-curler.component';
import { RemoveDrawComponent } from './modules/admin/components/remove-draw/remove-draw.component';
import { RemoveEventComponent } from './modules/admin/components/remove-event/remove-event.component';
import { RemoveEndscoreComponent } from './modules/admin/components/remove-endscore/remove-endscore.component';
import { RemoveGameComponent } from './modules/admin/components/remove-game/remove-game.component';
import { RemoveOrganizationComponent } from './modules/admin/components/remove-organization/remove-organization.component';
import { RemovePoolComponent } from './modules/admin/components/remove-pool/remove-pool.component';
import { RemoveTeamComponent } from './modules/admin/components/remove-team/remove-team.component';
import { RemoveTeamFromEventComponent } from './modules/admin/components/remove-team-from-event/remove-team-from-event.component';



const routes: Routes = [
  { path: '', component: VisitorComponent },
  { path: 'home', component: VisitorComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'teamlist', component: TeamlistComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'create-bracket',
        component: CreateBracketComponent,
      },
      {
        path: 'create-curler',
        component: CreateCurlerComponent,
      },
      {
        path: 'create-draw',
        component: CreateDrawComponent,
      },
      {
        path: 'create-endscore',
        component: CreateEndscoreComponent,
      },
      {
        path: 'create-event',
        component: CreateEventComponent,
      },
      {
        path: 'create-game',
        component: CreateGameComponent,
      },
      {
        path: 'create-organization',
        component: CreateOrganizationComponent,
      },
      {
        path: 'create-pool',
        component: CreatePoolComponent,
      },
      {
        path: 'create-team',
        component: CreateTeamComponent,
      },
      {
        path: 'edit-bracket',
        component: EditBracketComponent,
      },
      {
        path: 'edit-curler',
        component: EditCurlerComponent,
      },
      {
        path: 'edit-draw',
        component: EditDrawComponent,
      },
      {
        path: 'edit-endscore',
        component: EditEndscoreComponent,
      },
      {
        path: 'edit-event',
        component: EditEventComponent,
      },
      {
        path: 'edit-game',
        component: EditGameComponent,
      },
      {
        path: 'edit-organization',
        component: EditOrganizationComponent,
      },
      {
        path: 'edit-pool',
        component: EditPoolComponent,
      },
      {
        path: 'edit-team',
        component: EditTeamComponent,
      },
      {
        path: 'remove-bracket',
        component: RemoveBracketComponent,
      },
      {
        path: 'remove-curler',
        component: RemoveCurlerComponent,
      },
      {
        path: 'remove-draw',
        component: RemoveDrawComponent,
      },
      {
        path: 'remove-endscore',
        component: RemoveEndscoreComponent,
      },
      {
        path: 'remove-event',
        component: RemoveEventComponent,
      },
      {
        path: 'remove-game',
        component: RemoveGameComponent,
      },
      {
        path: 'remove-organization',
        component: RemoveOrganizationComponent,
      },
      {
        path: 'remove-pool',
        component: RemovePoolComponent,
      },
      {
        path: 'remove-team',
        component: RemoveTeamComponent,
      },
      {
        path: 'remove-team-from-event',
        component: RemoveTeamFromEventComponent,
      },
    ],
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
