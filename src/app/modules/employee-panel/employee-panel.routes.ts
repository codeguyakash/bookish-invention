import { Routes, RouterModule } from '@angular/router';
import { SurveyorListPanel } from './lead-list-surveyor/lead-list-surveyor.component';
import { SolDesignListPanel } from './lead-list-soldesign/lead-list-soldesign.component';
import { OpsHeadListPanel } from './lead-list-opshead/lead-list-opshead.component';
import { PartnerListPanel } from './lead-list-partner/lead-list-partner.component';
import { FinanceListPanel } from './lead-list-finance/lead-list-finance.component';
import { AfterSalesListPanel } from './lead-list-aftersales/lead-list-aftersales.component';
import { AdminPanel } from './admin-panel/admin-panel.component';
import { Marketing } from './marketing/marketing.component';
import { FollowupComponent } from './followup/followup.component';
import { ProjectManagerPanel } from './project-manager/project-manager.component';
import { ProjectManagerViewPanel } from './project-manager-view/project-manager-view.component';
import { AuditorPanel } from './auditor/auditor.component';
import { LeadListSupplyOrder } from './lead-list-supply-order/lead-list-supply-order.component';
import { FinanceListPanelNew } from './lead-list-finance-new/lead-list-finance-new.component';

export const SS_ROUTES: Routes = [
    { path: 'lead-list-surveyor', component: SurveyorListPanel },
    { path: 'lead-list-soldesign', component: SolDesignListPanel },
    { path: 'lead-list-opshead', component: OpsHeadListPanel },
    { path: 'lead-list-partner', component: PartnerListPanel },
    { path: 'lead-list-finance', component: FinanceListPanelNew },
    // { path: 'lead-list-finance-new', component: FinanceListPanelNew },
    { path: 'lead-list-finance-legacy', component: FinanceListPanel },
    { path: 'lead-list-aftersales', component: AfterSalesListPanel },
    { path: 'marketing', component: Marketing },
    { path: 'admin', component: AdminPanel },
    { path: 'supply-order', component: LeadListSupplyOrder },
    { path: 'followup', component: FollowupComponent,
    children: [
        {
            path: '',
            component: FollowupComponent,
        },
        {
            path: ':status',
            component: FollowupComponent,
        }]
    },
    { path: 'project-manager', component: ProjectManagerPanel },
    { path: 'project-manager-view', component: ProjectManagerViewPanel },
    { path: 'auditor', component: AuditorPanel },
]
