import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'kw-profile-page', standalone: true, imports: [TranslateModule],
  template: `<section class="profile-card"><div class="avatar">ML</div><p>{{ 'profile.status' | translate }}</p><h1>{{ 'profile.title' | translate }}</h1><span>{{ 'profile.subtitle' | translate }}</span></section>`,
  styles: [`.profile-card{max-width:760px;margin:8vh auto 0;padding:44px;text-align:center;border:1px solid var(--kw-border);border-radius:30px;background:var(--kw-card);box-shadow:var(--kw-shadow)}.avatar{width:84px;height:84px;margin:0 auto 18px;border-radius:28px;display:grid;place-items:center;background:var(--kw-blue-700);color:#fff;font-weight:900;font-size:1.8rem}p{color:#8a6200;background:var(--kw-yellow-100);display:inline-flex;padding:8px 16px;border-radius:999px;font-weight:900}h1{font-size:clamp(2rem,5vw,3.5rem);margin:12px 0}span{color:var(--kw-muted);font-size:1.08rem}`]
})
export class ProfilePageComponent {}
