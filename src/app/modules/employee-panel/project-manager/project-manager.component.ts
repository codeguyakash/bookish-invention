import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable'
import { LeadListService } from '../services/lead-list.service';
import { ProjectManagementService } from '../services/project-management.services'
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, ValidationErrors } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { TIMES } from '../../../static/static';
import * as globals from '../../../static/static';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { SharedServices } from '../../../services/shared.services';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { CodegenComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';

@Component({
    selector: 'project-manager',
    templateUrl: './project-manager.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', './project-manager.component.css']
})
export class ProjectManagerPanel implements OnInit {

    isLoginEmp: boolean;
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
    rejectionChecklists: any = [];
    isRemarkable: boolean = false;
    isEligibleForDocUpload: boolean;
    documentsToBeUploaded: any = '0,';
    uploadDocument: FormGroup;
    isSubmittedDocument: boolean;
    imageDocsIssues: string = '';
    isUploadingDocs: boolean;
    myHtml: String = '';
    documentList: any;
    currentProjectId: any;
    openStates: string[] = ['14', '15', '20', '21', '22', '23', '26', '27', '29', '30', '31'];
    actionLoader: string = '';
    actionableList: any = [];
    nonActionableList: any = [];
    isView: string;
    Accepassignedproject: boolean = false;
    Rejectassignedproject: boolean = false;
    handoff_data: any;
    calenderForm: FormGroup;
    projectplan: any;
    tasklist: any;
    taskname: any;
    enddate: any;
    startdate: any;
    noofdays: any;
    calender: any;
    viewinteractionlog: boolean = false;
    doc_id: any = [];
    //for view more task
    task_num: any = '0';
    taskForm: FormGroup;
    currentDate: any = new Date();
    tasksdata: any;
    isconfirm: any;
    h_id: any;
    submitongoingproject: boolean = false;
    showactualenddate: any = false;
    submitData = false
    Previewmailsms: boolean = false;
    isOngoingOrCompleted = false;
    isComplete: boolean;
    smsSent: any=0;
    emailSent: any=0;
    isEndDate:boolean=false
    isStartDate:boolean=false
    BankList = [
        { value: String('Axis Bank Limited'), label: String('Axis Bank Limited') },
        { value: String('Bhandhan Bank Limited'), label: String('Bhandhan Bank Limited') },
        { value: String('Chatholic Syrian Bank Limited'), label: String('Chatholic Syrian Bank Limited') },
        { value: String('City Union Bank Limited'), label: String('City Union Bank Limited') },
        { value: String('DCB Bank Limited'), label: String('DCB Bank Limited') },
        { value: String('Dhanlaxmi Bank Limited'), label: String('Dhanlaxmi Bank Limited') },
        { value: String('Federal Bank Limited'), label: String('Federal Bank Limited') },
        { value: String('HDFC Bank Limited'), label: String('HDFC Bank Limited') },
        { value: String('ICICI Bank Limited'), label: String('ICICI Bank Limited') },
        { value: String('Induslnd Bank Limited'), label: String('Induslnd Bank Limited') },
        { value: String('IDFC Bank Limited'), label: String('IDFC Bank Limited') },
        { value: String('Jammu & Kashmir Bank Limited'), label: String('Jammu & Kashmir Bank Limited') },
        { value: String('Karnataka Bank Limited'), label: String('Karnataka Bank Limited') },

        { value: String('Allahabad Bank'), label: String('Allahabad Bank') },
        { value: String('Andhra Bank'), label: String('Andhra Bank') },
        { value: String('Bank Of Baroda'), label: String('Bank Of Baroda') },
        { value: String('Bank Of India'), label: String('Bank Of India') },
        { value: String('Bank Of Maharashtra'), label: String('Bank Of Maharashtra') },
        { value: String('Indian Overseas Bank'), label: String('Indian Overseas Bank') },
        { value: String('Oriental Bank Of Commerce'), label: String('Oriental Bank Of Commerce') },
        { value: String('Punjab National Bank'), label: String('Punjab National Bank') },
        { value: String('SBI Bank'), label: String('SBI Bank') },
        { value: String('Syndicate Bank'), label: String('Syndicate Bank') },
        { value: String('Union Bank Of India'), label: String('Union Bank Of India') },
        { value: String('Canara Bank'), label: String('Canara Bank') },
        { value: String('Central Bank Of India'), label: String('Central Bank Of India') },
        { value: String('Corporation Bank'), label: String('Corporation Bank') },
        { value: String('Dena Bank'), label: String('Dena Bank') },
        { value: String('Indian Bank'), label: String('Indian Bank') },
        { value: String('United Bank of India'), label: String('United Bank of India') },
        { value: String('Punjab & Sind bank'), label: String('Punjab & Sind bank') },
        { value: String('UCO Bank'), label: String('UCO Bank') },
        { value: String('Vijaya Bank'), label: String('Vijaya Bank') },
        { value: String('Karur Vysya Bank Limited'), label: String('Karur Vysya Bank Limited') },
        { value: String('Kotak Mahindra Bank Limited'), label: String('Kotak Mahindra Bank Limited') },
        { value: String('Lakshmi Vilas Bank Limited'), label: String('Lakshmi Vilas Bank Limited') },
        { value: String('Nanital Bank Limited'), label: String('Nanital Bank Limited') },
        { value: String('RBL Bank Limited'), label: String('RBL Bank Limited') },
        { value: String('South Indian Bank Limited'), label: String('South Indian Bank Limited') },
        { value: String('Tamilnad Mercantile Bank Limited'), label: String('Tamilnad Mercantile Bank Limited') },
        { value: String('Yes Bank Limited'), label: String('Yes Bank Limited') },
    ];

    checkedweekdays: any;
    nonworkingdays: any;
    showSmartSearchComponent: Boolean = true;
    totalItem: any;
    pageCount: number;
    itemPerPage: any = 10;
    pages: number;
    paginationSubmitForm: FormGroup;
    searchResult: any;
    smartSearchFormData: any;
    plannedStartDate: Date;

    constructor(
        private route: Router,
        private sharedServices: SharedServices,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadListService: LeadListService,
        private projectManagementService: ProjectManagementService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService
    ) { }


