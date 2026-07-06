import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileFacadeService } from '../../application/services/user-profile-facade.service';
import { UserProfileDashboardModel } from '../../domain/models/user-profile.model';

type ProfileSection = 'profile' | 'security' | 'notifications' | 'access';
type PasswordMessageType = 'success' | 'error';

@Component({
  selector: 'kw-user-profile-page',
  standalone: true,
  imports: [DatePipe, NgClass, ReactiveFormsModule, RouterLink, MatIconModule, TranslateModule],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent {
  private readonly facade = inject(UserProfileFacadeService);
  private readonly fb = inject(FormBuilder);

  protected readonly dashboard = signal<UserProfileDashboardModel | null>(null);
  protected readonly selectedSection = signal<ProfileSection>('profile');
  protected readonly profileSaved = signal(false);
  protected readonly preferencesSaved = signal(false);
  protected readonly passwordMessage = signal<string | null>(null);
  protected readonly passwordMessageType = signal<PasswordMessageType>('success');

  protected readonly sections: { id: ProfileSection; icon: string; labelKey: string }[] = [
    { id: 'profile', icon: 'person', labelKey: 'userProfiles.sections.profile' },
    { id: 'security', icon: 'lock', labelKey: 'userProfiles.sections.security' },
    { id: 'notifications', icon: 'notifications', labelKey: 'userProfiles.sections.notifications' },
    { id: 'access', icon: 'admin_panel_settings', labelKey: 'userProfiles.sections.access' }
  ];

  protected readonly preferenceOptions = [
    {
      control: 'emailNotifications',
      titleKey: 'userProfiles.preferences.options.email.title',
      helperKey: 'userProfiles.preferences.options.email.helper'
    },
    {
      control: 'smsNotifications',
      titleKey: 'userProfiles.preferences.options.sms.title',
      helperKey: 'userProfiles.preferences.options.sms.helper'
    },
    {
      control: 'pushNotifications',
      titleKey: 'userProfiles.preferences.options.push.title',
      helperKey: 'userProfiles.preferences.options.push.helper'
    },
    {
      control: 'weeklyReports',
      titleKey: 'userProfiles.preferences.options.weekly.title',
      helperKey: 'userProfiles.preferences.options.weekly.helper'
    },
    {
      control: 'routeAlerts',
      titleKey: 'userProfiles.preferences.options.routes.title',
      helperKey: 'userProfiles.preferences.options.routes.helper'
    },
    {
      control: 'incidentAlerts',
      titleKey: 'userProfiles.preferences.options.incidents.title',
      helperKey: 'userProfiles.preferences.options.incidents.helper'
    },
    {
      control: 'marketingUpdates',
      titleKey: 'userProfiles.preferences.options.marketing.title',
      helperKey: 'userProfiles.preferences.options.marketing.helper'
    }
  ] as const;

  protected readonly profileForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    country: ['', [Validators.required]],
    city: ['', [Validators.required]],
    timezone: ['', [Validators.required]],
    preferredLanguage: ['es' as 'en' | 'es'],
    bio: ['', [Validators.maxLength(240)]]
  });

  protected readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  protected readonly preferencesForm = this.fb.nonNullable.group({
    theme: ['system' as 'system' | 'light' | 'dark'],
    emailNotifications: [true],
    smsNotifications: [true],
    pushNotifications: [true],
    weeklyReports: [true],
    routeAlerts: [true],
    incidentAlerts: [true],
    marketingUpdates: [false]
  });

  constructor() {
    this.facade
      .loadDashboard()
      .pipe(takeUntilDestroyed())
      .subscribe((dashboard) => {
        this.dashboard.set(dashboard);
        this.profileForm.patchValue({
          firstName: dashboard.profile.firstName,
          lastName: dashboard.profile.lastName,
          displayName: dashboard.profile.displayName,
          username: dashboard.profile.username,
          email: dashboard.profile.email,
          phone: dashboard.profile.phone,
          country: dashboard.profile.country,
          city: dashboard.profile.city,
          timezone: dashboard.profile.timezone,
          preferredLanguage: dashboard.profile.preferredLanguage,
          bio: dashboard.profile.bio
        });
        this.preferencesForm.patchValue(dashboard.preferences);
      });
  }

  protected selectSection(section: ProfileSection): void {
    this.selectedSection.set(section);
  }

  protected saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileSaved.set(true);
    setTimeout(() => this.profileSaved.set(false), 2600);
  }

  protected savePreferences(): void {
    this.preferencesSaved.set(true);
    setTimeout(() => this.preferencesSaved.set(false), 2600);
  }

  protected changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordMessageType.set('error');
      this.passwordMessage.set('userProfiles.security.password.invalid');
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.passwordMessageType.set('error');
      this.passwordMessage.set('userProfiles.security.password.mismatch');
      return;
    }

    this.passwordForm.reset();
    this.passwordMessageType.set('success');
    this.passwordMessage.set('userProfiles.security.password.success');
  }

  protected completionDash(value: number): string {
    const normalized = Math.max(0, Math.min(value, 100));
    return `${normalized}, 100`;
  }
}
