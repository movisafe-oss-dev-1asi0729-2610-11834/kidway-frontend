import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kw-under-development-page',
  standalone: true,
  imports: [TranslateModule, MatIconModule],
  templateUrl: './under-development-page.component.html',
  styleUrl: './under-development-page.component.css'
})
export class UnderDevelopmentPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly titleKey = this.route.snapshot.data['titleKey'] ?? 'development.status';
  readonly icon = this.route.snapshot.data['icon'] ?? 'construction';
  readonly boundedContext = this.route.snapshot.data['boundedContext'] ?? 'KidWay Module';
}
