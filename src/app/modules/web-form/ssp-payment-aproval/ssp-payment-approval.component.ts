import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadListService } from 'app/modules/employee-panel/services/lead-list.service';
import { ProjectManagementService } from 'app/modules/employee-panel/services/project-management.services';
import { PopupMessageService } from 'app/modules/message/services/message.service';
import { SharedServices } from 'app/services/shared.services';
import { runInThisContext } from 'vm';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ssp-payment-approval',
  templateUrl: './ssp-payment-approval.component.html',
  styleUrls: ['./ssp-payment-approval.component.css']
})
export class SspPaymentApproval implements OnInit {

  paymentRequestList: any;
  totalItem: any;
  pageCount: number;
  pages: any = 1;
  itemPerPage: any = 20;
  loading = false;
  approvedPaymentsPtaskId = [];
  lastApprovedMessage = '';
  paymentHistoryData: any;
  isShowPaymentHistory: boolean = false;
  showIsApproved = false;
  paginationSubmitForm: FormGroup;
  loader = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leadListService: LeadListService,
    private projectManagementService: ProjectManagementService,
    private popupMessageService: PopupMessageService,
    private sharedServices: SharedServices,
    private route: Router,
    private formBuilder: FormBuilder
  ) {
    let webformRoles: any = localStorage.getItem('webform_userData');
    webformRoles = JSON.parse(webformRoles)
    webformRoles = webformRoles.emp_webform_role;
    webformRoles = webformRoles.split(",");

    if (!webformRoles.includes('2')) {
      // Navigate to first route with permission
      const navigateRoute = webformRoles[0];
      if (navigateRoute && navigateRoute == 1) {
        this.route.navigate(['/webform/opshead-approval'])
      }
      if (navigateRoute && navigateRoute == 3) {
        this.route.navigate(['/webform/finance-task-details'])
      }
    }


    // if(webformRoleId == '17') {
    //   this.route.navigate(['/webform/opshead-approval'])
    // }
  }

  ngOnInit(): void {
    this.createPaginationSubmitForm();
    this.getSspPaymenToApproveList(1, 'SA');
  }

  getSspPaymenToApproveList(page = 1, type?) {

    this.loader = true;

    if (this.Listing != "SspPaymentAprroval" && this.Listing != "FinancePayment") {
      this.paginationSubmitForm.controls.page_number.patchValue(1);
    } else {
      this.paginationSubmitForm.controls.page_number.patchValue(page);
    }

    if (type == 'SA') {
      this.Listing = "SspPaymentAprroval";
    } else {
      this.Listing = "FinancePayment";
    }
    this.sharedServices.searchForm.next(this.Listing);
    this.leadListService.getSspPaymentApproval(page, this.itemPerPage, 'PR', '', '', type, true).subscribe(
      data => {
        if (data.status == 1) {
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
        this.popupMessageService.showError(err, "!Error");
      }
    );
  }


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
      const index = this.approvedPaymentsPtaskId.findIndex(x => x == ptaskId);
      if (index >= 0) {
        this.approvedPaymentsPtaskId.splice(index, 1);
      }
    }
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

  submitApproval() {
    this.loader = true;
    if (this.approvedPaymentsPtaskId.length || this.rejectedPaymentsPtaskId.length) {
      const data = {
        ptask_Id: this.approvedPaymentsPtaskId,
        ptask_Id_reject: this.rejectedPaymentsPtaskId
      }
      this.leadListService.aproveSspPayrequest(data).subscribe(
        res => {
          if (res.status) {
            this.popupMessageService.showSuccess(res.data, "Success");
            this.paymentRequestList = null;
            this.getSspPaymenToApproveList(1, 'SA');
          } else {
            this.popupMessageService.showError("Can't approve SSP payment request", "Error");
          }
          this.loader = false;
        },
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
    this.getSspPaymenToApproveList(1, 'SA');
  }

  reason: string = '';
  isReject: boolean = false;
  selectedRejectId = '';
  rejectEvent: any;
  rejectPayment(event, payment) {
    const ptaskId = payment.ptask_id;
    if (event.target.checked) {
      this.isReject = true;
      this.rejectEvent = event;
      this.selectedRejectId = payment.ptask_id;
    } else {
      const index = this.rejectedPaymentsPtaskId.findIndex(x => x.id == ptaskId);
      if (index >= 0) {
        this.rejectedPaymentsPtaskId.splice(index, 1);
        console.log(this.rejectedPaymentsPtaskId);
      }
    }
  }

  rejectedPaymentsPtaskId = [];
  saveRejectionReason() {
    this.rejectedPaymentsPtaskId.push({
      id: this.selectedRejectId,
      reason: this.reason
    });
    this.isReject = false;
    this.reason = '';
    console.log(this.rejectedPaymentsPtaskId);

  }

  cancelRejection() {
    this.isReject = false;
    this.rejectEvent.srcElement.checked = false;
  }

  searchResult: any;
  Listing: any;
  smartSearchFormData: string;
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
      if (this.Listing == "SspPaymentAprroval") {
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
      if (this.Listing == "CommercialApprovedPayments") {
        this.paymentHistory = $event.result;
      }
    } else {
      this.popupMessageService.showError($event.error_message, "!Error");
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

  listTraverse: any;
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
      "Remark",
      "Request Date",
    ];

    const fileName = "Commercial Approval";

    this.listTraverse = exportDataWebform;

    const tempObject = {};
    this.listTraverse.forEach(function (key, index) {
      tempObject[key] = key;
    });

    const exportData = [tempObject];

    if (!this.showIsApproved) {
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
          remark: element.ptask_remark,
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
          remark: element.remark,
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

  /*
   *   Universal Export to CSV Method
   */
  exportToCSV(data, fileName) {
    new ngxCsv(data, fileName, { showLabels: true });
  }

  // Get approved payments
  paymentHistory = [];
  getApprovedPayments(page = 1) {
    this.loader = true;
    if (this.Listing != "CommercialApprovedPayments") {
      this.paginationSubmitForm.controls.page_number.patchValue(1);
    } else {
      this.paginationSubmitForm.controls.page_number.patchValue(page);
    }
    this.Listing = "CommercialApprovedPayments";
    this.sharedServices.searchForm.next("CommercialApprovedPayments");
    const data = {
      type: 1
    }
    this.leadListService.getApprovedPaymentHistory(page, this.itemPerPage, data).subscribe(
      res => {
        console.log(res);
        if (res.status == 1) {
          this.paymentHistory = res.result;
          this.totalItem = res._meta.total_records;
          this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
          this.pages = page;
        }
        this.loader = false;
      }, err => {
        this.loader = false;
      }
    )
  }

  createPaginationSubmitForm() {
    this.paginationSubmitForm = this.formBuilder.group({
      page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
    });
  }

  currentpage = 1;
  pageSubmit() {
    if (this.paginationSubmitForm.valid) {
      let page = this.paginationSubmitForm.controls.page_number.value;
      this.currentpage = page;
      if (this.Listing == "SspPaymentAprroval") {
        this.getSspPaymenToApproveList(page, 'SA');
      } else if (this.Listing == "FinancePayment") {
        this.getSspPaymenToApproveList(page, 'FD');
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

}


