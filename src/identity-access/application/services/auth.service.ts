import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, KidWayRole, RegisterRequest } from '../../domain/models/auth-user.model';

const USER_STORAGE_KEY = 'kidway.auth.user';
const TOKEN_STORAGE_KEY = 'kidway.auth.token';

const BILLING_ROLES = new Set<KidWayRole>(['Independent Operator', 'Company Admin', 'KidWay Administrator']);

type BackendAuthResponse = {
  token: string;
  tokenType: string;
  user: Partial<AuthUser> & Record<string, unknown>;
  allowedModules: string[];
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authEndpoint = `${environment.apiBaseUrl}/auth`;

  private readonly userSignal = signal<AuthUser | null>(this.readStoredUser());
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly currentRole = computed(() => this.currentUser()?.role ?? null);
  readonly initials = computed(() => this.currentUser()?.avatarInitials ?? 'KW');

  login(identifier: string, password: string): Observable<boolean> {
    return this.http
      .post<BackendAuthResponse>(`${this.authEndpoint}/sign-in`, {
        usernameOrEmail: identifier.trim(),
        password
      })
      .pipe(
        tap((response) => this.setSession(this.normalizeUser(response.user), response.token)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  registerMock(request: RegisterRequest): Observable<AuthUser> {
    return this.http
      .post<BackendAuthResponse>(`${this.authEndpoint}/sign-up`, {
        ...request,
        repeatPassword: request.password
      })
      .pipe(
        map((response) => this.normalizeUser(response.user)),
        catchError(() => of(this.pendingUserFromRequest(request)))
      );
  }

  sendRecovery(usernameOrEmail: string): Observable<boolean> {
    return this.http
      .post(`${this.authEndpoint}/forgot-access`, { usernameOrEmail })
      .pipe(
        map(() => true),
        catchError(() => of(true))
      );
  }

  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  canAccessBilling(): boolean {
    const role = this.currentRole();
    return role ? BILLING_ROLES.has(role) : false;
  }

  hasAnyRole(allowedRoles: KidWayRole[] | undefined): boolean {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
    const role = this.currentRole();
    return Boolean(role && allowedRoles.includes(role));
  }

  token(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private setSession(user: AuthUser, token: string): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    this.userSignal.set(user);
  }

  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }
  }

  private normalizeUser(user: Partial<AuthUser> & Record<string, unknown>): AuthUser {
    const firstName = String(user.firstName ?? 'KidWay');
    const lastName = String(user.lastName ?? 'User');
    const role = this.normalizeRole(String(user.role ?? 'Parent / Guardian'));
    const accountStatus = this.normalizeStatus(String(user.accountStatus ?? 'active'));

    return {
      id: String(user.id ?? `usr-${Date.now()}`),
      firstName,
      lastName,
      displayName: String(user.displayName ?? `${firstName} ${lastName}`),
      username: String(user.username ?? ''),
      email: String(user.email ?? ''),
      phone: String(user.phone ?? ''),
      country: String(user.country ?? 'Peru'),
      role,
      company: String(user.company ?? 'KidWay'),
      avatarInitials: String(user.avatarInitials ?? this.buildInitials(firstName, lastName)),
      accountStatus
    };
  }

  private pendingUserFromRequest(request: RegisterRequest): AuthUser {
    const displayName = `${request.firstName} ${request.lastName}`.trim();
    return {
      id: `usr-pending-${Date.now()}`,
      firstName: request.firstName,
      lastName: request.lastName,
      displayName,
      username: request.username,
      email: request.email,
      phone: request.phone,
      country: request.country,
      role: 'Parent / Guardian',
      company: 'Pending account validation',
      avatarInitials: this.buildInitials(request.firstName, request.lastName),
      accountStatus: 'pending'
    };
  }

  private normalizeRole(value: string): KidWayRole {
    const allowed: KidWayRole[] = [
      'Parent / Guardian',
      'Company Driver',
      'Independent Operator',
      'Company Admin',
      'KidWay Administrator'
    ];
    return allowed.includes(value as KidWayRole) ? (value as KidWayRole) : 'Parent / Guardian';
  }

  private normalizeStatus(value: string): AuthUser['accountStatus'] {
    if (value === 'suspended') return 'suspended';
    if (value === 'pending' || value === 'pending-validation') return 'pending';
    return 'active';
  }

  private buildInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
