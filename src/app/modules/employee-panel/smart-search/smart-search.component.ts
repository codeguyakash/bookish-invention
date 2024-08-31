import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { LeadListService } from '../services/lead-list.service';
import { PopupMessageService } from './../../message/services/message.service';
import * as globals from '../../../static/static';
import { LeadPanelService } from '../../customer-care/services/lead-panel.service';
import { templateJitUrl } from '@angular/compiler';
import { SharedServices } from '../../../services/shared.services';
import { element } from 'protractor';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

const date = new Date();

@Component({
  selector: 'smart-search',
  templateUrl: './smart-search.component.html'
})
export class SmartSearch implements OnInit, OnDestroy {

  consumerLeadsListForm: FormGroup;
  followUpForm: FormGroup;
  missedCallLogsSearchForm: FormGroup;
  searchForm: FormGroup;
  localityPinSearchForm: FormGroup;
  visible: string;
  projectStatusList = [];
  siteSurveyorsList = [];
  pmlist = [];
  solutionDesignersList = [];
  userData: any;
  emp_role: any;
  currentSearchForm: string;
  project_type: any;
  allStates: any;
  allCities: any;
  cityList: any;
  stateList: any;
  minDateFrom: any;
  minDateTo: any;
  fromDate: any;
  toDate = new Date();
  toDateFixed = new Date();
  dateAfter2Days = new Date((new Date()).getTime() + (2 * 24 * 60 * 60 * 1000));
  dateAfter2DaysFixed = new Date((new Date()).getTime() + (2 * 24 * 60 * 60 * 1000));
  maxDateFrom: Date = new Date();
  maxDateFromAfter2Days = new Date((new Date()).getTime() + (2 * 24 * 60 * 60 * 1000));
  leadListStatus = [];
  lockedStatus: any = [{ value: 'queue', label: 'queue' }, { value: 'locked', label: 'locked' }]
  leadStatus: any = [];
  projectStatus: any = [];
  unchangedProjectStatus: any = [];
  rejectionStatus: any = [];
  reassignEmployees: any = [];
  coldbucketLeadsProjects: FormGroup;
  sourceList: any = [];
  view_type: any;
  partnerList: any = [];
  @Input() legacy;

  @Output() SearchResults = new EventEmitter<any>();
  ProjectType = [
    { value: "Single Location", label: 'Single Location' },
    { value: "Multiple Location", label: 'Multiple Location' }
  ];

  searchFormSubscription: Subscription;

  customerType = [
    { value: "Industrial", label: 'Industrial' },
    { value: "Institutional/Corporate", label: 'Institutional/Corporate' },
    { value: "MSME", label: 'MSME' },
    { value: "Education", label: 'Education' },
    { value: "Government", label: 'Government' },
    { value: "Multi-Storey", label: 'Multi-Storey' },
    { value: "Villa/Independent House", label: 'Villa/Independent House' },
    { value: "RWA/GroupHousing", label: 'RWA / Group Housing' },
    { value: "HighRiseSociety", label: 'High Rise Society' },
    { value: "Others", label: 'Others' },
  ]

  constructor(
    private sharedService: SharedServices,
    private formBuilder: FormBuilder,
    private leadListService: LeadListService,
    private popupMessageService: PopupMessageService,
    private leadPanelService: LeadPanelService
  ) {
  }

  ngOnInit() {
    // this.visible = 'button';
    this.searchFormSubscription = this.sharedService.searchForm.subscribe(data => {
      console.log("subscribed");

      if (data) {
        this.currentSearchForm = data;
        //console.log(this.currentSearchForm);

        // this.getSurveyorList();
        if (this.currentSearchForm == 'surveyorRejected') {
          this.dateAfter2Days = new Date();
          this.dateAfter2DaysFixed = new Date();
          this.maxDateFromAfter2Days = new Date();
        }
        if (this.currentSearchForm == 'SspPaymentAprroval' || this.currentSearchForm == 'FinancePayment' || this.currentSearchForm == 'OpsHeadApproval' || this.currentSearchForm == 'ApprovedPayments') {
          this.getpartnerListArray();
        }
        this.sharedService.project_type.subscribe(data => {
          if (data) {
            this.project_type = data;
          }
        });
        this.sharedService.view_type.subscribe(data => {
          this.view_type = data;
        });
        if(this.currentSearchForm != 'SspPaymentAprroval' && this.currentSearchForm != 'FinancePayment' && this.currentSearchForm != 'OpsHeadApproval' && this.currentSearchForm != 'OpsheadApprovedPayments' && this.currentSearchForm != 'SspPaymentAprroval' && this.currentSearchForm != 'FinancePayment' && this.currentSearchForm != 'CommercialApprovedPayments') {
          this.getProjectStatusList();
          this.getFollowupStatusList();
          this.createcceLeadForm();
        }
        this.getLeadListStatus();
        this.getSurveyorList();

        this.createConsumerLeadsListForm();
        this.createLocalityPinSearchForm();
        this.createSearchForm();
        this.createFollowUpForm();

        this.getEmployeeSkillById();
        this.createColdbucketLeadProjectForm();
        this.createMissedCallLogsSearchForm();
        this.createAllLeadProjectForm();

        this.createLeadsListingCceForm();
        this.createProjectmanagerSearchForm();
        if (this.currentSearchForm != 'sitesurveyorLeadList' && this.currentSearchForm != 'sitesurveyorSurveyList') {
          this.searchForm.reset();
        }
        this.partnerQuerySearch();
        this.partnerUserQuerySearch();
        this.createEmployeeMasterForm();
        this.createFinaceUserSearchForm();
        this.createApprovedFinaceUserSearchForm();
      }
    });
    this.allStatesAndCitiesData();
    if (this.currentSearchForm == 'ongoing' || this.currentSearchForm == 'completed' || this.currentSearchForm == 'allocated' || this.currentSearchForm == 'assigned' || this.currentSearchForm == 'pm_view') {
      this.getpmListArray();
    }

    // this.getLeadListStatus();
    // this.getSolutionDesignerList();
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.emp_role = localStorage.getItem('role_id');

    this.visible = 'search-feilds';
  }

  ngOnDestroy(): void {
    this.searchFormSubscription.unsubscribe();
  }
  createLocalityPinSearchForm() {
    this.localityPinSearchForm = this.formBuilder.group({
      state: [''],
      district: [''],
      pincode: [''],
      locality: ['']
    })
  }
  createSearchForm() {
    this.searchForm = this.formBuilder.group({
      consumer_code: [''],
      project_code: [''],
      cceld_mobileno: [''],
      cceld_address1: [''],
      cceld_firstname: [''],
      cceld_middlename: [''],
      cceld_lastname: [''],
      pmstate_name: [''],
      from_date: [''],
      to_date: [this.dateAfter2DaysFixed],
      site_surveyor: [''],
      payment_status: [''],
    })
  }
  createConsumerLeadsListForm() {
    this.consumerLeadsListForm = this.formBuilder.group({
      lead_id: [''],
      lead_fname: [''],
      lead_mname: [''],
      lead_lname: [''],
      lead_mobile: [''],
      lead_address1: [''],
      lead_address2: [''],
      from_date: [''],
      to_date: [this.toDateFixed],
      lead_status: [''],
      lead_queuestatus: [''],
      lead_lockedby: [''],
      cce_id: [''],
      cce_mobile: ['', Validators.compose([Validators.pattern(/^[7-9]{1}[0-9]{9}$/)])],
      lead_source_id: [''],
      cce_email: ['', Validators.compose([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])]
    })
  }

