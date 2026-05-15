import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from '../shared/application/services/language.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: '<router-outlet />'
})
export class AppComponent implements OnInit {
    private readonly languageService = inject(LanguageService);

    ngOnInit(): void {
        this.languageService.initialize();
    }
}