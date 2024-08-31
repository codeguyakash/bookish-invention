import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { customerCareDashboard } from './dashboard/dashboard.component';
import { CustomerCareLeadPanel } from './lead-panel/lead-panel.component';
import { CustomerCareCcePartner } from './cce-partner/cce-partner.component';
import { CCESupervisor } from './supervisor/supervisor.component';
import { CalendarModule } from 'primeng/primeng';
import { SelectModule } from 'ng-select';

import { LeadPanelService } from './services/lead-panel.service';
import { MessageModule } from '../message/message.module';
import { employeePanelModule } from '../employee-panel/employee-panel.module';
import { DroppableModule } from '@ctrl/ngx-droppable';
import { PanelModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        customerCareDashboard,
        CustomerCareLeadPanel,
        CustomerCareCcePartner,
        CCESupervisor

    ],
    exports: [
        customerCareDashboard,
        CustomerCareLeadPanel,
        CCESupervisor
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
        PanelModule
    ],
    providers: [
        LeadPanelService,
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class customerCareModule {}
