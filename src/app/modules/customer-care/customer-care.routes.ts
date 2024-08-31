import { Routes, RouterModule } from '@angular/router';
import { customerCareDashboard } from './dashboard/dashboard.component';
import { CustomerCareLeadPanel } from './lead-panel/lead-panel.component';
import { CCESupervisor } from './supervisor/supervisor.component';
import { CustomerCareCcePartner } from './cce-partner/cce-partner.component';


export const CC_ROUTES: Routes = [
    { path: 'dashboard', component: customerCareDashboard },
    { path: 'lead-panel', component: CustomerCareLeadPanel },
    { path: 'cce-supervisor', component: CCESupervisor },
    { path: 'lead-partner', component:CustomerCareCcePartner }
]