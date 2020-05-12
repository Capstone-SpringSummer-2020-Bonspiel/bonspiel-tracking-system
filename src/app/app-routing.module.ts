import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitorComponent } from './modules/visitor/components/visitor/visitor.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '*', component: VisitorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
