import { Routes, RouterModule } from '@angular/router';
import { CC_ROUTES } from '../modules/customer-care/customer-care.routes';
import { SS_ROUTES } from '../modules/employee-panel/employee-panel.routes';
import { EmployeeLoginComponent } from '../components/login/login.component';
import { ProjectmanagerTasksubmitComponent } from '../components/projectmanager-tasksubmit/projectmanager-tasksubmit.component';

import { CustomerCareLayout } from '../layout/customer-care/layout';
import { SiteSurveyorLayout } from '../layout/site-surveyor/layout';
import { FilterCareLayout } from 'app/layout/filter-Care/layout';
//import { WebForm } from 'app/components/webform/webform.component';
import { OngoingApproval } from 'app/modules/web-form/ongoing-approval/ongoing-approval.component';
import { WF_ROUTES } from 'app/modules/web-form/web-form.route';
import { WebFormLayout } from 'app/layout/webform/layout';
import { WebFormLogin } from 'app/modules/web-form/web-form-login/webform-login.component';


const routes: Routes = [
    { path: 'customer-care', component: CustomerCareLayout, children: CC_ROUTES},
    { path: 'employee-panel', component: SiteSurveyorLayout, children: SS_ROUTES},
    { path: 'employee/login', component: EmployeeLoginComponent},
    { path: 'webform', component: WebFormLayout, children: WF_ROUTES},
    { path: 'webform/login', component: WebFormLogin},
    // { path: 'ongoing-task', component: OngoingApproval},
    { path: 'project-manager-task-submit', component: ProjectmanagerTasksubmitComponent},
    { path: '', component: EmployeeLoginComponent},
    { path: '**', redirectTo: '/' }
];

export const APP_ROUTES = RouterModule.forRoot(routes);