import { Routes } from '@angular/router';
import {UnderDevelopmentPageComponent} from "../../shared/presentation/pages/under-development/under-development-page.component";

export const ATTENDANCE_ROUTES: Routes = [
    {
        path: '',
        component: UnderDevelopmentPageComponent,
        data: { titleKey: 'nav.companies', boundedContext: 'Company Management', icon: 'business' }
    }
];
