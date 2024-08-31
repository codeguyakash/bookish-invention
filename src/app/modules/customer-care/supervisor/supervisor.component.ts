import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LeadPanelService } from '../services/lead-panel.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { LEAD_PANEL_FORM } from './../../../static/static';
import { SITE_SURVEY } from './../../../static/static';
import { LeadListService } from '../../employee-panel/services/lead-list.service';
import { SharedServices } from '../../../services/shared.services';
import * as globals from '../../../static/static';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { element } from 'protractor';

declare var jquery: any;
declare var $: any;

@Component({
    templateUrl: './supervisor.component.html',
    styleUrls: ['./supervisor.component.css']
})
export class CCESupervisor implements OnInit {
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
    value: Date;
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
    selectSiteSurveyorFlag;
    surveyerid_value;
    surveyRequest: FormGroup;
    isSurveyFormVisible: boolean;
    site_survey: any = SITE_SURVEY;
    isSubmitSurveyRequest: boolean;
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
    showCceForm: Boolean = false;
    queryList: any;
    isListing: string;
    isSubmitQueryUpdate: boolean;
    isLoader: boolean;
    isValid: boolean;
    paginationSubmitForm: FormGroup;
    actionLoader: string = '';
    leadBulkUploadForm: FormGroup;
    leadBulkSuccessData: any = [];
    leadBulkFailedData: any = [];
    rejectedLeads: any = [];
    isAllSelected = false;
    surveyorRejectedProject: (string | number)[] = [];
    rejectedProjects: any = [];
    coldBucketLeadsProject: any = [];
    reallocationForm: FormGroup;
    leadReviveForm: FormGroup;
    projectReviveForm: FormGroup;
    pDataForReallocation: any;
    newSurveyTime: any = [];
    hour = new Date().getHours();
    showSmartSearchComponent: Boolean = false;
    isSupervisor2: Boolean = false;
    surveyTime: Array<any> = [
        { value: '1', label: '10:00-12:00' },
        { value: '2', label: '12:00-14:00' },
        { value: '3', label: '14:00-16:00' },
        { value: '4', label: '16:00-18:00' },
    ];
    leadWithDuplicateData: any = [];
    public individualRejectCOunt = false;
    rejectedLeadsCount: any;
    constructor(
        private route: Router,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadPanelService: LeadPanelService,
        private leadListService: LeadListService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService,
        private sharedServices: SharedServices
    ) { }

    ngOnInit() {
        // this.rightMove();
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
            let skillArray = (this.userData.skill_level_ids).split(",");
            this.isSupervisor2 = (skillArray.indexOf('56') >= 0) ? true : false;
        }
        this.leadBulkUpload();
        this.knowSiteSurveyor();
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
    //         } else if (localStorage.getItem('role_id') == '13') {
    //             this.route.navigateByUrl('/employee-panel/marketing');
    //         }
    //     } else {
    //         this.route.navigateByUrl('/employee/login');
    //     }
    // }

    /**
     * @description: function handled file dropped as event and serve as same in file change event of form using
     * @developer: Roshan
     */
    handleFilesDropped(event: any) {
        let eventAsSelectfile = { 'target': { 'files': event } };
        this.fileChange(eventAsSelectfile);
    }


    leadBulkUpload() {
        this.showSmartSearchComponent = false;
        this.leadBulkUploadForm = this.formBuilder.group({
            bulkUploadFile: ['', Validators.compose([Validators.required])],
        });

        this.showQueryForm = false;
        this.showCceForm = false;
        this.isSubmitCallRescheduleRequest = false;
        this.isListing = 'bulk_upload';
        this.leadBulkSuccessData = [];
        this.leadBulkFailedData = [];
        this.leadWithDuplicateData = [];
    }

