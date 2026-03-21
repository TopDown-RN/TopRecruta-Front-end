import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { EditUserComponent } from './pages/users/edit-user/edit-user.component';
import { LoginComponent } from './pages/login/login.component';
import { ListUserComponent } from './pages/users/list-user/list-user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: ListUserComponent, canActivate: [authGuard] },
  { path: 'users/create', component: CreateUserComponent, canActivate: [authGuard] },
  { path: 'users/edit/:id', component: EditUserComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
