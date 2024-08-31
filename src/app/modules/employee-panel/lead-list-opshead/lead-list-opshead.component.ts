import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LeadListService } from '../services/lead-list.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { TIMES } from '../../../static/static';
import * as globals from '../../../static/static';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { LeadPanelService } from '../../customer-care/services/lead-panel.service';
import { SharedServices } from '../../../services/shared.services';

@Component({
    selector: 'oh-lead-list',
    templateUrl: './lead-list-opshead.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', './lead-list-opshead.component.css']
})
export class OpsHeadListPanel implements OnInit {

    currentSearchTab: String;
    smartSearchFormData: any;
    showSmartSearchComponent:Boolean = true;
    isLoginEmp: boolean;
    yesNo = globals.YES_NO;
    isSuccess = globals.SUCCESS;
    opSource = globals.OP_SOURCE;
    auditRole: Boolean = false;
    times: any = TIMES;
    userData: any;
    subscription: Subscription;
    isData: boolean = false;
    leadData: any = [];
    empRole: any;
    test: any;
    jsonData: any;
    isListing: string;
    projectChecklistData: any = [];
    ChecklistItems: any;
    checklistSubmitForm: FormGroup;
    isSubmitChecklist: boolean = false;
    projectDocuments: any;
    baseurl: string;
    //surveyor data
    surveyorFormData  : any;
    loadSurveyorFormData: any = [];
    consumerID: any;
    projectID: any;
    rejectionChecklists:any = [];
    isRemarkable: boolean = false;
    openStates: string[] = ['9','12', '20', '32'];
    isEligibleForDocUpload:boolean;
    documentsToBeUploaded:any = '0,';
    projectleadData: any = [];
    checklistStatus:boolean;
    showForm:string;
    consumerProjectData: any = [];
    projectDetail: any = [];
    projectRejectionData: any = [];
    freshleadData:any = [];
    itemPerPage:number = 10;
    pages: number;
    totalItem: any;
    pageCount: any;
    freshLeadType:string;
    lead_states: any = globals.LEAD_STATES;
    actionLoader: string = '';
    queryList: any;
    showQueryForm: Boolean = false;
    queryRespondForm: FormGroup;
    showCceForm: Boolean = false;
    customerFillFormRequest: FormGroup;
    minDate = new Date();
    isSubmitCustomerFillFormRequest: Boolean = false;
    isPincode: Boolean = true;
    cityList: any;
    stateList: any;
    localityList: any;
    isEmptyData: any = [];
    isValid: Boolean = false;
    cceLeadId: number;
    surveyorList: any;
    isLoader:boolean;
    actionableList: any= [];
    nonActionableList: any= [];
    projectData: any = [];
    isSubmitQueryUpdate:boolean;
    isSearchFormSubmitted: Boolean = false;
    isLeadSearchFormSubmitted: Boolean = false;
    lead_panal_form: any = globals.LEAD_PANEL_FORM;
    paginationSubmitForm:FormGroup;
    searchForm:FormGroup;
    searchLeadForm: FormGroup;
    unprocessedLeads: any = [];
    sendLinkLoader:boolean;
    currentButton:number;
    solutionType: any = globals.SOLUTION_TYPE;
    projectStatusList = [];
    searchResultXlsPath: string = globals.SEARCH_RESULT_DOWNLOAD_PATH;
    downloadFileName: string;
    coldBucketCommentForm:FormGroup;
    revoveLeadId:number;
    revokeCommentBox:boolean=false;
    actionable_lst: any = [];
    handoff_data: any = [];
    submitrejectallocation: boolean;
    pid: any;
    rejectionReason: string;
    isRejectionSubmitted = false;


    constructor(
        private route: Router,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadListService: LeadListService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService,
        private leadPanelService: LeadPanelService,
        private sharedServices: SharedServices
    ) { }

    ngOnInit() {
        // this.rightMove();
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
        }
        this.getLeadList_actionable();
        this.createChecklistSubmitForm();
        this.createFllFormRequestForm();
        this.createRevokeColdBucketForm();
        
        // this.sharedServices.searchForm.next('opsheadLeadListing');
        this.baseurl = globals.API_BASE_URL;
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
   
