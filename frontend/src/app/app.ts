import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { ToastComponent, ToastService } from 'ngx-toast-lib';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styles: [],
})
export class App {
  protected readonly title = signal('front-end');
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoginRoute = signal(false);

  constructor() {
    this.isLoginRoute.set(this.router.url.startsWith('/login'));
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        this.isLoginRoute.set(e.urlAfterRedirects.startsWith('/login'));
      });
  }

  logout(): void {
    this.auth.logout();
    this.toastService.add({
      title: 'Até a próxima!',
      message: 'Você foi desconectado...',
      type: 'custom',
      icon: 'lucide:log-out',
      iconColor: 'text-white',
      bgColor: 'bg-[#3C7588]',
      duration: 1500,
    });
    this.router.navigate(['/login']);
  }
}