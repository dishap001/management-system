import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './views/layout/layout.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EmployeeComponent } from './views/employee/employee.component';
import { NewLeaveComponent } from './views/new-leave/new-leave.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'leave-request', component: NewLeaveComponent },
    ],
  },
];
