import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormControl, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';

import { InlineMessageService } from './../../message/services/message.service';
import { SharedServices } from '../../../services/shared.services';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { LeadListService } from 'app/modules/employee-panel/services/lead-list.service';
import { ProjectManagementService } from 'app/modules/employee-panel/services/project-management.services';

@Component({
    selector: 'app-finance-ssp-details',
    templateUrl: './finance-ssp-details.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css','./finance-ssp-details.component.css']
})
export class FinanceSspDetails implements OnInit {

    Listing: any;
    paymentList: any;
    paymentRequestList: any;
    userData: boolean = false;
    currentDate: any = new Date();
    listTraverse: any;
    currentProjectId: any;
    prcValue = false;
    transactionDate: any;
    isEndDate:boolean=false;
    transactionDatePC: any;
    taskstartdate:Date;
    submitData:boolean=false
    public loadingList  = false;

    showTranchePaymentLog = false;

    tranchePaymentLog: any;

    paymentHistoryData: any;
    isShowPaymentHistory:boolean = false;

    pages: any = 1;
    itemPerPage: any = 20;

    showSmartSearchComponent: boolean;
    totalItem: any;
    pageCount: number;
    searchResult: any;
    smartSearchFormData: string;
    paginationSubmitForm: FormGroup;
    public paymentTranceSubmitCheque = false;
    lastApprovedMessage = '';
    showIsApproved = false;
    loader = false;

    constructor(
        private route: Router,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private sharedServices: SharedServices,
        private leadListService: LeadListService,
        private projectManagementService: ProjectManagementService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService,
        private datePipe: DatePipe
    ) {

      let webformRoles:any = localStorage.getItem('webform_userData');
      webformRoles = JSON.parse(webformRoles)
      webformRoles = webformRoles.emp_webform_role;
      webformRoles = webformRoles.split(",");

      if(!webformRoles.includes('3')) {
        // Navigate to first route with permission
        const navigateRoute = webformRoles[0];
        if(navigateRoute && navigateRoute == 2) {
          this.route.navigate(['/webform/ssp-payment-approval'])
        }
        if(navigateRoute && navigateRoute == 1) {
          this.route.navigate(['/webform/opshead-approval'])
        }
      }
    }

    ngOnInit() {
        this.showSmartSearchComponent = true;
        this.createPaginationSubmitForm();
        this.getPayRequest();
    }

    smartSearchResults($event) {
        this.totalItem = $event._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = 1;
        this.searchResult = $event.result;
        this.sharedServices.searchForm.subscribe((data) => {
            this.Listing = data;
        })
        this.sharedServices.formDataSmartSearch.subscribe((data) => {
            this.smartSearchFormData = data;
        });
        if ($event.status == 1) {
            this.paymentRequestList = [];
            if (this.Listing == "FinancePayment") {
                this.paymentRequestList = $event.result
            }
        } else {
            this.popupMessageService.showError($event.error_message, "!Error");
        }
    }

