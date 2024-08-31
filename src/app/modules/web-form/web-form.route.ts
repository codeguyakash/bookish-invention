import { Routes, RouterModule } from '@angular/router';
import { WebFormAuthGuard } from 'app/guard/webform.guard';
import { FinanceSspDetails } from './finance-ssp-details/finance-ssp-details.component';
import { OngoingApproval } from './ongoing-approval/ongoing-approval.component';
import { OpsHeadApproval } from './ops-head-approval/ops-head-approval.component';
import { SspPaymentApproval } from './ssp-payment-aproval/ssp-payment-approval.component';
import { WebFormLogin } from './web-form-login/webform-login.component';


export const WF_ROUTES: Routes = [
    { path: 'ongoing-task', component: OngoingApproval, canActivate: [WebFormAuthGuard] },
    { path: 'ssp-payment-approval', component: SspPaymentApproval, canActivate: [WebFormAuthGuard] },
    { path: 'finance-task-details', component: FinanceSspDetails, canActivate: [WebFormAuthGuard] },
    { path: 'opshead-approval', component: OpsHeadApproval, canActivate: [WebFormAuthGuard] },
]