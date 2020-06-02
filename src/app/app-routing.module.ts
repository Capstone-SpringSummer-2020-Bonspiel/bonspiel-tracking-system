import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitorComponent } from './modules/visitor/components/visitor/visitor.component';
import { ScheduleComponent } from './modules/visitor/components/schedule/schedule.component';
import { TeamlistComponent } from './modules/visitor/components/teamlist/teamlist.component';
import { MobileViewComponent } from './modules/visitor/components/mobile-view/mobile-view.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';




const routes: Routes = [
  { path: '', component: VisitorComponent },
  { path: 'home', component: VisitorComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'teamlist', component: TeamlistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
