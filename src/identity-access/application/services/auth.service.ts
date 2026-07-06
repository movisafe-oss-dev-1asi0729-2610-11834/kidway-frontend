import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthUser, IdentityUser, KidWayRole, RegisterRequest } from '../../domain/models/auth-user.model';

const STORAGE_KEY = 'kidway.auth.user';

const FALLBACK_USERS: IdentityUser[] = [
  {
    id: 'usr-company-admin-001',
    firstName: 'Maria',
    lastName: 'Lopez',
    displayName: 'Dr. Maria Lopez',
    username: 'maria.lopez',
    email: 'maria.lopez@movisafe.pe',
    phone: '+51 951 111 222',
    country: 'Peru',
    role: 'Company Admin',
    company: 'MoviSafe Transport',
    avatarInitials: 'ML',
    accountStatus: 'active',
    password: 'KidWay123$'
  },
  {
    id: 'usr-parent-001',
    firstName: 'Juan',
    lastName: 'Ruiz',
    displayName: 'Juan Ruiz',
    username: 'juan.ruiz',
    email: 'juan.ruiz@example.com',
    phone: '+51 953 333 444',
    country: 'Peru',
    role: 'Parent / Guardian',
    company: 'Guardian Account',
    avatarInitials: 'JR',
    accountStatus: 'active',
    password: 'Parent123$'
  },
  {
    id: 'usr-operator-001',
    firstName: 'Carlos',
    lastName: 'Pérez',
    displayName: 'Carlos Pérez',
    username: 'carlos.perez',
    email: 'carlos.perez@kidway.pe',
    phone: '+51 987 221 104',
    country: 'Peru',
    role: 'Independent Operator',
    company: 'Independent Transport Service',
    avatarInitials: 'CP',
    accountStatus: 'active',
    password: 'Driver123$'
  },
  {
    id: 'usr-kidway-admin-001',
    firstName: 'Ana',
    lastName: 'Torres',
    displayName: 'Ana Torres',
    username: 'admin.kidway',
    email: 'admin@kidway.pe',
    phone: '+51 900 100 200',
    country: 'Peru',
    role: 'KidWay Administrator',
    company: 'KidWay Platform',
    avatarInitials: 'AT',
    accountStatus: 'active',
    password: 'Admin123$'
  }
];

const BILLING_ROLES = new Set<KidWayRole>(['Independent Operator', 'Company Admin', 'KidWay Administrator']);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly userSignal = signal<AuthUser | null>(this.readStoredUser());
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly currentRole = computed(() => this.currentUser()?.role ?? null);
  readonly initials = computed(() => this.currentUser()?.avatarInitials ?? 'KW');

  login(identifier: string, password: string): Observable<boolean> {
    const normalized = identifier.trim().toLowerCase();

    return this.loadUsers().pipe(
      map((users) =>
        users.find(
          (user) =>
            (user.username.toLowerCase() === normalized || user.email.toLowerCase() === normalized) &&
            user.password === password &&
            user.accountStatus === 'active'
        )
      ),
      tap((identityUser) => {
        if (identityUser) {
          this.setSession(this.stripPassword(identityUser));
        }
      }),
      map(Boolean)
    );
  }

  registerMock(request: RegisterRequest): Observable<AuthUser> {
    const displayName = `${request.firstName} ${request.lastName}`.trim();
    const user: AuthUser = {
      id: `usr-mock-${Date.now()}`,
      firstName: request.firstName,
      lastName: request.lastName,
      displayName,
      username: request.username,
      email: request.email,
      phone: request.phone,
      country: request.country,
      role: 'Parent / Guardian',
      company: 'Pending review',
      avatarInitials: this.buildInitials(request.firstName, request.lastName),
      accountStatus: 'pending'
    };

    return of(user);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
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

  private loadUsers(): Observable<IdentityUser[]> {
    return this.http.get<IdentityUser[]>('/api/identityUsers').pipe(catchError(() => of(FALLBACK_USERS)));
  }

  private setSession(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  private stripPassword(user: IdentityUser): AuthUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  private buildInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
