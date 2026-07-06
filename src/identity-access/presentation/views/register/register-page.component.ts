import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../application/services/auth.service';

@Component({
  selector: 'kw-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule, TranslateModule],
  templateUrl: './register-page.component.html',
  styleUrl: '../login/login-page.component.css'
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly registered = signal(false);
  protected readonly registerError = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  protected readonly registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    country: ['Peru', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, [Validators.requiredTrue]]
  });

  protected submit(): void {
    this.registerError.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registerError.set('identityAccess.register.validation');
      return;
    }

    const value = this.registerForm.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.registerError.set('identityAccess.register.passwordMismatch');
      return;
    }

    this.auth
      .registerMock({
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        country: value.country,
        username: value.username,
        email: value.email,
        password: value.password
      })
      .subscribe(() => this.registered.set(true));
  }
}
