import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [UserFormComponent],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  user: User | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/users']);
      return;
    }

    const found = this.usersService.getUserById(id);
    if (!found) {
      void this.router.navigate(['/users']);
      return;
    }

    this.user = found;
  }

  onSaved(): void {
    void this.router.navigate(['/users']);
  }
}
