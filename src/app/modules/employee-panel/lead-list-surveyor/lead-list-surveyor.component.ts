import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription, AnonymousSubscription } from 'rxjs/Subscription';
import { LeadListService } from '../services/lead-list.service';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, ValidationErrors } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { TIMES, SITE_SURVEY } from '../../../static/static';
import * as globals from '../../../static/static';
import { SharedServices } from '../../../services/shared.services';
import { PopupMessageService } from './../../message/services/message.service';
import { LeadPanelService } from '../../customer-care/services/lead-panel.service';
import { not } from '@angular/compiler/src/output/output_ast';
import { take } from 'rxjs/operators';


@Component({
    selector: 'ss-lead-list',
    templateUrl: './lead-list-surveyor.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', './lead-list-surveyor.component.css']
})
export class SurveyorListPanel implements OnInit, OnDestroy {

    currentSearchTab: String = '';
    smartSearchFormData: any;
    showSmartSearchComponent: Boolean = false;
    isLoginEmp: boolean;
    yesNo = globals.YES_NO;
    isSuccess = globals.SUCCESS;
    isInstall: Boolean = false;
    isMaterial: Boolean = false;
    opQual = globals.QUAL;
    opSource = globals.OP_SOURCE;
    showSurveyForm: Boolean = false;
    auditRole: Boolean = false;
    times: any = TIMES;
    userData: any;
    subscription: Subscription;
    isData: boolean = false;
    leadData: any = [];
    cceFilledData: any = [];
    empRole: any;
    test: any;
    jsonData: any;
    isListing: string;
    showForm: string;
    projectChecklistData: any = [];
    ChecklistItems: any;
    checklistSubmitForm: FormGroup;
    isSubmitChecklist: boolean = false;
    projectDocuments: any;
    baseurl: string;
    uploadDocument: FormGroup;
    imageUploadIssues: string = '';
    imageDocsIssues: string = '';
    isUploadingDocs: Boolean = true;
    myHtml: String = '';
    currentProjectId: any;
    //sitesurvey form
    createSurveyRequestForm: FormGroup;
    isSubmitSiteSurvey: boolean = false;
    documentList: any;
    isSubmittedDocument: Boolean = false;
    isEligibleForDocUpload: boolean = false;
    documentsToBeUploaded: any = '0,';
    numbers: number[] = [];
    currentProjectState: any;
    isRemarkable: boolean = false;
    openStates: string[] = ['1', '2', '4','8', '25', '28'];
    rejectionChecklists: any = [];
    auditChecklists: any[] = ['34', '40', '5'];
    //surveyor form
    surveyorFillFormRequest: FormGroup;
    load_survey: FormGroup;
    deviceDesc: any = [];
    deviceWatt: any = [];
    isSubmitSurveyorFillFormRequest: boolean = false;
    consumerID: any;
    projectID: any;
    buttonValues: number;
    appliances: any[] = [];
    appliancesM: any[] = [];
    codes: any;
    codeStatus: any;
    surveyorFormData: any;
    loadSurveyorFormData: any = [];
    auditorData: any;
    validityCheck: boolean;
    sendsmsblock: boolean = false;
    site_survey_error_msg: any = SITE_SURVEY;
    lead_panal_form: any = SITE_SURVEY;
    //clarification
    isClarificationListing: boolean = false;
    isRejectionListing: boolean = false;
    rejData: any = [];
    clarileadData: any;
    lead_states: any = globals.LEAD_STATES;
    //project status detail data
    isProjectDetailData: boolean = false;
    isProjectStatus: boolean = false;
    projectleadData: any = [];
    consumerProjectData: any = [];
    projectDetail: any = [];
    projectRejectionData: any = [];
    checklistStatus: boolean;
    itemPerPage: number = 10;
    panelSteps: number = 1;
    time_const_audit: any;
    actionLoader: string = '';
    isloadExpand: boolean = false;
    isSearchFormSubmitted: Boolean = false;
    isLeadSearchFormSubmitted: Boolean = false;
    totalWattHoursDay: number;
    totalWattHoursNight: number;
    watt_day: any = [];
    watt_night: any = [];
    paginationSubmitForm: FormGroup;
    pages: number;
    pageCount: any;
    totalItem: any;
    solutionType: any = globals.SOLUTION_TYPE;
    projectStatusList = [];
    searchResultXlsPath: string = globals.SEARCH_RESULT_DOWNLOAD_PATH;
    downloadFileName: string;
    totalSurveyData: any = [];
    todaySurveyData: any = [];
    nextSevenDaySurvey: any = [];
    pastSevenDaySurvey: any = [];
    cashDetailForm: FormGroup;
    openCashDeatilBox: boolean = false;
    siteSurveyAmount: any = globals.PAYMENT;
    projectCloseReason: any = [];
    projectRejectReason: any = [];
    projectRejectReasonTemp: any = [];
    projectPermanentlyRejectReason: any = [];
    isRejectReason: boolean = false;
    isCloseReason: boolean = false;
    projectNotVisitedReason: any = [];
    isNotVisited: boolean = false;
    projectNotVisited: any = [];
    isRescheduleSurvey: boolean = false;
    siteSurveyDatabyDate: any = [];
    rejectReasonList: any = [];
    minDate = new Date();
    minTime: Date = new Date();
    Date: Number;
    currentDate = new Date();
    today = new Date();
    createhandoff: FormGroup;
    customerNotificationForm: FormGroup;
    isCommercial:boolean=false;
    cceFilledDataPinCode;


    slotList: Array<any> = [
        { value: '1', label: '1 Hour' },
        { value: '2', label: '2 Hour' },
        { value: '3', label: '3 Hour' },
        { value: '4', label: '4 Hour' },
        { value: '5', label: '5 Hour' },
        { value: '6', label: '6 Hour' },
        { value: '7', label: '7 Hour' },
        { value: '8', label: '8 Hour' },
        { value: '9', label: '9 Hour' },
        { value: '10', label: '10 Hour' },
        { value: '11', label: '11 Hour' }
    ];

    slotList1: Array<any> = [
        { value: '1', label: '1 Hour' },
        { value: '2', label: '2 Hour' },
        { value: '3', label: '3 Hour' },
        { value: '4', label: '4 Hour' },
        { value: '5', label: '5 Hour' },
        { value: '6', label: '6 Hour' },
        { value: '7', label: '7 Hour' },
        { value: '8', label: '8 Hour' },
        { value: '9', label: '9 Hour' },
        { value: '10', label: '10 Hour' },
        { value: '11', label: '11 Hour' },
        { value: '12', label: '12 Hour' },
        { value: '13', label: '13 Hour' }
    ];

    surveyTime: Array<any> = [
        { value: '1', label: '10:00-12:00' },
        { value: '2', label: '12:00-14:00' },
        { value: '3', label: '14:00-16:00' },
        { value: '4', label: '16:00-18:00' },

    ];

    doclist_handoff: Array<any> = [
        { value: 'Electricity Bills', label: 'Electricity Bills' },
        { value: 'Site Photographs', label: 'Site Photographs' },
        { value: 'Site Sketches', label: 'Site Sketches' },
        { value: 'Aadhar Card', label: 'Aadhar Card' },
        { value: 'PAN Card', label: 'PAN Card' },
        { value: 'Purchase Order Letter', label: 'Purchase Order Letter' },
        { value: 'Property Document', label: 'Property Document' },
        { value: 'Proposal', label: 'Proposal' },
        { value: 'Customer Photograph', label: 'Customer Photograph' },
        { value: 'Cancelled Cheque', label: 'Cancelled Cheque' },
        { value: 'GST certificate', label: 'GST certificate' },
        { value: 'Price Estimator', label: 'Price Estimator' },
        { value: 'Approval Mail for platform charge', label: 'Approval Mail for platform charge' },
    ];

    projectType: {value:String,label:String}[]=[
        {value:"Single Location",label:'Single Location'},
        {value:"Multiple Location",label:'Multiple Location'}
    ]

    newSurveyTime: any = [];
    actionableList: any = [];
    nonActionableList: any = [];
    searchForm: FormGroup;
    searchLeadForm: FormGroup;
    unprocessedLeads: any = [];
    sendLinkLoader: boolean;
    currentButton: number;
    saveCashPaymentLoader: boolean;
    hour = new Date().getHours();
    pid: any;
    actionLoaderSMS: string;
    customermobile: any;
    loader:any;
    record:any;



    constructor(
        private route: Router,
        private sharedServices: SharedServices,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadListService: LeadListService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService,
        private leadPanelService: LeadPanelService,
        private elementRef: ElementRef
    ) { }

    ngOnInit() {
        // this.sharedServices.searchForm.next('sitesurveyorLeadList');
        // this.rightMove();
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
        }
        this.isCloseReason = false;

