import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateBracketComponent } from './components/create-bracket/create-bracket.component';
import { CreateCurlerComponent } from './components/create-curler/create-curler.component';
import { CreateDrawComponent } from './components/create-draw/create-draw.component';
import { CreateEndscoreComponent } from './components/create-endscore/create-endscore.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { CreatePoolComponent } from './components/create-pool/create-pool.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { AddTeamToEventComponent } from './components/add-team-to-event/add-team-to-event.component';
import { EditBracketComponent } from './components/edit-bracket/edit-bracket.component';
import { EditCurlerComponent } from './components/edit-curler/edit-curler.component';
import { EditDrawComponent } from './components/edit-draw/edit-draw.component';
import { EditEndscoreComponent } from './components/edit-endscore/edit-endscore.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { EditGameComponent } from './components/edit-game/edit-game.component';
import { EditOrganizationComponent } from './components/edit-organization/edit-organization.component';
import { EditPoolComponent } from './components/edit-pool/edit-pool.component';
import { EditTeamComponent } from './components/edit-team/edit-team.component';
import { RemoveBracketComponent } from './components/remove-bracket/remove-bracket.component';
import { RemoveCurlerComponent } from './components/remove-curler/remove-curler.component';
import { RemoveDrawComponent } from './components/remove-draw/remove-draw.component';
import { RemoveEndscoreComponent } from './components/remove-endscore/remove-endscore.component';
import { RemoveEventComponent } from './components/remove-event/remove-event.component';
import { RemoveGameComponent } from './components/remove-game/remove-game.component';
import { RemoveOrganizationComponent } from './components/remove-organization/remove-organization.component';
import { RemovePoolComponent } from './components/remove-pool/remove-pool.component';
import { RemoveTeamComponent } from './components/remove-team/remove-team.component';
import { RemoveTeamFromEventComponent } from './components/remove-team-from-event/remove-team-from-event.component';

import { AuthGuard } from '@core/_helpers';
import { PasswordComponent } from './components/password/password.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { InstructionalsComponent } from './components/instructionals/instructionals.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { SetDefaultEventComponent } from './components/set-default-event/set-default-event.component';

const UsersModule = () => import('./components/users/users.module').then(x => x.UsersModule);

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent, data: { reuse: false } },
      { path: 'file-upload', component: FileUploadComponent },
      { path: 'create-bracket', component: CreateBracketComponent },
      { path: 'create-curler', component: CreateCurlerComponent },
      { path: 'create-draw', component: CreateDrawComponent },
      { path: 'create-endscore', component: CreateEndscoreComponent },
      { path: 'create-event', component: CreateEventComponent },
      { path: 'create-game', component: CreateGameComponent },
      { path: 'create-organization', component: CreateOrganizationComponent },
      { path: 'create-pool', component: CreatePoolComponent },
      { path: 'create-team', component: CreateTeamComponent },
      { path: 'add-team-to-event', component: AddTeamToEventComponent },
      { path: 'edit-bracket', component: EditBracketComponent },
      { path: 'edit-curler', component: EditCurlerComponent },
      { path: 'edit-draw', component: EditDrawComponent },
      { path: 'edit-endscore', component: EditEndscoreComponent },
      { path: 'edit-event', component: EditEventComponent },
      { path: 'edit-game', component: EditGameComponent },
      { path: 'edit-organization', component: EditOrganizationComponent },
      { path: 'edit-pool', component: EditPoolComponent },
      { path: 'edit-team', component: EditTeamComponent },
      { path: 'remove-bracket', component: RemoveBracketComponent },
      { path: 'remove-curler', component: RemoveCurlerComponent },
      { path: 'remove-draw', component: RemoveDrawComponent },
      { path: 'remove-endscore', component: RemoveEndscoreComponent },
      { path: 'remove-event', component: RemoveEventComponent },
      { path: 'remove-game', component: RemoveGameComponent },
      { path: 'remove-organization', component: RemoveOrganizationComponent },
      { path: 'remove-pool', component: RemovePoolComponent },
      { path: 'remove-team', component: RemoveTeamComponent },
      { path: 'remove-team-from-event', component: RemoveTeamFromEventComponent },
      { path: 'users', loadChildren: UsersModule, canActivate: [AuthGuard] },
      { path: 'password', component: PasswordComponent },
      { path: 'instructionals', component: InstructionalsComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: 'set-default-event', component: SetDefaultEventComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
