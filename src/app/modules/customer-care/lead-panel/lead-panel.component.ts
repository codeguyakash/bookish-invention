import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LeadPanelService } from '../services/lead-panel.service';
import { FormBuilder, FormControl, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { LEAD_PANEL_FORM } from './../../../static/static';
import { SITE_SURVEY } from './../../../static/static';
import { LeadListService } from '../../employee-panel/services/lead-list.service';
import * as globals from '../../../static/static';
import { SharedServices } from '../../../services/shared.services';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { forEach } from '@angular/router/src/utils/collection';
import * as globalV from '../../../static/global';

declare var jquery: any;
declare var $: any;


@Component({
    selector: 'cc-lead-panel',
    templateUrl: './lead-panel.component.html',
    styleUrls: ['./lead-panel.component.css']
})
export class CustomerCareLeadPanel implements OnInit {

    wrongTime: Boolean = false;
    isMobileValid: boolean = false;
    isCallRescheduleValid: boolean = false;
    isLoginEmp: boolean = false;
    userData: any = {};
    loading = false;
    // isAllTabActiveted: boolean = false;
    isData: boolean = false;
    subscription: Subscription;
    leadData: any = {};
    leadFormData: any = {};
    panelSteps: number = 0;
    rescheduleDate: Date;
    //not interested
    notInterestedRequest: FormGroup;
    isSubmitNotInterestedRequest: boolean = false;
    //today task no response
    noResponseRequest: FormGroup;
    isSubmitNoResponseRequest: boolean = false;
    //call reschedule
    callRescheduleRequest: FormGroup;
    isSubmitCallRescheduleRequest: boolean = false;
    minDate = new Date();
    minTime: Date = new Date();
    //fill form
    customerFillFormRequest: FormGroup;
    isSubmitCustomerFillFormRequest: boolean = false;
    buttonValue: number;
    //pincode related
    isEmptyData: any = [];
    pinvalue: String;
    stateCity: any;
    cityList: any;
    stateList: any;
    localityList: any;
    errMessage: any;
    isPincode: boolean = false;
    //surveyor list
    surveyorList: any;
    lead_panal_form: any = LEAD_PANEL_FORM;
    form_error_msg: any = SITE_SURVEY;
    selectSiteSurveyorFlag;
    surveyerid_value;
    surveyRequest:FormGroup;
    isSurveyFormVisible:boolean;
    site_survey:any = SITE_SURVEY;
    isSubmitSurveyRequest:boolean;
    isWaived: number = 1;
    static waivedCounter: number = 0;
    isLoading: boolean;
    sendLinkLoader: boolean;
    itemPerPage: number = 10;
    pages: number;
    totalItem: any;
    pageCount: any;
    showQueryForm: Boolean = false;
    queryRespondForm: FormGroup;
    showCceForm: String;
    queryList: any;
    isListing: string;
    isSubmitQueryUpdate: boolean;
    isLoader: boolean;
    isValid: boolean;
    paginationSubmitForm:FormGroup;
    otherPincode:boolean;
    allStates: any;
    allCities: any;
    newSurveyTime: any = [];
    hour = new Date().getHours();
    toggleOnline:boolean;
    cnfBoxForOffline:boolean;
    disableSurveyRequestSubmitButton:boolean;
    sendReachoutLoader:boolean;
    showSmartSearchComponent:Boolean=false;
    otherRemark: boolean = true;
    callingPopUp = false;
    isResedential:boolean=false;

    surveyTime:Array<any> = [
      { value: '1', label: '10:00-12:00' },
      { value: '2', label: '12:00-14:00' },
      { value: '3', label: '14:00-16:00' },
      { value: '4', label: '16:00-18:00' },
  ];
    callingError: boolean;
    callingErrorMsg: string;

    constructor(
        private route: Router,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadPanelService: LeadPanelService,
        private leadListService: LeadListService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService,
        private sharedServices: SharedServices,
    ) { }

    ngOnInit() {
        // this.rightMove();
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
        }
        this.allStatesAndCitiesData();
        // this.getLeadDetails();
        this.createNoResponseRequestForm();
        this.createCallRescheduleRequestForm();
        this.createNotInterestedRequestForm();
        this.createFllFormRequestForm();
        this.checkTimeSlot();
       // this.createPartnerForm();
    }

    // rightMove() {
    //     if (localStorage.getItem('emp_auth_key')) {
    //         this.userData = JSON.parse(localStorage.getItem('userData'));

    //         if (localStorage.getItem('role_id') == '22') {
    //             this.route.navigateByUrl('/employee-panel/lead-list-surveyor');
    //         } else if (localStorage.getItem('role_id') == '5') {
    //             this.route.navigateByUrl('/customer-care/lead-panel');
    //             this.getLeadDetails();
    //         } else if (localStorage.getItem('role_id') == '8') {
    //             this.route.navigateByUrl('/employee-panel/lead-list-soldesign');
    //         } else if (localStorage.getItem('role_id') == '17') {
    //             this.route.navigateByUrl('/employee-panel/lead-list-opshead');
    //         } else if (localStorage.getItem('role_id') == '24') {
    //             this.route.navigateByUrl('/employee-panel/lead-list-partner');
    //         } else if (localStorage.getItem('role_id') == '9') {
    //             this.route.navigateByUrl('/employee-panel/lead-list-finance');
    //         } else if (localStorage.getItem('role_id') == '2') {
    //             this.route.navigateByUrl('/employee-panel/lead-list-aftersales');
    //         } else if (localStorage.getItem('role_id') == '25') {
    //             this.route.navigateByUrl('/customer-care/cce-supervisor');
    //         } else if (localStorage.getItem('role_id') == '13') {
    //             this.route.navigateByUrl('/employee-panel/marketing');
    //         }
    //     } else {
    //         this.route.navigateByUrl('/employee/login');
    //     }
    // }

    /**
     * Create fill form
     */
    createFllFormRequestForm() {
        this.customerFillFormRequest = this.formBuilder.group({
            cceld_reference: [''],
            cceld_reference_id: [''],
            cceld_referenceremarks: [''],
            cceld_firstname: ['', Validators.compose([Validators.required])],
            cceld_middlename: [''],
            cceld_lastname: ['', Validators.compose([ Validators.required])],
            cceld_mobileno: ['', Validators.compose([Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
            cceld_alternatecntctno: ['', Validators.compose([Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
            cceld_email: ['', Validators.compose([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            cceld_address1: ['', Validators.compose([Validators.required])],
            cceld_address2: [''],
            cceld_landmark: [''],
            cceld_locality: [''],
            cceld_city: ['', Validators.compose([Validators.required])],
            cceld_other: [''],
            cceld_state: ['', Validators.compose([Validators.required])],
            cceld_stateother: [''],
            cceld_country: ['356'],
            cceld_pincode: ['', Validators.compose([Validators.required, Validators.pattern(/^\(??([0-9]{6})$/)])],
            cceld_contactperson: [''],
            cceld_contactnumber: ['', Validators.compose([Validators.pattern(/^[7-9]{1}[0-9]{9}$/)])],
            cceld_buildingtype: ['', Validators.compose([Validators.required])],
            cceld_sitetype: ['', Validators.compose([Validators.required])],
            cceld_totalfloor: ['', Validators.compose([Validators.pattern(/^[0-9]*$/)])],
            cceld_customerfloor: ['', Validators.compose([Validators.pattern(/^[0-9]*$/)])],
            cceld_isowner: ['1'],
            cceld_rentperiod: [''],
            cceld_roofright: ['1'],
            cceld_otherarea: [''],
            cceld_otherareaunit: [''],
            cceld_budget: ['', Validators.compose([Validators.pattern(/^[0-9]*$/)])],
            cceld_isfinancereq: ['1'],
            cceld_istransportfeasible: [''],
            cceld_scheduledate: [this.minDate, Validators.compose([Validators.required])],
            cceld_scheduletime: ['', Validators.compose([Validators.required])],
            cceld_motive: [''],
            cceld_avgelectricitybill: [''],
            cceld_ongridoffgrid: ['on_grid'],
            cceld_existpowersource: ['inverter'],
            cceld_backupdetail: [''],
            cceld_phasetype: ['single_phase'],
            cceld_avgpowercut: [''],
            cceld_powercutinday: [''],
            cceld_powercutinnight: [''],
            cceld_rooftype: [''],
            cceld_roofarea: [''],
            cceld_roofareaunit: [''],
            cceld_surveyerid: ['', Validators.compose([Validators.required])],
            cceld_notes: [''],
            cceld_remarks: [''],
            cceld_createdby: [this.userData.emp_id],
            cceld_lastmodifiedby: [this.userData.emp_id],
            cceld_approvedrejected: ['1'],
            cceld_leadid: [''],
            cceld_consumerid: [''],
            cceld_other_pincode: [0],
            lead_callowner_duration: ['50:00:00'],
            role_id: [''],
            button_value: [''],
            other_remark: [''],
        })
        this.getLeadRefrenceData();
        this.allStatesAndCitiesData();
        
    }

    onBuildingTypeChange(event){
        this.customerFillFormRequest
        .get('cceld_sitetype')
        .reset();
        event.target.value && event.target.value =="residential"? this.isResedential=true:this.isResedential=false;
    }

    refrenceList:Array<string> = [];
    getLeadRefrenceData(){
        this.refrenceList = [];
        let refArr = [];
        this.leadPanelService.getLeadRefrence().subscribe((data)=>{
            if(data.status == 1){
                for (let item of data.data) {
                    refArr.push({ value: String(item.lr_id), label: String(item.lr_name) });
                }
            this.refrenceList = refArr;
            }
        });
    }

    /**
     * submit consumer form request data
     */
    submitConsumerFormRequest(buttonValue: number) {
        this.checkTimeSlot();
        // return false;
        if(this.customerFillFormRequest.controls.other_remark.value != '' && buttonValue == 2){
            this.notInterestedRequest.controls.lead_id.setValue(this.leadData.lead_id);
            this.notInterestedRequest.controls.lead_callowner_notes.setValue(this.customerFillFormRequest.controls.other_remark.value);
            this.notInterestedRequest.controls.lead_callowner_remarks.setValue(this.customerFillFormRequest.controls.cceld_remarks.value);
            this.subscription = this.leadPanelService.requestConsumerNotInterested(this.notInterestedRequest.value).subscribe(data => {
                if (data.status == 1) {
                    this.customerFillFormRequest.reset();
                    this.createFllFormRequestForm();
                    this.notInterestedRequest.reset();
                    this.popupMessageService.showInfo('Your Information Submitted Successfully.', 'success');
                    //this.alertService.success('Your Information Submitted Successfully.', true);
                    //this.route.navigate(['/customer-care/lead-panel']);
                    this.panelSteps = 0;
                    // this.isAllTabActiveted = false;
                    if (this.isListing == 'inbound_query') {
                        this.showCceForm = '';
                        this.inboundQueryForm();
                    } else if(this.isListing == 'partner_listing') {
                        this.partnerQueryData(this.pages);
                    } else {
                        this.getLeadDetails();
                    }
                } else {
                    console.log('error in submit');
                    //this.inlineMessageService.showError(data.response.message, 'reg-landlord-fb');
                    this.alertService.error(data.error_message);
                }
            }, (error) => {

                this.alertService.error(JSON.parse(error.body).non_field_errors);
                this.loading = false;
            });
            return true;
        }
        if(this.customerFillFormRequest.controls.cceld_surveyerid.value=="" || this.customerFillFormRequest.controls.cceld_surveyerid.value==0){
            this.surveyerid_value=0;
        }
        else {
            this.surveyerid_value = 1;
        }
        this.selectSiteSurveyorFlag = buttonValue;
        this.isSubmitCustomerFillFormRequest = true;
        this.customerFillFormRequest.controls.cceld_leadid.setValue(this.leadData.lead_id);
        this.customerFillFormRequest.controls.cceld_consumerid.setValue(this.leadData.lead_consumerid);
        this.customerFillFormRequest.controls.button_value.setValue(buttonValue);
        this.customerFillFormRequest.controls.cceld_approvedrejected.setValue(1);
        if (this.customerFillFormRequest.controls.cceld_state.value == 0) {
            this.customerFillFormRequest.controls.cceld_state.setValue('');
        }
        if (this.customerFillFormRequest.controls.cceld_city.value == 0) {
            this.customerFillFormRequest.controls.cceld_city.setValue('');
        }
        if (this.customerFillFormRequest.controls.cceld_locality.value == 0) {
            this.customerFillFormRequest.controls.cceld_locality.setValue('');
        }

        if (this.otherPincode) {
            this.customerFillFormRequest.controls['cceld_other_pincode'].setValue(1);
        }
        if(this.customerFillFormRequest.controls.cceld_reference_id.value > 0){
            this.refrenceList.forEach(element => {
                if(element['value'] == this.customerFillFormRequest.controls.cceld_reference_id.value){
                    this.customerFillFormRequest.controls.cceld_reference.setValue(element['label']);
                }
            });
        }

        if(buttonValue === 3) {
            this.leadPanelService.requestSubmitForm(this.customerFillFormRequest.value,buttonValue).subscribe(data => {
            });
            this.isSubmitCustomerFillFormRequest = false;
            return false;
        }
        if (this.customerFillFormRequest.valid && (this.isPincode == false && (this.surveyerid_value != 0 || buttonValue == 1))) {
                    this.loading = true;
                    this.subscription = this.leadPanelService.requestSubmitForm(this.customerFillFormRequest.value,buttonValue).subscribe(data => {
                    if (data.status==1) {

                        // auto accept site surveyor
                        const checkList = {
                            cceld_scheduleTime: "",
                            cceld_scheduledate: this.minDate,
                            checklist_name: "3",
                            checklist_status: "1",
                            not_visited_reason: "",
                            project_close_reason: "",
                            project_reject_reason: "",
                            remarks: "",
                            visited_date_time: null,
                            visited_time: ""
                        }

                        this.leadListService.checklistSubmitService(data.result.project_id, checkList, true).subscribe(data => {
                            
                            
                        });
                        
                        this.alertService.success('Your Information Submitted Successfully.', true);

                        

                        this.isMobileValid = false;
                        if (buttonValue == 2) {
                            this.customerFillFormRequest.reset();
                            this.createFllFormRequestForm();
                            this.popupMessageService.showSuccess('Lead Qualified Successfully.', 'success');
                            //alert('Lead Qualified Successfully.');
                            //this.inlineMessageService.showError('Lead Qualified Successfully.');
                            this.panelSteps = 0;
                            // this.isAllTabActiveted = false;
                            if (this.isListing == 'inbound_query'){
                                this.showCceForm='';
                                this.inboundQueryForm();
                            } else if(this.isListing == 'partner_listing') {
                                this.partnerQueryData(this.pages);
                            } else{
                                this.getLeadDetails();
                            }


                        }
                        if (buttonValue == 1) {
                            this.popupMessageService.showSuccess('Lead Data Saved Successfully.', 'success');
                            //this.inlineMessageService.showError('Lead Data Saved Successfully.');
                            // alert('Lead Data Saved Successfully.');

                        }
                        this.loading = false;
                        this.isSubmitCustomerFillFormRequest = false;
                    } else {
                        this.isMobileValid = false;
                        this.inlineMessageService.showError(data.response.message);
                        this.popupMessageService.showError(data.error_message, "error")
                        this.alertService.error(data.error_message);
                        this.loading = false;
                        this.isSubmitCustomerFillFormRequest = false;
                    }
                }, (error) => {
                    this.alertService.error(JSON.parse(error.body).non_field_errors);
                    this.loading = false;
                }) ;
                }else{
                    if(this.customerFillFormRequest.controls.cceld_address1.errors && this.customerFillFormRequest.controls.cceld_address1.errors.required ||
                        this.customerFillFormRequest.controls.cceld_mobileno.errors && this.customerFillFormRequest.controls.cceld_mobileno.errors.required ||
                        this.customerFillFormRequest.controls.cceld_city.errors && this.customerFillFormRequest.controls.cceld_city.errors.required ||
                        this.customerFillFormRequest.controls.cceld_state.errors && this.customerFillFormRequest.controls.cceld_state.errors.required ||
                        this.customerFillFormRequest.controls.cceld_pincode.errors && this.customerFillFormRequest.controls.cceld_pincode.errors.required ||
                        this.customerFillFormRequest.controls.cceld_scheduledate.errors && this.customerFillFormRequest.controls.cceld_scheduledate.errors.required ||
                        this.customerFillFormRequest.controls.cceld_scheduletime.errors && this.customerFillFormRequest.controls.cceld_scheduletime.errors.required ||
                        this.surveyerid_value==0){
                            this.popupMessageService.showError("Please fill all mandatory details.", "error");
                        } else {
                            this.popupMessageService.showError("Please fill form details correctly.", "error");
                        }
                }

    }

    /**
     * Create call reschedule form
     */
    createCallRescheduleRequestForm() {
        this.callRescheduleRequest = this.formBuilder.group({
            lead_id: [''],
            lease_modifiedby: [this.userData.emp_id],
            lead_callowner_duration: ['15:00:00'],
            lead_callowner_notes: ['', [Validators.required]],
            lead_callowner_reference_id: ['', [Validators.required]],
            lead_callowner_remarks: ['', [Validators.required]],
            lead_scheduledate: [this.minDate, [Validators.required]],
            lead_scheduletime: [this.minDate, [Validators.required]]
        })
    }

    /**
     * submit call reschedule request data
     */
    submitCallRescheduleRequest() {
        
        if (localStorage.getItem('emp_auth_key')){
            this.isSubmitCallRescheduleRequest = true;
            this.callRescheduleRequest.controls.lead_id.setValue(this.leadData.lead_id)
            if (this.callRescheduleRequest.valid) {
            this.loading = true;
              let minDate = new Date();
              if(this.rescheduleDate < minDate) {
                this.wrongTime = true;
                this.loading = false;
                return;
              } else {
                this.wrongTime = false;
              }
                this.subscription = this.leadPanelService.requestCallReschedule(this.callRescheduleRequest.value).subscribe(data => {
                    if (data.status == 1) {
                        this.isSubmitCallRescheduleRequest = false;
                        this.customerFillFormRequest.reset();
                        this.createFllFormRequestForm();
                        this.callRescheduleRequest.reset();
                        this.popupMessageService.showSuccess('Your Information Submitted Successfully.', 'success')
                        //this.route.navigate(['/customer-care/lead-panel']);
                        this.isCallRescheduleValid = false;
                        this.panelSteps = 0;
                        // this.isAllTabActiveted = false;
                        if (this.isListing == 'inbound_query') {
                            this.showCceForm = '';
                            this.inboundQueryForm();
                        } else {
                            this.getLeadDetails();
                        }
                        if(this.isListing=='missedCallLogListing'){
                            this.ShowMissedCallListing(this.pages); 
                        }
                    } else {
                        this.isCallRescheduleValid = false;
                        this.popupMessageService.showError('error in submit', 'error')
                        this.alertService.error(data.error_message);
                    }
                    this.loading = false;
                }, (error) => {
                    this.isCallRescheduleValid = false;
                    this.popupMessageService.showError(JSON.parse(error.body).non_field_errors, 'error')
                    //this.alertService.error(JSON.parse(error.body).non_field_errors);
                    this.loading = false;
                });
            } else {
                this.loading = false;
                this.isCallRescheduleValid = true;
                if(this.callRescheduleRequest.controls.lead_scheduledate.errors && this.callRescheduleRequest.controls.lead_scheduledate.errors.required||
                    this.callRescheduleRequest.controls.lead_scheduletime.errors && this.callRescheduleRequest.controls.lead_scheduletime.errors.required||
                    this.callRescheduleRequest.controls.lead_callowner_remarks.errors && this.callRescheduleRequest.controls.lead_callowner_remarks.errors.required||
                    this.callRescheduleRequest.controls.lead_callowner_notes.errors && this.callRescheduleRequest.controls.lead_callowner_notes.errors.required){
                        this.popupMessageService.showError("Please fill all mandatory details.", "error");
                    } else {
                        this.popupMessageService.showError("Please fill form details correctly.", "error");
                    }
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    /**
     * Create no response form
     */
    createNoResponseRequestForm() {
        this.noResponseRequest = this.formBuilder.group({
            lead_id: [''],
            lease_modifiedby: [this.userData.emp_id],
            lead_callowner_notes:['',Validators.required],
            lead_callowner_remarks: ['',Validators.required],
            lead_callowner_reference_id: ['', [Validators.required]],

        })
    }
    

    /**
     * submit no response request data
     */
    submitNoResponseRequest() {
        this.loading = true;
        if (localStorage.getItem('emp_auth_key')){
            this.isSubmitNoResponseRequest = true;
            this.noResponseRequest.controls.lead_id.setValue(this.leadData.lead_id)
            if (this.noResponseRequest.valid) {
                this.subscription = this.leadPanelService.requestConsumerNoResponse(this.noResponseRequest.value).subscribe(data => {
                    if (data.status == 1) {
                        this.customerFillFormRequest.reset();
                        this.createFllFormRequestForm();
                        this.noResponseRequest.reset();
                        this.getLeadDetails();
                        this.popupMessageService.showSuccess('Your Information Submitted Successfully.', 'success')
                        //this.alertService.success('Your Information Submitted Successfully.', true);
                        //this.route.navigate(['/customer-care/lead-panel']);
                        this.panelSteps = 0;
                        // this.isAllTabActiveted = false;
                        if (this.isListing == 'inbound_query') {
                            this.showCceForm = '';
                            this.inboundQueryForm();
                        } else {
                            this.getLeadDetails();
                        }
                        if(this.isListing == 'missedCallLogListing'){
                            this.ShowMissedCallListing(this.pages); 
                        }
                    } else {
                        console.log('error in submit');
                        //this.inlineMessageService.showError(data.response.message, 'reg-landlord-fb');
                        this.alertService.error(data.error_message);
                    }
                    this.loading = false;
                }, (error) => {

                    this.alertService.error(JSON.parse(error.body).non_field_errors);
                    this.loading = false;
                });
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    /**
     * Create Not interested Request form
     */
    createNotInterestedRequestForm() {
        this.notInterestedRequest = this.formBuilder.group({
            lead_id: [''],
            lease_modifiedby: [this.userData.emp_id],
            lead_callowner_duration: ['15:00:00'],
            lead_callowner_notes: ['', [Validators.required]],
            lead_callowner_reference_id: ['', [Validators.required]],
            lead_callowner_remarks: ['', Validators.compose([Validators.required, Validators.pattern(/[A-Za-z]+/)])]
        })
    }

    /**
     * submit not interested request data
     */
    submitNotInterestedRequest() {
        this.loading = true;
        if (localStorage.getItem('emp_auth_key')) {
            this.isSubmitNotInterestedRequest = true;
            this.notInterestedRequest.controls.lead_id.setValue(this.leadData.lead_id)

            if (this.notInterestedRequest.valid) {
                this.subscription = this.leadPanelService.requestConsumerNotInterested(this.notInterestedRequest.value).subscribe(data => {
                    if (data.status == 1) {
                        this.customerFillFormRequest.reset();
                        this.createFllFormRequestForm();
                        this.notInterestedRequest.reset();
                        this.popupMessageService.showInfo('Your Information Submitted Successfully.', 'success');
                        //this.alertService.success('Your Information Submitted Successfully.', true);
                        //this.route.navigate(['/customer-care/lead-panel']);
                        this.panelSteps = 0;
                        // this.isAllTabActiveted = false;
                        if (this.isListing == 'inbound_query') {
                            this.showCceForm = '';
                            this.inboundQueryForm();
                        } else {
                            this.getLeadDetails();
                        }
                        if(this.isListing == 'missedCallLogListing'){
                            this.ShowMissedCallListing(this.pages); 
                        }
                    } else {
                        console.log('error in submit');
                        //this.inlineMessageService.showError(data.response.message, 'reg-landlord-fb');
                        this.alertService.error(data.error_message);
                    }
                    this.loading = false;
                }, (error) => {

                    this.alertService.error(JSON.parse(error.body).non_field_errors);
                    this.loading = false;
                });
            }else{
                if((this.notInterestedRequest.controls.lead_callowner_notes.errors&&this.notInterestedRequest.controls.lead_callowner_notes.errors.required)||
                (this.notInterestedRequest.controls.lead_callowner_remarks.errors&&this.notInterestedRequest.controls.lead_callowner_remarks.errors.required)){
                    this.popupMessageService.showError("Please fill all mandatory details.", "error");
                } else {
                    this.popupMessageService.showError("Please fill form details correctly.", "error");
                }
                this.loading = false;
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    /**
     * Get consumer lead details
     * @param
     */
    //partnerData:any;
    getLeadDetails() {
        this.leadData = '';
        this.showCceForm = '';
        this.userData = JSON.parse(localStorage.getItem('userData'));
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadPanelService.getLeadDetailsForCce(this.userData.emp_id).subscribe(data => {
                if (data.status) {
                    if(data.type=='CONSUMER'){
                        this.isListing = '';
                        this.getleadData(data);
                     }
                } else {
                    this.isLoginEmp = false;
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    getleadData(data) {
        
            this.isLoginEmp = false;
            this.leadData = data.result.data;
            if (!this.leadData.lead_id) {
                //this.isData = true;
            }
            if (this.leadData.payment_type == 'N') {
                this.leadData.payment_type = 'NEFT';
            }
            if (this.leadData.payment_type == 'R') {
                this.leadData.payment_type = 'RTGS';
            }
            if (this.leadData.payment_type == 'I') {
                this.leadData.payment_type = 'IMPS';
            }
            if (this.leadData.payment_type == 'online') {
                this.leadData.payment_type = 'Online';
            }
            if(this.leadData.payment_category){
                this.leadData.payment_category = this.leadData.payment_category.replace("_", " ");
            } else if(this.leadData.lead_iswaived == 1 && !this.leadData.payment_category) {
                this.leadData.payment_category = 'site survey(Payment Wavier)';
            }else{
                this.leadData.payment_category = 'site survey(Payment Not Done)';
            }

            if (this.leadData.payment_status == 0){
                this.leadData.payment_status = '(Payment Not Initiated)';
            } else if (this.leadData.payment_status == 1){
                this.leadData.payment_status = '(Pending)';
            } else if (this.leadData.payment_status == 2){
                this.leadData.payment_status = '(Failed)';
            } else if (this.leadData.payment_status == 3){
                this.leadData.payment_status = '(Success)';
            } else if (this.leadData.payment_status == 4){
                this.leadData.payment_status = '(Aborted)';
            }
            this.getExistingLeadsAndProjectsForNumber(this.leadData.lead_mobile,1,true);
            
            console.log(this.leadData);
            this.sharedServices.cceCurrentLeadId = this.leadData.lead_id;
        
    }

    /**
     * Get cce leaddata details
     * @param
     */
    getCceLeadDetails() {
        if (this.leadData.lead_surveydate!=null){
            if (new Date(this.leadData.lead_surveydate) < new Date()) {
                this.customerFillFormRequest.controls.cceld_scheduledate.setValue(new Date());
            } else {
                this.customerFillFormRequest.controls.cceld_scheduledate.setValue(new Date(this.leadData.lead_surveydate));
            }
        }
        this.customerFillFormRequest.controls.cceld_scheduletime.setValue(this.leadData.lead_surveytime);
        this.subscription = this.leadPanelService.getLeadDetailsForm(this.leadData.lead_id).subscribe(data => {
            if (data.status) {
                this.knowSiteSurveyor();
                this.leadFormData = data.result.data;
                if(this.leadFormData.consumer_lead == 2 || this.leadFormData.consumer_lead == 3){
                    if(this.leadFormData.cceld_scheduledate){
                        this.stateCity = this.knowYourStateCity(this.leadFormData.cceld_pincode,'form-fill');
                        this.leadFormData.cceld_scheduledate = new Date(this.leadFormData.cceld_scheduledate)
                        this.leadFormData.cceld_scheduletime = this.leadFormData.cceld_scheduletime;
                    } else {
                        if (new Date(this.leadData.lead_surveydate) < new Date()){
                            this.customerFillFormRequest.controls.cceld_scheduledate.setValue(new Date());
                        }else{
                            this.customerFillFormRequest.controls.cceld_scheduledate.setValue(new Date(this.leadData.lead_surveydate));
                        }
                        this.customerFillFormRequest.controls.cceld_scheduletime.setValue(this.leadData.lead_surveytime);

                    }

                    this.customerFillFormRequest.patchValue(this.leadFormData, { onlySelf: true });
                    this.checkTimeSlot();
                }

                if (this.leadFormData.consumer_lead == 1) {
                    //this.pinvalue = this.leadFormData.lead_pincode;
                    this.stateCity = this.knowYourStateCity(this.leadFormData.lead_pincode,'form-fill');
                    this.customerFillFormRequest.controls.cceld_firstname.setValue(this.leadFormData.lead_fname);
                    this.customerFillFormRequest.controls.cceld_middlename.setValue(this.leadFormData.lead_mname);
                    this.customerFillFormRequest.controls.cceld_lastname.setValue(this.leadFormData.lead_lname);
                    this.customerFillFormRequest.controls.cceld_mobileno.setValue(this.leadFormData.lead_mobile);
                    this.customerFillFormRequest.controls.cceld_email.setValue(this.leadFormData.lead_email);
                    this.customerFillFormRequest.controls.cceld_alternatecntctno.setValue(this.leadFormData.lead_alternatecontactno);
                    this.customerFillFormRequest.controls.cceld_address1.setValue(this.leadFormData.lead_address1);
                    this.customerFillFormRequest.controls.cceld_address2.setValue(this.leadFormData.lead_address2);
                    (this.leadFormData.lead_pincode) ? this.customerFillFormRequest.controls.cceld_pincode.setValue(this.leadFormData.lead_pincode):this.customerFillFormRequest.controls.cceld_pincode.setValue('');
                    this.customerFillFormRequest.controls.cceld_state.setValue(this.leadFormData.lead_state);
                    this.customerFillFormRequest.controls.cceld_city.setValue(this.leadFormData.lead_city);
                    this.customerFillFormRequest.controls.cceld_locality.setValue(this.leadFormData.lead_locality);
                    this.customerFillFormRequest.controls.cceld_landmark.setValue(this.leadFormData.lead_landmark);
                    this.customerFillFormRequest.controls.cceld_buildingtype.setValue(this.leadFormData.lead_buildingtype);
                }

            } else {
                this.leadFormData.cceld_scheduletime = this.leadData.lead_surveytime;
            }
        })
    }

    knowYourStateCity(searchValue: string, type?:String) {
        if (this.customerFillFormRequest.get('cceld_pincode').valid || searchValue.length == 6) {
            this.subscription = this.leadPanelService.getStateCityData(searchValue).subscribe(data => {
                if (data.status) {
                    this.isPincode = false;
                    this.otherPincode = false;
                    if(type == 'partner-form' || type=='form-fill' || type=='survey-booking' || 1==1){
                        console.log(data.data);
                        
                        this.selectedState = data.data.states_data[0].id;
                        this.cityList =  this.getCitybyState(this.selectedState);
                        setTimeout(() => {
                            this.selectedCity = data.data.district_data[0].id;
                        }, 1000);
                        
                        this.localityList = this.convertForSelect(data.data.locality_data);
                        return;
                    }else{
                        this.cityList = this.convertForSelect(data.data.district_data);
                        this.stateList = this.convertForSelect(data.data.states_data);
                        
                        this.customerFillFormRequest.controls['cceld_city'].setValue(data.data.district_data[0].id);
                        this.customerFillFormRequest.controls['cceld_state'].setValue(data.data.states_data[0].id);
                        if(type == 'survey-booking'){
                            this.surveyRequest.controls['consumer_cityid'].setValue(data.data.district_data[0].id);
                            this.surveyRequest.controls['consumer_stateid'].setValue(data.data.states_data[0].id);
                        }
                    }
                    (type)? this.removeValidators(type):'';
                } else {
                    //this.errMessage = data.error_message;
                    // this.isPincode = true;
                    this.otherPincode = true;
                    this.cityList = this.convertForSelect(this.allCities, 'city');
                    this.stateList = this.convertForSelect(this.allStates, 'state');
                    (type == 'form-fill') ? this.customerFillFormRequest.controls['cceld_city'].setValue('') : this.customerFillFormRequest.controls['cceld_city'].setValue(this.leadFormData.cceld_city);
                    (type == 'form-fill') ? this.customerFillFormRequest.controls['cceld_state'].setValue('') : this.customerFillFormRequest.controls['cceld_state'].setValue(this.leadFormData.cceld_state);
                    (type =='survey-booking') ? this.surveyRequest.controls['consumer_cityid'].setValue(''):'';
                    (type =='survey-booking') ? this.surveyRequest.controls['consumer_stateid'].setValue(''):'';
                    if(type == 'partner-form'){
                        this.partnerFillForm.controls['city'].setValue('');
                        this.partnerFillForm.controls['state'].setValue('');
                    }
                    this.putValidator(type);
                    // this.cityList = this.convertForSelect(this.isEmptyData);
                    // this.stateList = this.convertForSelect(this.isEmptyData);
                    // this.localityList = this.convertForSelect(this.isEmptyData);
                }
            })
        } else {
            if(type == 'form-fill'){
                this.customerFillFormRequest.controls['cceld_city'].setValue('');
                this.customerFillFormRequest.controls['cceld_state'].setValue('');
                this.customerFillFormRequest.controls['cceld_locality'].setValue('');
            }
            if(type =='survey-booking'){
                this.surveyRequest.controls['consumer_cityid'].setValue('');
                this.surveyRequest.controls['consumer_stateid'].setValue('');
                this.surveyRequest.controls['consumer_locality'].setValue('');
            }
            
            this.isPincode = false;
        }
    }

    putValidator(type?:String) {
        if(type == 'form-fill'){
            const cceld_locality = this.customerFillFormRequest.get('cceld_locality');
            cceld_locality.setValidators([Validators.required]);
            cceld_locality.updateValueAndValidity();
        } else if (type == 'survey-booking'){
            const consumer_locality = this.surveyRequest.get('consumer_locality');
            consumer_locality.setValidators([Validators.required]);
            consumer_locality.updateValueAndValidity();
        }
    }

    removeValidators(type?: String) {
        if (type == 'form-fill') {
            const cceld_locality = this.customerFillFormRequest.get('cceld_locality');
            cceld_locality.clearValidators();
            cceld_locality.updateValueAndValidity();
        } else if (type == 'survey-booking') {
            const consumer_locality = this.surveyRequest.get('consumer_locality');
            consumer_locality.clearValidators();
            consumer_locality.updateValueAndValidity();
        }
    }

    allStatesAndCitiesData() {
        this.subscription = this.leadPanelService.getAllStates().subscribe(data => {
            if (data.status) {
                this.allStates = data.data;
                this.stateList = this.convertForSelect(this.allStates, 'state');
            }
        });

        this.subscription = this.leadPanelService.getAllCities().subscribe(data => {
            if (data.status) {
                this.allCities = data.data;
                this.cityList = this.convertForSelect(this.allCities, 'city');
            }
        });
    }

    ifStateIfCity(type: String, formType?:String) {
        if (type == 'state') {
            if (formType == 'form-fill'){
                this.cityList = this.getCitybyState(this.customerFillFormRequest.get("cceld_state").value);
            } else if (formType == 'survey-booking'){
                this.cityList = this.getCitybyState(this.surveyRequest.get("consumer_stateid").value);
            } else if (formType == 'partner-form'){
                this.cityList =  this.getCitybyState(this.partnerFillForm.get("state").value);
            }

        } else if (type == 'city') {
            if (formType == 'form-fill') {
                this.customerFillFormRequest.controls['cceld_state'].setValue(this.setStatebyCity(this.customerFillFormRequest.get("cceld_city").value));
            } else if (formType == 'survey-booking') {
                this.surveyRequest.controls['consumer_stateid'].setValue(this.setStatebyCity(this.surveyRequest.get("consumer_cityid").value));
            } else if (formType == 'partner-form'){
                 this.partnerFillForm.controls.state.setValue(this.setStatebyCity(this.partnerFillForm.get("city").value));
             }
        }
    }

    getCitybyState(state_id: number) {
        let cityList = [];
        (this.customerFillFormRequest)?this.customerFillFormRequest.controls['cceld_city'].setValue(''):'';
        (this.surveyRequest)?this.surveyRequest.controls['consumer_cityid'].setValue(''):'';
        (this.partnerFillForm)?this.partnerFillForm.controls['city'].setValue(''):'';
        for (let item of this.allCities) {
            if (item.district_stateid == state_id)
                cityList.push({ value: String(item.district_id), label: String(item.district_name) });
        }
        return cityList;
    }

    setStatebyCity(city_id: number) {
        let cityStateId = this.allCities.find(x => x.district_id == city_id).district_stateid;
        if (cityStateId) {
            return cityStateId;
        }
        return null;
        // let stateList = [];
        // for (let item of this.allStates) {
        //     if (item.state_id == cityStateId)
        //         stateList.push({ value: String(item.state_id), label: String(item.state_name) });
        // }
        // return stateList;
    }

    knowSiteSurveyor() {
        this.subscription = this.leadPanelService.getSurveyorData().subscribe(data => {
            if (data.status) {
                this.surveyorList = this.convertForSelect(data.data.emp_data);

            } else {
                // this.cityList = this.convertForSelect(this.isEmptyData);
                // this.stateList = this.convertForSelect(this.isEmptyData);
                // this.localityList = this.convertForSelect(this.isEmptyData);
            }
        })

    }

    convertForSelect(listItems: any, type?: string) {
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            for (let item of listItems) {
                if (type == 'state') {
                    arrPush.push({ value: String(item.state_id), label: String(item.state_name) });
                } else if (type === 'city') {
                    arrPush.push({ value: String(item.district_id), label: String(item.district_name) });
                } else {
                    arrPush.push({ value: String(item.id), label: String(item.name) });
                }
            }
            return arrPush;
        }
    }

    showTabData(step: number) {
        // this.isAllTabActiveted = true;
        $('html, body').animate({ scrollTop: $("#fill-form-widget").offset().top }, 1000);
        this.panelSteps = step;
        if (this.panelSteps == 2 ) {
            this.getCceLeadDetails();
        }
    }

    /*
    * Method to close calling PopUp
    */
    closeCallingPopUp(type?: string) {
        if (type == 'close') {
            this.callingPopUp = false;
        } else {
            this.callingPopUp = true;
        }
    }
    callButton() {
        this.callingPopUp = true;
        const dialNo = +this.leadData.lead_mobile;
        const userData = JSON.parse(localStorage.getItem('userData'));
        const transferTo = userData.emp_id;
        this.leadPanelService.callButton(globalV.clientid, dialNo, transferTo, globalV.campId, globalV.leadId, globalV.crmCallid).subscribe(data => {
          //  console.log(data);
        }, error => {
            console.log(error);
            this.callingError = true;
            this.callingErrorMsg = "Error : Issue with request";
        })
    }

    /**
     * Convert Date (yyyy-mm-dd) To Calander (dd/mm/yyyy)
     * @param date string
     */
    convertDateToCalander(date: string) {
        if (date) {
            if (date.includes('-')) {
                return date.split('-').reverse().join('/');
            } else {
                return date;
            }
        }
        else {
            return date;
        }
    }

    convertTimeToCalander(time: string) {
        if (time) {
            if (time.includes(':')) {
                let str: Array<any>;
                let returnTime: string;
                str = time.split(':');
                str = str.slice(0, 2);
                returnTime = str.join(':');
                return returnTime;
            } else {
                return time;
            }
        }
        else {
            return time;
        }
    }

    covertTime(date: Date) {
        if (String(date).length != 5) {
            let d = new Date(date);
            let h = d.getHours().toString(), m = d.getMinutes().toString();
            if (h.length == 1) {
                h = '0' + h;
            }
            if (m.length == 1) {
                m = '0' + m;
            }
            return h + ':' + m;
        }
        return date;
    }


    /**
     * Create Survey Request form
     */
    createSurveyRequestForm() {
        this.surveyRequest = this.formBuilder.group({
            consumer_fname: ['', Validators.compose([Validators.required])],
            consumer_mname: [''],
            consumer_lname: ['', Validators.compose([Validators.required])],
            consumer_mobileno: ['', Validators.compose([Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
            consumer_alternatecontactno: ['', Validators.compose([Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
            consumer_address1: [''],
            consumer_address2: [''],
            consumer_landmark: ['', Validators.compose([Validators.pattern(/^[a-z A-Z]+$/)])],
            consumer_cityid: ['', Validators.compose([Validators.required])],
            consumer_stateid: ['', Validators.compose([Validators.required])],
            consumer_locality: [''],
            consumer_pincode: ['', Validators.compose([Validators.required, Validators.pattern(/^\(??([0-9]{6})$/)])],
            consumer_date: [''],
            consumer_time: [''],
            // consumer_buildingtype: ['', Validators.required],
            consumer_email: ['', Validators.compose([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            is_waived: ['']

        })
    }

    showSurveyForm(){
        this.isListing = '';
        this.panelSteps = 0;
        this.createSurveyRequestForm();
        this.isSurveyFormVisible=true;
    }

    hideSurveyForm(){
        this.isListing = '';
        this.panelSteps = 0;
        this.getLeadDetails();
        this.isSurveyFormVisible=false;

    }


    /**
     * submit survey request data
     */
    submitSurveyRequest() {
        if (CustomerCareLeadPanel.waivedCounter <= 0) {
            this.isWaived = 0;
            this.surveyRequest.patchValue({
                "is_waived": 0
            })
        }
        this.disableSurveyRequestSubmitButton = true;
        this.isSubmitSurveyRequest = true;
        if (this.surveyRequest.valid) {
            this.isLoading = true;
            this.subscription = this.leadPanelService.requestSurveyConsumer(this.surveyRequest.value).subscribe(data => {
                this.isLoading = false;
                if (data.status == 1) {
                    this.popupMessageService.showSuccess("Site survey submitted successfully!", 'success');
                    this.surveyRequest.reset();
                    this.isSubmitSurveyRequest = false;
                    this.disableSurveyRequestSubmitButton = false;
                    // if (this.isWaived === 1) {
                    //     CustomerCareLeadPanel.waivedCounter--;
                    //     this.toggleMsgPopup(this.site_survey.PAY_WAVED_OFF);
                    // } else {
                    //     this.router.navigate(['payment/options']);
                    // }

                    // this.router.navigate(['payment/options']);
                    this.formStep =1;
                    this.toggleOnline = false;
                    this.toggleOnlineStatus();
                    this.hideSurveyForm();
                    this.isListing = '';
                        // this.leadData.lead_id = data.meta.lead_id;
                        // this.consumer_id = data.meta.consumer_id;
                        // this.customerFillFormRequest.controls.cceld_leadid.setValue(data.data.lead_id);
                        // this.customerFillFormRequest.controls.cceld_consumerid.setValue(data.data.consumer_id);
                        // this.knowSiteSurveyor();
                        // this.panelSteps=22;
                        // this.showCceForm = 'cce_form_for_outbound_query';
                        // this.isSurveyFormVisible=false;
                } else {
                    this.popupMessageService.showError(data.error_message, 'error');
                    this.disableSurveyRequestSubmitButton = false;
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
                this.loading = false;
                this.disableSurveyRequestSubmitButton = false;
            });
        }
        else {
            if ((this.surveyRequest.controls.consumer_fname.errors && this.surveyRequest.controls.consumer_fname.errors.required) ||
                (this.surveyRequest.controls.consumer_lname.errors && this.surveyRequest.controls.consumer_lname.errors.required) ||
                (this.surveyRequest.controls.consumer_mobileno.errors && this.surveyRequest.controls.consumer_mobileno.errors.required) ||
                (this.surveyRequest.controls.consumer_pincode.errors && this.surveyRequest.controls.consumer_pincode.errors.required) ||
                (this.surveyRequest.controls.consumer_email.errors && this.surveyRequest.controls.consumer_email.errors.required)) {
                this.popupMessageService.showError("Please fill all mandatory details.", "error");
            } else {
                this.popupMessageService.showError("Please fill form details correctly.", "error");
            }
            this.disableSurveyRequestSubmitButton = false;
        }
    }

    sendPaymentLink(){
        this.sendLinkLoader = true;
        this.subscription = this.leadPanelService.paymentLink(this.leadData.lead_id).subscribe(data => {
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Payment link sent successfully.', 'success');
                    this.sendLinkLoader = false;
                } else {
                    this.popupMessageService.showError(data.error_message, 'error');
                    this.sendLinkLoader = false;
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
                this.sendLinkLoader = false;
            });
    }

    sendReachoutSMS(){
        this.sendReachoutLoader = true;
        this.subscription = this.leadPanelService.reachoutSms(this.leadData.lead_id).subscribe(data => {
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Reachout SMS sent successfully.', 'success');
                    this.sendReachoutLoader = false;
                } else {
                    this.popupMessageService.showError(data.error_message, 'error');
                    this.sendReachoutLoader = false;
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
                this.sendReachoutLoader = false;
            });
    }


    getQueryList(page) {
        this.showQueryForm = false;
        this.showCceForm = '';
        this.createFllFormRequestForm();
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.getQueryList(page, this.itemPerPage).subscribe(data => {
                if (data.status) {
                    this.queryList = data.data.data;
                    this.isListing = 'query_listing';
                    this.totalItem = data.data._meta.total_records;
                    this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                    this.pages = page;
                    this.createPaginationSubmitForm();
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    editQuery(data) {
        if (localStorage.getItem('emp_auth_key')) {
            this.showQueryForm = true;
            // localStorage.setItem("selectedQuery", JSON.stringify(data));
            this.createQueryResponseForm();
            this.queryRespondForm.patchValue({
                uquery_id: data.uquery_id,
                uquery_name: data.uquery_name,
                uquery_lname: data.uquery_lname,
                uquery_email: data.uquery_email,
                uquery_mobile: data.uquery_mobile,
                uquery_address: data.uquery_address,
                uquery_question: data.uquery_question,
                uquery_reply: data.uquery_reply,
                uquery_duration: data.uquery_duration
            });

        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    createQueryResponseForm() {
        this.queryRespondForm = this.formBuilder.group({
            uquery_id: [''],
            uquery_name: ['', Validators.compose([Validators.required])],
            uquery_lname: ['', Validators.compose([Validators.required])],
            uquery_email: ['', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            uquery_mobile: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{1}[0-9]{9}$/)])],
            uquery_address: ['', Validators.compose([Validators.required])],
            uquery_question: ['', Validators.compose([Validators.required])],
            uquery_reply: ['', Validators.compose([Validators.required])],
            uquery_duration: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]*$/)])],
            uquery_type: [1],
        });
    }

    cancelQueryUpdation() {
        if (this.isListing == 'inbound_query'){
            this.queryRespondForm.reset();
        }else{
            this.showQueryForm = false;
        }
    }

    //type 1 = update an outbound query
    //type 2 = update an outbound query and create a lead
    //type 3 = create an inbound query
    //type 4 = create an inbound query and create a lead

    updateQuery(type: number) {
        this.isSubmitQueryUpdate = true;
        if (this.queryRespondForm.valid == true) {
            if(type == 3 || type == 4){
                this.queryRespondForm.controls.uquery_type.setValue(2);
            }
            this.subscription = this.leadListService.updateQuery(this.queryRespondForm.value).subscribe(data => {
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Query has been responded successfully!!', 'success');
                    this.showQueryForm = false;
                    this.isSubmitQueryUpdate = false;
                    if (type == 1) {

                        this.getQueryList(this.pages);
                    } else if(type == 3){
                        this.inboundQueryForm();
                    }
                } else {
                    this.popupMessageService.showError(data.error_message, 'error');
                    this.isSubmitQueryUpdate = false;
                }
            }, (error) => {
                this.popupMessageService.showError('Server Error!!', 'error');
                this.isSubmitQueryUpdate = false;
            });
        } else {
            this.popupMessageService.showError('Insufficient Data!!', 'error');
        }
    }

    updateCreateLead(queryType:String) {
        this.isSubmitQueryUpdate = true;
        if (this.queryRespondForm.valid == true) {
            // this.isListing = '';
            this.isLoader = true;
            this.isSurveyFormVisible = false;
            this.leadData = '';
            if(queryType == 'outbound'){
                this.updateQuery(2);
            } else if (queryType == 'inbound'){
                this.updateQuery(4);
            }
            let formParams = this.queryRespondForm.value;
            let params = {
                consumer_fname: formParams.uquery_name,
                consumer_lname: formParams.uquery_lname,
                consumer_mobileno: formParams.uquery_mobile,
                consumer_email: formParams.uquery_email,
                consumer_address1: formParams.uquery_address
            };

            this.subscription = this.leadPanelService.requestSurveyConsumer(params).subscribe(data => {
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Lead has been created successfully!! Please update lead data..', 'success');
                    if (this.isListing == 'query_listing'){
                        this.showCceForm = 'cce_form_for_outbound_query';
                    } else if (this.isListing =='inbound_query'){
                        this.showCceForm = 'cce_form_for_inbound_query';
                        this.leadData = data.meta;
                        this.panelSteps = 2;
                    }
                    this.isLoader = false;
                    this.customerFillFormRequest.patchValue({
                        cceld_firstname: params.consumer_fname,
                        cceld_mobileno: params.consumer_mobileno,
                        cceld_email: params.consumer_email,
                        cceld_address1: params.consumer_address1,
                        cceld_leadid: data.meta.lead_id,
                        cceld_consumerid: data.meta.consumer_id

                    });

                    this.knowSiteSurveyor();
                } else {
                    this.isLoader = false;
                    this.popupMessageService.showError(data.error_message, 'error');
                }

            }, (error) => {
                this.isLoader = false;
                this.popupMessageService.showError('Server Error!!', 'error');
            });
        } else {
            this.popupMessageService.showError('Insufficient Data!!', 'error');
        }
    }



    submitConsumerFormRequestQuery(buttonValue: number) {
        this.isSubmitCustomerFillFormRequest = true;
        this.customerFillFormRequest.controls.button_value.setValue(buttonValue);
        this.customerFillFormRequest.controls.cceld_approvedrejected.setValue(1);
        if (this.customerFillFormRequest.controls.cceld_state.value == 0) {
            this.customerFillFormRequest.controls.cceld_state.setValue('');
        }
        if (this.customerFillFormRequest.controls.cceld_city.value == 0) {
            this.customerFillFormRequest.controls.cceld_city.setValue('');
        }
        if (this.customerFillFormRequest.controls.cceld_locality.value == 0) {
            this.customerFillFormRequest.controls.cceld_locality.setValue('');
        }
        if (this.customerFillFormRequest.valid) {
            this.loading = true;
            this.subscription = this.leadListService.requestCCELeadSubmitForm(this.customerFillFormRequest.value).subscribe(data => {
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Lead Data has been updated successfully!!', 'success')
                    this.showCceForm = '';
                    if(this.isListing == 'query_listing'){
                        this.getQueryList(this.pages);
                    } else if(this.isListing == 'missedCallLogListing') {
                        this.ShowMissedCallListing(this.pages);
                    } else if (this.isListing == "partner_listing"){
                        this.isListing = "partnerQueryListing"
                    }
                } else {
                    this.popupMessageService.showError(data.error_message, 'error');
                }
                this.isSubmitCustomerFillFormRequest = false;
                this.loading = false;
            }, (error) => {
                this.popupMessageService.showError('Server Error!!', 'error');
                this.isSubmitCustomerFillFormRequest = false;
                this.loading = false;
            });
        } else {
            this.popupMessageService.showError('Insufficient Data!!', 'error');
        }
    }

    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
        });
    }

    pageSubmit() {
        if (this.paginationSubmitForm.valid) {
            let page = this.paginationSubmitForm.controls.page_number.value;
            if (this.isListing == 'query_listing') {
                this.getQueryList(page);

            } else if (this.isListing == 'missedCallLogListing'){
                this.ShowMissedCallListing(page,true);
             } else if (this.isListing == 'partnerQueryListing'){
                this.partnerQueryData(page);
             }
        }
    }

    inboundQueryForm() {
        this.isListing = 'inbound_query';
        this.showCceForm = '';
        this.showQueryForm = true;
        this.createQueryResponseForm();
    }

    checkTimeSlot() {
      let sDate = new Date(this.customerFillFormRequest.controls.cceld_scheduledate.value).getDate();
      let todaysDate = new Date().getDate();
      if( sDate === todaysDate) {
        this.timeSlot();
      } else {
        this.newSurveyTime = this.surveyTime;
      }
    }

    timeSlot() {
      this.hour = new Date().getHours();
      this.newSurveyTime = [];
      this.surveyTime.filter(() => {
        if(10 <= this.hour && 12 > this.hour) {
          this.newSurveyTime = this.surveyTime;
        } else if( 12 <= this.hour && 14 > this.hour) {
          this.newSurveyTime = this.surveyTime.slice(1,4);
        } else if(14 <= this.hour && 16 > this.hour) {
          this.newSurveyTime = this.surveyTime.slice(2,4);
        } else if(16 <= this.hour && 18 > this.hour) {
          this.newSurveyTime = this.surveyTime.slice(3,4);
        } else {
            this.customerFillFormRequest.controls.cceld_scheduletime.setValue('');
        }
      })
    }

    toggleOnlineStatus(){
        if(!this.toggleOnline){
            this.toggleOnline = true;
            this.popupMessageService.showSuccess('You are Now Online!', 'Success')
            this.getLeadDetails();
            this.cnfBoxForOffline = false;
            this.panelSteps = 0;
        }else{
            this.toggleOnline = false;
            if (this.leadData.lead_id){
                this.makeLeadinQueue();
            }
            this.leadListService.moveToQueue().subscribe(data=>{
                //console.log(data);
            });
        }
    }

    makeLeadinQueue(){
        this.cnfBoxForOffline = false;
        this.subscription = this.leadPanelService.makeLeadInQueue(this.leadData.lead_id).subscribe(data => {
            if (data.status == 1) {
                this.popupMessageService.showInfo('You are Now Offline!!','Info')
            } else {
                this.popupMessageService.showError(data.error_message, 'error');
            }
        }, (error) => {
            this.popupMessageService.showError('Server Error!!', 'error');

        });
    }

    confirmForOffline(type?:string){
        if(type == 'close'){
            this.cnfBoxForOffline = false;
        }else{
            this.cnfBoxForOffline = true;
            this.panelSteps = 0;
        }
    }

    submitPhoneNumber(){
        this.disableSurveyRequestSubmitButton = true;
        this.isSubmitSurveyRequest = true;
        if (this.surveyRequest.valid) {
            this.isLoading = true;
            this.getExistingLeadsAndProjectsForNumber(this.surveyRequest.get('consumer_mobileno').value)
        }
        else {
            if ((this.surveyRequest.controls.consumer_fname.errors && this.surveyRequest.controls.consumer_fname.errors.required) ||
                (this.surveyRequest.controls.consumer_lname.errors && this.surveyRequest.controls.consumer_lname.errors.required) ||
                (this.surveyRequest.controls.consumer_mobileno.errors && this.surveyRequest.controls.consumer_mobileno.errors.required) ||
                (this.surveyRequest.controls.consumer_pincode.errors && this.surveyRequest.controls.consumer_pincode.errors.required) ||
                (this.surveyRequest.controls.consumer_email.errors && this.surveyRequest.controls.consumer_email.errors.required)) {
                this.popupMessageService.showError("Please fill all mandatory details.", "error");
            } else {
                this.popupMessageService.showError("Please fill form details correctly.", "error");
            }
            this.disableSurveyRequestSubmitButton = false;
        }

    }

    formStep:number = 1;
    ongoingLead: any;
    coldLead: any;
    ongoingProject: any;
    rejectedProject: any;
    existingLeadData: any;
    boookSurveyPopup: boolean;
    getExistingLeadsAndProjectsForNumber(phone: number,form_step_change?:any,isToggle=false) {
        this.subscription = this.leadPanelService.getExistingLAndP(phone).subscribe(data => {
            if (data.status == 1) {
                this.existingLeadData = data.data;
                console.log(data);
                this.ongoingLead = (data.data.ongoingLeadData) ? data.data.ongoingLeadData : false;
                this.coldLead = (data.data.coldLeadData) ? data.data.coldLeadData : false;
                this.rejectedProject = (data.data.rejectedProjectsData) ? data.data.rejectedProjectsData : false;
                this.ongoingProject = (data.data.ongoingProjectsData) ? data.data.ongoingProjectsData : false;
                if(form_step_change){
                    this.formStep = 1;
                } else{
                 this.formStep = 2;
                }
            } else if (data.status == 2 && isToggle == false) {
                this.submitSurveyRequest();
            }
        });
    }


    onGoingLeadQueryText: string;
    coldLeadQueryText: string;
    onGoingProjectQueryText: string;
    rejectedProjectQueryText: string;
    QueryText: any = [];

    setQueryText(qText: string, index: number, type: string) {
        if (type == 'ong') {
            this.QueryText[index] = { ong: qText };
        } else if (type == 'cld') {
            this.QueryText[index] = { cld: qText };
        } else if (type == 'ogp') {
            this.QueryText[index] = { ogp: qText };
        } else if (type == 'rjp') {
            this.QueryText[index] = { rjp: qText };
        }
    }

    updateExistingLead(ex_lead_id?: number, index?: number, type?: string) {

        try{
            this.subscription = this.leadPanelService.updateExistingLead(ex_lead_id, this.QueryText[index][type]).subscribe(data => {
                if (data.status) {
                    this.popupMessageService.showInfo('Lead Updated!', 'Info')
                    this.formStep = 1;
                    this.createSurveyRequestForm();
                }
            });
        } catch(error){
            this.popupMessageService.showError('Please enter Query text', 'Error')
                return
        }
        
        this.disableSurveyRequestSubmitButton = false;
        this.isSubmitSurveyRequest = false;
        this.isLoading = false;
    }

    updateExistingProject(ex_project_id?: number, index?: number, type?: string) {
        // return true;
        try{
            this.subscription = this.leadPanelService.updateExistingProject(ex_project_id, this.QueryText[index][type]).subscribe(data => {
                if (data.status) {
                    this.popupMessageService.showInfo('Project Updated!', 'Info')
                    this.formStep = 1;
                    this.createSurveyRequestForm();
                }
            });
        } catch(error){
            this.popupMessageService.showError('Please enter Query text', 'Error')
                return
        }
        
        this.disableSurveyRequestSubmitButton = false;
        this.isSubmitSurveyRequest = false;
        this.isLoading = false;
    }
/** Start on 19 Feb 2019 */
    currentSearchTab: String;
    smartSearchFormData: any;
    missedCallLogsList: any = [];
    noRecords:boolean=false;
    ResetSmartSearchForm(){
        this.sharedServices.formDataSmartSearch.next("");  
    }
  ShowMissedCallListing(page,pagination=false) {
    this.showSmartSearchComponent = true;
    this.isListing = 'missedCallLogListing';
    if(!pagination){
        this.sharedServices.searchForm.next('missedCallLogsSearchForm');
    }

    this.leadListService.getMissedCallLogs('list', page, this.itemPerPage, this.smartSearchFormData)
      .subscribe(
        data => {
          if (data.status) {
            this.missedCallLogsList = data.result.data;
            this.totalItem = data.result._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
            this.pages = page;
            if(!pagination){
                this.createPaginationSubmitForm();
            }
            this.noRecords = false;
          }else{
            this.missedCallLogsList = [];
            this.noRecords = true;
            return;
          }
        }
      );
  }
  
  smartSearchResult(event) {
    this.pages = 1;
    
    this.createPaginationSubmitForm();
    this.sharedServices.formDataSmartSearch.subscribe((data) => {
        this.smartSearchFormData = data;
    })
    this.sharedServices.searchForm.subscribe((data) => {
        this.currentSearchTab = data;
    })
    if(this.isListing=='missedCallLogListing'){
        this.totalItem = event._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.missedCallLogsList = event.data;
    }
  if(this.isListing=='partnerQueryListing'){
    this.partnerQueryLogsList = event.result.data;
    this.totalItem = event.result._meta.total_records;
    this.pageCount = Math.ceil(this.totalItem / this.itemPerPage) || 1;
   // console.log(this.pageCount);
  }
  this.noRecords = false;
  
    }

    otherRemarkchange(event:any){
        const cceld_surveyerid = this.customerFillFormRequest.get('cceld_surveyerid');
        const cceld_state = this.customerFillFormRequest.get('cceld_state');
        const cceld_city = this.customerFillFormRequest.get('cceld_city');
        const cceld_pincode = this.customerFillFormRequest.get('cceld_pincode');
        const cceld_address1 = this.customerFillFormRequest.get('cceld_address1');
        const cceld_scheduledate = this.customerFillFormRequest.get('cceld_scheduledate');
        const cceld_scheduletime = this.customerFillFormRequest.get('cceld_scheduletime');
        if(event.target.value != ''){
            this.customerFillFormRequest.controls.cceld_surveyerid.setValue('');//remove the set value
            
            cceld_surveyerid.clearValidators();
            cceld_state.clearValidators();
            cceld_city.clearValidators();
            cceld_pincode.clearValidators();
            cceld_address1.clearValidators();
            cceld_scheduledate.clearValidators();
            cceld_scheduletime.clearValidators();
            this.otherRemark = false;
            //console.log('clear_validator');

            this.customerFillFormRequest.controls['cceld_surveyerid'].disable();
            this.customerFillFormRequest.controls['cceld_scheduledate'].disable();
            this.customerFillFormRequest.controls['cceld_scheduletime'].disable();
        } else {
            cceld_surveyerid.setValidators([Validators.required]);
            cceld_state.setValidators([Validators.required]);
            cceld_city.setValidators([Validators.required]);
            cceld_pincode.setValidators([Validators.required]);
            cceld_address1.setValidators([Validators.required]);
            cceld_scheduledate.setValidators([Validators.required]);
            cceld_scheduletime.setValidators([Validators.required]);
            this.otherRemark = true;
            //console.log('add_validator')

            this.customerFillFormRequest.controls['cceld_surveyerid'].enable();
            this.customerFillFormRequest.controls['cceld_scheduledate'].enable();
            this.customerFillFormRequest.controls['cceld_scheduletime'].enable();
            
        }
        cceld_surveyerid.updateValueAndValidity();
        cceld_state.updateValueAndValidity();
        cceld_city.updateValueAndValidity();
        cceld_pincode.updateValueAndValidity();
        cceld_address1.updateValueAndValidity();
        cceld_scheduledate.updateValueAndValidity();
        cceld_scheduletime.updateValueAndValidity();
        
    }

    /**
     * @description: Function to generate consumer lead id and search consumer id from mobile
     * @developer: Roshan
     * _-_-_-_Krishan_-_-_-
     */
    lead_id: any;
    consumer_id: any;
    CreateLead(missedCallNumber){
        this.leadListService.createLeadFromMissedCall(missedCallNumber).subscribe(data=>{
            if(data.status == 1){
                this.leadData.lead_id = data.data.lead_id;
                this.consumer_id = data.data.consumer_id;
                this.customerFillFormRequest.controls.cceld_leadid.setValue(data.data.lead_id);
                this.customerFillFormRequest.controls.cceld_consumerid.setValue(data.data.consumer_id);
                this.knowSiteSurveyor();
                this.panelSteps=22;
                this.showCceForm = 'cce_form_for_outbound_query';
                this.customerFillFormRequest.controls.cceld_reference.setValue('missed_call');
                this.popupMessageService.showSuccess('Lead Created', 'Success');
            } else {
                this.popupMessageService.showError(data.error_message,'Error!');
            }
        });
    }

    /**
     * @Description: Partner Query Section From Missed Call
     * @developer: Roshan
     * _-_-_Krishna_-_-_-
     */
    //PartnerTab data
    PartnerTabData:any;
    PartnerTab(tab: string) {
        $('html, body').animate({ scrollTop: $("#fill-form-widget").offset().top }, 1000);
        this.PartnerTabData = tab;
    }

    // Partner Query List
    partnerQueryLogsList:Array<any> = [];
    partnerQueryData(page) {
        this.showSmartSearchComponent = true;
        this.isListing = 'partnerQueryListing';
        this.sharedServices.searchForm.next('PartnerLogsSearchForm');
        this.partnerQueryLogsList = [];
        this.leadListService.getPartnerQuery(page, this.itemPerPage, this.smartSearchFormData)
          .subscribe(
            data => {
              if (data.status==1) {
                this.partnerQueryLogsList = data.result.data;
                this.totalItem = data.result._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
                this.createPaginationSubmitForm();
              }
            }
          );
    }

      //partner Form data
      partnerFillForm:FormGroup;
      partner_id:any;
      createPartnerForm(partner_id, mobileNo) {
          this.isListing = 'partner_listing';
          this.PartnerTabData = 'fill_form';
          this.partner_id = partner_id;
          this.partnerFillForm = this.formBuilder.group({
              prt_id: [partner_id],
              name: ['',Validators.compose([Validators.required,Validators.pattern(/^[a-zA-Z\s]{1,200}$/)])],
              firm_name: ['',Validators.compose([Validators.required,Validators.pattern(/^[a-zA-Z0-9\s]{1,200}$/)])],
              mobileno: [mobileNo,Validators.compose([Validators.required])],
              alternate_mobileno: ['',Validators.compose([Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
              email:['',Validators.compose([Validators.required , ,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)  ])],
              address:['',Validators.compose([Validators.required])],
              pincode:['',Validators.compose([Validators.required,Validators.pattern(/^[0-9]{6}$/)])],
              city:['',Validators.compose([Validators.required])],
              state:['',Validators.compose([Validators.required])],
              query:['',Validators.compose([Validators.required])],
              type:[''],
          });
          //this.getPartnerLeadDetails(partner_id);
          this.createNoResponsePartner(partner_id);
          this.createConsumerRescheduleForm(partner_id);
          this.allStatesAndCitiesData();
          this.cityList = this.convertForSelect(this.allCities, 'city');
          this.stateList = this.convertForSelect(this.allStates, 'state');
      }

    isSubmitpartner = false;
    selectedState:any;
    selectedCity:any;
    submitPartnerReqForm(type,ext_detail?:any) {
        if(type=='submit'){
            this.partnerFillForm.controls.type.setValue('submit');
            if(this.partnerFillForm.valid != true){
                this.popupMessageService.showError('Insufficient Data!!', 'error');
                this.isSubmitpartner = true;
                Object.keys(this.partnerFillForm.controls).forEach(key => {

                    const controlErrors: ValidationErrors = this.partnerFillForm.get(key).errors;
                    if (controlErrors != null) {
                        Object.keys(controlErrors).forEach(keyError => {
                        console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                        });
                    }
                });
            } else {
                this.loading = true;
                this.leadListService.savepartnerdata(this.partnerFillForm.value).subscribe(data=>{
                    this.loading = false;
                    this.popupMessageService.showInfo('Partner Data Saved','Success');
                    this.partnerQueryData(1);
                });
            }
        } 
        else if(type=='auto'){
              let pincode = this.partnerFillForm.get("pincode").value;
              let selected_city = this.partnerFillForm.get('city').value;
              if(pincode.length == 6 && ext_detail=='pin'){
                  //console.log(pincode);
                  this.knowYourStateCity(pincode,'partner-form');
             } else if (ext_detail=='pin'){
                this.partnerFillForm.controls.state.setValue('');
                this.partnerFillForm.controls.city.setValue('');
                this.cityList = this.convertForSelect(this.allCities, 'city');
                this.stateList = this.convertForSelect(this.allStates, 'state');
             }
             else if(ext_detail=='city'){
                if(selected_city > 0){
                    console.log(selected_city);
                }
             }

              this.partnerFillForm.controls.type.setValue('auto');
            //   this.leadListService.savepartnerdata(this.partnerFillForm.value).subscribe(data=>{
            //      this.loading = false;
            //  });
         }
    }

     /**
     * Get Partner lead details
     * @param
     */
    partnerData:any;
    getPartnerLeadDetails(partner_id) {
        this.userData = JSON.parse(localStorage.getItem('userData'));
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.getpartnerData(partner_id).subscribe(data => {
                if (data.status) {
                    if(data.type=='PARTNER'){
                        //this.isListing = 'partner_listing';
                        this.partnerData = data.result.data;
                        this.partnerFillForm.controls.name.setValue(data.result.data.prt_name);
                        this.partnerFillForm.controls.firm_name.setValue(data.result.data.prt_firm);
                        this.partnerFillForm.controls.mobileno.setValue(data.result.data.prt_mobile);
                        this.partnerFillForm.controls.alternate_mobileno.setValue(data.result.data.prt_alternate_no);
                        this.partnerFillForm.controls.email.setValue(data.result.data.prt_email);
                        this.partnerFillForm.controls.address.setValue(data.result.data.prt_address);
                        this.partnerFillForm.controls.pincode.setValue(data.result.data.prt_pincode);
                        this.partnerFillForm.controls.city.setValue(data.result.data.prt_city);
                        this.partnerFillForm.controls.state.setValue(data.result.data.prt_state);
                        //this.partnerFillForm.controls.prt_id.setValue(data.result.data.prt_id);
                        this.partnerFillForm.controls.query.setValue(data.result.data.prt_query);
                    }
                } else {
                    this.isLoginEmp = false;
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

      partnerNoResponse:FormGroup;
      createNoResponsePartner(partner_id) {
          this.partnerNoResponse = this.formBuilder.group({
              prt_id: [partner_id],
              lease_modifiedby: [this.userData.emp_id],
              lead_callowner_remarks: ['',Validators.required],
          });
      }

      createConsumerLead() {
        let partner_id = this.partner_id;
        this.leadListService.createLeadFromPartner(partner_id).subscribe((data)=>{
                if (data.status==1) {
                    //this.isListing = 'partnerQueryListing';
                    // this.leadData.lead_id = data.data.lead_id;
                    // this.consumer_id = data.data.consumer_id;
                    // this.customerFillFormRequest.controls.cceld_leadid.setValue(data.data.lead_id);
                    // this.customerFillFormRequest.controls.cceld_consumerid.setValue(data.data.consumer_id);
                    this.formStep =1;
                    this.toggleOnline = false;
                    this.toggleOnlineStatus();
                    this.hideSurveyForm();
                    this.showTabData(2);
                    this.isListing = '';
                    this.popupMessageService.showInfo('Lead Created From Partner','Success');
                }
        });
      }

      submitNoResponsePartner() {
        if (localStorage.getItem('emp_auth_key')){
            if (this.partnerNoResponse.valid) {
                this.subscription = this.leadPanelService.partnerNoResponse(this.partnerNoResponse.value).subscribe(data => {
                    if (data.status == 1) {
                        this.partnerQueryData(1);
                        this.popupMessageService.showInfo('Your Information Submitted Successfully.','Success');
                    } else {
                        console.log('error in submit');
                    }
                }, (error) => {
                    this.alertService.error(JSON.parse(error.body).non_field_errors);
                    this.loading = false;
                });
            } else {
                this.popupMessageService.showError('Insufficient Data!!', 'error');
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
      }

      partnerReschedule:FormGroup;
      createConsumerRescheduleForm(partner_id){
        this.partnerReschedule = this.formBuilder.group({
            prt_id:[partner_id],
            schedule_date:['',Validators.required],
            schedule_time:['',Validators.required],
            schedule_date_time:[''],
            remark:['',Validators.required],
        });
      }
      
      submitReschedule(){
          let currentDateTime = new Date();
          if(this.partnerReschedule.valid){
               // console.log(this.partnerReschedule.value);
                let inputDate = this.sharedServices.getDateInFormat(this.partnerReschedule.controls.schedule_date.value);
                let currentdate = (this.sharedServices.getDateInFormat(currentDateTime));
                this.partnerReschedule.controls.schedule_date_time.setValue(inputDate+' '+this.sharedServices.getTimeInFormat(this.partnerReschedule.controls.schedule_time.value));
                if(inputDate == currentdate){
                    let currentTime = this.sharedServices.getTimeInMilliseconds(currentDateTime);
                    let inputtime = (this.sharedServices.getTimeInMilliseconds(this.partnerReschedule.controls.schedule_time.value));
                    if(currentTime>=inputtime){
                        this.popupMessageService.showError("Time Should be greater than current time", 'error')
                        return;
                    }
                } 
                
                this.subscription = this.leadPanelService.partnerReschedule(this.partnerReschedule.value).subscribe(data => {
                    if (data.status == 1) {
                        this.partnerQueryData(1);
                        this.popupMessageService.showInfo('Partner Lead Reschedule','Success');
                    } else {
                        console.log('error in submit');
                    }
                }, (error) => {
                    this.alertService.error(JSON.parse(error.body).non_field_errors);
                    this.loading = false;
                });
                
          } else {
            this.popupMessageService.showError('Insufficient Data!!', 'error');
          }
      }

      ExportCSVForParterLog(){
        this.leadListService.getPartnerQuery(this.pages, this.itemPerPage, this.smartSearchFormData,'export')
        .subscribe(
          data => {
            let exportData = [{
                Phone_No: "Phone No.",
                Query_Date_time : "Query Date / time",
                Locked_by : "Locked by",
                Reschedule_Date : "Reschedule Date",
                Status : "Status",
           }];
            if (data.status==1) {
               data.result.data.forEach(element => {
                var temp = {
                    Phone_No: element.partnerQuery.prt_mobile,
                    Query_Date_time : element.partnerQuery.prt_created,
                    Locked_by : (element.employee.emp_firstname)?element.employee.emp_firstname +' '+ element.employee.emp_lastname:'',
                    Reschedule_Date : element.partnerQuery.prt_reschedule_date,
                    Status : this.sharedServices.getPartnerQueryStatusName(element.partnerQuery.prt_status),
                };
                exportData.push(temp);
            });
            this.exportToCSV(exportData , 'Partner Query Lead report');
            } else {
                this.popupMessageService.showInfo('No exported data','Info');
            }
          }
        );
      }

      exportToCSV(data , fileName){
        new ngxCsv(data, fileName , {showLabels : true});
    }

    

    
}