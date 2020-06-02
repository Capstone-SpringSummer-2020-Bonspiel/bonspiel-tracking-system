import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitorComponent } from './modules/visitor/components/visitor/visitor.component';
import { AdminComponent } from './modules/admin/components/admin/admin.component';
import { DashboardComponent } from './modules/admin/components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';



const routes: Routes = [
  { path: '', component: VisitorComponent },
  { path: 'home', component: VisitorComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
  //{ path: 'schedule', component: ScheduleComponent },
  //{ path: 'teamlist', component: TeamlistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
