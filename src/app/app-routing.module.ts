import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorComponent } from './modules/visitor/components/visitor/visitor.component';
import { TeamlistComponent } from './modules/visitor/components/teamlist/teamlist.component';
import { ScheduleComponent } from './modules/visitor/components/schedule/schedule.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

import { AuthGuard } from '@core/_helpers';

const AdminModule = () => import('./modules/admin/admin.module').then(x => x.AdminModule);
const AccountModule = () => import('./modules/account/account.module').then(x => x.AccountModule);

const routes: Routes = [
  { path: '', component: VisitorComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'teamlist', component: TeamlistComponent },

  { path: 'admin', loadChildren: AdminModule, canActivate: [AuthGuard] },
  // { path: 'admin', loadChildren: AdminModule },

  { path: 'account', loadChildren: AccountModule },
  { path: 'page-not-found', component: PageNotFoundComponent },
  // { path: '**', redirectTo: '' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
