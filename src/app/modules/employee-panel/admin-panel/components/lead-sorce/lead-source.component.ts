import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
//import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
//import { InlineMessageService } from './../../message/services/message.service';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
//import { PopupMessageService } from './../../../modules/message/services/message.service';
//import { LEAD_PANEL_FORM } from './../../../static/static';
//import { SITE_SURVEY } from './../../../static/static';
//import { LeadListService } from '../../employee-panel/services/lead-list.service';
//import { SharedServices } from '../../../services/shared.services';
//import * as globals from '../../../static/static';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { element } from 'protractor';
import { LeadPanelService } from 'app/modules/customer-care/services/lead-panel.service';
import { AlertServices } from 'app/services/alert.services';
import { LeadListService } from 'app/modules/employee-panel/services/lead-list.service';
import { InlineMessageService, PopupMessageService } from 'app/modules/message/services/message.service';
import { SharedServices } from 'app/services/shared.services';
import { LEAD_PANEL_FORM, SITE_SURVEY } from 'app/static/static';
import * as globals from 'app/static/static';

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'app-lead-source',
    templateUrl: './lead-source.component.html',
    styleUrls: ['./lead-source.component.css']
})
export class LeadSource implements OnInit {

    userData: any = {};
    loading = false;
    isData: boolean = false;
    subscription: Subscription;
    leadSoucreData: any;
    siteSurveyData: any;
    fullScreenSidebar = false;
    editSiteSurvey = false;
    leadSourceForm: FormGroup;
    leadId: string;
    itemIndex: number;
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
        this.getAllLeadProjects(1);
        this.getLeadSourceList();
        this.createLeadSourceForm();
        this.createEditSiteSurveyForm();
        this.getSiteSurveyData();
    }

    totalItem: number;
    pageCount: any = 1;
    pages: number;
    smartSearchResult(event: any) {
      // console.log(event , this.isListing);
      this.allLeadData = [];
      this.totalItem = 0;
      this.pageCount;
      this.pages = 1;


      this.createPaginationSubmitForm();
      this.sharedServices.formDataSmartSearch.subscribe((data) => {
          this.smartSearchFormData = data;
      })
      this.sharedServices.searchForm.subscribe((data) => {
          this.currentSearchTab = data;
      })
      if (this.currentSearchTab == 'allLeadsProjectsAdmin') {
          this.allLeadData = event.data;
          this.pageCount
      }
      this.totalItem = event._meta.total_records;
      this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
  }

  paginationSubmitForm: FormGroup;
    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
        });
    }

    isListing: any;
    itemPerPage: any = 10;
    pageSubmit() {
        //console.log(this.isListing);
        if (this.paginationSubmitForm.valid) {
            let page = this.paginationSubmitForm.controls.page_number.value;
            if (this.smartSearchFormData) {


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

                return;
            } else {
                if (this.isListing == 'all_leads_project') {
                    this.getAllLeadProjects(page);
                }

            }
        }
    }

    currentSearchTab: String;
    smartSearchFormData: any;

    noRecords: boolean = false;

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

    showSmartSearchComponent = false;
    allLeadData: any = [];
    getAllLeadProjects(page: any) {
        this.loading = true
        this.showSmartSearchComponent = true;
        this.isListing = 'all_leads_project';
        this.sharedServices.searchForm.next('allLeadsProjectsAdmin');
        this.subscription = this.leadPanelService.getAllLeadsAdmin(page, this.itemPerPage).subscribe(
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


    ResetSmartSearchForm() {
        this.sharedServices.formDataSmartSearch.next("");
    }


    getLeadSourceList() {
      this.leadListService.GetLeadsList().subscribe(response =>{
        if (response.status) {

          let arrPush = [];
            for (let item of response.data.data) {
              arrPush.push({ value: String(item.source_master_id), label: String(item.source_master_name),  });
            }
            this.leadSoucreData = arrPush;
        }
      });
    }

    getSiteSurveyData() {
      this.subscription = this.leadPanelService.getSurveyorData().subscribe(data => {
        if (data.status) {
            this.siteSurveyData = this.convertForSelect(data.data.emp_data);

        } else {

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

    createLeadSourceForm() {
      this.leadSourceForm = this.formBuilder.group({
        sourceId: ['', [Validators.required]],
        sourceName: ['']
      });
    }

    editSiteSurveyForm: FormGroup
    createEditSiteSurveyForm() {
      this.editSiteSurveyForm = this.formBuilder.group({
        sourceId: [''],
        surveyId: ['', [Validators.required]]
      });
    }

    showLeadSouceEditPopup(data, i) {
      this.fullScreenSidebar = true
      this.leadId = data.lead_id;
      this.leadSourceForm.controls.sourceId.patchValue(data.source_master_id)
      this.itemIndex = i;
    }

    showSurveySourceEditPopup(data, i) {
      this.editSiteSurvey = true
      this.leadId = data.lead_id;
      this.editSiteSurveyForm.controls.surveyId.patchValue(data.surveyor_id)
      this.itemIndex = i;
    }

    updateLeadSource() {
      if(this.leadSourceForm.valid) {
        const data = {
          leadId: this.leadId,
          lead_source_id: this.leadSourceForm.controls.sourceId.value
        };
        this.leadPanelService.updateLeadSource(data).subscribe(
          res => {
            if(res.status) {
              this.fullScreenSidebar = false;
              this.popupMessageService.showSuccess("Lead source updated successfully", "Success");
              const idx = this.leadSoucreData.findIndex(item => item.value == data.lead_source_id);
              console.log(idx);

              if(idx > -1) {
                this.allLeadData[this.itemIndex].source_master_name = this.leadSoucreData[idx].label;
                const currentdate = new Date();
                let dateTime = currentdate.getFullYear() + '-' + (currentdate.getMonth()+1) + '-' + currentdate.getDate() + ' ' + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds();
                this.allLeadData[this.itemIndex].lead_modifiedon = dateTime;
              }
            }
          },
          err => {
            this.popupMessageService.showError("Something went wrong", "Error");
          }
        );
      } else {
        this.popupMessageService.showError("Please select a lead source", "Error");
      }

    }

    updateSiteSurveyor() {
      if(this.editSiteSurveyForm.valid) {
        const data = {
          leadId: this.leadId,
          surveyerid: this.editSiteSurveyForm.controls.surveyId.value
        };
        this.leadPanelService.updateSiteSurveyor(data).subscribe(
          res => {
            if(res.status) {
              this.editSiteSurvey = false;
              this.popupMessageService.showSuccess("Site surveyor updated successfully", "Success");
              const idx = this.siteSurveyData.findIndex(item => item.value == data.surveyerid);
              if(idx > -1) {
                this.allLeadData[this.itemIndex].surveyor = this.siteSurveyData[idx].label;
                const currentdate = new Date();
                let dateTime = currentdate.getFullYear() + '-' + (currentdate.getMonth()+1) + '-' + currentdate.getDate() + ' ' + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds();
                this.allLeadData[this.itemIndex].lead_modifiedon = dateTime;
              }
            }
          },
          err => {
            this.popupMessageService.showError("Something went wrong", "Error");
          }
        );
      } else {
        this.popupMessageService.showError("Please select a site surveyor", "Error");
      }

    }

}