  enableSmartSearch() {
    this.visible = 'search-feilds';
  }
  /**
   * @description: Intilize Form for coldbucket
   */
  rejectionRemarks: any = [];
  leadsStatus: any = [];
  createColdbucketLeadProjectForm() {
    this.coldbucketLeadsProjects = this.formBuilder.group({
      lead_id: [''],
      consumer_id: [''],
      fname: [''],
      lname: [''],
      rejected_by: [''],
      mobile: [''],
      from_date: [''],
      to_date: [''],
      lead_status: [''],
      project_status: [''],
      selected_year: [date.getFullYear().toString()]
    });

    this.coldbucketLeadsProjects.get('lead_status').valueChanges.subscribe(() => {
      if (this.coldbucketLeadsProjects.controls['lead_status'].value != '') {
        this.coldbucketLeadsProjects.controls.project_status.setValue('', { onlySelf: true, emitEvent: false });
      }
    });
    this.coldbucketLeadsProjects.get('project_status').valueChanges.subscribe(() => {
      if (this.coldbucketLeadsProjects.controls['lead_status'].value != '') {
        this.coldbucketLeadsProjects.controls.lead_status.setValue('', { onlySelf: true, emitEvent: false });
      }
    });

    //fetch rejectoion remark for drop down project_status
    this.leadListService.getallRejectionRemark().subscribe((data) => {
      if (data) {
        let arrPushdata = [];
        for (let item of data) {
          arrPushdata.push({ value: String(item.rrm_id), label: String(item.rrm_text) });
        }
        this.rejectionRemarks = arrPushdata;
        this.rejectionRemarksFilter = arrPushdata;
      } else {
        this.popupMessageService.showInfo("Rejection remark cant not be fetch!", 'Info');
      }
    });

    //fetch lead status for drop down lead_status
    this.leadListService.getallLeadStatus().subscribe((data) => {
      if (data) {
        let arrPushdata = [];
        for (let item of data) {
          arrPushdata.push({ value: String(item.lead_status_id), label: String(item.lead_status_name) });
        }
        this.leadsStatus = arrPushdata;
        this.leadStatusFilter = arrPushdata;
      } else {
        this.popupMessageService.showInfo("Lead status cant not be fetch!", 'Info');
      }
    });

  }
  submitLocalitySearchForm(pass?: boolean) {
    if (this.currentSearchForm === 'LocalityMasterListing') {
      if (this.atLeastOneField(this.localityPinSearchForm.value) || pass) {
        this.sharedService.formDataSmartSearch.next(this.localityPinSearchForm.value);
        this.leadListService.getPincodeListing(1, 10, this.localityPinSearchForm.value).subscribe((data) => {
          if (data.status) {
            this.SearchResults.emit(data.data);
          } else {
            this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
          }
        });
      } else {
        this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
      }
    }
  }

  remainingCCELeadData(data) {
    // console.log(data);

    if (data.length <= 0) {
      this.cceLeadProjectStatus = [];
    } else {
      let cceLeadProjectStatusTemp = [];
      let cceLeadCityListTemp = [];
      for (let item of data) {
        if (item.fpsm_status != null) {
          cceLeadProjectStatusTemp.push(item.fpsm_status);
        }
        if (item.district_name != null) {
          cceLeadCityListTemp.push(item.district_name);
        }
      }
      var tempProjectStatus = [];
      var unique = {};
      var distinct = [];
      for (var i in cceLeadProjectStatusTemp) {
        if (typeof (unique[cceLeadProjectStatusTemp[i]]) == "undefined") {
          distinct.push(cceLeadProjectStatusTemp[i]);
        }
        unique[cceLeadProjectStatusTemp[i]] = 0;
      }

      for (let temp of this.GlobalcceLeadProjectStatus) {
        for (let temp1 of distinct) {
          if (temp1 == temp.label) {
            tempProjectStatus.push(temp);
          }
        }
      }

      var tempCityList = [];
      unique = {};
      distinct = [];
      for (var i in cceLeadCityListTemp) {
        if (typeof (unique[cceLeadCityListTemp[i]]) == "undefined") {
          distinct.push(cceLeadCityListTemp[i]);
        }
        unique[cceLeadCityListTemp[i]] = 0;
      }

      for (let temp of this.GlobalecceLeadCityListing) {
        for (let temp1 of distinct) {
          if (temp1 == temp.label) {
            tempCityList.push(temp);
          }
        }
      }

      this.cceLeadCityListing = tempCityList;
      this.cceLeadProjectStatus = tempProjectStatus;
    }
  }

  remainingSurveyorAndProjectStatus(data, surveyorIdKey?: string, surveyorNameKey?: string, projectStatusIdKey?: string, projectStatusNameKey?: string) {
    if (data.length <= 0) {
      this.siteSurveyorsList = [];
      this.projectStatusList = [];
    } else {
      let surveyorsCheckArray = [];
      let pstatusCheckArray = [];
      let arrPushSurveyor = [];
      let arrPushPstatus = [];
      for (let item of data) {
        if (surveyorIdKey) {
          if (surveyorsCheckArray.indexOf(item[surveyorIdKey]) === -1) {
            arrPushSurveyor.push({ value: String(item[surveyorIdKey]), label: String(item[surveyorNameKey]) });
            surveyorsCheckArray.push(item[surveyorIdKey]);
          }
        }
        if (projectStatusIdKey) {
          if (pstatusCheckArray.indexOf(item[projectStatusIdKey]) === -1) {
            arrPushPstatus.push({ value: String(item[projectStatusIdKey]), label: String(item[projectStatusNameKey]) });
            pstatusCheckArray.push(item[projectStatusIdKey])
          }
        }
      }
      if (surveyorIdKey) {
        this.siteSurveyorsList = arrPushSurveyor;
      }

      if (projectStatusIdKey) {
        this.projectStatusList = arrPushPstatus;
      }

    }
  }

  submitSiteSurveyorSearchForm(pass?: boolean) {
    if (this.currentSearchForm === 'sitesurveyorLeadList' || this.currentSearchForm === 'solutionDesignerLeadListing' || this.currentSearchForm === 'sitesurveyorSurveyList' || this.currentSearchForm === 'opsheadLeadListing' || this.currentSearchForm === 'sitesurveyorProjectStatusListing' || this.currentSearchForm === 'opsheadProjectStatus' || this.currentSearchForm === 'sitesurveyorClarificationListing' || this.currentSearchForm === 'surveyorRejected' || this.currentSearchForm === 'followupRejected') {
      if (this.atLeastOneField(this.searchForm.value) || pass) {
        this.sharedService.formDataSmartSearch.next(this.searchForm.value);
        if (this.currentSearchForm === 'sitesurveyorLeadList' || this.currentSearchForm === 'solutionDesignerLeadListing' || this.currentSearchForm === 'sitesurveyorSurveyList' || this.currentSearchForm === 'opsheadLeadListing') {
          this.leadListService.getLeadDetailsForEmployee(this.searchForm.value).subscribe((data) => {
            if (data.result._meta.total_records) {
              if (!pass) {
                this.remainingSurveyorAndProjectStatus(data.result.data, 'cceld_surveyerid', 'surveyor_name', 'project_state', 'pmstate_name');
              }
              this.SearchResults.emit(data.result);
            } else {
              this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
            }
          })
        } else if (this.currentSearchForm === 'sitesurveyorProjectStatusListing' || this.currentSearchForm === 'opsheadProjectStatus') {
          this.leadListService.getProjectStatusDetailsForEmployee(1, 10, this.searchForm.value).subscribe((data) => {
            if (data.result._meta.total_records) {
              if (!pass) {
                this.remainingSurveyorAndProjectStatus(data.result.extra_data, 'cceld_surveyerid', 'surveyor_name', 'project_state', 'pmstate_name');
              }
              this.SearchResults.emit(data.result);
            } else {
              this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
            }
          })
        } else if (this.currentSearchForm === 'sitesurveyorClarificationListing') {
          this.leadListService.getClarificationDetailsForEmployee(1, 10, this.searchForm.value).subscribe((data) => {
            if (data.result._meta.total_records) {
              if (!pass) {
                this.remainingSurveyorAndProjectStatus(data.result.extra_data, null, null, 'project_state', 'pmstate_name');
              }
              this.SearchResults.emit(data.result);
            } else {
              this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
            }
          })
        } else if (this.currentSearchForm === 'surveyorRejected') {
          this.leadPanelService.getSurveyorRejectedProjects(this.searchForm.value).subscribe((data) => {
            if (data.status) {
              if (!pass) {
                this.remainingSurveyorAndProjectStatus(data.data, 'cceld_surveyerid', 'surveyor_name', 'project_state', 'pmstate_name');
              }
              let tempdata = {
                "data": data.data,
                "_meta": {
                  "total_records": 0
                }
              };

              this.SearchResults.emit(tempdata);
            } else {
              this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
            }
          })
        } else if (this.currentSearchForm === 'followupRejected') {
          this.leadPanelService.getFollowupRejectedProjects(1, 10, this.searchForm.value).subscribe((data) => {
            if (data.status) {
              if (!pass) {
                //this.remainingSurveyorAndProjectStatus(data.data, 'cceld_surveyerid', 'surveyor_name', 'project_state', 'pmstate_name');
              }
              this.SearchResults.emit(data);
            } else {
              this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
            }
          })
        }
      } else {
        this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
      }
    }
  }

