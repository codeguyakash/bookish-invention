import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { PopupMessageService } from './../../message/services/message.service';
import { LeadPanelService } from '../../customer-care/services/lead-panel.service';
import { Subscription } from 'rxjs/Subscription';
import { LeadListService } from '../services/lead-list.service';
import { BUILDING_TYPE } from '../../../static/static';
import * as globals from '../../../static/static';
import { map } from 'rxjs/operators';
import { SharedServices } from '../../../services/shared.services';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { DatePipe } from '@angular/common';
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';
import { retry } from 'rxjs/operator/retry';
import { on } from 'process';
import { ActivatedRoute, Router } from '@angular/router';
import { parseTwoDigitYear } from 'ngx-bootstrap/chronos/units/year';
// import { $ } from 'protractor';
declare var $: any;

@Component({
  selector: 'followup',
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.css']
})
export class FollowupComponent implements OnInit {

  oneDayAhed: any = new Date(new Date().setDate(new Date().getDate() + 1));
  hour: number = new Date().getHours();
  solutionType: any = [
    { value: 'off_grid', label: 'Off Grid(Back-up)' },
    { value: 'on_grid', label: 'On Grid(Grid Tie)' },
    { value: 'none', label: 'Not-Feasible' },
  ];
  buildingType: any = [];
  actionLoaderCustomerDetails: string = '';
  actionLoader: string = '';
  actionLoaderSMS: string = '';
  actionLoaderEmail: string = '';

  isSubmittedCustomerDetails: boolean = false;
  openDeleteConfirmation: Boolean = false;
  emp_id: Number;
  fup_id: Number;
  primaryRoleId: Number;
  searchFlag: Boolean = false;
  customerName: String;
  customerEmail: any;
  customerNumber: Number;
  isSubmittedInteraction: Boolean = false;
  customerDetailsForm: FormGroup;
  customerDetails: Boolean = false;
  noRecords: Boolean;
  showHistory: String;
  // initialListing: Boolean = true;
  // funnelListing: Boolean = false;
  initialListing: Boolean = false;
  funnelListing: Boolean = true;
  followUpListingLength;
  followUpListingNonActionLength;
  isNonActionable;
  subscription: Subscription;
  allStates: any;
  allCities: any;
  cityList: any;
  stateList: any;
  SearchForm: FormGroup;
  followUpListing: any;
  totalRecordsNonAction: any;
  followUpListingNonAction: any;
  pageCountNonAction: any;
  cust_interactionListing: any;
  iscust_interactionListing;
  itemPerPage: number = 10;
  pages: number = 1;
  pagesNonAction: number = 1;
  totalItem: any;
  paginationSubmitForm: FormGroup;
  paginationSubmitFormNonAction: FormGroup
  customerInteractionForm: FormGroup;
  customerNotificationForm: FormGroup;
  unchangedProjectStatus: any = [];
  pageCount: any;
  followUpType: String;
  totalRecords: number;
  reassignEmployees: any = [];
  reassignEmployee: any = [];
  projectStatusList = [];
  minDate: Date = this.hour >= 18 ? this.oneDayAhed : new Date();
  leadStatus: any = [];
  projectStatus: any = [];
  searchOptions: any = [];
  searchType: String = 'input';
  searchPlaceholder: String;
  interactionDate: any;
  fui_id: number;
  rejectionStatus: any = [];
  showPagination: Boolean;
  wrongTime: Boolean = false;
  userData: any;
  isSubmittedSearch: Boolean = false;
  proposalHistoryData: any;
  baseurl: String;
  showSmartSearchComponent: Boolean = false;
  followupSmsEmail: any = [];
  followUpForm: FormGroup;
  expected_closure: any;
  partner: any;
  datePipeString: any;
  //isOpsHeadOrSupervisor1: Boolean = false;
  searchFilters: any = [
    { value: 'project_id', label: 'Project ID' },
    { value: 'lead_status', label: 'Lead Status' },
    { value: 'cceld_mobileno', label: 'Mobile No.' },
    { value: 'project_status', label: 'Project Status' },
    { value: 'customer_firstname', label: 'Firstname' },
    { value: 'customer_lastname', label: 'Lastname' },
  ];
  project_from: any;
  isSiteSurveyLead: boolean = false;
  newSurveyTime: any;
  surveyTime: Array<any> = [
    { value: '1', label: '10:00-12:00' },
    { value: '2', label: '12:00-14:00' },
    { value: '3', label: '14:00-16:00' },
    { value: '4', label: '16:00-18:00' },
  ];
  currentDate:any= new Date();

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

  Date: number;
  fup_project_from: any;
  public previewMessagePopUp = false;
  public smsContentPopUp: string;
  public emailContentPopUp: string;
  loader: boolean;
  cceld_id: any;
  cceld_sitetype: any;
  cceld_rooftype: any;
  proposal_dc_capacity: any;
  estimated_dc_capacity: any;
  expectedClosureDate = new Date();
  cceld_address1;
  cceld_email;
  cceld_avgelectricitybill;
  cceld_buildingtype;
  recordInteractionProjectStatus;
  proposal_created_on;
  fui_remarks_id: any;
  customerInteractionState;
  customerInteractionCity;
  customerInteractionGridType;
  exportDurationFormFroup;
  dashboardFormFroup;
  notfilterdata=true;
  value:any;
  public fValue: any;
  selectedMonthYear: Date;
  selectedYear: string;
  monthSelectedValue = "";
  yearSelectedValue = "";
  selectedSSCount: number;

  constructor(
    public formBuilder: FormBuilder,
    public consumerServices: LeadPanelService,
    public leadListService: LeadListService,
    public popupMessageService: PopupMessageService,
    public sharedServices: SharedServices,
    public datepipe: DatePipe,
    public router: Router,
    public route: ActivatedRoute,
   
  ) {
  }

  ngOnInit() {
    this.baseurl = globals.API_BASE_URL;
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.primaryRoleId = this.userData.primary_role_id;
    this.emp_id = this.userData.emp_id;
    this.createCustomerNotificationForm();
    this.createCustomerDetailsForm();
    this.createCustomerInteractionForm();
    this.createPaginationSubmitForm();
    this.allStatesAndCitiesData();
    this.getProjectStatusList();
    this.createExportDurationFormGroup();
    this.createFollowUpForm();
    // this.getFollowupListing('today');
    if(localStorage.getItem('isNewTabOpened') === 'true') {
      this.getFollowupListingNewTab('AllUsersLead')
    } else {
      this.getFollowupListing('dashbaordList');
    }
    this.getEmployeeSkillById();
    this.getFollowupStatusList();
    this.createSearchForm();
    this.getfollowupSmsEmailList();
    this.buildingType = BUILDING_TYPE;
    //this.checkOpsheadOrCcsuperVisor1();
    this.value = new Date();
    this.getpartnerListArray();
    // this.sharedServices.searchForm.next('today');
  }

  opsHeadFilters() {
    if (this.primaryRoleId != 17) {
      this.leadStatus = this.leadStatus.filter(status => status.value !== "5");
    }
  }

