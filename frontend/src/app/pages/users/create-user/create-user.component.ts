import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent {
  private readonly router = inject(Router);

  onSaved(): void {
    void this.router.navigate(['/users']);
  }
}
