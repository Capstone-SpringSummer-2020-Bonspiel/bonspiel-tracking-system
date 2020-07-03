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
import { AddDrawComponent } from './modules/admin/components/add-draw/add-draw.component';
import { DeleteDrawComponent } from './modules/admin/components/delete-draw/delete-draw.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

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
        path: 'create-organization',
        component: CreateOrganizationComponent,
      },
      {
        path: 'create-event',
        component: CreateCurlingEventComponent,
      },
      {
        path: 'create-team',
        component: CreateCurlingTeamComponent,
      },
      {
        path: 'add-draw',
        component: AddDrawComponent,
      },
      {
        path: 'delete-draw',
        component: DeleteDrawComponent,
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
export class AppRoutingModule {}
