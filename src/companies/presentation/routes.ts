import { Routes } from '@angular/router';
import { CompanyManagementViewComponent } from './views/company-management-view.component';

export const COMPANIES_ROUTES: Routes = [
  {
    path: '',
    component: CompanyManagementViewComponent
  }
];
