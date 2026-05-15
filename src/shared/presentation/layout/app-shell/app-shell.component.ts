import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { SidebarStateService } from '../../../application/state/sidebar-state.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
    selector: 'kw-app-shell',
    standalone: true,
    imports: [RouterOutlet, NgClass, SidebarComponent, TopbarComponent],
    templateUrl: './app-shell.component.html',
    styleUrl: './app-shell.component.css'
})
export class AppShellComponent {
    protected readonly sidebarState = inject(SidebarStateService);
}