import { Routes } from '@angular/router';
import { IncidentViewComponent } from './views/incident-view.component';

export const INCIDENTS_ROUTES: Routes = [
  {
    path: '',
    component: IncidentViewComponent,
    data: { titleKey: 'nav.incidents', boundedContext: 'Incident Management', icon: 'report_problem' }
  }
];