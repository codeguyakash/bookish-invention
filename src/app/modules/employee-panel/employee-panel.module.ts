import { SmartSearch } from './smart-search/smart-search.component';
import { SolDesignListPanel } from './lead-list-soldesign/lead-list-soldesign.component';
import { SurveyorListPanel } from './lead-list-surveyor/lead-list-surveyor.component';
import { LuminousSurveyorDirective } from './lead-list-surveyor/surveyor.directive';
import { OpsHeadListPanel } from './lead-list-opshead/lead-list-opshead.component';
import { PartnerListPanel } from './lead-list-partner/lead-list-partner.component';
import { FinanceListPanel } from './lead-list-finance/lead-list-finance.component';
import { AfterSalesListPanel } from './lead-list-aftersales/lead-list-aftersales.component';
import { AdminPanel } from './admin-panel/admin-panel.component';
import { FollowupComponent } from './followup/followup.component';
import { ProjectManagerPanel } from './project-manager/project-manager.component';
import { ProjectManagerViewPanel } from './project-manager-view/project-manager-view.component';
import { AuditorPanel } from './auditor/auditor.component';
import { Marketing } from './marketing/marketing.component';
import { CalendarModule, ConfirmationService, ConfirmDialogModule, DialogModule, OverlayPanelModule, SidebarModule } from 'primeng/primeng';
import { SelectModule } from 'ng-select';
import { LeadListService } from './services/lead-list.service';
import { ProjectManagementService } from './services/project-management.services'
import { MessageModule } from '../message/message.module';
import { PanelModule } from 'primeng/primeng';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FileUploadModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UnderscoreRemove } from './../../Pipes/underscore.pipe';
import { SafeHtmlPipe } from './../../Pipes/html-sanitizer.pipe';
import { NgxEditorModule } from 'ngx-editor';
//import { ImageCropperModule } from 'ngx-image-cropper';
import { DroppableModule } from '@ctrl/ngx-droppable';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { IndianCurrency } from '../IndianCurrency.pipe';
import { QuillModule } from 'ngx-quill';
import { LeadListSupplyOrder } from './lead-list-supply-order/lead-list-supply-order.component';
import { SupplyOrderHandOff } from './lead-list-supply-order/supply-order-handoff/supply-order-handoff.component';
import { FinanceListPanelNew } from './lead-list-finance-new/lead-list-finance-new.component';
import { LeadSource } from './admin-panel/components/lead-sorce/lead-source.component';
@NgModule({
    declarations: [
        SmartSearch,
        LuminousSurveyorDirective,
        SurveyorListPanel,
        SolDesignListPanel,
        OpsHeadListPanel,
        PartnerListPanel,
        FinanceListPanel,
        FinanceListPanelNew,
        AfterSalesListPanel,
        Marketing,
        UnderscoreRemove,
        SafeHtmlPipe,
        AdminPanel,
        FollowupComponent,
        ProjectManagerPanel,
        ProjectManagerViewPanel,
        AuditorPanel,
        IndianCurrency,
        LeadListSupplyOrder,
        SupplyOrderHandOff,
        LeadSource
    ],
    exports: [
        SmartSearch,
        LuminousSurveyorDirective,
        SurveyorListPanel,
        SolDesignListPanel,
        OpsHeadListPanel,
        PartnerListPanel,
        FinanceListPanel,
        FinanceListPanelNew,
        AfterSalesListPanel,
        UnderscoreRemove,
        SafeHtmlPipe,
        AdminPanel,
        FollowupComponent,
        ProjectManagerPanel,
        ProjectManagerViewPanel,
        AuditorPanel,
        IndianCurrency,

    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        CalendarModule,
        OverlayPanelModule,
        ConfirmDialogModule,
        DialogModule,
        MessageModule,
        SelectModule,
        PanelModule,
        FileUploadModule,
        NgxEditorModule,
        //ImageCropperModule,
        DroppableModule,
        ScrollToModule.forRoot(),
        QuillModule.forRoot({
            modules: {
              syntax: false,
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean'],                                         // remove formatting button
              ]
            }
        })
    ],
    providers: [
        LeadListService,
        ProjectManagementService,
        ConfirmationService
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class employeePanelModule { }