    smartSearchResultsApproved($event) {
      this.totalItem = $event._meta.total_records;
      this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
      this.pages = 1;
      this.searchResult = $event.result;
      this.sharedServices.searchForm.subscribe((data) => {
        this.Listing = data;
      });
      this.sharedServices.formDataSmartSearch.subscribe((data) => {
        this.smartSearchFormData = data;
      });
      if ($event.status == 1) {
        this.paymentHistory = [];
        if (this.Listing == "FinanceApprovedPayment") {
          this.paymentHistory = $event.result;
        }
      } else {
        this.popupMessageService.showError($event.error_message, "!Error");
      }
    }

    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
        });
    }

    getPayRequest(page = 1) {
        this.loader = true;
        if(this.Listing != "FinancePayment") {
          this.paginationSubmitForm.controls.page_number.patchValue(1);
        } else {
          this.paginationSubmitForm.controls.page_number.patchValue(page);
        }
        this.Listing = "FinancePayment";
        this.sharedServices.searchForm.next('FinancePayment');
        this.paymentRequestList = [];
        this.loadingList = !this.loadingList;
      this.leadListService.getSspPaymentApproval(page, this.itemPerPage, 'PR', '', '', 'FD', true).subscribe(
        data => {
          if (data.status == 1) {
            this.loadingList = !this.loadingList;
            this.paymentRequestList = data.result;
            this.totalItem = data._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
            this.pages = page;
            this.lastApprovedMessage = data.heading_message;
          } else {
            this.popupMessageService.showError(data.error_message, "!Error");
          }
          this.loader = false;
        },

        err => {
          this.loader = false;
          this.popupMessageService.showError("Something went wrong", "!Error");
        }

        );
    }

    formHeader: any;
    TaskpopUp: boolean = false;
    TaskpopUp2: boolean = false;
    activetask: any = false;
    tt_id: any;
    task_name: any;
    milestone_id: any;
    h_id: any;
    pp_id: any;
    isPaymentComplete = false;
    uploadDocument: FormGroup;
    isUploadingDocs: any;
    isSubmittedDocument: any;

    /*
    *   Universal Export to CSV Method
    */
    exportToCSV(data, fileName) {
        new ngxCsv(data, fileName, { showLabels: true });
    }

    approvedPaymentsPtaskId = [];
    // approvePayment(event, payment) {
    //     const ptaskId = payment.ptask_id;
    //     if(event.target.checked) {
    //         this.approvedPaymentsPtaskId.push(ptaskId);
    //     } else {
    //         const index = this.approvedPaymentsPtaskId.findIndex(x => x == ptaskId);
    //         if(index >= 0) {
    //             this.approvedPaymentsPtaskId.splice(index, 1);
    //         }
    //     }
    // }

    approvePayment(event, payment) {
      const ptaskId = payment.ptask_id;
      if (event.target.checked) {
        const data = {
          id: payment.ptask_id,
          project_code: payment.project_code,
          customer_name: payment.cceld_firstname + " " + payment.cceld_lastname,
          project_value: payment.project_value,
          customer_total_paid: payment.customer_total_paid,
          Partner_name: payment.Partner_name,
          SspCode: payment.SspCode,
          ptask_bos: payment.ptask_bos,
          ssp_total_paid: payment.ssp_total_paid,
          amount: payment.amount,
          ptask_remark: payment.ptask_remark,
          ptask_created_on: payment.ptask_created_on
        }
        this.approvedPaymentsPtaskId.push(data);
      } else {
        const index = this.approvedPaymentsPtaskId.findIndex((x) => x == ptaskId);
        if (index >= 0) {
          this.approvedPaymentsPtaskId.splice(index, 1);
        }
      }
    }

   submitApproval() {
        this.loader = true;
        if(this.approvedPaymentsPtaskId.length) {
            const data = {
                ptask_id : this.approvedPaymentsPtaskId
            }
            this.leadListService.releasePaymentByFinanceteam(data).subscribe(
                res => {
                    if(res.status) {
                        this.popupMessageService.showSuccess(res.data, "Success");
                        this.paymentRequestList = null;
                        this.getPayRequest();
                    } else {
                        this.popupMessageService.showError("Can't approve SSP payment request", "Error");
                    }
                    this.loader = false;
                } ,
                err => {
                  this.loader = false;
                }
            );
        } else {
            this.popupMessageService.showInfo("Please approve atleast one request to continue or click Cancel", "Info");
        }
    }

    onCancel() {
        this.paymentRequestList = null;
        this.getPayRequest();
    }

    approveAll(event) {
      if (event.target.checked) {
        this.paymentRequestList.forEach((item) => {
          item.isApproved = 1;
          const data = {
            id: item.ptask_id,
            project_code: item.project_code,
            customer_name: item.cceld_firstname + " " + item.cceld_lastname,
            project_value: item.project_value,
            customer_total_paid: item.customer_total_paid,
            Partner_name: item.Partner_name,
            SspCode: item.SspCode,
            ptask_bos: item.ptask_bos,
            ssp_total_paid: item.ssp_total_paid,
            amount: item.amount,
            ptask_remark: item.ptask_remark,
            ptask_created_on: item.ptask_created_on
          }
          this.approvedPaymentsPtaskId.push(data);
        });
      } else {
        this.paymentRequestList.forEach((item) => {
          item.isApproved = 0;
          this.approvedPaymentsPtaskId = [];
        });
      }
    }

    getPaymentHistory(ptaskId) {
        this.leadListService.getPaymentHistory(ptaskId).subscribe(
            res => {
                console.log(res);
                this.isShowPaymentHistory = true;
                this.paymentHistoryData = res.data;
            }
        )
    }

    // Get approved payments
  paymentHistory = [];
  getApprovedPayments(page = 1) {
    this.loader = true;
    if(this.Listing != "FinanceApprovedPayment") {
      this.paginationSubmitForm.controls.page_number.patchValue(1);
    } else {
      this.paginationSubmitForm.controls.page_number.patchValue(page);
    }
    this.Listing = "FinanceApprovedPayment";
    this.sharedServices.searchForm.next("FinanceApprovedPayment");
    const data = {
      type: 3
    }
    this.leadListService.getApprovedPaymentHistory(page, this.itemPerPage,data).subscribe(
      res=> {
        console.log(res);
        if(res.status == 1) {
          this.paymentHistory = res.result;
          this.totalItem = res._meta.total_records;
          this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
          this.pages = page;
        }
        this.loader = false;
      },
      err => {
        this.loader = false;
      }
    )
  }

  currentpage = 1;
  pageSubmit() {
    if (this.paginationSubmitForm.valid) {
        let page = this.paginationSubmitForm.controls.page_number.value;
        this.currentpage = page;
        if(this.Listing == "OpsHeadApproval") {
          this.getPayRequest(page);
        } else {
          this.getApprovedPayments(page);
        }


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

  exportToCsv() {
    const exportDataWebform = [
      "Project Id",
      "Customer Name",
      "Project Cost",
      "Payment recieved from customer",
      "SSP Name",
      "SSP Code",
      "BoS Amount Payable",
      "Amount Paid",
      "Amount Requested",
      "Request Date",
    ];

    const fileName = "Opshead Approval";

    this.listTraverse = exportDataWebform;

    const tempObject = {};
    this.listTraverse.forEach(function (key, index) {
      tempObject[key] = key;
    });

    const exportData = [tempObject];

    if(!this.showIsApproved) {
      this.paymentRequestList.forEach((element) => {
        let temp = {
          projectId: element.project_code,
          customerName: element.cceld_firstname + " " + element.cceld_lastname,
          projectPrice: element.project_value,
          paymentRecievedCustomer: element.customer_total_paid,
          sspName: element.Partner_name,
          sspCode: element.SspCode,
          bosAmountPayable: element.ptask_bos,
          amountPaid: element.ssp_total_paid,
          amountRequested: element.amount,
          requestDate: element.ptask_created_on,
        };

        Object.keys(temp).forEach(
          (key) => temp[key] === undefined && delete temp[key]
        );
        exportData.push(temp);
      });
    } else {
      this.paymentHistory.forEach((element) => {
        let temp = {
          projectId: element.project_id,
          customerName: element.customer_name,
          projectPrice: element.project_cost,
          paymentRecievedCustomer: element.payment_recieved_from_customer,
          sspName: element.ssp_name,
          sspCode: element.ssp_code,
          bosAmountPayable: element.bos_payable,
          amountPaid: element.amount_paid,
          amountRequested: element.amount_requested,
          requestDate: element.request_date,
        };

        Object.keys(temp).forEach(
          (key) => temp[key] === undefined && delete temp[key]
        );
        exportData.push(temp);
      });
    }



    this.exportToCSV(exportData, fileName);
  }

}
