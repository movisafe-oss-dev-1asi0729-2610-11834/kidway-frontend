import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'kw-auth-placeholder',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <section class="auth-card">
      <img src="assets/images/kidway-shield.png" alt="KidWay logo" />
      <h1>{{ titleKey | translate }}</h1>
      <p>{{ 'auth.subtitle' | translate }}</p>
    </section>
  `,
  styles: [
    `.auth-card{min-height:100vh;display:grid;place-items:center;text-align:center;padding:32px;background:linear-gradient(135deg,#e4f3fb,#fff4d8)}img{width:96px;border-radius:28px;background:#fff;padding:10px;box-shadow:var(--kw-shadow)}h1{margin:24px 0 8px;font-size:clamp(2.4rem,5vw,4rem)}p{max-width:560px;color:var(--kw-muted);font-size:1.08rem}`
  ]
})
export class AuthPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  readonly titleKey = this.route.snapshot.data['titleKey'] ?? 'auth.login';
}