    fileChange(event: any) {
        this.dupDataPopUp = false;
        this.isListing = 'bulk_upload';
        if (localStorage.getItem('emp_auth_key')) {
            this.actionLoader = 'upload_loader';
            let eventClone = event;
            let extType = event.target.files[0].type;
            let ext = eventClone.target.files[0].name.split('.').pop();
            this.sharedServices.docsToBase64(event, ["xls", "xlsx", "XLS", "XLSX"]).then(data => {
                this.subscription = this.leadListService.uploadBulkDocument(String(data), ext, extType).subscribe(data => {
                    if (data.status == 1) {
                        this.leadBulkSuccessData = data.data.successData;
                        this.leadBulkFailedData = data.data.FailedData;
                        this.leadWithDuplicateData = data.data.leadWithDuplicateData;
                        this.popupMessageService.showSuccess("File Uploaded Successfully", "Success!");
                        this.actionLoader = '';

                    } else if (data.error_code != 0) {
                        this.popupMessageService.showError(data.error_message, "Error!");
                        this.actionLoader = '';
                    }
                }, (error) => {
                    this.popupMessageService.showError("Error in file upload.", "Upload Error!");
                    this.actionLoader = '';
                });
            }).catch(data => {
                this.actionLoader = '';
                this.popupMessageService.showError(data, "Invalid File Type!");
                //this.alertService.error(data);
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    /*
    * Select All Reject Leads
    */
    toggleAll(event) {
        this.isAllSelected = !this.isAllSelected
        if (event.target.checked) {
            this.surveyorRejectedProject.length = 0
            for (const rejectedLeadsList of this.rejectedLeads) {
                this.surveyorRejectedProject.push(rejectedLeadsList.project_id);
            }
            this.individualRejectCOunt = true;
        }

        if (!event.target.checked) {
            this.surveyorRejectedProject = [];
            this.individualRejectCOunt = !this.individualRejectCOunt;
        }
    }
    /*
    * Select Individual Reject Lead
    */
    toggleProject(event, projectId) {
        const lead = this.surveyorRejectedProject.includes(projectId);
        if (event.target.checked) {
            if (!lead) {
                this.surveyorRejectedProject.push(projectId);
                this.isAllSelected = this.surveyorRejectedProject.length === this.rejectedLeadsCount ? true : false;
            }
        }
        if (!event.target.checked) {
            if (lead) {
                this.isAllSelected = false;
                const index = this.surveyorRejectedProject.indexOf(projectId);
                this.surveyorRejectedProject.splice(index, 1);
            }
        }
    }
    consumerLeadspriority: any=[];
    bulkpriority:boolean=false;
    toggleAllLeadsPriority(event) {
        this.isAllSelected = !this.isAllSelected
        if (event.target.checked) {
            for (const data of this.leadsListCce) {
                this.consumerLeadspriority.push(data.consumerLead.lead_id);
            }
            this.bulkpriority=true;
          }
        if (!event.target.checked) {
            this.consumerLeadspriority = [];
            this.bulkpriority=false;
        }
    }
    bulkSavePriority(){
        if(this.consumerLeadspriority){
            this.leadListService.updateLeadspriority('', 1,this.consumerLeadspriority)
            .subscribe(
                data => {
                    if (data.status == 1) {
                        this.getListLeadsCce(this.pages);
                        this.popupMessageService.showSuccess('Leads Priority Updated', 'Success');
                    } else {
                        this.popupMessageService.showError('Priority Update faile', 'Error');
                    }
                });
            }
    }

    surveyorRejectedProjects() {
        this.sharedServices.searchForm.next('surveyorRejected');
        this.showSmartSearchComponent = true;
        this.rejectedLeads = [];
        this.isListing = 'surveyor_rejections';
        this.subscription = this.leadPanelService.getSurveyorRejectedProjects().subscribe(data => {
            if (data.status == 1) {
                this.rejectedLeads = data.data;
                this.rejectedLeadsCount = this.rejectedLeads.length;
            } 
            else {
                this.popupMessageService.showError(data.error_message , 'Error');
                this.actionLoader = '';
            }
        }, (error) => {
            this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
            this.actionLoader = '';
        });
    }
    /**
     * @description: page record for rejected project by CCE Supervisor
     * @developer:roshan
     */
    followupRejectedProjects(page) {
        this.sharedServices.searchForm.next('followupRejected');
        this.showSmartSearchComponent = true;
        this.rejectedProjects = [];
        this.isListing = 'followup_rejections';
        this.subscription = this.leadPanelService.getFollowupRejectedProjects(page, this.itemPerPage).subscribe(data => {
            if (data.status == 1) {
                this.rejectedProjects = data.data;
                this.totalItem = data._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
                this.createPaginationSubmitForm();
            } else {
                this.popupMessageService.showError('Error in listing projects!', 'Error');
                this.actionLoader = '';
            }
        }, (error) => {
            this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
            this.actionLoader = '';
        });
    }

    /**
    * @description: page record for rejected project by CCE Supervisor
    * @developer:roshan
    */
    getRejectedLeadProjects(page) {
        this.loading = true;
        this.sharedServices.searchForm.next('coldbucketLeadsProjects');
        this.showSmartSearchComponent = true;
        this.coldBucketLeadsProject = [];
        this.isListing = 'coldbucket_leads_project';
        //this.isListing = 'followup_rejections';
        this.subscription = this.leadPanelService.getColbucketLeadProject(page, this.itemPerPage).subscribe(data => {
            if (data.status == 1) {
                this.coldBucketLeadsProject = data.data;
                this.totalItem = data._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
                this.createPaginationSubmitForm();
                this.getColdbucketRemarks(data.data);
            } else {
                this.popupMessageService.showError('Error in listing coldbuckets!', 'Error');
                this.actionLoader = '';
            }
            this.loading = false;
        }, (error) => {
            this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
            this.actionLoader = '';
        });
    }

    getColdbucketRemarks(data) {
        const leadArray = [];
        data.forEach(item => {
            leadArray.push({
                id: item.lead_id,
                type: item.type
            });
        });
        console.log(leadArray);
        this.leadPanelService.getColdbucketRemarks(leadArray).subscribe(res=> {
            console.log(res);
            
        })
        
    }

    rejectPermanently(projectId: number) {
        this.isListing = 'surveyor_rejections';
        this.subscription = this.leadPanelService.rejectProjectPermanently(projectId).subscribe(data => {
            if (data.status == 1) {
                this.popupMessageService.showSuccess('Project Rejected Permanently!', 'Success');
                this.surveyorRejectedProject = [];
                this.surveyorRejectedProjects();
            } else {
                this.popupMessageService.showError('No Rejected Projects!!', 'Error');
                this.actionLoader = '';
            }
        }, (error) => {
            this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
            this.actionLoader = '';
        });
    }

    /*
    * Reject all selected leads
    */
    rejectLeadsInBulk(projectsList: Array<string | number>) {
        if (projectsList && projectsList.length > 0) {
            this.subscription = this.leadPanelService.rejectProjectPermanentlyBulk(projectsList).subscribe(data => {
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Project Rejected Permanently!', 'Success');
                    this.surveyorRejectedProject = [];
                    this.surveyorRejectedProjects();
                } else {
                    this.popupMessageService.showError('No Rejected Projects!!', 'Error');
                    this.actionLoader = '';
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
                this.actionLoader = '';
            });
        }
    }

    openReallocationForm(pData: any) {
        this.showSmartSearchComponent = false;
        this.isListing = 'reallocate_surveyor_form';
        this.pDataForReallocation = pData;
        this.reallocationForm = this.formBuilder.group({
            project_id: [pData.project_id],
            project_surveyor: ['', Validators.compose([Validators.required])],
            scheduledate: [this.minDate, Validators.compose([Validators.required])],
            scheduletime: ['', Validators.compose([Validators.required])],
            comment: ['', Validators.compose([Validators.required, Validators.maxLength(1000), Validators.minLength(10)])]
        });
        this.checkTimeSlot();
    }

    /***
     * @description: view for lead detail to revive
     * @developer: Roshan
     * @date: 6/2/16
     */
    openLeadReviveForm(data: any) {
        this.isListing = "revive_lead";
        this.pDataForReallocation = data;
        this.leadReviveForm = this.formBuilder.group({
            lead_id: [data.lead_id],
            project_surveyor: ['']
        });
    }

    /***
     * @description: view for Project Detail to revive
     * @developer: Roshan
     * @date: 6/2/16
     */
    openProjectReviveForm(data: any) {
        this.isListing = "revive_project";
        this.pDataForReallocation = data;
        this.projectReviveForm = this.formBuilder.group({
            project_id: [data.project_id]
        });
    }

    /***
     * @description: service for revive the lead
     * @developer: Roshan
     * @date: 6/2/16
     */
    submitReviveLead(lead_id: any) {
        let fromData = { "lead_id": lead_id };
        this.leadPanelService.reviveColdbucketleads(fromData).subscribe(data => {
            if (data.status == 1) {
                this.popupMessageService.showSuccess(data.error_message, 'Success');
                this.getRejectedLeadProjects(1);
            } else {
                this.popupMessageService.showError('Error in Revive this lead', 'Error');
                this.getRejectedLeadProjects(1);
            }
        });
    }

    /***
     * @description: service for revive the project
     * @developer: Roshan
     * @date: 6/2/16
     */
    submitReviveProject(project_id: any) {
        let fromData = { "project_id": project_id };
        this.leadPanelService.reviveColdbucketProject(fromData).subscribe(data => {
            if (data.status == 1) {
                this.popupMessageService.showSuccess(data.error_message, 'Success');
                this.getRejectedLeadProjects(1);
            } else {
                this.popupMessageService.showError('Error in Revive this lead', 'Error');
                this.getRejectedLeadProjects(1);
            }
        });
    }

    reallocationSubmit(projectId) {
        this.loading = true;
        this.isSubmitCustomerFillFormRequest = true;
        this.isListing = 'reallocate_surveyor_form';
        if (this.reallocationForm.valid) {
            this.subscription = this.leadPanelService.rellocateSurveyor(this.reallocationForm.value).subscribe(data => {
                this.loading = false;
                this.isSubmitCustomerFillFormRequest = false;
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Project Re-Allocated!', 'Success');

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

                    this.leadListService.checklistSubmitService(projectId, checkList, true).subscribe();
                    this.surveyorRejectedProjects();
                } else {
                    this.popupMessageService.showError('Error in re-allocating Surveyor!', 'Error');
                    this.actionLoader = '';
                }
            }, (error) => {
                this.isSubmitCustomerFillFormRequest = false;
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
                this.actionLoader = '';
            });
        } else {
            this.popupMessageService.showError("Insufficient Data!", 'Error');
            this.actionLoader = '';
            this.loading = false;
        }

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

    convertForSelect(listItems: any) {
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
    checkTimeSlot() {
        let sDate = new Date(this.reallocationForm.controls.scheduledate.value).getDate();
        let todaysDate = new Date().getDate();
        if (sDate === todaysDate) {
            this.timeSlot();
        } else {
            this.newSurveyTime = this.surveyTime;
        }
    }

    timeSlot() {
        this.newSurveyTime = [];
        this.surveyTime.filter(() => {
            if (10 <= this.hour && 12 > this.hour) {
                this.newSurveyTime = this.surveyTime;
            } else if (12 <= this.hour && 14 > this.hour) {
                this.newSurveyTime = this.surveyTime.slice(1, 4);
            } else if (14 <= this.hour && 16 > this.hour) {
                this.newSurveyTime = this.surveyTime.slice(2, 4);
            } else {
                this.newSurveyTime = this.surveyTime.slice(3, 4);
            }
        })
    }

    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
        });
    }

    pageSubmit() {
        //console.log(this.isListing);
        if (this.paginationSubmitForm.valid) {
            let page = this.paginationSubmitForm.controls.page_number.value;
            if (this.smartSearchFormData) {
                if (this.currentSearchTab === 'paid' || this.currentSearchTab === 'unpaid' || this.currentSearchTab === 'cbucket' || this.currentSearchTab === 'both') {
                    this.leadListService.getConsumerLeadsForOps(page, this.itemPerPage, this.currentSearchTab, this.smartSearchFormData).subscribe(data => {
                        if (data.status) {
                            this.freshleadData = data.result.data;
                            this.isListing = "fresh_leads_listing";
                            // this.checklistStatus = false;
                            this.totalItem = data.result._meta.total_records;
                            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                            this.pages = page;
                            this.createPaginationSubmitForm();
                        } else {
                            console.log('error');
                        }
                    })
                }

                if (this.isListing == 'all_leads_project') {
                    this.leadPanelService.getAllLeads(page, this.itemPerPage, this.smartSearchFormData).subscribe((data) => {
                        if (data.status) {
                            this.allLeadData = data.data;
                            this.isListing = "all_leads_project";
                            // this.checklistStatus = false;
                            this.totalItem = data._meta.total_records;
                            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                            this.pages = page;
                            this.createPaginationSubmitForm();
                        } else {
                            console.log('error');
                        }
                    })
                }

                if (this.isListing == 'CCELeadList') {
                    this.leadListService.getAllCCELeadsData(page, 10, this.smartSearchFormData).subscribe((data) => {
                        if (data.status) {
                           // console.log(this.cceLeadData);
                            this.cceLeadData = data.result.data;
                            this.isListing = "CCELeadList";
                            // this.checklistStatus = false;
                            this.totalItem = data.result._meta.total_records;
                            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                            this.pages = page;
                            this.createPaginationSubmitForm();
                        } else {
                            console.log('error');
                        }
                    })
                }


                return;
            } else {
                if (this.isListing == 'all_leads_project') {
                    this.getAllLeadProjects(page);
                }

                if (this.isListing == 'CCELeadList') {
                    this.getCCELeadList(page);
                }

            }
            if (this.isListing == 'fresh_leads_listing') {
                this.getFreshLeadList(page, this.freshLeadType);
            }
            if (this.isListing == 'followup_rejections') {
                this.rejectedProjects = [];
                this.subscription = this.leadPanelService.getFollowupRejectedProjects(page, this.itemPerPage).subscribe(data => {
                    if (data.status == 1) {
                        this.isListing = 'followup_rejections';
                        this.rejectedProjects = data.data;
                        this.totalItem = data._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = page;
                        this.createPaginationSubmitForm();
                    } else {
                        this.popupMessageService.showError('Error in listing projects!', 'Error');
                        this.actionLoader = '';
                    }
                }, (error) => {
                    this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
                    this.actionLoader = '';
                });
            }
            if (this.isListing == 'coldbucket_leads_project') {
                this.loading = true;
                this.coldBucketLeadsProject = [];
                this.subscription = this.leadPanelService.getColbucketLeadProject(page, this.itemPerPage).subscribe(data => {
                    if (data.status == 1) {
                        this.isListing = 'coldbucket_leads_project';
                        this.coldBucketLeadsProject = data.data;
                        this.totalItem = data._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = page;
                        this.createPaginationSubmitForm();
                    } else {
                        this.popupMessageService.showError('Error in listing projects!', 'Error');
                        this.actionLoader = '';
                    }
                    this.loading = false;
                }, (error) => {
                    this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, 'Error');
                    this.actionLoader = '';
                });
            }

            if (this.isListing == 'missedCallLogListing') {
                this.ShowMissedCallListing(page, true);
            }

            if (this.isListing == 'CceLeadsListing') {
                this.getListLeadsCce(page);
            }
        }
    }

    currentSearchTab: String;
    smartSearchFormData: any;
    missedCallLogsList: any = [];
    noRecords: boolean = false;

    cceLeadData: any = [];

    smartSearchResult(event: any) {
        // console.log(event , this.isListing);
        this.allLeadData = [];
        this.totalItem = 0;
        this.pageCount = 1;
        this.pages = 1;
        if (this.isListing == 'partnerQueryListing' || this.isListing == 'CceLeadsListing') {
            this.partnerQueryLogsList = event.result.data;
            this.totalItem = event.result._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        } else {
            this.totalItem = event._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        }

        this.createPaginationSubmitForm();
        this.sharedServices.formDataSmartSearch.subscribe((data) => {
            this.smartSearchFormData = data;
        })
        this.sharedServices.searchForm.subscribe((data) => {
            this.currentSearchTab = data;
        })
        // console.log(this.currentSearchTab);
        if (this.currentSearchTab === 'surveyorRejected') {
            this.rejectedLeads = event.data;
        } else if (this.currentSearchTab === 'followupRejected') {
            this.rejectedProjects = event.data;
        } else if (this.currentSearchTab === 'coldbucketLeadsProjects') {
            this.coldBucketLeadsProject = event.data;
        } else if (this.currentSearchTab === 'paid' || this.currentSearchTab === 'unpaid' || this.currentSearchTab === 'cbucket' || this.currentSearchTab === 'both') {
            this.freshleadData = event.data;
        } else if (this.currentSearchTab == 'allLeadsProjects') {
            this.allLeadData = event.data;
        } else if (this.currentSearchTab == 'missedCallLogsSearchForm') {
            this.missedCallLogsList = event.data;
            this.noRecords = false;
        } else if (this.currentSearchTab == 'cceleadlisting') {
            this.cceLeadData = event.data;
        } else if (this.isListing == 'CceLeadsListing') {
            this.leadsListCce = event.result.data;
        }
    }


    freshLeadType: string;
    freshleadData: any = [];
    getFreshLeadList(page, type: string) {
        this.showSmartSearchComponent = true;
        this.sharedServices.searchForm.next(type);
        if (localStorage.getItem('emp_auth_key')) {
            this.freshLeadType = type;
            this.subscription = this.leadListService.getConsumerLeadsForOps(page, this.itemPerPage, type).subscribe(data => {
                if (data.status) {
                    this.freshleadData = data.result.data;
                    this.isListing = "fresh_leads_listing";
                    // this.checklistStatus = false;
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


    coldBucketCommentForm: FormGroup;
    createRevokeColdBucketForm() {
        this.coldBucketCommentForm = this.formBuilder.group({
            lead_id: [''],
            lease_modifiedby: [this.userData.emp_id],
            comment: ['', Validators.compose([Validators.required])]
        });

    }

    revokeCommentBox: boolean;
    openRevokeCommentBox(revoveLeadId) {
        this.createRevokeColdBucketForm();
        this.coldBucketCommentForm.controls.lead_id.setValue(revoveLeadId);
        this.coldBucketCommentForm.controls.comment.setValue('');
        if (!this.revokeCommentBox) {
            this.revokeCommentBox = true;
        } else {
            this.revokeCommentBox = false;
        }

    }
    submitRevokeColdLead() {
        if (this.coldBucketCommentForm.valid) {
            this.subscription = this.leadListService.revokeColdLead(this.coldBucketCommentForm.value).subscribe(data => {
                if (data.status) {
                    this.popupMessageService.showSuccess(data.result.data, "Lead revoked successfully.");
                    this.revokeCommentBox = false;
                    this.coldBucketCommentForm.reset();
                    this.getFreshLeadList(1, 'cbucket');
                } else {
                    this.revokeCommentBox = false;
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.revokeCommentBox = false;
                this.popupMessageService.showError("Server Error.", "Error!");
            })
        }
    }

    currentButton: number;
    sendPaymentLink(lead_id: number, index: number) {
        this.sendLinkLoader = true;
        this.currentButton = index;
        this.subscription = this.leadPanelService.paymentLink(lead_id).subscribe(data => {
            if (data.status == 1) {
                this.popupMessageService.showSuccess('Payment link sent successfully.', 'success');
                this.sendLinkLoader = false;
            } else {
                this.popupMessageService.showError(data.error_message, 'error');
                this.sendLinkLoader = false;
            }
        }, (error) => {
            this.popupMessageService.showError(JSON.parse(error.body).non_field_errors, 'error');
            this.sendLinkLoader = false;
        });
    }


    formStep: number = 1;
    ongoingLead: any = [];
    coldLead: any = [];
    ongoingProject: any = [];
    rejectedProject: any = [];
    existingLeadData: any;
    boookSurveyPopup: boolean;
    getExistingLeadsAndProjectsForNumber(phone: number) {
        this.dupDataPopUp = true;
        this.subscription = this.leadPanelService.getExistingLAndP(phone).subscribe(data => {
            if (data.status == 1) {
                this.existingLeadData = data.data;
                this.ongoingLead = (data.data.ongoingLeadData) ? data.data.ongoingLeadData : [];
                this.coldLead = (data.data.coldLeadData) ? data.data.coldLeadData : [];
                this.rejectedProject = (data.data.rejectedProjectsData) ? data.data.rejectedProjectsData : [];
                this.ongoingProject = (data.data.ongoingProjectsData) ? data.data.ongoingProjectsData : [];
                this.formStep = 2;
            } else if (data.status == 2) {

            }
        });
    }


    onGoingLeadQueryText: any;
    coldLeadQueryText: any;
    onGoingProjectQueryText: any;
    rejectedProjectQueryText: any;
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

    updateExistingLead(ex_lead_id: number, index: number, type: string) {
        // return true;
        this.subscription = this.leadPanelService.updateExistingLead(ex_lead_id, this.QueryText[index][type]).subscribe(data => {
            if (data.status) {
                this.popupMessageService.showInfo('Lead Updated!', 'Info')
                this.formStep = 1;
                this.dupDataPopUp = false;
            }
        });
    }

    updateExistingProject(ex_project_id: number, index: number, type: string) {
        // return true;
        this.subscription = this.leadPanelService.updateExistingProject(ex_project_id, this.QueryText[index][type]).subscribe(data => {
            if (data.status) {
                this.popupMessageService.showInfo('Project Updated!', 'Info');
                this.formStep = 1;
                this.dupDataPopUp = false;
            }
        });
    }

    dupDataPopUp: boolean;
    toggleDupDataPopUp() {
        this.dupDataPopUp = !this.dupDataPopUp;
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


    allLeadData: any = [];
    getAllLeadProjects(page: any) {
        this.loading = true
        this.showSmartSearchComponent = true;
        this.isListing = 'all_leads_project';
        this.sharedServices.searchForm.next('allLeadsProjects');
        this.subscription = this.leadPanelService.getAllLeads(page, this.itemPerPage).subscribe(
            data => {
            if (data.status) {
                this.allLeadData = data.data;
                this.totalItem = data._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
                this.createPaginationSubmitForm();
            } else {
                this.popupMessageService.showInfo('No Records found', 'Info');
            }
            this.loading = false;
        },
        err => {
            this.loading = false;
        }
        );
    }

    detailLead: any = [];
    yesNo = globals.YES_NO;
    DetailForLead(lead_id: any) {
        this.showSmartSearchComponent = false;
        this.isListing = 'detail_for_leads';
        this.subscription = this.leadPanelService.getLeadsDetail(lead_id).subscribe(data => {
            if (data.status == 1) {
                this.detailLead = data.data;
                let cce_lead_mobile_number = data.data.lead_mobile;
                if (data.data.project_id > 0) {
                    this.getProjectStatusDataDetailed(data.data.project_id);
                }
                this.getExistingLeadsAndProjectsForNumber(cce_lead_mobile_number);
            } else {
                this.popupMessageService.showError(data.error_message, 'Error');
            }
        });
    }

    //get project status data
    consumerProjectData: any;
    projectDetail: any;
    projectRejectionData: any;
    isSuccess = globals.SUCCESS;
    getProjectStatusDataDetailed(projectID) {
        this.showSmartSearchComponent = false;
        if (projectID) {
            this.subscription = this.leadListService.getProjectStatusDataService(projectID).subscribe(data => {
                if (data.status) {
                    this.consumerProjectData = data.data.consumer_project_data[0];
                    this.projectDetail = data.data.project_status_data;
                    this.projectRejectionData = data.data.rejection_data;
                    //this.consumerID = this.consumerProjectData.project_consumerid;
                    //this.rejData = data.data[0].prd_remarks;
                } else {
                    console.log('error');
                }
            });
        }
    }

    MissedCallDetailPage: any = "";
    ShowMissedCallListing(page, pagination = false) {
        this.loading = true;
        this.showSmartSearchComponent = true;
        this.isListing = 'missedCallLogListing';
        this.MissedCallDetailPage = "missedCallLogListing";
        //if(pagination){
        this.sharedServices.searchForm.next('missedCallLogsSearchForm');
        //}

        this.leadListService.getMissedCallLogs('list', page, this.itemPerPage, this.smartSearchFormData)
            .subscribe(
                data => {
                    if (data.status) {
                        this.missedCallLogsList = data.result.data;
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = page;
                        this.createPaginationSubmitForm();
                        this.noRecords = false;
                    } else {
                        this.missedCallLogsList = [];
                        this.noRecords = true;
                        return;
                    }
                    this.loading = false;
                }
            );
            
    }

    leadAction(missed_call_id, type?: any) {
        this.leadListService.missedCallAction(missed_call_id, type).subscribe((data) => {
            if (data.status == 1) {
                this.popupMessageService.showSuccess(data.error_message, 'Success');
                this.ShowMissedCallListing(this.pages, true);
            } else {
                this.popupMessageService.showError(data.error_message, 'Error');
                this.ShowMissedCallListing(this.pages, true);
            }
        });
    }

    MissedCallId: any;
    DetailForLeadMissedCall(lead_id: any, MissedCallId) {
        this.showSmartSearchComponent = false;
        this.isListing = 'detail_for_leads';
        this.MissedCallId = MissedCallId;
        this.MissedCallDetailPage = "missedCallLogListing";
        this.subscription = this.leadPanelService.getLeadsDetail(lead_id).subscribe(data => {
            if (data.status == 1) {
                this.detailLead = data.data;
               // console.log(data.data);
                if (data.data.project_id > 0) {
                    this.getProjectStatusDataDetailed(data.data.project_id);
                }
            } else {
                this.popupMessageService.showError(data.error_message, 'Error');
            }
        });
    }

    ResetSmartSearchForm() {
        this.sharedServices.formDataSmartSearch.next("");
    }


    /** New CCE Lead Listing Data 
     * 
     * @developer : <vaibhav.agarwal1@kelltontech.com>
     * @lastModifiedDate : 29 April 2019
    */
    CCELeadDetail: any = "";
    getCCELeadList(page, sidenavCLick = false) {
        this.showSmartSearchComponent = true;
        this.isListing = 'CCELeadList';
        if (!sidenavCLick) {
            this.sharedServices.searchForm.next('cceleadlisting');
        }

        // if(!pagination){
        //     this.sharedServices.searchForm.next('missedCallLogsSearchForm');
        // }

        this.leadListService.getAllCCELeadsData(page, 10, this.smartSearchFormData)
            .subscribe(
                data => {
                    if (data.status) {
                        this.cceLeadData = data.result.data;
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / 10);
                        this.pages = page;
                        // if(!pagination){
                        this.createPaginationSubmitForm();
                        // }
                        this.noRecords = false;
                    } else {
                        this.cceLeadData = [];
                        this.noRecords = true;
                        return;
                    }
                }
            );
    }

    /** Export Data to CSV 
 * 
 * @developer : <vaibhav.agarwal1@kelltontech.com>
 * @lastModifiedDate : 14 May 2019
*/
    exportAllLeadData() {

        let exportData = [{
            LeadID: "Lead ID",
            ProjectCode: "Project ID",
            ConsumerId: "Consumer ID",
            FirstName: "First Name",
            LastName: "Last Name",
            Mobile: "Mobile",
            Source: "Source",
            Reference: "Reference",
            Surveyor: "Surveyor",
            LeadUpdatedBy: "Lead Updated By",
            ProjectCreatedBy: "Project Created By",
            LeadStatus: "Lead Status",
            ProjectStatus: "Project Status",
            ProjectAssigned: "Project Assigned",
            ProjectAssignedName: "Project Assigned Name",
            LeadUpdatedOn: "Lead Updated On"
            // FunnelPartnerName: "Funnel Partner Name",
            // FunnelPartnerMobile: "Funnel Partner Mobile",
            // LeadEntryDate:"Lead Entry Date"
        }];
        this.leadPanelService.getAllLeads(1, this.itemPerPage, this.smartSearchFormData, true)
            .subscribe(
                data => {
                    if (data.status) {
                        data.data.forEach(element => {
                            var temp = {
                                LeadID: element.lead_id,
                                ProjectCode: element.project_code,
                                ConsumerId: element.consumer_code,
                                FirstName: element.cceld_firstname,
                                LastName: element.cceld_lastname,
                                Mobile: element.lead_mobile,
                                Source: element.source_master_name,
                                Reference:element.source,
                                Surveyor:element.surveyor,
                                LeadUpdatedBy: element.emp_lead_name?element.emp_lead_name:'',
                                ProjectCreatedBy: element.emp_project_name,
                                LeadStatus: element.lead_status_name,
                                ProjectStatus: element.pmstate_name,
                                ProjectAssigned:element.state_of_lead?element.state_of_lead:'',
                                ProjectAssignedName:element.emp_current_name?element.emp_current_name:'',
                                LeadUpdatedOn: element.lead_modifiedon?element.lead_modifiedon:''
                                // FunnelPartnerName:element.partner_name?element.partner_name:'',
                                // FunnelPartnerMobile:element.partner_mobile?element.partner_mobile:'',
                                // LeadEntryDate:element.fup_created_at?element.fup_created_at:''
                            };
                            exportData.push(temp);
                        });
                        this.exportToCSV(exportData, 'All Lead and Project Report');
                    }
                });
    }

    /** Export Data to CSV 
   * 
   * @developer : <vaibhav.agarwal1@kelltontech.com>
   * @lastModifiedDate : 30 April 2019
  */

    exportCCELEadData() {
        let exportData = [{
            LeadID: "Lead ID",
            ProjectCode: "Project ID",
            CUsmtomerMobileNumber: "Customer Mobile Number",
            CityName: "City Name",
            CCEEmail: "CCE Email ID",
            SurveyStatus: "Survey Status",
            ProposalStatus: "Proposal Status",
            ProjectStatus: "Project Status",
            surveyorName: "Surveyor Name",
            ProjectStartDate: "Surveyor Booked",
            ProjectSurveyorCompleted: "Surveyor Visited"
        }];
        this.leadListService.getAllCCELeadsData(1, this.itemPerPage, this.smartSearchFormData, true)
            .subscribe(
                data => {
                    if (data.status) {
                        data.result.data.forEach(element => {
                            var temp = {
                                LeadID: element.cceld_leadid,
                                ProjectCode: element.project_code,
                                CUsmtomerMobileNumber: element.cceld_mobileno,
                                CityName: element.district_name,
                                CCEEmail: element.emp_email,
                                SurveyStatus: element.SurveyStatus,
                                ProposalStatus: element.ProposalStatus,
                                ProjectStatus: element.fpsm_status,
                                surveyorName: element.surveyorName,
                                ProjectStartDate: element.ProjectStartDate,
                                ProjectSurveyorCompleted: element.ProjectSurveyorCompleted
                            };
                            exportData.push(temp);
                        });
                        this.exportToCSV(exportData, 'CCE Lead Report');
                    }
                });

    }

    exportToCSV(data, fileName) {
        new ngxCsv(data, fileName, { showLabels: true });
    }

    // Partner Query List
    partnerQueryLogsList: Array<any> = [];
    partnerQueryData(page) {
        this.showSmartSearchComponent = true;
        this.isListing = 'partnerQueryListing';
        this.sharedServices.searchForm.next('PartnerLogsSearchForm');
        this.partnerQueryLogsList = [];
        this.leadListService.getPartnerQuery(page, this.itemPerPage, this.smartSearchFormData)
            .subscribe(
                data => {
                    if (data.status == 1) {
                        this.partnerQueryLogsList = data.result.data;
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = page;
                        this.createPaginationSubmitForm();
                    }
                }
            );
    }

    ExportCSVForParterLog() {
        this.leadListService.getPartnerQuery(this.pages, this.itemPerPage, this.smartSearchFormData, 'export')
            .subscribe(
                data => {
                    let exportData = [{
                        Phone_No: "Phone No.",
                        Query_Date_time: "Query Date / time",
                        Locked_by: "Locked by",
                        Reschedule_Date: "Reschedule Date",
                        Status: "Status",
                    }];
                    if (data.status == 1) {
                        data.result.data.forEach(element => {
                            var temp = {
                                Phone_No: element.partnerQuery.prt_mobile,
                                Query_Date_time: element.partnerQuery.prt_created,
                                Locked_by: (element.employee.emp_firstname) ? element.employee.emp_firstname + ' ' + element.employee.emp_lastname : '',
                                Reschedule_Date: element.partnerQuery.prt_reschedule_date,
                                Status: this.sharedServices.getPartnerQueryStatusName(element.partnerQuery.prt_status),
                            };
                            exportData.push(temp);
                        });
                        this.exportToCSV(exportData, 'Partner Query Lead report');
                    } else {
                        this.popupMessageService.showInfo('No exported data', 'Info');
                    }
                }
            );
    }


    // Partner Query List
    leadsListCce: Array<any> = [];
    getListLeadsCce(page) {
        this.showSmartSearchComponent = true;
        this.isListing = 'CceLeadsListing';
        this.sharedServices.searchForm.next('CceLeadsList');
        this.leadsListCce = [];
        this.getDefaultToggleSetting();
        this.itemPerPage=25;
        this.leadListService.getLeadsListing(page, 25, this.smartSearchFormData)
            .subscribe(
                data => {
                    //console.log(data,'cce list data');
                    if (data.status == 1) {
                        this.leadsListCce = data.result.data;
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / 25);
                        this.pages = page;
                        this.createPaginationSubmitForm();
                    }
                }
            );
    }

    checkConsumerPriority(lead_id, event) {
        let status: any;
        if (event.target.checked == true) {
            status = 1
        } else {
            status = 0
        }
        this.leadListService.updateLeadspriority(lead_id, status)
            .subscribe(
                data => {
                    if (data.status == 1) {
                        this.popupMessageService.showSuccess('Priority Updated', 'Success');
                    } else {
                        this.popupMessageService.showError('Priority Update faile', 'Error');
                    }
                });
    }

    toggleLeadQueue(event) {
        let status: any;
        if (event.target.checked == true) {
            status = 1
        } else {
            status = 0
        }
        this.leadListService.addUpdateSetting('CceQueueListing', status)
            .subscribe(
                data => {
                    if (data.status == 1) {
                        this.popupMessageService.showSuccess('Priority Updated', 'Success');
                    } else {
                        this.popupMessageService.showError('Priority Update faile', 'Error');
                    }
                });
    }

    toggleValue: boolean;
    getDefaultToggleSetting() {
        this.leadListService.getSetting('CceQueueListing')
            .subscribe(
                data => {
                    if (data.status == 1) {
                        if (data.data.s_value == 1) {
                            this.toggleValue = true;
                        } else {
                            this.toggleValue = false;
                        }
                        //this.popupMessageService.showSuccess('Priority Updated','Success');
                    } else {
                        //this.popupMessageService.showError('Priority Update faile','Error');
                    }
                });
    }

}

