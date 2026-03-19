import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: 'users/create', component: CreateUserComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
