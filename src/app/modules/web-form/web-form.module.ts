import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule, DialogModule } from 'primeng/primeng';
import { SelectModule } from 'ng-select';
import { MessageModule } from '../message/message.module';
import { employeePanelModule } from '../employee-panel/employee-panel.module';
import { DroppableModule } from '@ctrl/ngx-droppable';
import { PanelModule } from 'primeng/primeng';
import { OngoingApproval } from './ongoing-approval/ongoing-approval.component';
import { SspPaymentApproval } from './ssp-payment-aproval/ssp-payment-approval.component';
import { FinanceSspDetails } from './finance-ssp-details/finance-ssp-details.component';
import { WebFormLogin } from './web-form-login/webform-login.component';
import { WebFormAuthGuard } from 'app/guard/webform.guard';
import { OpsHeadApproval } from './ops-head-approval/ops-head-approval.component';


@NgModule({
    declarations: [
        OngoingApproval,
        SspPaymentApproval,
        FinanceSspDetails,
        OpsHeadApproval,
        WebFormLogin
    ],
    exports: [
        
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        CalendarModule,
        SelectModule,
        MessageModule,
        employeePanelModule,
        DroppableModule,
        PanelModule,
        DialogModule
    ],
    providers: [
       WebFormAuthGuard
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class WebformModule {}
