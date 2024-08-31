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
import { SharedServices } from '../../../services/shared.services';

@Component({
    selector: 'partner-lead-list',
    templateUrl: './lead-list-partner.component.html'
})
export class PartnerListPanel implements OnInit {
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
    rejectionChecklists:any =[];
    isRemarkable: boolean = false;
    isEligibleForDocUpload:boolean;
    documentsToBeUploaded:any ='0,';
    uploadDocument: FormGroup;
    isSubmittedDocument:boolean;
    imageDocsIssues:string = '';
    isUploadingDocs:boolean;
    myHtml: String = '';
    documentList:any;
    currentProjectId:any;
    openStates: string[] = ['14', '15', '20', '21', '22', '23', '26', '27', '29', '30', '31'];
    actionLoader: string = '';
    actionableList: any = [];
    nonActionableList: any = [];

    constructor(
        private route: Router,
        private sharedServices: SharedServices,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadListService: LeadListService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService
    ) { }

    ngOnInit() {
      this.sharedServices.searchForm.next('leadListPartnerListing');
        // this.rightMove();
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
        }
        this.getLeadListDetails();
        this.createChecklistSubmitForm();
        this.createDocumentForm();
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
        this.actionableList = [];
        this.nonActionableList = [];
        this.userData = JSON.parse(localStorage.getItem('userData'));
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.getLeadDetailsForEmployee().subscribe(data => {
                if (data.status) {
                    this.leadData = data.result.data;
                    this.isListing = true;
                    this.getActionNonActionArrays(this.leadData);
                } else {
                    console.log('error');
                }
            })
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
        this.isEligibleForDocUpload = false;
        this.myHtml = '';
        if (localStorage.getItem('emp_auth_key')) {
            this.isRemarkable = false;
            this.createChecklistSubmitForm();
            this.subscription = this.leadListService.getProjectDetailsForChecklists(projectId).subscribe(data => {
                if (data.status) {
                    this.projectChecklistData = data.data;
                    this.isListing = false;
                    this.currentProjectId = projectId;
                    this.ChecklistItems = this.convertForSelectForPartner(this.projectChecklistData);
                    if (this.projectChecklistData.length <= 0) {
                        this.getLeadListDetails();
                    } else {
                        this.getUploadDocumentName();
                        this.getUploadedDocumentsForPartner(projectId);
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
            // console.log();
            this.actionLoader = 'checklist_loader';
            let project_id = this.currentProjectId;
            this.subscription = this.leadListService.checklistSubmitService(project_id, this.checklistSubmitForm.value).subscribe(data => {
                if (data.status) {
                    this.isRemarkable = false;
                    this.createChecklistSubmitForm();
                    this.isSubmitChecklist = false;
                    this.popupMessageService.showSuccess("Response Submitted Successfully", "Success!");
                    this.openProjectChecklistDetails(project_id);
                    this.actionLoader = '';
                } else if (data.error_code != 0) {
                    this.popupMessageService.showError(data.error_message, "Error!");
                    this.actionLoader = '';
                }
            }, (error) => {
                this.popupMessageService.showError("Server Error.", "Server Error!");
                this.actionLoader = '';
            });
        }
    }


    convertForSelectForPartner(listItems: any) {
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

    getUploadedDocumentsForPartner(project_id) {
        if (localStorage.getItem('emp_auth_key')) {
            this.actionLoader = 'uploadedDocs_loader';
            let docType = 'Work Order';
            this.subscription = this.leadListService.getUploadedDocuments(project_id, localStorage.getItem('role_id'), docType).subscribe(data => {
                if (data.status == 1) {
                    this.projectDocuments = data.data;
                    this.actionLoader = '';
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                    this.actionLoader = '';
                }
            }, (error) => {
                this.popupMessageService.showError("Some Error", "Error!");
                this.actionLoader = '';
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }

    public createDocumentForm() {
        this.uploadDocument = this.formBuilder.group({
            uploadDocumentFile: ['', [Validators.required]],
            documentListName: ['', [Validators.required]]
        });
    }
    fileChange(event: any, pid: Number) {
        if (localStorage.getItem('emp_auth_key')) {
            this.isSubmittedDocument = true;
            if (this.uploadDocument.value.documentListName) {
                let documentType = this.uploadDocument.value.documentListName;
                // this.isSubmittedDocs = groupIndex;
                if (documentType != '') {
                    this.actionLoader = 'upload_loader';
                    let eventClone = event;
                    let extType = event.target.files[0].type;
                    let ext = eventClone.target.files[0].name.split('.').pop();
                    this.sharedServices.docsToBase64(event, ["pdf", "doc", "docx", "msword", "xls", "xlsx", "csv", "jpeg", "jpg", "png", "PDF", "DOC", "DOCX", "XLS", "XLSX", "CSV", "JPEG", "JPG", "PNG"]).then(data => {
                        this.imageDocsIssues = '';
                        this.isUploadingDocs = true;
                        this.subscription = this.sharedServices.uploadSpceDocument(pid, documentType, String(data), ext, extType).subscribe(data => {
                            if (data.status == 1) {

                                if (["jpeg", "jpg", "png", "JPEG", "JPG", "PNG"].indexOf(ext) != -1) {
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
                                }
                                this.uploadDocument.reset();
                                this.isSubmittedDocument = false;
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
                        this.isSubmittedDocument = false;
                        this.popupMessageService.showError(data, "Invalid File Type!");
                        //this.alertService.error(data);
                    });
                } else {
                    this.popupMessageService.showError("OOPs! It seems you don't select any document type. Please Select Document type before uploading the file.", "Required Field Error!");
                }
            } else {
                this.popupMessageService.showError("OOPs! It seems you don't select any document type. Please Select Document type before uploading the file.", "Required Field Error!");
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
            this.subscription = this.leadListService.getUploadMasterData(this.documentsToBeUploaded).subscribe(data => {
                if (data.status == 1) {
                    this.documentList = this.convertForSelect(data.data);
                } else {
                    this.alertService.error(data.error_message);
                }
            }, (error) => {
                console.log("Error in response");
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    /**
     * Convert Data for Select Document Type
     */
    convertForSelect(listItems: any) {
        if (listItems.length <= 0) {
            return [];
        } else {
            let arrPush = [];
            // let prelimStates: string[] = ['5', '9', '12'];
            // let workOrderStates: string[] = ['11', '15'];
            // let finalStates: string[] = ['17', '21', '24'];
            for (let item of listItems) {
                // if (prelimStates.indexOf(this.currentProjectState)>-1 && item.document_name == 'Prelim Proposal'){
                //     arrPush.push({ value: String(item.document_name), label: String(item.document_name) });
                // } else if (workOrderStates.indexOf(this.currentProjectState) > -1 && item.document_name == 'Work Order') {
                //     arrPush.push({ value: String(item.document_name), label: String(item.document_name) });
                // } else if (finalStates.indexOf(this.currentProjectState) > -1 && (item.document_name == 'Final Proposal' || item.document_name == 'Performa Invoice')) {
                arrPush.push({ value: String(item.document_name), label: String(item.document_name) });
                // }
            }
            return arrPush;
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
            // console.log(this.checklistSubmitForm.controls.remarks);
        }
    }

    getActionNonActionArrays(plist: any) {
        if (plist) {
            for (let item of plist) {
                if (this.openStates.indexOf(item.project_state) > -1) {
                    this.actionableList.push(item);
                } else {
                    this.nonActionableList.push(item);
                }
            }
        }
    }
    submitSmartSearch(event) {
    }

}