  submitSupplyOrderSearchForm(reset?: boolean) {
    if (this.atLeastOneField(this.searchForm.value) || reset) {
      this.sharedService.formDataSmartSearch.next(this.searchForm.value);
      this.leadListService.getSupplyOrderList(this.searchForm.value).subscribe((data) => {
        if (data.result) {
          this.SearchResults.emit(data);
        } else {
          this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
        }
      })
    } else {
      this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
    }
  }

  /**
   *
   * @description: calling service for the form submit [coldbucket leads and projects]
   * @developer: Roshan
   */
  rejectionRemarksFilter: any;
  leadsStatusFilter: any;
  selected_year_options = [
    {value: '2017', label: '2017'},
    {value: '2018', label: '2018'},
    {value: '2019', label: '2019'},
    {value: '2020', label: '2020'},
    {value: '2021', label: '2021'},
    {value: '2022', label: '2022'},
    {value: '2023', label: '2023'},
  ];
  SubmitColdbucketLeadsProjects(pass?: boolean) {
    if (this.currentSearchForm === 'coldbucketLeadsProjects') {
      this.leadPanelService.getColbucketLeadProject(1, 10, this.coldbucketLeadsProjects.value).subscribe((data) => {
        if (data.status) {
          if (!pass) {
            this.remainingColdBucketFilter(data.data, data.input);
          } else {
            //fetch rejectoion remark for drop down project_status
            this.leadListService.getallRejectionRemark().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data) {
                  arrPushdata.push({ value: String(item.rrm_id), label: String(item.rrm_text) });
                }
                this.rejectionRemarks = arrPushdata;
                this.rejectionRemarksFilter = arrPushdata;
              }
            });

            //fetch lead status for drop down lead_status
            this.leadListService.getallLeadStatus().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data) {
                  arrPushdata.push({ value: String(item.lead_status_id), label: String(item.lead_status_name) });
                }
                this.leadsStatus = arrPushdata;
                this.leadsStatusFilter = arrPushdata;
              }
            });
          }
          this.SearchResults.emit(data);
        } else {
          this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
        }
      })
    }
  }

  remainingLockedByAndLeadStatus(data, lockedbyIdKey?: string, lockedbyNameKey?: string, leadStatusIdKey?: string, leadStatusNameKey?: string, queueStatusKey?: string) {
    if (data.length <= 0) {
      this.siteSurveyorsList = [];
      this.projectStatusList = [];
    } else {
      let lockedbyCheckArray = [];
      let lstatusCheckArray = [];
      let qstatusCheckArray = [];
      let arrPushLockedby = [];
      let arrPushLstatus = [];
      let arrPushLQstatus = [];
      for (let item of data) {
        if (lockedbyIdKey && item[lockedbyIdKey]) {
          if (lockedbyCheckArray.indexOf(item[lockedbyIdKey]) === -1) {
            arrPushLockedby.push({ value: String(item[lockedbyIdKey]), label: String(item[lockedbyNameKey]) });
            lockedbyCheckArray.push(item[lockedbyIdKey]);
          }
        }
        if (leadStatusIdKey) {
          if (lstatusCheckArray.indexOf(item[leadStatusIdKey]) === -1) {
            arrPushLstatus.push({ value: String(item[leadStatusIdKey]), label: String(item[leadStatusNameKey]) });
            lstatusCheckArray.push(item[leadStatusIdKey])
          }
        }
        if (queueStatusKey) {
          if (qstatusCheckArray.indexOf(item[queueStatusKey]) === -1) {
            arrPushLQstatus.push({ value: String(item[queueStatusKey]), label: String(item[queueStatusKey]) });
            qstatusCheckArray.push(item[queueStatusKey])
          }
        }
      }
      if (lockedbyIdKey) {
        this.siteSurveyorsList = arrPushLockedby;
      }

      if (leadStatusIdKey) {
        this.leadListStatus = arrPushLstatus;
      }
      if (queueStatusKey) {
        this.lockedStatus = arrPushLQstatus;
      }

    }
  }

  submitConsumerLeadsForm(pass?: boolean) {
    if (this.currentSearchForm === 'paid' || this.currentSearchForm === 'unpaid' || this.currentSearchForm === 'cbucket' || this.currentSearchForm === 'both') {
      if (this.atLeastOneField(this.consumerLeadsListForm.value) || pass) {
        this.sharedService.formDataSmartSearch.next(this.consumerLeadsListForm.value);
        let type;
        if (this.currentSearchForm === 'paid') {
          type = this.currentSearchForm
        } else if (this.currentSearchForm === 'unpaid') {
          type = this.currentSearchForm
        } else if (this.currentSearchForm === 'cbucket') {
          type = this.currentSearchForm
        } else if (this.currentSearchForm === 'both') {
          type = this.currentSearchForm
        }
        this.leadListService.getConsumerLeadsForOps(1, 10, type, this.consumerLeadsListForm.value).subscribe((data) => {
          if (data.result._meta.total_records) {
            if (!pass) {
              this.remainingLockedByAndLeadStatus(data.result.extra_data, 'emp_id', 'emp_name', 'lead_status', 'lead_status_name', 'lead_queuestatus');
            }
            this.SearchResults.emit(data.result);
          } else {
            this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
          }
        })
      } else {
        this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
      }
    }
  }

  disableSmartSearch() {
    // this.visible = 'button';
    this.searchForm.reset();
    this.localityPinSearchForm.reset();
    this.consumerLeadsListForm.reset();
  }
  clearSmartSearch() {
    this.maxDateFrom = new Date();
    if (this.currentSearchForm == 'surveyorRejected') {
      this.maxDateFromAfter2Days = new Date();
    } else {
      this.maxDateFromAfter2Days = new Date((new Date()).getTime() + (2 * 24 * 60 * 60 * 1000));
    }
    this.searchForm.reset();
    this.localityPinSearchForm.reset();
    this.consumerLeadsListForm.reset();
    this.followUpForm.reset();
    this.coldbucketLeadsProjects.reset();
    this.submitFollowUpForm(true);
    this.submitLocalitySearchForm(true);
    this.submitSiteSurveyorSearchForm(true);
    this.submitConsumerLeadsForm(true);
    if(this.currentSearchForm != 'SspPaymentAprroval' && this.currentSearchForm != 'FinancePayment' && this.currentSearchForm != 'OpsHeadApproval' && this.currentSearchForm != 'OpsheadApprovedPayments' && this.currentSearchForm != 'SspPaymentAprroval' && this.currentSearchForm != 'FinancePayment' && this.currentSearchForm != 'CommercialApprovedPayments') {
      this.getProjectStatusList();
      this.getFollowupStatusList();
      this.createcceLeadForm();
    }
    this.getSurveyorList();

    this.getLeadListStatus();

    this.missedCallLogsSearchForm.reset();
    this.submitMissedCallLogsSearchForm(true);
    this.allLeadsProjects.reset();
    this.LeadsListingCceForm.reset();

    if (this.currentSearchForm == 'supplyOrder') {
      this.submitSupplyOrderSearchForm(true);
    }

    if (this.currentSearchForm == 'PartnerLogsSearchForm') {
      this.partnerQuerySearchForm.reset();
      //this.partnerQuerySearch();
      this.submitPartnerLogSearch();
    }

    if (this.currentSearchForm == 'PartnerQueryUser') {
      this.partnerQueryUserSearchForm.reset();
      //this.partnerUserQuerySearch();
      this.submitPartnerQuerySearch();
    }

    this.SubmitColdbucketLeadsProjects(true);

    /** CCE LEad Form Reset */
    if(this.cceLeadFormGroup) {
      this.cceLeadFormGroup.reset();
    }

    this.submitCceLeadSearchForm(true);
    /** CCE LEad Form Reset */
    if (this.currentSearchForm == "employeeMaster") {
      this.employeeMasterForm.reset();
      this.submitEmployeeMasterFrom(true);
    }

    if (this.currentSearchForm == "allLeadsProjects") {
      this.SubmitAllLeadsProjects(true);
    }

    if (this.currentSearchForm == "allLeadsProjectsAdmin") {
      this.SubmitAllLeadsProjectsAdmin(true);
    }

    if (this.currentSearchForm == 'CceLeadsList') {
      this.submitLeadsListingCceForm(true);
    }
    if (this.currentSearchForm == 'ongoing' || this.currentSearchForm == 'completed' || this.currentSearchForm == 'allocated' || this.currentSearchForm == 'assigned') {
      this.pmprojectForm.reset();
      this.submitPMSearchForm(true);
    }

    if (this.currentSearchForm == 'paymentToApprove' || this.currentSearchForm == 'paymentToApproveComplete' || this.currentSearchForm == 'ReleaseRequest' || this.currentSearchForm == 'ReleaseRequestOld' || this.currentSearchForm == 'ReleaseRequestComplete' || this.currentSearchForm == 'SspPaymentAprroval' || this.currentSearchForm == 'FinancePayment' || this.currentSearchForm == 'OpsHeadApproval') {
      this.financeSearchForm.reset();
      this.submitFianceSearchForm(true);
    }

    if (this.currentSearchForm == 'OpsheadApprovedPayments' || this.currentSearchForm == 'CommercialApprovedPayments' || this.currentSearchForm == 'FinanceApprovedPayment') {
      this.approvedFinanceSearchForm.reset();
      this.submitApprovedFianceSearchForm(true);
    }


    this.popupMessageService.showInfo("Search parameters reset successfully!", 'Info');
  }
  getProjectStatusList() {
    this.leadListService.projectStatusList().subscribe(data => {
      if (data.status) {
        this.projectStatusList = this.convertProjectStatusForSelect(data.data);
      } else {
        this.popupMessageService.showError(data.error_message, "Error!");
      }
    }, (error) => {
      this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
    })
  }
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
  getSurveyorList() {
    this.leadPanelService.getSurveyorData().subscribe((data) => {
      this.siteSurveyorsList = this.convertProjectStatusForSurveyor(data.data.emp_data);
    });
  }

  convertProjectStatusForSurveyor(listItems: any) {
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

  getSolutionDesignerList() {
    this.leadPanelService.getSurveyorData(17).subscribe((data) => {
      let tempList = data.data.emp_data;
      for (let item of tempList) {
        this.solutionDesignersList.push({ value: item.id, label: item.name });
      }
    })
  }
  getLeadListStatus() {
    this.leadListService.getLeadListStatus().subscribe((data) => {
      this.remainingLockedByAndLeadStatus(data.data, null, null, 'lead_status_id', 'lead_status_name');
    })
  }
  allStatesAndCitiesData() {
    this.leadPanelService.getAllStates().subscribe(data => {
      if (data.status) {
        this.allStates = data.data;
        this.stateList = this.convertForSelect(this.allStates, 'state');
      }
    });
    this.leadPanelService.getAllCities().subscribe(data => {
      if (data.status) {
        this.allCities = data.data;
        this.cityList = this.convertForSelect(this.allCities, 'city');
      }
    });
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
        } else if (type === 'assignedto') {
          arrPush.push({ value: String(item.id), label: String(item.name) });
        }
      }
      return arrPush;
    }
  }
  ifStateIfCity(type: String) {
    if (type == 'state') {
      this.cityList = this.getCitybyState(this.localityPinSearchForm.get("state").value);
    } else if (type == 'city') {
      this.setStatebyCity(this.localityPinSearchForm.get("district").value);
    }
  }
  ifStateIfCityPm(type: String) {
    if (type == 'state') {
      this.cityList = this.getCitybyState(this.pmprojectForm.get("state").value);
    } else if (type == 'city') {
      this.setStatebyCity(this.pmprojectForm.get("city").value);
    }
  }
  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.keyCode != 8) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  getCitybyState(state_id: number) {
    let cityList = [];
    this.localityPinSearchForm.controls['district'].setValue('');
    for (let item of this.allCities) {
      if (item.district_stateid == state_id)
        cityList.push({ value: String(item.district_id), label: String(item.district_name) });
    }
    return cityList;
  }

  setStatebyCity(city_id: number) {
    let cityStateId = this.allCities.find(x => x.district_id == city_id).district_stateid;
    if (cityStateId) {
      this.localityPinSearchForm.controls['state'].setValue(cityStateId);
    }
    let stateList = [];
    for (let item of this.allStates) {
      if (item.state_id == cityStateId) {
        stateList.push({ value: String(item.state_id), label: String(item.state_name) });
      }
    }
    return stateList;
  }

  checkDatesFrom(type?: string) {
    if (type == 'puc') {
      if (!this.toDate) {
        this.maxDateFrom = this.toDateFixed;
      } else {
        this.maxDateFrom = this.toDate;
      }
    } else {
      if (!this.dateAfter2Days) {
        this.maxDateFromAfter2Days = this.dateAfter2DaysFixed;
      } else {
        this.maxDateFromAfter2Days = this.dateAfter2Days;
      }
      this.maxDateFromAfter2Days = this.dateAfter2Days;
    }
  }

  checkDatesTo() {
    this.minDateTo = this.fromDate;
  }

  atLeastOneField(data: any) {
    let result = false;
    Object.keys(data).forEach(function (key) {
      if (data[key]) {
        result = true;
      }
    });
    return result;
  }
  createFollowUpForm() {
    this.followUpForm = this.formBuilder.group({
      project_code: [''],
      customer_firstname: [''],
      customer_lastname: [''],
      cceld_mobileno: ['', Validators.compose([Validators.pattern(/^[7-9]{1}[0-9]{9}$/)])],
      fup_call_scheduled_time: [''],
      assignedTo: [''],
      fui_new_follow_up_project_status: [''],
      flsm_status: [''],
      cceld_email: [''],
      lead_id: [''],
      city: [''],
      lead_entry_date: [''],
      remarks: [''],
      customerType: ['']
    })
  }
  submitFollowUpForm(pass?: boolean) {
    //  console.log('this.followUpForm.value',this.followUpForm.value);
    if (this.currentSearchForm === 'today' || this.currentSearchForm === 'total' || this.currentSearchForm === 'AllUsersLead') {
      if (this.atLeastOneField(this.followUpForm.value) || pass) {
        this.sharedService.formDataSmartSearch.next(this.followUpForm.value);
        let type;
        type = this.currentSearchForm;
        this.leadListService.getFollowUpListing(type, 1, 20, null, null, this.followUpForm.value).subscribe((data) => {
          if (data.error_message === 'No record found.') {
            this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
            this.SearchResults.emit('');
          } else {
            if (!pass) {
              this.remainingProjectLeadStatus(data.data, 'flsm_id', 'flsm_status', 'fpsm_id', 'fpsm_status', 'fup_assigne', 'emp_fullname');
            }
            this.SearchResults.emit(data.data);
          }
        });
      } else {
        this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
      }
    }
  }

  getFollowupStatusList() {
    this.leadStatus = [];
    this.projectStatus = [];
    this.leadListService.getStatusList().subscribe((data) => {
      for (let status of data.leadStatusData) {
        this.leadStatus.push({ value: status.flsm_id, label: status.flsm_status });
        this.leadStatus = [...this.leadStatus];
      }
      for (let status of data.projectStatusData) {
        this.projectStatus.push({ value: status.fpsm_id, label: status.fpsm_status });
        this.projectStatus = [...this.projectStatus];
        this.unchangedProjectStatus = this.projectStatus;
      }
    })
  }
  getEmployeeSkillById() {
    this.leadPanelService.getSurveyorData(55).subscribe((data) => {
      this.reassignEmployees = this.convertForSelect(data.data.emp_data, 'assignedto');
    })
  }
  remainingProjectLeadStatus(data, leadStatusKey?: string, leadStatusName?: string, projectStatusKey?: string, projectStatusNameKey?: string, serveyorKeyId?: string, serveyorKeyName?: string) {

    if (data.data <= 0) {
      this.leadStatus = [];
      this.projectStatus = [];
      this.reassignEmployees = [];
    } else {
      let leadCheckArray = [];
      let serveyorCheckArray = [];
      let pstatusCheckArray = [];
      let arrPushLead = [];
      let arrPushPstatus = [];
      let arrPushServeyor = [];
      for (let item of data.data) {
        if (leadStatusKey) {
          if (leadCheckArray.indexOf(item[leadStatusKey]) === -1) {
            arrPushLead.push({ value: String(item[leadStatusKey]), label: String(item[leadStatusName]) });
            leadCheckArray.push(item[leadStatusKey]);
          }
        }
        if (projectStatusKey) {
          if (pstatusCheckArray.indexOf(item[projectStatusKey]) === -1) {
            arrPushPstatus.push({ value: String(item[projectStatusKey]), label: String(item[projectStatusNameKey]) });
            pstatusCheckArray.push(item[projectStatusKey]);
          }
        }
        if (serveyorKeyId) {
          if (serveyorCheckArray.indexOf(item[serveyorKeyId]) === -1) {
            arrPushServeyor.push({ value: String(item[serveyorKeyId]), label: String(item[serveyorKeyName]) });
            serveyorCheckArray.push(item[serveyorKeyId]);
          }
        }
      }
      if (leadStatusKey) {
        // this.leadStatus = arrPushLead;
      }

      if (projectStatusKey) {
        // this.projectStatus = arrPushPstatus;
      }
      if (serveyorKeyId) {
        // this.reassignEmployees=arrPushServeyor;
      }
    }
  }

  existing_type: any = [{ value: '1', label: 'Exists' }, { value: '0', label: 'New' }];
  departmentList: any = [
    { value: 'If you want to avail free telephonic consultation', label: 'If you want to avail free telephonic consultation' },
    { value: 'If you want to know more about solar power', label: 'If you want to know more about solar power' },
    { value: 'If you want to go for a paid visit by our solar expert', label: 'If you want to go for a paid visit by our solar expert' },
  ];
  createMissedCallLogsSearchForm() {
    this.missedCallLogsSearchForm = this.formBuilder.group({
      customer_number: [''],
      from_date: [''],
      to_date: [''],
      //url: [''],
      //agent_number:[''],
      existingtype: [''],
      department: [''],
    })
  }
  submitMissedCallLogsSearchForm(pass?: boolean) {
    if (this.currentSearchForm === 'missedCallLogsSearchForm') {
      if (this.atLeastOneField(this.missedCallLogsSearchForm.value) || pass) {
        this.sharedService.formDataSmartSearch.next(this.missedCallLogsSearchForm.value);

        this.leadListService.getMissedCallLogs('list', 1, 10, this.missedCallLogsSearchForm.value).subscribe((data) => {
          if (data.error_message === 'No record found') {
            this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
          } else {
            this.SearchResults.emit(data.result);
          }
        });
      } else {
        this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
      }
    }
  }


  /**
   * @description: Intilize Form for All Lead and Projects
   */

  allLeadsProjects: FormGroup;
  projectStates: any;
  projectEmplist: any;
  leadEmplist: any;
  createAllLeadProjectForm() {
    this.allLeadsProjects = this.formBuilder.group({
      lead_id: [''],
      project_id: [''],
      consumer_id: [''],
      fname: [''],
      lname: [''],
      mobile: [''],
      source: [''],
      lead_updated_by: [''],
      project_created_by: [''],
      lead_status: [''],
      project_status: [''],
      from_date: [''],
      to_date: ['']
    });
    //this.sourceList = globals.SOURCE_LIST;
    this.leadListService.GetLeadsList().subscribe(response => {
      if (response.status == 1) {
        for (let status of response.data.data) {
          this.sourceList.push({ value: status.source_master_id, label: status.source_master_name });
          this.sourceList = [...this.sourceList];
        }
      }
    });

    this.allLeadsProjects.get('lead_status').valueChanges.subscribe(() => {
      if (this.allLeadsProjects.controls['lead_status'].value != '') {
        this.allLeadsProjects.controls.project_status.setValue('', { onlySelf: true, emitEvent: false });
      }
    });
    this.allLeadsProjects.get('project_status').valueChanges.subscribe(() => {
      if (this.allLeadsProjects.controls['project_status'].value != '') {
        this.allLeadsProjects.controls.lead_status.setValue('', { onlySelf: true, emitEvent: false });
      }
    });

    //fetch rejectoion remark for drop down project_status
    this.leadPanelService.getProjectStatus().subscribe((data) => {
      if (data) {
        let arrPushdata = [];
        for (let item of data) {
          arrPushdata.push({ value: String(item.pmstate_id), label: String(item.pmstate_name) });
        }
        this.projectStates = arrPushdata;
        this.projectStatusFilter = arrPushdata;
      } else {
        this.popupMessageService.showInfo("Project Status cant not be fetch!", 'Info');
      }
    });

    //fetch lead status for drop down lead_status
    this.leadPanelService.getLeadStatus().subscribe((data) => {
      if (data) {
        let arrPushdata = [];
        for (let item of data) {
          arrPushdata.push({ value: String(item.lead_status_id), label: String(item.lead_status_name) });
        }
        this.leadsStatus = arrPushdata;
        this.leadStatusFilter = arrPushdata;
      } else {
        this.popupMessageService.showInfo("Lead status cant not be fetch!", 'Info');
      }
    });

    //Fetch Employee Data
    this.leadPanelService.getAllEmployeeList().subscribe((data) => {
      let employee = [];
      if (data.data) {
        for (let item of data.data.emp_data) {
          employee.push({ value: String(item.id), label: String(item.name) });
        }
        this.projectEmplist = employee;
        this.projEmployeeFilter = employee;

        this.leadEmplist = employee;
        this.leadEmployeeFilter = employee;
      }
    });

  }



  /**
   *
   * @description: calling service for the form submit [All leads and projects]
   * @developer: Roshan
   */
  projectStatusFilter: any;
  leadStatusFilter: any;
  projEmployeeFilter: any;
  leadEmployeeFilter: any;
  SubmitAllLeadsProjects(pass?: boolean) {
    if (this.currentSearchForm === 'allLeadsProjects') {
      this.sharedService.formDataSmartSearch.next(this.allLeadsProjects.value);
      this.projectStatusFilter = [];
      this.leadStatusFilter = [];
      this.projEmployeeFilter = [];
      this.leadEmployeeFilter = [];
      this.leadPanelService.getAllLeads(1, 10, this.allLeadsProjects.value).subscribe((dataAllLeads) => {
        if (dataAllLeads.status) {
          //console.log(pass,'pass');
          if (!pass) {
            this.remainingProjetcAndLead(dataAllLeads.data);
          } else {
            this.allLeadsProjects.get('lead_status').valueChanges.subscribe(() => {
              if (this.allLeadsProjects.controls['lead_status'].value != '') {
                this.allLeadsProjects.controls.project_status.setValue('', { onlySelf: true, emitEvent: false });
              }
            });
            this.allLeadsProjects.get('project_status').valueChanges.subscribe(() => {
              if (this.allLeadsProjects.controls['project_status'].value != '') {
                this.allLeadsProjects.controls.lead_status.setValue('', { onlySelf: true, emitEvent: false });
              }
            });

            //fetch rejectoion remark for drop down project_status
            this.leadPanelService.getProjectStatus().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data) {
                  arrPushdata.push({ value: String(item.pmstate_id), label: String(item.pmstate_name) });
                }
                this.projectStates = arrPushdata;
                this.projectStatusFilter = arrPushdata;
              } else {
                this.popupMessageService.showInfo("Project Status cant not be fetch!", 'Info');
              }
            });

            //fetch lead status for drop down lead_status
            this.leadPanelService.getLeadStatus().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data) {
                  arrPushdata.push({ value: String(item.lead_status_id), label: String(item.lead_status_name) });
                }
                this.leadsStatus = arrPushdata;
                this.leadStatusFilter = arrPushdata;
              } else {
                this.popupMessageService.showInfo("Lead status cant not be fetch!", 'Info');
              }
            });

            //Fetch Employee Data
            this.leadPanelService.getAllEmployeeList().subscribe((data) => {
              let employee = [];
              if (data.data) {
                for (let item of data.data.emp_data) {
                  employee.push({ value: String(item.id), label: String(item.name) });
                }
                this.projectEmplist = employee;
                this.projEmployeeFilter = employee;

                this.leadEmplist = employee;
                this.leadEmployeeFilter = employee;
              }
            });

            //this.sourceList = globals.SOURCE_LIST;
            this.leadListService.GetLeadsList().subscribe(response => {
              if (response.status == 1) {
                for (let status of response.data.data) {
                  this.sourceList.push({ value: status.source_master_id, label: status.source_master_name });
                  this.sourceList = [...this.sourceList];
                }
              }
            });
          }
        } else {
          this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
        }
        // console.log(data+ "Smart Search");

        this.SearchResults.emit(dataAllLeads);
      })
    }
  }

  SubmitAllLeadsProjectsAdmin(pass?: boolean) {
    if (this.currentSearchForm === 'allLeadsProjectsAdmin') {
      this.sharedService.formDataSmartSearch.next(this.allLeadsProjects.value);
      this.projectStatusFilter = [];
      this.leadStatusFilter = [];
      this.projEmployeeFilter = [];
      this.leadEmployeeFilter = [];
      this.leadPanelService.getAllLeadsAdmin(1, 10, this.allLeadsProjects.value).subscribe((dataAllLeads) => {
        if (dataAllLeads.status) {
          //console.log(pass,'pass');
          if (!pass) {
            this.remainingProjetcAndLead(dataAllLeads.data);
          } else {
            this.allLeadsProjects.get('lead_status').valueChanges.subscribe(() => {
              if (this.allLeadsProjects.controls['lead_status'].value != '') {
                this.allLeadsProjects.controls.project_status.setValue('', { onlySelf: true, emitEvent: false });
              }
            });
            this.allLeadsProjects.get('project_status').valueChanges.subscribe(() => {
              if (this.allLeadsProjects.controls['project_status'].value != '') {
                this.allLeadsProjects.controls.lead_status.setValue('', { onlySelf: true, emitEvent: false });
              }
            });

            //fetch rejectoion remark for drop down project_status
            this.leadPanelService.getProjectStatus().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data) {
                  arrPushdata.push({ value: String(item.pmstate_id), label: String(item.pmstate_name) });
                }
                this.projectStates = arrPushdata;
                this.projectStatusFilter = arrPushdata;
              } else {
                this.popupMessageService.showInfo("Project Status cant not be fetch!", 'Info');
              }
            });

            //fetch lead status for drop down lead_status
            this.leadPanelService.getLeadStatus().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data) {
                  arrPushdata.push({ value: String(item.lead_status_id), label: String(item.lead_status_name) });
                }
                this.leadsStatus = arrPushdata;
                this.leadStatusFilter = arrPushdata;
              } else {
                this.popupMessageService.showInfo("Lead status cant not be fetch!", 'Info');
              }
            });

            //Fetch Employee Data
            this.leadPanelService.getAllEmployeeList().subscribe((data) => {
              let employee = [];
              if (data.data) {
                for (let item of data.data.emp_data) {
                  employee.push({ value: String(item.id), label: String(item.name) });
                }
                this.projectEmplist = employee;
                this.projEmployeeFilter = employee;

                this.leadEmplist = employee;
                this.leadEmployeeFilter = employee;
              }
            });

            //this.sourceList = globals.SOURCE_LIST;
            this.leadListService.GetLeadsList().subscribe(response => {
              if (response.status == 1) {
                for (let status of response.data.data) {
                  this.sourceList.push({ value: status.source_master_id, label: status.source_master_name });
                  this.sourceList = [...this.sourceList];
                }
              }
            });
          }
        } else {
          this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
        }
        // console.log(data+ "Smart Search");

        this.SearchResults.emit(dataAllLeads);
      })
    }
  }

  remainingProjetcAndLead(data) {

    if (data.length <= 0) {
      this.sourceList = [];
      this.leadsStatus = [];
      this.projectStates = [];
    } else {
      let leadStatusArray = this.leadsStatus;
      let projectStatusArray = this.projectStates;
      let projectEmpArray = this.projectEmplist;
      let leadEmpArray = this.leadEmplist;
      //console.log(projectStatusArray);

      let sourceListArray = globals.SOURCE_LIST;

      let sourceArr = [];
      let sourceIndex = [];

      let leadStausList = [];
      let leadIndex = [];

      let projectStausList = [];
      let projectIndex = [];

      let projectEmployee = [];
      let projectEmpIndex = [];

      let leadEmployee = [];
      let leadEmpIndex = [];

      //console.log(data);
      data.forEach(list => {
        if (list.source) {
          sourceListArray.forEach(element => {
            if (element.value == list.source && sourceIndex.indexOf(element.value) < 0) {
              sourceArr.push(element);
              sourceIndex.push(element.value);
            }
          });
        }
        if (list.lead_status_id) {
          //console.log(leadStatusArray);
          leadStatusArray.forEach(element => {
            if (element.value == list.lead_status_id && leadIndex.indexOf(element.value) < 0) {
              leadStausList.push(element);
              leadIndex.push(element.value);
            }
          });
        }
        if (list.pmstate_id) {
          // console.log(list.pmstate_id);
          projectStatusArray.forEach(element => {
            if (element.value == list.pmstate_id && projectIndex.indexOf(element.value) < 0) {
              // console.log(element.value ,'==', list.pmstate_id);
              projectStausList.push(element);
              projectIndex.push(element.value);
            }
          });
        }

        if (list.emp_project_id) {
          projectEmpArray.forEach(element => {
            if (element.value == list.emp_project_id && projectEmpIndex.indexOf(element.value) < 0) {
              projectEmployee.push(element);
              projectEmpIndex.push(element.value);
            }
          });
        }

        if (list.emp_lead_id) {
          leadEmpArray.forEach(element => {
            if (element.value == list.emp_lead_id && leadEmpIndex.indexOf(element.value) < 0) {
              leadEmployee.push(element);
              leadEmpIndex.push(element.value);
            }
          });
        }

      });
      this.sourceList = sourceArr;
      this.leadStatusFilter = leadStausList;
      this.projectStatusFilter = projectStausList;
      this.projEmployeeFilter = projectEmployee;
      this.leadEmployeeFilter = leadEmployee;
    }
  }

  remainingColdBucketFilter(data, input) {
    if (data.length <= 0) {
      this.rejectionRemarks = [];
      this.leadsStatus = [];
    } else {
      let RejectionList = this.rejectionRemarks;
      let leadstatusList = this.leadsStatus;

      let rejectionArr = [];
      let RejectionListIndex = [];

      let leadStatusArr = [];
      let leadStatusIndex = [];
      data.forEach(list => {
        if (list.rejected_id && list.project_id != null) {
          RejectionList.forEach(element => {
            if (element.value == list.rejected_id && RejectionListIndex.indexOf(element.value) < 0) {
              rejectionArr.push(element);
              RejectionListIndex.push(element.value);
            }
          });
        }

        if (list.rejected_id && list.project_id == null) {
          leadstatusList.forEach(element => {
            if (element.value == list.rejected_id && leadStatusIndex.indexOf(element.value) < 0) {
              leadStatusArr.push(element);
              leadStatusIndex.push(element.value);
            }
          });
        }

      });
      this.rejectionRemarksFilter = rejectionArr;
      this.leadsStatusFilter = leadStatusArr;
    }
  }


  /**
   *
   * @description: Below function gets all the cce leads
   * @developer: Vaibhav.agarwal1@kelltontech.com
   */

  cceLeadFormGroup: FormGroup;
  cceLeadCityListing: any;
  GlobalecceLeadCityListing: any;
  GlobalcceLeadProjectStatus: any;
  cceLeadProjectStatus: any;
  createcceLeadForm() {
    this.cceLeadFormGroup = this.formBuilder.group({
      project_code: [''],
      city: [''],
      proposal_status: [''],
      survey_status: [''],
      project_status: [''],
      cce_email: ['']
    });

    //fetch cities listing for the dropdown
    this.leadPanelService.getAllCities().subscribe((data) => {
      if (data) {
        let arrPushdata = [];
        for (let item of data.data) {
          arrPushdata.push({ value: String(item.district_id), label: String(item.district_name) });
        }
        this.cceLeadCityListing = arrPushdata;
        this.GlobalecceLeadCityListing = arrPushdata;
      } else {
        this.popupMessageService.showInfo("Cities List cant not be fetch!", 'Info');
      }
    });

    //fetch cities listing for the dropdown
    this.leadListService.getStatusList().subscribe((data) => {
      if (data) {
        let arrPushdata = [];
        for (let item of data.projectStatusData) {
          arrPushdata.push({ value: String(item.fpsm_id), label: String(item.fpsm_status) });
        }
        this.GlobalcceLeadProjectStatus = arrPushdata;
        this.cceLeadProjectStatus = arrPushdata;
      } else {
        this.popupMessageService.showInfo("Project Lsiting cant not be fetch!", 'Info');
      }
    });


    // this.allLeadsProjects.get('lead_status').valueChanges.subscribe(()=>{
    //   if (this.allLeadsProjects.controls['lead_status'].value != '') {
    //     this.allLeadsProjects.controls.project_status.setValue('',{onlySelf: true, emitEvent: false});
    //  }
    // });
    // this.allLeadsProjects.get('project_status').valueChanges.subscribe(()=>{
    //   if (this.allLeadsProjects.controls['project_status'].value != '') {
    //     this.allLeadsProjects.controls.lead_status.setValue('',{onlySelf: true, emitEvent: false});
    //  }
    // });



    // //fetch lead status for drop down lead_status
    // this.leadPanelService.getLeadStatus().subscribe((data)=> {
    //   if(data){
    //     let arrPushdata = [];
    //     for(let item of data){
    //       arrPushdata.push({ value: String(item.lead_status_id), label: String(item.lead_status_name) });
    //     }
    //     this.leadsStatus= arrPushdata;
    //   } else {
    //     this.popupMessageService.showInfo("Lead status cant not be fetch!", 'Info');
    //   }
    // });

    // //Fetch Employee Data
    // this.leadPanelService.getEmployeeList().subscribe((data)=>{
    //   let employee = [];
    //   if(data.data){
    //     for (let item of data.data.emp_data) {
    //       employee.push({ value: String(item.id), label: String(item.name) });
    //     }
    //     this.employeeList = employee;
    //   }
    // });

  }


  submitCceLeadSearchForm(pass?: boolean) {
    if (this.currentSearchForm === 'cceleadlisting') {
      this.sharedService.formDataSmartSearch.next(this.cceLeadFormGroup.value);
      this.leadListService.getAllCCELeadsData(1, 10, this.cceLeadFormGroup.value).subscribe((data) => {
        if (data.status) {
          //console.log(pass);
          if (!pass) {
            this.remainingCCELeadData(data.result.data);
          } else {
            this.leadPanelService.getAllCities().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data.data) {
                  arrPushdata.push({ value: String(item.district_id), label: String(item.district_name) });
                }
                this.cceLeadCityListing = arrPushdata;

              } else {
                this.popupMessageService.showInfo("Cities List cant not be fetch!", 'Info');
              }
            });

            //fetch cities listing for the dropdown
            this.leadListService.getStatusList().subscribe((data) => {
              if (data) {
                let arrPushdata = [];
                for (let item of data.projectStatusData) {
                  arrPushdata.push({ value: String(item.fpsm_id), label: String(item.fpsm_status) });
                }
                this.cceLeadProjectStatus = arrPushdata;
                this.GlobalcceLeadProjectStatus = arrPushdata;
              } else {
                this.popupMessageService.showInfo("Project Lsiting cant not be fetch!", 'Info');
              }
            });
          }

          this.SearchResults.emit(data.result);


        } else {
          let data = {
            "data": [],
            "_meta": {
              "total_records": 0
            }
          };
          this.SearchResults.emit(data);
          this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
        }
      })
    }
  }

  partnerQuerySearchForm: FormGroup;
  partnerQuerySearch() {
    this.partnerQuerySearchForm = this.formBuilder.group({
      partner_mobile: [''],
      partner_name: [''],
      status: [''],
    });
  }

  partnerQueryUserSearchForm: FormGroup;
  partnerUserQuerySearch() {
    this.partnerQueryUserSearchForm = this.formBuilder.group({
      partner_mobile: [''],
      partner_name: [''],
      status: [''],
    });
  }


  submitPartnerLogSearch(pass?: boolean) {

    this.sharedService.formDataSmartSearch.next(this.partnerQuerySearchForm.value);
    this.leadListService.getPartnerQuery(1, 10, this.partnerQuerySearchForm.value).subscribe((data) => {
      if (data.status) {
        if (!pass) {
          //this.remainingSurveyorAndProjectStatus(data.data, 'cceld_surveyerid', 'surveyor_name', 'project_state', 'pmstate_name');
        }
        this.SearchResults.emit(data);
      } else {
        this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
      }
    });
  }

  submitPartnerQuerySearch(pass?: boolean) {
    let type = this.sharedService.partnerListType.value;
    this.sharedService.formDataSmartSearch.next(this.partnerQueryUserSearchForm.value);
    this.leadListService.getPartnerQueryUser(1, 10, this.partnerQueryUserSearchForm.value, type).subscribe((data) => {
      if (data.status) {
        if (!pass) {
          //this.remainingSurveyorAndProjectStatus(data.data, 'cceld_surveyerid', 'surveyor_name', 'project_state', 'pmstate_name');
        }

        this.SearchResults.emit(data);
      } else {
        this.popupMessageService.showInfo("Search parameter doesn't match to any record!", 'Info');
      }
    });
  }

  employeeMasterForm: FormGroup;
  createEmployeeMasterForm() {
    this.employeeMasterForm = this.formBuilder.group({
      emp_name: [''],
      emp_lname: [''],
      emp_email: [''],
      emp_mobile: [''],
    });
  }

  submitEmployeeMasterFrom(pass: any) {
    this.sharedService.formDataSmartSearch.next(this.employeeMasterForm.value);
    if (this.atLeastOneField(this.employeeMasterForm.value) || pass) {
      this.leadListService.getEmployeeList('list', null, 1, 10, this.employeeMasterForm.value).subscribe((data) => {
        this.SearchResults.emit(data);
      });
    } else {
      this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
    }
  }

  LeadsListingCceForm: FormGroup;
  createLeadsListingCceForm() {
    this.LeadsListingCceForm = this.formBuilder.group({
      lead_id: [''],
      lead_name: [''],
      lead_mobile: [''],
      source: [''],
      lead_date: ['']
    });
  }

  submitLeadsListingCceForm(pass: any) {
    this.sharedService.formDataSmartSearch.next(this.LeadsListingCceForm.value);
    if (this.atLeastOneField(this.LeadsListingCceForm.value) || pass) {
      this.leadListService.getLeadsListing(1, 25, this.LeadsListingCceForm.value).subscribe((data) => {
        this.SearchResults.emit(data);
      });
    } else {
      this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
    }
  }
  pmprojectForm: FormGroup;
  createProjectmanagerSearchForm() {
    this.pmprojectForm = this.formBuilder.group({
      project_code: [''],
      fname: [''],
      lname: [''],
      mobile: [''],
      order_type: [''],
      site_surveyor: [''],
      city: [''],
      state: [''],
      project_manager: [''],
      grid_type: ['']
    })
  }
  submitPMSearchForm(pass: any) {
    this.sharedService.formDataSmartSearch.next(this.pmprojectForm.value);
    if (this.atLeastOneField(this.pmprojectForm.value) || pass) {
      let view = 'list';
      if (this.view_type == 'pm_view') {
        view = 'view-only';
      }
      this.leadListService.getProjectsListing(1, 10, this.project_type, this.pmprojectForm.value, '', view).subscribe((data) => {
        this.SearchResults.emit(data);
      });
    } else {
      this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
    }
  }
  clearPMSmartSearch() {
    //console.log(this.project_type);
  }
  getpmListArray() {
    //24 for pm
    this.leadListService.getEmployeeDataByRole(29).subscribe(data => {
      if (data.status) {
        let PmListArr = [];
        if (data.data.length <= 0) {
          this.pmlist = [];
        } else {
          for (let item of data.data) {
            PmListArr.push({ value: String(item.emp_id), label: String(item.emp_firstname) });
          }
          this.pmlist = PmListArr;
        }
      }
    });
  }

  financeSearchForm: FormGroup;
  createFinaceUserSearchForm() {
    this.financeSearchForm = this.formBuilder.group({
      project_code: [''],
      fname: [''],
      lname: [''],
      grid_type: [''],
      partner: [''],
      approval_date_from: [''],
      approval_date_to: [''],
      status: ['']
    })
  }

  approvedFinanceSearchForm: FormGroup;
  createApprovedFinaceUserSearchForm() {
    this.approvedFinanceSearchForm = this.formBuilder.group({
      project_code: [''],
      name: [''],
      grid_type: [''],
      partner: [''],
      approval_date_from: [''],
      approval_date_to: [''],
      type: []
    })
  }

  submitFianceSearchForm(pass: any) {
    let type = '';
    switch (this.currentSearchForm) {
      case 'paymentToApprove':
        type = "PA";
        break;
      case 'paymentToApproveComplete':
        type = "PA_COMPLETE";
        break;
      case 'ReleaseRequest':
        type = "PR";
        break;
      case 'ReleaseRequestComplete':
        type = "PR_COMPLETE";
        break;
      case 'ReleaseRequestOld':
        type = "PR_OLD";
        break;
    }

    this.sharedService.formDataSmartSearch.next(this.financeSearchForm.value);
    if (this.atLeastOneField(this.financeSearchForm.value) || pass) {
      if (this.currentSearchForm == 'SspPaymentAprroval') {
        this.leadListService.getSspPaymentApproval(1, 10, type, this.financeSearchForm.value, '', 'SA', true).subscribe(data => {
          this.SearchResults.emit(data);
        });
      }
      else if (this.currentSearchForm == 'FinancePayment') {
        this.leadListService.getSspPaymentApproval(1, 10, type, this.financeSearchForm.value, '', 'FD', true).subscribe(data => {
          this.SearchResults.emit(data);
        });
      }
      else if (this.currentSearchForm == 'OpsHeadApproval') {
        this.leadListService.getSspPaymentApproval(1, 10, type, this.financeSearchForm.value, '', 'OH', true).subscribe(data => {
          this.SearchResults.emit(data);
        });
      }
      else {
        if(this.legacy) {
          console.log("legacy");

          this.leadListService.getPaymentApproveList(1, 10, type, this.financeSearchForm.value).subscribe(data => {
            this.SearchResults.emit(data);
          });
        } else {
          this.leadListService.getPaymentApproveListNew(1, 10, type, this.financeSearchForm.value).subscribe(data => {
            this.SearchResults.emit(data);
          });
        }

      }

    } else {
      this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
    }
  }

  submitApprovedFianceSearchForm(pass: any) {
    if (this.currentSearchForm == 'OpsheadApprovedPayments') {
      this.approvedFinanceSearchForm.controls.type.patchValue(1);
    }
    if (this.currentSearchForm == 'CommercialApprovedPayments') {
      this.approvedFinanceSearchForm.controls.type.patchValue(2);
    }
    if (this.currentSearchForm == 'FinanceApprovedPayment') {
      this.approvedFinanceSearchForm.controls.type.patchValue(3);
    }
    this.sharedService.formDataSmartSearch.next(this.approvedFinanceSearchForm.value);
    if (this.atLeastOneField(this.approvedFinanceSearchForm.value) || pass) {
    this.leadListService.getApprovedPaymentHistory('1', 20,this.approvedFinanceSearchForm.value).subscribe(data => {
      this.SearchResults.emit(data);
    });

    } else {
      this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
    }
  }

  getpartnerListArray() {
    this.leadListService
      .getEmployeeDataByRole(24)
      .subscribe(
        data => {
          if (data.status) {
            for (let item of data.data) {
              // if (item.psm_is_reopen_or_rejected != 1){
              this.partnerList.push({
                value: String(item.emp_id),
                label: String(item.emp_firstname)
              });
              // }
            }
          }
        }
      );
  }

  setSelectedYear(event) {
    console.log(event);
    console.log(typeof event);
    console.log(event.getFullYear().toString());
    const year = event.getFullYear().toString()
    this.coldbucketLeadsProjects.controls.selected_year.patchValue(year)
   
  }

}
