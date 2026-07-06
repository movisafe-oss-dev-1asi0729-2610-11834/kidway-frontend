import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../application/services/auth.service';

@Component({
  selector: 'kw-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule, TranslateModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showRecovery = signal(false);
  protected readonly recoverySent = signal(false);
  protected readonly loginError = signal<string | null>(null);

  protected readonly loginForm = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });

  protected readonly recoveryForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected readonly demoAccounts = [
    { role: 'Company Admin', username: 'maria.lopez', password: 'KidWay123$' },
    { role: 'Parent / Guardian', username: 'juan.ruiz', password: 'Parent123$' },
    { role: 'Independent Operator', username: 'carlos.perez', password: 'Driver123$' },
    { role: 'KidWay Administrator', username: 'admin.kidway', password: 'Admin123$' }
  ];

  protected submit(): void {
    this.loginError.set(null);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError.set('identityAccess.login.validation');
      return;
    }

    const { identifier, password } = this.loginForm.getRawValue();
    this.loading.set(true);

    this.auth.login(identifier, password).subscribe({
      next: (ok) => {
        this.loading.set(false);
        if (!ok) {
          this.loginError.set('identityAccess.login.invalid');
          return;
        }
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/app/home';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading.set(false);
        this.loginError.set('identityAccess.login.invalid');
      }
    });
  }

  protected fillDemo(username: string, password: string): void {
    this.loginForm.patchValue({ identifier: username, password });
  }

  protected sendRecovery(): void {
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }
    this.recoverySent.set(true);
  }
}
