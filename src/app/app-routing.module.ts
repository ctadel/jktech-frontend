import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard, authGuard, antiAuthGuard } from './_guards/auth.guard';

import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';

const routes: Routes = [
  { path: 'explore', component: HomeComponent },
  { path: 'auth', component: AuthComponent, canActivate:[antiAuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate:[authGuard]},
  { path: 'conversations', component: BoardUserComponent, canActivate:[authGuard]},
  { path: 'admin', component: BoardAdminComponent, canActivate:[authGuard, adminGuard]},
  { path: '', redirectTo: 'explore', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
