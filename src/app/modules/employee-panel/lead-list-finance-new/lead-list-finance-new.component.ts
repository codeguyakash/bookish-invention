import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { LeadListService } from '../services/lead-list.service';
import { FormBuilder, FormControl, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectManagementService } from '../services/project-management.services';
import { InlineMessageService } from '../../message/services/message.service';
import { SharedServices } from '../../../services/shared.services';
import { PopupMessageService } from '../../message/services/message.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as globals from "../../../static/static";

@Component({
    selector: 'finance-lead-list-new',
    templateUrl: './lead-list-finance-new.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', './lead-list-finance-new.component.css'],
    providers: [DatePipe]
})
export class FinanceListPanelNew implements OnInit {
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
    baseurl: string;
    amountRemaining: number = 0;
    exportFromDate: Date;
    exportToDate: Date;

    svg_calendar: any = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20">' +
        '<g fill="#003374" fill-rule="nonzero">' +
        '<path d="M.421 19.36A.421.421 0 0 1 0 18.937V1.78c0-.232.189-.42.421-.42h2.12V.51c0-.233.19-.421.422-.421h2.224c.232 0 .42.188.42.421v.85h6.785V.51c0-.233.189-.421.421-.421h2.224c.233 0 .421.188.421.421v.85h2.121c.232 0 .42.188.421.42v17.158a.421.421 0 0 1-.421.421H.421zm16.737-.843V5.697H.842v12.82h16.316zm0-13.662V2.202h-1.7v.85a.421.421 0 0 1-.42.42h-2.225a.421.421 0 0 1-.42-.42v-.85H5.607v.85a.421.421 0 0 1-.421.42H2.963a.421.421 0 0 1-.421-.42v-.85h-1.7v2.653h16.316zM14.616 2.63V.93h-1.382v1.7h1.382zm-9.85 0V.93H3.384v1.7h1.382z" />' +
        '<path d="M17.579 1.463h-2.224V.51a.317.317 0 0 0-.318-.318h-2.224a.317.317 0 0 0-.317.318v.953H5.504V.51a.317.317 0 0 0-.317-.318H2.963a.317.317 0 0 0-.318.318v.953H.421a.318.318 0 0 0-.318.317v17.158a.317.317 0 0 0 .318.318h17.158a.317.317 0 0 0 .318-.318V1.78a.318.318 0 0 0-.318-.317zM13.131.828h1.589v1.906h-1.59V.828zm-9.85 0h1.588v1.906H3.28V.828zM.738 2.099h1.906v.953a.317.317 0 0 0 .318.317h2.224a.317.317 0 0 0 .317-.317v-.953h6.992v.953a.317.317 0 0 0 .317.317h2.224a.317.317 0 0 0 .318-.317v-.953h1.906v2.86H.74v-2.86zm0 16.522V5.593H17.26v13.028H.74z" />' +
        '<path d="M2.86 16.818V7.397h12.28v9.42H2.86zm11.438-.842v-2.018H12.28v2.018h2.018zm-2.86 0v-2.018H9.421v2.018h2.017zm-2.859 0v-2.018H6.562v2.018h2.017zm-2.86 0v-2.018H3.703v2.018H5.72zm8.579-2.86V11.1H12.28v2.017h2.018zm-2.86 0V11.1H9.421v2.017h2.017zm-2.859 0V11.1H6.562v2.017h2.017zm-2.86 0V11.1H3.703v2.017H5.72zm8.579-2.86V8.239H12.28v2.017h2.018zm-2.86 0V8.239H9.421v2.017h2.017zm-2.859 0V8.239H6.562v2.017h2.017zm-2.86 0V8.239H3.703v2.017H5.72z" />' +
        '<path d="M11.542 7.5h-8.58v9.214h12.075V7.5h-3.495zm-2.224.635h2.224v2.224H9.318V8.135zm2.224 5.085H9.318v-2.224h2.224v2.224zm-5.084-2.224h2.224v2.224H6.458v-2.224zm0-2.86h2.224v2.223H6.458V8.135zm-2.859 0h2.224v2.223H3.6V8.135zm0 2.86h2.224v2.224H3.6v-2.224zm2.224 5.083H3.6v-2.224h2.224v2.224zm2.86 0H6.457v-2.224h2.224v2.224zm2.859 0H9.318v-2.224h2.224v2.224zm2.859 0h-2.224v-2.224H14.4v2.224zm0-2.86h-2.224v-2.223H14.4v2.224zm0-5.084v2.224h-2.224V8.135H14.4z" />' +
        '</g></svg>';

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
        { value: String('IDBI Bank Limited'), label: String('IDBI Bank Limited') },
    ];

    showSmartSearchComponent: boolean;
    totalItem: any;
    pageCount: number;
    searchResult: any;
    smartSearchFormData: string;
    paginationSubmitForm: FormGroup;
    public paymentTranceSubmitCheque = false;
    showTranchePaymentLog = false;


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
    ) { }

    ngOnInit() {
        this.createPaginationSubmitForm();
        this.getPaymentToApproveListing();
        this.showSmartSearchComponent = true;
        this.baseurl = globals.API_BASE_URL;
        this.createExportForm();
    }

    smartSearchResults($event) {
      //console.log($event);

        this.totalItem = $event._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = 1;
        this.createPaginationSubmitForm();
        this.paginationSubmitForm.controls.page_number.patchValue(this.pages);
        this.searchResult = $event.result;
        this.sharedServices.searchForm.subscribe((data) => {
            this.Listing = data;
        })
        this.sharedServices.formDataSmartSearch.subscribe((data) => {
            this.smartSearchFormData = data;
        });
        if ($event.status == 1) {
            this.paymentList = [];
            this.paymentRequestList = [];
            if (this.Listing == "paymentToApprove" || this.Listing == "paymentToApproveComplete") {
                this.paymentList = $event.result
                this.paymentList = this.mapPaymentData(this.paymentList);
            }
            if (this.Listing == "ReleaseRequest" || this.Listing == "ReleaseRequestOld" || this.Listing == "ReleaseRequestComplete") {
                this.paymentRequestList = $event.result
                this.paymentRequestList = this.mapPaymentData(this.paymentRequestList);
            }
        } else {
            this.popupMessageService.showError($event.error_message, "!Error");
        }
    }

    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1)])],
        });
    }

    pages: any = 1;
    itemPerPage: any = 10;
    getPaymentToApproveListing(page = 1) {
        this.paginationSubmitForm.controls.page_number.patchValue(page);
        this.Listing = "paymentToApprove";
        this.sharedServices.searchForm.next('paymentToApprove');
        this.paymentList = [];
        this.loadingList = !this.loadingList;
        this.leadListService.getPaymentApproveListNew(page, this.itemPerPage, 'PA').subscribe(data => {
            if (data.status == 1) {
                this.loadingList = !this.loadingList;
                this.paymentList = data.result;
                this.paymentList = this.mapPaymentData(this.paymentList);
                this.totalItem = data._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
            } else {
                this.popupMessageService.showError(data.error_message, "!Error");
            }
        });
    }

    getPaymentToApproveListingcomplete(page = 1) {
        this.Listing = "paymentToApproveComplete";
        this.sharedServices.searchForm.next('paymentToApproveComplete');
        this.paymentList = [];
        this.loadingList = !this.loadingList;
        this.leadListService.getPaymentApproveList(page, this.itemPerPage, 'PA_COMPLETE').subscribe(data => {
            if (data.status == 1) {
                this.loadingList = !this.loadingList;
                this.paymentList = data.result
                this.totalItem = data._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
            } else {
                this.popupMessageService.showError(data.error_message, "!Error");
            }
        });
    }


    getPayRequest(page = 1) {
        this.paginationSubmitForm.controls.page_number.patchValue(page);
        this.Listing = "ReleaseRequest";
        this.sharedServices.searchForm.next('ReleaseRequest');
        this.paymentRequestList = [];
        this.loadingList = !this.loadingList;
        this.leadListService.getPaymentApproveListNew(page, this.itemPerPage, 'PR').subscribe(data => {
            if (data.status == 1) {
                this.loadingList = !this.loadingList;
                this.paymentRequestList = data.result;
                this.paymentRequestList = this.mapPaymentData(this.paymentRequestList);
                this.totalItem = data._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
            } else {
                this.popupMessageService.showError(data.error_message, "!Error");
            }
        });
    }

    getPayRequestOld(page = 1) {
      this.paginationSubmitForm.controls.page_number.patchValue(page);
      this.Listing = "ReleaseRequestOld";
      this.sharedServices.searchForm.next('ReleaseRequestOld');
      this.paymentRequestList = [];
      this.loadingList = !this.loadingList;
      this.leadListService.getPaymentApproveListNew(page, this.itemPerPage, 'PR_OLD').subscribe(data => {
          if (data.status == 1) {
              this.loadingList = !this.loadingList;
              this.paymentRequestList = data.result;
              this.paymentRequestList = this.mapPaymentData(this.paymentRequestList);
              this.totalItem = data._meta.total_records;
              this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
              this.pages = page;
          } else {
              this.popupMessageService.showError(data.error_message, "!Error");
          }
      });
  }

    getPayRequestComplete(page = 1) {
        this.paginationSubmitForm.controls.page_number.patchValue(page);
        this.Listing = "ReleaseRequestComplete";
        this.sharedServices.searchForm.next('ReleaseRequestComplete');
        this.paymentRequestList = [];
        this.loadingList = !this.loadingList;
        this.leadListService.getPaymentApproveListNew(page, this.itemPerPage, 'PR_COMPLETE').subscribe(data => {
            if (data.status == 1) {
                this.loadingList = !this.loadingList;
                this.paymentRequestList = data.result;
                this.paymentRequestList = this.mapPaymentData(this.paymentRequestList);
                this.totalItem = data._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
            } else {
                this.popupMessageService.showError(data.error_message, "!Error");
            }
        });
    }

    mapPaymentData(paymentList) {

        let paymentListData = paymentList.map(item => {
            item.finance_tasks = item.finance_tasks.split(",");
            item.finance_task_status = item.finance_task_status.split(",");
            item.ptask_ttid_group = item.ptask_ttid_group.split(",");
            item.ptask_miestone_id_group = item.ptask_miestone_id_group.split(",");
            item.ptask_pp_id_group = item.ptask_pp_id_group.split(",");
            item.finance_tasks_desc = item.finance_tasks_desc.split(",");
            item.ptask_amount_group = item.ptask_amount_group.split(",");
            item.ptask_tranche_amount_group = item.ptask_tranche_amount_group.split(",");
            if(item.amount_request_group) {
                item.amount_request_group = item.amount_request_group.split(",");
            } else {
                item.amount_request_group = "0,0,0".split(",");
            }

            if(item.ptask_amount_total_group) {
                item.ptask_amount_total_group = item.ptask_amount_total_group.split(",");
            }
            item.is_released_by_finance_group = item.is_released_by_finance_group.split(",");

            // P1 status
            item['p1'] = {};
            item.p1.initiated = false;
            item.p1.ongoing = false;
            item.p1.completed = false;
            item.p1.pending = false;
            if(item.finance_tasks.includes('1')) {
                item.p1.initiated = true;
                let index = item.finance_tasks.indexOf('1');
                if(item.ptask_amount_group[index] != '0') {
                    item.p1.ongoing = true;
                }
                if(item.finance_task_status[index] == '1') {
                    item.p1.completed = true;
                }
                if (item.ptask_tranche_amount_group && item.ptask_tranche_amount_group[index] > 0 && item.ptask_amount_group && item.ptask_amount_group[index] > 0) {
                  const amt_total = +item.ptask_tranche_amount_group[index];
                  const amt = +item.ptask_amount_group[index];

                  if (amt_total - amt > 0){
                      item.p1.pending = true;
                  }
                  if (amt_total - amt <= 0 && item.finance_task_status[index] == '1') {
                    item.p1.completed = true;
                  }
                }
                if(item.payment_log_group[index].length) {
                    item.p1.tranchePaymentLog = item.payment_log_group[index];
                }
                item.p1.ptask_ttid = item.ptask_ttid_group[index];
                item.p1.ptask_miestone_id = item.ptask_miestone_id_group[index];
                item.p1.ptask_pp_id = item.ptask_pp_id_group[index];
                item.p1.finance_tasks_desc = item.finance_tasks_desc[index];
            }
            // P2 status
            item['p2'] = {};
            item.p2.initiated = false;
            item.p2.ongoing = false;
            item.p2.completed = false;
            item.p2.amountSum = 0
            if(item.finance_tasks.includes('19')) {
                item.p2.initiated = true;
                let index = item.finance_tasks.indexOf('19');
                if(item.ptask_amount_group[index] != '0') {
                    item.p2.ongoing = true;
                }
                if(item.finance_task_status[index] == '1') {
                    item.p2.completed = true;
                }

                if (item.ptask_tranche_amount_group && item.ptask_tranche_amount_group[index] > 0 && item.ptask_amount_group && item.ptask_amount_group[index] > 0) {
                  const amt_total = +item.ptask_tranche_amount_group[index];
                  const amt = +item.ptask_amount_group[index];

                  if (amt_total - amt > 0){
                      item.p2.pending = true;
                  }
                  if (amt_total - amt <= 0 && item.finance_task_status[index] == '1') {
                    item.p2.completed = true;
                  }
                }

                if(item.payment_log_group[index].length) {
                    item.p2.tranchePaymentLog = item.payment_log_group[index];
                }
                item.p2.ptask_ttid = item.ptask_ttid_group[index];
                item.p2.ptask_miestone_id = item.ptask_miestone_id_group[index];
                item.p2.ptask_pp_id = item.ptask_pp_id_group[index];
                item.p2.finance_tasks_desc = item.finance_tasks_desc[index];
            }
            // P3 status
            item['p3'] = {};
            if((item.payment_split == 4 || item.payment_split == 3) && item.gridtype != 2) {
              item.p3.initiated = false;
              item.p3.ongoing = false;
              item.p3.completed = false;
              if(item.finance_tasks.includes('12')) {
                  item.p3.initiated = true;
                  let index = item.finance_tasks.indexOf('12');
                  if(item.ptask_amount_group[index] != '0') {
                      item.p3.ongoing = true;
                  }
                  if(item.finance_task_status[index] == '1') {
                      item.p3.completed = true;
                  }

                  if (item.ptask_tranche_amount_group && item.ptask_tranche_amount_group[index] > 0 && item.ptask_amount_group && item.ptask_amount_group[index] > 0) {
                    const amt_total = +item.ptask_tranche_amount_group[index];
                    const amt = +item.ptask_amount_group[index];

                    if (amt_total - amt > 0){
                        item.p3.pending = true;
                    }
                    if (amt_total - amt <= 0 && item.finance_task_status[index] == '1') {
                      item.p3.completed = true;
                    }
                  }

                  if(item.payment_log_group[index].length) {
                      item.p3.tranchePaymentLog = item.payment_log_group[index];
                  }
                  item.p3.ptask_ttid = item.ptask_ttid_group[index];
                  item.p3.ptask_miestone_id = item.ptask_miestone_id_group[index];
                  item.p3.ptask_pp_id = item.ptask_pp_id_group[index];
                  item.p3.finance_tasks_desc = item.finance_tasks_desc[index];
              }
            }

            if(item.payment_split == 4  && item.gridtype == 2) {
              item.p3.initiated = false;
              item.p3.ongoing = false;
              item.p3.completed = false;
              if(item.finance_tasks.includes('12')) {
                  item.p3.initiated = true;
                  let index = item.finance_tasks.indexOf('12');
                  if(item.ptask_amount_group[index] != '0') {
                      item.p3.ongoing = true;
                  }
                  if(item.finance_task_status[index] == '1') {
                      item.p3.completed = true;
                  }

                  if (item.ptask_tranche_amount_group && item.ptask_tranche_amount_group[index] > 0 && item.ptask_amount_group && item.ptask_amount_group[index] > 0) {
                    const amt_total = +item.ptask_tranche_amount_group[index];
                    const amt = +item.ptask_amount_group[index];

                    if (amt_total - amt > 0){
                        item.p3.pending = true;
                    }
                    if (amt_total - amt <= 0 && item.finance_task_status[index] == '1') {
                      item.p3.completed = true;
                    }
                  }

                  if(item.payment_log_group[index].length) {
                      item.p3.tranchePaymentLog = item.payment_log_group[index];
                  }
                  item.p3.ptask_ttid = item.ptask_ttid_group[index];
                  item.p3.ptask_miestone_id = item.ptask_miestone_id_group[index];
                  item.p3.ptask_pp_id = item.ptask_pp_id_group[index];
                  item.p3.finance_tasks_desc = item.finance_tasks_desc[index];
              }
            }

            if(item.payment_split == 3 && item.gridtype == 2) {
              item.p3.initiated = false;
              item.p3.ongoing = false;
              item.p3.completed = false;
              if(item.finance_tasks.includes('42')) {
                  item.p3.initiated = true;
                  let index = item.finance_tasks.indexOf('42');
                  if(item.ptask_amount_group[index] != '0') {
                      item.p3.ongoing = true;
                  }
                  if(item.finance_task_status[index] == '1') {
                      item.p3.completed = true;
                  }

                  if (item.ptask_tranche_amount_group && item.ptask_tranche_amount_group[index] > 0 && item.ptask_amount_group && item.ptask_amount_group[index] > 0) {
                    const amt_total = +item.ptask_tranche_amount_group[index];
                    const amt = +item.ptask_amount_group[index];

                    if (amt_total - amt > 0){
                        item.p3.pending = true;
                    }
                    if (amt_total - amt <= 0 && item.finance_task_status[index] == '1') {
                      item.p3.completed = true;
                    }
                  }

                  if(item.payment_log_group[index].length) {
                      item.p3.tranchePaymentLog = item.payment_log_group[index];
                  }
                  item.p3.ptask_ttid = item.ptask_ttid_group[index];
                  item.p3.ptask_miestone_id = item.ptask_miestone_id_group[index];
                  item.p3.ptask_pp_id = item.ptask_pp_id_group[index];
                  item.p3.finance_tasks_desc = item.finance_tasks_desc[index];
              }
            }

             // P4 status
             item['p4'] = {};
            if(item.payment_split == 4 && item.gridtype != 2) {
              item.p4.initiated = false;
              item.p4.ongoing = false;
              item.p4.completed = false;
              if(item.finance_tasks.includes('43')) {
                  item.p4.initiated = true;
                  let index = item.finance_tasks.indexOf('43');
                  if(item.ptask_amount_group[index] != '0') {
                      item.p4.ongoing = true;
                  }
                  if(item.finance_task_status[index] == '1') {
                      item.p4.completed = true;
                  }

                  if (item.ptask_tranche_amount_group && item.ptask_tranche_amount_group[index] > 0 && item.ptask_amount_group && item.ptask_amount_group[index] > 0) {
                    const amt_total = +item.ptask_tranche_amount_group[index];
                    const amt = +item.ptask_amount_group[index];

                    if (amt_total - amt > 0){
                        item.p4.pending = true;
                    }
                    if (amt_total - amt <= 0 && item.finance_task_status[index] == '1') {
                      item.p4.completed = true;
                    }
                  }

                  if(item.payment_log_group[index].length) {
                      item.p4.tranchePaymentLog = item.payment_log_group[index];
                  }
                  item.p4.ptask_ttid = item.ptask_ttid_group[index];
                  item.p4.ptask_miestone_id = item.ptask_miestone_id_group[index];
                  item.p4.ptask_pp_id = item.ptask_pp_id_group[index];
                  item.p4.finance_tasks_desc = item.finance_tasks_desc[index];
              }
            }

            if(item.payment_split == 4 && item.gridtype == 2) {
              item.p4.initiated = false;
              item.p4.ongoing = false;
              item.p4.completed = false;
              if(item.finance_tasks.includes('42')) {
                  item.p4.initiated = true;
                  let index = item.finance_tasks.indexOf('42');
                  if(item.ptask_amount_group[index] != '0') {
                      item.p4.ongoing = true;
                  }
                  if(item.finance_task_status[index] == '1') {
                      item.p4.completed = true;
                  }

                  if (item.ptask_tranche_amount_group && item.ptask_tranche_amount_group[index] > 0 && item.ptask_amount_group && item.ptask_amount_group[index] > 0) {
                    const amt_total = +item.ptask_tranche_amount_group[index];
                    const amt = +item.ptask_amount_group[index];

                    if (amt_total - amt > 0){
                        item.p4.pending = true;
                    }
                    if (amt_total - amt <= 0 && item.finance_task_status[index] == '1') {
                      item.p4.completed = true;
                    }
                  }

                  if(item.payment_log_group[index].length) {
                      item.p4.tranchePaymentLog = item.payment_log_group[index];
                  }
                  item.p4.ptask_ttid = item.ptask_ttid_group[index];
                  item.p4.ptask_miestone_id = item.ptask_miestone_id_group[index];
                  item.p4.ptask_pp_id = item.ptask_pp_id_group[index];
                  item.p4.finance_tasks_desc = item.finance_tasks_desc[index];
              }
            }






            // P1 Partner status
            item['pr1'] = {};
            item.pr1.initiated = false;
            item.pr1.ongoing = false;
            item.pr1.completed = false;
            if(item.finance_tasks.includes('5')) {
                item.pr1.initiated = true;
                let index = item.finance_tasks.indexOf('5');
                if(item.ptask_amount_group[index] != '0') {
                    item.pr1.ongoing = true;
                }
                if(item.finance_task_status[index] == '1') {
                    item.pr1.completed = true;
                }
                if(item.ptask_amount_total_group && item.ptask_amount_total_group[index] > 0) {
                    item.pr1.pending = true;
                }
                if(item.payment_log_group[index].length) {
                    item.pr1.tranchePaymentLog = item.payment_log_group[index];
                }
                item.pr1.ptask_ttid = item.ptask_ttid_group[index];
                item.pr1.ptask_miestone_id = item.ptask_miestone_id_group[index];
                item.pr1.ptask_pp_id = item.ptask_pp_id_group[index];
                item.pr1.finance_tasks_desc = item.finance_tasks_desc[index];

                const amount = + item.ptask_amount_group[index];
                const amount_total = + item.ptask_amount_total_group[index];
                const amount_request = + item.amount_request_group[index];

                if(item.is_released_by_finance_group[index] == 1 && (amount + amount_request) >= amount_total) {
                    item.pr1.is_released_by_finance = true;
                }
                if(item.is_released_by_finance_group[index] == 1 && (amount + amount_request) < amount_total) {
                    item.pr1.is_partially_released_by_finance = true;
                }
            }

            // P2 Partner status
            item['pr2'] = {};
            item.pr2.initiated = false;
            item.pr2.ongoing = false;
            item.pr2.completed = false;
            if(item.finance_tasks.includes('11')) {
                item.pr2.initiated = true;
                let index = item.finance_tasks.indexOf('11');
                if(item.ptask_amount_group[index] != '0') {
                    item.pr2.ongoing = true;
                }
                if(item.finance_task_status[index] == '1') {
                    item.pr2.completed = true;
                }
                if(item.ptask_amount_total_group && item.ptask_amount_total_group[index] > 0) {
                    item.pr2.pending = true;
                }
                if(item.payment_log_group[index].length) {
                    item.pr2.tranchePaymentLog = item.payment_log_group[index];
                }
                item.pr2.ptask_ttid = item.ptask_ttid_group[index];
                item.pr2.ptask_miestone_id = item.ptask_miestone_id_group[index];
                item.pr2.ptask_pp_id = item.ptask_pp_id_group[index];
                item.pr2.finance_tasks_desc = item.finance_tasks_desc[index];

                const amount = + item.ptask_amount_group[index];
                const amount_total = + item.ptask_amount_total_group[index];
                const amount_request = + item.amount_request_group[index];

                if(item.is_released_by_finance_group[index] == 1 && (amount + amount_request) >= amount_total) {
                    item.pr2.is_released_by_finance = true;
                }
                if(item.is_released_by_finance_group[index] == 1 && (amount + amount_request) < amount_total) {
                    item.pr2.is_partially_released_by_finance = true;
                }

            }

            // P3 Partner status
            item['pr3'] = {};
            item.pr3.initiated = false;
            item.pr3.ongoing = false;
            item.pr3.completed = false;
            if(item.finance_tasks.includes('40')) {
                item.pr3.initiated = true;
                let index = item.finance_tasks.indexOf('40');
                if(item.ptask_amount_group[index] != '0') {
                    item.pr3.ongoing = true;
                }
                if(item.finance_task_status[index] == '1') {
                    item.pr3.completed = true;
                }
                if(item.ptask_amount_total_group && item.ptask_amount_total_group[index] > 0) {
                    item.pr3.pending = true;
                }
                if(item.payment_log_group[index].length) {
                    item.pr3.tranchePaymentLog = item.payment_log_group[index];
                }
                item.pr3.ptask_ttid = item.ptask_ttid_group[index];
                item.pr3.ptask_miestone_id = item.ptask_miestone_id_group[index];
                item.pr3.ptask_pp_id = item.ptask_pp_id_group[index];
                item.pr3.finance_tasks_desc = item.finance_tasks_desc[index];
                const amount = + item.ptask_amount_group[index];
                const amount_total = + item.ptask_amount_total_group[index];
                const amount_request = + item.amount_request_group[index];

                if(item.is_released_by_finance_group[index] == 1 && (amount + amount_request) >= amount_total) {
                    item.pr3.is_released_by_finance = true;
                }
                if(item.is_released_by_finance_group[index] == 1 && (amount + amount_request) < amount_total) {
                    item.pr3.is_partially_released_by_finance = true;
                }
            }
            return item;
        });
        //console.log(paymentListData);

        return paymentListData;
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
    tranchePaymentLog = [];
    isPaymentComplete = false;
    openTaskFrom(payment, trancheType, i) {
        //console.log(payment);

        this.isPaymentComplete = false;
        if(trancheType === 'p1') {
            this.tt_id = payment.p1.ptask_ttid;
            this.milestone_id = payment.p1.ptask_miestone_id;
            this.pp_id = payment.p1.ptask_pp_id;
            this.task_name = payment.p1.finance_tasks_desc;
            this.isPaymentComplete = (payment.p1.ongoing && !payment.p1.pending) || payment.p1.completed;
            this.setPaymentLog(i);
        }
        if(trancheType === 'p2') {
            this.tt_id = payment.p2.ptask_ttid;
            this.milestone_id = payment.p2.ptask_miestone_id;
            this.pp_id = payment.p2.ptask_pp_id;
            this.task_name = payment.p2.finance_tasks_desc;
            this.isPaymentComplete = (payment.p2.ongoing && !payment.p2.pending) || payment.p2.completed;
            this.setPaymentLog(i);
        }
        if(trancheType === 'p3') {
            this.tt_id = payment.p3.ptask_ttid;
            this.milestone_id = payment.p3.ptask_miestone_id;
            this.pp_id = payment.p3.ptask_pp_id;
            this.task_name = payment.p3.finance_tasks_desc;
            this.isPaymentComplete = (payment.p3.ongoing && !payment.p3.pending) || payment.p3.completed;
            this.setPaymentLog(i);
        }
        if(trancheType === 'p4') {
            this.tt_id = payment.p4.ptask_ttid;
            this.milestone_id = payment.p4.ptask_miestone_id;
            this.pp_id = payment.p4.ptask_pp_id;
            this.task_name = payment.p4.finance_tasks_desc;
            this.isPaymentComplete = (payment.p4.ongoing && !payment.p4.pending) || payment.p4.completed;
            this.setPaymentLog(i);
        }
        if(trancheType === 'pr1') {
            if(!payment.bos) {
              this.popupMessageService.showError("BOS amount is not defined", "Error");
              return false;
            }
            this.tt_id = payment.pr1.ptask_ttid;
            this.milestone_id = payment.pr1.ptask_miestone_id;
            this.pp_id = payment.pr1.ptask_pp_id;
            this.task_name = payment.pr1.finance_tasks_desc;
            this.isPaymentComplete = (payment.pr1.ongoing && !payment.pr1.pending) || payment.pr1.completed;
            this.setPaymentLog(i);
        }
        if(trancheType === 'pr2') {
            if(!payment.bos) {
              this.popupMessageService.showError("BOS amount is not defined", "Error");
              return false;
            }
            this.tt_id = payment.pr2.ptask_ttid;
            this.milestone_id = payment.pr2.ptask_miestone_id;
            this.pp_id = payment.pr2.ptask_pp_id;
            this.task_name = payment.pr2.finance_tasks_desc;
            this.isPaymentComplete = (payment.pr2.ongoing && !payment.pr2.pending) || payment.pr2.completed;
            this.setPaymentLog(i);
        }
        if(trancheType === 'pr3') {
            if(!payment.bos) {
              this.popupMessageService.showError("BOS amount is not defined", "Error");
              return false;
            }
            this.tt_id = payment.pr3.ptask_ttid;
            this.milestone_id = payment.pr3.ptask_miestone_id;
            this.pp_id = payment.pr3.ptask_pp_id;
            this.task_name = payment.pr3.finance_tasks_desc;
            this.isPaymentComplete = (payment.pr3.ongoing && !payment.pr3.pending) || payment.pr3.completed;
            this.setPaymentLog(i);
        }
        //this.tt_id = payment.ptask_ttid;
        this.task_name = payment.ptm_name;
        //this.milestone_id = payment.ptask_miestone_id;
        this.h_id = payment.h_id;
        //this.pp_id = payment.ptask_pp_id;
        this.formHeader = this.task_name;
        this.currentProjectId = payment.project_id;
        this.paymentTranceSubmitCheque = payment.ptm_name === 'submit Cheque information' ? true : false;

        let payApproveTask = ['1', '19', '12', '42', '43'];
        let payRequestTask = ['5', '11', '40'];
        this.activetask = this.tt_id;
        this.taskFormValidation(this.tt_id, this.milestone_id, this.pp_id);
        if (payApproveTask.indexOf(this.tt_id) >= 0) {
            this.TaskpopUp = true;
            this.TaskpopUp2 = false;
        }
        if ((payRequestTask.indexOf(this.tt_id) >= 0)) {
            this.TaskpopUp2 = true;
            this.TaskpopUp = false;
        }
        this.getUploadedDocumentsTask(this.tt_id, this.h_id);
    }

    setPaymentLog(i) {

      this.tranchePaymentLog = [];

        if(this.paymentList && this.paymentList.length) {
            const payment = this.paymentList[i];
            this.tranchePaymentLog['p1'] = payment.p1.tranchePaymentLog;
            this.tranchePaymentLog['p2'] = payment.p2.tranchePaymentLog;
            this.tranchePaymentLog['p3'] = payment.p3.tranchePaymentLog;
            if(payment.payment_split == 4) {
              this.tranchePaymentLog['p4'] = payment.p4.tranchePaymentLog;
            }
        }

        if(this.paymentRequestList && this.paymentRequestList.length) {
            const paymentRequest = this.paymentRequestList[i];
            this.tranchePaymentLog['pr1'] = paymentRequest.pr1.tranchePaymentLog;
            this.tranchePaymentLog['pr2'] = paymentRequest.pr2.tranchePaymentLog;
            this.tranchePaymentLog['pr3'] = paymentRequest.pr3.tranchePaymentLog;
        }

    }

    exportForm: FormGroup;
    createExportForm() {
        this.exportForm = this.formBuilder.group({
            exportFromDate: [],
            exportToDate: [],
        });
    }

    taskForm: FormGroup;
    taskFormValidation(task_id: any = 0, milestone_id: any = 0, pp_id: any = 0) {
        this.taskForm = this.formBuilder.group({
            remarks: [''],
            actualstartdate: [],
            actualenddate: [''],
            allocated_to: [''],
            status: ['3', Validators.compose([Validators.required])],
            pp_id: [pp_id, Validators.compose([Validators.required])],
            tt_id: [task_id],
            milestone_id: [milestone_id],
            cheque_no: [],
            bank_drawn_no: [],
            //ac_no: [],
            transaction_ref: [],
            payment: [],
            amount: [],
            amount_total: [],
            sap_number: [],
            bank_reference_number: [],
            //invoice_no: [],
            transaction_date: [],
            drawn_on_date: [],
            bankdrawnonname: [],
            allocatedddate: []
        });
        const payApproveTask = ['1', '19', '12', '42', '43'];
        const payRequestTask = ['5', '11', '40'];
        if(payApproveTask.includes(task_id) && !this.isPaymentComplete) {
            this.taskForm.controls.drawn_on_date.setValidators([Validators.required]);
            this.taskForm.controls.transaction_date.clearValidators();
        } else if (payApproveTask.includes(task_id) && !this.isPaymentComplete) {
            this.taskForm.controls.transaction_date.setValidators([Validators.required]);
            this.taskForm.controls.drawn_on_date.clearValidators();
        }
        this.taskForm.controls.transaction_date.updateValueAndValidity();
        this.taskForm.controls.drawn_on_date.updateValueAndValidity();



        this.taskvalueChangeFunction(task_id);
        this.createValidation(task_id);
        this.getTaskDetail(this.currentProjectId);
    }


    projectDocuments: any;
    actionLoader: any;
    getUploadedDocumentsTask(task_id, h_id) {

        if (localStorage.getItem('emp_auth_key')) {
            this.actionLoader = 'uploadedDocs_loader';
            this.projectDocuments = [];
            this.projectManagementService.getUploadedDocumentsTask(h_id, task_id).subscribe(data => {
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

    handleFilesDropped(event: any) {
        let eventAsSelectfile = { 'target': { 'files': event } };
        this.fileChange(eventAsSelectfile);
    }


    uploadDocument: FormGroup;
    isUploadingDocs: any;
    isSubmittedDocument: any;
    fileChange(event: any) {
        if (localStorage.getItem('emp_auth_key')) {
            let task_id = this.tt_id;
            let milestone_id = this.milestone_id;
            let hid = this.h_id;
            let pp_id = this.pp_id;
            this.formHeader = this.task_name;
            // this.isSubmittedDocs = groupIndex;
            if (task_id != '') {
                this.actionLoader = 'upload_loader';
                let eventClone = event;
                let documentName = eventClone.target.files[0].name;//'taskDoc'+task_id;
                let extType = event.target.files[0].type;
                let ext = eventClone.target.files[0].name.split('.').pop();
                this.sharedServices.docsToBase64(event, ["pdf", "doc", "docx", "msword", "xls", "xlsx", "csv", "jpeg", "jpg", "png", "PDF", "DOC", "DOCX", "XLS", "XLSX", "CSV", "JPEG", "JPG", "PNG"]).then(data => {
                    this.isUploadingDocs = true;
                    this.sharedServices.uploadTaskDocument(hid, task_id, pp_id, milestone_id, documentName, String(data), ext, extType, 'not_audit').subscribe(data => {
                        if (data.status == 1) {
                            this.getUploadedDocumentsTask(task_id, hid);
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
    chequeError={
        cheque_no:'cheque number required',
        bank_drawn_no:'bank drawn number required',
        drawn_on_date:'deposit Date required'
    }

    neftError={
        //invoice_no:' invoice number required',
        //ac_no:'account number required',
        transaction_date:'transaction date required',
        transaction_ref:'transaction_reference required',
    }
    SelectedNEFT: boolean = false;
    SelectedCheque: boolean = false;
    taskvalueChangeFunction(task_id: any) {
        //const invoice_no = this.taskForm.get('invoice_no');
        const transaction_ref = this.taskForm.get('transaction_ref');
        const cheque_no = this.taskForm.get('cheque_no');
        const bankName = this.taskForm.get('bank_drawn_no')
        const amount=this.taskForm.get('amount')
        this.taskForm.get('payment').valueChanges.subscribe(val => {
            if (val == 1) {
                this.submitData=false
                this.SelectedNEFT = false;
                this.SelectedCheque = true;
                transaction_ref.clearValidators();
                cheque_no.setValidators([Validators.required]);
                amount.setValidators(Validators.required)
                this.taskForm.controls.drawn_on_date.setValidators([Validators.required]);
                this.taskForm.controls.transaction_date.clearValidators();

            } else if (val == 2) {
                this.submitData=false
                this.SelectedNEFT = true;
                this.SelectedCheque = false;
                // cheque_no.patchValue(null);
                // bankName.patchValue(null);
                cheque_no.clearValidators();
                transaction_ref.setValidators([Validators.required]);
                amount.setValidators(Validators.required)
                this.taskForm.controls.transaction_date.setValidators([Validators.required]);
                this.taskForm.controls.drawn_on_date.clearValidators();

            } else {
                transaction_ref.clearValidators();
                cheque_no.clearValidators();
                if(!this.TaskpopUp2){
                    amount.clearValidators();
                }
            }
            cheque_no.updateValueAndValidity();
            this.taskForm.controls.drawn_on_date.updateValueAndValidity();
            this.taskForm.controls.transaction_date.updateValueAndValidity();
            transaction_ref.updateValueAndValidity();
            amount.updateValueAndValidity();
        });

        this.taskForm.get('status')
        .valueChanges
        .subscribe(val=>{
            if(val == 1 || val == 3){
                this.taskForm.get('amount')
                .setValidators(Validators.required);
            }
            else{
                this.taskForm.get('amount')
                .clearValidators();
            }
            this.taskForm.get('amount')
            .updateValueAndValidity();
        })


    }

    createValidation(task_id: any) {
        const cheque_no = this.taskForm.get('bank_reference_number');
        const allocatedddate = this.taskForm.get('allocatedddate');
        const payment = this.taskForm.get('payment');

        if ((task_id == 11 || task_id == 40  || task_id == 5) && !this.isPaymentComplete) {
            cheque_no.setValidators([Validators.required]);
        } else {
            cheque_no.clearValidators();
        }
        if (task_id == 1 || task_id == 43 || task_id == 12 || task_id == 42|| task_id == 19) {
            payment.setValidators([Validators.required]);
        } else {
            payment.clearValidators();
        }
        cheque_no.updateValueAndValidity();
        allocatedddate.updateValueAndValidity();
        payment.updateValueAndValidity();

    }
    showactualenddate: any = false;

    get cheque_no(){
        return this.taskForm.controls.cheque_no
    }

    get bank_drawn_no(){
        return this.taskForm.controls.bank_drawn_no
    }


    get drawn_on_date(){
        return this.taskForm.controls.drawn_on_date
    }

    get invoice_no(){
        return this.taskForm.controls.invoice_no
    }


    get transaction_date(){
        return this.taskForm.controls.transaction_date
    }

    // get ac_no(){
    // return this.taskForm.controls.ac_no
    // }

    get transaction_ref() {
        return this.taskForm.controls.transaction_ref
    }

    get sap_number(){
        return this.taskForm.controls.sap_number
    }

    get bank_reference_number(){
        return this.taskForm.controls.bank_reference_number
    }
    get amount(){
        return this.taskForm.controls.amount;
    }


    onChangetaskcomplete(i: any) {
        this.submitData=false
        let actualend = this.taskForm.controls.actualenddate;
        if (i == 1) {
            this.showactualenddate = true;
            actualend.setValidators([Validators.required]);
        } else {
            this.showactualenddate = false;
            actualend.setValue('');
            actualend.clearValidators();
        }
        actualend.updateValueAndValidity();

        if(i == 1) {
            this.taskForm.controls.payment.clearValidators();
        }
        if(i == 3) {
            this.taskForm.controls.payment.setValidators([Validators.required]);
        }
        this.taskForm.controls.payment.updateValueAndValidity();
    }

    SaveTaskdata(formId: string) {
        this.submitData=true;
        if (localStorage.getItem('emp_auth_key')) {
            if (this.taskForm.value.actualenddate) {
                if (!this.taskForm.value.actualstartdate) {
                    this.popupMessageService.showError('Start Date not found', "Error!");
                    return false;
                }
                let dateobj_strdate = this.sharedServices.getDateInFormat(this.taskForm.value.actualstartdate);
                let dateobj_enddate = this.sharedServices.getDateInFormat(this.taskForm.value.actualenddate);

                if (new Date(dateobj_strdate).getTime() > new Date(dateobj_enddate).getTime()) {
                    this.popupMessageService.showError('End date should be greater than start date!', "Error!");
                    return false;
                }
                // if (this.taskForm.value.status != 1) {
                //     this.popupMessageService.showError('End date should be enter on task complete', "Error!");
                //     return false;
                // }
            } else {
                if (this.taskForm.value.status == 1) {
                    this.isEndDate=true;
                    this.popupMessageService.showError('End date is mandatory on task complete', "Error!");
                    return false;
                }
            }

            if (this.taskForm.value.status == 1) {
                if(!this.isPaymentComplete) {
                    this.popupMessageService.showError('Please complete payment before completing task', "Error!");
                    this.taskForm.controls.status.patchValue('3');
                    let actualend = this.taskForm.controls.actualenddate;
                    this.showactualenddate = false;
                    actualend.setValue('');
                    actualend.clearValidators();
                    actualend.updateValueAndValidity();
                    return false;
                }

            }

            if (this.taskForm.valid && this.taskForm.value.status != 2) {
                this.taskForm.value.isBops = 1;
                this.projectManagementService.submitTaskdata(this.taskForm.value).subscribe(data => {
                    if (data.status == 1) {
                        this.popupMessageService.showSuccess('Task submitted successfully.', "Success");
                    } else {
                        this.popupMessageService.showError(data.error_message, "Error!");
                    }
                    if (formId === 'exampleModal2' && this.Listing == 'ReleaseRequest' ) {
                        this.getPayRequest(this.pages);
                        this.Listing = 'ReleaseRequest';
                    }
                    else if(formId === 'exampleModal2' && this.Listing == 'ReleaseRequestComplete' ){
                        this.getPayRequestComplete(this.pages);
                        this.Listing = 'ReleaseRequestComplete';
                    }
                    else {
                        this.getPaymentToApproveListing(this.pages);
                        this.Listing = 'paymentToApprove';
                    }

                }, error => {
                    this.popupMessageService.showError(error, "Error!");
                });
                this.closeTaskPopup();
            } else {
                Object.keys(this.taskForm.controls).forEach(key => {
                    const controlErrors: ValidationErrors = this.taskForm.get(key).errors;
                    if (controlErrors != null) {
                    }
                });
                this.popupMessageService.showError('Invalid Data', "Error!");
            }
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    SaveTaskdataOld(formId: string) {
      this.submitData=true;
      if (localStorage.getItem('emp_auth_key')) {
          if (this.taskForm.value.actualenddate) {
              if (!this.taskForm.value.actualstartdate) {
                  this.popupMessageService.showError('Start Date not found', "Error!");
                  return false;
              }
              let dateobj_strdate = this.sharedServices.getDateInFormat(this.taskForm.value.actualstartdate);
              let dateobj_enddate = this.sharedServices.getDateInFormat(this.taskForm.value.actualenddate);

              if (new Date(dateobj_strdate).getTime() > new Date(dateobj_enddate).getTime()) {
                  this.popupMessageService.showError('End date should be greater than start date!', "Error!");
                  return false;
              }
              // if (this.taskForm.value.status != 1) {
              //     this.popupMessageService.showError('End date should be enter on task complete', "Error!");
              //     return false;
              // }
          } else {
              if (this.taskForm.value.status == 1) {
                  this.isEndDate=true;
                  this.popupMessageService.showError('End date is mandatory on task complete', "Error!");
                  return false;
              }
          }

          if (this.taskForm.value.status == 1) {
              if(!this.isPaymentComplete) {
                  this.popupMessageService.showError('Please complete payment before completing task', "Error!");
                  this.taskForm.controls.status.patchValue('3');
                  let actualend = this.taskForm.controls.actualenddate;
                  this.showactualenddate = false;
                  actualend.setValue('');
                  actualend.clearValidators();
                  actualend.updateValueAndValidity();
                  return false;
              }

          }

          if (this.taskForm.valid && this.taskForm.value.status != 2) {
              this.taskForm.value.isBops = 1;
              this.projectManagementService.submitTaskdataOld(this.taskForm.value).subscribe(data => {
                  if (data.status == 1) {
                      this.popupMessageService.showSuccess('Task submitted successfully.', "Success");
                  } else {
                      this.popupMessageService.showError(data.error_message, "Error!");
                  }
                  if (formId === 'exampleModal2' && this.Listing == 'ReleaseRequestOld' ) {
                      this.getPayRequestOld(this.pages);
                      this.Listing = 'ReleaseRequestOld';
                  }

              }, error => {
                  this.popupMessageService.showError(error, "Error!");
              });
              this.closeTaskPopup();
          } else {
              Object.keys(this.taskForm.controls).forEach(key => {
                  const controlErrors: ValidationErrors = this.taskForm.get(key).errors;
                  if (controlErrors != null) {
                  }
              });
              this.popupMessageService.showError('Invalid Data', "Error!");
          }
      } else {
          this.route.navigateByUrl('/employee/login');
      }
  }

    /*
    * Prevent The Negative Value
    */
    onKeyPress(e): void{
        let inputKeyCode = e.keyCode ? e.keyCode : e.which;
        if(inputKeyCode == 45){
            e.preventDefault();
        }
    }

    totalPaidCustomer = 0;
    getTaskDetail(projectId?: any) {
        let task_id = this.tt_id;
        let task_num = this.tt_id;
        let milestone_id = this.milestone_id;
        let hid = this.h_id;
        let pp_id = this.pp_id;
        this.formHeader = this.task_name;
        let formdata = [];

        this.projectManagementService.getmilestonetasks(pp_id, milestone_id, task_num, projectId).subscribe((data) => {
            if (data.status == 1) {
                this.taskstartdate=new Date(data.data[task_num].taskstartdate)
                formdata = data.data;
            }
            if (formdata[task_num]) {
                if (formdata[task_num].ptask_status && formdata[task_num].ptask_status == 1) {
                    this.showactualenddate = true;
                } else {
                    this.showactualenddate = false;
                }
                (formdata[task_num].ptask_allocate_to) ? this.taskForm.controls.allocated_to.setValue(formdata[task_num].ptask_allocate_to) : this.taskForm.controls.allocated_to.setValue('');
                // Remarks
                // (formdata[task_num].ptask_remark) ? this.taskForm.controls.remarks.setValue(formdata[task_num].ptask_remark) : '';
                (formdata[task_num].taskstartdate != '') ? this.taskForm.controls.actualstartdate.setValue(new Date(formdata[task_num].taskstartdate)) : this.taskForm.controls.actualstartdate.setValue('');
                (formdata[task_num].taskenddate != '') ? this.taskForm.controls.actualenddate.setValue(new Date(formdata[task_num].taskenddate)) : this.taskForm.controls.actualenddate.setValue('');
                (formdata[task_num].ptask_status) ? this.taskForm.controls.status.setValue(formdata[task_num].ptask_status) : '';
                // Check number
                // (formdata[task_num].ptask_cheque_no) ? this.taskForm.controls.cheque_no.setValue(formdata[task_num].ptask_cheque_no) : '';
                // Payment mode
                // (formdata[task_num].ptask_payment_mode) ? this.taskForm.controls.payment.setValue(formdata[task_num].ptask_payment_mode) : this.taskForm.controls.payment.setValue('');
                //(formdata[task_num].ptask_invoice_no) ? this.taskForm.controls.invoice_no.setValue(formdata[task_num].ptask_invoice_no) : '';
                (formdata[task_num].ptask_allocate_date) ? this.taskForm.controls.allocatedddate.setValue(new Date(formdata[task_num].ptask_allocate_date)) : '';
                // Transaction date
                // (formdata[task_num].ptask_bank_drawn) ? this.taskForm.controls.transaction_date.setValue(new Date(formdata[task_num].ptask_bank_drawn)) : null;
                // Bank Drawn On
                // (formdata[task_num].ptask_bank_drawn_no) ? this.taskForm.controls.bank_drawn_no.setValue(formdata[task_num].ptask_bank_drawn_no) : '';
                // Deposit date
                // (formdata[task_num].ptask_drawn_on_date) ? this.taskForm.controls.drawn_on_date.setValue(new Date(formdata[task_num].ptask_drawn_on_date)) : '';
                (formdata[task_num].ptask_bank_name) ? this.taskForm.controls.bankdrawnonname.setValue(formdata[task_num].ptask_bank_name) : '';
                // SAP reference number
                // (formdata[task_num].ptask_sap_number) ? this.taskForm.controls.sap_number.setValue(formdata[task_num].ptask_sap_number) : '';
                // Bank reference number
                // (formdata[task_num].ptask_bank_reference_number) ? this.taskForm.controls.bank_reference_number.setValue(formdata[task_num].ptask_bank_reference_number) : '';
                // Amount
                // (formdata[task_num].ptask_amount === '' || formdata[task_num].ptask_amount === "0" || formdata[task_num].ptask_amount === null) ? this.taskForm.controls.amount.setValue(formdata[task_num].amount) : this.taskForm.controls.amount.setValue(formdata[task_num].ptask_amount);
                if((formdata[task_num].ptask_ttid == '5' || formdata[task_num].ptask_ttid == '11' || formdata[task_num].ptask_ttid == '40') && formdata[task_num].ptask_amount) {
                    this.taskForm.controls.amount.setValue(0);
                    // (formdata[task_num].ptask_sap_number) ? this.taskForm.controls.sap_number.setValue(formdata[task_num].ptask_sap_number) : '';
                    // (formdata[task_num].ptask_bank_reference_number) ? this.taskForm.controls.bank_reference_number.setValue(formdata[task_num].ptask_bank_reference_number) : '';
                    // (formdata[task_num].ptask_bank_drawn) ? this.taskForm.controls.transaction_date.setValue(new Date(formdata[task_num].ptask_bank_drawn)) : null;
                    // (formdata[task_num].ptask_remark) ? this.taskForm.controls.remarks.setValue(formdata[task_num].ptask_remark) : '';
                }
                if(formdata[task_num].amount) {
                    if(!this.taskForm.controls.amount_total.value) {
                        // this.taskForm.controls.amount_total.setValue(formdata[task_num].amount);
                    }
                }

                // Subtract paid amount from total amount
                // const totalAmt = +this.taskForm.controls.amount_total.value;
                // const amt = +this.taskForm.controls.amount.value;
                // const amtDiff = totalAmt - amt;
                // if(totalAmt != amt) {
                //     this.taskForm.controls.amount.setValue(amtDiff);
                // }

                if((formdata[task_num].ptask_ttid == '1' || formdata[task_num].ptask_ttid == '19' || formdata[task_num].ptask_ttid == '12' || formdata[task_num].ptask_ttid == '43' || formdata[task_num].ptask_ttid == '42') && formdata[task_num].ptask_amount) {
                    const amount = +formdata[task_num].amount;
                    const ptask_amount = +formdata[task_num].ptask_amount;
                    this.amountRemaining = amount - ptask_amount;
                    this.amountRemaining = +this.amountRemaining.toFixed(2);
                } else {
                    if(formdata[task_num].ptask_amount_request != '0') {
                        this.amountRemaining = formdata[task_num].ptask_amount_request;
                    } else {
                        this.amountRemaining = formdata[task_num].amount - formdata[task_num].ptask_amount;
                    }


                      const amountRemaining = this.amountRemaining;
                      this.amountRemaining = +amountRemaining.toFixed(2);
                      //console.log(this.amountRemaining);
                }



                if(formdata[task_num].customer_total_paid) {
                    this.totalPaidCustomer = formdata[task_num].customer_total_paid;
                } else {
                    this.totalPaidCustomer = 0;
                }
            }
            let val = (formdata[task_num]) ? formdata[task_num].ptask_payment_mode : '';
            const invoice_no = this.taskForm.get('invoice_no');
            const cheque_no = this.taskForm.get('cheque_no');
            this.SelectedNEFT = false;
            this.SelectedCheque = false;
            if (val == 1) {
                this.SelectedNEFT = false;
                this.SelectedCheque = true;
                this.submitData=false

                if(invoice_no) {
                    invoice_no.setValue('');
                    invoice_no.clearValidators();
                    invoice_no.updateValueAndValidity();
                }
                if(cheque_no) {
                    cheque_no.setValidators([Validators.required]);
                    cheque_no.updateValueAndValidity();
                }
            } else if (val == 2) {
                this.SelectedNEFT = true;
                this.SelectedCheque = false;
                this.submitData=false

                if(cheque_no){
                    cheque_no.setValue('');
                    cheque_no.clearValidators();
                    cheque_no.updateValueAndValidity();
                }
                if(invoice_no) {
                    invoice_no.setValidators([Validators.required]);
                    invoice_no.updateValueAndValidity();
                }

            }
        });
    }

    pageSubmit() {
        if (this.paginationSubmitForm.valid) {
            let page = this.paginationSubmitForm.controls.page_number.value;
            let typeArr = {
                "paymentToApprove": "PA", "paymentToApproveComplete": "PA_COMPLETE",
                "ReleaseRequest": "PR", "ReleaseRequestComplete": "PR_COMPLETE", "ReleaseRequestOld": "PR_OLD"
            };
            this.leadListService.getPaymentApproveListNew(page, this.itemPerPage, typeArr[this.Listing], this.smartSearchFormData).subscribe((data) => {
                if (data.status == 1) {
                    this.pages = page;
                    this.paymentList = [];
                    this.paymentRequestList = [];
                    if (this.Listing == "paymentToApprove" || this.Listing == "paymentToApproveComplete") {
                        this.paymentList = data.result;
                        this.paymentList = this.mapPaymentData(this.paymentList);
                    }
                    if (this.Listing == "ReleaseRequest" || this.Listing == "ReleaseRequestComplete" || this.Listing == "ReleaseRequestOld") {
                        this.paymentRequestList = data.result;
                        this.paymentRequestList = this.mapPaymentData(this.paymentRequestList);
                    }
                } else {
                    this.popupMessageService.showError(data.error_message, "!Error");
                }
                this.closeTaskPopup();
            })

        } else {
          Object.keys(this.paginationSubmitForm.controls).forEach(key => {
            const controlErrors: ValidationErrors = this.paginationSubmitForm.get(key).errors;
            if (controlErrors != null) {
              Object.keys(controlErrors).forEach(keyError => {
               //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
              });
            }
          });
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

    sumNumber(a1, a2: any = 0) {
        return +a1 - +a2;
    }
    //delete task documents
    ConfirmDeleting: boolean = false;
    pdoc_data: any;
    pid: any;
    currentHandOffData: any;
    confirmDeleteTaskDoc(data, handoff: any = null) {
        this.ConfirmDeleting = true;
        this.pdoc_data = data;
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
                this.getUploadedDocumentsTask(pdoc_data.tdoc_task_id, this.h_id);
                this.popupMessageService.showInfo('Document Removed', '!Info');

            } else {
                this.ConfirmDeleting = false;
                this.popupMessageService.showInfo('Document Removed failed', '!Info');
            }

        });
    }

    closeTaskPopup() {
        this.submitData=false
        this.TaskpopUp = false;
        this.TaskpopUp2 = false;
    }



    /*
    *   Prepare the data to export to CSV of Approved Payment List
    */
    exportFinancedData(which: string) {
        const arrPaymentToApprove =  ["Project Id", "Customer FirstName", "Customer LastName", "City", "State","Project Type", "Solution Price", "Order Booking Date", "P1 Cust Date", "P1 Cust Amount", "P2 Cust Date", "P2 Cust Amount", "P3 Cust Date", "P3 Cust Amount", "P4 Cust Date", "P4 Cust Amount", "Total Paid By Customer", "Cust Amount Peding", "Partner Name", "WO Date", "Total Payable To Partner", "P1 Partner Date", "P1 Partner Amount", "P2 Partner Date", "P2 Partner Amount", "P3 Partner Date", "P3 Partner Amount", "Deductions", "TotalPaidToPartner", "Partner Amount Pending"];
        const arrApprovedPayment = ["ProjectId", "CustomerName", "ProjectType", "DcCapacity", "PaymentTranche", "ProjectCost", "AmountRecieved", "TransactionId", "PaymentDate", "TransactionDate"];
        const arrPayRequest = ["ProjectId", "PartnerName", "CustomerName", "ProjectType", "DcCapacity", "PaymentTranche"];
        const arrPayRequestComplete =  ["ProjectId", "PartnerName", "CustomerName", "ProjectType", "DcCapacity", "PaymentTranche", "CustomerCity", "ProjectCost", "AmountPaid", "PaymentDate", "TransactionDate"];
        const fileNameSuggestions = {
            PA: 'Payment To Approve List',
            PA_COMPLETE: 'Approved Payment List',
            PR: 'Pay Request List',
            PR_COMPLETE: 'Payment Request Completed List',
        };
        const fileName = fileNameSuggestions[which];

        switch (which) {
            case 'PA':
                this.listTraverse = arrPaymentToApprove;
                break;
            case 'PA_COMPLETE':
                this.listTraverse = arrApprovedPayment;
                break;
            case 'PR':
                this.listTraverse = arrPayRequest;
                break;
            case 'PR_COMPLETE':
                this.prcValue = true;
                this.listTraverse = arrPayRequestComplete;
                break;
            default:
                this.listTraverse = [];
                break;
        }
        const tempObject = {};
        this.listTraverse.forEach(function (key, index) {
            tempObject[key] = key;
        });
        const exportData = [tempObject];

        let exportFromDate;

        if(this.exportForm.controls.exportFromDate.value) {
          exportFromDate = this.exportForm.controls.exportFromDate.value.toISOString();
        } else {
          exportFromDate = '';
        }

        let exportToDate;

        if(this.exportForm.controls.exportToDate.value) {
          exportToDate = this.exportForm.controls.exportToDate.value.toISOString();
        } else {
          exportToDate = '';
        }



        //console.log(this.exportForm.controls.exportFromDate.value);

        this.leadListService.getPaymentApproveListNew(this.pages, this.itemPerPage, which, this.smartSearchFormData, true, exportFromDate, exportToDate).subscribe(
            data => {
                if(data.status) {
                    data.result.forEach(element => {
                        let temp = {
                            projectId : '',
                            customerFirstName: '',
                            customerlastName: '',
                            city: '',
                            state: '',
                            projectType: '',
                            solutionPrice: '',
                            orderBookingDate: '',
                            p1CustDate: '',
                            p1CustAmount: '',
                            p2CustDate: '',
                            p2CustAmount: '',
                            p3CustDate: '',
                            p3CustAmount: '',
                            p4CustDate: '',
                            p4CustAmount: '',
                            totalPaidByCustomer: 0,
                            custAmountPeding: '',
                            partnerName: '',
                            woDate: '',
                            totalPayableToPartner: '',
                            p1PartnerDate: '',
                            p1PartnerAmount: '',
                            p2PartnerDate: '',
                            p2PartnerAmount: '',
                            p3PartnerDate: '',
                            p3PartnerAmount: '',
                            deductions: '',
                            totalPaidToPartner: '',
                            partnerAmountPending: '',
                        };
                        temp.projectId = element.project_code ? element.project_code: '';
                        temp.customerFirstName = element.project_code ? element.cceld_firstname: '';
                        temp.customerlastName = element.project_code ? element.cceld_lastname: '';
                        temp.city = element.project_code ? element.district_name: '';
                        temp.state = element.project_code ? element.state_name: '';
                        temp.projectType = element.gridtype == '1' ? 'Grid-Tied' : 'Off-Grid';
                        temp.solutionPrice = element.project_value ? element.project_value: '';
                        temp.orderBookingDate = '';


                        element.ptask_enddate = element.ptask_enddate.split(",");
                        element.finance_tasks = element.finance_tasks.split(",");
                        element.finance_task_status = element.finance_task_status.split(",");
                        element.ptask_ttid_group = element.ptask_ttid_group.split(",");
                        element.ptask_miestone_id_group = element.ptask_miestone_id_group.split(",");
                        element.ptask_pp_id_group = element.ptask_pp_id_group.split(",");
                        element.finance_tasks_desc = element.finance_tasks_desc.split(",");
                        element.ptask_amount_group = element.ptask_amount_group.split(",");
                        if(element.amount_request_group) {
                            element.amount_request_group = element.amount_request_group.split(",");
                        } else {
                            element.amount_request_group = "0,0,0".split(",");
                        }
                        if(element.ptask_amount_total_group) {
                            element.ptask_amount_total_group = element.ptask_amount_total_group.split(",");
                        }
                        element.is_released_by_finance_group = element.is_released_by_finance_group.split(",");

                        if(element.finance_tasks.includes("1")) {
                            let index = element.finance_tasks.indexOf('1');
                            if(element.ptask_enddate[index] !='0') {
                              temp.p1CustDate = this.datePipe.transform(new Date(element.ptask_enddate[index]), "dd/MM/yyyy");
                            }

                            temp.p1CustAmount = element.ptask_amount_group[index];
                        }
                        if(element.finance_tasks.includes("19")) {
                            let index = element.finance_tasks.indexOf('19');
                            if(element.ptask_enddate[index] !='0') {
                              temp.p2CustDate = this.datePipe.transform(new Date(element.ptask_enddate[index]), "dd/MM/yyyy")
                            }
                            temp.p2CustAmount = element.ptask_amount_group[index];
                        }
                        if(element.finance_tasks.includes("12")) {
                            let index = element.finance_tasks.indexOf('12');
                            if(element.ptask_enddate[index] !='0') {
                              temp.p3CustDate = this.datePipe.transform(new Date(element.ptask_enddate[index]), "dd/MM/yyyy")
                            }
                            temp.p3CustAmount = element.ptask_amount_group[index];
                        }
                        if(element.finance_tasks.includes("43")) {
                            let index = element.finance_tasks.indexOf('43');
                            if(element.ptask_enddate[index] !='0') {
                              temp.p4CustDate = this.datePipe.transform(new Date(element.ptask_enddate[index]), "dd/MM/yyyy")
                            }
                            temp.p4CustAmount = element.ptask_amount_group[index];
                        }
                        // Total Paid by customer
                        temp.totalPaidByCustomer = (+temp.p1CustAmount) + (+temp.p2CustAmount) + (+temp.p3CustAmount) + (+temp.p4CustAmount);

                        const project_value = + element.project_value;
                        temp.custAmountPeding = (project_value - temp.totalPaidByCustomer).toString();
                        temp.partnerName = element.Partner_name ? element.Partner_name: '';
                        temp.woDate = '';

                        if(element.bos) {
                          temp.totalPayableToPartner = element.bos;
                        }


                        if(element.finance_tasks.includes("5")) {
                            let index = element.finance_tasks.indexOf('5');
                            if(element.ptask_enddate[index] !='0') {
                              temp.p1PartnerDate = this.datePipe.transform(new Date(element.ptask_enddate[index]), "dd/MM/yyyy")
                            }
                            temp.p1PartnerAmount = element.ptask_amount_group[index];
                        }
                        if(element.finance_tasks.includes("11")) {
                            let index = element.finance_tasks.indexOf('11');
                            if(element.ptask_enddate[index] !='0') {
                              temp.p2PartnerDate = this.datePipe.transform(new Date(element.ptask_enddate[index]), "dd/MM/yyyy")
                            }
                            temp.p2PartnerAmount = element.ptask_amount_group[index];
                        }
                        if(element.finance_tasks.includes("40")) {
                            let index = element.finance_tasks.indexOf('40');
                            if(element.ptask_enddate[index] !='0') {
                              temp.p3PartnerDate = this.datePipe.transform(new Date(element.ptask_enddate[index]), "dd/MM/yyyy")
                            }
                            temp.p3PartnerAmount = element.ptask_amount_group[index];
                        }



                        temp.deductions = '';

                        const ssp_p1 = +temp.p1PartnerAmount;
                        const ssp_p2 = +temp.p2PartnerAmount;
                        const ssp_p3 = +temp.p3PartnerAmount;
                        temp.totalPaidToPartner = (ssp_p1 + ssp_p2 + ssp_p3).toString();

                        if(element.bos) {
                          const ssp_p1 = +temp.p1PartnerAmount;
                          const ssp_p2 = +temp.p2PartnerAmount;
                          const ssp_p3 = +temp.p3PartnerAmount;
                          const bos = +element.bos;
                          temp.partnerAmountPending = (bos - (ssp_p1 + ssp_p2 + ssp_p3)).toString();

                        } else {
                          temp.partnerAmountPending = '';
                        }

                        Object.keys(temp).forEach((key) => (temp[key] === undefined) && delete temp[key]);
                        exportData.push(temp);
                    });
                    this.prcValue = false;
                }
                this.exportToCSV(exportData, fileName);
            }
        );
    }

    transactionDateValue(...args) {
        if(args[0].includes('TransactionDate')){
            if(args[1] != null && !this.prcValue) {
                return args[1];
            } else if( args[2] != null && this.prcValue) {
                return args[2];
            } else {
                return undefined;
            }
        }
    }
    /*
    *   Universal Export to CSV Method
    */
    exportToCSV(data, fileName) {
        new ngxCsv(data, fileName, { showLabels: true });
    }
}
