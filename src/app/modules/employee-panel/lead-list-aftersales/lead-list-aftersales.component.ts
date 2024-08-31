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

@Component({
    selector: 'aftersales-lead-list',
    templateUrl: './lead-list-aftersales.component.html'
})
export class AfterSalesListPanel implements OnInit {
    isLoginEmp: boolean;
    times: any = TIMES;
    userData: any;
    subscription: Subscription;
    isData: boolean = false;
    leadData: any = [];
    empRole: any;
    test: any;
    jsonData: any;
    isListing: boolean = false;
    projectChecklistData: any = [];
    ChecklistItems: any;
    checklistSubmitForm: FormGroup;
    isSubmitChecklist: boolean = false;
    projectDocuments: any;
    baseurl: string;
    isRemarkable: boolean = false;

    constructor(
        private route: Router,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadListService: LeadListService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService
    ) { }

    ngOnInit() {

        console.log("IN FINANCE");
        // this.rightMove();
        this.getLeadListDetails();
        this.createChecklistSubmitForm();
        // this.baseurl = globals.API_BASE_URL;
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
    //         }
    //     } else {
    //         this.route.navigateByUrl('/employee/login');
    //     }
    // }

    getLeadListDetails() {

        this.userData = JSON.parse(localStorage.getItem('userData'));
        console.log(this.userData.role_name);
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.getLeadDetailsForEmployee().subscribe(data => {
                if (data.status) {
                    this.leadData = data.result.data;
                    this.isListing = true;
                    console.log(this.leadData);
                } else {
                    console.log('error');
                }
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    createChecklistSubmitForm() {
        this.checklistSubmitForm = this.formBuilder.group({
            checklist_name: ['', Validators.compose([Validators.required])],
            checklist_status: ['', Validators.compose([Validators.required])],
            remarks: ['']
        })
    }

    openProjectChecklistDetails(projectId: any) {
        console.log(projectId);
        if (localStorage.getItem('emp_auth_key')) {
            this.isRemarkable = false;
            this.checklistSubmitForm.reset();
            this.subscription = this.leadListService.getProjectDetailsForChecklists(projectId).subscribe(data => {
                if (data.status) {
                    this.projectChecklistData = data.data;
                    this.isListing = false;
                    this.ChecklistItems = this.convertForSelectForAftersales(this.projectChecklistData);
                    if (this.ChecklistItems.length <= 0) {
                        this.getLeadListDetails();
                    }
                    //console.log(this.projectChecklistData);
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
        if (this.checklistSubmitForm.valid) {
            // console.log();
            let project_id = this.projectChecklistData[0].pstatus_projectid;
            this.subscription = this.leadListService.checklistSubmitService(project_id, this.checklistSubmitForm.value).subscribe(data => {
                if (data.status) {
                    console.log(data);
                    this.isRemarkable = false;
                    this.checklistSubmitForm.reset();
                    this.isSubmitChecklist = false;
                    this.openProjectChecklistDetails(project_id);
                } else if (data.error_code != 0) {
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.popupMessageService.showError("Server Error.", "Server Error!");
            });
        }
    }


    convertForSelectForAftersales(listItems: any) {
        console.log(listItems.length);
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            for (let item of listItems) {
                // if (item.psm_is_reopen_or_rejected != 1) {
                if (item.pstatus_checkliststatus != 1) {
                    arrPush.push({ value: String(item.psm_id), label: String(item.psm_status) });
                }
                // }
            }
            return arrPush;
        }
    }


    checkIfRemarkable(state) {
        console.log(state);
        if (globals.REMARKABLE.indexOf(state) > -1) {
            this.isRemarkable = true;
        } else {
            this.isRemarkable = false;
        }
    }


}