  createExportDurationFormGroup() {
    let days = 7;
    let date = new Date();
    let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    this.exportDurationFormFroup = this.formBuilder.group({
      startDate: [last, Validators.compose([Validators.required])],
      endDate: [new Date(), Validators.compose([Validators.required])],
      report_name:[Validators.compose([Validators.required])]
    })
    this.dashboardFormFroup = this.formBuilder.group({
      month:'',
      year:''
    })


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
      lead_id:[''],
      city: [''],
      lead_entry_date: [''],
      remarks: [''],
      customerType: [''],
      surveyor:['']
    })
  }

  submitFollowUpForm() {
    if (this.atLeastOneField(this.followUpForm.value)) {
      this.pages = 1;
      this.pagesNonAction = 1;
      this.getFollowupListing(this.followUpType);
    }
    else {
      this.popupMessageService.showError("Enter search parameters atleast in one field.", "Error!");
    }

  }

  clearSmartSearch() {
    if (this.atLeastOneField(this.followUpForm.value)) {
      this.followUpForm.reset();
      this.pages = 1;
      this.pagesNonAction = 1;
      this.getFollowupListing(this.followUpType);
    }
  }

  atLeastOneField(data: any) {
    let result = false;
    Object.keys(data).forEach((value) => {
      if (data[value]) {
        result = true;
      }
    })
    return result;
  }

  public siteServyList: any;
  public ssCount: any;
  public ssCountName: any;
  public ssList: any;
  public dropDownList: any;
  public filterValue: any;

  getFollowupListing(type: String, listType?: any) {
    this.noRecords = false;
    this.isSubmittedSearch = false;
    this.followUpType = type;
    this.showSmartSearchComponent = true;
    if (type != "dashbaordList") {
      //this.checkOpsheadOrCcsuperVisor1();
      this.loader = true;
      this.sharedServices.searchForm.next(type.toString());
      if (this.searchFlag === true) {
        this.SearchForm.reset();
      }
      this.leadListService.getFollowUpListing(type, this.pages, this.itemPerPage, '', '', this.followUpForm.value, '', listType).subscribe((data) => {
        this.loader = false;
        this.followUpType = type;
        if (data.error_message === 'No record found.') {
          this.followUpListingLength = 0;
          this.followUpListingNonActionLength = 0;
          this.showPagination = false;
          return;
        }
        this.totalRecords = data.data._meta.total_records;
        this.pageCount = data.data._meta.total_pages;
        this.totalRecordsNonAction = data.data._nonactionablemeta.total_records;
        this.pageCountNonAction = data.data._nonactionablemeta.total_pages;
        this.createPaginationSubmitForm();
        this.followUpListing = data.data.data;
        this.followUpListingNonAction = data.data.nonactionabledata;
        if (this.followUpListing) {
          this.followUpListingLength = this.followUpListing.length;
        }
        if (this.followUpListingNonAction) {
          this.followUpListingNonActionLength = this.followUpListingNonAction.length;
        }
        this.noRecords = false;
        this.searchFlag = false;
        if (this.totalRecords > 10) {
          this.showPagination = true;
        }
      })
    } else {
      this.ssCount = [{ "id": 1, "name": "Count(Nos)" },
      { "id": 2, "name": "Capacity(kWp)" },
      { "id": 3, "name": "Project Value(₹ Lakhs)" }]
      this.ssCountName = this.ssCount[0]["name"];
      let type = this.ssCount[0]["id"];
      this.dashboardScreen(type);
    }
  }

  getFollowupListingNewTab(type: String, listType?: any) {    
    this.noRecords = false;
    this.isSubmittedSearch = false;
    this.followUpType = type;
    this.showSmartSearchComponent = true;
    if (type != "dashbaordList") {
     // this.checkOpsheadOrCcsuperVisor1();
      this.loader = true;
      this.sharedServices.searchForm.next(type.toString());
      if (this.searchFlag === true) {
        this.SearchForm.reset();
      }

      let filterData = JSON.parse(localStorage.getItem('newLeadTabFilterData'));
      this.followUpForm.controls.flsm_status.patchValue(filterData.flsmStatus);
      this.followUpForm.controls.surveyor.patchValue(filterData.surveyor);

      let data = JSON.parse(localStorage.getItem('newLeadTabData'));
      this.loader = false;
        this.followUpType = type;
        
        
        if (data.error_message === 'No record found.') {
          this.followUpListingLength = 0;
          this.followUpListingNonActionLength = 0;
          this.showPagination = false;
          return;
        }
        this.totalRecords = data.data._meta.total_records;
        this.pageCount = data.data._meta.total_pages;
        this.totalRecordsNonAction = data.data._nonactionablemeta.total_records;
        this.pageCountNonAction = data.data._nonactionablemeta.total_pages;
        this.createPaginationSubmitForm();
        this.followUpListing = data.data.data;
        this.followUpListingNonAction = data.data.nonactionabledata;
        if (this.followUpListing) {
          this.followUpListingLength = this.followUpListing.length;
        }
        if (this.followUpListingNonAction) {
          this.followUpListingNonActionLength = this.followUpListingNonAction.length;
        }
        this.noRecords = false;
        this.searchFlag = false;
        if (this.totalRecords > 10) {
          this.showPagination = true;
        }
    } else {
      this.ssCount = [{ "id": 1, "name": "Count(Nos)" },
      { "id": 2, "name": "Capacity(kWp)" },
      { "id": 3, "name": "Project Value(₹)" }]
      this.ssCountName = this.ssCount[0]["name"];
      let type = this.ssCount[0]["id"];
      this.dashboardScreen(type);
    }
    localStorage.removeItem('isNewTabOpened');
    localStorage.removeItem('newLeadTabData');
    localStorage.removeItem('newLeadTabFilterData');
  }


  getSSData(funnalStatus, data) {
    switch (funnalStatus) {
      case "1":
        return {
          key: "s0",
          calculateData: data
        }
      case "2":
        return {
          key: "s1",
          calculateData: data
        }
      case "3":
        return {
          key: "s2",
          calculateData: data
        }
      case "6":
        return {
          key: "s3",
          calculateData: data
        }
      case "7":
        return {
          key: "s4",
          calculateData: data
        }
      case "5":
        return {
          key: "s5",
          calculateData: data
        }
      default:
        return funnalStatus;
    }
  }
  overallobj={
    surveyor: "Total",
    s0: 0,
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0,
    total: 0
  };
  dashboardScreen(type,monthyear=null) {
    this.leadListService.dashboardData(type,monthyear).subscribe((res) => {
      if (res.status == 1 && res.data.length > 0) {
        let modifyData = [];
        let originalData = res.data;
        this.overallobj={
          surveyor: "Total",
          s0: 0,
          s1: 0,
          s2: 0,
          s3: 0,
          s4: 0,
          s5: 0,
          total: 0
        };
        for (let i = 0; i < originalData.length; i++) {
          let index = modifyData.findIndex(item => item.project_surveyor === originalData[i].project_surveyor);
          if (index === -1) {
            if (Number(originalData[i].fup_lead_status) != 4 && Number(originalData[i].fup_lead_status) !=8) {
              let mData = this.getSSData(originalData[i].fup_lead_status, originalData[i].calculated_data);
              this.overallobj[mData.key] = this.overallobj[mData.key] + Number(mData.calculateData);
              modifyData.push({
                ...originalData[i], [mData.key]: mData.calculateData,
                total: Number(mData.calculateData)
              })
              this.overallobj["total"] = this.overallobj["total"] + Number(mData.calculateData)
            }
          }
          else {
            if (Number(originalData[i].fup_lead_status) !=8 && Number(originalData[i].fup_lead_status) !=4) {
              let mData1 = this.getSSData(originalData[i].fup_lead_status, originalData[i].calculated_data);
              this.overallobj[mData1.key] = this.overallobj[mData1.key] + Number(mData1.calculateData);
              let newData = {
                ...modifyData[index], [mData1.key]: mData1.calculateData,
                total: modifyData[index].total + Number(mData1.calculateData)
              }
              this.overallobj["total"] = this.overallobj["total"] + Number(mData1.calculateData);
              modifyData[index] = newData
            }
          }
        
        }
        this.siteServyList = modifyData;
      } else {
        this.siteServyList = [];
      }
      this.ssList = this.siteServyList;
      this.dropDownList = this.siteServyList.filter(item => item.surveyor != "Overall");
      if (this.filterValue) {
        this.selectSSName(this.filterValue, this.siteServyList)
      }
    });
  }
 
  selectSSName(value, data) {
    this.filterValue = value
    if (value) {
      this.siteServyList = data.filter(item => item.surveyor == value);
      this.notfilterdata=false;
    } else {
      this.siteServyList = data;
      this.notfilterdata=true;
    }
  }

  selectSSCount(value) {
    this.selectedSSCount = parseInt(value);
    if(this.dashboardFormFroup.value.year && this.dashboardFormFroup.value.month) {
      let date = new Date();
      date.setFullYear(this.dashboardFormFroup.value.year);
      date.setMonth(this.dashboardFormFroup.value.month - 1);
      this.selectedMonthYear = date;
      var monthyear=this.dashboardFormFroup.value.year+'-'+this.dashboardFormFroup.value.month;
    } else if(this.dashboardFormFroup.value.year && !this.dashboardFormFroup.value.month){
      var monthyear: string = this.dashboardFormFroup.value.year;
      this.selectedMonthYear = null;
    }
    else {
      var monthyear = "";
      this.selectedMonthYear = null;
    }
    this.dashboardScreen(parseInt(value),monthyear);
  }

  submitDashboard() {
      if(this.dashboardFormFroup.value.year && this.dashboardFormFroup.value.month) {
        let date = new Date();
        date.setFullYear(this.dashboardFormFroup.value.year);
        date.setMonth(this.dashboardFormFroup.value.month - 1);
        this.selectedMonthYear = date;
        this.selectedYear = null;
        var monthyear=this.dashboardFormFroup.value.year+'-'+this.dashboardFormFroup.value.month;
      } else if(this.dashboardFormFroup.value.year && !this.dashboardFormFroup.value.month){
        var monthyear: string = this.dashboardFormFroup.value.year;
        this.selectedYear = monthyear;
        this.selectedMonthYear = null;
      } else if(!this.dashboardFormFroup.value.year && this.dashboardFormFroup.value.month) {
        this.dashboardFormFroup.controls.month.patchValue("");
      }
      else {
        var monthyear = "";
        this.selectedMonthYear = null;
        this.selectedYear = null;
      }
      
      // this.ssCount = [
      //   { "id": 1, "name": "Count(Nos)" },
      //   { "id": 2, "name": "Capacity(kWp)" },
      //   { "id": 3, "name": "Project Value(₹ Lakhs)"}
      // ]
     //this.ssCountName = this.ssCount[0]["name"];
     //let type = this.ssCount[0]["id"];
     let type = (this.selectedSSCount)?this.selectedSSCount:1;
     this.dashboardScreen(type,monthyear);
 }

 setLifetimeMonth() { 
  if(this.dashboardFormFroup.controls.month.value == "") {
    this.dashboardFormFroup.controls.year.patchValue("");
  }
  
 }

 setLifetimeYear() {
 if(this.dashboardFormFroup.controls.year.value == "") {
   this.dashboardFormFroup.controls.month.patchValue("");
 }
 
}

  submitDb(event, flsmStatus?, surveyor?, value?) {
    
      let formValue = this.followUpForm.value;
      formValue.flsm_status = flsmStatus;
      formValue.surveyor = surveyor;
      
      
      this.leadListService.getFollowUpListing(this.followUpType, this.pages, this.itemPerPage, '', '', this.followUpForm.value, '', '').subscribe((res) => {
      
      if(res.status) {
        let newLeadTabFilterData = {
          flsmStatus: flsmStatus,
          surveyor: surveyor
        }

        localStorage.setItem('isNewTabOpened', 'true');
        localStorage.setItem('newLeadTabData', JSON.stringify(res));
        localStorage.setItem('newLeadTabFilterData', JSON.stringify(newLeadTabFilterData));        
  
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/employee-panel/follow-up'])
          );
          this.leadListService.isNewTab = true;
          window.open(url, '_blank');
      }
      
      });
    
    
    // let data = {};
    // if (event.target.id.includes(',')) {
    //   var segments = event.target.id.split(',');
    //   if(segments[1] == "ssName"){
    //     data = {
    //       "surveyor": segments[0]
    //     }
    //   }else{
    //   data = {
    //     "surveyor": segments[0],
    //     "flsm_status": segments[1]
    //   }
    // }
    // } else {
    //   data = { "flsm_status": event.target.id }
    // }
    // localStorage.setItem('state', JSON.stringify(data))
    // const url = this.router.serializeUrl(
    // this.router.createUrlTree(['/employee-panel/follow-up'])
    // );
    // this.leadListService.isNewTab = true;
    // window.open(url + '?newTab=true', '_blank');
  }

  showContactHistory() {
    this.showHistory = 'contact';
  }
  showProposalHistory() {
    this.showHistory = 'proposal';
  }
  getFollowupStatusList(filter: any = null) {
    this.leadListService.getStatusList().subscribe((data) => {
      this.leadStatus = [];
      for (let status of data.leadStatusData) {
        this.leadStatus.push({ value: status.flsm_id, label: status.flsm_status });
        this.leadStatus = [...this.leadStatus];
      }

      this.projectStatus = [];
      this.unchangedProjectStatus = [];
      for (let status of data.projectStatusData) {
        this.projectStatus.push({ value: status.fpsm_id, label: status.fpsm_status });
        this.projectStatus = [...this.projectStatus];
        this.unchangedProjectStatus = this.projectStatus;
      }
      this.rejectionStatus = [];
      for (let status of data.rejectionStatusData) {
        this.rejectionStatus.push({ value: status.rrm_id, label: status.rrm_text });
      }
      if (this.fup_project_from == 1) {
        this.project_from = 'Site Surveyor';
        this.isSiteSurveyLead = true;
        // this.leadStatus = this.leadStatus.filter(status => status.value !== "5");
      } else {
        this.projectStatus = this.projectStatus.filter(status => status.value !== "6");
        if (this.proposalHistoryData) {
          this.projectStatus = this.projectStatus.filter(status => status.value !== "7");
        }
        this.project_from = 'Solution Designer';
        this.isSiteSurveyLead = false;
      }

    })
  }
  getEmployeeSkillById() {
    this.consumerServices.getSurveyorData(55).subscribe((data) => {
      this.reassignEmployee = this.convertForSelect(data.data.emp_data, 'assignedto');
      for (let item of data.data.emp_data) {
        this.reassignEmployees.push({ value: item.id, label: item.name });
      }
    })
  }
  cutomerInteractionListing(fup_id) {
    this.leadListService.getInteractionListingFollowup(fup_id).subscribe((data) => {
      if (data.status === 1) {
        this.userData = JSON.parse(localStorage.getItem('userData'))
        this.fui_id = data.data.new_fui_data.fui_id;
        this.customerInteractionForm.controls.fui_lead_new_status.setValue(data.data.new_fui_data.fui_current_lead_status);
        this.customerInteractionForm.controls.fui_new_follow_up_project_status.setValue(data.data.new_fui_data.fui_current_follow_up_project_status);
        this.customerInteractionForm.controls.fui_id.setValue(this.fui_id);
        this.customerInteractionForm.controls.fui_new_assigne.setValue(this.userData.emp_id);
        this.customerInteractionForm.controls.fup_partner.setValue(this.partner);
        this.customerInteractionForm.controls.estimated_dc_capacity.setValue(this.estimated_dc_capacity);
        if(data.data.new_fui_data.fui_this_call_scheduled_at){
          this.customerInteractionForm.controls.fui_next_call_scheduled_at.setValue(new Date(data.data.new_fui_data.fui_this_call_scheduled_at));
           }
           if (this.datePipeString) {
          this.customerInteractionForm.get('expected_closure')
            .setValue(this.datePipeString);
          // .setValue(data.data.fui_history_data[0].expected_closure.trim().substring(0,10).replace(/-/g,'/'));
        }
        if((this.customerInteractionForm.value.fui_lead_new_status != 5) && this.datePipeString && (this.datePipeString < this.datepipe.transform(this.currentDate, 'yyyy/MM/dd'))){
          this.popupMessageService.showError("Expected Closure date cannot be in past", 'error');
        }
        this.cust_interactionListing = data.data.fui_history_data;
        if (this.cust_interactionListing) {
          this.iscust_interactionListing = this.cust_interactionListing.length;
        }
        if (data.data.fui_history_data[0].followUpInteractions.fui_remarks_id) {
          this.fui_remarks_id = data.data.fui_history_data[0].followUpInteractions.fui_remarks_id;
        }
        this.customerInteractionForm.get('fui_remarks_id')
          .setValue(this.fui_remarks_id);
      } else {
        this.cust_interactionListing = '';
        this.iscust_interactionListing = 0;
      }
    })
  }

  viewCustomerDetails(customerDetails, isNonActionable) {
   this.isNonActionable = isNonActionable;
    this.showHistory = 'contact';
    //this.opsHeadFilters();
    this.interactionDate = '';
    this.wrongTime = false;
    this.isSubmittedInteraction = false;
    this.isSubmittedCustomerDetails = false;
    this.customerInteractionForm.reset();
    // this.value = new Date();
    this.fup_id = customerDetails.fup_id;
    this.fup_project_from = customerDetails.fup_project_from;
    this.proposalHistory(customerDetails.fup_project_id);
    this.getFollowupStatusList(true);
    this.expected_closure = customerDetails.expected_closure;
    this.partner = customerDetails.fup_partner;
    
    // this.datePipeString=this.datepipe.transform(this.expected_closure,'dd/MM/yyyy');
    this.datePipeString = this.datepipe.transform(this.expected_closure, 'yyyy/MM/dd');
    this.cutomerInteractionListing(customerDetails.fup_id);
   
    this.cceld_id = customerDetails.cceld_id;
    this.customerName = customerDetails.customer_name;
    this.customerNumber = customerDetails.cceld_mobileno_full;
    this.customerEmail = customerDetails.cceld_email;
    this.cceld_sitetype = customerDetails.cceld_sitetype;
    this.cceld_rooftype = customerDetails.sf_type_of_roof;
    this.proposal_dc_capacity = (customerDetails.proposal_dc_capacity / 1000);
    this.estimated_dc_capacity = customerDetails.estimated_dc_capacity;
    this.cceld_address1 = customerDetails.cceld_address1;
    this.cceld_email = customerDetails.cceld_email;
    this.cceld_avgelectricitybill = customerDetails.cceld_avgelectricitybill;
    this.cceld_buildingtype = customerDetails.cceld_buildingtype;
    this.proposal_created_on = customerDetails.proposal_created_on;
    if (customerDetails.cceld_state > 0) {
      this.customerInteractionState = this.stateList[customerDetails.cceld_state - 1].label;
    }
    else {
      this.customerInteractionState = '';
    }
    if (customerDetails.cceld_city) {
      this.customerInteractionCity = customerDetails.cceld_city;
      //  this.customerInteractionCity=this.cityList[customerDetails.cceld_city-1].label;
    }
    else {
      this.customerInteractionCity = ''
    }
    if (customerDetails.pmstate_name) {
      this.recordInteractionProjectStatus = customerDetails.pmstate_name.split(' ').map(val => val[0].toUpperCase() + val.slice(1)).join(' ');
    }
    if (customerDetails.cceld_ongridoffgrid) {
      if (customerDetails.cceld_ongridoffgrid == 'off_grid') {
        this.customerInteractionGridType = 'Off Grid(Back-up)';
      }
      if (customerDetails.cceld_ongridoffgrid == 'on_grid') {
        this.customerInteractionGridType = 'On Grid(Grid Tie)';
      }
      if (customerDetails.cceld_ongridoffgrid == 'hybrid') {
        this.customerInteractionGridType = 'Hybrid';
      }
      if (customerDetails.cceld_ongridoffgrid == 'none') {
        this.customerInteractionGridType = 'Not-Feasible';
      }
    }
    this.customerDetailsForm.patchValue({
      cceld_id: customerDetails.cceld_id,
      cceld_city: customerDetails.cceld_city,
      cceld_state: customerDetails.cceld_state,
      cceld_roofarea: customerDetails.cceld_roofarea,
      cceld_ongridoffgrid: customerDetails.cceld_ongridoffgrid,
      cceld_alternatecntctno: customerDetails.cceld_alternatecntctno,
      // fui_remarks_id:customerDetails.fui_remarks_id
    })

    this.customerDetails = true;
    this.initialListing = false;
    this.funnelListing = false;
    this.createProejctContact(customerDetails.fup_project_id);//create project form 
    this.getProjectContacts(customerDetails.fup_project_id); //get contact list
  }

  // filterFollowup(fup_project_from) {
  //   this.fup_project_from = fup_project_from;
  //   this.getFollowupStatusList(true);
  // }

  createCustomerInteractionForm() {
    this.customerInteractionForm = this.formBuilder.group({
      fui_conversation: ['', Validators.compose([Validators.required])],
      fui_new_assigne: ['', Validators.compose([Validators.required])],
      fui_lead_new_status: [''],
      fui_remarks_id: [''],
      fui_new_follow_up_project_status: ['', Validators.compose([Validators.required])],
      fui_next_call_scheduled_at: ['', Validators.compose([Validators.required])],
      time: [''],
      fui_id: ['', Validators.compose([Validators.required])],
      fui_is_submited: [''],
      fui_fup_id: [''],
      fui_updated_by: [''],
      cceld_id: [''],
      cceld_scheduledate: [''],
      cceld_scheduletime: [''],
      expected_closure: ['', Validators.compose([Validators.required])],
      estimated_dc_capacity: ['', this.estimatedDcCapicityValidation],
      fup_partner:['']
    })
  }
  estimatedDcCapicityValidation(control: AbstractControl) {
    return control.value && isNaN(control.value) ? { validationNumber: true } : null;
  }
  createCustomerNotificationForm() {
    this.customerNotificationForm = this.formBuilder.group({
      type: [''],
      mobile: [''],
      email: [''],
      fui_id: [''],
      customer_name: [''],
      text: [''],
      contact_id: ['']
    })
  }
  createCustomerDetailsForm() {
    this.customerDetailsForm = this.formBuilder.group({
      cceld_id: ['', Validators.compose([Validators.required])],
      cceld_address1: ['', Validators.compose([Validators.required])],
      cceld_city: ['', Validators.compose([Validators.required])],
      cceld_state: ['', Validators.compose([Validators.required])],
      cceld_email: ['', Validators.compose([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      cceld_avgelectricitybill: ['', Validators.compose([Validators.required])],
      cceld_roofarea: [''],
      cceld_ongridoffgrid: [''],
      cceld_buildingtype: [''],
      cceld_alternatecntctno: ['', Validators.compose([Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
    })
  }
  createPaginationSubmitForm() {
    this.paginationSubmitForm = this.formBuilder.group({
      page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
    });
    this.paginationSubmitFormNonAction = this.formBuilder.group({
      page_number: [this.pagesNonAction, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCountNonAction)])]
    })
  }
  createSearchForm() {
    this.SearchForm = this.formBuilder.group({
      type: ['', Validators.compose([Validators.required])],
      search: ['', Validators.compose([Validators.required])],
    })
  }
  projectStatusSubmit(event) {
    if (event.value == 5) {
      this.openDeleteConfirmation = true;
    }
  }



  submitCustomerDetailsForm() {
    this.customerEmail = this.customerDetailsForm.value.cceld_email;
    this.actionLoaderCustomerDetails = 'update_customer_details_loader';
    this.isSubmittedCustomerDetails = true;
    let formData = JSON.stringify(this.customerDetailsForm.value);
    if (this.customerDetailsForm.valid) {
      this.leadListService.updateCustomerDetailsFromLeadData(formData).subscribe((data) => {
        if (data.status === 1) {
          this.actionLoaderCustomerDetails = '';
          this.popupMessageService.showSuccess('Customer Details updated successfully!!', 'success');
        } else {
          this.actionLoaderCustomerDetails = '';
          this.popupMessageService.showError(data.error_message, 'error');
        }
      })
    } else {
      Object.keys(this.customerDetailsForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.customerDetailsForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      this.popupMessageService.showError('Form Invalid!', 'error');
      this.actionLoaderCustomerDetails = '';
    }
  }
  submitCustomerinteractionForm(submit?: String) {
    this.pages = 1;
    this.pagesNonAction = 1;
    this.openDeleteConfirmation = false;
    //console.log(this.datePipeString,'gunjan');
    if(this.customerInteractionForm.value.fui_lead_new_status != '5' && this.datepipe.transform(this.customerInteractionForm.value.expected_closure, 'yyyy/MM/dd') < this.datepipe.transform(this.currentDate, 'yyyy/MM/dd')){
      this.popupMessageService.showError("Expected Closure date cannot be in past", 'error');
      return false;
    }
    if (this.customerInteractionForm.value.fui_lead_new_status === '4') {
      this.putValidations();

    }
    else if (this.customerInteractionForm.value.fui_lead_new_status === '5') {
      this.clearvalidations_advance_recieve();
    }
    else {
      this.clearValidations();
    }
    this.customerInteractionForm.controls.cceld_id.setValue(this.cceld_id);
    this.customerInteractionForm.controls.fui_fup_id.setValue(this.fup_id);
    this.customerInteractionForm.controls.fui_updated_by.setValue(this.emp_id);
    // this.leadListService.updateFollowUpInteraction(this.customerInteractionForm.value).subscribe((data) => {
    //   if(data.status === 1){
    //   }
    // })

    if (submit === 'submit') {
      this.actionLoader = 'customer_interaction_loader';
      this.isSubmittedInteraction = true;
      if (this.customerInteractionForm.valid) {
        this.customerInteractionForm.value.fui_next_call_scheduled_at = this.datepipe.transform(this.customerInteractionForm.value.time, 'dd/MM/yyyy HH:mm:ss');
        this.customerInteractionForm.controls.fui_is_submited.setValue(1);
        this.leadListService.updateFollowUpInteraction(this.customerInteractionForm.value).subscribe((data) => {
          this.openDeleteConfirmation = false;
          if (data.status === 1) {
            // this.viewListing();
            this.funnelSystem();
            this.popupMessageService.showSuccess('Interaction Submitted successfully', 'success');
            this.actionLoader = '';
          } else {
            this.popupMessageService.showError(data.error_message, 'error');
            this.actionLoader = '';
          }
        })
      } else {
        Object.keys(this.customerInteractionForm.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.customerInteractionForm.get(key).errors;
          if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
        this.popupMessageService.showError('Form Invalid!', 'error');
        this.actionLoader = '';
      }
    }
  }
  submitCustomerNotification(notificationType: String) {
    if (notificationType === 'sms') {
      this.actionLoaderSMS = 'send_sms_notification_loader';
      this.customerNotificationForm.controls.type.setValue(notificationType);
    } else if (notificationType === 'email') {
      this.actionLoaderEmail = 'send_email_notification_loader';
      this.customerNotificationForm.controls.type.setValue(notificationType);
    }
    this.customerNotificationForm.controls.fui_id.setValue(this.fui_id);
    this.customerNotificationForm.controls.mobile.setValue(this.customerNumber);
    this.customerNotificationForm.controls.customer_name.setValue(this.customerName);
    this.customerNotificationForm.controls.email.setValue(this.customerEmail);
    this.leadListService.customerEmailSmsNotification(this.customerNotificationForm.value).subscribe((data => {
      if (data.status === 1) {
        this.actionLoaderEmail = '';
        this.actionLoaderSMS = '';
        this.popupMessageService.showSuccess('Notification sent', 'success!')
      } else {
        this.actionLoaderEmail = '';
        this.actionLoaderSMS = '';
        this.popupMessageService.showError(data.error_message, 'error!')
      }
    }))
  }
  submitSearch() {
    this.isSubmittedSearch = true;
    let type = this.SearchForm.value.type;
    let search = this.SearchForm.value.search;
    this.searchFlag = true;
    if (this.SearchForm.valid) {
      this.leadListService.getFollowUpListing(this.followUpType, this.pages, this.itemPerPage, type, search).subscribe((data) => {
        this.isSubmittedSearch = false;
        if (data.status === 0) {
          this.showPagination = false;
          this.noRecords = true;
          this.followUpListing = [];
        } else {
          this.totalRecords = data.data._meta.total_records;
          this.followUpListing = data.data.data;
          this.totalRecordsNonAction = data.data._nonactionablemeta.total_records;
          this.followUpListingNonAction = data.data.nonactionabledata;
          this.noRecords = false;
          if (this.totalRecords > 10) {
            this.showPagination = true;
          } else {
            this.showPagination = false;
          }
        }
      })
    }
    // this.SearchForm.reset();
  }
  pageSubmit(listType) {
    let type;
    if (this.followUpType === 'today') {
      type = 'today';
    } else if (this.followUpType === 'total') {
      type = 'total';
    } else if (this.followUpType === 'dashbaordList') {
      type = 'dashbaordList';
    } else {
      type = 'AllUsersLead';
    }
    this.pages = this.paginationSubmitForm.controls.page_number.value;
    this.pagesNonAction = this.paginationSubmitFormNonAction.controls.page_number.value;
    if (listType == "A") {
      if (this.paginationSubmitForm.valid) {
        this.getFollowupListing(type, listType);
      }
    } else {
      if (this.paginationSubmitFormNonAction.valid) {
        this.pages = this.paginationSubmitFormNonAction.controls.page_number.value;
        this.getFollowupListing(type, listType);
      }
    }
  }
  viewListing() {
    this.projectStatus = this.unchangedProjectStatus;
    this.getFollowupListing('today');
    this.customerDetails = false;
    this.initialListing = true;
    this.funnelListing = false;
  }

  funnelSystem() {
    this.projectStatus = this.unchangedProjectStatus;
    this.getFollowupListing('AllUsersLead');
    // $('#filtertab').hide();
    // $('#funnelTab').show();
    this.customerDetails = false;
    this.initialListing = false;
    this.funnelListing = true;
  }

  allStatesAndCitiesData() {
    this.subscription = this.consumerServices.getAllStates().subscribe(data => {
      if (data.status) {
        this.allStates = data.data;
        this.stateList = this.convertForSelect(this.allStates, 'state');
      }
    });
    this.subscription = this.consumerServices.getAllCities().subscribe(data => {
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
      this.cityList = this.getCitybyState(this.customerDetailsForm.get("cceld_state").value);
    } else if (type == 'city') {
      this.setStatebyCity(this.customerDetailsForm.get("cceld_city").value);
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
    this.customerDetailsForm.controls['cceld_city'].setValue('');
    for (let item of this.allCities) {
      if (item.district_stateid == state_id)
        cityList.push({ value: String(item.district_id), label: String(item.district_name) });
    }
    return cityList;
  }

  setStatebyCity(city_id: number) {
    let cityStateId = this.allCities.find(x => x.district_id == city_id).district_stateid;
    if (cityStateId) {
      this.customerDetailsForm.controls['cceld_state'].setValue(cityStateId);
    }
    let stateList = [];
    for (let item of this.allStates) {
      if (item.state_id == cityStateId) {
        stateList.push({ value: String(item.state_id), label: String(item.state_name) });
      }
    }
    return stateList;
  }

  //clear validation for record interaction in case of advance received
  clearvalidations_advance_recieve() {
    const fui_remarks_id = this.customerInteractionForm.get('fui_remarks_id');
    fui_remarks_id.clearValidators();
    fui_remarks_id.updateValueAndValidity();

    const fui_new_assigne = this.customerInteractionForm.get('fui_new_assigne');
    fui_new_assigne.clearValidators();
    fui_new_assigne.updateValueAndValidity();

    const fui_next_call_scheduled_at = this.customerInteractionForm.get('fui_next_call_scheduled_at');
    fui_next_call_scheduled_at.clearValidators();
    fui_next_call_scheduled_at.updateValueAndValidity();

    const cceld_scheduledate = this.customerInteractionForm.get('cceld_scheduledate');
    cceld_scheduledate.clearValidators();
    cceld_scheduledate.updateValueAndValidity();

    const cceld_scheduletime = this.customerInteractionForm.get('cceld_scheduletime');
    cceld_scheduletime.clearValidators();
    cceld_scheduletime.updateValueAndValidity();

    const time = this.customerInteractionForm.get('time');
    time.clearValidators();
    time.updateValueAndValidity();

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

  putValidations() {
    const fui_remarks_id = this.customerInteractionForm.get('fui_remarks_id');
    fui_remarks_id.setValidators([Validators.required]);
    fui_remarks_id.updateValueAndValidity();

    const fui_new_assigne = this.customerInteractionForm.get('fui_new_assigne');
    fui_new_assigne.clearValidators();
    fui_new_assigne.updateValueAndValidity();

    const fui_next_call_scheduled_at = this.customerInteractionForm.get('fui_next_call_scheduled_at');
    fui_next_call_scheduled_at.clearValidators();
    fui_next_call_scheduled_at.updateValueAndValidity();

    // const cceld_scheduledate = this.customerInteractionForm.get('cceld_scheduledate');
    // cceld_scheduledate.clearValidators();
    // cceld_scheduledate.updateValueAndValidity();

    // const cceld_scheduletime = this.customerInteractionForm.get('cceld_scheduletime');
    // cceld_scheduletime.clearValidators();
    // cceld_scheduletime.updateValueAndValidity();

    const time = this.customerInteractionForm.get('time');
    time.clearValidators();
    time.updateValueAndValidity();
  }

  clearValidations() {
    const fui_remarks_id = this.customerInteractionForm.get('fui_remarks_id');
    fui_remarks_id.clearValidators();
    fui_remarks_id.updateValueAndValidity();

    const fui_new_assigne = this.customerInteractionForm.get('fui_new_assigne');
    fui_new_assigne.setValidators([Validators.required]);
    fui_new_assigne.updateValueAndValidity();

  }

  validations_sitesurvey() {
    const fui_remarks_id = this.customerInteractionForm.get('fui_remarks_id');
    fui_remarks_id.clearValidators();
    fui_remarks_id.updateValueAndValidity();

    const fui_new_assigne = this.customerInteractionForm.get('fui_new_assigne');
    fui_new_assigne.setValidators([Validators.required]);
    fui_new_assigne.updateValueAndValidity();

    // const cceld_scheduledate = this.customerInteractionForm.get('cceld_scheduledate');
    // cceld_scheduledate.setValidators([Validators.required]);
    // cceld_scheduledate.updateValueAndValidity();

    // const cceld_scheduletime = this.customerInteractionForm.get('cceld_scheduletime');
    // cceld_scheduletime.setValidators([Validators.required]);
    // cceld_scheduletime.updateValueAndValidity();

    const fui_next_call_scheduled_at = this.customerInteractionForm.get('fui_next_call_scheduled_at');
    fui_next_call_scheduled_at.clearValidators();
    fui_next_call_scheduled_at.updateValueAndValidity();

    const time = this.customerInteractionForm.get('time');
    time.clearValidators();
    time.updateValueAndValidity();
    const cceld_id = this.customerInteractionForm.get('cceld_id');
    cceld_id.setValue(this.customerDetailsForm.get('cceld_id').value);
    cceld_id.updateValueAndValidity();
  }
  cancel() {
    this.customerInteractionForm.controls.fui_new_follow_up_project_status.setValue('');
    this.openDeleteConfirmation = false;
    this.openContactDeleteConfirmation = false;
  }
  CheckSearchFilter() {
    //this.opsHeadFilters();
    if (this.SearchForm.value.type === 'lead_status') {
      this.searchType = 'select';
      this.searchOptions = this.leadStatus;
      this.searchPlaceholder = 'Enter Lead Status';
    } else if (this.SearchForm.value.type === 'project_status') {
      this.searchOptions = this.projectStatus;
      this.searchType = 'select';
      this.searchPlaceholder = 'Enter Project Status';
    } else {
      this.searchType = 'input';
    }
  }
  proposalHistory(pId: number) {
    this.leadListService.getProposalHistory(pId).subscribe(data => {
      if (data.status) {
        this.proposalHistoryData = data.data.proposal_data;
        this.projectStatus = this.projectStatus.filter(status => status.value !== "7");
      } else {
        this.proposalHistoryData = '';
        //console.log(data.error_message);
      }
    }, (error) => {
      console.log("error in fetching proposal records");
    });
  }

  currentSearchTab: String;
  smartSearchFormData: any;
  smartSearchResult(event) {
    if (event) {
      this.pages = 1;
      this.totalRecords = event._meta.total_records;
      this.pageCount = Math.ceil(this.totalRecords / this.itemPerPage);
      this.totalRecordsNonAction = event._nonactionablemeta.total_records;
      this.pageCountNonAction = event._nonactionablemeta.total_pages;
      this.createPaginationSubmitForm();
      this.sharedServices.formDataSmartSearch.subscribe((data) => {
        this.smartSearchFormData = data;
      })
      this.sharedServices.searchForm.subscribe((data) => {
        this.currentSearchTab = data;
      })
      this.followUpListing = event.data;
      this.followUpListingNonAction = event.nonactionabledata;
      if (this.followUpListing) {
        this.followUpListingLength = this.followUpListing.length;
      }
      if (this.followUpListingNonAction) {
        this.followUpListingNonActionLength = this.followUpListingNonAction.length;
      }
      this.noRecords = false;
      this.searchFlag = false;
      if (this.totalRecords > 10) {
        this.showPagination = true;
      } else {
        this.showPagination = false;
      }

    }
    else {
      this.followUpListingLength = 0;
      this.followUpListingNonActionLength = 0;
      this.loader = false;
      this.showPagination = false;
    }

  }
  getfollowupSmsEmailList() {
    this.leadListService.followUpSmsEmailGet('list', null, 1, 4).subscribe((data) => {
      if (data.status) {
        this.followupSmsEmail = this.convertForSelectForFollowupSmsEmail(data.data.data, 'followupsmsemailtype');
      }
    });
  }
  convertForSelectForFollowupSmsEmail(listItems: any, type?: any) {
    if (listItems.length <= 0) {
      return [];
    } else {
      let arrPush = [];
      if (type == 'followupsmsemailtype') {
        for (let item of listItems) {
          if (item.pstatus_checkliststatus != 1) {
            arrPush.push({
              value: String(item.fues_id),
              label: String(item.fues_title),
              smsContent: String(item.fues_sms_content),
              emailContent: String(item.fues_email_content),
            });
          }

        }
      }
      return arrPush;
    }
  }
  // checkOpsheadOrCcsuperVisor1() {
  //   if (this.userData.primary_skill_level_id != 56) {
  //     var roles = this.userData.role_ids.split(',');
  //     if (roles.indexOf('17') !== -1 || roles.indexOf('25') !== -1) {
  //       this.isOpsHeadOrSupervisor1 = true;
  //     } else {
  //       this.isOpsHeadOrSupervisor1 = false;
  //     }

  //   }
  // }

  _getSerialNumberAccStatus(fStatus) {
    switch (fStatus) {
      case "S0-Prospect":
        return 1;
      case "S1-Contacted":
        return 2;
      case "S2-Qualified":
        return 3;
      case "S3-Proposed":
        return 4;
      case "S4-Negotiation":
        return 5;
      case "S5-Order Placed":
        return 6;
      case "Not Qualified":
        return 7;
      case "Order Lost":
        return 8;
      default:
        return 0
    }
  }

  _validateNumberValue(val) {
    if (parseInt(val) !== NaN) {
      return parseInt(val)
    }
    return 0;
  }

  actionexport: boolean = true;
  ExportCSVForFollowUp() {
    //console.log(this.exportDurationFormFroup.value.endDate,this.exportDurationFormFroup.value.startDate);
    if (this.exportDurationFormFroup.valid && (this.exportDurationFormFroup.value.endDate >= this.exportDurationFormFroup.value.startDate)) {
      this.actionexport = false;
      this.leadListService.getFollowUpListing(this.followUpType, this.pages, this.itemPerPage, '', '', this.exportDurationFormFroup.value, 'export', '').subscribe((data) => {
        if (data.status == 1) {
          var original_datafull = [...data.data.nonactionabledata, ...data.data.data];
          let original_data = [];

          for (let i = 0; i < original_datafull.length; i++) {
            if (parseInt(original_datafull[i].surveyor_id) == 118 || parseInt(original_datafull[i].surveyor_id) == 21) {
            }
            else {
              original_data.push(original_datafull[i])
            }
          }
        switch(this.exportDurationFormFroup.value.report_name){

          case 'funnel_report':
            let exportData = [{
              project_id: "Project ID",
              Customer_Name: "Customer Name",
              remarks: "Remarks",
              Customer_add: "Customer add",
              Customer_Mobile_No: "Customer Mobile No",
              Customer_email: "Customer Email-ID",
              Customer_type: "Customer Type",
              Assigned_To: "Assigned To",
              Surveyor: "Surveyor",
              city: "City",
              source: "Lead Source",
              reference: "Lead Reference",
              project_type: "Project Type",
              lead_date: "Lead Entry Date",
              Lead_Status: "Lead Status",
              estimated_dc: "Estimated DC Capacity(kWp)",
              proposed_dc: "Proposed DC Capacity(kWp)",
              conversion: "Conversion Confidence",
              order: "Projected Order",
              closure: "Expected Closure",
              quarter: "Quarter",
              project_cost_gold: "Project Cost Gold(incl GST)",
              project_cost_silver: "Project Cost Silver(incl GST) ",
              survey_date: "Survey Date",
              proposal_date: "Proposal Date",
              Project_Status: "Project Status",
              scheduled_date: "Scheduled Date",
              last_interaction: "Last Interaction Date",
              last_activity: "Last Activity",
              lead_refrer_name: "Refrer Name",
              lead_refrer_mobile: "Refrer mobile",
              partner_name: "Partner Name",
              partner_mobile: "Partner mobile"
            }];
            original_data.forEach(item => {
              var diffDays: any = '';
              if (item.fup_updated_at) {
                var date1: any = new Date(item.fup_updated_at);
                var date2: any = new Date();
                diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
              }
              var temp = {
                project_id: item.project_code ? item.project_code : '',
                Customer_Name: item.customer_name ? item.customer_name : '',
                remarks: item.remarks ? item.remarks : '',
                Customer_add: item.cceld_address1 ? item.cceld_address1 : '',
                Customer_Mobile_No: item.cceld_mobileno_full ? item.cceld_mobileno_full : '',
                Customer_email: item.cceld_email ? item.cceld_email : '',
                Customer_type: item.cceld_sitetype ? item.cceld_sitetype : '',
                Assigned_To: item.emp_fullname ? item.emp_fullname : '',
                Surveyor: item.surveyor ? item.surveyor : '',
                city: item.cceld_city ? item.cceld_city : '',
                source: item.source_master_name ? item.source_master_name : '',
                reference: item.lr_name ? item.lr_name : '',
                project_type: item.sf_project_type ? item.sf_project_type : '',
                lead_date: item.fup_created_at ? item.fup_created_at : '',
                Lead_Status: item.flsm_status ? item.flsm_status : '',
                estimated_dc: item.estimated_dc_capacity ? item.estimated_dc_capacity : '',
                proposed_dc: item.proposal_dc_capacity ? String(item.proposal_dc_capacity / 1000) : '',
                conversion: item.conversion_confidance ? item.conversion_confidance : '',
                order: (item.conversion_confidance && item.proposal_dc_capacity) ? String((item.conversion_confidance / 100) * (item.proposal_dc_capacity / 1000)) : '',
                closure: item.expected_closure ? item.expected_closure : '',
                quarter: (item.expected_closure && item.quarter) ? (item.expected_closure ? 'Q' + item.quarter : '') : '',
                project_cost_gold: item.proposal_project_value_gold ? item.proposal_project_value_gold : '',
                project_cost_silver: item.proposal_project_value_silver ? item.proposal_project_value_silver : '',
                survey_date: item.project_survey_visited ? item.project_survey_visited.slice(0, 10) : "",
                proposal_date: item.proposal_created_on ? item.proposal_created_on.slice(0, 10) : "",
                Project_Status: item.pmstate_name ? item.pmstate_name : '',
                scheduled_date: item.fup_call_scheduled_time ? item.fup_call_scheduled_time.slice(0, 10) : '',
                last_interaction: item.fup_updated_at ? item.fup_updated_at.slice(0, 10) : '',
                last_activity: diffDays,
                lead_refrer_name: item.lead_refrer_name ? item.lead_refrer_name : '',
                lead_refrer_mobile: item.lead_refrer_mobile ? item.lead_refrer_mobile : '',
                partner_name: item.partner_fullname ? item.partner_fullname : '',
                partner_mobile: item.partner_mobile ? item.partner_mobile : '',
              };
              exportData.push(temp);
            });
            this.exportToCSV(exportData, 'Funnel Reports');
                  break;
            case 'funnel_stagewise':
              //Funnel Stage-wise
          let funnelstatewise = original_data.filter(
            m => new Date(m.fup_updated_at) >= this.exportDurationFormFroup.value.startDate
              && new Date(m.fup_updated_at) <= this.exportDurationFormFroup.value.endDate
          );

          var exportData2 = [];
          let count = 0;

          for (let i = 0; i < original_data.length; i++) {
            var idx = exportData2.findIndex(item => item.flsm_status == original_data[i].flsm_status);
            if (idx == -1) {
              var temp3 = {
                id: this._getSerialNumberAccStatus(original_data[i].flsm_status),
                flsm_status: original_data[i].flsm_status ? original_data[i].flsm_status : 'NO VALUE',
                all_total_leads: 1,
                all_capacity: (original_data[i].proposal_dc_capacity && parseInt(original_data[i].proposal_dc_capacity) > 0) ? parseInt(original_data[i].proposal_dc_capacity) / 1000 : 0,
                all_gmv: (original_data[i].proposal_project_value_gold && original_data[i].proposal_project_value_gold > 0) ? parseInt(original_data[i].proposal_project_value_gold) : (original_data[i].proposal_project_value_silver ? parseInt(original_data[i].proposal_project_value_silver) : 0),
                total_leads: 0,
                capacity: 0,
                gmv: 0,
              };
              exportData2.push(temp3);
            }
            else {
              exportData2[idx].all_total_leads = exportData2[idx].all_total_leads + 1;
              exportData2[idx].all_capacity = (original_data[i].proposal_dc_capacity && parseInt(original_data[i].proposal_dc_capacity) > 0) ? parseInt(original_data[i].proposal_dc_capacity) / 1000 + exportData2[idx].all_capacity : exportData2[idx].all_capacity;
              exportData2[idx].all_gmv = exportData2[idx].all_gmv + ((original_data[i].proposal_project_value_gold && original_data[i].proposal_project_value_gold > 0) ? parseInt(original_data[i].proposal_project_value_gold) : (original_data[i].proposal_project_value_silver) ? parseInt(original_data[i].proposal_project_value_silver) : 0);

            }

            if (funnelstatewise.indexOf(original_data[i]) !== -1) {
              var idx = exportData2.findIndex(item => item.flsm_status == original_data[i].flsm_status);
              if (idx == -1) {
                var temp2 = {
                  id: this._getSerialNumberAccStatus(original_data[i].flsm_status),
                  flsm_status: original_data[i].flsm_status ? original_data[i].flsm_status : 'NO VALUE',
                  all_total_leads: 0,
                  all_capacity: 0,
                  all_gmv: 0,
                  total_leads: 1,
                  capacity: (original_data[i].proposal_dc_capacity && original_data[i].proposal_dc_capacity !== 'null' && original_data[i].proposal_dc_capacity !== 'NULL') ? parseInt(original_data[i].proposal_dc_capacity) / 1000 : 0,
                  gmv: (original_data[i].proposal_project_value_gold && original_data[i].proposal_project_value_gold != 0) ? parseInt(original_data[i].proposal_project_value_gold) : (original_data[i].proposal_project_value_silver ? parseInt(original_data[i].proposal_project_value_silver) : 0),
                };
                exportData2.push(temp2);
              }
              else {
                exportData2[idx].total_leads = exportData2[idx].total_leads + 1;
                exportData2[idx].capacity = (original_data[i].proposal_dc_capacity) ? parseInt(original_data[i].proposal_dc_capacity) / 1000 + exportData2[idx].capacity : exportData2[idx].capacity;
                exportData2[idx].gmv = exportData2[idx].gmv + ((original_data[i].proposal_project_value_gold && original_data[i].proposal_project_value_gold != 0) ? parseInt(original_data[i].proposal_project_value_gold) : (original_data[i].proposal_project_value_silver ? parseInt(original_data[i].proposal_project_value_silver) : 0));
              }
            }
          }
          exportData2.sort(function (a, b) {
            var keyA = a.id,
              keyB = b.id;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          exportData2.splice(0, 0, {
            id: "S.No.",
            flsm_status: "Funnel Stage",
            all_total_leads: " All Total Leads",
            all_capacity: " All Capacity(kWp)",
            all_gmv: "All  GMV",
            total_leads: "SD Total Leads",
            capacity: "SD Capacity(kWp)",
            gmv: "SD GMV"
          })

          this.exportToCSV(exportData2, 'Funnel Stage-wise');
        
              break;
          case 'top_leads':
             //Top Leads

          let topleads = original_data.filter(
            m => {
              var date1: any = new Date(m.fup_updated_at)
              var date2: any = new Date();
              var diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));

              if ((m.flsm_status == 'S3-Proposed' || m.flsm_status == 'S4-Negotiaton')
                && m.proposal_dc_capacity > 25000 && diffDays < 45) {

                return m;
              }
            }
          );

          let exportData4 = [{
            ss_name: "Site Surveyor",
            project_id: "Project ID",
            customer_name: "Customer Name",
            flsm_status: "Funnel Lead Status",
            dc_capacity: "DC Capacity(kWp)",
            gmv: "GMV",
            location: "Location",
            remarks: "Remarks",
            lead_date: "Lead Entry Date",
            closure: "Expected Closure",
            last_interaction: "Last Interaction Date",
            last_activity: "Last Activity",
          }];
          if (topleads) {
            topleads.forEach(item => {
              var date1: any = new Date(item.fup_updated_at)
              var date2: any = new Date();
              var diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));

              var temp4 = {
                ss_name: item.surveyor ? item.surveyor : '',
                project_id: item.project_code ? item.project_code : '',
                customer_name: item.customer_name ? item.customer_name : '',
                flsm_status: item.flsm_status ? item.flsm_status : '',
                dc_capacity: item.proposal_dc_capacity ? String(item.proposal_dc_capacity / 1000) : '',
                gmv: (item.proposal_project_value_gold > 0) ? item.proposal_project_value_gold : item.proposal_project_value_silver,
                location: item.cceld_address1 ? item.cceld_address1 : '',
                remarks: item.remarks ? item.remarks : '',
                lead_date: item.fup_created_at ? item.fup_created_at : '',
                closure: item.expected_closure ? item.expected_closure : '',
                last_interaction: item.fup_updated_at ? item.fup_updated_at.slice(0, 10) : '',
                last_activity: String(diffDays),
              };
              exportData4.push(temp4);
            });
            this.exportToCSV(exportData4, 'Top-Leads');
          }
                break;
          case 'new_leads':
             //New leads
          let newMembers = original_data.filter(
            m => new Date(m.fup_created_at) >= this.exportDurationFormFroup.value.startDate
              && new Date(m.fup_created_at) <= this.exportDurationFormFroup.value.endDate
          );
          if (newMembers) {
            let exportData5 = [{
              ss_name: "Site Surveyor",
              project_id: "Project ID",
              customer_name: "Customer Name",
              flsm_status: "Funnel Lead Status",
              dc_capacity: "DC Capacity(kWp)",
              gmv: "GMV",
              location: "Location",
              remarks: "Remarks",
            }];
            newMembers.forEach(item => {
              var temp5 = {
                ss_name: item.surveyor ? item.surveyor : '',
                project_id: item.project_code ? item.project_code : '',
                customer_name: item.customer_name ? item.customer_name : '',
                flsm_status: item.flsm_status ? item.flsm_status : '',
                dc_capacity: item.proposal_dc_capacity ? String(item.proposal_dc_capacity / 1000) : '',
                gmv: (item.proposal_project_value_gold > 0) ? item.proposal_project_value_gold : (item.proposal_project_value_silver ? item.proposal_project_value_silver : ''),
                location: item.cceld_address1 ? item.cceld_address1 : '',
                remarks: item.remarks ? item.remarks : '',
              };
              exportData5.push(temp5);
            });
            this.exportToCSV(exportData5, 'New Leads');
          }
                  break;
          case 'proposal':
            //proposal date
          let selectedMembers = original_data.filter(
            m => new Date(m.proposal_created_on) >= this.exportDurationFormFroup.value.startDate
              && new Date(m.proposal_created_on) <= this.exportDurationFormFroup.value.endDate
          );
          //console.log(selectedMembers);
          if (selectedMembers) {
            let exportData6 = [{
              project_id: "Project ID",
              Customer_Name: "Customer Name",
              remarks: "Remarks",
              Customer_add: "Customer add",
              Customer_Mobile_No: "Customer Mobile No",
              Customer_email: "Customer Email-ID",
              Customer_type: "Customer Type",
              Assigned_To: "Assigned To",
              Surveyor: "Surveyor",
              city: "City",
              source: "Lead Source",
              reference: "Lead Reference",
              project_type: "Project Type",
              lead_date: "Lead Entry Date",
              Lead_Status: "Lead Status",
              estimated_dc: "Estimated DC Capacity(kWp)",
              proposed_dc: "Proposed DC Capacity(kWp)",
              conversion: "Conversion Confidance",
              order: "Projected Order",
              closure: "Expected Closure",
              quarter: "Quarter",
              project_cost_gold: "Project Cost Gold(incl GST)",
              project_cost_silver: "Project Cost Silver(incl GST) ",
              survey_date: "Survey Date",
              proposal_date: "Proposal Date",
              Project_Status: "Project Status",
              scheduled_date: "Scheduled Date",
              last_interaction: "Last Interaction Date",
            }];
            selectedMembers.forEach(item => {
              var temp6 = {
                project_id: item.project_code ? item.project_code : '',
                Customer_Name: item.customer_name ? item.customer_name : '',
                remarks: item.remarks ? item.remarks : '',
                Customer_add: item.cceld_address1 ? item.cceld_address1 : '',
                Customer_Mobile_No: item.cceld_mobileno_full ? item.cceld_mobileno_full : '',
                Customer_email: item.cceld_email ? item.cceld_email : '',
                Customer_type: item.cceld_sitetype ? item.cceld_sitetype : '',
                Assigned_To: item.emp_fullname ? item.emp_fullname : '',
                Surveyor: item.surveyor ? item.surveyor : '',
                city: item.cceld_city ? item.cceld_city : '',
                source: item.source_master_name ? item.source_master_name : '',
                reference: item.lr_name ? item.lr_name : '',
                project_type: item.sf_project_type ? item.sf_project_type : '',
                lead_date: item.fup_created_at ? item.fup_created_at : '',
                Lead_Status: item.flsm_status ? item.flsm_status : '',
                estimated_dc: item.estimated_dc_capacity ? item.estimated_dc_capacity : '',
                proposed_dc: item.proposal_dc_capacity ? String(item.proposal_dc_capacity / 1000) : '',
                conversion: item.conversion_confidance ? item.conversion_confidance : '',
                order: (item.conversion_confidance && item.proposal_dc_capacity) ? String((item.conversion_confidance / 100) * (item.proposal_dc_capacity / 1000)) : '',
                closure: item.expected_closure ? item.expected_closure : '',
                quarter: (item.expected_closure && item.quarter) ? (item.expected_closure ? 'Q' + item.quarter : '') : '',
                project_cost_gold: item.proposal_project_value_gold ? item.proposal_project_value_gold : '',
                project_cost_silver: item.proposal_project_value_silver ? item.proposal_project_value_silver : '',
                survey_date: item.project_survey_visited ? item.project_survey_visited.slice(0, 10) : "",
                proposal_date: item.proposal_created_on ? item.proposal_created_on.slice(0, 10) : "",
                Project_Status: item.pmstate_name ? item.pmstate_name : '',
                scheduled_date: item.fup_call_scheduled_time ? item.fup_call_scheduled_time.slice(0, 10) : '',
                last_interaction: item.fup_updated_at ? item.fup_updated_at.slice(0, 10) : '',
              };
              exportData6.push(temp6);
            });
            this.exportToCSV(exportData6, 'Proposal Report');
          }
                    break;
          case 'expected_closure':
             //Expected Closure
          let expectedClosure = original_data.filter(
            m => new Date(m.expected_closure) >= this.exportDurationFormFroup.value.startDate
              && new Date(m.expected_closure) <= this.exportDurationFormFroup.value.endDate
          );
          if (expectedClosure) {
            let exportData3 = [{
              ss_name: "Site Surveyor",
              project_id: "Project ID",
              customer_name: "Customer Name",
              flsm_status: "Funnel Lead Status",
              dc_capacity: "DC Capacity(kWp)",
              gmv: "GMV",
              location: "Location",
              closure: "Expected Closure",
              remarks: "Remarks"

            }];
            expectedClosure.forEach(item => {
              var temp3 = {
                ss_name: item.surveyor ? item.surveyor : '',
                project_id: item.project_code ? item.project_code : '',
                customer_name: item.customer_name ? item.customer_name : '',
                flsm_status: item.flsm_status ? item.flsm_status : '',
                dc_capacity: item.proposal_dc_capacity ? String(item.proposal_dc_capacity / 1000) : '',
                gmv: (item.proposal_project_value_gold > 0) ? item.proposal_project_value_gold : (item.proposal_project_value_silver ? item.proposal_project_value_silver : ''),
                location: item.cceld_address1 ? item.cceld_address1 : '',
                closure: item.expected_closure ? item.expected_closure : '',
                remarks: item.remarks ? item.remarks : ''
              };
              exportData3.push(temp3);
            });
            this.exportToCSV(exportData3, 'Expected Closure');
          }
            break;
            
  
         }
        } 
      });
    }else {
      this.popupMessageService.showError('Please enter a valid date range.', '!Error');
    }
      }

  exportToCSV(data, fileName) {
    new ngxCsv(data, fileName, { showLabels: true });
    this.actionexport = true;
  }

  customerProjects: FormGroup;
  createProejctContact(project_id) {
    this.addContactSubmit = false;
    this.customerProjects = this.formBuilder.group({
      fname: ['', Validators.compose([Validators.required])],
      lname: [''],
      email: ['', Validators.compose([Validators.email])],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)])],
      designation: [''],
      project_id: [project_id],
    });
  }

  addContactSubmit = false;
  submitAddContact() {
    if (this.customerProjects.valid) {
      this.addContactSubmit = true;
      this.consumerServices.addProjectContact(this.customerProjects.value).subscribe(data => {
        this.addContactSubmit = false;
        this.getProjectContacts(this.customerProjects.value.project_id);
        this.createProejctContact(this.customerProjects.value.project_id)
      });
    } else {
      this.popupMessageService.showError('Error in contact form', '!Error');
    }

  }

  contactsList: any = [];
  ContactListSelect: any;
  getProjectContacts(poject_id) {
    this.consumerServices.getProjectContacts(poject_id).subscribe(data => {
      this.contactsList = [];
      if (data.status == 1) {
        this.contactsList = data.data;
        this.ContactListSelect = this.convertForSelectContact();
      } else {
        this.ContactListSelect = this.convertForSelectContact();
      }
    });
  }

  convertForSelectContact() {
    let arrPush = [];
    arrPush.push({ value: String('self'), label: String(this.customerName) });
    if (this.contactsList == undefined || (this.contactsList).length <= 0) {
      return arrPush;
    } else {
      for (let item of this.contactsList) {
        if (item.pc_id != 1) {
          arrPush.push({ value: String(item.pc_id), label: String(item.pc_fname + ' ' + item.pc_lname) });
        }
      }
      return arrPush;
    }
  }

  openContactDeleteConfirmation = false;
  project_contact_id: any;
  project_id: any;
  confirmContactDelete(contact_id, project_id) {
    this.openContactDeleteConfirmation = true;
    this.project_contact_id = contact_id;
    this.project_id = project_id;
  }

  submitDeleteContact() {
    this.consumerServices.deleteProjectContacts(this.project_contact_id).subscribe(data => {
      this.getProjectContacts(this.project_id);
      this.openContactDeleteConfirmation = false;
    });
  }
  checkTimeSlot() {
    let sDate = new Date(this.customerDetailsForm.controls.cceld_scheduledate.value).getDate();
    let todaysDate = new Date().getDate();
    if (sDate === todaysDate) {
      this.timeSlot();
    } else {
      this.newSurveyTime = this.surveyTime;
    }
  }

  timeSlot() {
    this.newSurveyTime = [];
    {
      if (this.hour >= 10 && this.hour < 12) {
        this.newSurveyTime = this.surveyTime;
      } else if (this.hour >= 12 && this.hour < 14) {
        this.newSurveyTime = this.surveyTime.slice(1, 4);
      } else if (this.hour >= 14 && this.hour < 16) {
        this.newSurveyTime = this.surveyTime.slice(2, 4);
      } else {
        this.newSurveyTime = this.surveyTime.slice(3, 4);
      }
    }
  }

  checkScheduledSiteSurvey() {
    let sDate = this.customerInteractionForm.get('cceld_scheduledate').value;
    this.Date = new Date(sDate).getDate();
    let todaysDate = new Date().getDate();
    if (this.Date === todaysDate) {
      this.timeSlot();
    } else {
      this.newSurveyTime = this.surveyTime;
    }
  }

  /*
  * Method to Hide the previewMessagePopUp
  */
  hideMessagePopUp(): void {
    this.previewMessagePopUp = false;
  }

  /*
  *Storing the Email and sms content into variables
  */
  messagePreview(event): void {
    let smscotent = (event.smsContent).replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ')
      .replace('{{user_name}}', this.userData.emp_firstname + ' ' + this.userData.emp_lastname)
      .replace('{{user_fname}}', this.userData.emp_firstname)
      .replace('{{user_email}}', this.userData.emp_email)
      .replace('{{user_mobileno}}', this.userData.emp_mobileno);
    let emailcotent = (event.emailContent).replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ')
      .replace('{{user_name}}', this.userData.emp_firstname + ' ' + this.userData.emp_lastname)
      .replace('{{user_fname}}', this.userData.emp_firstname)
      .replace('{{user_email}}', this.userData.emp_email)
      .replace('{{user_mobileno}}', this.userData.emp_mobileno);
    [this.smsContentPopUp, this.emailContentPopUp] = [smscotent, emailcotent];
    this.previewMessagePopUp = true;
  }

  ExportCSVForDashboard(){
    if (this.siteServyList) {
       let exportData = [{
          ss:"Sales Manager Name",
          s0:"S0-Prospect",
          s1:"S1-Contacted",
          s2:"S2-Qualified",
          s3:"S3-Proposed",
          s4:"S4-Negotiation",
          s5:"S5-Order Placed",
          total:"Total"
        }];

        //console.log(this.siteServyList);
        
        
        for (let item of this.siteServyList) {
          var temp = {
          ss: item.surveyor,
          s0: this.roundTwoDecimalPlace(item.s0),
          s1: this.roundTwoDecimalPlace(item.s1),
          s2: this.roundTwoDecimalPlace(item.s2),
          s3: this.roundTwoDecimalPlace(item.s3),
          s4: this.roundTwoDecimalPlace(item.s4),
          s5: this.roundTwoDecimalPlace(item.s5),
          total: this.roundTwoDecimalPlace(item.total),
             };
          exportData.push(temp);
        }
        if(this.notfilterdata) {
          var temp1 = {
            ss: this.overallobj.surveyor,
            s0: this.roundTwoDecimalPlace(this.overallobj.s0),
            s1: this.roundTwoDecimalPlace(this.overallobj.s1),
            s2: this.roundTwoDecimalPlace(this.overallobj.s2),
            s3: this.roundTwoDecimalPlace(this.overallobj.s3),
            s4: this.roundTwoDecimalPlace(this.overallobj.s4),
            s5: this.roundTwoDecimalPlace(this.overallobj.s5),
            total: this.roundTwoDecimalPlace(this.overallobj.total),
          };
          exportData.push(temp1);
        }
        
        this.exportToCSV(exportData, 'Funnel Dashboard Report');
  }
}

roundTwoDecimalPlace(value) {
  if(value) {
    value = +value;
    return value.toFixed(2).toString();
  } else {
    return '0';
  }
}
partnerList=[];
getpartnerListArray() {
  //24 for partner
  //25 for cce supervisor
  this.subscription = this.leadListService.getEmployeeDataByRole(24).subscribe(data => {
      if (data.status) {
          if (data.data.length <= 0) {
              this.partnerList = [];
          } else {
            this.partnerList.push({ value: String(''), label: String('Select Partner') });
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


}