    ngOnInit() {
        //this.sharedServices.searchForm.next('leadListPartnerListing');
        // this.rightMove();
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
        }
        //this.getOngoingProjectList();
        this.getAssignedProjectList();
        //this.createChecklistSubmitForm();
        //this.createDocumentForm();
        this.getpartnerListArray();
        this.getAuditorListArray();
        this.createPaginationSubmitForm();
        this.baseurl = globals.API_BASE_URL;
    }
    onKeyPress(e) {
        let inputKeyCode = e.keyCode ? e.keyCode : e.which
        if (inputKeyCode != null) {
            if (inputKeyCode == 45) {
                e.preventDefault()
            }
        }
    }

    getSolutionType(solutiontype: any) {
        if (solutiontype == '1') {
            return 'Grid-Tied';
        }
        else if (solutiontype == '2') {
            return 'Off-Grid';
        }
        else if (solutiontype == '3') {
            return 'Hybrid';
        }
        else {
            return '';
        }

    }

    ongoingProjects: any;
    getOngoingProjectList() {
        this.userData = JSON.parse(localStorage.getItem('userData'));
        if (localStorage.getItem('emp_auth_key')) {
            this.isView = '';
            this.projectManagementService.getProjectManagementList('ongoing').subscribe(data => {
                if (data.status == 1 || data.status == 0) {
                    this.ongoingProjects = [];
                    this.isListing = 'ongoing_project_listing';
                    let ongoingproject_list = [];
                    let hdata = '';
                    if (data.status == 1) {
                        data.result.data.forEach(function (value) {
                            hdata = JSON.parse(value.handOff.h_data);
                            value.handOff.h_data = hdata[0];
                            ongoingproject_list.push(value);
                        });
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = 1;
                        this.createPaginationSubmitForm();
                    }
                    this.ongoingProjects = ongoingproject_list;
                    this.sharedServices.searchForm.next('ongoing');
                    this.sharedServices.project_type.next('ongoing');
                    this.showSmartSearchComponent = true;
                } else {
                    this.popupMessageService.showError('Can not Load data', 'Error');
                }

            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    allocateProjectList: any;
    getAllocatedProject() {

        if (localStorage.getItem('emp_auth_key')) {
            this.isView = '';
            this.projectManagementService.getProjectManagementList('allocated').subscribe(data => {
                if (data.status == 1 || data.status == 0) {
                    this.allocateProjectList = [];
                    this.isListing = 'allocated_project_listing';

                    let allocatedproject_list = [];
                    let hdata = '';
                    if (data.status == 1) {
                        data.result.data.forEach(function (value) {
                            hdata = JSON.parse(value.handOff.h_data);
                            value.handOff.h_data = hdata[0]
                            allocatedproject_list.push(value);
                        });
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = 1;
                        this.createPaginationSubmitForm();
                    }
                    this.allocateProjectList = allocatedproject_list;
                    this.sharedServices.searchForm.next('allocated');
                    this.sharedServices.project_type.next('allocated');
                    this.showSmartSearchComponent = true;


                } else {
                    this.popupMessageService.showError('Can not Load data', 'Error');
                }

            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }


    completedProjectlist: any;
    getCompletedProjectList() {

        if (localStorage.getItem('emp_auth_key')) {
            this.projectManagementService.getProjectManagementList('completed').subscribe(data => {
                if (data.status == 1 || data.status == 0) {
                    this.isListing = 'completed_project_listing';
                    this.isView = '';

                    let completedproject_list = [];
                    let hdata = '';
                    if (data.status == 1) {
                        data.result.data.forEach(function (value) {
                            hdata = JSON.parse(value.handOff.h_data);
                            value.handOff.h_data = hdata[0]
                            completedproject_list.push(value);
                        });
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = 1;
                        this.createPaginationSubmitForm();
                    }
                    this.completedProjectlist = [];
                    this.completedProjectlist = completedproject_list;
                    this.sharedServices.searchForm.next('completed');
                    this.sharedServices.project_type.next('completed');
                    this.showSmartSearchComponent = true;

                } else {
                    this.popupMessageService.showError('Can not Load data', 'Error');
                }

            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    assignedProjectList: any;
    getAssignedProjectList() {
        if (localStorage.getItem('emp_auth_key')) {
            this.projectManagementService.getProjectManagementList('assigned').subscribe(data => {
                let assignedproject_list = [];
                if (data.status == 1 || data.status == 0) {
                    this.assignedProjectList = [];

                    let hdata = '';
                    if (data.status == 1) {
                        data.result.data.forEach(function (value) {
                            hdata = JSON.parse(value.handOff.h_data);
                            value.handOff.h_data = hdata[0]
                            assignedproject_list.push(value);
                        });
                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = 1;
                        this.createPaginationSubmitForm();
                    }


                } else {
                    this.popupMessageService.showError('Can not Load data', 'Error');
                }
                this.assignedProjectList = assignedproject_list;
                this.isListing = 'assigned_project_listing';
                this.sharedServices.searchForm.next('assigned');
                this.sharedServices.project_type.next('assigned');
                this.showSmartSearchComponent = true;
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    currentHandOffData: any;
    CreateProjectPlan(h_id, handoff_data: any = null) {
        if (localStorage.getItem('emp_auth_key')) {
            // this.subscription = this.leadListService.getLeadDetailsForEmployee_actionable().subscribe(data => {
            //     if (data.status) {
            //         this.leadData = data.result.data;
            //this.getActionNonActionArrays(this.leadData);

            this.isView = 'create_project_plan';
            this.isListing = '';
            this.h_id = h_id;
            this.currentHandOffData = handoff_data;


        } else {
            this.route.navigateByUrl('/employee/login');
        }


    }

    //check boc for project size
    project_type: any;

    CheckProjectSize(size: any) {
        if (localStorage.getItem('emp_auth_key')) {
            this.project_type = size;
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }


    ViewProjectPlan(h_id, handoff_data: any = null) {
        this.is_update_holiday = false;
        if (localStorage.getItem('emp_auth_key')) {
            this.currentProjectId = handoff_data.h_projectid;
            this.isView = 'view_project_plan';
            this.isListing = '';
            this.h_id = h_id;
            this.currentHandOffData = handoff_data;
            this.projectplan = [];
            this.projectManagementService.getprojectplan(handoff_data.h_projectid, handoff_data.gridtype).subscribe((data) => {
                if (data.status == 1) {
                    let projetPlanArr: any = [];
                    (data.data.tasks).forEach(function (value) {
                        value.startdate = (value.Milestone.pp_startdate) ? value.Milestone.pp_startdate : '';
                        value.enddate = value.Milestone.pp_enddate;
                        value.noofdays = value.Milestone.pp_noofdays;
                        projetPlanArr.push(value);
                    });
                    this.projectplan = projetPlanArr;
                    this.calender = data.data.calender;
                    data = [];
                }
            });

        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    Ongoingviewprojectplan(handoff_data: any = null) {
        this.activetask = '';
        if (localStorage.getItem('emp_auth_key')) {
            this.currentProjectId = handoff_data.h_projectid;
            this.isView = 'ongoing_view_project_plan';
            this.isListing = '';
            this.currentHandOffData = handoff_data;
            this.projectplan = [];
            this.projectManagementService.getprojectplan(handoff_data.h_projectid, handoff_data.gridtype).subscribe((data) => {
                if (data.status == 1) {
                    let dataTask = data.data.tasks;
                    this.calender = data.data.calender;
                    for (let check of dataTask) {
                        if (check.Milestone.plnm_id == "11") {
                            let splicedArray = this.projectplan.splice(5, 1);
                            this.projectplan.splice(6, 0, splicedArray[0]);
                            let splicedArrayNext = this.projectplan.splice(8, 1);
                            this.projectplan.push(check);
                            this.projectplan.push(splicedArrayNext[0]);
                        } else {
                            this.projectplan.push(check);
                        }
                    }
                    this.projectManagementService.transformprojectplan(this.projectplan, handoff_data.gridtype)
                }
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    Submit_milestone_ongoing(isconfirm: any, h_id: any) {
        if (localStorage.getItem('emp_auth_key')) {
            // this.isView = '';
            // this.isListing = '';
            this.isView = 'ongoing_view_project_plan';
            this.isListing = '';
            this.h_id = h_id;
            if (isconfirm == '1') {
                this.projectManagementService.SubmitmilestoneongoingProject(h_id).subscribe(data => {
                    if (data.status == 1) {
                        this.getCompletedProjectList();
                        this.submitongoingproject = false;
                        this.popupMessageService.showSuccess('Completed successfully.', "Success");
                    } else {
                        this.popupMessageService.showError(data.error_message, "Error");
                    }
                })


            } else if (isconfirm == '2') {
                this.submitongoingproject = true;
            }
            else {
                this.submitongoingproject = false;
            }



        } else {
            this.route.navigateByUrl('/employee/login');
        }


    }

    //view details on completed projects list
    Completedviewprojectplan(handoff_data: any = null) {
        if (localStorage.getItem('emp_auth_key')) {
            this.currentProjectId = handoff_data.h_projectid;
            this.isView = 'completed_view_detail_project_plan';
            this.isListing = '';
            this.currentHandOffData = handoff_data;
            this.projectplan = [];
            this.projectManagementService.getprojectplan(handoff_data.h_projectid, handoff_data.gridtype).subscribe((data) => {
                if (data.status == 1) {
                    let dataTask = data.data.tasks;
                    this.calender = data.data.calender;
                    for (let check of dataTask) {
                        if (check.Milestone.plnm_id == "11") {
                            let splicedArray = this.projectplan.splice(5, 1);
                            this.projectplan.splice(6, 0, splicedArray[0]);
                            let splicedArrayNext = this.projectplan.splice(8, 1);
                            this.projectplan.push(check);
                            this.projectplan.push(splicedArrayNext[0]);
                        } else {
                            this.projectplan.push(check);
                        }
                    }
                }
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    //view task page & complete task list
    plan: any;
    milestone_id: any;
    OngoingTaskList(milestone_id: any, handoff_data: any = null, plan: any = null) {
        if (localStorage.getItem('emp_auth_key')) {
            this.currentHandOffData = handoff_data;
            this.plan = plan;
            this.milestone_id = milestone_id;
            this.tasksdata = [];
            // this.projectManagementService.getmilestonetasks(plan.Milestone.pp_id,plan.Milestone.plnm_id).subscribe((data)=>{
            //     if(data.status==1){
            //          this.tasksdata=data.data;
            //     }
            // });
            this.doc_id = [];
            switch (milestone_id) {
                case "1":
                    this.isView = 'task_list_ongoingby_milestone_checkrealization';
                    this.isListing = '';
                    break;
                case "2":
                    this.isView = 'task_list_ongoingby_milestone_partnerallocation';
                    this.isListing = '';
                    break;
                case "3":
                    this.isView = 'task_list_ongoingby_milestone_documentsubmission';
                    this.isListing = '';
                    break;
                case "4":
                    this.isView = 'task_list_ongoingby_milestone_material_payment_collection_second';
                    this.isListing = '';
                    break;
                case "5":
                    this.isView = 'task_list_ongoingby_milestone_materialdispatch';
                    this.isListing = '';
                    break;
                case "6":
                    this.isView = 'task_list_ongoingby_milestone_installation';
                    this.isListing = '';
                    break;
                case "7":
                    this.isView = 'task_list_ongoingby_milestone_payment_collection_third';
                    this.isListing = '';
                    break;
                case "8":
                    this.isView = 'task_list_ongoingby_milestone_net_meter_instalation';
                    this.isListing = '';
                    break;
                case "9":
                    this.isView = 'task_list_ongoingby_milestone_subsidy_document_submission';
                    this.isListing = '';
                    break;
                case "10":
                    this.isView = 'task_list_ongoingby_milestone_projecthandover_closer';
                    this.isListing = '';
                    break;
                case "11":
                    this.isView = 'task_list_ongoingby_milestone_payment_collection_fourth';
                    this.isListing = '';
                    break;
                default:
                    this.noop();
                    break;
            }

        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }



    //send sms at task in ongoing tab
    loader: any = '0';
    Sendsms_task_notification(task_id: any, milestone_id: any, handoff_data: any = null, plan: any = null) {
        this.loader = '1';
        if (localStorage.getItem('emp_auth_key')) {
            this.projectManagementService.Sendsms_task_notification(task_id, handoff_data.h_id, plan.Milestone.pp_id, milestone_id).subscribe((data) => {
                this.loader = '0';
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Sms sent successfully.', "Success");
                } else {
                    this.popupMessageService.showError('Sms did not send', 'Error');
                }

            });

        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    //send email at task in ongoing tab
    loaderemail: any = '0';
    Sendemail_task_notification(task_id: any, milestone_id: any, handoff_data: any = null, plan: any = null, doc_id: any) {
        this.loaderemail = '1';
        if (localStorage.getItem('emp_auth_key')) {
            this.projectManagementService.Sendemail_task_notification(task_id, handoff_data.h_id, plan.Milestone.pp_id, doc_id, milestone_id).subscribe((data) => {
                this.loaderemail = '0';
                if (data.status == 1) {
                    this.popupMessageService.showSuccess('Mail sent successfully.', "Success");
                } else {
                    this.popupMessageService.showError('Mail did not send', 'Error');
                }

            });

        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    // doc selection for email
    DocformailSelect(event, docid: any) {
        //console.log(docid);
        let value = event.srcElement.checked ? 1 : 0;
        if (value == 1) {
            this.doc_id.push(docid);
        } else {
            let index = this.doc_id.indexOf(docid);
            if (index > -1) {
                this.doc_id.splice(index, 1);
            }
        }


    }


    //view task list in completed project list
    CompletedTaskList(milestone_id: any, handoff_data: any = null, plan: any = null) {
        if (localStorage.getItem('emp_auth_key')) {
            this.currentHandOffData = handoff_data;
            this.plan = plan;
            //prefilled data
            this.tasksdata = [];
            // this.projectManagementService.getmilestonetasks(plan.Milestone.pp_id,plan.Milestone.plnm_id).subscribe((data)=>{
            //     if(data.status==1){
            //         this.tasksdata=data.data;
            //     }
            // });
            if (milestone_id == 1) {
                this.isView = 'task_list_completedby_milestone_checkrealization';
                this.isListing = '';
            } else if (milestone_id == 2) {
                this.isView = 'task_list_completedby_milestone_partnerallocation';
                this.isListing = '';
            }
            else if (milestone_id == 3) {
                this.isView = 'task_list_completedby_milestone_documentsubmission';
                this.isListing = '';
            }
            else if (milestone_id == 4) {
                this.isView = 'task_list_completedby_milestone_material_payment_collection_second';
                this.isListing = '';
            }
            else if (milestone_id == 5) {
                this.isView = 'task_list_completedby_milestone_materialdispatch';
                this.isListing = '';
            }
            else if (milestone_id == 6) {
                this.isView = 'task_list_completedby_milestone_installation';
                this.isListing = '';
            }
            else if (milestone_id == 7) {
                this.isView = 'task_list_completedby_milestone_payment_collection_third';
                this.isListing = '';
            }
            else if (milestone_id == 8) {
                this.isView = 'task_list_completedby_milestone_net_meter_instalation';
                this.isListing = '';
            }
            else if (milestone_id == 9) {
                this.isView = 'task_list_completedby_milestone_subsidy_document_submission';
                this.isListing = '';
            }
            else if (milestone_id == 10) {
                this.isView = 'task_list_completedby_milestone_projecthandover_closer';
                this.isListing = '';
            }


        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    //view task form details
    activetask: any;
    pTaskId: any = 0;
    isTaskPendingApproval: any = false;
    ViewTaskform_detail(task_num: any, plan: any, formdata: any, isinternal: any = false) {
        this.submitData = false
        this.getTaskDetail(task_num, plan, formdata, isinternal);
    }

    getTaskDetail(task_num: any, plan: any, formdata: any, isinternal: any = false) {
        

        if (this.activetask != task_num) {
            this.activetask = task_num;
        } else {
            if (isinternal == false) {
                this.activetask = '';
            } else {
                this.activetask = task_num;
            }
        }
        this.taskFormValidation(plan.Milestone, task_num);
        this.getUploadedDocumentsTask(task_num);

        this.projectManagementService.getmilestonetasks(plan.Milestone.pp_id, plan.Milestone.plnm_id, task_num, this.currentProjectId).subscribe((data) => {
            if (data.status == 1) {
                this.tasksdata = data.data;
                this.isTaskPendingApproval = this.tasksdata[task_num] ? this.tasksdata[task_num].ptask_pending_approval: 0;
                //console.log(this.isTaskPendingApproval);
                formdata = data.data;
            }
            //this.plan=plan;
            this.pTaskId = 0;
            if (formdata[task_num]) {
                this.pTaskId = formdata[task_num].ptask_id;
                if (formdata[task_num].ptask_status && formdata[task_num].ptask_status == 1) {
                    this.showactualenddate = true;
                } else {
                    this.showactualenddate = false;
                }
                (formdata[task_num].ptask_allocate_to) ? this.taskForm.controls.allocated_to.setValue(formdata[task_num].ptask_allocate_to) : this.taskForm.controls.allocated_to.setValue('');
                (formdata[task_num].ptask_remark) ? this.taskForm.controls.remarks.setValue(formdata[task_num].ptask_remark) : '';
                (formdata[task_num].taskstartdate != '') ? this.taskForm.controls.actualstartdate.setValue(new Date(formdata[task_num].taskstartdate)) : this.taskForm.controls.actualstartdate.setValue('');
                (formdata[task_num].taskenddate != '') ? this.taskForm.controls.actualenddate.setValue(new Date(formdata[task_num].taskenddate)) : this.taskForm.controls.actualenddate.setValue('');
                (formdata[task_num].ptask_status) ? this.taskForm.controls.status.setValue(formdata[task_num].ptask_status) : '';
                (formdata[task_num].ptask_cheque_no) ? this.taskForm.controls.cheque_no.setValue(formdata[task_num].ptask_cheque_no) : '';
                (formdata[task_num].ptask_payment_mode) ? this.taskForm.controls.payment.setValue(formdata[task_num].ptask_payment_mode) : this.taskForm.controls.payment.setValue('');
                (formdata[task_num].ptask_invoice_no) ? this.taskForm.controls.invoice_no.setValue(formdata[task_num].ptask_invoice_no) : '';
                (formdata[task_num].ptask_allocate_date) ? this.taskForm.controls.allocatedddate.setValue(new Date(formdata[task_num].ptask_allocate_date)) : '';
                (formdata[task_num].ptask_bank_drawn) ? this.taskForm.controls.transaction_date.setValue(new Date(formdata[task_num].ptask_bank_drawn)) : null;
                (formdata[task_num].ptask_bank_drawn_no) ? this.taskForm.controls.bank_drawn_no.setValue(formdata[task_num].ptask_bank_drawn_no) : '';
                (formdata[task_num].ptask_ac_no) ? this.taskForm.controls.ac_no.setValue(formdata[task_num].ptask_ac_no) : '';
                (formdata[task_num].ptask_drawn_on_date) ? this.taskForm.controls.drawn_on_date.setValue(new Date(formdata[task_num].ptask_drawn_on_date)) : '';
                (formdata[task_num].ptask_bank_name) ? this.taskForm.controls.bankdrawnonname.setValue(formdata[task_num].ptask_bank_name) : '';
                // (formdata[task_num].ptask_sap_number) ? this.taskForm.controls.sap_number.setValue(formdata[task_num].ptask_sap_number) : '';
                (formdata[task_num].ptask_bank_reference_number) ? this.taskForm.controls.bank_reference_number.setValue(formdata[task_num].ptask_bank_reference_number) : '';
                (formdata[task_num].ptask_bos) ? this.taskForm.controls.balanceofsystem.setValue(formdata[task_num].ptask_bos) : '';
                (formdata[task_num].ptask_platformcost) ? this.taskForm.controls.platformcost.setValue(formdata[task_num].ptask_platformcost) : '';
                (formdata[task_num].ptask_productcost) ? this.taskForm.controls.productcost.setValue(formdata[task_num].ptask_productcost) : '';
                if(['5','11','40'].includes(formdata[task_num].ptask_ttid)) {
                    //console.log("ssp");

                    const total_tanche_amt = +formdata[task_num].ptask_amount_total;
                    const total_paid = +formdata[task_num].ptask_amount;
                    let remaining_amt = total_tanche_amt - total_paid;
                    remaining_amt = +remaining_amt.toFixed(2);
                    this.taskForm.controls.amount.setValue(remaining_amt);
                } else {
                    (formdata[task_num].ptask_amount) ? this.taskForm.controls.amount.setValue(formdata[task_num].ptask_amount) : '';
                }
                const reqAmt = +formdata[task_num].ptask_amount_request;
                this.taskForm.controls.amount_requested.setValue(reqAmt);

                this.taskForm.controls.original_amt.setValue(formdata[task_num].amount);
                this.taskForm.controls.ptask_bos.setValue(formdata[task_num].ptask_bos);
                this.taskForm.controls.p1_amt_req.setValue(formdata[task_num].p1_amt_req);
                this.taskForm.controls.p2_amt_req.setValue(formdata[task_num].p2_amt_req);

                (formdata[task_num].ongoingReason) ? this.taskForm.controls.ongoingReason.setValue(formdata[task_num].ongoingReason) : '';
            }
            else {

                this.taskForm.controls.status.setValue(2);
            }
            let val = (formdata[task_num]) ? formdata[task_num].ptask_payment_mode : '';
            const invoice_no = this.taskForm.get('invoice_no');
            const cheque_no = this.taskForm.get('cheque_no');
            const startdate = this.taskForm.get('actualstartdate');
            const ptask_allocate_to = this.taskForm.get('allocated_to');
            this.SelectedNEFT = false;
            this.SelectedCheque = false;
            if (val == 1) {
                this.SelectedNEFT = false;
                this.SelectedCheque = true;
                this.taskForm.controls.invoice_no.setValue('');
                invoice_no.clearValidators();
                invoice_no.updateValueAndValidity();
                cheque_no.setValidators([Validators.required]);
                cheque_no.updateValueAndValidity();
            } else if (val == 2) {
                this.SelectedNEFT = true;
                this.SelectedCheque = false;
                this.taskForm.controls.cheque_no.setValue('');
                cheque_no.clearValidators();
                cheque_no.updateValueAndValidity();
                invoice_no.setValidators([Validators.required]);
                invoice_no.updateValueAndValidity();
            }

            let status = this.taskForm.controls.status.value;
            if (task_num == 2 && status == 1) {
                ptask_allocate_to.setValidators([Validators.required]);
            } else {
                ptask_allocate_to.clearValidators();
            }
            ptask_allocate_to.updateValueAndValidity();
            // if(task_num == 5 || task_num == 6){
            //     startdate.clearValidators();
            //     enddate.clearValidators();
            // } else {
            //     startdate.setValidators([Validators.required]);
            //     enddate.setValidators([Validators.required]);
            // }
            //     startdate.updateValueAndValidity();
            //     enddate.updateValueAndValidity();

            // Get planned start date
            // let plannedStartDate = data.data.planned_start_date;
            // if(plannedStartDate) {
            //     plannedStartDate = plannedStartDate.split("/");
            //     let day = plannedStartDate[0];
            //     let month = parseInt(plannedStartDate[1]) - 1;
            //     let year = plannedStartDate[2];

            //     this.plannedStartDate = new Date(year, month, day);
            // }

            // Get One month ago date
            var currentDate = new Date();
            var oneMonthAgo = new Date(currentDate.getTime());
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            this.plannedStartDate = oneMonthAgo;
            
        });
    }

    calenderFormValidation(h_id, plan_type) {
        this.calenderForm = this.formBuilder.group({
            dates: [''],
            plan_type: [plan_type],
            weekdays: this.formBuilder.array([]),
            h_id: [h_id, Validators.compose([Validators.required])]
        });
    }

    onChangecheckbox(weekdays: any, isChecked: boolean) {
        const weekdaysFormArray = <FormArray>this.calenderForm.controls.weekdays;

        if (isChecked) {
            weekdaysFormArray.push(new FormControl(weekdays));
        } else {
            let index = weekdaysFormArray.controls.findIndex(x => x.value == weekdays)
            weekdaysFormArray.removeAt(index);
        }
    }

    ProceedPlan: boolean = false;
    ProceedProjectPlan(template_type: any = null) {
        if (localStorage.getItem('emp_auth_key')) {
            if (template_type != null) {
                this.project_type = template_type;
            } else {
                this.project_type = 1;
            }
            if (this.project_type > 0) {
                this.isView = 'working_day_proceed_plan';
                this.ProceedPlan = true;
                this.isListing = '';
                this.calenderFormValidation(this.h_id, this.project_type);
                if (this.calender) {

                    this.checkedweekdays = this.calender.workingdays;
                    this.nonworkingdays = '';
                    if (this.calender.holidaysobj) {
                        this.nonworkingdays = [];
                        (this.calender.holidaysobj).forEach(element => {
                            this.nonworkingdays.push(new Date(element));
                        });
                    }
                    this.calenderForm.controls.dates.setValue(this.nonworkingdays);
                } else {
                    this.checkedweekdays = [1, 2, 3, 4, 5];
                    this.nonworkingdays = '';
                }
                const weekdaysFormArray = <FormArray>this.calenderForm.controls.weekdays;
                (this.checkedweekdays).forEach(element => {
                    weekdaysFormArray.push(new FormControl(element));
                });
            } else {
                this.popupMessageService.showError('Please Select Template Type', 'Error');
            }

        } else {
            this.route.navigateByUrl('/employee/login');
        }


    }
    convertJsdate(dateString) {
        return new Date(dateString);
    }

    ProceedProjectPlanClose() {

        this.ProceedPlan = false;
        if (this.is_update_holiday) {
            this.isView = 'view_project_plan';
        } else {
            this.getAllocatedProject();
            this.CheckProjectSize(0);
        }

    }

    //save working days and calender data
    SaveWorkingDaysProjectPlan() {
        if (localStorage.getItem('emp_auth_key')) {
            if (this.calenderForm.valid && (this.calenderForm.value.weekdays).length) {
                this.subscription = this.projectManagementService.submitCalenderdata(this.calenderForm.value).subscribe(data => {
                    if (data.status == 1) {
                        this.popupMessageService.showSuccess('Data submitted successfully.', "Success");
                        this.isView = 'view_project_plan';
                        this.ProceedPlan = true;
                        if (this.is_update_holiday != true) {
                            this.projectplan = data.data.tasks;
                        } else {
                            this.calculateEndDate(0, this.calender);
                            let project_form_data = { 'project_plan': this.projectplan, 'h_id': this.h_id, "type": 1 };
                            this.projectManagementService.submitMilestoneCalendar(project_form_data).subscribe();
                        }
                        this.calender = data.data.calender;
                        this.isListing = '';
                    } else {
                        this.popupMessageService.showError(data.error_message, "Error!");
                    }
                }, error => {
                    this.popupMessageService.showError(error, "Error!");
                })

            } else {
                this.popupMessageService.showError('Insufficient Data', "Error!");
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    //view task page & complete task list
    CompleteTaskList(list, taskname) {
        let project_form_data = { 'project_plan': this.projectplan, 'h_id': this.h_id, "type": 1 };
        this.projectManagementService.submitMilestoneCalendar(project_form_data).subscribe();
        if (localStorage.getItem('emp_auth_key')) {
            this.isView = 'task_listby_milestone';
            this.tasklist = list;
            this.taskname = taskname;
            this.ProceedPlan = true;
            this.isListing = '';

        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }


    AcceptAssignedProject(h_id: any, isconfirm: any) {
        if (localStorage.getItem('emp_auth_key')) {
            this.h_id = h_id;
            this.isView = 'accept_assignedproject_plan';
            this.isListing = '';

            if (isconfirm == '1') {
                let obj = { 'status': 1 };
                this.projectManagementService.AcceptAssignedProject(h_id, obj).subscribe(data => {
                    this.getAllocatedProject();
                    this.Accepassignedproject = false;
                    this.popupMessageService.showSuccess('Accepted successfully.', "Success");
                })
            } else {
                this.getAssignedProjectList();
                this.Accepassignedproject = true;
            }


        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    HideAcceptAssignedProject() {
        if (localStorage.getItem('emp_auth_key')) {
            this.Accepassignedproject = false;
            this.getAssignedProjectList();

        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    RejectAssignedProject(h_id: any) {
        if (localStorage.getItem('emp_auth_key')) {
            this.h_id = h_id;
            this.getAssignedProjectList();
            this.Rejectassignedproject = true;
            this.isListing = '';

        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    DoRejectAssignedProject(event) {
        event.preventDefault()
        const target = event.target
        const reason = target.querySelector('#reason').value;
        if (reason.trim() == '') {
            this.popupMessageService.showError('Reason required!', "Error!");
            return false;
        }
        const h_id = target.querySelector('#h_id').value;
        let obj = { 'status': 2, 'remarks': reason };
        this.projectManagementService.AcceptAssignedProject(h_id, obj).subscribe(data => {
        })
        this.HideRejectAssignedProject();
        this.getAssignedProjectList();
        this.popupMessageService.showSuccess('Rejected successfully.', "Success");

    }

    HideRejectAssignedProject() {
        if (localStorage.getItem('emp_auth_key')) {
            this.getAssignedProjectList();
            this.Rejectassignedproject = false;
            this.isListing = '';

        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    //view hand off details
    handoff_remark: any;
    ViewHandoffDetails(handoff: any) {
        if (localStorage.getItem('emp_auth_key')) {

            this.handoff_data = handoff;
            this.projectManagementService.gethandofremark(handoff.h_id).subscribe((data) => {
                if (data.status == 1) {
                    if (data.handofremark.length > 0) {
                        this.handoff_remark = data.handofremark[0];
                    }
                    this.isListing = 'view_hand_off';
                }
            });

        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    pageloder: boolean = false;
    calculateEndDate(i: number, calender) {
        this.pageloder = true;
        let j: any;
        for (j = i; j < (this.projectplan).length; j++) {
            //this.pageloder=true;
            let startdate = new Date();
            if (typeof this.projectplan[j].startdate == 'string') {
                //startdate = (this.projectplan[j].startdate)?new Date(this.projectplan[j].startdate): new Date();
                let date = this.projectplan[j].startdate;
                startdate = new Date(date.split("/").reverse().join("-"));
            } else {
                startdate = new Date(this.projectplan[j].startdate);
            }
            let noofdays = (this.projectplan[j].noofdays > 0) ? this.projectplan[j].noofdays : 1;
            let count = 0;
            let pipe = new DatePipe('en-US');
            let endDate = new Date(startdate.setDate(startdate.getDate() - 1));
            let check_infinite = 0;
            while (count < noofdays) {
                if (check_infinite > 700) {
                    //console.log('goes infinite', check_infinite);
                    break;
                }
                endDate = new Date(endDate.setDate(endDate.getDate() + 1));
                if (calender.workingdays.includes(endDate.getDay())) {
                    const myFormattedDate = pipe.transform(endDate, 'dd/MM/yyyy');
                    if (!calender.holiday.includes(myFormattedDate)) {
                        count++;
                    }
                }
                check_infinite++;
            }
            this.projectplan[j].enddate = pipe.transform(endDate, 'dd/MM/yyyy');
            if (this.projectplan[j + 1]) {
                let count = 0;
                while (count < 1) {
                    startdate = new Date(endDate.setDate(endDate.getDate() + 1));
                    if (calender.workingdays.includes(startdate.getDay())) {
                        const myFormattedDate = pipe.transform(startdate, 'dd/MM/yyyy');
                        if (!calender.holiday.includes(myFormattedDate)) {
                            count++;
                        }
                    }
                }
                this.projectplan[j + 1].startdate = startdate;
            }
        }
        // this.resolveAfter2Seconds(i,calender).then(value=>{
        //     this.pageloder = false;
        //     //setTimeout (() => {
        //     //let project_form_data = {'project_plan':this.projectplan,'h_id':this.h_id,"type":1};
        //     //this.projectManagementService.submitMilestoneCalendar(project_form_data).subscribe();
        //     //}, 2000)
        // });

    }

    resolveAfter2Seconds(i: number, calender) {
        // return new Promise(resolve => {
        //         resolve(true);
        // });
    }

    submitmilestoneCalendar(type: any) {

        let empty = false;
        this.projectplan.forEach(plan => {
            if (plan.noofdays <= 0 || plan.noofdays == '' || plan.noofdays == undefined) {
                empty = true;
            }
        });

        if (type == 2) {
            if (empty) {
                this.popupMessageService.showError("Insufficient Data", "Error");
                return;
            }
        }
        if (this.projectplan) {
            let project_form_data = { 'project_plan': this.projectplan, 'h_id': this.h_id, "type": type };
            this.projectManagementService.submitMilestoneCalendar(project_form_data).subscribe(data => {
                if (data.status == 1) {
                    if (type == 2) {
                        this.popupMessageService.showSuccess('Data submitted successfully.', "Success");
                        this.getOngoingProjectList();
                    } else {
                        this.popupMessageService.showSuccess('Draft Saved successfully.', "Success");
                        this.getAllocatedProject();
                    }

                } else {
                    this.popupMessageService.showSuccess('Internal Server Error', "Error");
                }
            });
        } else {
            this.popupMessageService.showError('Please fill data to save.', "Error!");
        }
    }


    taskFormValidation(milestone, task_id: any = 0) {
        this.taskForm = this.formBuilder.group({
            productcost: ['', Validators.min(0)],
            platformcost: ['', Validators.min(0)],
            balanceofsystem: ['', Validators.min(0)],
            remarks: [''],
            actualstartdate: [],
            //actualenddate:[{value:'',disabled:true}],
            actualenddate: [''],
            allocated_to: [''],
            status: ['2', Validators.compose([Validators.required])],
            pp_id: [milestone.pp_id, Validators.compose([Validators.required])],
            tt_id: [task_id],
            milestone_id: [milestone.plnm_id],
            cheque_no: [],
            bank_drawn_no: [],
            ac_no: [],
            payment: [],
            sap_number: [],
            bank_reference_number: [],
            invoice_no: [],
            transaction_date: [],
            drawn_on_date: [],
            bankdrawnonname: [],
            allocatedddate: [],
            amount: [''],
            original_amt: [''],
            p1_amt_req: [''],
            p2_amt_req: [''],
            ptask_bos: [''],
            amount_requested: [''],
            outlier: [''],
            ongoingReason: [],


        });
        this.taskvalueChangeFunction(task_id);

        // this.createValidation(task_id);

    }

    get productcost() {
        return this.taskForm.get('productcost')
    }
    get platformcost() {
        return this.taskForm.get('platformcost')
    }

    get balanceofsystem() {
        return this.taskForm.get('balanceofsystem')
    }

    get allocated_to() {
        return this.taskForm.get('allocated_to')
    }
    createValidation(task_id: any) {
        // const sap_number = this.taskForm.get('sap_number');
        // const cheque_no = this.taskForm.get('bank_reference_number');
        // const transaction_date=this.taskForm.get('transaction_date');
        // const allocatedddate = this.taskForm.get('allocatedddate');
        // const payment =this.taskForm.get('payment');

        // if(task_id==11 || task_id==40 || task_id==12 || task_id==5){
        // cheque_no.setValidators([Validators.required]);
        // sap_number.setValidators([Validators.required]);
        // }
        // if( task_id==12){
        //     cheque_no.setValidators([Validators.required]);
        //     sap_number.setValidators([Validators.required]);
        //     }else{
        //     sap_number.clearValidators();
        //     cheque_no.clearValidators();
        // }
        // if(task_id == 5){
        //     transaction_date.setValidators([Validators.required]);
        // }else{
        //     transaction_date.clearValidators();
        // }
        // if(task_id == 1){
        //     payment.setValidators([Validators.required]);
        //   }else{
        //     payment.clearValidators();
        //   }
        // cheque_no.updateValueAndValidity();
        // sap_number.updateValueAndValidity();
        // transaction_date.updateValueAndValidity();
        // allocatedddate.updateValueAndValidity();
        // payment.updateValueAndValidity();

    }
    completedstatusvalue: any
    SelectedNEFT: boolean = false;
    SelectedCheque: boolean = false;
    taskvalueChangeFunction(task_id: any) {
        const invoice_no = this.taskForm.get('invoice_no');
        const cheque_no = this.taskForm.get('cheque_no');
        const bank_drawn_no = this.taskForm.get('bank_drawn_no');
        const drawn_on_date = this.taskForm.get('drawn_on_date');
        const ac_no = this.taskForm.get('ac_no');
        const transaction_date = this.taskForm.get('transaction_date');
        const productcost = this.taskForm.get('productcost');
        const platformcost = this.taskForm.get('platformcost');
        const balanceofsystem = this.taskForm.get('balanceofsystem')
        this.taskForm.get('payment').valueChanges.subscribe(val => {
            if (val == 1) {
                this.SelectedNEFT = false;
                this.SelectedCheque = true;
                this.taskForm.controls.invoice_no.setValue('');
                invoice_no.clearValidators();
                ac_no.clearValidators();
                transaction_date.clearValidators();
                cheque_no.setValidators([Validators.required]);
                bank_drawn_no.setValidators([Validators.required]);
                drawn_on_date.setValidators([Validators.required]);

            } else if (val == 2) {
                this.SelectedNEFT = true;
                this.SelectedCheque = false;
                this.taskForm.controls.cheque_no.setValue('');
                cheque_no.clearValidators();
                bank_drawn_no.clearValidators();
                drawn_on_date.clearValidators();
                drawn_on_date.updateValueAndValidity();
                invoice_no.setValidators([Validators.required]);
                ac_no.setValidators([Validators.required]);
                transaction_date.setValidators([Validators.required]);

            } else {
                invoice_no.clearValidators();
                ac_no.clearValidators();
                cheque_no.clearValidators();
                bank_drawn_no.clearValidators();
                drawn_on_date.clearValidators();
                transaction_date.clearValidators();
            }
            drawn_on_date.updateValueAndValidity();
            cheque_no.updateValueAndValidity();
            bank_drawn_no.updateValueAndValidity();
            invoice_no.updateValueAndValidity();
            ac_no.updateValueAndValidity();
            transaction_date.updateValueAndValidity();
        });

        this.taskForm.get('status').valueChanges.subscribe(val => {

            if(val =="1"){
                this.submitData=false
                this.isComplete=true
                this.isOngoingOrCompleted=false
                if(this.taskForm.value.tt_id ==3 && this.taskForm.value.milestone_id =="2"){
                    this.taskForm.controls.productcost.setValidators([Validators.required])
                    this.taskForm.controls.productcost.updateValueAndValidity()
                    this.taskForm.controls.platformcost.setValidators([Validators.required])
                    this.taskForm.controls.platformcost.updateValueAndValidity();
                    this.taskForm.controls.balanceofsystem.setValidators([Validators.required])
                    this.taskForm.controls.balanceofsystem.updateValueAndValidity();
                }
            }
            if (val != "1") {
                this.submitData = false
                this.isComplete = false
                if (val == "2") {
                    // this.isOngoingOrCompleted = false;
                    this.isOngoingOrCompleted = true
                }
                if (val == "3") {
                    this.isOngoingOrCompleted = false
                }
                this.taskForm.controls.productcost.clearValidators()
                this.taskForm.controls.productcost.updateValueAndValidity()
                this.taskForm.controls.platformcost.clearValidators()
                this.taskForm.controls.platformcost.updateValueAndValidity();
                this.taskForm.controls.balanceofsystem.clearValidators()
                this.taskForm.controls.balanceofsystem.updateValueAndValidity();

            }

            const allocated_to = this.taskForm.get('allocated_to');
            if ((task_id == 2 || task_id == 24) && val == 1) {
                allocated_to.setValidators([Validators.required]);
            } else {
                allocated_to.clearValidators();
            }
            allocated_to.updateValueAndValidity();
        });

        //   this.taskForm.valueChanges.subscribe(val => {
        //     this.subscription = this.projectManagementService.submitTaskdata(this.taskForm.value).subscribe(data => {

        //    })
        //   });
    }

    actualenddate: any;
    actualstartdate: any;

    SaveTaskdata(currentHandOffData: any = null) {
        this.submitData = true
        this.isStartDate=false
        if (localStorage.getItem('emp_auth_key')) {
            if(this.taskForm.value.status == 1){
                this.taskForm.get('actualstartdate')
                .setValidators(Validators.required)
            }
            else{
                this.taskForm.get('actualstartdate')
                .clearValidators()
            }
            this.taskForm.get('actualstartdate')
            .updateValueAndValidity()

            if (this.taskForm.value.actualenddate) {
                if (!this.taskForm.value.actualstartdate) {
                    this.isStartDate=true;
                    this.popupMessageService.showError('Start Date not found', "Error!");
                    return false;
                }
                let dateobj_strdate = this.sharedServices.getDateInFormat(this.taskForm.value.actualstartdate);
                let dateobj_enddate = this.sharedServices.getDateInFormat(this.taskForm.value.actualenddate);
                if (new Date(dateobj_strdate).getTime() > new Date(dateobj_enddate).getTime()) {
                    this.popupMessageService.showError('End date should be greater than start date!', "Error!");
                    return false;
                }
                if (this.taskForm.value.status != 1) {
                    this.popupMessageService.showError('End date should be enter on task complete', "Error!");
                    return false;
                }
            } else {
                if (this.taskForm.value.status == 1) {
                    this.isEndDate=true
                    this.taskForm.get('actualenddate')
                    .setValidators(Validators.required)
                    this.taskForm.get('actualenddate')
                    .updateValueAndValidity()
                    this.popupMessageService.showError('End date is mandatory on task complete', "Error!");
                    return false;
                }
            }

            // if(this.taskForm.value.status == 2) {
            //     this.taskForm.get('bank_drawn_no').clearValidators();
            //     this.taskForm.get('bank_drawn_no').updateValueAndValidity();
            // }


            if (this.taskForm.valid && this.taskForm.value.status != 2) {
            // if (this.taskForm.valid) {
                this.subscription = this.projectManagementService.submitTaskdataLegacy(this.taskForm.value).subscribe(data => {
                    if (data.status == 1) {
                        this.submitData = false
                        this.popupMessageService.showSuccess('Task submitted successfully.', "Success");
                        //setTimeout(()=>{
                        this.ViewTaskform_detail(this.activetask, this.plan, this.tasksdata, true)
                        // if(this.taskForm.value.status == 2) {
                        //     this.taskForm.reset();
                        //     this.SelectedNEFT = false;
                        //     this.SelectedCheque = false;
                        // } else {
                        //     this.ViewTaskform_detail(this.activetask, this.plan, this.tasksdata, true)
                        // }

                        //},800);

                        //this.Ongoingviewprojectplan(currentHandOffData);

                    }
                    else {
                        this.popupMessageService.showError(data.error_message, "Error!");
                    }
                }, error => {
                    this.popupMessageService.showError(error, "Error!");
                })

            } else {
                Object.keys(this.taskForm.controls).forEach(key => {
                    const controlErrors: ValidationErrors = this.taskForm.get(key).errors;
                    if (controlErrors != null) {
                        Object.keys(controlErrors).forEach(keyError => {
                            //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                        });
                    }
                });
                this.popupMessageService.showError('Invalid Data', "Error!");
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }



    //view interaction log
    interactionLog: any;
    getIntercationLog(projectId: any) {
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
    ViewinteractionClose() {
        this.viewinteractionlog = false;
    }




    handleFilesDropped(event: any, task_id: any, milestone_id: any, handoff_data: any = null, plan: any = null) {
        let eventAsSelectfile = { 'target': { 'files': event } };
        this.fileChange(eventAsSelectfile, task_id, milestone_id, handoff_data, plan);
    }



    fileChange(event: any, task_id: any, milestone_id: any, handoff_data: any = null, plan: any = null) {
        let is_from_handOff = false;

        let hid = this.currentHandOffData.h_id;
        if (task_id == undefined || task_id == '') {
            task_id = this.activetask
        }
        if (localStorage.getItem('emp_auth_key')) {

            // this.isSubmittedDocs = groupIndex;
            if (task_id != '') {
                this.actionLoader = 'upload_loader';
                let eventClone = event;
                let documentName = eventClone.target.files[0].name;//'taskDoc'+task_id;
                let extType = event.target.files[0].type;
                let ext = eventClone.target.files[0].name.split('.').pop();
                this.sharedServices.docsToBase64(event, ["pdf", "doc", "docx", "msword", "xls", "xlsx", "csv", "jpeg", "jpg", "png", "PDF", "DOC", "DOCX", "XLS", "XLSX", "CSV", "JPEG", "JPG", "PNG"]).then(data => {
                    this.imageDocsIssues = '';
                    this.isUploadingDocs = true;
                    this.subscription = this.sharedServices.uploadTaskDocument(hid, task_id, plan.Milestone.pp_id, milestone_id, documentName, String(data), ext, extType, 'not_audit').subscribe(data => {
                        if (data.status == 1) {
                            this.getUploadedDocumentsTask(task_id);
                            this.uploadDocument.reset();
                            this.isSubmittedDocument = false;
                            this.popupMessageService.showSuccess("File Uploaded Successfully", "Success!");
                            this.actionLoader = '';

                        } else if (data.error_code != 0) {
                            this.actionLoader = '';
                            this.popupMessageService.showError(data.error_message, "Error!");
                        }
                    });
                }).catch(data => {
                    this.actionLoader = '';
                    this.isSubmittedDocument = false;
                    this.popupMessageService.showError(data, "Invalid File Type!");
                    //this.alertService.error(data);
                });
            } else {
                this.popupMessageService.showError("OOPs! Please Select Task Id.", "Required Field Error!");
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    getUploadedDocumentsTask(task_id) {
        let h_id = this.currentHandOffData.h_id;
        if (localStorage.getItem('emp_auth_key')) {
            this.actionLoader = 'uploadedDocs_loader';
            this.projectDocuments = [];
            this.subscription = this.projectManagementService.getUploadedDocumentsTask(h_id, task_id).subscribe(data => {
                if (data.status == 1) {
                    this.projectDocuments = data.data;
                    this.actionLoader = '';
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                    this.actionLoader = '';
                    //this.route.navigateByUrl('');
                }
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    noofdayskeyPress(event: any) {
        const pattern = /[1-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if ((!pattern.test(inputChar) && event.keyCode != 8) || inputChar.length > 2) {
            // invalid character, prevent input
            event.preventDefault();
        }

    }

    holidaydate(event: any) {
        const pattern = /[0-9,-]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar) && event.keyCode != 8) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    datecheck(event: any) {
        const pattern = /[^]/;//prevent any thing from input
        let inputChar = String.fromCharCode(event.charCode);
        if (pattern.test(inputChar) && event.keyCode != 8) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    partnerList: Array<any> = [];
    getpartnerListArray() {
        //24 for partner
        //25 for cce supervisor
        this.subscription = this.leadListService.getEmployeeDataByRole(24).subscribe(data => {
            if (data.status) {
                if (data.data.length <= 0) {
                    this.partnerList = [];
                } else {
                    for (let item of data.data) {
                        this.partnerList.push({ value: String(item.emp_id), label: String(item.emp_firstname) });
                    }
                }
            } else if (data.error_code != 0) {
                this.popupMessageService.showError(data.error_message, "Error!");
            }
        }, (error) => {
            this.popupMessageService.showError("Server Error.", "Server Error!");
        });
    }

    auditorList = [];
    getAuditorListArray() {
        //24 for partner
        //25 for cce supervisor
        //4 for auditor
        this.subscription = this.leadListService.getEmployeeDataByRole(4).subscribe(data => {
            if (data.status) {
                if (data.data.length <= 0) {
                    this.auditorList = [];
                } else {
                    for (let item of data.data) {
                        this.auditorList.push({ value: String(item.emp_id), label: String(item.emp_firstname) });
                    }
                }
            } else if (data.error_code != 0) {
                //this.popupMessageService.showError(data.error_message, "Error!");
            }
        }, (error) => {
            //this.popupMessageService.showError("Server Error.", "Server Error!");
        });
    }

    is_update_holiday: boolean = false;
    updateHoliday() {
        let calendar = this.calender;
        let template_type = 1;
        this.ProceedProjectPlan(template_type);
        this.is_update_holiday = true;
    }

    taskLogData: Array<any> = [];
    TaskpopUp: boolean = false;
    viewlog_handoffid: any;
    viewTaskLog(ptask_id: any = false, viewlog_handoffid: any = null) {
        this.viewlog_handoffid = viewlog_handoffid;
        this.TaskpopUp = true;
        this.taskLogData = [];
        this.projectManagementService.getTaskLog(ptask_id).subscribe(data => {
            if (data.status == 1) {
                this.taskLogData = data.data;
            }
        });
    }


    isSelected(day) {
        return this.checkedweekdays.indexOf(day) >= 0;
    }

    //preview mail and sms
    task_id: any;
    smstext: any = '';
    emailtext: any = '';
    payment_no: any = '';
    employeeinfo: any = null;
    partername: any = '';
    Priview_mail_sms(task_id: any = null, milestone_id: any = null, currentHandOffData: any = null, plan: any = null, doc_id: any = []) {
        this.smstext = '';
        this.emailtext = '';
        if (task_id == 2) {
            this.smstext = 'Hello! A new SbL project is being planned with you. Your account manager shall connect with you shortly. Regards Team solarbyluminous';
        } else if (task_id == 3) {
            this.smstext = 'Hello! A new Supply order has been generated. Please review e-mail & share acceptance within 2 days. Regards Team solarbyluminous';
        }
        let bank_trx = '';
        if (this.tasksdata[task_id]) {
            bank_trx = this.tasksdata[task_id].ptask_bank_reference_number;
        }
        if (task_id == 5 || task_id == 11 || task_id == 40) {
            this.payment_no = task_id == 5 ? 'advance' : task_id == 11 ? '2nd Tranche' : 'Final Tranche';
            this.emailtext = '<p>Dear '+ this.partername + ',</p><br/><p>This has reference to supply order for Customer ' + currentHandOffData.h_data.cceLeaddata.cceld_firstname + ' ' + currentHandOffData.h_data.cceLeaddata.cceld_lastname + ' project reference ' + currentHandOffData.h_data.consumerProject.project_code + '. </p><br/> <p>We have transferred a sum of <Rs.xxxxxxx> as ' + this.payment_no + ' payment towards the project. Transaction ID for the same is : ' + bank_trx + '.</p><br/> <p> Please check your bank account to verify the same. Let us know in case of any discrepencies. </p><br/>Regards<br/>Team solarbyluminous';
        } else if (task_id == 3) {
            this.emailtext = '<p>Dear '+ this.partername + ',</p><br/><p>Greetings from solarbyluminous!</p><br/><p>Please find enclosed a fresh supply order for Customer ' + currentHandOffData.h_data.cceLeaddata.cceld_firstname + ' ' + currentHandOffData.h_data.cceLeaddata.cceld_lastname + ' project reference ' + currentHandOffData.h_data.consumerProject.project_code + '. </p><br/><p>Kindly review the enclosed document and send your formal acceptance within 2 days by sharing a duly signed and stamped scanned copy of the document .</p><br/>Regards <br/>Team solarbyluminous';
        }

        if (localStorage.getItem('emp_auth_key')) {
            this.projectManagementService.get_task_allocated(currentHandOffData.h_id).subscribe((data) => {
                if (data.status == 1) {
                    this.smsSent = data.data.planTaskLog.sms_sent;
                    this.emailSent = data.data.planTaskLog.email_sent;
                    this.employeeinfo = data.data['0'].employee;
                    this.partername = this.employeeinfo.emp_firstname + ' ' + this.employeeinfo.emp_lastname;
                    if (task_id == 5 || task_id == 11 || task_id == 40) {
                        this.payment_no = task_id == 5 ? 'advance' : task_id == 11 ? '2nd Tranche' : 'Final Tranche';
                        this.emailtext = '<p>Dear ' + this.partername + ',</p><br/><p>This has reference to supply order for Customer ' + currentHandOffData.h_data.cceLeaddata.cceld_firstname + ' ' + currentHandOffData.h_data.cceLeaddata.cceld_lastname + ' project reference ' + currentHandOffData.h_data.consumerProject.project_code + '. </p><br/> <p>We have transferred a sum of <Rs.xxxxxxx> as ' + this.payment_no + ' payment towards the project. Transaction ID for the same is : ' + bank_trx + '.</p><br/> <p> Please check your bank account to verify the same. Let us know in case of any discrepencies. </p><br/>Regards<br/>Team solarbyluminous';
                    } else if (task_id == 3) {
                        this.emailtext = '<p>Dear ' + this.partername + ',</p><br/><p>Greetings from solarbyluminous!</p><br/><p>Please find enclosed a fresh supply order for Customer ' + currentHandOffData.h_data.cceLeaddata.cceld_firstname + ' ' + currentHandOffData.h_data.cceLeaddata.cceld_lastname + ' project reference ' + currentHandOffData.h_data.consumerProject.project_code + '. </p><br/><p>Kindly review the enclosed document and send your formal acceptance within 2 days by sharing a duly signed and stamped scanned copy of the document .</p><br/>Regards <br/>Team solarbyluminous';
                    }
                }
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

        this.task_id = task_id;
        this.milestone_id = milestone_id;
        this.currentHandOffData = currentHandOffData;
        this.plan = plan;
        this.doc_id = doc_id;
        this.Previewmailsms = true;


    }

    HidePriview_mail_sms() {
        this.Previewmailsms = false;
    }

    _keyPress(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar) && event.keyCode != 8) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }


    //calculate date difference between two date
    getdatediff(date1) {
        let pipe = new DatePipe('en-US');
        let todaydate = pipe.transform(this.currentDate, 'dd-MM-yyyy');
        if (date1 != null && date1 != '') {
            let currentdate = todaydate;
            let currentdate_array = currentdate.split("-");
            let currentdate_newDate = currentdate_array[1] + "/" + currentdate_array[0] + "/" + currentdate_array[2];
            let current_date_time = new Date(currentdate_newDate).getTime();

            let myDate = date1;
            let myDate_array = myDate.split("/");
            let newDate = myDate_array[1] + "/" + myDate_array[0] + "/" + myDate_array[2];
            let end_date_time = new Date(newDate).getTime();
            let diff = (current_date_time - end_date_time);
            let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
            if (diffDays > 0) {
                return diffDays;
            } else {
                return '';
            }


        } else {
            return '';
        }

    }

    //delete task documents
    ConfirmDeleting: boolean = false;
    pdoc_data: any;
    pid: any;
    confirmDeleteTaskDoc(data, handoff: any = null) {
        this.ConfirmDeleting = true;
        this.pdoc_data = data;
        this.pid = handoff.h_data.consumerProject.project_id;
        this.currentHandOffData = handoff;

    }
    hideConfirmDeleting() {
        this.ConfirmDeleting = false;
    }

    DeleteTaskDocument(pdoc_data, pid: any = null, handoff) {
        let tdoc_id = pdoc_data.tdoc_id;
        this.projectManagementService.deleteTaskPdoc(tdoc_id).subscribe((data) => {
            if (data.status == 1) {
                this.ConfirmDeleting = false;
                this.currentHandOffData = handoff;
                this.getUploadedDocumentsTask(pdoc_data.tdoc_task_id);
                this.popupMessageService.showInfo('Document Removed', '!Info');

            } else {
                this.ConfirmDeleting = false;
                this.popupMessageService.showInfo('Document Removed failed', '!Info');
            }

        });
    }

    notifypartner: any = 0;
    //send notification to partner
    SendNotification_Partner(task_id: any, milestone_id: any, handoff_data: any = null, plan: any = null) {
        this.notifypartner = 1;


        if (localStorage.getItem('emp_auth_key')) {
            this.projectManagementService.Notify_task_toPartner(task_id, handoff_data.h_id, plan.Milestone.pp_id, milestone_id).subscribe((data) => {

                this.notifypartner = '0';
                if (data.status == 1) {
                    this.popupMessageService.showSuccess("Notification sent to partner successfully", "Success!");
                } else {
                    this.popupMessageService.showError(data.data, "Server Error!");
                }

            });

        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    isShowOngoingReason = false;
    onChangetaskcomplete(i: any, type) {
        let actualend = this.taskForm.controls.actualenddate;
        let actualstart=this.taskForm.controls.actualstartdate;
        if (i == 1) {
            this.showactualenddate = true;
            actualend.setValidators([Validators.required]);
            actualstart.setValidators(Validators.required)



        } else {
            this.showactualenddate = false;
            actualend.setValue('');
            actualend.clearValidators();
        }
        //console.log(this.tasksdata);

        if(i == 3 && this.tasksdata[type] &&this.tasksdata[type].ptask_id) {
            this.isShowOngoingReason = true;
        }

        actualend.updateValueAndValidity();
        actualstart.updateValueAndValidity();
    }
    projects: any;
    smartSearchResults($event) {
        this.totalItem = $event.result._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = 1;
        this.createPaginationSubmitForm();
        this.searchResult = $event.result.data;
        this.sharedServices.searchForm.subscribe((data) => {
            this.projects = data;
        })
        this.sharedServices.formDataSmartSearch.subscribe((data) => {
            this.smartSearchFormData = data;
        });
        let ongoingproject_list = [];
        if ($event.status == 1) {
            let hdata = null;
            this.searchResult.forEach(function (value) {
                try {
                    hdata = JSON.parse(value.handOff.h_data);
                } catch (e) {
                    hdata = value.handOff.h_data;
                }
                if (hdata) {
                    value.handOff.h_data = hdata[0]
                    ongoingproject_list.push(value);
                }
            });
        }
        if (this.projects == 'ongoing') {
            this.ongoingProjects = [];
            this.ongoingProjects = ongoingproject_list;
        } else if (this.projects == 'completed') {
            this.completedProjectlist = [];
            this.completedProjectlist = ongoingproject_list;
        } else if (this.projects == 'allocated') {
            this.allocateProjectList = [];
            this.allocateProjectList = ongoingproject_list;
        } else {
            this.assignedProjectList = [];
            this.assignedProjectList = ongoingproject_list;
        }
    }

    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
        });
    }

    /** PM projects Listing Data
     *
     * @developer : <gunjan.sharma@kelltontech.com>
     * @lastModifiedDate : 30 Oct 2019
    */
    getprojectsList(page, sidenavCLick = false) {
        this.showSmartSearchComponent = true;

        this.leadListService.getProjectsListing(page, this.itemPerPage, this.projects, this.smartSearchFormData)
            .subscribe(
                data => {
                    if (data.status) {

                        this.totalItem = data.result._meta.total_records;
                        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                        this.pages = page;
                        this.sharedServices.searchForm.subscribe((data) => {
                            this.projects = data;
                        })
                        let ongoingproject_list = [];
                        let hdata = null;
                        data.result.data.forEach(function (value) {
                            try {
                                hdata = JSON.parse(value.handOff.h_data);
                            } catch (e) {
                                hdata = value.handOff.h_data;
                            }
                            if (hdata) {
                                value.handOff.h_data = hdata[0]
                                ongoingproject_list.push(value);
                            }
                        });

                        if (this.projects == 'ongoing') {
                            this.ongoingProjects = [];
                            this.ongoingProjects = ongoingproject_list;
                        } else if (this.projects == 'completed') {
                            this.completedProjectlist = [];
                            this.completedProjectlist = ongoingproject_list;
                        } else if (this.projects == 'allocated') {
                            this.allocateProjectList = [];
                            this.allocateProjectList = ongoingproject_list;
                        } else {
                            this.assignedProjectList = [];
                            this.assignedProjectList = ongoingproject_list;
                        }
                        // if(!pagination){
                        this.createPaginationSubmitForm();
                        // }
                    }
                }
            );
    }
    prevListing = '';
    projectDetailData: any;
    handoff_id: any;
    projectDetailTaskDataModified = []
    ProjectDetailView(handoff) {
        if (localStorage.getItem('emp_auth_key')) {
            this.handoff_data = handoff;
            this.projectManagementService.getProjectDetail(handoff.h_id, handoff.h_data.consumerProject.project_id).subscribe((data) => {
                if (data.status == 1) {
                    this.handoff_id = handoff.h_id;
                    this.prevListing = this.isListing;
                    this.isListing = "view_project_detail";
                    this.projectManagementService.transformProjectDetailData(data.data[0].taskData, handoff.gridtype)
                    this.projectDetailData = data.data[0];
                }
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    CloseProjectDetail() {
        this.isListing = this.prevListing;
        this.prevListing = '';
    }

    pageSubmit() {
        if (this.paginationSubmitForm.valid) {
            let page = this.paginationSubmitForm.controls.page_number.value;
            this.sharedServices.searchForm.subscribe((data) => {
                this.projects = data;
            })
            this.leadListService.getProjectsListing(page, this.itemPerPage, this.projects, this.smartSearchFormData).subscribe((data) => {
                if (data.status) {
                    let ongoingproject_list = [];
                    let hdata = null;
                    data.result.data.forEach(function (value) {
                        try {
                            hdata = JSON.parse(value.handOff.h_data);
                        } catch (e) {
                            hdata = value.handOff.h_data;
                        }
                        if (hdata) {
                            value.handOff.h_data = hdata[0]
                            ongoingproject_list.push(value);
                        }
                    });
                    if (this.projects == 'ongoing') {
                        this.ongoingProjects = [];
                        this.ongoingProjects = ongoingproject_list;
                    } else if (this.projects == 'completed') {
                        this.completedProjectlist = [];
                        this.completedProjectlist = ongoingproject_list;
                    } else if (this.projects == 'allocated') {
                        this.allocateProjectList = [];
                        this.allocateProjectList = ongoingproject_list;
                    } else {
                        this.assignedProjectList = [];
                        this.assignedProjectList = ongoingproject_list;
                    }
                    this.totalItem = data.result._meta.total_records;
                    this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                    this.pages = page;
                    this.createPaginationSubmitForm();
                } else {
                    //console.log('error');
                }
            })

        }
    }

    _keyPresspagination(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (this.pageCount < (this.paginationSubmitForm.controls.page_number.value + event.key))
            event.preventDefault();
        if (!pattern.test(inputChar) && event.keyCode != 8) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    /*
    * No Operation Function
    */
    noop() { }
}