        this.getLeadListDetails();
        this.createChecklistSubmitForm();
        this.createDocumentForm();
        // this.getUploadDocumentName();
        this.createSurveyorFillFormRequestForm();
        this.baseurl = globals.API_BASE_URL;
        this.createAddCashForm();
        this.getProjectReason();
        this.getSurveyNotVisitedReason();
        this.timeSlot();
        this.createCustomerNotificationForm();
        this.currentDate = new Date();
        this.allStatesAndCitiesData();
        setTimeout(() => {
            this.showSmartSearchComponent = true;
        }, 1000);
    }

    ngOnDestroy(): void {


    }

    /**
     * Create fill form
     */
    createSurveyorFillFormRequestForm() {
        this.surveyorFillFormRequest = this.formBuilder.group({
            sf_project_id: [''],
            sf_consumer_id: [''],
            sf_reference: [''],
            sf_project_type:['',Validators.required],
            sf_firstname: ['', Validators.compose([Validators.required])],
            sf_middlename: [''],
            sf_lastname: ['', Validators.compose([Validators.required])],
            sf_address1: [''],
            sf_address2: [''],
            sf_pincode: ['', Validators.compose([Validators.required, Validators.pattern(/^\(??([0-9]{6})$/)])],
            sf_cityid: [''],
            sf_stateid: [''],
            sf_mobileno: ['', Validators.compose([Validators.required, Validators.pattern(/^[7-9]{1}[0-9]{9}$/)])],
            sf_email: ['', Validators.compose([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            sf_sanctioned_load_capacity: ['', Validators.compose([Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)])],
            sf_connection_type: ['single'],
            sf_mainline_transformer_status: ['1',Validators.required],
            sf_transformer_capacity: [''],
            sf_transformer_connection_type: ['single'],
            sf_dgset_capacity: [''],
            sf_dgset_connection_type: ['single'],
            sf_dg_brand: [''],
            // cceld_sitetype:[''],
            site_type:['',Validators.required],
            sf_inverter_capacity: [''],
            sf_inverter_connection_type: ['single'],
            sf_inverter_brand: [''],
            sf_inverterdc_voltage: [''],
            sf_battery_brand: [''],
            sf_battery_capacity: [''],
            sf_battery_rating_factor: [''],
            sf_battery_type: ['tabular'],
            sf_battery_age: [''],
            sf_availability_of_grid1: ['hours'],
            sf_availability_of_grid2: ['hours'],
            sf_primary_source_of_supply_during_day: ['grid'],
            sf_primary_source_of_supply_during_evening: ['grid'],
            sf_min_running_loadin_daytime: [''],
            sf_load_running_after6: [''],
            sf_critical_load_onwhich_backup_isrequired: [''],
            sf_operation_hour_of_critical_load: [''],
            sf_secondary_source_of_supply_if_available: ['inverter'],
            sf_termination_dblt_panel_capacity: [''],
            sf_no_of_existing_earthin_pit: [''],
            sf_evacuation_voltage: [''],
            sf_type_of_roof: ['rcc'],
            sf_shadow_free_area: [''],
            sf_installation_location: [''],
            sf_other_spaces_available_for_installation: ['tin_shed'],
            sf_no_of_floors_in_the_building: [''],
            sf_roof_accessibility: ['lift'],
            sf_distance_of_existing_lt_panelboard_from_roof: [''],
            sf_preference_for_invertor_installation: [''],
            sf_chipping_on_roof_allowance: ['allowed'],
            sf_can_the_panels_be_mounted_facing_towards_true_south: ['',Validators.required],
            sf_incase_of_nontrue_southsites: [''],
            sf_incase_of_shed_isdrill_allowed: ['1'],
            sf_isthe_shed_facing_towards_true_south: ['1'],
            sf_details_of_shed: ['slope'],
            sf_area_of_the_place_where_pcu: [''],
            sf_ventilation_available_in_batterypcu_room: ['1'],
            sf_distance_from_roof_to_inverter_battery_room: [''],
            sf_distance_from_inverter_battery_room_to_lt_board: [''],
            sf_length_of_wirerun_from_each_array_to_inverter: [''],
            sf_space_available_for_secure_storage_of_material: ['1'],
            sf_space_available_for_earthing: ['1'],
            sf_shading: [''],
            sf_height_of_the_parapet_wall: [''],
            sf_protruding_objects_mumty_in_installation_location: [''],
            sf_details_of_high_altitude_trees_buildings_facing_south: [''],
            sf_latitude_longitude_of_site: ['', Validators.compose([Validators.required,])],
            sf_isdraft: ['0'],
            sf_createdby: ['1'],
            sf_modifiedby: ['1'],
            sf_proposed_ac_capacity: [""],
            sf_proposed_dc_capacity: [""],
            sf_ground_clearance_of_structure_recommended_by_surveyor: [""],
            sf_feasiblity_remarks: ['', Validators.compose([Validators.required,])],
            sf_feasible_solution_type: ['', Validators.compose([Validators.required,])],
            load_survey: this.formBuilder.array([]),
            building_type: ['',Validators.required],
            cp_firstname: [''],
            cp_lastname: [''],
            cp_mobileno: [''],

        })
        this.siteTypeChange();
        this.allStatesAndCitiesData();
    }
    siteTypeChange(){
        this.surveyorFillFormRequest.get('building_type')
        .valueChanges.subscribe(val=>{
            if(val =="commercial"){
                this.isCommercial=true;
            }
            else{
                this.isCommercial=false;
            }
        })
    }

    onBuildingChange(value){
        if (value =="residential" || value == 'commercial'){
            this.surveyorFillFormRequest.get('site_type').reset();
        }

    }

    //get project status data
    getProjectStatusDataDetailed(projectID) {
        this.showSmartSearchComponent = false;
        this.panelSteps = 2;
        this.currentProjectId = projectID;
        this.isloadExpand = false;
        if (projectID) {
            this.leadListService.getProjectStatusDataService(projectID).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.checklistStatus = false;
                    this.isListing = '';
                    this.showForm = 'project_status_form';
                    this.consumerProjectData = data.data.consumer_project_data[0];
                    this.projectDetail = data.data.project_status_data;
                    this.projectRejectionData = data.data.rejection_data;
                    this.consumerID = this.consumerProjectData.project_consumerid;
                    //this.rejData = data.data[0].prd_remarks;
                } else {

                }
            })
        }
    }

    onChange(value){
        this.customerFillFormRequest.get('cceld_sitetype')
        .reset();

    }


    submitSurveyorFormRequest() {
        this.isSubmitSurveyorFillFormRequest = true;
        let load_survey = [];
        let building_type = this.surveyorFillFormRequest.get('building_type').value;
        if (building_type == 'residential') {
            this.surveyorFillFormRequest.controls.cp_mobileno.clearValidators();
            this.surveyorFillFormRequest.controls.cp_firstname.clearValidators();
            this.surveyorFillFormRequest.controls.cp_firstname.setValue('');
            this.surveyorFillFormRequest.controls.cp_firstname.updateValueAndValidity();
            this.surveyorFillFormRequest.controls.cp_lastname.clearValidators();
            this.surveyorFillFormRequest.controls.cp_lastname.setValue('');
            this.surveyorFillFormRequest.controls.cp_lastname.updateValueAndValidity();
            this.surveyorFillFormRequest.controls.cp_mobileno.setValue('');
            this.surveyorFillFormRequest.controls.cp_mobileno.updateValueAndValidity();
        }

        if (this.buttonValues == 1) {
            this.validityCheck = true;
            this.surveyorFillFormRequest.controls.sf_isdraft.setValue(this.buttonValues);
        }
        if (this.buttonValues == 2) {
            this.surveyorFillFormRequest.controls.sf_isdraft.setValue(0);

            this.surveyorFillFormRequest.value.load_survey.map((item) => {
                load_survey.push(...item);
            });
            this.actionLoader = 'surveyForm_loader';
        }

        if (this.surveyorFillFormRequest.valid) {
            this.validityCheck = true;
        } else {
            this.validityCheck = false;
        }


        if (this.validityCheck || this.buttonValues == 3) {
            let project_id = this.surveyorFillFormRequest.get('sf_project_id').value;
            let consumer_id = this.surveyorFillFormRequest.get('sf_consumer_id').value;

            let request = Object.assign(this.surveyorFillFormRequest.value, { load_surveys: load_survey }, { buttonValue: this.buttonValues });
            //post handling
            this.leadListService.requestSubmitSurveyorForm(request).pipe(take(1)).subscribe(data => {
                if (data.status == 1) {
                    this.alertService.success('Your Information Submitted Successfully.', true);

                    if (this.buttonValues == 2) {
                        this.popupMessageService.showSuccess('Surveyor Data Submitted Successfully.', 'success');
                        this.actionLoader = '';
                        this.openProjectChecklistDetails(project_id, consumer_id);
                    }
                    if (this.buttonValues == 1) {
                        this.popupMessageService.showSuccess('Surveyor Data Saved Successfully.', 'success');
                        this.actionLoader = '';
                    }

                } else {
                    this.actionLoader = '';
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
                this.actionLoader = '';
            });
        } else {
            this.popupMessageService.showError('Please Fill Mandatory Data.', 'Insufficient Data!');
            this.actionLoader = '';
        }
    }

    submitButtonValue(buttonValue: number) {
        this.buttonValues = buttonValue;
        if (this.buttonValues == 3) {
            this.validityCheck = true;
            this.codeStatus = 1;
            this.submitSurveyorFormRequest();
        } else if (this.buttonValues == 2 && this.surveyorFillFormRequest.valid) {
            this.validityCheck = true;
        } else {
            this.validityCheck = false;
        }
    }

    /***
     * @description: variable decleared for openProjectChecklistDetails function
     */
    ongoingLead: any;
    coldLead: any;
    ongoingProject: any;
    rejectedProject: any;
    existingLeadData: any;
    /***@Ends: variable decleared */
    //get surveyordata
    building_type: any;
    isPrimaryApplicantSame: boolean = false;
    getSurveyorData(projectID, consumerID) {
        if (projectID && consumerID) {
            this.leadListService.getSurveyorDataService(projectID, consumerID).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    if (data.data.consumer_data) {
                        this.cceFilledData = data.data.consumer_data[0];
                        if(this.cceFilledData.cceld_pincode){
                            this.cceFilledDataPinCode=Number(this.cceFilledData.cceld_pincode);
                        }
                        this.customermobile = data.data.consumer_data[0].cceld_mobileno;
                        this.time_const_audit = this.times[this.cceFilledData.cceld_scheduletime];
                    }
                    //for first time
                    if (data.data.survey_form_code == 2) {
                        this.codeStatus = data.data.survey_form_code;

                        //getting appliance details
                        this.leadListService.getApplianceAll().pipe(take(1)).subscribe(data => {
                            if (data.status) {
                                this.extractData(data, this.codeStatus);
                                this.addFields(this.codeStatus);
                            } else {

                            }
                        })
                        //first time data
                        this.surveyorFillFormRequest.controls.sf_project_id.setValue(this.currentProjectId);
                        this.surveyorFillFormRequest.controls.sf_consumer_id.setValue(this.consumerID);
                        this.surveyorFillFormRequest.controls.sf_reference.setValue(data.data.consumer_data[0].cceld_reference);
                        this.surveyorFillFormRequest.controls.sf_firstname.setValue(data.data.consumer_data[0].cceld_firstname);
                        this.surveyorFillFormRequest.controls.sf_project_type.setValue(data.data.consumer_data[0].sf_project_type);
                        this.surveyorFillFormRequest.controls.sf_middlename.setValue(data.data.consumer_data[0].cceld_middlename);
                        this.surveyorFillFormRequest.controls.sf_lastname.setValue(data.data.consumer_data[0].cceld_lastname);
                        this.surveyorFillFormRequest.controls.sf_address1.setValue(data.data.consumer_data[0].cceld_address1);
                        this.surveyorFillFormRequest.controls.sf_address2.setValue(data.data.consumer_data[0].cceld_address2);
                        this.surveyorFillFormRequest.controls.sf_pincode.setValue(data.data.consumer_data[0].cceld_pincode);
                        this.surveyorFillFormRequest.controls.sf_cityid.setValue(data.data.consumer_data[0].cceLeaddata.cceld_city);
                        this.surveyorFillFormRequest.controls.sf_stateid.setValue(data.data.consumer_data[0].cceLeaddata.cceld_state);
                        this.surveyorFillFormRequest.controls.sf_mobileno.setValue(data.data.consumer_data[0].cceld_mobileno);
                        this.surveyorFillFormRequest.controls.sf_email.setValue(data.data.consumer_data[0].cceld_email);
                        this.surveyorFillFormRequest.controls.building_type.setValue(data.data.consumer_data[0].cceld_buildingtype);
                        this.surveyorFillFormRequest.controls.sf_feasible_solution_type.setValue(data.data.consumer_data[0].cceLeaddata.cceld_ongridoffgrid);
                        if(data.data.surveyor_form_data[0].sf_feasible_solution_type){
                            this.surveyorFillFormRequest.controls.sf_feasible_solution_type.setValue(data.data.surveyor_form_data[0].sf_feasible_solution_type);
                        }
                        else{
                            this.surveyorFillFormRequest.controls.sf_feasible_solution_type.setValue(data.data.consumer_data[0].cceld_ongridoffgrid);

                        }
                        this.surveyorFillFormRequest.controls.site_type.setValue(data.data.consumer_data[0].cceld_sitetype);
                    }


                    //drafted data setting
                    if (data.data.survey_form_code == 1) {
                        let load_surveyer_form_data = data.data.load_surveyer_form_data;
                        this.codeStatus = data.data.consumer_data;
                        if(data.data.surveyor_form_data[0].sf_sanctioned_load_capacity){
                            data.data.surveyor_form_data[0].sf_sanctioned_load_capacity = parseFloat(data.data.surveyor_form_data[0].sf_sanctioned_load_capacity).toFixed(2);
                        }
                        this.surveyorFillFormRequest.patchValue(data.data.surveyor_form_data[0], { onlySelf: true });
                        this.surveyorFillFormRequest.controls.sf_address1.setValue(data.data.consumer_data[0].cceld_address1);
                        this.surveyorFillFormRequest.controls.sf_address2.setValue(data.data.consumer_data[0].cceld_address2);
                        if(data.data.surveyor_form_data[0].sf_feasible_solution_type){
                            this.surveyorFillFormRequest.controls.sf_feasible_solution_type.setValue(data.data.surveyor_form_data[0].sf_feasible_solution_type);
                        }
                        else{
                            this.surveyorFillFormRequest.controls.sf_feasible_solution_type.setValue(data.data.consumer_data[0].cceld_ongridoffgrid);

                        }
                        this.surveyorFillFormRequest.controls.site_type.setValue(data.data.consumer_data[0].cceld_sitetype);

                        //getting appliance details
                        this.leadListService.getApplianceAll().pipe(take(1)).subscribe(data => {
                            if (data.status) {
                                if (load_surveyer_form_data && load_surveyer_form_data.length > 0) {
                                    this.extractData(data, this.codeStatus);
                                    this.extractData2(load_surveyer_form_data);
                                    this.addFields2(this.codeStatus, load_surveyer_form_data);
                                } else {
                                    this.codeStatus = 2;
                                    this.extractData(data, this.codeStatus);
                                    this.addFields(this.codeStatus);
                                }
                            } else {
                                console.log('error in getting appliance data');
                            }
                        })

                        // Checkbox primary applicant
                        let isPrimaryApplicantSame = true;
                        if(data.data.consumer_data[0].cceld_firstname != data.data.surveyor_form_data[0].cp_firstname) {
                            isPrimaryApplicantSame = false;
                        }
                        console.log(data.data.consumer_data[0].cceld_firstname, data.data.surveyor_form_data[0].cp_firstname, isPrimaryApplicantSame)
                        if(data.data.consumer_data[0].cceld_lastname != data.data.surveyor_form_data[0].cp_lastname) {
                            isPrimaryApplicantSame = false;
                        }
                        console.log(isPrimaryApplicantSame)
                        if(data.data.consumer_data[0].cceld_mobileno != data.data.surveyor_form_data[0].cp_mobileno) {
                            isPrimaryApplicantSame = false;
                        }
                        console.log(isPrimaryApplicantSame)
                        this.isPrimaryApplicantSame = isPrimaryApplicantSame;
                        console.log(this.isPrimaryApplicantSame)
                    }
                    if (this.cceFilledData.cceld_mobileno > 0) {
                        this.leadPanelService.getExistingLAndP(this.cceFilledData.cceld_mobileno).pipe(take(1)).subscribe(data => {
                            if (data.status == 1) {
                                this.existingLeadData = data.data;
                                this.ongoingLead = (data.data.ongoingLeadData) ? data.data.ongoingLeadData : false;
                                this.coldLead = (data.data.coldLeadData) ? data.data.coldLeadData : false;
                                this.rejectedProject = (data.data.rejectedProjectsData) ? data.data.rejectedProjectsData : false;
                                this.ongoingProject = (data.data.ongoingProjectsData) ? data.data.ongoingProjectsData : false;
                            } else {
                                console.log('error getting existing leads line:275 lead-list-soldesign.component.ts');
                            }
                        });
                    }
                } else {
                    console.log('error');
                }
            })
        }
        // console.log(projectID + '========' + consumerID);
    }

    //get audit surveyordata
    getAuditData(projectID, consumerID) {
        if (projectID && consumerID) {
            this.leadListService.getSurveyorAudit(projectID, consumerID).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.surveyorFormData = data.data.surveyor_form_data[0];
                    this.loadSurveyorFormData = data.data.load_surveyer_form_data;
                    this.leadListService.getAuditorDetail(projectID).pipe(take(1)).subscribe(data => {
                        if (data.status) {
                            this.auditorData = data.data[0];
                            if (this.auditorData.ssd_materialauditcompleted == 0 || this.auditorData.ssd_materialauditcompleted == 1) {
                                this.isMaterial = true;
                            }
                            if (this.auditorData.ssd_installationauditcompleted == 0 || this.auditorData.ssd_installationauditcompleted == 1) {
                                this.isInstall = true;
                            }

                        }
                    })

                } else {
                    console.log('error');
                }
            })
        }

    }

    //get remarks
    rejDetail: any;
    getRejectionRemarks(projectID, state?: any) {
        if (projectID) {
            this.leadListService.getRejRemarksDataService(projectID, state).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    let rejectionData = data.data[0];
                    if (rejectionData.prd_remarks != null) {
                        this.isRejectionListing = true;
                        this.rejData = 'Remark: ' + rejectionData.prd_remarks;
                        if (rejectionData.prd_roleid == 8) {
                            this.rejDetail = 'Solution Designer: ' + rejectionData.emp_firstname + ' ' + rejectionData.emp_lastname;
                        } else if (rejectionData.prd_roleid == 22) {
                            this.rejDetail = 'Site Surveyour: ' + rejectionData.emp_firstname + ' ' + rejectionData.emp_lastname;
                        } else {
                            this.rejDetail = rejectionData.emp_firstname + ' ' + rejectionData.emp_lastname;
                        }
                    }
                    //console.log(data.data[0].prd_remarks);
                } else {
                    console.log('error');
                }
            })
        }
    }

    public extractData(request: any, code: any) {
        this.appliancesM = [];
        request.data.device_desc.map((item) => {
            let deviceObj = null
            if (item.add_id) {
                deviceObj = {
                    id: item.add_id,
                    text: item.add_device_description
                };
            }
            if (this.appliancesM[item.appliance_id]) {
                this.appliancesM[item.appliance_id].add_devices.push(deviceObj);
                return;
            }
            this.appliancesM[item.appliance_id] = { id: item.appliance_id, text: item.appliance_name, add_devices: [] };
            this.appliancesM[item.appliance_id].add_devices.push(deviceObj);

        });
        request.data.device_watts.map((item) => {
            if (this.appliancesM[item.appliance_id].watt) {
                this.appliancesM[item.appliance_id].watt.push({
                    id: item.apw_id,
                    text: item.apw_power_watts
                });
                return;
            }
            this.appliancesM[item.appliance_id]['watt'] = [];
            this.appliancesM[item.appliance_id].watt.push({
                id: item.apw_id,
                text: item.apw_power_watts
            });

        });
        if (code != 1) {
            this.appliances = this.appliancesM;
        }
    }

    public extractData2(request: any) {
        this.appliances = [];
        request.forEach((item, index) => {
            let pushObject = this.appliancesM[item.lsf_load_category];
            this.appliances[index + 1] = pushObject;
        });

    }

    private addFields(code: any) {
        // this.surveyorFillFormRequest.removeControl('load_survey');
        // this.surveyorFillFormRequest.addControl('load_survey', this.formBuilder.array([]));
        this.appliances.forEach((item, index) => {
            let formArray = <FormArray>this.surveyorFillFormRequest.get('load_survey');
            formArray.push(this.formBuilder.array([this.getFields(item, code)]));
        });
    }

    private addFields2(code: any, load_surveyer_form_data: any) {
        // this.surveyorFillFormRequest.removeControl('load_survey');
        // this.surveyorFillFormRequest.addControl('load_survey', this.formBuilder.array([]));
        load_surveyer_form_data.forEach((item, index) => {
            let formArray = <FormArray>this.surveyorFillFormRequest.get('load_survey');
            formArray.push(this.formBuilder.array([this.getFields2(item, code)]));
        });
    }

    private getFields(device: any, code: any) {
        if (code == 2) {
            this.codes = 0;
        }

        return this.formBuilder.group({
            lsf_id: [this.codes],
            lsf_load_category: [device.id],
            lsf_device_description: [''],
            lsf_operating_source: [''],
            lsf_operating_voltage: [''],
            lsf_power_watts: [0],
            lsf_quantity_day_time: [''],
            lsf_backup_hours_of_use_during_day_time: [''],
            lsf_quantity_night_time: [''],
            lsf_backup_hours_of_use_during_night_time: [''],
            lsf_watt_hour_energy_day_time: [''],
            lsf_watt_hour_energy_night_time: ['']
        });
    }

    private getFields2(device: any, code: any) {
        return this.formBuilder.group({
            lsf_id: [device.lsf_id],
            lsf_load_category: [device.lsf_load_category],
            lsf_device_description: [device.lsf_device_description],
            lsf_operating_source: [device.lsf_operating_source],
            lsf_operating_voltage: [device.lsf_operating_voltage],
            lsf_power_watts: [device.lsf_power_watts],
            lsf_quantity_day_time: [device.lsf_quantity_day_time],
            lsf_backup_hours_of_use_during_day_time: [device.lsf_backup_hours_of_use_during_day_time],
            lsf_quantity_night_time: [device.lsf_quantity_night_time],
            lsf_backup_hours_of_use_during_night_time: [device.lsf_backup_hours_of_use_during_night_time],
            lsf_watt_hour_energy_day_time: [device.lsf_watt_hour_energy_day_time],
            lsf_watt_hour_energy_night_time: [device.lsf_watt_hour_energy_night_time]
        });
    }

    public addMore(deviceIndex, device, codeStatus) {
        let formArray = <FormArray>this.surveyorFillFormRequest.get('load_survey');
        let child = <FormArray>formArray.at(deviceIndex);
        child.push(this.getFields(device, codeStatus));
    }

    // rightMove() {
    //     if (localStorage.getItem('emp_auth_key')) {
    //         this.userData = JSON.parse(localStorage.getItem('userData'));

    //         if (localStorage.getItem('role_id') == '22') {
    //             this.route.navigateByUrl('/employee-panel/lead-list-surveyor');
    //         } else if (localStorage.getItem('role_id') == '5') {
    //             this.route.navigateByUrl('/customer-care/lead-panel');
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
    //         }
    //     } else {
    //         this.route.navigateByUrl('/employee/login');
    //     }
    // }
    getLeadListDetails(isActionableNonActionable?: any) {
        this.loader=true;
        this.record=false;
        isActionableNonActionable = (isActionableNonActionable) ? isActionableNonActionable : 'surveyor_action_listing';
        this.showSmartSearchComponent = true;
        this.sharedServices.searchForm.next('sitesurveyorLeadList');
        this.actionableList = [];
        this.nonActionableList = [];
        if (localStorage.getItem('emp_auth_key')) {
            this.leadListService.getLeadDetailsForEmployee().pipe(take(1)).subscribe(data => {
                if(data.error_message === 'No record found.'){
                    this.loader=false;
                    this.record=true;
                     return;
                 }
                if (data.status) {
                    this.leadData = data.result.data;
                    this.isListing = isActionableNonActionable;
                    this.getActionNonActionArrays(this.leadData);
                    this.loader=false;
                    this.record=false;
                    this.showSurveyForm = false;
                    this.isClarificationListing = false;
                    this.isProjectDetailData = false;
                } else {
                    console.log('error');
                    this.loader=false;
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
            this.loader=false;
        }
    }

    createChecklistSubmitForm() {
        this.checklistSubmitForm = this.formBuilder.group({
            checklist_name: ['', Validators.compose([Validators.required])],
            checklist_status: ['', Validators.compose([Validators.required])],
            remarks: ['', Validators.required],
            project_reject_reason: [''],
            project_close_reason: [''],
            not_visited_reason: [''],
            cceld_scheduledate: [this.minDate],
            cceld_scheduleTime: [''],
            visited_date_time: [''],
            visited_time: [''],
        })
    }

    openProjectChecklistDetails(projectId: any, consumerId: any) {
        this.showSmartSearchComponent = false;
        this.currentProjectId = projectId;
        this.consumerID = consumerId;
        this.panelSteps = 1;
        this.isEligibleForDocUpload = false;
        this.myHtml = '';
        this.isloadExpand = false;
        //this.getProjectStatusDataDetailed(this.projectID);
        //console.log(this.projectID+'========data======='+this.consumerID);
        if (localStorage.getItem('emp_auth_key')) {
            this.isRemarkable = false;
            this.isRejectReason = false;
            this.isCloseReason = false;
            this.isNotVisited = false;
            this.isRescheduleSurvey = false;
            this.isVisited = false;
            this.createChecklistSubmitForm();
            this.surveyorFillFormRequest.reset();
            this.createSurveyorFillFormRequestForm();
            this.appliances = [];
            this.getSurveyorData(this.currentProjectId, this.consumerID);
            this.leadListService.getProjectDetailsForChecklists(projectId).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.projectChecklistData = data.data;
                    this.isListing = '';
                    this.checklistStatus = true;
                    this.currentProjectId = projectId;
                    this.currentProjectState = data.project_data.project_state;
                    this.ChecklistItems = this.convertForSelectForSurveyor(this.projectChecklistData);
                    if (this.projectChecklistData.length <= 0) {
                        this.getLeadListDetails();
                    } else {
                        if (this.currentProjectState == 25 || this.currentProjectState == 28) {
                            this.showForm = "audit_form";
                            this.getAuditData(this.currentProjectId, this.consumerID);

                        } else if (this.currentProjectState == 8) {
                            this.showForm = "survey_form";
                            this.getRejectionRemarks(this.currentProjectId, 11);
                        } else if (this.currentProjectState == 1 || this.currentProjectState == 2) {
                            this.showForm = "only_cc_form";
                            this.sendsmsblock = true;
                            this.getRejectionRemarks(this.currentProjectId, 4);

                        } else {
                            this.showForm = "survey_form";
                        }
                        // this.documentUploadEligibilityCheck();
                        this.getUploadDocumentName();
                        this.getUploadedDocumentsForSurveyor(projectId);
                    }
                    //this.showSurveyForm = true;
                } else {
                    // console.log('error');
                    this.getLeadListDetails();
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    datetimeForPhp(date, time) {
        date = new Date(date)
        let timeArray = ['00:00:00', '10:00:00', '12:00:00', '14:00:00', '16:00:00'];

        let monthArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        let dateStr = date.getDate().toString();

        let datestring = date.getFullYear() + "-" + monthArray[date.getMonth()] + "-" + ((dateStr.length > 1) ? dateStr : '0' + dateStr);
        return (datestring + ' ' + timeArray[time]);
    }

    changeProjectStatus() {
        if(!this.ChecklistItems.length) {
            this.popupMessageService.showInfo("Please submit the surveyor form", '');
            return false;
        }
        this.isSubmitChecklist = true;
        this.checklistSubmitForm.controls.checklist_status.setValue('1');
        if (this.checklistSubmitForm.valid) {
            this.actionLoader = 'checklist_loader';
            let project_id = this.currentProjectId;
            // console.log(this.checklistSubmitForm.value);
            // return;
            let date = this.checklistSubmitForm.get('visited_date_time').value;
            let time = this.checklistSubmitForm.get('visited_time').value;
            let dateTime = this.datetimeForPhp(date, time);

            this.checklistSubmitForm.get("visited_date_time").setValue(new Date(dateTime));
            //console.log(this.checklistSubmitForm.value); return;
            this.leadListService.checklistSubmitService(project_id, this.checklistSubmitForm.value).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.isRemarkable = false;
                    this.isRejectReason = false;
                    this.isCloseReason = false;
                    this.isNotVisited = false;
                    this.createChecklistSubmitForm();
                    this.isSubmitChecklist = false;
                    this.sendsmsblock = false;
                    this.popupMessageService.showSuccess("Response Submitted Successfully", "Success!");
                    if (data.rescheduled) {
                        this.getLeadListDetails();
                    } else {
                        this.openProjectChecklistDetails(project_id, this.consumerID);
                    }
                    this.actionLoader = '';
                } else if (data.error_code != 0) {
                    this.popupMessageService.showError(data.error_message, "Error!");
                    this.actionLoader = '';
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
                this.actionLoader = '';
            });
        }
    }


    convertForSelectForSurveyor(listItems: any) {
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            for (let item of listItems) {
                if (item.pstatus_checkliststatus != 1 && item.psm_isexternal != 1) {
                    if (item.psm_is_reopen_or_rejected == 1) {
                        this.rejectionChecklists.push(item.psm_id);
                    }
                    if (item.psm_is_document_upload == 1) {
                        this.isEligibleForDocUpload = true;
                        this.documentsToBeUploaded += item.psm_mandatory_doc_types + ',0';
                    }

                    arrPush.push({ value: String(item.psm_id), label: String(item.psm_status) });
                }
            }
            return arrPush;
        }
    }

    // documentUploadEligibilityCheck() {
    //     for (let item of this.ChecklistItems) {
    //         if (item.value == 7) {
    //             this.isEligibleForDocUpload = true;
    //         }
    //     }
    // }

    public createDocumentForm() {
        this.uploadDocument = this.formBuilder.group({
            uploadDocumentFile: ['', [Validators.required]],
            documentListName: ['', [Validators.required]]
        });
    }

    getUploadedDocumentsForSurveyor(project_id) {
        if (localStorage.getItem('emp_auth_key')) {
            this.actionLoader = 'uploadedDocs_loader';
            this.leadListService.getUploadedDocuments(project_id, localStorage.getItem('role_id'), '').pipe(take(1)).subscribe(data => {
                if (data.status == 1) {
                    this.projectDocuments = data.data;
                    this.actionLoader = '';
                } else {

                    this.popupMessageService.showError(data.error_message, "Error!");
                    this.actionLoader = '';
                    //this.route.navigateByUrl('');
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
                this.actionLoader = '';
                //this.route.navigateByUrl('');
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    /**
     * @description: function handled file dropped as event and serve as same in file change event of form using
     * @developer: Roshan
     */
    handleFilesDropped(event: any, pid: any = false) {
        let eventAsSelectfile = { 'target': { 'files': event } };
        this.fileChange(eventAsSelectfile, pid);
    }



    fileChange(event: any, pid: any = false) {
        console.log(event, 'event', pid, 'pid');
        let is_from_handOff = false;
        if (pid == false) {
            is_from_handOff = true;
            pid = this.currentProjectId;
        }
        if (localStorage.getItem('emp_auth_key')) {
            this.isSubmittedDocument = true;
            if (this.uploadDocument.value.documentListName || this.handOfFileForm.value.fileName) {
                let documentType: string = '';
                if (this.uploadDocument.value.documentListName) {
                    documentType = this.uploadDocument.value.documentListName;
                } else if (this.handOfFileForm.value.fileName) {
                    documentType = this.handOfFileForm.value.fileName;
                }
                // this.isSubmittedDocs = groupIndex;
                if (documentType != '') {
                    this.actionLoader = 'upload_loader';
                    let eventClone = event;
                    let extType = event.target.files[0].type;
                    let ext = eventClone.target.files[0].name.split('.').pop();
                    this.sharedServices.docsToBase64(event, ["pdf", "doc", "docx", "msword", "xls", "xlsx", "csv", "jpeg", "jpg", "png", "PDF", "DOC", "DOCX", "XLS", "XLSX", "CSV", "JPEG", "JPG", "PNG"]).then(data => {
                        this.imageDocsIssues = '';
                        this.isUploadingDocs = true;
                        this.sharedServices.uploadSpceDocument(pid, documentType, String(data), ext, extType).pipe(take(1)).subscribe(data => {
                          console.log(data);
                            if (data.status == 1) {
                                /*if (["jpeg", "jpg", "png", "JPEG", "JPG", "PNG"].indexOf(ext) != -1) {
                                    this.myHtml = "<a target='_blank' href='" + this.baseurl + "/public/uploads/" + pid + "/" + data.data.pdoc_filename + "'><img width='200px' src='" + this.baseurl + "/public/uploads/" + pid + "/" + data.data.pdoc_filename + "'></a><div>" + data.data.pdoc_type + "</div>" + this.myHtml;
                                }
                                if (["pdf", "PDF"].indexOf(ext) != -1) {
                                    this.myHtml = "<a target='_blank' href='" + this.baseurl + "/public/uploads/" + pid + "/" + data.data.pdoc_filename + "'><img width='200px' src='/assets/images/pdf_image.png'></a><div>" + data.data.pdoc_type + "</div>" + this.myHtml;
                                }
                                if (["doc", "docx", "DOC", "DOCX"].indexOf(ext) != -1) {
                                    this.myHtml = "<a target='_blank' href='" + this.baseurl + "/public/uploads/" + pid + "/" + data.data.pdoc_filename + "'><img width='200px' src='/assets/images/docx.png'></a><div>" + data.data.pdoc_type + "</div>" + this.myHtml;
                                }
                                if (["xls", "xlsx", "csv", "XLS", "XLSX", "CSV"].indexOf(ext) != -1) {
                                    this.myHtml = "<a target='_blank' href='" + this.baseurl + "/public/uploads/" + pid + "/" + data.data.pdoc_filename + "'><img width='200px' src='/assets/images/xls.png'></a><div>" + data.data.pdoc_type + "</div>" + this.myHtml;
                                }*/
                                if (is_from_handOff) {
                                    this.getHandOffData(pid);
                                } else {
                                    this.getUploadedDocumentsForSurveyor(pid);
                                }
                                this.uploadDocument.reset();
                                // this.handOfFileForm.reset();
                                this.isSubmittedDocument = false;
                                this.popupMessageService.showSuccess(eventClone.target.files[0].name + " Uploaded Successfully", "Success!");
                                this.actionLoader = '';
                            } else if (data.error_code != 0) {
                                this.uploadDocument.reset();
                                this.actionLoader = '';
                                this.popupMessageService.showError(data.error_message, "Error!");
                            }
                        }, (error) => {
                            this.uploadDocument.reset();
                            this.actionLoader = '';
                            this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
                        });
                    }).catch(data => {
                        this.actionLoader = '';
                        this.isSubmittedDocument = false;
                        this.popupMessageService.showError(data, "Invalid File Type!");
                        //this.alertService.error(data);
                    });
                } else {
                    this.popupMessageService.showError("OOPs! Please Select Document type or enter the filename.", "Required Field Error!");
                }
            } else {
                this.popupMessageService.showError("OOPs! Please Select Document type or enter the filename.", "Required Field Error!");
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }


    /**
     * Getting upload document master data
     */
    getUploadDocumentName() {
        if (localStorage.getItem('emp_auth_key')) {
            this.leadListService.getUploadMasterData(this.documentsToBeUploaded).pipe(take(1)).subscribe(data => {
                if (data.status == 1) {
                    this.documentList = this.convertForSelect(data.data);
                } else {
                    this.alertService.error(data.error_message);
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    /**
     * Convert Data for Select
     */
    convertForSelect(listItems: any) {
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            for (let item of listItems) {
                arrPush.push({ value: String(item.document_name), label: String(item.document_name) });
            }
            return arrPush;
        }
    }

    convertForSelectlocality(listItems: any) {
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            for (let item of listItems) {
                arrPush.push({ value: String(item.id), label: String(item.name) });
            }
            return arrPush;
        }
    }

    isVisited: any = false;
    checkIfRemarkable(state) {
        //console.log(state);
        // this.isSubmitChecklist=false;
        const remarks = this.checklistSubmitForm.get('remarks');
        const rejectReason = this.checklistSubmitForm.get('project_reject_reason');
        const notVisitedReason = this.checklistSubmitForm.get('not_visited_reason');
        const closeReason = this.checklistSubmitForm.get('project_close_reason');
        const rescheduleDate = this.checklistSubmitForm.get('cceld_scheduledate');
        const rescheduleTime = this.checklistSubmitForm.get('cceld_scheduleTime');
        const visitedDateTime = this.checklistSubmitForm.get('visited_date_time');
        const visitedTime = this.checklistSubmitForm.get('visited_time');
        if (this.rejectionChecklists.indexOf(state) > -1 || this.auditChecklists.indexOf(state) > -1) {
            remarks.setValidators([Validators.required]);
            // this.checklistSubmitForm.controls.remarks.setValidators([Validators.required]);
            remarks.updateValueAndValidity();
            this.isRemarkable = true;
            if (state == 4 || state == 47) {
                this.isRejectReason = true;
                if (state == 4) {
                    this.projectRejectReason = this.projectRejectReasonTemp;
                } else if (state == 47) {
                    this.projectRejectReason = this.projectPermanentlyRejectReason;
                }
                rejectReason.setValidators([Validators.required]);
                rejectReason.updateValueAndValidity();
            } else {
                this.isRejectReason = false;
                rejectReason.clearValidators();
                rejectReason.updateValueAndValidity();
            }
            if (state == 6) {
                this.isNotVisited = true;
                this.isRejectReason = false;
                notVisitedReason.setValidators([Validators.required]);
                notVisitedReason.updateValueAndValidity();
            } else {
                this.isNotVisited = false;
                notVisitedReason.clearValidators();
                notVisitedReason.updateValueAndValidity();
            }
            if (state == 5) {
                this.isRemarkable = false;
                remarks.clearValidators();
                remarks.updateValueAndValidity();
                //console.log(this.isVisited);
                this.isVisited = true;
                visitedDateTime.setValidators([Validators.required]);
                visitedTime.setValidators([Validators.required]);

                visitedDateTime.updateValueAndValidity();
                visitedTime.updateValueAndValidity();
            } else {
                this.isVisited = false;
                visitedDateTime.clearValidators();
                visitedDateTime.updateValueAndValidity();
            }
            // closeReason.clearValidators();
            // closeReason.updateValueAndValidity();
            // notVisitedReason.clearValidators();
            // notVisitedReason.updateValueAndValidity();
            // rescheduleDate.clearValidators();
            // rescheduleDate.updateValueAndValidity();
            // rescheduleTime.clearValidators();
            // rescheduleTime.updateValueAndValidity();
        } else {
            remarks.clearValidators();
            remarks.updateValueAndValidity();
            rejectReason.clearValidators();
            rejectReason.updateValueAndValidity();
            notVisitedReason.clearValidators();
            notVisitedReason.updateValueAndValidity();
            this.isRemarkable = false;
            this.isRejectReason = false;
            this.isNotVisited = false;
            this.isVisited = false;
            // closeReason.clearValidators();
            // closeReason.updateValueAndValidity();
            // rescheduleDate.clearValidators();
            // rescheduleDate.updateValueAndValidity();
            // rescheduleTime.clearValidators();
            // rescheduleTime.updateValueAndValidity();
            // this.checklistSubmitForm.controls.remarks.setValidators(null);

            // console.log(this.checklistSubmitForm.controls.remarks);
        }
    }

    getClarificationListDetails(page) {
        this.showSmartSearchComponent = true;
        this.sharedServices.searchForm.next('sitesurveyorClarificationListing');
        if (localStorage.getItem('emp_auth_key')) {
            this.leadListService.getClarificationDetailsForEmployee(page, this.itemPerPage).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.clarileadData = data.result.data;
                    this.isClarificationListing = true;
                    this.isListing = "clarification_listing";
                    this.totalItem = data.result._meta.total_records;
                    this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                    this.pages = page;
                    this.createPaginationSubmitForm();
                } else {
                    console.log('error');
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }
    //project list
    getPojectListDetails(page) {
        this.showSmartSearchComponent = true;
        this.sharedServices.searchForm.next('sitesurveyorProjectStatusListing');
        if (localStorage.getItem('emp_auth_key')) {
            this.leadListService.getProjectStatusDetailsForEmployee(page, this.itemPerPage).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.projectleadData = data.result.data;
                    this.isListing = "project_status_listing";
                    this.checklistStatus = false;
                    this.totalItem = data.result._meta.total_records;
                    this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                    this.pages = page;
                    this.createPaginationSubmitForm();
                } else {
                    console.log('error');
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    // auditDataDisplay() {
    //     this.auditRole = true;
    //     this.leadListService.auditFormDisplay().pipe(take(1)).subscribe(res => {
    //         this.surveyorFormData = res.data.surveyor_form_data[0];
    //     });
    // }


    showTabData(step: number) {
        this.panelSteps = step;
    }

    toggleLoadForm() {
        if (!this.isloadExpand) {
            this.isloadExpand = true;
        } else {

            this.isloadExpand = false;
        }
    }

    wattSum() {
        this.totalWattHoursDay = 0;
        this.totalWattHoursNight = 0;
        let load_survey = [];
        this.surveyorFillFormRequest.value.load_survey.map((item) => {
            load_survey.push(...item);
        });
        load_survey.forEach((item, index) => {
            this.totalWattHoursDay += Number(item.lsf_watt_hour_energy_day_time);
            this.totalWattHoursNight += Number(item.lsf_watt_hour_energy_night_time);
        });
    }

    getActionNonActionArrays(plist: any) {
        if (plist) {
            for (let item of plist) {
                if (this.openStates.indexOf(item.project_state) > -1 && item.cceld_surveyerid == this.userData.emp_id) {
                    this.actionableList.push(item);
                } else {
                    this.nonActionableList.push(item);
                }
            }
        }
    }

    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
        });
    }

    pageSubmit() {
        let pageCurrent = this.paginationSubmitForm.controls.page_number.value;
        if (this.paginationSubmitForm.valid) {
            if (this.smartSearchFormData) {
                if (this.currentSearchTab === 'sitesurveyorProjectStatusListing') {
                    this.leadListService.getProjectStatusDetailsForEmployee(pageCurrent, this.itemPerPage, this.smartSearchFormData).pipe(take(1)).subscribe(data => {
                        if (data.status) {
                            this.projectleadData = data.result.data;
                            this.isListing = "project_status_listing";
                            this.checklistStatus = false;
                            this.totalItem = data.result._meta.total_records;
                            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                            this.pages = pageCurrent;
                            this.createPaginationSubmitForm();
                        } else {
                            console.log('error');
                        }
                    })
                } else if (this.currentSearchTab === 'sitesurveyorClarificationListing') {
                    this.leadListService.getClarificationDetailsForEmployee(pageCurrent, this.itemPerPage, this.smartSearchFormData).pipe(take(1)).subscribe(data => {
                        if (data.status) {
                            this.clarileadData = data.result.data;
                            this.isClarificationListing = true;
                            this.isListing = "clarification_listing";
                            this.totalItem = data.result._meta.total_records;
                            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                            this.pages = pageCurrent;
                            this.createPaginationSubmitForm();
                        } else {
                            console.log('error');
                        }
                    })
                }
                return;
            }
            let page = this.paginationSubmitForm.controls.page_number.value;
            if (this.isListing == 'project_status_listing') {
                this.getPojectListDetails(page);
            } else if (this.isListing == 'clarification_listing') {
                this.getClarificationListDetails(page);
            }
        }

    }


    searchProjects() {
        this.showSmartSearchComponent = false;
        this.searchForm = this.formBuilder.group({
            qType: ['', Validators.compose([Validators.required])],
            q: ['', Validators.compose([Validators.required])],
            project_status: ['', Validators.compose([Validators.required])]
        });
        this.actionableList = [];
        this.nonActionableList = [];
        this.isListing = 'project-search';
        this.getProjectStatusList();
        this.searchFormValidation();

    }

    submitSearch() {
        this.isSearchFormSubmitted = true;
        this.actionableList = [];
        this.nonActionableList = [];
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.downloadFileName = this.searchResultXlsPath + 'search_result_' + this.userData.emp_id + ".xls";
        if (this.searchForm.valid) {
            this.leadListService.searchProject(this.searchForm.value).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.leadData = data.result.data;
                    this.getActionNonActionArrays(this.leadData);
                    if (this.leadData.length > 0) {
                        this.popupMessageService.showSuccess("Data Listed Successfully!", "Success");
                    } else {
                        this.popupMessageService.showInfo("No Data Found", "Info");
                    }
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
            })
        }
    }

    searchLeads() {
        this.showSmartSearchComponent = false;
        this.searchLeadForm = this.formBuilder.group({
            qType: ['', Validators.compose([Validators.required])],
            q: ['', Validators.compose([Validators.required, Validators.pattern(/^([a-zA-Z0-9 _-]+)$/)])]
        });
        this.unprocessedLeads = [];
        this.isListing = 'lead-search';

    }

    submitLeadSearch() {
        this.isLeadSearchFormSubmitted = true;
        this.unprocessedLeads = [];
        if (this.searchLeadForm.valid) {
            this.leadListService.searchLead(this.searchLeadForm.value).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.unprocessedLeads = data.result.data;
                    if (this.unprocessedLeads.length > 0) {
                        this.popupMessageService.showSuccess("Data Listed Successfully!", "Success");
                    } else {
                        this.popupMessageService.showInfo("No Data Found", "Info");
                    }
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
            })
        }
    }


    sendPaymentLink(lead_id: number, index: number, isReload?: boolean) {
        this.sendLinkLoader = true;
        this.currentButton = index;
        this.leadPanelService.paymentLink(lead_id).pipe(take(1)).subscribe(data => {
            if (data.status == 1) {
                this.popupMessageService.showSuccess('Payment link sent successfully.', 'success');
                this.sendLinkLoader = false;
                if (isReload) {
                    this.getTodaysServeyList();
                }
            } else {
                this.popupMessageService.showError(data.error_message, 'error');
                this.sendLinkLoader = false;
            }
        }, (error) => {
            this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
            this.sendLinkLoader = false;
        });
    }

    /**
     * Convert Data for Select
     */
    convertProjectStatusForSelect(listItems: any) {
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            for (let item of listItems) {
                arrPush.push({ value: String(item.pmstate_id), label: String(item.pmstate_name) });
            }
            return arrPush;
        }
    }

    searchFormValidation() {
        const q = this.searchForm.get('q');
        const project_status = this.searchForm.get('project_status');
        this.searchForm.get('qType').valueChanges.subscribe(
            (q_type: string) => {
                if (q_type != 'project_status') {
                    q.setValidators([Validators.required, Validators.pattern(/^([a-zA-Z0-9 _-]+)$/)]);
                    project_status.clearValidators();
                    this.searchForm.controls.project_status.setValue('0');
                } else {
                    project_status.setValidators([Validators.required]);
                    q.clearValidators();
                }
                q.updateValueAndValidity();
                project_status.updateValueAndValidity();
            }
        )
    }

    getProjectStatusList() {
        this.leadListService.projectStatusList().pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.projectStatusList = this.convertProjectStatusForSelect(data.data);
            } else {
                this.popupMessageService.showError(data.error_message, "Error!");
            }
        }, (error) => {
            this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
        })
    }

    getTodaysServeyList() {
        this.showSmartSearchComponent = true;
        this.sharedServices.searchForm.next('sitesurveyorSurveyList')
        this.totalSurveyData = [];
        this.todaySurveyData = [];
        this.nextSevenDaySurvey = [];
        this.pastSevenDaySurvey = [];
        if (localStorage.getItem('emp_auth_key')) {
            this.leadListService.getLeadDetailsForEmployee().pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.totalSurveyData = data.result.data;
                    this.isListing = "today_survey";
                    this.getTodaySurveyArrays(this.totalSurveyData);
                    this.isClarificationListing = false;
                    this.isProjectDetailData = false;
                    this.isClarificationListing = false;
                } else {
                    console.log('error');
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    getTodaySurveyArrays(plist: any) {
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentDay = currentDate.getDate();
        let currentYear = currentDate.getFullYear();
        let dateAfterSevenDays = currentDate.getTime() + (7 * 24 * 60 * 60 * 1000);
        let dateBeforeSevenDays = currentDate.getTime() - (7 * 24 * 60 * 60 * 1000);
        if (plist) {
            for (let item of plist) {
                let sc_date = new Date(item.cceld_scheduledate);
                let scCurrentMonth = sc_date.getMonth() + 1;
                let scCurrentday = sc_date.getDate();
                let scCurrentYear = sc_date.getFullYear();
                if ((currentDay == scCurrentday) && (currentMonth == scCurrentMonth) && (currentYear == scCurrentYear)) {
                    this.todaySurveyData.push(item);
                } else if ((sc_date.getTime() > currentDate.getTime()) && (sc_date.getTime() <= dateAfterSevenDays)) {
                    this.nextSevenDaySurvey.push(item);
                } else if ((sc_date.getTime() < currentDate.getTime()) && (sc_date.getTime() >= dateBeforeSevenDays)) {
                    this.pastSevenDaySurvey.push(item);
                }
            }
        }
    }

    openAddCashPopup(paymentLeadId, consumerId, projectId) {
        this.createAddCashForm();
        this.cashDetailForm.controls.lead_id.setValue(paymentLeadId);
        this.cashDetailForm.controls.consumer_id.setValue(consumerId);
        this.cashDetailForm.controls.project_id.setValue(projectId);
        if (!this.openCashDeatilBox) {
            this.openCashDeatilBox = true;
        } else {
            this.openCashDeatilBox = false;
        }

    }

    createAddCashForm() {
        this.cashDetailForm = this.formBuilder.group({
            lead_id: [''],
            consumer_id: [''],
            project_id: [''],
            cashReceived: ['', Validators.compose([Validators.required])],
            receiptNo: ['', Validators.compose([Validators.required])]
        });

    }

    submitCashPayment() {
        if (this.cashDetailForm.valid) {
            this.saveCashPaymentLoader = true;
            this.leadListService.saveCashPaymentDetails(this.cashDetailForm.value).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.popupMessageService.showSuccess(data.result.data, "Lead revoked successfully.");
                    this.openCashDeatilBox = false;
                    this.saveCashPaymentLoader = false;
                    this.cashDetailForm.reset();
                    this.getTodaysServeyList();
                } else {
                    this.openCashDeatilBox = false;
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.openCashDeatilBox = false;
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
            })
        }
    }

    getProjectReason() {
        this.leadListService.projectCloseReasonList().pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.convertForSelectForProjectReason(data.data);
            } else {
                this.popupMessageService.showError(data.error_message, "Error!");
            }
        }, (error) => {
            this.popupMessageService.showError("Server Error.", "Error!");
        })
    }

    getSurveyNotVisitedReason() {
        this.leadListService.getSurveyNotVisitedReason().pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.convertForSelectForNotVisitedReason(data.data);
            } else {
                this.popupMessageService.showError(data.error_message, "Error!");
            }
        }, (error) => {
            this.popupMessageService.showError("Server Error.", "Error!");
        })
    }

    convertForSelectForProjectReason(listItems: any) {

        if (listItems.length > 0) {
            for (let item of listItems) {
                if (item.pcrm_site_surveyor == 1 && item.pcrm_type == 1) {
                    this.projectCloseReason.push({ value: String(item.pcrm_id), label: String(item.pcrm_reason) });
                }
                if (item.pcrm_site_surveyor == 1 && item.pcrm_type == 2) {
                    if (item.show_in_which_case == 1) {
                        this.projectRejectReasonTemp.push({ value: String(item.pcrm_id), label: String(item.pcrm_reason) });
                    } else if (item.show_in_which_case == 2) {
                        this.projectPermanentlyRejectReason.push({ value: String(item.pcrm_id), label: String(item.pcrm_reason) });
                    } else {
                        this.projectRejectReasonTemp.push({ value: String(item.pcrm_id), label: String(item.pcrm_reason) });
                        this.projectPermanentlyRejectReason.push({ value: String(item.pcrm_id), label: String(item.pcrm_reason) });
                    }

                    this.rejectReasonList.push(item.pcrm_id);
                }
            }
        }
    }

    convertForSelectForNotVisitedReason(listItems: any) {
        if (listItems.length > 0) {
            for (let item of listItems) {
                this.projectNotVisitedReason.push({ value: String(item.snvm_id), label: String(item.snvm_reason) });
                this.projectNotVisited.push(String(item.snvm_id));
            }
        }
    }

    checkForNotVisitedReason(state) {
        const remarks = this.checklistSubmitForm.get('remarks');
        const rejectReason = this.checklistSubmitForm.get('project_reject_reason');
        const closeReason = this.checklistSubmitForm.get('project_close_reason');
        const notVisitedReason = this.checklistSubmitForm.get('not_visited_reason');
        const rescheduleTime = this.checklistSubmitForm.get('cceld_scheduleTime');
        const rescheduleDate = this.checklistSubmitForm.get('cceld_scheduledate');
        if (this.projectNotVisited.indexOf(state) > -1) {
            if (state == 1) {
                //lead not qualified
                this.isCloseReason = true;
                closeReason.setValidators([Validators.required]);
                closeReason.updateValueAndValidity();
                this.isRescheduleSurvey = false;
                rescheduleTime.clearValidators();
                rescheduleTime.updateValueAndValidity();
                rescheduleDate.clearValidators();
                rescheduleDate.updateValueAndValidity();
            } else if (state == 2) {
                this.isRescheduleSurvey = true;
                this.isCloseReason = false;
                closeReason.clearValidators();
                closeReason.updateValueAndValidity();
                rescheduleDate.setValidators([Validators.required]);
                rescheduleDate.updateValueAndValidity();
                rescheduleTime.setValidators([Validators.required]);
                rescheduleDate.updateValueAndValidity();
            } else if (state == 3) {
                this.isRescheduleSurvey = false;
                this.isCloseReason = false;
                closeReason.clearValidators();
                closeReason.updateValueAndValidity();
                rescheduleDate.clearValidators();
                rescheduleDate.updateValueAndValidity();
                rescheduleTime.clearValidators();
                rescheduleTime.updateValueAndValidity();
            }
        } else {
            remarks.clearValidators();
            // rejectReason.clearValidators();
            // this.checklistSubmitForm.controls.remarks.setValidators(null);
            remarks.updateValueAndValidity();
            this.isRemarkable = false;
            this.isCloseReason = false;
            this.isNotVisited = false;
            this.isRescheduleSurvey = false;
            remarks.clearValidators();
            closeReason.clearValidators();
            closeReason.updateValueAndValidity();
            rescheduleDate.clearValidators();
            rescheduleDate.updateValueAndValidity();
            rescheduleTime.clearValidators();
            rescheduleTime.updateValueAndValidity();
        }
    }
    scheduleCalendarFocusEvent() {
        //window.scrollTo(0, 200);
    }
    checkScheduledSiteSurvey() {
        let sDate = this.checklistSubmitForm.get('cceld_scheduledate').value;
        this.Date = new Date(sDate).getDate();
        let todaysDate = new Date().getDate();
        if (this.Date === todaysDate) {
            this.timeSlot();
        } else {
            this.newSurveyTime = this.surveyTime;
        }
        this.siteSurveyDatabyDate = [];

        this.leadListService.getSiteSurveyByScheduleDate(this.checklistSubmitForm.value).pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.siteSurveyDatabyDate = data.data;
            } else {
                console.log(data.error_message, "Error!");
            }
        }, (error) => {
            console.log("Server Error.", "Error!");
        })
    }

    timeSlot() {
        this.newSurveyTime = [];
        // {
        //     if (10 <= this.hour && 12 > this.hour) {
        //         this.newSurveyTime = this.surveyTime;
        //     } else if (12 <= this.hour && 14 > this.hour) {
        //         this.newSurveyTime = this.surveyTime.slice(1, 4);
        //     } else if (14 <= this.hour && 16 > this.hour) {
        //         this.newSurveyTime = this.surveyTime.slice(2, 4);
        //     } else {
        //         this.newSurveyTime = this.surveyTime.slice(3, 4);
        //     }
        // }

        if(this.hour <10 || this.hour >=10 && this.hour <12){
            this.newSurveyTime=this.surveyTime;
        }
        else if(this.hour >=12 && this.hour <14){
            this.newSurveyTime=this.surveyTime.slice(1);
        }
        else if(this.hour >=14 && this.hour<16){
            this.newSurveyTime=this.surveyTime.slice(2);
        }
        else if(this.hour>=16 && this.hour <18){
            this.newSurveyTime=this.surveyTime.slice(3);
        }
        else{
            this.newSurveyTime=[];
        }
       // console.log('survey',this.newSurveyTime);
    }

    findInvalidControls() {
        const invalid = [];
        const controls = this.checklistSubmitForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }
    smartSearchResults($event) {
        this.totalItem = $event._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = 1;
        this.createPaginationSubmitForm();
        let searchResult = $event.data;
        this.sharedServices.searchForm.pipe(take(1)).subscribe((data) => {
            this.currentSearchTab = data;
        })
        this.sharedServices.formDataSmartSearch.pipe(take(1)).subscribe((data) => {
            this.smartSearchFormData = data;
        })
        if (this.currentSearchTab === 'sitesurveyorProjectStatusListing') {
            this.projectleadData = searchResult;
        } else if (this.currentSearchTab === 'sitesurveyorLeadList') {
            this.actionableList = [];
            this.nonActionableList = [];
            this.getActionNonActionArrays(searchResult);
            this.totalSurveyData = [];
            this.todaySurveyData = [];
            this.nextSevenDaySurvey = [];
            this.pastSevenDaySurvey = [];
            this.totalSurveyData = searchResult;
            this.getTodaySurveyArrays(this.totalSurveyData);
        } else if (this.currentSearchTab === 'sitesurveyorSurveyList') {
            this.totalSurveyData = [];
            this.todaySurveyData = [];
            this.nextSevenDaySurvey = [];
            this.pastSevenDaySurvey = [];
            this.totalSurveyData = searchResult;
            this.getTodaySurveyArrays(this.totalSurveyData);
        }
        else if (this.currentSearchTab === 'sitesurveyorClarificationListing') {
            this.clarileadData = searchResult;
        }
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (this.pageCount < (this.paginationSubmitForm.controls.page_number.value + event.key))
            event.preventDefault();
        if (!pattern.test(inputChar) && event.keyCode != 8) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    ConfirmDeleting: boolean = false;
    pdoc_data: any;
    confirmDeleteDoc(data, pid: any = null) {
        this.ConfirmDeleting = true;
        this.pdoc_data = data;
        this.pid = pid;

    }

    hideConfirmDeleting() {
        this.ConfirmDeleting = false;
    }

    DeleteDocument(pdoc_data, pid: any = null) {
        let pdoc_id = pdoc_data.pdoc_id;
        this.leadListService.deletePdoc(pdoc_id).pipe(take(1)).subscribe((data) => {
            if (data.status == 1) {
                this.ConfirmDeleting = false;
                if (pid) {
                    console.log(pid);
                    if(pdoc_data.pdoc_type === 'GST certificate') {
                        this.createhandoff.controls.gst.patchValue('');
                    }
                    this.getHandOffData(pid);
                } else
                    this.getUploadedDocumentsForSurveyor(pdoc_data.pdoc_projecitid);
                this.popupMessageService.showInfo('Document Removed', '!Info');
                //this.uploadDocument.reset();
                this.handOfFileForm.reset();

            } else {
                this.ConfirmDeleting = false;
                this.popupMessageService.showInfo('Document Removed failed', '!Info');
            }

        });
    }

    checkTimeSlot() {
        let date=(this.customerFillFormRequest) ? this.customerFillFormRequest.controls.cceld_scheduledate : this.checklistSubmitForm.controls.visited_date_time.value;
        let sDate = new Date(date).getDate();
        let todaysDate = new Date().getDate();
        if (sDate === todaysDate && this.customerFillFormRequest) {
            this.timeSlot();
        } else {
            this.newSurveyTime = this.surveyTime;
        }
    }

    HandoffLeadListing: any = [];
    advanceReceived() {
        this.isListing = 'advance-received';
        this.showSmartSearchComponent = false;
        this.HandoffLeadListing = [];
        if (localStorage.getItem('emp_auth_key')) {
            this.leadListService.getSurveyorHandOffListing().pipe(take(1)).subscribe(data => {
                //console.log(data);
                if (data.status) {
                    this.HandoffLeadListing = data.result.data;
                } else {
                    console.log('error');
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
        this.createFileUploadForm();
    }
    HandoffLeadListingData: any;
    //result :1;
    creatinghandoff: any = 0;
    createHandOff(projectId: any = null) {
        //console.log(projectId);
        this.creatinghandoff = 0;
        this.isListing = 'create-handoff';
        this.showSmartSearchComponent = false;
        let today = new Date();
        this.createHandoffForm(projectId);
        if (localStorage.getItem('emp_auth_key')) {
            this.getHandOffData(projectId);
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    getHandOffData(projectId) {
        this.leadListService.getHandOffData(projectId).pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.HandoffLeadListingData = data.result;
                this.currentProjectId = data.result.consumerProject.project_id;
                // Make gst mandatory for commercial project
                if(this.HandoffLeadListingData.cceLeaddata.cceld_buildingtype == "commercial") {
                    this.createhandoff.controls.gst.setValidators([Validators.required, Validators.pattern('[a-zA-Z0-9-_]{15}')]);
                } else{
                    this.createhandoff.controls.gst.setValidators([Validators.pattern('[a-zA-Z0-9-_]{15}')]);
                }
                this.createhandoff.controls.gst.updateValueAndValidity();
            } else {
                console.log('error');
            }
        })
    }

    handOfFileForm: FormGroup;
    createFileUploadForm() {
        this.handOfFileForm = this.formBuilder.group({
            fileName: ['', Validators.compose([Validators.required])],
            uploadFile: [],
        });
    }

    createHandoffForm(project_id?) {
        this.createhandoff = this.formBuilder.group({
            gst: [''],
            h_customization_remark: [''],
            h_remark: [''],
            commitment_remark: [''],
            h_customization_status: ['', Validators.compose([Validators.required])],
            project_id: [project_id, Validators.compose([Validators.required])],
            plan: ['', Validators.compose([Validators.required])],
        });
    }

    submitHandoffdata: boolean = false;
    submitHandoff() {
        //console.log(this.createhandoff.value);
        if (this.createhandoff.valid) {

            let checkgst=this.HandoffLeadListingData.ProjectDocuments.findIndex(item => item.pdoc_type === 'GST certificate');

            // If gst entered then gst certificate is mandatory
            if(this.createhandoff.controls.gst.value && checkgst== -1) {
                this.submitHandoffdata = true;
                this.popupMessageService.showError('Please upload GST Certificate.', "Error!");
                return false;
            }

            var checkgst: any;
             let checkPriceEstimator=this.HandoffLeadListingData.ProjectDocuments.findIndex(item => item.pdoc_type === 'Price Estimator');
           if(checkPriceEstimator != -1){
             if(this.HandoffLeadListingData.cceLeaddata.cceld_buildingtype == "residential" || checkgst!= -1){
                this.creatinghandoff = 1;
                this.leadListService.submitHandoffdata(this.createhandoff.value).pipe(take(1)).subscribe(data => {
                this.creatinghandoff = 0;
                if (data.status) {
                    this.popupMessageService.showSuccess('Handoff submitted successfully.', "Success");
                    this.advanceReceived();
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, error => {
                this.popupMessageService.showError(error, "Error!");
            })
            }else{
                this.submitHandoffdata = true;
                this.popupMessageService.showError('Please upload GST Certificate.', "Error!");
                this.getFormValidationErrors();
            }
            }else{
                this.submitHandoffdata = true;
                this.popupMessageService.showError('Please upload Price Estimator.', "Error!");
                this.getFormValidationErrors();
            }

        } else {
            this.submitHandoffdata = true;
            this.popupMessageService.showError('Please Fill Mandatory Data.', "Error!");
            this.getFormValidationErrors();
        }
    }

    getFormValidationErrors() {
        Object.keys(this.createhandoff.controls).forEach(key => {

            const controlErrors: ValidationErrors = this.createhandoff.get(key).errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
            }
        });
    }

    //view interaction log
    viewinteractionlog: boolean = false;
    interactionLog: any;
    getIntercationLog(projectId: any) {
        this.leadListService.getFollowupIntration(projectId).pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.interactionLog = data.data.fui_history_data;
                this.viewinteractionlog = true;
            } else {
                this.interactionLog = [];
                this.viewinteractionlog = true;
                //this.popupMessageService.showError(data.error_message, "Error!");
            }
        }, error => {
            //this.popupMessageService.showError(error, "Error!");
        })
    }

    //close view interaction log
    ViewinteractionClose() {
        console.log('hello close interaction');
        this.viewinteractionlog = false;
    }

    clearfields(i: any) {
        if (i == 1) {
            this.createhandoff.controls.h_customization_remark.setValidators([Validators.required]);
        } else {
            this.createhandoff.controls.h_customization_remark.setValue("");
            this.createhandoff.controls.h_customization_remark.clearValidators();
        }
        this.createhandoff.controls.h_customization_remark.updateValueAndValidity();
    }

    toggleVisibility(e) {
        if (e.target.checked) {
            let fname = this.surveyorFillFormRequest.controls.sf_firstname.value;
            let lname = this.surveyorFillFormRequest.controls.sf_lastname.value;
            let mobile = this.surveyorFillFormRequest.controls.sf_mobileno.value;
            this.surveyorFillFormRequest.controls.cp_firstname.setValue(fname);
            this.surveyorFillFormRequest.controls.cp_lastname.setValue(lname);
            this.surveyorFillFormRequest.controls.cp_mobileno.setValue(mobile);
        } else {
            this.surveyorFillFormRequest.controls.cp_firstname.setValue("");
            this.surveyorFillFormRequest.controls.cp_lastname.setValue("");
            this.surveyorFillFormRequest.controls.cp_mobileno.setValue("");
        }
    }
    createCustomerNotificationForm() {
        let text = "Dear Customer, we tried reaching you! You can get in touch with our surveyor " + this.userData.emp_firstname + " on " + this.userData.emp_mobileno + ". Team Solar by Luminous";
        this.customerNotificationForm = this.formBuilder.group({
            mobile: [''],
            sms_text: [text]
        })
    }

    submitCustomerNotification(mob: any) {
        this.customerNotificationForm.controls.mobile.setValue(this.customermobile);
      //  console.log(this.customerNotificationForm.value);
      this.leadListService.sendGlobalSms(this.customerNotificationForm.value).pipe(take(1)).subscribe((data => {
            if (data.status === 1) {
                this.popupMessageService.showSuccess('Notification sent', 'success!')
            } else {
                this.popupMessageService.showError(data.error_message, 'error!')
            }
        }))
    }

    addLead() {
        this.isListing = 'add-lead';
        this.showSmartSearchComponent = false;
        this.createFllFormRequestForm();
    }

    customerFillFormRequest: FormGroup;
    isSubmitCustomerFillFormRequest: boolean = false;
    createFllFormRequestForm() {
        this.customerFillFormRequest = this.formBuilder.group({
            cceld_reference: [''],
            cceld_reference_id: [''],
            cceld_referenceremarks: [''],
            cceld_firstname: ['', Validators.compose([Validators.required])],
            cceld_middlename: [''],
            cceld_lastname: ['', Validators.compose([Validators.required])],
            cceld_mobileno: ['', Validators.compose([Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
            cceld_alternatecntctno: ['',Validators.compose([Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
            cceld_email: ['', Validators.compose([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            cceld_address1: [''],
            cceld_address2: [''],
            cceld_landmark: [''],
            cceld_locality: [''],
            cceld_city: [''],
            cceld_other: [''],
            cceld_state: [''],
            cceld_stateother: [''],
            cceld_country: ['356'],
            cceld_pincode: ['',Validators.compose([Validators.pattern(/^\(??([0-9]{6})$/)])],
            cceld_contactperson: [''],
            cceld_contactnumber: ['', Validators.compose([Validators.pattern(/^[7-9]{1}[0-9]{9}$/)])],
            cceld_buildingtype: [''],
            cceld_sitetype: [''],
            proposal_type:[''],
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
            cceld_scheduledate: [this.minDate],
            cceld_scheduletime: ['4'],
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
            cceld_surveyerid: [''],
            cceld_notes: [''],
            cceld_remarks: [''],
            cceld_createdby: [this.userData.emp_id],
            cceld_lastmodifiedby: [this.userData.emp_id],
            cceld_approvedrejected: ['1'],
            cceld_leadid: [''],
            cceld_consumerid: [''],
            cceld_other_pincode: [0],
            // sf_project_type:['',Validators.required],
            lead_callowner_duration: ['50:00:00'],
            role_id: [''],
            button_value: [''],
            other_remark: [''],
            cceld_move_surveyour: ['1'],
        })
        this.getLeadRefrenceData();
        this.allStatesAndCitiesData();
        this.changeLeadFormFunction();
        this.checkTimeSlot();
    }

    get MoveProjectTo(){
        return this.customerFillFormRequest.get('cceld_move_surveyour')
    }

    isCommercialProject: boolean = false;
    followup_surveyour: any;
    changeLeadFormFunction() {
       let moveProjectTo=this.customerFillFormRequest.get('cceld_move_surveyour');
       this.customerFillFormRequest.controls.cceld_buildingtype.valueChanges.subscribe(val => {
            this.isCommercialProject = false;
            if (val == "commercial") {
                this.isCommercialProject = true;
                // moveProjectTo.setValidators(Validators.required);
            }
            else{
                // moveProjectTo.clearValidators();
            }
            // moveProjectTo.updateValueAndValidity();
        });
        const scheduleTime = this.customerFillFormRequest.get('cceld_scheduleTime');
        const scheduleDate = this.customerFillFormRequest.get('cceld_scheduledate');
        this.customerFillFormRequest.controls.cceld_move_surveyour.valueChanges.subscribe(val => {
            this.followup_surveyour = val;
            //  if(val==0){
            //      scheduleTime.clearValidators();
            //     scheduleDate.clearValidators();

            //  } else if(val==1){
            //      scheduleTime.setValidators([Validators.required]);
            //      scheduleDate.setValidators([Validators.required]);
            //  }
            //  scheduleTime.updateValueAndValidity();
            // scheduleDate.updateValueAndValidity();


        });
    }

    refrenceList: Array<string> = [];
    getLeadRefrenceData() {
        this.refrenceList = [];
        let refArr = [];
        this.leadPanelService.getLeadRefrence().pipe(take(1)).subscribe((data) => {
            console.log(data.data);
            if (data.status == 1) {
                for (let item of data.data) {
                    refArr.push({ value: String(item.lr_id), label: String(item.lr_name) });
                }
                this.refrenceList = refArr;
            }
        });
    }

    allStates: any;
    stateList: any;
    allCities: any;
    cityList: any;
    allStatesAndCitiesData() {
        this.leadPanelService.getAllStates().pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.allStates = data.data;
                this.stateList = this.convertForSelectstatecity(this.allStates, 'state');
            }
        });

        this.leadPanelService.getAllCities().pipe(take(1)).subscribe(data => {
            if (data.status) {
                this.allCities = data.data;
                this.cityList = this.convertForSelectstatecity(this.allCities, 'city');
            }
        });
    }

    ifStateIfCity(type: String, formType?: String) {
        if (type == 'state') {
            if (formType == 'form-fill') {
                this.cityList = this.getCitybyState(this.customerFillFormRequest.get("cceld_state").value);
            }
        } else if (type == 'city') {
            if (formType == 'form-fill') {
                this.customerFillFormRequest.controls['cceld_state'].setValue(this.setStatebyCity(this.customerFillFormRequest.get("cceld_city").value));
            }
        }
    }

    getCitybyState(state_id: number) {
        let cityList = [];
        (this.customerFillFormRequest) ? this.customerFillFormRequest.controls['cceld_city'].setValue('') : '';
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
    }

    convertForSelectstatecity(listItems: any, type?: string) {
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

    loading: any;
    submitConsumerFormRequest(buttonValue: number) {
        if (buttonValue == 2) {
            this.isSubmitCustomerFillFormRequest = true;
            if (this.customerFillFormRequest.valid) {
                this.loading = true;
                this.leadPanelService.commercialprojectSubmitForm(this.customerFillFormRequest.value, buttonValue).pipe(take(1)).subscribe(data => {
                    this.isSubmitCustomerFillFormRequest = false;
                    this.loading = false;
                    if (data.status == 1) {

                        // auto accept site surveyor
                        if(this.customerFillFormRequest.value.cceld_move_surveyour == 1) {
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

                            this.leadListService.checklistSubmitService(data.result.project_id, checkList, true).subscribe();
                        }


                        this.alertService.success('Your Information Submitted Successfully.', true);
                        this.customerFillFormRequest.reset();
                        this.createFllFormRequestForm();
                        this.popupMessageService.showSuccess('Lead Created Successfully.', 'success');
                        this.getLeadListDetails('surveyor_action_listing');

                    } else {
                        console.log('error in submit');
                        this.alertService.error(data.error_message);
                        this.popupMessageService.showError(data.error_message, 'Error!');
                    }
                });
            } else {
                this.isSubmitCustomerFillFormRequest = false;
                this.popupMessageService.showError("Please fill all mandatory details.", "error");
                Object.keys(this.customerFillFormRequest.controls).forEach(key => {
                    const controlErrors: ValidationErrors = this.customerFillFormRequest.get(key).errors;
                    if (controlErrors != null) {
                        Object.keys(controlErrors).forEach(keyError => {
                            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                        });
                    }
                });
            }

        }

    }
    localityList: any;
    selectedCity: any;
    selectedState: any;
    isPincode: any;
    otherPincode: any;
    knowYourStateCity(searchValue: string, type?: String) {
        if (this.customerFillFormRequest.get('cceld_pincode').valid || searchValue.length == 6) {
            this.leadPanelService.getStateCityData(searchValue).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.isPincode = false;
                    this.otherPincode = false;
                    if (type == 'partner-form' || type == 'form-fill' || type == 'survey-booking' || 1 == 1) {
                        this.selectedState = data.data.states_data[0].id;
                        this.cityList = this.getCitybyState(this.selectedState);
                        this.selectedCity = data.data.district_data[0].id;
                        this.localityList = this.convertForSelectlocality(data.data.locality_data);
                        return;
                    } else {
                        this.cityList = this.convertForSelect(data.data.district_data);
                        this.stateList = this.convertForSelect(data.data.states_data);

                        this.customerFillFormRequest.controls['cceld_city'].setValue(data.data.district_data[0].id);
                        this.customerFillFormRequest.controls['cceld_state'].setValue(data.data.states_data[0].id);
                    }
                } else {
                    this.otherPincode = true;
                }
            })
        } else {
            if (type == 'form-fill') {
                this.customerFillFormRequest.controls['cceld_city'].setValue('');
                this.customerFillFormRequest.controls['cceld_state'].setValue('');
                this.customerFillFormRequest.controls['cceld_locality'].setValue('');
            }
            this.isPincode = false;
        }
    }

    getSurveyFormCityStateFromPin (searchValue: string) {
        if(this.surveyorFillFormRequest.get('sf_pincode').valid && searchValue.length == 6) {
        this.leadPanelService.getStateCityData(searchValue).pipe(take(1)).subscribe(data => {
                if (data.status) {
                    this.surveyorFillFormRequest.controls.sf_stateid.patchValue(data.data.states_data[0].id);
                    this.surveyorFillFormRequest.controls.sf_cityid.patchValue(data.data.district_data[0].id);
                }
            });
        } else {
            this.surveyorFillFormRequest.controls.sf_stateid.patchValue(null);
            this.surveyorFillFormRequest.controls.sf_cityid.patchValue(null);
        }
    }

}