    getLeadListDetails() {
        this.sharedServices.searchForm.next('opsheadLeadListing');
        this.showSmartSearchComponent = true;
        this.actionableList = [];
        this.nonActionableList = [];
        this.userData = JSON.parse(localStorage.getItem('userData'));
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.getLeadDetailsForEmployee().subscribe(data => {
                if (data.status) {
                    this.leadData = data.result.data;
                    this.getActionNonActionArrays(this.leadData);
                    this.isListing = 'opshead_action_listing';
                } else {
                    console.log('error');
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

     hdata : any;
    //get lead listing actionable
    getLeadList_actionable(){
        //this.sharedServices.searchForm.next('opsheadLeadListing');
        this.showSmartSearchComponent = false;
         if (localStorage.getItem('emp_auth_key')) {
            this.isListing = 'opshead_listing_actionable';
            let actinabl_list =[];
            this.subscription = this.leadListService.getLeadDetailsForEmployee_actionable().subscribe(data => {
                if (data.status) {
                        let hdata ='';
                        data.result.forEach(function (value:any) {
                        hdata = JSON.parse(value.handOff.h_data);
                        value.handOff.h_data = hdata[0];
                       actinabl_list.push(value);
                    });

                    this.actionable_lst = actinabl_list;
                     
                    //console.log(actinabl_list);

                } else {
                    this.actionable_lst = actinabl_list;
                    console.log('error');
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }


    }

    //view hand off details
    handoff_remark: any;
    ViewHandoffDetails(handoff: any){ //console.log(handoff);
        if (localStorage.getItem('emp_auth_key')) {
             
            this.leadListService.gethandofremark(handoff.h_id).subscribe((data)=>{
                if(data.status==1){ //console.log(data.handofremark[0].hrj_remark)
                 this.handoff_remark = data.handofremark[0];
                 this.isListing = 'view_hand_off';
                }
            });
            this.handoff_data = handoff;

        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    //view interaction log 
    viewinteractionlog:boolean=false;
    interactionLog: any;
    getIntercationLog(projectId:any) {
        this.subscription = this.leadListService.getFollowupIntration(projectId).subscribe(data => {
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
    ViewinteractionClose(){ console.log('hello close interaction');
         this.viewinteractionlog = false;
    }


    createChecklistSubmitForm() {
        this.checklistSubmitForm = this.formBuilder.group({
            checklist_name: ['', Validators.compose([Validators.required])],
            checklist_status: ['', Validators.compose([Validators.required])],
            remarks: ['']
        })
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
    //get audit surveyordata
    getAuditData(projectID, consumerID) {
        if (projectID && consumerID) {
            this.subscription = this.leadListService.getSurveyorAudit(projectID, consumerID).subscribe(data => {
                if (data.status) {
                    this.surveyorFormData = data.data.surveyor_form_data[0];
                    this.loadSurveyorFormData = data.data.load_surveyer_form_data;
                    this.projectData = data.data.project_data;

                    if(this.surveyorFormData.sf_mobileno>0){
                        this.subscription = this.leadPanelService.getExistingLAndP(this.surveyorFormData.sf_mobileno).subscribe(data => {
                            if (data.status == 1) {
                                this.existingLeadData = data.data;
                                this.ongoingLead = (data.data.ongoingLeadData) ? data.data.ongoingLeadData : false;
                                this.coldLead = (data.data.coldLeadData) ? data.data.coldLeadData : false;
                                this.rejectedProject = (data.data.rejectedProjectsData) ? data.data.rejectedProjectsData : false;
                                this.ongoingProject = (data.data.ongoingProjectsData) ? data.data.ongoingProjectsData : false;
                            } else{
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

    openProjectChecklistDetails(projectId: any,consumerId:any) {
        this.showSmartSearchComponent = false;
        this.projectID = projectId;
        this.consumerID = consumerId;
        this.auditRole = true;

        if (localStorage.getItem('emp_auth_key')) {
            this.isRemarkable = false;
            this.createChecklistSubmitForm();
            this.getAuditData(this.projectID, this.consumerID);
            this.subscription = this.leadListService.getProjectDetailsForChecklists(projectId).subscribe(data => {
                if (data.status) {
                    this.projectChecklistData = data.data;
                    this.isListing='';
                    this.checklistStatus=true;
                    this.ChecklistItems = this.convertForSelectForOpsHead(this.projectChecklistData);
                    if (this.projectChecklistData.length <= 0) {
                        this.getLeadListDetails();
                    } else {
                        this.showForm = 'audit_form';;
                        this.getUploadedDocumentsForOpsHead(projectId);
                    }
                } else {
                    console.log('error');
                    this.getLeadListDetails();
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    changeProjectStatus() {
        this.isSubmitChecklist = true;
        this.checklistSubmitForm.controls.checklist_status.setValue('1');
        if (this.checklistSubmitForm.valid) {
            this.actionLoader = 'checklist_loader';
            let project_id = this.projectID;
            this.subscription = this.leadListService.checklistSubmitService(project_id, this.checklistSubmitForm.value).subscribe(data => {
                if (data.status) {
                    this.isRemarkable = false;
                    this.createChecklistSubmitForm();
                    this.isSubmitChecklist = false;
                    this.popupMessageService.showSuccess("Response Submitted Successfully", "Success!");
                    this.openProjectChecklistDetails(project_id, this.consumerID);
                    this.actionLoader = '';
                } else if (data.error_code != 0) {
                    if (data.error_code == 3) {
                        this.popupMessageService.showInfo(data.error_message, "Error!");
                        this.actionLoader = '';
                    } else {
                        this.popupMessageService.showError(data.error_message, "Info!");
                        this.actionLoader = '';
                    }
                }
            }, (error) => {
                this.popupMessageService.showError("Server Error.", "Server Error!");
                this.actionLoader = '';
            });
        }
    }


    convertForSelectForOpsHead(listItems: any) {
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
                        this.documentsToBeUploaded = item.psm_mandatory_doc_types;
                    }
                    arrPush.push({ value: String(item.psm_id), label: String(item.psm_status) });
                }
            }
            return arrPush;
        }
    }

    getUploadedDocumentsForOpsHead(project_id) {
        if (localStorage.getItem('emp_auth_key')) {
            this.actionLoader = 'uploadedDocs_loader';
            this.subscription = this.leadListService.getUploadedDocuments(project_id, localStorage.getItem('role_id'), '').subscribe(data => {
                if (data.status == 1) {
                    this.projectDocuments = data.data;
                    this.actionLoader = '';
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                    this.actionLoader = '';
                }
            }, (error) => {
                this.popupMessageService.showError("Some Error.", "Error!");
                this.actionLoader = '';
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    checkIfRemarkable(state) {
        // this.isSubmitChecklist=false;
        const remarks = this.checklistSubmitForm.get('remarks');
        if (this.rejectionChecklists.indexOf(state) > -1) {
          remarks.setValidators([Validators.required])
          // this.checklistSubmitForm.controls.remarks.setValidators([Validators.required]);
          remarks.updateValueAndValidity();
          this.isRemarkable = true;
        } else {
          remarks.clearValidators();
          // this.checklistSubmitForm.controls.remarks.setValidators(null);
          remarks.updateValueAndValidity();
          this.isRemarkable = false;
        }
    }

    //project list
    getPojectListDetails(page) {
      this.showSmartSearchComponent = true;
      this.sharedServices.searchForm.next('opsheadProjectStatus');
        if (localStorage.getItem('emp_auth_key')) {
          this.subscription = this.leadListService.getProjectStatusDetailsForEmployee(page, this.itemPerPage).subscribe(data => {
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


    //get project status data
    getProjectStatusDataDetailed(projectID) {
        this.showSmartSearchComponent = false;
        // this.panelSteps = 2;
        this.projectID = projectID;
        if (projectID) {
            this.subscription = this.leadListService.getProjectStatusDataService(projectID).subscribe(data => {
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
                    console.log('error');
                }
            })
        }
    }


    getFreshLeadList(page, type:string) {
      this.showSmartSearchComponent = true;
        this.sharedServices.searchForm.next(type);
        if (localStorage.getItem('emp_auth_key')) {
            this.freshLeadType = type;
            this.subscription = this.leadListService.getConsumerLeadsForOps(page, this.itemPerPage, type).subscribe(data => {
                if (data.status) {
                    this.freshleadData = data.result.data;
                    this.isListing = "fresh_leads_listing";
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

    getQueryList(page) {
        this.showQueryForm = false;
        this.showCceForm = false;
        this.createFllFormRequestForm();
        if(localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.getQueryList(page, this.itemPerPage).subscribe(data => {
                if(data.status) {
                    this.queryList = data.data.data;
                    this.isListing = 'query_listing';
                    this.totalItem = data.data._meta.total_records;
                    this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                    this.pages = page;
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.popupMessageService.showError("Some Error.", "Error!");
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    editQuery(data) {
        if(localStorage.getItem('emp_auth_key')) {
            this.showQueryForm = true;
            // localStorage.setItem("selectedQuery", JSON.stringify(data));
            this.createQueryResponseForm();
            this.queryRespondForm.patchValue({
                uquery_id:data.uquery_id,
                uquery_name: data.uquery_name,
                uquery_email:data.uquery_email,
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

    createQueryResponseForm(){
        this.queryRespondForm = this.formBuilder.group({
            uquery_id:['',Validators.compose([Validators.required])],
            uquery_name:['',Validators.compose([Validators.required])],
            uquery_email:['',Validators.compose([Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            uquery_mobile:['',Validators.compose([Validators.required])],
            uquery_address:['',Validators.compose([Validators.required])],
            uquery_question:['',Validators.compose([Validators.required])],
            uquery_reply:['',Validators.compose([Validators.required])],
            uquery_duration: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]*$/)])]
        });
    }

    cancelQueryUpdation() {
        this.showQueryForm = false;
    }

    updateQuery(type: number) {
        this.isSubmitQueryUpdate = true;
        if (this.queryRespondForm.valid == true) {

            this.subscription = this.leadListService.updateQuery(this.queryRespondForm.value).subscribe(data => {
                if(data.status == 1) {
                    this.popupMessageService.showSuccess('Query has been responded successfully!!','success');
                    this.showQueryForm = false;
                    this.isSubmitQueryUpdate = false;
                    if(type == 1) {

                        this.getQueryList(this.pages);
                    } else {
                        this.isValid = true;
                    }
                } else {
                    this.popupMessageService.showError(data.error_message,'error');
                    this.isSubmitQueryUpdate = false;
                }
            },(error) => {
                this.popupMessageService.showError('Server Error!!','error');
                this.isSubmitQueryUpdate = false;
            });
        } else {
            this.popupMessageService.showError('Insufficient Data!!','error');
        }
    }

    updateCreateLead() {
        this.isSubmitQueryUpdate = true;
        if (this.queryRespondForm.valid == true) {
            this.isListing = '';
            this.isLoader = true;
            this.updateQuery(2);
            // if (this.isValid) {

                let formParams = this.queryRespondForm.value;
                let params = {
                    consumer_fname: formParams.uquery_name.split(' ')[0],
                    consumer_mobileno: formParams.uquery_mobile,
                    consumer_email: formParams.uquery_email,
                    consumer_address1: formParams.uquery_address
                };

                this.subscription = this.leadPanelService.requestSurveyConsumer(params).subscribe(data => {
                    if (data.status == 1) {
                        this.popupMessageService.showSuccess('Lead has been created successfully!! Please update lead data..','success');
                        this.showCceForm = true;
                        this.isLoader = false;
                        this.customerFillFormRequest.patchValue({
                            cceld_firstname: params.consumer_fname,
                            cceld_mobileno: params.consumer_mobileno,
                            cceld_email: params.consumer_email,
                            cceld_address1: params.consumer_address1,
                            cceld_leadid: data.meta.lead_id,
                            cceld_consumerid: data.meta.consumer_id

                        });
                        this.cceLeadId = data.meta.lead_id;
                        this.cceLeadId = data.meta.consumer_id;
                        this.knowSiteSurveyor();
                    } else {
                        this.isLoader = false;
                        this.popupMessageService.showError(data.error_message, 'error');
                    }

                }, (error) => {
                    this.isLoader = false;
                    this.popupMessageService.showError('Server Error!!', 'error');
                });
            // }
        } else {
            this.popupMessageService.showError('Insufficient Data!!', 'error');
        }
    }

    createFllFormRequestForm() {
        this.customerFillFormRequest = this.formBuilder.group({
            cceld_reference: [''],
            cceld_referenceremarks: [''],
            cceld_firstname: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z A-Z]+$/)])],
            cceld_middlename: ['', Validators.compose([Validators.pattern(/^[a-z A-Z]+$/)])],
            cceld_lastname: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z A-Z]+$/)])],
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
            cceld_buildingtype: [''],
            cceld_sitetype: [''],
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
            cceld_scheduledate: ['', this.minDate],
            cceld_scheduletime: [''],
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
            cceld_surveyerid: ['',Validators.compose([Validators.required])],
            cceld_notes: [''],
            cceld_remarks: [''],
            cceld_createdby: [this.userData.emp_id],
            cceld_lastmodifiedby: [this.userData.emp_id],
            cceld_approvedrejected: ['1'],
            cceld_leadid: [''],
            cceld_consumerid: [''],
            lead_callowner_duration: ['50:00:00'],
            role_id: ['17'],
            button_value: [''],
            lead_id:['']
        })
    }

    submitConsumerFormRequest(buttonValue:number) {
        this.isSubmitCustomerFillFormRequest =  true;
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
        if(this.customerFillFormRequest.valid) {
            this.subscription = this.leadListService.requestCCELeadSubmitForm(this.customerFillFormRequest.value).subscribe(data => {
                if(data.status == 1) {
                    this.popupMessageService.showSuccess('Lead Data has been updated successfully!!','success')
                    this.showCceForm = false;
                    this.getQueryList(this.pages);
                } else {
                    this.popupMessageService.showError(data.error_message,'error');
                }
            }, (error) => {
                this.popupMessageService.showError('Server Error!!','error');
            });
        } else {
            this.popupMessageService.showError('Insufficient Data!!','error');
        }
    }

    knowYourStateCity(searchValue: string) {
        if (this.customerFillFormRequest.get('cceld_pincode').valid || searchValue.length == 6) {
            this.subscription = this.leadPanelService.getStateCityData(searchValue).subscribe(data => {
                if (data.status) {
                    this.isPincode = false;
                    this.cityList = this.convertForSelect(data.data.district_data);
                    this.stateList = this.convertForSelect(data.data.states_data);
                    this.localityList = this.convertForSelect(data.data.locality_data);
                    this.customerFillFormRequest.controls['cceld_city'].setValue(data.data.district_data[0].id);
                    this.customerFillFormRequest.controls['cceld_state'].setValue(data.data.states_data[0].id);
                } else {
                    this.isPincode = true;
                    this.cityList = this.convertForSelect(this.isEmptyData);
                    this.stateList = this.convertForSelect(this.isEmptyData);
                    this.localityList = this.convertForSelect(this.isEmptyData);
                }
            })
        } else {
            this.isPincode = false;
        }
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

    getActionNonActionArrays(plist: any){
        if(plist){
            for(let item of plist){
                if (this.openStates.indexOf(item.project_state) > -1){
                    this.actionableList.push(item);
                }else{
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

      if (this.paginationSubmitForm.valid) {
        let page = this.paginationSubmitForm.controls.page_number.value;
        if(this.smartSearchFormData) {
          if(this.currentSearchTab === 'opsheadProjectStatus') {
            this.leadListService.getProjectStatusDetailsForEmployee(page, this.itemPerPage, this.smartSearchFormData).subscribe((data) => {
            this.projectleadData = data.result.data;
            this.isListing = "project_status_listing";
            this.checklistStatus = false;
            this.totalItem = data.result._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
            this.pages = page;
            this.createPaginationSubmitForm();
          })
        } else if(this.currentSearchTab === 'paid' || this.currentSearchTab === 'unpaid' || this.currentSearchTab === 'cbucket' || this.currentSearchTab === 'both') {
          this.leadListService.getConsumerLeadsForOps(page, this.itemPerPage, this.currentSearchTab, this.smartSearchFormData).subscribe(data => {
            if (data.status) {
              this.freshleadData = data.result.data;
              this.isListing = "fresh_leads_listing";
              this.checklistStatus = false;
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
            this.leadPanelService.getAllLeads(page, this.itemPerPage,this.smartSearchFormData).subscribe((data) => {
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
        return;
      } else{
        if (this.isListing == 'all_leads_project') {
            this.getAllLeadProjects(page); 
        }
    }

      if(this.isListing == 'project_status_listing'){
          this.getPojectListDetails(page);
      } else if(this.isListing == 'fresh_leads_listing'){
          this.getFreshLeadList(page, this.freshLeadType);
        }
      }
    }

    searchProjects() {
        this.showSmartSearchComponent = false;
        this.searchForm = this.formBuilder.group({
            qType: ['', Validators.compose([Validators.required])],
            q: [''],
            project_status:['', Validators.compose([Validators.required])]
        });
        this.actionableList = [];
        this.nonActionableList = [];
        this.isListing = 'project-search';
        this.getProjectStatusList();
        this.searchFormValidation();

    }

    submitSearch() {
        this.isSearchFormSubmitted=true;
        this.actionableList = [];
        this.nonActionableList = [];
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.downloadFileName = this.searchResultXlsPath + 'search_result_'+this.userData.emp_id+".xls";
        if (this.searchForm.valid) {
            this.subscription = this.leadListService.searchProject(this.searchForm.value).subscribe(data => {
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
                this.popupMessageService.showError("Server Error.", "Error!");
            })
        }
    }

    searchLeads() {
      this.showSmartSearchComponent = false;
        this.searchLeadForm = this.formBuilder.group({
            qType: ['', Validators.compose([Validators.required])],
            q: ['', Validators.compose([Validators.required,Validators.pattern(/^([a-zA-Z0-9 _-]+)$/)])]
        });
        this.unprocessedLeads = [];
        this.isListing = 'lead-search';

    }

    submitLeadSearch() {
        this.isLeadSearchFormSubmitted=true;
        this.unprocessedLeads = [];
        if (this.searchLeadForm.valid) {
            this.subscription = this.leadListService.searchLead(this.searchLeadForm.value).subscribe(data => {
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
                this.popupMessageService.showError("Server Error.", "Error!");
            })
        }
    }

    sendPaymentLink(lead_id:number, index:number) {
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
            (q_type: string)=>{
                if(q_type!='project_status'){
                    q.setValidators([Validators.required, Validators.pattern(/^([a-zA-Z0-9 _-]+)$/)]);
                    project_status.clearValidators();
                    this.searchForm.controls.project_status.setValue('0');
                }else{
                    project_status.setValidators([Validators.required]);
                    q.clearValidators();
                }
                q.updateValueAndValidity();
                project_status.updateValueAndValidity();
            }
        )
    }

    getProjectStatusList() {
        this.subscription=this.leadListService.projectStatusList().subscribe(data=> {
            if (data.status) {
                this.projectStatusList = this.convertProjectStatusForSelect(data.data);
            } else {
                this.popupMessageService.showError(data.error_message, "Error!");
            }
        }, (error) => {
            this.popupMessageService.showError("Server Error.", "Error!");
        })
    }

    createRevokeColdBucketForm() {
        this.coldBucketCommentForm = this.formBuilder.group ({
            lead_id: [''],
            lease_modifiedby: [this.userData.emp_id],
            comment:['',Validators.compose([Validators.required])]
        });

    }

    openRevokeCommentBox(revoveLeadId) {
    this.coldBucketCommentForm.controls.lead_id.setValue(revoveLeadId);
    this.coldBucketCommentForm.controls.comment.setValue('');
    if(!this.revokeCommentBox) {
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
    smartSearchResults(event) {
      this.pages = 1;
      this.totalItem = event._meta.total_records;
      this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
      this.createPaginationSubmitForm();
      this.sharedServices.formDataSmartSearch.subscribe((data) => {
        this.smartSearchFormData = data;
      })
      let searchResult = event.data;
      this.sharedServices.searchForm.subscribe((data) => {
        this.currentSearchTab = data;
      })
      if (this.currentSearchTab === 'opsheadLeadListing') {
        this.actionableList = [];
        this.nonActionableList = [];
        this.getActionNonActionArrays(searchResult);
      } else if (this.currentSearchTab === 'opsheadProjectStatus') {
        this.projectleadData = searchResult;
      } else if (this.currentSearchTab === 'paid' || this.currentSearchTab === 'unpaid' || this.currentSearchTab === 'cbucket' || this.currentSearchTab === 'both') {
        this.freshleadData = event.data;
      } else if( this.currentSearchTab == 'allLeadsProjects'){
            this.allLeadData = event.data;
        }
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if(this.pageCount<(this.paginationSubmitForm.controls.page_number.value+event.key) )
            event.preventDefault();
        if (!pattern.test(inputChar) && event.keyCode != 8) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    allLeadData:any = [];
    getAllLeadProjects(page:any) {
      this.showSmartSearchComponent = true;
      this.isListing = 'all_leads_project';
      this.sharedServices.searchForm.next('allLeadsProjects');
      this.subscription = this.leadPanelService.getAllLeads(page, this.itemPerPage).subscribe(data => {
          if (data.status) {
              this.allLeadData = data.data;
              this.totalItem = data._meta.total_records;
              this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
              this.pages = page;
              this.createPaginationSubmitForm();
          } else {
               this.popupMessageService.showInfo('No Records found', 'Info');
          }
      });
    }

    detailLead:any = [];
      DetailForLead(lead_id: any){
        this.showSmartSearchComponent = false;
        this.isListing = 'detail_for_leads';
        this.showForm = '';
        this.subscription = this.leadPanelService.getLeadsDetail(lead_id).subscribe(data => {
            if(data.status==1){
                this.detailLead = data.data;
                let cce_lead_mobile_number = data.data.lead_mobile;
                if(data.data.project_id>0){
                    this.getProjectStatusDataDetailedNew(data.data.project_id);
                }
                this.getExistingLeadsAndProjectsForNumber(cce_lead_mobile_number);
            } else{
                this.popupMessageService.showError(data.error_message,'Error');
            }
        });
      }

    getProjectStatusDataDetailedNew(projectID) {
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
            })
        }
    }
    
    dupDataPopUp:boolean;
    formStep: number = 1;
    getExistingLeadsAndProjectsForNumber(phone: number) {
        this.dupDataPopUp = true;
        //console.log(phone);
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
    pmallocationform: FormGroup;
    Allocation:boolean=false;
    pm_list:any;
    project_id:any;
    
    /**
     * Convert Data for Select
     */
    convertdataForSelect(listItems: any) {
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
   
   
   alocating:any =false;
    pmallocation(project_id){
        this.alocating =false; 
        this.Allocation = true;
        this.pmallocationform = this.formBuilder.group ({
            pm_remarks: ['', Validators.required],
            pm_id: ['', Validators.compose([Validators.required])],
            project_id: [project_id,Validators.compose([Validators.required])] 
        });
        this.leadListService.getEmployeeDataByRole(29).subscribe(data=>{
            if (data.status) {
                this.pm_list=this.convertdataForSelectEmp(data.data);
            }
        });
        // this.sharedServices.get(globals.APIS.EMPLOYEES_DATA_BY_ROLE + '/29').subscribe(data => {
        //     if (data.status) {
        //         this.pm_list=this.convertdataForSelect(data.data.emp_data);
        //     }
        // })
    }
   
    allocateprojectManager(){

        if (this.pmallocationform.valid == true) {
            this.alocating =true;
            this.subscription = this.leadListService.allocateprojectManager(this.pmallocationform.value).subscribe(data => {
                this.alocating =false; 
                if (data.status) {
                    this.popupMessageService.showSuccess('Project Manager allocated successfully.', "Success.");
                    this.getLeadList_actionable();
                } else {
                   this.popupMessageService.showError(data.error_message, "Error!");
                }
        this.Allocation=false;
        })
        }else {
            this.popupMessageService.showError('Insufficient Data!!','error');
        }
    }
    RejectAllocationpopup(pid){
       this.submitrejectallocation=true;
       this.pid=pid;
    }
    RejectAllocation(pid){
        if(this.rejectionReason) {
            this.isRejectionSubmitted = true;
            const data = {
                pid : pid,
                rejection_reason: this.rejectionReason
            }
            this.subscription = this.leadListService.rejectallocation(data).subscribe(data => {
                if (data.status) {
                    this.popupMessageService.showSuccess("Rejected Successfully.", "Success.");
                    this.rejectionReason = '';
                    this.isRejectionSubmitted = false;
                    this.getLeadList_actionable();
                } else {
                   this.popupMessageService.showError(data.error_message, "Error!");
                }
              });
              this.submitrejectallocation=false;
            } else {
                this.popupMessageService.showError('Please enter a valid rejection reason', "Error!");
            }
     }

     convertdataForSelectEmp(listItems: any) {
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            for (let item of listItems) {
                arrPush.push({ value: String(item.emp_id), label: String(item.emp_firstname) });
            }
            return arrPush;
        }
    }
}
    
