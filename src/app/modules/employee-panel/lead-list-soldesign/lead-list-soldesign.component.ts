import { Component, OnInit, HostListener, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { LeadListService } from "../services/lead-list.service";
import { LeadPanelService } from "../../customer-care/services/lead-panel.service";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  ValidationErrors
} from "@angular/forms";
import { AlertServices } from "../../../services/alert.services";
import { Router, ActivatedRoute } from "@angular/router";
import { InlineMessageService } from "./../../message/services/message.service";
import { TIMES } from "../../../static/static";
import * as globals from "../../../static/static";
import { SharedServices } from "../../../services/shared.services";
import { PopupMessageService } from "./../../../modules/message/services/message.service";
import { AbstractControl, FormArray } from "@angular/forms/src/model";
import { getLocaleMonthNames } from "@angular/common/src/i18n/locale_data_api";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import { take } from "rxjs/operators";

@Component({
  selector: "sd-lead-list",
  templateUrl: "./lead-list-soldesign.component.html"
})
export class SolDesignListPanel implements OnInit, OnDestroy{


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
  consumerprojectdata: object;
  revisedProposalFolloupData: any = [];
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
  uploadDocument: FormGroup;
  imageUploadIssues: string = "";
  imageDocsIssues: string = "";
  isUploadingDocs: Boolean = true;
  documentsToBeUploaded: any = "0,";
  myHtml: String = "";
  currentProjectId: any;
  //sitesurvey form
  createSurveyRequestForm: FormGroup;
  isSubmitSiteSurvey: boolean = false;
  documentList: any;
  isSubmittedDocument: boolean = false;
  isEligibleForDocUpload: boolean = false;
  //call reschedule
  kartRequest: FormGroup;
  isSubmitKartRequest: boolean = false;
  currentProjectState: any;
  sol_id: any;
  isRemarkable: boolean = false;
  openStates: string[] = [
    "6",
    "7",
    "11",
    "12",
    "13",
    "15",
    "16",
    "17",
    "18",
    "19",
    "22",
    "24"
  ];
  fillCartStates: string[] = ["7", "11", "13"];
  isPaymentList: Boolean = false;
  paymentList: any = [];
  releasePaymentAmount: FormGroup;
  isReleaseForm: Boolean = false;
  isFormSubmitted: Boolean = false;
  isSearchFormSubmitted: Boolean = false;
  isLeadSearchFormSubmitted: Boolean = false;
  selectPartner: boolean = false;
  displayCommercialList:boolean;
  partnerList: any = [];
  rejectionChecklists: any = [];
  //surveyor data
  surveyorFormData: any;
  loadSurveyorFormData: any = [];
  consumerID: any;
  projectID: any;
  currentProjectData: any;
  lead_states: any = globals.LEAD_STATES;
  panelSteps: number = 1;
  actionLoader: string = "";
  actionableList: any = [];
  nonActionableList: any = [];
  searchForm: FormGroup;
  searchLeadForm: FormGroup;
  unprocessedLeads: any = [];
  solutionType: any = globals.SOLUTION_TYPE;
  projectStatusList = [];
  searchResultXlsPath: string = globals.SEARCH_RESULT_DOWNLOAD_PATH;
  downloadFileName: string;
  projectCloseReason: any = [];
  isCloseReason: boolean = false;
  closeCheckList: any = [];
  proposalEmailData: any = [];
  proposal_advanced;
  proposal_advance_silver;
  openEmailPreviewBox: boolean = false;
  proposalSolutionType: Array<any> = [
    { value: "1", label: "Grid-Tied" },
    { value: "2", label: "Off-Grid" },
    { value: "3", label: "Hybrid" },
  ];
  proposalPanelType: Array<any> = [
    { value: "1", label: "72-Cell Poly Crystalline" },
    { value: "2", label: "144-Cell Mono PERC Half Cut" },
    { value: "3", label: "72-Cell Mono Crystalline" },
    { value: "4", label: "72-Cell Mono Crystalline PERC" }

  ];
  isProposalEmailPreview: boolean = false;
  solutionTypeText: string = "Grid-Tied";
  panelTypeText: string = "72-Cell Poly-Crystalline";
  payment_percentage_check: number = 0;
  payment_percentage_check_silver: number = 0;
  showSmartSearchComponent: Boolean = false;
  selectePricingOption: string = "";
  selecteEmiOption: string = "";
  bank_finance:any
  capexSelected:boolean=false
  opexSelected:boolean=false
  isResedential:boolean=false;
  displayEquip:boolean;
  is_discount_available: String = "0";
  onGridInverterEmailValue: any;
  offGridInverterEmailValue: any;
  hybridInverterEmailValue: any;
  loader:any;
  record:any;
  is_email_sent: number = 0;
  previewProposalAdvanced;
  previewProposalAdvanceSilver;
  previewProposalPayment2;
  previewProposalAdvanceSilver1;
  previewProposalPayment3;
  previewProposalAdvanceSilver2;
  previewProposalPayment4;
  previewProposalAdvanceSilver3;
  isOpsHeadOrSupervisor1: Boolean = false;

  ComponentData=[
    {id:1,checked:true,component:'Solar Inverter',description:'Solar String Inverter operating on 50Hz frequency :',make:'Luminous',qty:'750 No.',warranty:'5 Years'},
    {id:2,checked:true,component:'Solar PV Panel',description:'330-Wp-72Cells Poly-Crystalline Luminous Solar PV Modules',make:'Luminous',qty:'120 Nos.',warranty:'25 Years Performance'},
    {id:3,checked:true,component:'Structure',description:'Galvanised Module Mounting Structure(MMS) including SS202 grade of hardware,Module lower edge clearance approx.0.5mtr with fixed tilt 14-18 degree,double portrait structure 2(2x4) matrix for RCC roof',make:'Indian Make',qty:'As Per Design',warranty:'2 Years'},
    {id:4,checked:true,component:'AJB',description:'AJB(Box)-IP65enclosure box with fuses&amp; surge protective device(SPD, make Schneider/Phoenix/CITEL/Mersen).',make:'Hensel/TrinityTouch/Fibox',qty:'As per design',warranty:'2 Years'},
    {id:5,checked:true,component:'SolarPanel/ACDB',description:'Indoor type wall/ﬂoor mounted Electrical Panel, suitable rating of Busbars,MCCB, MCB, and enclosure box with surge protective device (SPD,make Schneider/Phoenix/CITEL/Mersen).',make:'Indian Make Panel',qty:'1 Set.',warranty:'2 Years'},
    {id:6,checked:true,component:'DC Cable',description:'1C x 4/6 sq. mm Copper conductor DC solar Cable as per TUV 2PFG/1169 for PV array',make:'Polycab/ Havells/ Siechem/Eqv',qty:'1 Set.',warranty:'2 Years'},
    {id:7,checked:true,component:'AC cable',description:'AC Copper conductor Cable for Inverter to AC Junction Box (AC JB). And AC JB To solar Panel AL. conductor cable. And Solar panel to feeding point Al. arm cable as per IS:1554 &amp;7098 standards.',make:'Polycab/ Havells/ Eqv.',qty:'1 Lot',warranty:'2 Years'},
    {id:8,checked:true,component:'Earthing system',description:'Chemical Earthing Electrode with earth enhancing compound & GI Strip',make:'JMV/VNT/johnson/JEF Techno',qty:'3 Nos.',warranty:'2 Years'},
    {id:9,checked:true,component:'Lightning Protection',description:'Franklin type lightning arrester(LA) for the PV array area.',make:'JMV/VNT/JEF Techno',qty:'1 Set.',warranty:'2 Years'},
    {id:10,checked:true,component:'RMS',description:'Remote Monitoring system (RMS) for access solar power plant in remote',make:'Luminous',qty:'1 Set.',warranty:'2 Years'},
    {id:11,checked:true,component:'PV connector',description:'MC 4 compatible PV connectors for PV panel &amp; further extensions',make:'Elmax/Phoenix',qty:'As required',warranty:''},
    {id:12,checked:true,component:'Cable Lugs & safety signage',description:'Cable lugs &amp; glands,Danger Boards/ Signage',make:'Dowell’s/Johnson//Eqv.',qty:'As required',warranty:''},
    {id:13,checked:true,component:'Cable fixing',description:'UPVC/HDPE Conduit Pipe/ cable tray, Hardware and accessory',make:'Indian make',qty:'As Per design.',warranty:''},
    {id:14,checked:true,component:'Civil Work',description:'Structure footing for RCC roof, Earth pit Chamber construction, Concrete Foundation block for LA fixing',make:'Locally available',qty:'As Per design',warranty:''},
    {id:15,checked:true,component:'Solar Plant Insurance',description:'Solar Power plant will be insured against fire, theft & damages. Same can be renewed further on chargeable basis. Rates are subject to claim/s availed in the previous year',make:'Iffco-Tokio',qty:'',warranty:'1 Years'},
];



equipmentData=[
  {id:1,checked:false,component:'Walkway',description:'300 mm wide FRP Walkways on metal roof for movement & services of solar power plant as per design',make:'India Make',qty:'1 Set',warranty:'--'},
  {id:2,checked:false,component:'Safety Line',description:'GI Safety life line on metal roof for solar power plant service.',make:'India Make',qty:'1 Set',warranty:'--'},
  {id:3,checked:false,component:'Water Cleaning System',description:'Water pipeline for SPV module cleaning: – 1 inch GI/UPVC pipeline with suitable no. of water taps & its accessories.Note: Pressurized water supply to be provided by customer for every proposed building rooftop',make:'Indian Make',qty:'1 Set',warranty:'--'},
  {id:4,checked:false,component:'Fire Protection',description:'1 no. 5Kg, Dry Co2 Fire extinguisher, 1 no. fire & safety instruction chart.',make:'Indian Make',qty:'1 No.',warranty:'--'},
  {id:5,checked:false,component:'Solar Sensor',description:'Solar Irradiance & module temperature sensor PV crystalline type',make:'Meteo control/equ.',qty:'1 No',warranty:'--'},


];


  pricingOptions: Array<any> = [
    { value: "1", label: "Gold" },
    { value: "2", label: "Silver" },
    { value: "3", label: "Both(Gold & Silver)" }
  ];
  emiOptions: Array<any> = [
    { value: "1", label: "Show EMI in email" },
    { value: "2", label: "Do not show EMI in email" }
  ];

  placeholder: Object = {
    proposalAMC:
      "Comprehensive AMC available after warranty period on chargeable basis.",
    proposal_solar_pv_panels_gold: "Luminous Solar Panels",
    proposal_solar_pv_panels_silver: "Luminous Panel"
  };
  proposal_addition_email_text: string = "";

  structBom: Array<any> = [
    {
      value:
        "Galvanised Module Mounting Structure (MMS) including SS202 grade of hardware, Module lower edge clearance approx. 0.5mtr with fixed tilt 14-18 degree, double portrait structure 2(2x4) matrix for RCC roof.",
      label:
        "Galvanised Module Mounting Structure (MMS) including SS202 grade of hardware, Module lower edge clearance approx. 0.5mtr with fixed tilt 14-18 degree, double portrait structure 2(2x4) matrix for RCC roof."
    },
    {
      value:
        "Aluminium Partial Rail Module Mounting Structure (MMS) including  hardware & clamps, Modules shall be fix parallel to metal shed.",
      label:
        "Aluminium Partial Rail Module Mounting Structure (MMS) including  hardware & clamps, Modules shall be fix parallel to metal shed."
    }
  ];

  GTIphase: Array<any> = [
    { value: "Three Phase", label: "Three Phase" },
    { value: "Single Phase", label: "Single Phase" }
  ];

  connectionType: Array<any> = [
    { value: "single", label: "Single Phase" },
    { value: "three", label: "Three Phase" }
  ];

  connectionTypeCommercial: Array<any> = [
    { value: "Single Phase", label: "Single Phase" },
    { value: "Three Phase LT", label: "Three Phase LT" },
    {value: "Three Phase HT", label: "Three Phase HT"}
  ];



  batterySeries: Array<any> = [
    { value: "5", label: "H Series / 5 Years" },
    { value: "3", label: "L Series / 3 Years" }
  ];

  StructType: Array<any> = [
    {
      value: "Galvanized/PosMac Structure",
      label: "Galvanized/PosMac Structure"
    },
    { value: "Aluminium Partial Rail", label: "Aluminium Partial Rail" }
  ];

  AcCableCore: Array<any> = [
    { value: "2", label: "2" },
    { value: "4", label: "4" }
  ];

  NoOfCells: Array<any> = [
    { value: "60", label: "60" },
    { value: "72", label: "72" }
  ];

  EarthingNos: Array<any> = [
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ];

  BuildingType: Array<any> = [
    { value: "industrial", label: "Industrial" },
    { value: "commercial", label: "Commercial" },
    { value: "residential", label: "Residential" },
    { value: "Institution", label: "Institution" }
  ];
  off_grid = false;
  customerCityName: any;
  InsolationRefcityListing: Array<any> = [
    { value: "1550", label: "Ambala" },
    { value: "1449", label: "Amritsar" },
    { value: "1571", label: "Chandigarh" },
    { value: "1533", label: "Delhi" },
    { value: "1417", label: "Faridabad" },
    { value: "1534", label: "Ghaziabad" },
    { value: "1415", label: "Gurgaon" },
    { value: "1635", label: "Jaipur" },
    { value: "1505", label: "Lucknow" },
    { value: "1445", label: "Ludhiana" },
    { value: "1545", label: "Mohali" }
  ];
  SolarInverterOptions: Array<any>;

  SolarInverterNumber: Array<any> = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ];

  // SolarInverterOptionsOffGird: Array<any> = [
  //   { value: "1 kW/Solar NXT PCU, ", label: "1.25 kVA (1 kW) PCU" },
  //   { value: "2 kW/Solar NXT PCU", label: "2.5 kVA (2 kW) PCU" },
  //   { value: "3 kW/Solar NXT PCU", label: "3.75 kVA (3 kW) PCU" },
  //   { value: "6 kW/Solar NXT PCU", label: "7.5 kVA (6 kW) PCU" },
  //   { value: "7.5 kW/Solar NXT PCU", label: "9.5 kVA (7.5 kW) PCU" },
  //   { value: "10 kW/Solar NXT PCU", label: "12.5 kVA (10 kW) PCU" },
  //   { value: "1.6 kW/SOLARVERTER PRO", label: "2 kVA (1.6 kW) SOLARVERTER PRO" },
  //   { value: "2.4 kW/SOLARVERTER PRO", label: "3 kVA (2.4 kW) SOLARVERTER PRO" },
  //   { value: "1.6 kW/SOLARVERTER", label: "2 kVA (1.6 kW) SOLARVERTER" },
  //   { value: "2.4 kW/SOLARVERTER", label: "3 kVA (2.4 kW) SOLARVERTER" },
  // ];

  SolarInverterOptionsOffGird: Array<any>;
  SolarInverterOptionsOnGird: Array<any>;
  SolarInverterOptionsHybrid: Array<any>;

  // SolarInverterOptionsOnGird: Array<any> = [
  //   { value: "1 kW/SOLAR NXI GTI", label: "1 kW SOLAR NXI" },
  //   { value: "1.5 kW/SOLAR NXI GTI", label: "1.5 kW SOLAR NXI" },
  //   { value: "2 kW/SOLAR NXI GTI", label: "2 kW SOLAR NXI" },
  //   { value: "3 kW/SOLAR NXI GTI", label: "3 kW SOLAR NXI" },
  //   { value: "4 kW/SOLAR NXI GTI", label: "4 kW SOLAR NXI" },
  //   { value: "5 kW/SOLAR NXI GTI", label: "5 kW SOLAR NXI" },
  //   { value: "8 kW/SOLAR NXI GTI", label: "8 kW SOLAR NXI" },
  //   { value: "6 kW/SOLAR NXI GTI", label: "6 kW SOLAR NXI" },
  //   { value: "10 kW/SOLAR NXI GTI", label: "10 kW SOLAR NXI" },
  //   { value: "12 kW/SOLAR NXI GTI", label: "12 kW SOLAR NXI" },
  //   { value: "15 kW/SOLAR NXI GTI", label: "15 kW SOLAR NXI" },
  //   { value: "20 kW/SOLAR NXI GTI", label: "20 kW SOLAR NXI" },
  //   { value: "25 kW/SOLAR NXI GTI", label: "25 kW SOLAR NXI" },
  //   { value: "30 kW/SOLAR NXI GTI", label: "30 kW SOLAR NXI" },
  //   { value: "50 kW/SOLAR NXI GTI", label: "50 kW SOLAR NXI" },
  //   { value: "60 kW/SOLAR NXI GTI", label: "60 kW SOLAR NXI" },
  //   { value: "80 kW/SOLAR NXI GTI", label: "80 kW SOLAR NXI" },
  //   { value: "100 kW/SOLAR NXI GTI", label: "100 kW SOLAR NXI" },
  //   { value: "110 kW/SOLAR NXI GTI", label: "110 kW SOLAR NXI" },
  // ];

  // SolarInverterOptionsHybrid: Array<any> = [
  //   { value: "3 kW/SOLAR HYBRID TX", label: "3.75 kVA (3 kW) SOLAR HYBRID TX"},
  //   { value: "4 kW/SOLAR HYBRID TX", label: "5 kVA (4 kW) SOLAR HYBRID TX"}
  // ]


  syncAmountHide: boolean;
  projectType: string;
  public equipmentValueArray = [];
  formsection: any;

  solarPvModuleRating:any;

  constructor(
    private route: Router,
    private sharedServices: SharedServices,
    private alertService: AlertServices,
    private formBuilder: FormBuilder,
    private leadListService: LeadListService,
    private inlineMessageService: InlineMessageService,
    private popupMessageService: PopupMessageService,
    private leadPanelService: LeadPanelService,
    private elementRef: ElementRef
  ) {}

  currentEmpId: any;
  ngOnInit() {
    // this.rightMove();
    if (localStorage.getItem("emp_auth_key")) {
      this.userData = JSON.parse(localStorage.getItem("userData"));
    }
    this.setSolarInverterOptions();
    // console.log(this.placeholder["proposalAMC"]);
    this.sol_id = JSON.parse(localStorage.getItem("userData"));
    this.currentEmpId = this.sol_id.emp_id;

    this.getLeadListDetails();
    this.createDocumentForm();
    // this.createKartRequestForm();
    this.baseurl = globals.API_BASE_URL;
    this.getProjectCloseReason();
    this.checkOpsheadOrCcsuperVisor1();
    // this.sharedServices.searchForm.next('solutionDesignerLeadListing');
    this.showSmartSearchComponent = true;

  }

  ngOnDestroy(): void {

  }

  setSolarInverterOptions() {

    let data;

      // Ongrid
      data = {type: 1};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let inverterItems = [];
            res.data.forEach(item => {
              inverterItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.SolarInverterOptionsOnGird = inverterItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );

      // Offgrid
      data = {type: 2};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let inverterItems = [];
            res.data.forEach(item => {
              inverterItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.SolarInverterOptionsOffGird = inverterItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );

      // Hybrid
      data = {type: 3};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let inverterItems = [];
            res.data.forEach(item => {
              inverterItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.SolarInverterOptionsHybrid = inverterItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );

      // Hybrid
      data = {type: 5};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let panelItems = [];
            res.data.forEach(item => {
              panelItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.solarPvModuleRating = panelItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );
  }



  /***
   * @description: variable decleared for openProjectCheckListDetail function
   */
  ongoingLead: any;
  coldLead: any;
  ongoingProject: any;
  rejectedProject: any;
  existingLeadData: any;
  surveyorEmpDetail: any;


  onChangePayback(event){
    const payBackFormArray: FormArray = this.kartRequest.get('payBackFormArray') as FormArray;
    if (event.target.checked ) {
      payBackFormArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;
      payBackFormArray.controls.forEach((item: FormControl) => {
        if (item.value == event.target.value) {
          payBackFormArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    if(payBackFormArray.value.length > 0) {
      this.kartRequest.controls.paybackValidation.setValue(payBackFormArray.value.length);
    } else{
      this.kartRequest.controls.paybackValidation.setValue('');
    }
    if(payBackFormArray.value.includes('capex')) {
      this.kartRequest.controls.is_capex.setValue('1')
    } else {
      this.kartRequest.controls.is_capex.setValue('')
      this.capexClearValidation();
    }
    if(payBackFormArray.value.includes('opex')) {
      this.kartRequest.controls.is_opex.setValue('1')
    } else {
      this.kartRequest.controls.is_opex.setValue('');
      this.opexClearValidation();
    }
  }
  /*
  * Clear the Capex Validation
  */
  capexClearValidation(){
    this.kartRequest.controls.bank_finance.clearValidators();
    this.kartRequest.controls.bank_finance.setValue("");
    this.kartRequest.controls.corporate_tax_rate.clearValidators();
    this.kartRequest.controls.corporate_tax_rate.setValue("0");
    this.kartRequest.controls.discounted_rate.clearValidators();
    this.kartRequest.controls.discounted_rate.setValue("0");
    this.kartRequest.controls.deprication.clearValidators();
    this.kartRequest.controls.deprication.setValue("0");
    this.kartRequest.controls.estimated_loan.clearValidators();
    this.kartRequest.controls.estimated_loan.setValue("");
    this.kartRequest.controls.interest_rate.clearValidators();
    this.kartRequest.controls.interest_rate.setValue("");
    this.kartRequest.controls.repayment_period.clearValidators();
    this.kartRequest.controls.repayment_period.setValue("");

    this.kartRequest.controls.bank_finance.updateValueAndValidity();
    this.kartRequest.controls.corporate_tax_rate.updateValueAndValidity();
    this.kartRequest.controls.discounted_rate.updateValueAndValidity();
    this.kartRequest.controls.deprication.updateValueAndValidity();
    this.kartRequest.controls.estimated_loan.updateValueAndValidity();
    this.kartRequest.controls.interest_rate.updateValueAndValidity();
    this.kartRequest.controls.repayment_period.updateValueAndValidity();
  }

  /*
  * Clear the Opex Validation
  */
  opexClearValidation() {
    this.kartRequest.controls.ppa_tarif.clearValidators();
    this.kartRequest.controls.ppa_tarif.setValue("");
    this.kartRequest.controls.payment_security_period.clearValidators();
    this.kartRequest.controls.payment_security_period.setValue("");
    this.kartRequest.controls.ppa_tenure.clearValidators()
    this.kartRequest.controls.ppa_tenure.setValue("");
    this.kartRequest.controls.ppa_tarif.updateValueAndValidity();
    this.kartRequest.controls.payment_security_period.updateValueAndValidity();
    this.kartRequest.controls.ppa_tenure.updateValueAndValidity();
  }
  /***@Ends: variable decleared */

  checkOpsheadOrCcsuperVisor1() {
      if (this.userData.primary_skill_level_id != 56) {
        var roles = this.userData.role_ids.split(',');
        if (roles.indexOf('17') !== -1 || roles.indexOf('25') !== -1) {
          this.isOpsHeadOrSupervisor1 = true;
        } else {
          this.isOpsHeadOrSupervisor1 = false;
        }
      }
    }
  //get audit surveyordata
  getAuditData(projectID, consumerID) {
    if (projectID && consumerID) {
      this.leadListService
        .getSurveyorAudit(projectID, consumerID)
        .subscribe(data => {
          this.getPropsalEmailData();
          if (data.status) {
            this.surveyorFormData = Array.isArray(data.data.surveyor_form_data)
              ? data.data.surveyor_form_data[0]
              : [];
            //this.projectType = data.data.project_data.project_type;
            this.customerCityName = this.surveyorFormData.sf_cityid;
            this.loadSurveyorFormData = data.data.load_surveyer_form_data;
            this.surveyorEmpDetail = data.data.surveyor_detail;

            if (this.surveyorFormData.sf_mobileno > 0) {
              this.leadPanelService
                .getExistingLAndP(this.surveyorFormData.sf_mobileno)
                .subscribe(data => {
                  if (data.status == 1) {
                    this.existingLeadData = data.data;
                    this.ongoingLead = data.data.ongoingLeadData
                      ? data.data.ongoingLeadData
                      : false;
                    this.coldLead = data.data.coldLeadData
                      ? data.data.coldLeadData
                      : false;
                    this.rejectedProject = data.data.rejectedProjectsData
                      ? data.data.rejectedProjectsData
                      : false;
                    this.ongoingProject = data.data.ongoingProjectsData
                      ? data.data.ongoingProjectsData
                      : false;
                  } else {
                    console.log(
                      "error getting existing leads line:275 lead-list-soldesign.component.ts"
                    );
                  }
                });
            }
          } else {
            console.log("error");
          }
        });
    }
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


  get SolarPlantInsurance(){
    return this.ComponentData[this.ComponentData.length-1].warranty

  }


  getLeadListDetails() {
    this.loader=true;
    this.record=false;
    this.sharedServices.searchForm.next("solutionDesignerLeadListing");
    this.showSmartSearchComponent = true;
    this.isListing = "lead-list";
    this.actionableList = [];
    this.nonActionableList = [];
    this.isPaymentList = false;
    this.userData = JSON.parse(localStorage.getItem("userData"));
    if (localStorage.getItem("emp_auth_key")) {
      this.leadListService
        .getLeadDetailsForEmployee()
        .subscribe(data => {
          if(data.error_message === 'No record found.'){
            this.loader=false;
            this.record=true;
            return;
          }
          if (data.status) {
            this.leadData = data.result.data;
            this.getActionNonActionArrays(this.leadData);
            this.record=false;
            this.loader=false;
          } else {
            console.log("error");
            this.loader=false;
          }
        });
    } else {
      this.loader=false;
      this.route.navigateByUrl("/employee/login");
    }
  }

  createChecklistSubmitForm() {
    this.checklistSubmitForm = this.formBuilder.group({
      checklist_name: ['', Validators.compose([Validators.required])],
      checklist_status: ['', Validators.compose([Validators.required])],
      project_close_reason: ['', Validators.compose([Validators.required])],
      remarks: ['', Validators.required],
      partner_id: ['']
    });
  }
  setInvertorAccessoriesValidations() {
    if(this.off_grid){
      this.createAmountValidation();
      this.createInvertorAccessoriesValidation()
    } else{
      this.removeAmountValidation()
      this.removeInvertorAccessoriesValidation()
    }
  }

  projectSolutionDesignerId: any;
  openProjectChecklistDetails(projectId: any, consumerId: any) {
    this.formsection="";
    this.isSubmitChecklist=false;
    this.isSubmitKartRequest=false;
    this.showSmartSearchComponent = false;
    this.projectID = projectId;
    this.consumerID = consumerId;
    this.isEligibleForDocUpload = false;
    this.myHtml = "";
    this.auditRole = true;
    this.panelSteps = 1;
    this.selectPartner = false;
    this.getProjectContacts(projectId);
    this.getProjectStatusDataDetailed();
    if (localStorage.getItem("emp_auth_key")) {
      this.isRemarkable = false;
      this.isCloseReason = false;
      this.createChecklistSubmitForm();
      this.getAuditData(this.projectID, this.consumerID);
      this.leadListService
        .getProjectDetailsForChecklists(projectId)
        .subscribe(data => {
          if (data.status) {
            this.projectChecklistData = data.data;
            this.isListing = "";
            this.currentProjectId = projectId;
            this.currentProjectData = data.project_data;
            this.currentProjectState = data.project_data.project_state;
            this.projectSolutionDesignerId =
              data.project_data.project_sol_designer;
            if (
              this.currentProjectState == 12 ||
              this.currentProjectState == 16
            ) {
              this.getpartnerListArray();
              this.selectPartner = true;
            }
            this.ChecklistItems = this.convertForSelectForSolDes(
              this.projectChecklistData
            );
            if (this.projectChecklistData.length <= 0) {
              this.getLeadListDetails();
            } else {
              // this.documentUploadEligibilityCheck();
              this.getUploadDocumentName();
              this.getUploadedDocumentsForSolDesigner(projectId);
            }
            window.scroll(0,0);
          } else {
            console.log("error");
            this.getLeadListDetails();
          }
        });
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  charges: any;
  getSoDesignerCharges(projectId) {
    this.leadListService.getSoDesignerCharges(projectId).subscribe(
      data => {
        if(data.status) {
          this.charges = data.result.data;
        }
      },
      err => {
          this.popupMessageService.showError("Can't get charges", "Error");
      }
    );
  }


  onBlur(data,id){
  let isPresent=this.bos_equipments.value.findIndex(val=>val.component ==id);
  if(isPresent !=-1){
    this.bos_equipments.value.splice(isPresent,1,data);
  }
  }
  onBlurdata(data,id){
    let isPresent=this.equipments.value.findIndex(val=>val.component ==id);
    if(isPresent !=-1){
      this.equipments.value.splice(isPresent,1,data);
    }
  }

  get tranche_description(){
    return this.kartRequest.get('tranche_description') as FormArray;
  }

  changeProjectStatus() {
    this.isSubmitChecklist = true;
    this.checklistSubmitForm.controls.checklist_status.setValue("1");
    if (this.checklistSubmitForm.valid) {
      console.log(this.checklistSubmitForm.get('checklist_name').value);
       if (this.checklistSubmitForm.get('checklist_name').value == 13 && this.is_email_sent == 0) {
        this.popupMessageService.showError(
          "Kindly send email before submitting the proposal.",
          "Error!"
        );
        return;
      }
      let project_id = this.currentProjectId;
      this.actionLoader = "checklist_loader";
      this.leadListService
        .checklistSubmitService(project_id, this.checklistSubmitForm.value)
        .subscribe(
          data => {
            if (data.status) {
              this.isRemarkable = false;
              this.createChecklistSubmitForm();
              this.isSubmitChecklist = false;
              this.popupMessageService.showSuccess(
                "Response Submitted Successfully",
                "Success!"
              );
              this.openProjectChecklistDetails(project_id, this.consumerID);
              this.actionLoader = "";
            } else if (data.error_code != 0) {
              if (data.error_code == 3) {
                this.popupMessageService.showInfo(data.error_message, "Error!");
                this.actionLoader = "";
              } else {
                this.popupMessageService.showError(data.error_message, "Info!");
                this.actionLoader = "";
              }
            }
          },
          error => {
            this.popupMessageService.showError(
              "Server Error.",
              "Server Error!"
            );
            this.actionLoader = "";
          }
        );
    } else {
      Object.keys(this.checklistSubmitForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.checklistSubmitForm.get(
          key
        ).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log(
              "Key control: " +
                key +
                ", keyError: " +
                keyError +
                ", err value: ",
              controlErrors[keyError]
            );
          });
        }
      });
    }
  }

  convertForSelectForSolDes(listItems: any) {
    if (listItems.length <= 0) {
      return [];
    } else {
      let arrPush = [];
      for (let item of listItems) {
        if (item.pstatus_checkliststatus != 1 && item.psm_isexternal != 1) {
          if (item.psm_is_reopen_or_rejected == 1) {
            this.rejectionChecklists.push(item.psm_id);
          }
          if (item.psm_id == 46) {
            this.closeCheckList.push(item.psm_id);
          }
          if (item.psm_is_document_upload == 1) {
            this.isEligibleForDocUpload = true;
            this.documentsToBeUploaded += item.psm_mandatory_doc_types + ",0";
          }
          arrPush.push({
            value: String(item.psm_id),
            label: String(item.psm_status)
          });
        }
      }
      return arrPush;
    }
  }

  onSolarPanelBlur(){
    this.setpaneltype(this.kartRequest.get('proposal_panel_type').value);
    let value =(this.kartRequest.get('proposal_pricing_options').value == 1) ? this.kartRequest.get('proposal_solar_pv_panels_gold').value : this.kartRequest.get('proposal_solar_pv_panels_silver').value;
    if(value){
      this.ComponentData[1].description=(this.kartRequest.get('module_capacity').value)+'-Wp-'+ this.panelTypeText+ ' ' + value;
    }
    let isPresent=this.bos_equipments.value.findIndex(val=>val.component=='Solar PV Panel');
    if(isPresent !=-1){
    this.bos_equipments.value.splice(isPresent,1,this.ComponentData[1]);
    }
  }


  onInverterQuantity(event){
    console.log("evet fired");

    let value=0;
    let value2=0;
    let value3=0;
    let sum=0;
      value=Number(this.kartRequest.get('proposal_inverter_quantity').value);
      value2=Number(this.kartRequest.get('proposal_inverter_quantity2').value);
      value3=Number(this.kartRequest.get('proposal_inverter_quantity3').value);
      sum=value+value2+value3;
      this.ComponentData[0].qty=String(sum)+''+' No';

      let des=(this.ComponentData[0].description).split(":");
      this.ComponentData[0].description=des[0] + ' : ' +
        (this.kartRequest.get('proposal_inverter_quantity').value) +'*' + (this.kartRequest.get('proposal_inverter_rating').value) + " " + (this.kartRequest.get('proposal_inverter_phase').value);
        if((this.kartRequest.get('proposal_inverter_number').value) >=2){
          this.ComponentData[0].description =this.ComponentData[0].description+', '+  (this.kartRequest.get('proposal_inverter_quantity2').value) +'*' + (this.kartRequest.get('proposal_inverter_rating2').value) + " "  + (this.kartRequest.get('proposal_inverter_phase2').value);
        }
        if((this.kartRequest.get('proposal_inverter_number').value) >= 3){
          this.ComponentData[0].description = this.ComponentData[0].description+', '+ (this.kartRequest.get('proposal_inverter_quantity3').value) +'*' + (this.kartRequest.get('proposal_inverter_rating3').value) + " "  + (this.kartRequest.get('proposal_inverter_phase3').value);
        }
  }

  getpartnerListArray() {
    this.leadListService
      .getEmployeeDataByRole(24)
      .subscribe(
        data => {
          if (data.status) {
            if (data.data.length <= 0) {
              this.partnerList;
            } else {
              for (let item of data.data) {
                // if (item.psm_is_reopen_or_rejected != 1){
                this.partnerList.push({
                  value: String(item.emp_id),
                  label: String(item.emp_firstname)
                });
                // }
              }
            }
          } else if (data.error_code != 0) {
            this.popupMessageService.showError(data.error_message, "Error!");
          }
        },
        error => {
          this.popupMessageService.showError("Server Error.", "Server Error!");
        }
      );
  }

  documentUploadEligibilityCheck() {
    for (let item of this.ChecklistItems) {
      if (
        item.value == 12 ||
        item.value == 18 ||
        item.value == 24 ||
        item.value == 25
      ) {
        this.isEligibleForDocUpload = true;
      }
    }
  }

  public createDocumentForm() {
    this.uploadDocument = this.formBuilder.group({
      uploadDocumentFile: ["", [Validators.required]],
      documentListName: ["", [Validators.required]]
    });
  }

  onProposalType(event){
      if(event.target.value =='2'){
        this.kartRequest.get('proposal_solution_type').setValue('1');
      }
      else{
        this.kartRequest.get('proposal_solution_type').setValue('');
      }
      let amc_option=this.kartRequest.get('amc_option');
      let amc_charge=this.kartRequest.get('amc_charge');
      let  proposal_syncValue=this.kartRequest.get('proposal_syncValue');
      let  proposal_syncAmount=this.kartRequest.get('proposal_syncAmount');
  // this.kartRequest.get('cceld_sitetype').reset();
      this.kartRequest.get('Dlvryweeks').setValue('');
      event.target.value && event.target.value =="1"? this.isResedential=true:this.isResedential=false;
      this.kartRequest.get('discount').setValue('');
      this.kartRequest.get('discount_silver').setValue('');
      if(event.target.value && event.target.value =="2" && this.off_grid){
        amc_option.setValidators(Validators.required);
        amc_charge.setValidators(Validators.required);
        proposal_syncValue.setValidators(Validators.required);
        proposal_syncAmount.setValidators(Validators.required);
      }
      else{
        amc_option.clearValidators();
        amc_charge.clearValidators();
        proposal_syncValue.clearValidators();
        proposal_syncAmount.clearValidators();
      }
    if(event.target.value && event.target.value =="1"){
      this.isResedential=true;
      this.kartRequest.controls.is_opex.setValue('');
      this.opexClearValidation();
    }else{
      this.isResedential=false;
    }
    amc_charge.updateValueAndValidity();
    amc_option.updateValueAndValidity();
    proposal_syncValue.updateValueAndValidity();
    proposal_syncAmount.updateValueAndValidity();
  }

  getUploadedDocumentsForSolDesigner(project_id) {
    if (localStorage.getItem("emp_auth_key")) {
      this.actionLoader = "uploadedDocs_loader";
      this.leadListService
        .getUploadedDocuments(project_id, localStorage.getItem("role_id"), "")
        .subscribe(
          data => {
            if (data.status == 1) {
              // console.log("Error in getUploadedDocumentsForSolDesigner()");
              this.projectDocuments = data.data;
              // console.log(this.projectDocuments);
              this.actionLoader = "";
            } else {
              // console.log("ELSE Error in getUploadedDocumentsForSolDesigner()");
              this.popupMessageService.showError(data.error_message, "Error!");
              this.actionLoader = "";
            }
          },
          error => {
            // console.log("Exception in getUploadedDocumentsForSolDesigner()");
            this.popupMessageService.showError("Some Error.", "Error!");
            this.actionLoader = "";
          }
        );
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  /**
   * @description: function handled file dropped as event and serve as same in file change event of form using
   * @developer: Roshan
   */
  handleFilesDropped(event: any) {
    let eventAsSelectfile = { target: { files: event } };
    let pid = this.currentProjectId;
    this.fileChange(eventAsSelectfile, pid);
  }

  fileChange(event: any, pid: Number) {
    if (localStorage.getItem("emp_auth_key")) {
      this.isSubmittedDocument = true;
      if (this.uploadDocument.value.documentListName) {
        let documentType = this.uploadDocument.value.documentListName;
        // this.isSubmittedDocs = groupIndex;
        if (documentType != "") {
          this.actionLoader = "upload_loader";
          let eventClone = event;
          let extType = event.target.files[0].type;
          let ext = eventClone.target.files[0].name.split(".").pop();
          let name = eventClone.target.files[0].name.replace(/\//g,"-");




          this.sharedServices
            .docsToBase64(event, [
              "pdf",
              "doc",
              "docx",
              "msword",
              "xls",
              "xlsx",
              "csv",
              "jpeg",
              "jpg",
              "png",
              "PDF",
              "DOC",
              "DOCX",
              "XLS",
              "XLSX",
              "CSV",
              "JPEG",
              "JPG",
              "PNG"
            ])
            .then(data => {
              this.imageDocsIssues = "";
              this.isUploadingDocs = true;
              this.sharedServices
                .uploadSpceDocument(
                  pid,
                  documentType,
                  String(data),
                  ext,
                  extType,
                  name
                )
                .subscribe(
                  data => {
                    if (data.status == 1) {
                      /*if (["jpeg", "jpg", "png", "JPEG", "JPG", "PNG"].indexOf(ext) != -1) {
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
                                }*/
                      this.uploadDocument.reset();
                      this.isSubmittedDocument = false;
                      this.popupMessageService.showSuccess(
                        "File Uploaded Successfully",
                        "Success!"
                      );
                      this.actionLoader = "";
                      this.getUploadedDocumentsForSolDesigner(pid);
                    } else if (data.error_code != 0) {
                      this.uploadDocument.reset();
                      this.popupMessageService.showError(
                        data.error_message,
                        "Error!"
                      );
                      this.actionLoader = "";
                      this.isSubmittedDocument = false;
                    }
                  },
                  error => {
                    this.popupMessageService.showError(
                      "Error in file upload.",
                      "Upload Error!"
                    );
                    this.actionLoader = "";
                  }
                );
            })
            .catch(data => {
              this.actionLoader = "";
              this.isSubmittedDocument = false;
              this.popupMessageService.showError(data, "Invalid File Type!");
              //this.alertService.error(data);
            });
        } else {
          this.popupMessageService.showError(
            "OOPs! It seems you don't select any document type. Please Select Document type before uploading the file.",
            "Required Field Error!"
          );
        }
      } else {
        this.popupMessageService.showError(
          "OOPs! It seems you don't select any document type. Please Select Document type before uploading the file.",
          "Required Field Error!"
        );
      }
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  /**
   * Getting upload document master data
   */
  getUploadDocumentName() {
    if (localStorage.getItem("emp_auth_key")) {
      this.leadListService
        .getUploadMasterData(this.documentsToBeUploaded)
        .subscribe(
          data => {
            if (data.status == 1) {
              this.documentList = this.convertForSelect(data.data);
            } else {
              this.alertService.error(data.error_message);
            }
          },
          error => {
            console.log("Error in response");
          }
        );
    } else {
      this.route.navigateByUrl("/employee/login");
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
        arrPush.push({
          value: String(item.document_name),
          label: String(item.document_name)
        });
        // }
      }
      return arrPush;
    }
  }

  /**
   * Create kart form
   */
  Ccmails: any;
  createKartRequestForm() {
    this.kartRequest = this.formBuilder.group({
      project_id: [this.currentProjectId],
      first_name: [ "", Validators.compose([ Validators.required ]) ],
      last_name: [ "", Validators.compose([ Validators.required ]) ],
      email: [ "", Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ])
      ],
      pincode: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\(??([0-9]{6})$/)
        ])
      ],
      state: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required])],
      propdtl_solndesigner_id: ["", Validators.compose([Validators.required])],
      proposal_dc_capacity: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      proposal_solution_type: ["", Validators.compose([Validators.required])],
      bos_equipments:this.formBuilder.array([]),
      proposal_panel_type: ["2", Validators.compose([Validators.required])],
      //  no_of_solar_panel : ['', Validators.compose([Validators.required])],
      module_capacity: [
        "330",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      number_of_solar_panel: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      proposal_syncValue: [''],
      proposal_syncAmount: [''],
      // height_mm: ['', Validators.compose([Validators.required])],
      proposal_advanced: [
        "25",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      // proposal_advanced_des:['Advance payment along with Purchase order',Validators.required],
      proposal_payment_2: [
        "70",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      // proposal_payment_2_des:['Payment against Proforma Invoice',Validators.required],
      proposal_payment_3: [
        "5",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      netMeteringcost:[""],
      // proposal_payment_3_des:['3rd tranche at the time of installation',Validators.required],
      // proposal_payment_4_des:['Final Tranche Amount'],
      tranche_description:this.formBuilder.array([
        new FormControl('Advance payment along with Purchase order',Validators.required),
        new FormControl('Payment against Proforma Invoice',Validators.required),
        new FormControl('Before Material Dispatch',Validators.required),
        new FormControl('Final Tranche Amount')
      ]),
      proposal_advance_silver: [
        "50",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      proposal_advance_silver_1: [
        "45",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      proposal_advance_silver_2: [
        "5",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],

      global_solr_irr: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      electricity_terrif: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)
        ])
      ],
      proposal_details_id: [""],
      no_of_spgs: [
        "1",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      proposal_inverter_number: ["", Validators.compose([Validators.required])],

      proposal_inverter_rating: [
        "",
        Validators.compose([
          Validators.required,
          //Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)
        ])
      ],
      proposal_inverter_phase: ["", Validators.compose([Validators.required])],
      proposal_inverter_quantity: [
        "",
        Validators.compose([Validators.required])
      ],

      proposal_inverter_rating2: [""],
      proposal_inverter_phase2: [""],
      proposal_inverter_quantity2: [""],

      proposal_inverter_rating3: [""],
      proposal_inverter_phase3: [""],
      proposal_inverter_quantity3: [""],

      proposal_structure_type: ["", Validators.compose([Validators.required])],
      proposal_service_support: [
        "Onsite service support against break-down call during the warranty period",
        Validators.compose([Validators.required])
      ],
      proposal_amc: [
        "Comprehensive AMC available on chargeable basis",
        Validators.compose([Validators.required])
      ],
      amc_maintanace: [
        "Four (4) on-site quarterly preventive maintenance visits shall be provided during the first year."
      ],
      amc_option: [""],
      amc_charge: [""],
      proposal_pricing_options: ["", Validators.compose([Validators.required])],
      proposal_solar_pv_panels_gold: ["Luminous Solar Panels"],
      proposal_solar_pv_panels_silver: ["Luminous Panel"],
      proposal_earthing_pv_protection_system_gold: [
        "Copper bonded earthing & Franklin type L.A."
      ],
      proposal_earthing_pv_protection_system_silver: [
        "GI bonded earthing & Franklin type L.A."
      ],
      project_value_gold: [""],
      proposal_type:['',Validators.required],
      proposal_addition_email_text: [""],
      project_value_silver: [""],
      proposal_emi_option: ["", Validators.compose([Validators.required])],
      proposal_emi_gold: ["", Validators.compose([Validators.required])],
      proposal_emi_silver: ["", Validators.compose([Validators.required])],
      proposal_remote_monitoring_system_gold: [
        "RMS unit & 1Years data pack included in package."
      ],
      proposal_remote_monitoring_system_silver: [
        "RMS unit available. Data pack to be availed by customer"
      ],
      proposal_maintenance_gold: ["4 Visits in First Year"],
      proposal_maintenance_silver: ["2 Visits in First Year"],
      proposal_insurance_gold: ["1 Year"],
      proposal_insurance_silver: ["Not included in the package"],
      discom: ["", Validators.compose([Validators.required])],
      StrucBOM: [""],
      GTIphase: [""], // Is Equal to SPGS
      Dlvryweeks: ["4",Validators.required],
      Installweeks: ["6"],
      Offrvalidays: ["7"],
      ModNoofcells: ["72"],
      ACDBqty: ["1"],
      Dccablecore: ["1"],
      Dccablesqmm: ["4"],
      Accablecore: [""],
      Accablesqmm: [""],
      Accablelen: [
        "20"
      ],
      EarthingDia: [
        "14.2"
      ],
      EarthingLen: [
        "2.0"
      ],
      EarthingNos: ["3"],
      NoofLA: ["1"],
      BuildingType: ["", Validators.compose([Validators.required])],
      cceld_sitetype:["",Validators.required],
      AvgMonthlyBill: ["", Validators.compose([Validators.required])],
      AvgPowerCut: ["", Validators.compose([Validators.required])],
      RoofType: ["", Validators.compose([Validators.required])],
      CcEmail: [this.Ccmails, Validators.compose([Validators.required])],
      proposal_email_signature: ["", Validators.compose([Validators.required])],
      sf_sanctioned_load_capacity: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/),
          Validators.min(1)
        ])
      ],
      proposal_solar_battery: [
        "Luminous Tubular Solar Battery, C-10 Type"
      ],
      inverter_voltage: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)
        ])
      ],
      battery_capacity: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)
        ])
      ],
      battery_volt: [
        "12",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)
        ])
      ],
      battery_nos: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)
        ])
      ],
      proposal_insolated_city: ["", Validators.compose([Validators.required])],
      is_discount: [""],
      discount: [""],
      avg_running_load: ["", Validators.compose([Validators.required])],
      battery_series: ["", Validators.compose([Validators.required])],
      sf_connection_type: ["", Validators.compose([Validators.required])],
      cceld_address1: ["", Validators.compose([Validators.required])],
      cceld_address2: [""],
      discount_silver: [
        "",
        Validators.compose([
          Validators.pattern(/^[0-9]\d*$/)
        ])
      ],
      // <Inverter Voltage> Battery Capacity (in AH) <Battery Volt> Battery nos
      payment_split: ["", Validators.compose([Validators.required])],
      proposal_payment_4: [""],
      proposal_advance_silver_3: [""],
      is_capex: [""],
      is_opex: [""],
      equipments: this.formBuilder.array([]),
      payBackFormArray: this.formBuilder.array([]),
       degradation: [""],
      escalation: [""],
      bank_finance: [""],
      estimated_loan: [""],
      interest_rate: [""],
      repayment_period: [""],
      corporate_tax_rate: ["0"],
      discounted_rate: ["0"],
      deprication: ["0"],
      payment_security_period: [""],
      ppa_tarif: [""],
      ppa_tenure: [""],
      paybackValidation:[""],
      proposal_dc_capacity_val :["",Validators.compose([ Validators.required])],

      // platform_charges: [ "", Validators.compose([ Validators.required ]) ],
      // material_cost: [ "", Validators.compose([ Validators.required ]) ],
      // partner_cost: [ "", Validators.compose([ Validators.required ]) ],

    });
    this.formControlValueChanged();
    this.allStatesAndCitiesData();
    this.updateKartRequestValues();
    this.getInsolationCity();
  }

  resetGoldFormData() {
    this.kartRequest.controls.project_value_gold.setValue(0);
    this.kartRequest.controls.proposal_advanced.setValue(0);
    this.kartRequest.controls.proposal_payment_2.setValue(0);
    this.kartRequest.controls.proposal_payment_3.setValue(0);
    this.kartRequest.controls.proposal_payment_4.setValue(0);
    this.kartRequest.controls.proposal_emi_gold.setValue(0);
  }
  resetSilverFormData() {
    this.kartRequest.controls.project_value_silver.setValue(0);
    this.kartRequest.controls.proposal_advance_silver.setValue(0);
    this.kartRequest.controls.proposal_advance_silver_1.setValue(0);
    this.kartRequest.controls.proposal_advance_silver_2.setValue(0);
    this.kartRequest.controls.proposal_advance_silver_3.setValue(0);
    this.kartRequest.controls.proposal_emi_silver.setValue(0);
  }

  /**
   * submit call reschedule request data
   */
  submitKartRequest() {
     window.scroll(0,0);
     this.isSubmitKartRequest = true;
     this.formsection="";
    this.kartRequest.controls.project_id.setValue(this.currentProjectId);
    this.sol_id = JSON.parse(localStorage.getItem("userData"));
    let data_sol_id = this.sol_id.emp_id;
    this.kartRequest.controls.propdtl_solndesigner_id.setValue(data_sol_id);
    let projectOption = this.kartRequest.controls.proposal_pricing_options.value;
    this.paymentPercentageCheck();
    this.paymentPercentageCheck_silver();

    let error = 0;
    if (projectOption == 1) {
      this.resetSilverFormData();
      if (this.payment_percentage_check == 0) {
        error++;
      }
    } else if (projectOption == 2) {
      this.resetGoldFormData();
      if (this.payment_percentage_check_silver == 0) {
        error++;
      }
    } else if (projectOption == 3) {
      if (
        this.payment_percentage_check == 0 ||
        this.payment_percentage_check_silver == 0
      ) {
        error++;
      }
    }
    this.findInvalidControls();
   if (this.kartRequest.valid && error == 0) {
      this.actionLoader = "fillKart_loader";
            if(this.off_grid && this.displayEquip && this.ComponentData[2].description){
              this.kartRequest.controls.StrucBOM.setValue(this.ComponentData[2].description);
              if(this.displayEquip){
                if(this.selectePricingOption =='1'){
                  this.kartRequest.get('proposal_insurance_gold').setValue(this.ComponentData[this.ComponentData.length-1].warranty);
                }
                if(this.selectePricingOption =='2'){
                  this.kartRequest.get('proposal_insurance_silver')
                  .setValue(this.ComponentData[this.ComponentData.length-1].warranty);
                }
              }
            }
           this.leadListService.requestKartValue(this.kartRequest.value).subscribe( data => {
            if (data.status == 1) {
              this.leadListService .pdfCreate(this.kartRequest.value).subscribe(data => {
                  if (data.status == 1) {
                    this.getUploadedDocumentsForSolDesigner(this.currentProjectId);
                    this.openProjectChecklistDetails(this.currentProjectId,this.consumerID);
                    this.actionLoader = "";
                  }
                });
                this.popupMessageService.showSuccess("Proposal detail Submitted Successfully", "Success!");

                // this.actionLoader = "";
            } else {
              this.popupMessageService.showError( data.error_message,"Failure!");
              this.actionLoader = "";
            }
          },
          error => {
            this.alertService.error(JSON.parse(error.body).non_field_errors);
            this.actionLoader = "";
          }
        );
    } else {
      Object.keys(this.kartRequest.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.kartRequest.get(key)
          .errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log(
              "Key control: " +
                key +
                ", keyError: " +
                keyError +
                ", err value: ",
              controlErrors[keyError]
            );
          });
        }
      });
      this.popupMessageService.showError("Insufficient Data!!", "error");
    }
  }

  get bos_equipments(){
    return this.kartRequest.get('bos_equipments') as FormArray;
  }
  get equipments(){
    return this.kartRequest.get('equipments') as FormArray;
  }

  onComponentData(event,data){
    if(event.target.checked){
     let doesExits= this.bos_equipments.value.findIndex(val=>{
      return val.component==data.component
      })
      if(doesExits ==-1){
       this.bos_equipments.push(new FormControl(data));
      // let finderIndex=this.ComponentData.findIndex(val=>val.component == data.component);
      // if(finderIndex!=-1){
      //  this.bos_equipments.insert(finderIndex,new FormControl(data));
      // }
      }
    }
    else{
          let index= this.bos_equipments.value.findIndex(val=>{
          return val.component==data.component;
              })
              if(index !=-1){
                this.bos_equipments.removeAt(index);
              }
        }
        this.bos_equipments.value.sort((a,b)=>{
          if(a.id > b.id){
            return 1;
          }
          else if(a.id<b.id){
            return -1;
          }
          else{
            return 0;
          }
        })
   }
  onEquipmentData(event,data){
    if(event.target.checked){
      let doesExits= this.equipments.value.findIndex(val=>{
       return val.component==data.component
       })
       if(doesExits ==-1){
         this.equipments.push(new FormControl(data));
       }
     }
     else{
       let index= this.equipments.value.findIndex(val=>{
         return val.component==data.component;
               })
               if(index !=-1){
                 this.equipments.removeAt(index);
            }
     }

     this.equipments.value.sort((a,b)=>{
       if(a.id>b.id){
         return 1;
       }
       else if(a.id<b.id){
         return -1;
       }
       else{
         return 0;
       }
     })

  }

  getPaymentList(type: string) {
    this.showSmartSearchComponent = false;
    this.isListing = "payment-release";
    this.paymentList = [];
    this.leadListService.getPaymentList(type).subscribe(
      data => {
        if (data.status) {
          this.paymentList = data.data;
        } else {
          this.popupMessageService.showError(data.error_message, "Error!");
        }
      },
      error => {
        this.popupMessageService.showError("Server Error.", "Error!");
      }
    );
  }

  getReleaseForm(item: any) {
    this.isReleaseForm = true;
    localStorage.setItem("selectedForRelease", JSON.stringify(item));
    this.createReleaseForm();
    this.releasePaymentAmount.patchValue({
      partner_id: item.project_partner
    });
  }

  get CustomerFormError(){
    return this.isSubmitKartRequest?(this.kartRequest.get('first_name').invalid || this.kartRequest.get('last_name').invalid ||this.kartRequest.get('email').invalid||
    this.kartRequest.get('cceld_address1').invalid || this.kartRequest.get('cceld_address2').invalid || this.kartRequest.get('pincode').invalid||
    this.kartRequest.get('state').invalid||this.kartRequest.get('city').invalid||this.kartRequest.get('CcEmail').invalid ||this.kartRequest.get('BuildingType').invalid||
    this.kartRequest.get('cceld_sitetype').invalid||this.kartRequest.get('electricity_terrif').invalid ||this.kartRequest.get('discom').invalid||this.kartRequest.get('AvgMonthlyBill').invalid||
    this.kartRequest.get('AvgPowerCut').invalid||this.kartRequest.get('proposal_dc_capacity_val').invalid||this.kartRequest.get('RoofType').invalid||this.kartRequest.get('sf_sanctioned_load_capacity').invalid||this.kartRequest.get('sf_connection_type').invalid):''
  }

  get SolarComponentsError(){
    return this.isSubmitKartRequest?(this.kartRequest.get('proposal_solution_type').invalid || this.kartRequest.get('avg_running_load').invalid ||this.kartRequest.get('proposal_inverter_number').invalid||
    this.kartRequest.get('proposal_inverter_rating').invalid || this.kartRequest.get('proposal_inverter_phase').invalid || this.kartRequest.get('proposal_inverter_quantity').invalid||
    this.kartRequest.get('proposal_inverter_rating2').invalid||this.kartRequest.get('proposal_inverter_phase2').invalid||this.kartRequest.get('proposal_inverter_quantity2').invalid ||this.kartRequest.get('proposal_inverter_rating3').invalid||
    this.kartRequest.get('proposal_inverter_phase3').invalid||this.kartRequest.get('proposal_inverter_quantity3').invalid ||this.kartRequest.get('number_of_solar_panel').invalid||this.kartRequest.get('module_capacity').invalid||
    this.kartRequest.get('proposal_dc_capacity').invalid||this.kartRequest.get('proposal_panel_type').invalid||this.kartRequest.get('proposal_insolated_city').invalid||this.kartRequest.get('global_solr_irr').invalid||
    this.kartRequest.get('no_of_spgs').invalid||this.kartRequest.get('proposal_syncValue').invalid||this.kartRequest.get('proposal_syncAmount').invalid||this.kartRequest.get('global_solr_irr').invalid):''
  }

  get PricingandValueOfferingsError(){
    if(!(this.displayEquip && this.off_grid)){
      return this.isSubmitKartRequest?(this.kartRequest.get('StrucBOM').invalid || this.kartRequest.get('proposal_service_support').invalid ||this.kartRequest.get('proposal_amc').invalid||
    this.kartRequest.get('amc_maintanace').invalid || this.kartRequest.get('amc_option').invalid || this.kartRequest.get('amc_charge').invalid||
    this.kartRequest.get('proposal_structure_type').invalid||this.kartRequest.get('proposal_emi_option').invalid||this.kartRequest.get('is_discount').invalid ||this.kartRequest.get('proposal_pricing_options').invalid||
    this.kartRequest.get('proposal_solar_pv_panels_gold').invalid||this.kartRequest.get('proposal_solar_pv_panels_silver').invalid ||this.kartRequest.get('proposal_solar_battery').invalid||this.kartRequest.get('proposal_earthing_pv_protection_system_gold').invalid||
    this.kartRequest.get('proposal_earthing_pv_protection_system_silver').invalid||this.kartRequest.get('project_value_gold').invalid||this.kartRequest.get('project_value_silver').invalid||this.kartRequest.get('payment_split').invalid||
    this.kartRequest.get('proposal_advanced').invalid||this.kartRequest.get('proposal_advance_silver').invalid||this.kartRequest.get('proposal_payment_2').invalid||this.kartRequest.get('proposal_advance_silver_1').invalid||
    this.kartRequest.get('proposal_payment_3').invalid||this.kartRequest.get('proposal_advance_silver_2').invalid||this.kartRequest.get('proposal_payment_4').invalid||this.kartRequest.get('proposal_advance_silver_3').invalid||
    this.kartRequest.get('proposal_emi_gold').invalid||this.kartRequest.get('proposal_emi_silver').invalid||this.kartRequest.get('discount').invalid||this.kartRequest.get('discount_silver').invalid||
    this.kartRequest.get('proposal_remote_monitoring_system_gold').invalid||this.kartRequest.get('proposal_remote_monitoring_system_silver').invalid||this.kartRequest.get('proposal_maintenance_gold').invalid||this.kartRequest.get('proposal_maintenance_silver').invalid||
    this.kartRequest.get('proposal_insurance_gold').invalid||this.kartRequest.get('proposal_insurance_silver').invalid||this.kartRequest.get('proposal_addition_email_text').invalid):''
    }
    else{
      return this.isSubmitKartRequest?(this.kartRequest.get('StrucBOM').invalid || this.kartRequest.get('proposal_service_support').invalid ||this.kartRequest.get('proposal_amc').invalid||
    this.kartRequest.get('amc_maintanace').invalid || this.kartRequest.get('amc_option').invalid || this.kartRequest.get('amc_charge').invalid||
     this.kartRequest.get('proposal_emi_option').invalid||this.kartRequest.get('is_discount').invalid ||this.kartRequest.get('proposal_pricing_options').invalid||
    this.kartRequest.get('proposal_solar_pv_panels_gold').invalid||this.kartRequest.get('proposal_solar_pv_panels_silver').invalid ||this.kartRequest.get('proposal_solar_battery').invalid||this.kartRequest.get('proposal_earthing_pv_protection_system_gold').invalid||
    this.kartRequest.get('proposal_earthing_pv_protection_system_silver').invalid||this.kartRequest.get('project_value_gold').invalid||this.kartRequest.get('project_value_silver').invalid||this.kartRequest.get('payment_split').invalid||
    this.kartRequest.get('proposal_advanced').invalid||this.kartRequest.get('proposal_advance_silver').invalid||this.kartRequest.get('proposal_payment_2').invalid||this.kartRequest.get('proposal_advance_silver_1').invalid||
    this.kartRequest.get('proposal_payment_3').invalid||this.kartRequest.get('proposal_advance_silver_2').invalid||this.kartRequest.get('proposal_payment_4').invalid||this.kartRequest.get('proposal_advance_silver_3').invalid||
    this.kartRequest.get('proposal_emi_gold').invalid||this.kartRequest.get('proposal_emi_silver').invalid||this.kartRequest.get('discount').invalid||this.kartRequest.get('discount_silver').invalid||
    this.kartRequest.get('proposal_remote_monitoring_system_gold').invalid||this.kartRequest.get('proposal_remote_monitoring_system_silver').invalid||this.kartRequest.get('proposal_maintenance_gold').invalid||this.kartRequest.get('proposal_maintenance_silver').invalid||
    this.kartRequest.get('proposal_insurance_gold').invalid||this.kartRequest.get('proposal_insurance_silver').invalid||this.kartRequest.get('proposal_addition_email_text').invalid):''
    }
  }

  get BoSEquipmentDetailsError(){
    if(this.displayEquip && this.off_grid){
      return this.isSubmitKartRequest?(this.kartRequest.get('inverter_voltage').invalid || this.kartRequest.get('battery_series').invalid ||this.kartRequest.get('battery_capacity').invalid||
    this.kartRequest.get('battery_volt').invalid || this.kartRequest.get('battery_nos').invalid || this.kartRequest.get('Dlvryweeks').invalid||
    this.kartRequest.get('proposal_structure_type').invalid||this.kartRequest.get('Installweeks').invalid||this.kartRequest.get('Offrvalidays').invalid ||this.kartRequest.get('ACDBqty').invalid||
    this.kartRequest.get('Dccablecore').invalid||this.kartRequest.get('Dccablesqmm').invalid ||this.kartRequest.get('Accablecore').invalid||this.kartRequest.get('Accablesqmm').invalid||
    this.kartRequest.get('Accablelen').invalid||this.kartRequest.get('EarthingDia').invalid||this.kartRequest.get('EarthingLen').invalid||this.kartRequest.get('EarthingNos').invalid||
    this.kartRequest.get('ModNoofcells').invalid||this.kartRequest.get('NoofLA').invalid):''
    }
    else{
      return this.isSubmitKartRequest?(this.kartRequest.get('inverter_voltage').invalid || this.kartRequest.get('battery_series').invalid ||this.kartRequest.get('battery_capacity').invalid||
    this.kartRequest.get('battery_volt').invalid || this.kartRequest.get('battery_nos').invalid || this.kartRequest.get('Dlvryweeks').invalid||
    this.kartRequest.get('Installweeks').invalid||this.kartRequest.get('Offrvalidays').invalid ||this.kartRequest.get('ACDBqty').invalid||
    this.kartRequest.get('Dccablecore').invalid||this.kartRequest.get('Dccablesqmm').invalid ||this.kartRequest.get('Accablecore').invalid||this.kartRequest.get('Accablesqmm').invalid||
    this.kartRequest.get('Accablelen').invalid||this.kartRequest.get('EarthingDia').invalid||this.kartRequest.get('EarthingLen').invalid||this.kartRequest.get('EarthingNos').invalid||
    this.kartRequest.get('ModNoofcells').invalid||this.kartRequest.get('NoofLA').invalid):''
    }
  }

  get FinancialandPaybackCalculationError(){
    if(this.off_grid){
      return this.isSubmitKartRequest?(this.kartRequest.get('paybackValidation').invalid ||this.kartRequest.get('degradation').invalid || this.kartRequest.get('escalation').invalid ||this.kartRequest.get('bank_finance').invalid||
      this.kartRequest.get('estimated_loan').invalid || this.kartRequest.get('interest_rate').invalid || this.kartRequest.get('repayment_period').invalid||
      this.kartRequest.get('corporate_tax_rate').invalid||this.kartRequest.get('discounted_rate').invalid ||this.kartRequest.get('deprication').invalid||
      this.kartRequest.get('ppa_tarif').invalid||this.kartRequest.get('payment_security_period').invalid ||this.kartRequest.get('ppa_tenure').invalid):''
    }
  }

  // get ChargeFormError() {
  //   return this.isSubmitKartRequest?(this.kartRequest.get('platform_charges').invalid || this.kartRequest.get('material_cost').invalid ||this.kartRequest.get('partner_cost').invalid):'';
  // }


  createReleaseForm() {
    this.releasePaymentAmount = this.formBuilder.group(
      {
        partner_id: ["", Validators.compose([Validators.required])],
        release_payment_amount: ["", Validators.compose([Validators.required])]
      },
      {
        validator: this.maximumValue("release_payment_amount")
      }
    );
  }
  onAmcOptionChange(event){
    if(event && (event.target.value=='0')){
      if(this.proposalEmailData.proposalDetails.amc_charge){
        let amc=this.proposalEmailData.proposalDetails.amc_charge.split(':');
      if(amc[0]=='0'&&amc[1]){
        this.kartRequest.get('amc_charge').setValue(amc[1]);
      }
      }
      // else{
      //   this.kartRequest.get('amc_charge').setValue('');
      // }
    }
    if(event && (event.target.value=='1' || event.target.value=='2' )){
      if(event.target.value=='2'){
        this.kartRequest.get('amc_charge').setValue('');
      }
      else{
        if(this.proposalEmailData.proposalDetails.amc_charge){
         let amcOpt=this.proposalEmailData.proposalDetails.amc_charge.split(':');
        if(amcOpt[0]==1){
          this.kartRequest.get('amc_charge').setValue(amcOpt[1]);
        }
        else{
          this.kartRequest.get('amc_charge').setValue('');
        }
        }
        else{
          this.kartRequest.get('amc_charge').setValue('');
        }
      }
    }
  }

  cancelReleasePayment() {
    localStorage.removeItem("selectedForRelease");
    this.isReleaseForm = false;
  }

  maximumValue(amount: string) {
    return (ac: AbstractControl) => {
      let release_amount = ac.get(amount);
      if (release_amount.value != "") {
        if (
          parseInt(release_amount.value) >
          parseInt(
            JSON.parse(localStorage.getItem("selectedForRelease")).amount
          )
        ) {
          release_amount.setErrors({ greaterThan: true });
        }
      }
    };
  }

  onNoOfSolarPanelBlur(event){
      let value=event.target.value;
      this.ComponentData[1].qty=value+' '+'Nos';
      let isSolarPvPanel=this.bos_equipments.value.findIndex(val=>val.component=='Solar PV Panel');
      if(isSolarPvPanel !=-1){
        this.bos_equipments.value.splice(isSolarPvPanel,1,this.ComponentData[1]);
      }

  }

  releasePayment() {
    this.isFormSubmitted = true;
    let transactionData = JSON.parse(
      localStorage.getItem("selectedForRelease")
    );
    let params = {
      partner_id: this.releasePaymentAmount.get("partner_id").value,
      release_amount: this.releasePaymentAmount.get("release_payment_amount")
        .value,
      lum_transaction_id: transactionData.luminous_transaction_id,
      consumer_id: transactionData.consumer_id,
      payment_category: transactionData.payment_category,
      project_id: transactionData.project_id
    };
    if (this.releasePaymentAmount.valid) {
      this.leadListService
        .savePaymentReleaseData(params)
        .subscribe(
          data => {
            if (data.status) {
              this.popupMessageService.showSuccess(data.data, "Success");
              this.isReleaseForm = false;
              this.getPaymentList("S");
            } else {
              this.popupMessageService.showError(data.error_message, "Error!");
            }
          },
          error => {
            this.popupMessageService.showError("Server Error.", "Error!");
          }
        );
    }
  }
  checkIfRemarkable(state) {
    // this.isSubmitChecklist=false;
    const remarks = this.checklistSubmitForm.get("remarks");
    const closeReason = this.checklistSubmitForm.get("project_close_reason");
    if (this.rejectionChecklists.indexOf(state) > -1) {
      remarks.setValidators([Validators.required]);
      // this.checklistSubmitForm.controls.remarks.setValidators([Validators.required]);
      remarks.updateValueAndValidity();
      this.isRemarkable = true;

      if (state == 46) {
        closeReason.setValidators([Validators.required]);
        closeReason.updateValueAndValidity();
        this.isCloseReason = true;
      } else {
        closeReason.clearValidators();
        closeReason.updateValueAndValidity();
        this.isCloseReason = false;
      }
    } else {
      remarks.clearValidators();
      // this.checklistSubmitForm.controls.remarks.setValidators(null);
      remarks.updateValueAndValidity();
      closeReason.clearValidators();
      closeReason.updateValueAndValidity();
      this.isRemarkable = false;
      this.isCloseReason = false;
      // console.log(this.checklistSubmitForm.controls.remarks);
    }
  }
  show_dialog: boolean;

  numberOfSolarInverter: any = 1;
  createAmountValidation(){
    this.kartRequest.get('proposal_syncAmount')
    .setValidators(Validators.required);
    this.kartRequest.get('proposal_syncAmount')
    .updateValueAndValidity();
  }
  createInvertorAccessoriesValidation(){
    this.kartRequest.get('proposal_syncValue')
    .setValidators(Validators.required);
    this.kartRequest.get('proposal_syncValue')
    .updateValueAndValidity();
  }
  removeAmountValidation(){
    this.kartRequest.get('proposal_syncAmount')
    .clearValidators()
    this.kartRequest.get('proposal_syncAmount')
    .updateValueAndValidity()
  }
  removeInvertorAccessoriesValidation(){
    this.kartRequest.get('proposal_syncValue')
    .clearValidators()
    this.kartRequest.get('proposal_syncValue')
    .updateValueAndValidity()
  }


  formControlValueChanged() {
    let advanceGold = this.kartRequest.get("proposal_advanced");
    let advanceGold_1 = this.kartRequest.get("proposal_payment_2");
    let advanceGold_2 = this.kartRequest.get("proposal_payment_3");
    let advanceGold_3 = this.kartRequest.get("proposal_payment_4");
    let emiGold = this.kartRequest.get("proposal_emi_gold");
    let projectValueGold = this.kartRequest.get("project_value_gold");
    let advanceSilver = this.kartRequest.get("proposal_advance_silver");
    let advanceSilver_1 = this.kartRequest.get("proposal_advance_silver_1");
    let advanceSilver_2 = this.kartRequest.get("proposal_advance_silver_2");
    let advanceSilver_3 = this.kartRequest.get("proposal_advance_silver_3");
    let emiSilver = this.kartRequest.get("proposal_emi_silver");
    let projectValueSilver = this.kartRequest.get("project_value_silver");

    let inverter_voltage = this.kartRequest.get("inverter_voltage");
    let battery_capacity = this.kartRequest.get("battery_capacity");
    let battery_volt = this.kartRequest.get("battery_volt");
    let battery_nos = this.kartRequest.get("battery_nos");
    let GTIphase = this.kartRequest.get("GTIphase");
    let proposal_remote_monitoring_system_gold = this.kartRequest.get(
      "proposal_remote_monitoring_system_gold"
    );
    let proposal_remote_monitoring_system_silver = this.kartRequest.get(
      "proposal_remote_monitoring_system_silver"
    );
    let accessoriesAmount=this.kartRequest.get('proposal_syncAmount');


    let payment_split = this.kartRequest.get("payment_split");
    this.kartRequest
      .get("payment_split")
      .valueChanges.subscribe((mode: number) => {
        let proposal_solution_type = this.kartRequest.get(
          "proposal_solution_type"
        );
        if (mode == 4) {
          this.updateProposaladvanceValue(mode, proposal_solution_type.value);
          this.show_dialog = true;
        } else {
          this.updateProposaladvanceValue(mode, proposal_solution_type.value);
          this.show_dialog = false;

          advanceGold_3.clearValidators();
          advanceSilver_3.clearValidators();
        }
        advanceGold_3.updateValueAndValidity();
        advanceSilver_3.updateValueAndValidity();
      });

      this.kartRequest
      .get('proposal_syncValue')
      .valueChanges
      .subscribe(val=>{
        if(val){
          if(val =="none"){
            accessoriesAmount.setValue('');
            accessoriesAmount.disable();
            accessoriesAmount.clearValidators();
          }
          else{
            accessoriesAmount.enable();
            accessoriesAmount.setValidators(Validators.required);
          }
          accessoriesAmount.updateValueAndValidity();
        }
      })

      this.kartRequest
      .get('module_capacity')
      .valueChanges
      .subscribe(val=>{
        console.log(val);
        //this.ComponentData[1].description="330-Wp-72Cells Poly-Crystalline Luminous Solar PV Modules";
        this.ComponentData[1].description= val + "-Wp-"+ this.kartRequest
        .get('proposal_panel_type').value + " Luminous Solar PV Modules";

        console.log(this.proposalPanelType[this.kartRequest
          .get('proposal_panel_type').value])
        if(val){
         this.calculateDCapacity();
        }
      })

      this.kartRequest
      .get('proposal_panel_type')
      .valueChanges
      .subscribe(val=>{
        console.log(val);
        //this.ComponentData[1].description="330-Wp-72Cells Poly-Crystalline Luminous Solar PV Modules";
        this.ComponentData[1].description= this.kartRequest
        .get('module_capacity').value + "-Wp-"+ this.proposalPanelType[val] + " Luminous Solar PV Modules";

        console.log(this.proposalPanelType[this.kartRequest
          .get('proposal_panel_type').value])
        if(val){
         this.calculateDCapacity();
        }
      })


      this.kartRequest
      .get("proposal_insolated_city")
      .valueChanges.subscribe((mode: string) => {
        // console.log(mode+"proposal_insolated_city");
        this.kartRequest.controls.global_solr_irr.setValue(mode + "");
      });

      this.kartRequest.get('amc_option')
      .valueChanges.subscribe(value=>{
        if(value){
          if(value ==0){
            this.kartRequest.get('amc_charge').setValidators(Validators.required);
            this.kartRequest.get('amc_charge').updateValueAndValidity();
            // let proposal_inverter_rating=this.kartRequest.get('proposal_inverter_rating').value;
            let proposal_dc_capacity =this.kartRequest.get('proposal_dc_capacity').value;
            // amc_option
            let amc_charge=this.kartRequest.get('amc_charge');
            if(!(this.proposalEmailData.proposalDetails.amc_charge &&this.proposalEmailData.proposalDetails.amc_charge.split(':')[0]=='0'&&
              this.proposalEmailData.proposalDetails.amc_charge.split(':')[1])){
                if(proposal_dc_capacity){
                  if(proposal_dc_capacity<=50){
                    if(proposal_dc_capacity>=1 && proposal_dc_capacity<=4){
                      amc_charge.setValue('6,300');
                    }
                    if(proposal_dc_capacity >=5 && proposal_dc_capacity <=10){
                      amc_charge.setValue('10,000');
                    }
                    if(proposal_dc_capacity>=11 && proposal_dc_capacity <=25 ){
                      amc_charge.setValue('15,500');
                    }
                    if(proposal_dc_capacity>=26 && proposal_dc_capacity <=50 ){
                      amc_charge.setValue('20,000');
                    }
                  }
                  else{
                    if(proposal_dc_capacity>50){
                      let Calculated=Math.round((proposal_dc_capacity/50)*20000);
                      amc_charge.setValue(Calculated);
                    }
                  }
                }
            }
          }
          if(value ==1 || value ==2){
            // this.kartRequest.get('amc_charge').setValue('');
            if(value ==1){
              this.kartRequest.get('amc_charge').setValidators(Validators.required);
              this.kartRequest.get('amc_charge').updateValueAndValidity();
            }
            if(value ==2){
              this.kartRequest.get('amc_charge').clearValidators();
              this.kartRequest.get('amc_charge').updateValueAndValidity();
            }
          }
        }
      })

      this.kartRequest.get('proposal_dc_capacity')
      .valueChanges.subscribe((value)=>{
        if(value){
          let amc_option=this.kartRequest.get('amc_option').value;
          let amc_charge=this.kartRequest.get('amc_charge');
           if(amc_option && amc_option ==0){
             if(value<=50){
              if(value>=1 && value<=4){
                amc_charge.setValue('6,300');
              }
              if(value>=5 && value<=10){
                amc_charge.setValue('10,000');
              }
              if(value>=11 && value<=25 ){
                amc_charge.setValue('15,500');
              }
              if(value>=26 && value<=50){
                amc_charge.setValue('20,000');
              }
             }
             else{
              if(value>50){
              let Calculated=Math.round((value/50)*20000);
              amc_charge.setValue(Calculated);
            }
             }
           }
        }
      })
      this.kartRequest
      .get("proposal_inverter_rating")
      .valueChanges.subscribe((mode: number) => {
        // console.log(mode+"proposal_inverter_rating");
        let proposal_solution_type_value = this.kartRequest.value
          .proposal_solution_type;
        if (proposal_solution_type_value == 1) {
          if (mode >= 1 && mode < 1.5) {
            this.kartRequest.controls.Accablecore.setValue("2");
            this.kartRequest.controls.Accablesqmm.setValue("4");
          } else if (mode >= 1.5 && mode < 2) {
            this.kartRequest.controls.Accablecore.setValue("2");
            this.kartRequest.controls.Accablesqmm.setValue("4");
          } else if (mode >= 2 && mode < 3) {
            this.kartRequest.controls.Accablecore.setValue("2");
            this.kartRequest.controls.Accablesqmm.setValue("4");
          } else if (mode >= 3 && mode < 4) {
            this.kartRequest.controls.Accablecore.setValue("2");
            this.kartRequest.controls.Accablesqmm.setValue("4");
          } else if (mode >= 4 && mode < 5) {
            this.kartRequest.controls.Accablecore.setValue("2");
            this.kartRequest.controls.Accablesqmm.setValue("4");
          } else if (mode >= 5 && mode < 6) {
            if (
              this.kartRequest.value.proposal_inverter_phase == "Three Phase"
            ) {
              this.kartRequest.controls.Accablecore.setValue("4");
              this.kartRequest.controls.Accablesqmm.setValue("6");
            } else {
              this.kartRequest.controls.Accablecore.setValue("2");
              this.kartRequest.controls.Accablesqmm.setValue("6");
            }
          } else if (mode >= 6 && mode < 8) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("6");
          } else if (mode >= 8 && mode < 10) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("6");
          } else if (mode >= 10 && mode < 12) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("6");
          } else if (mode >= 12 && mode < 15) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("6");
          } else if (mode >= 15 && mode < 20) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("10");
          } else if (mode >= 20 && mode < 25) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("16");
          } else if (mode >= 25 && mode < 30) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("16");
          } else if (mode >= 30 && mode < 50) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("25");
          } else if (mode == 50) {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("35");
          } else {
            this.kartRequest.controls.Accablecore.setValue("2");
            this.kartRequest.controls.Accablesqmm.setValue("4");
          }

          if (mode >= 6) {
            this.kartRequest.controls.proposal_inverter_phase.setValue(
              "Three Phase"
            );
          } else {
            this.kartRequest.controls.proposal_inverter_phase.setValue(
              "Single Phase"
            );
          }
        } else if (proposal_solution_type_value == 2) {
          // console.log(proposal_solution_type_value);
          var stringMode = Number(mode);
          switch (stringMode) {
            case 1:
              // console.log("1 Mode");
              this.kartRequest.controls.inverter_voltage.setValue("48");
              this.kartRequest.controls.battery_capacity.setValue("100");
              this.kartRequest.controls.battery_nos.setValue("4");
              this.kartRequest.controls.Accablecore.setValue("2");
              this.kartRequest.controls.Accablesqmm.setValue("4");
              break;
            case 2:
              // console.log("2 Mode");
              this.kartRequest.controls.inverter_voltage.setValue("48");
              this.kartRequest.controls.battery_capacity.setValue("120");
              this.kartRequest.controls.battery_nos.setValue("4");
              this.kartRequest.controls.Accablecore.setValue("2");
              this.kartRequest.controls.Accablesqmm.setValue("4");
              break;
            case 3:
              // console.log("3 Mode");
              this.kartRequest.controls.inverter_voltage.setValue("48");
              this.kartRequest.controls.battery_capacity.setValue("150");
              this.kartRequest.controls.battery_nos.setValue("4");
              this.kartRequest.controls.Accablecore.setValue("2");
              this.kartRequest.controls.Accablesqmm.setValue("4");
              break;
            case 6:
              //  console.log("6 Mode");
              this.kartRequest.controls.inverter_voltage.setValue("96");
              this.kartRequest.controls.battery_capacity.setValue("150");
              this.kartRequest.controls.battery_nos.setValue("8");
              this.kartRequest.controls.Accablecore.setValue("2");
              this.kartRequest.controls.Accablesqmm.setValue("6");
              break;
            case 7.5:
              // console.log("7.5 Mode");
              this.kartRequest.controls.inverter_voltage.setValue("120");
              this.kartRequest.controls.battery_capacity.setValue("150");
              this.kartRequest.controls.battery_nos.setValue("10");
              this.kartRequest.controls.Accablecore.setValue("2");
              this.kartRequest.controls.Accablesqmm.setValue("10");
              break;
            case 10:
              // console.log("10 Mode");
              this.kartRequest.controls.inverter_voltage.setValue(120);
              this.kartRequest.controls.battery_capacity.setValue(150);
              this.kartRequest.controls.battery_nos.setValue(10);
              this.kartRequest.controls.Accablecore.setValue("2");
              this.kartRequest.controls.Accablesqmm.setValue("16");
              break;
          }
        }
       });

       this.kartRequest
      .get("proposal_inverter_rating2")
      .valueChanges.subscribe((mode: number) => {
        let proposal_solution_type_value = this.kartRequest.value
          .proposal_solution_type;
        if (proposal_solution_type_value == 1) {
          if (mode >= 6) {
            this.kartRequest.controls.proposal_inverter_phase2.setValue(
              "Three Phase"
            );
          } else {
            this.kartRequest.controls.proposal_inverter_phase2.setValue(
              "Single Phase"
            );
          }
        }
      });

      this.kartRequest
      .get("proposal_inverter_rating3")
      .valueChanges.subscribe((mode: number) => {
        let proposal_solution_type_value = this.kartRequest.value
          .proposal_solution_type;
        if (proposal_solution_type_value == 1) {
          if (mode >= 6) {
            this.kartRequest.controls.proposal_inverter_phase3.setValue(
              "Three Phase"
            );
          } else {
            this.kartRequest.controls.proposal_inverter_phase3.setValue(
              "Single Phase"
            );
          }
        }
      });

    let proposal_inverter_phase3 = this.kartRequest.get(
      "proposal_inverter_phase3"
    );
    let proposal_inverter_quantity3 = this.kartRequest.get(
      "proposal_inverter_quantity3"
    );
    let proposal_inverter_rating3 = this.kartRequest.get(
      "proposal_inverter_rating3"
    );

    let proposal_inverter_phase2 = this.kartRequest.get(
      "proposal_inverter_phase2"
    );
    let proposal_inverter_quantity2 = this.kartRequest.get(
      "proposal_inverter_quantity2"
    );
    let proposal_inverter_rating2 = this.kartRequest.get(
      "proposal_inverter_rating2"
    );

    //validaton changes by number of solar inverter
    this.kartRequest
      .get("proposal_inverter_number")
      .valueChanges.subscribe((mode: number) => {
        //let proposal_inverter_number_value =  this.kartRequest.value.proposal_inverter_number;
        if (mode == 2) {
          proposal_inverter_phase3.clearValidators();
          proposal_inverter_quantity3.clearValidators();
          proposal_inverter_rating3.clearValidators();

          proposal_inverter_phase2.setValidators([Validators.required]);
          proposal_inverter_quantity2.setValidators([Validators.required]);
          proposal_inverter_rating2.setValidators([Validators.required]);
        } else if (mode == 3) {
          proposal_inverter_phase2.setValidators([Validators.required]);
          proposal_inverter_quantity2.setValidators([Validators.required]);
          proposal_inverter_rating2.setValidators([Validators.required]);

          proposal_inverter_phase3.setValidators([Validators.required]);
          proposal_inverter_quantity3.setValidators([Validators.required]);
          proposal_inverter_rating3.setValidators([Validators.required]);
        } else {
          proposal_inverter_phase2.clearValidators();
          proposal_inverter_quantity2.clearValidators();
          proposal_inverter_rating2.clearValidators();

          proposal_inverter_phase3.clearValidators();
          proposal_inverter_quantity3.clearValidators();
          proposal_inverter_rating3.clearValidators();
        }
      });
    //end of validaton changes by number of solar inverter

    this.kartRequest
      .get("proposal_inverter_phase")
      .valueChanges.subscribe((mode: String) => {
        var proposal_inverter_rating = this.kartRequest.value
          .proposal_inverter_rating;
        if (proposal_inverter_rating == "5") {
          if (mode == "Three Phase") {
            this.kartRequest.controls.Accablecore.setValue("4");
            this.kartRequest.controls.Accablesqmm.setValue("6");
          } else if (mode == "Single Phase") {
            this.kartRequest.controls.Accablecore.setValue("2");
            this.kartRequest.controls.Accablesqmm.setValue("6");
          }
        }
      });

      this.kartRequest.get("proposal_solution_type")
      .valueChanges.subscribe((mode: number) => {
        let proposal_inverter_rating = this.kartRequest.value.proposal_inverter_rating;
        let battery_series = this.kartRequest.get("battery_series");
        let avg_running_load = this.kartRequest.get("avg_running_load");
        let AvgMonthlyBill = this.kartRequest.get("AvgMonthlyBill");
        this.updateProposaladvanceValue(payment_split.value, mode);
        //financial calculations
        let degradation = this.kartRequest.get( "degradation" );
        let escalation = this.kartRequest.get( "escalation" );
        let amc_maintanace = this.kartRequest.get( "amc_maintanace" );
        let amc_option = this.kartRequest.get( "amc_option" );
        let amc_charge = this.kartRequest.get( "amc_charge" );
        let proposal_solar_battery = this.kartRequest.get( "proposal_solar_battery" );

        if (mode == 1) {
          // grid Tied
          if(this.kartRequest.get('proposal_type').value=='1'){
            this.kartRequest.get('proposal_syncValue').clearValidators();
            this.kartRequest.get('proposal_syncAmount').clearValidators();
            }
          else{
            this.kartRequest.get('proposal_syncValue').setValidators(Validators.required)
          this.kartRequest.get('proposal_syncAmount').setValidators(Validators.required);
          }
          this.SolarInverterOptions = this.SolarInverterOptionsOnGird;
          inverter_voltage.clearValidators();
          battery_series.clearValidators();
          avg_running_load.clearValidators();
          AvgMonthlyBill.setValidators([Validators.required]);
          battery_capacity.clearValidators();
          battery_volt.clearValidators();
          battery_nos.clearValidators();
          this.off_grid = true;
          // this.setInvertorAccessoriesValidations();
          this.kartRequest.controls.paybackValidation.setValidators([Validators.required]);
          this.kartRequest.controls.paybackValidation.updateValueAndValidity();
          degradation.setValidators([Validators.required]);
          escalation.setValidators([Validators.required]);
          proposal_solar_battery.clearValidators();
          if (proposal_inverter_rating >= 6) {
            this.kartRequest.controls.GTIphase.setValue("Three Phase");
          } else {
            this.kartRequest.controls.GTIphase.setValue("Single Phase");
          }
          if(this.kartRequest.controls.proposal_type.value == '2'){
            amc_maintanace.setValidators([Validators.required]);
            amc_option.setValidators([Validators.required]);
            amc_charge.setValidators([Validators.required]);
            this.pricingOptions = this.pricingOptions.filter(status => status.value !== "3");
           }else{
            amc_maintanace.clearValidators();
            amc_option.clearValidators();
            amc_charge.clearValidators();
           let pricingOptions: Array<any> = [
            { value: "1", label: "Gold" },
            { value: "2", label: "Silver" },
            { value: "3", label: "Both(Gold & Silver)" }
          ];
          this.pricingOptions = pricingOptions;
         }
        } else if (mode == 2 || mode == 3) {
          // Off-grid
          this.kartRequest.get('proposal_syncValue').clearValidators();
          this.kartRequest.get('proposal_syncAmount').clearValidators();
          if (mode == 2) {
            this.kartRequest.get('netMeteringcost').setValue('');
            this.SolarInverterOptions = this.SolarInverterOptionsOffGird;
          }
          if (mode == 3) {
            this.SolarInverterOptions = this.SolarInverterOptionsHybrid;
          }
          AvgMonthlyBill.clearValidators();
          battery_series.setValidators([Validators.required]);
          avg_running_load.setValidators([Validators.required]);
          proposal_remote_monitoring_system_gold.clearValidators();
          proposal_remote_monitoring_system_silver.clearValidators();
          inverter_voltage.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]\d*$/)
          ]);
          battery_capacity.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]\d*$/)
          ]);
          battery_volt.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]\d*$/)
          ]);
          battery_nos.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]\d*$/)
          ]);
          this.off_grid = false;
          // this.setInvertorAccessoriesValidations();
          // this.kartRequest.get('proposal_syncAmount')
          // .clearValidators();
          //  this.kartRequest.get('proposal_syncAmount').updateValueAndValidity();
          this.kartRequest.get('payBackFormArray').reset();
          this.kartRequest.get('paybackValidation').clearValidators();
          this.kartRequest.get('paybackValidation').updateValueAndValidity();
          this.kartRequest.controls.is_opex.setValue('');
          this.kartRequest.controls.is_capex.setValue('');
          this.capexClearValidation();
          this.opexClearValidation();
          amc_maintanace.clearValidators();
          this.kartRequest.controls.proposal_pricing_options.setValue("1");
          this.selectePricingOption = "1";
          this.kartRequest.controls.paybackValidation.setValue("")
          this.capexSelected=false
          this.opexSelected=false
          degradation.clearValidators();
          escalation.clearValidators();
          amc_option.clearValidators();
          amc_charge.clearValidators();
        }

        this.kartRequest.controls.battery_volt.setValue("12");
        GTIphase.updateValueAndValidity();
        AvgMonthlyBill.updateValueAndValidity();
        inverter_voltage.updateValueAndValidity();
        battery_capacity.updateValueAndValidity();
        battery_volt.updateValueAndValidity();
        battery_nos.updateValueAndValidity();
        proposal_remote_monitoring_system_gold.updateValueAndValidity();
        proposal_remote_monitoring_system_silver.updateValueAndValidity();
        avg_running_load.updateValueAndValidity();
        battery_series.updateValueAndValidity();
        degradation.updateValueAndValidity();
        escalation.updateValueAndValidity();
        amc_maintanace.updateValueAndValidity();
        amc_option.updateValueAndValidity();
        amc_charge.updateValueAndValidity();
        this.kartRequest.get('proposal_syncValue').updateValueAndValidity();
        this.kartRequest.get('proposal_syncAmount').updateValueAndValidity();
      });

      this.kartRequest
      .get("is_capex")
      .valueChanges.subscribe((mode: number) => {
      let bank_finance = this.kartRequest.get( "bank_finance" );
      let corporate_tax_rate = this.kartRequest.get( "corporate_tax_rate" );
      let discounted_rate = this.kartRequest.get( "discounted_rate" );
      let deprication = this.kartRequest.get( "deprication" );
      let estimated_loan = this.kartRequest.get( "estimated_loan" );
        let interest_rate = this.kartRequest.get( "interest_rate" );
        let repayment_period = this.kartRequest.get( "repayment_period" );
        if (mode == 1) {
          bank_finance.setValidators([Validators.required]);
          corporate_tax_rate.setValidators([Validators.required]);
          discounted_rate.setValidators([Validators.required]);
          deprication.setValidators([Validators.required]);
        }else{
          bank_finance.clearValidators();
          corporate_tax_rate.clearValidators();
          discounted_rate.clearValidators();
          deprication.clearValidators();
          estimated_loan.clearValidators();
          interest_rate.clearValidators();
          repayment_period.clearValidators();
        }
          bank_finance.updateValueAndValidity();
          corporate_tax_rate.updateValueAndValidity();
          discounted_rate.updateValueAndValidity();
          deprication.updateValueAndValidity();
          estimated_loan.updateValueAndValidity();
          interest_rate.updateValueAndValidity();
          repayment_period.updateValueAndValidity();
      });
      this.kartRequest.get("bank_finance").valueChanges.subscribe((mode: number) => {
        let estimated_loan = this.kartRequest.get( "estimated_loan" );
        let interest_rate = this.kartRequest.get( "interest_rate" );
        let repayment_period = this.kartRequest.get( "repayment_period" );
        if (mode == 1) {
          estimated_loan.setValidators([Validators.required]);
          interest_rate.setValidators([Validators.required]);
          repayment_period.setValidators([Validators.required]);
            }else{
          estimated_loan.clearValidators();
          interest_rate.clearValidators();
          repayment_period.clearValidators();
            }
          estimated_loan.updateValueAndValidity();
          interest_rate.updateValueAndValidity();
          repayment_period.updateValueAndValidity();
           });
           this.kartRequest.get("is_opex").valueChanges.subscribe((mode: number) => {
        let ppa_tarif = this.kartRequest.get( "ppa_tarif" );
        let payment_security_period = this.kartRequest.get( "payment_security_period" );
        let ppa_tenure = this.kartRequest.get( "ppa_tenure" );
        if (mode == 1) {
          ppa_tarif.setValidators([Validators.required]);
          payment_security_period.setValidators([Validators.required]);
          ppa_tenure.setValidators([Validators.required]);
        }else{
          ppa_tarif.clearValidators();
          payment_security_period.clearValidators();
          ppa_tenure.clearValidators();
        }
        ppa_tarif.updateValueAndValidity();
        payment_security_period.updateValueAndValidity();
        ppa_tenure.updateValueAndValidity();
      });

      this.kartRequest.get("is_discount").valueChanges.subscribe((mode: number) => {
        let Discount = this.kartRequest.get("discount");
        let DiscountSilver = this.kartRequest.get("discount_silver");
        let proposal_pricing_options = this.kartRequest.value.proposal_pricing_options;
        if (mode == 1) {
          if (proposal_pricing_options == 1) {
            Discount.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
          } else if (proposal_pricing_options == 2) {
            DiscountSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
          } else {
            Discount.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
            DiscountSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
          }
        } else {
          Discount.clearValidators();
          Discount.setValue("");
          DiscountSilver.clearValidators();
          DiscountSilver.setValue("");
        }
        Discount.updateValueAndValidity();
        DiscountSilver.updateValueAndValidity();
      });

      this.kartRequest.get("proposal_emi_option").valueChanges.subscribe((mode: number) => {
        let proposal_pricing_options = this.kartRequest.value.proposal_pricing_options;
        if (mode == 1) {
          // this.ComponentData[]
          emiGold.clearValidators();
          emiSilver.clearValidators();
          if (proposal_pricing_options == 1) {
            emiGold.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
          } else if (proposal_pricing_options == 2) {
            emiSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
          } else {
            emiGold.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
            emiSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/),
              Validators.min(1)
            ]);
          }
        } else if (mode == 2) {
          emiGold.clearValidators();
          emiSilver.clearValidators();
        }
        emiGold.updateValueAndValidity();
        emiSilver.updateValueAndValidity();
      });
      this.kartRequest.get("proposal_pricing_options").valueChanges.subscribe((mode: string) => {
        let isDiscount = this.kartRequest.get("is_discount").value;
        let proposal_emi_option = this.kartRequest.value.proposal_emi_option;
        let Discount = this.kartRequest.get("discount");
        let DiscountSilver = this.kartRequest.get("discount_silver");
        this.selectePricingOption=mode;
        let payment_split = Number(
          this.kartRequest.controls.payment_split.value
        );
        switch (mode) {
          case "1": // For Only GOLD
            if (proposal_emi_option == 1) {
              emiGold.setValidators([
                Validators.required,
                Validators.pattern(/^[0-9]\d*$/),
                Validators.min(1)
              ]);
              if(isDiscount == '1') {
                  Discount.setValidators([
                  Validators.required,
                  Validators.pattern(/^[0-9]\d*$/)
                ]);
              }
            } else {
              Discount.clearValidators();
              emiGold.clearValidators();
            }
            if (payment_split == 3) {
              advanceGold_3.clearValidators();
            }
            //this.ComponentData[1].description=(this.kartRequest.get('proposal_module_capacity').value)+'-Wp-72Cells '+ this.panelTypeText+ ' ' + (this.kartRequest.get('proposal_solar_pv_panels_gold').value);
            proposal_remote_monitoring_system_gold.setValidators([
              Validators.required
            ]);
            advanceGold.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceGold_1.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceGold_2.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            projectValueGold.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);


            advanceSilver.clearValidators();
            advanceSilver_1.clearValidators();
            advanceSilver_2.clearValidators();
            advanceSilver_3.clearValidators();
            emiSilver.clearValidators();
            DiscountSilver.clearValidators();
            projectValueSilver.clearValidators();
            proposal_remote_monitoring_system_silver.clearValidators();
            break;
          case "2": // For Only SILVER
            if (proposal_emi_option == 1) {
              emiSilver.setValidators([
                Validators.required,
                Validators.pattern(/^[0-9]\d*$/),
                Validators.min(1)
              ]);
              if(isDiscount == 1) {
                DiscountSilver.setValidators([
                  Validators.required,
                  Validators.pattern(/^[0-9]\d*$/)
                ]);
              }
            } else {
              emiSilver.clearValidators();
              DiscountSilver.clearValidators();
            }
            if (payment_split == 3) {
              advanceSilver_3.clearValidators();
            }

          //  this.ComponentData[1].description=(this.kartRequest.get('proposal_module_capacity').value)+'-Wp-72Cells '+ this.panelTypeText+ ' ' + (this.kartRequest.get('proposal_solar_pv_panels_silver').value);


            proposal_remote_monitoring_system_silver.setValidators([
              Validators.required
            ]);
            advanceSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceSilver_1.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceSilver_2.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            projectValueSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceGold.clearValidators();
            advanceGold_1.clearValidators();
            advanceGold_2.clearValidators();
            advanceGold_3.clearValidators();
            emiGold.clearValidators();
            Discount.clearValidators();
            projectValueGold.clearValidators();
            proposal_remote_monitoring_system_gold.clearValidators();
            break;
          case "3":
            if (proposal_emi_option == 1) {
              emiSilver.setValidators([
                Validators.required,
                Validators.pattern(/^[0-9]\d*$/),
                Validators.min(1)
              ]);
              emiGold.setValidators([
                Validators.required,
                Validators.pattern(/^[0-9]\d*$/),
                Validators.min(1)
              ]);
              if(isDiscount == 1) {
                Discount.setValidators([
                  Validators.required,
                  Validators.pattern(/^[0-9]\d*$/)
                ]);
                DiscountSilver.setValidators([
                  Validators.required,
                  Validators.pattern(/^[0-9]\d*$/)
                ]);
              }
            } else {
              emiSilver.clearValidators();
              DiscountSilver.clearValidators();

              emiGold.clearValidators();
              Discount.clearValidators();
            }
            if (payment_split == 3) {
              advanceGold_3.clearValidators();
              advanceSilver_3.clearValidators();
            } else {
              advanceGold_3.setValidators([
                Validators.required,
                Validators.pattern(/^[0-9]\d*$/)
              ]);
              advanceSilver_3.setValidators([
                Validators.required,
                Validators.pattern(/^[0-9]\d*$/)
              ]);
            }
            proposal_remote_monitoring_system_gold.setValidators([
              Validators.required
            ]);
            proposal_remote_monitoring_system_silver.setValidators([
              Validators.required
            ]);
            advanceGold.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceGold_1.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceGold_2.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);

            projectValueGold.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);

            advanceSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceSilver_1.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            advanceSilver_2.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            projectValueSilver.setValidators([
              Validators.required,
              Validators.pattern(/^[0-9]\d*$/)
            ]);
            break;
        }
        emiGold.updateValueAndValidity();
        Discount.updateValueAndValidity();
        advanceGold.updateValueAndValidity();
        advanceGold_1.updateValueAndValidity();
        advanceGold_2.updateValueAndValidity();
        advanceGold_3.updateValueAndValidity();
        projectValueGold.updateValueAndValidity();

        emiSilver.updateValueAndValidity();
        DiscountSilver.updateValueAndValidity();
        advanceSilver.updateValueAndValidity();
        advanceSilver_1.updateValueAndValidity();
        advanceSilver_2.updateValueAndValidity();
        advanceSilver_3.updateValueAndValidity();
        projectValueSilver.updateValueAndValidity();
      });

      this.kartRequest
      .get("proposal_structure_type")
      .valueChanges.subscribe((mode: string) => {
        if (mode == "Galvanized/PosMac Structure") {
          this.kartRequest.controls.StrucBOM.setValue(
            "Galvanised Module Mounting Structure (MMS) including SS202 grade of hardware, Module lower edge clearance approx. 0.5mtr with fixed tilt 14-18 degree, double portrait structure 2(2x4) matrix for RCC roof."
          );
          this.ComponentData[2].description="Galvanised Module Mounting Structure (MMS) including SS202 grade of hardware, Module lower edge clearance approx. 0.5mtr with fixed tilt 14-18 degree, double portrait structure 2(2x4) matrix for RCC roof."
        } else if (mode == "Aluminium Partial Rail") {
          this.kartRequest.controls.StrucBOM.setValue(
            "Aluminium Partial Rail Module Mounting Structure (MMS) including  hardware & clamps, Modules shall be fix parallel to metal shed."
          );
          this.ComponentData[2].description="Aluminium Partial Rail Module Mounting Structure (MMS) including  hardware & clamps, Modules shall be fix parallel to metal shed."
        }

      });

      this.kartRequest
      .get("proposal_inverter_number")
      .valueChanges.subscribe((mode: number) => {
        this.numberOfSolarInverter = mode;
        if (mode == 1) {
          this.kartRequest.controls.proposal_inverter_rating2.setValue("");
          this.kartRequest.controls.proposal_inverter_phase2.setValue("");
          this.kartRequest.controls.proposal_inverter_quantity2.setValue("");
          this.kartRequest.controls.proposal_inverter_rating3.setValue("");
          this.kartRequest.controls.proposal_inverter_phase3.setValue("");
          this.kartRequest.controls.proposal_inverter_quantity3.setValue("");
        } else if (mode == 2) {
          this.kartRequest.controls.proposal_inverter_rating3.setValue("");
          this.kartRequest.controls.proposal_inverter_phase3.setValue("");
          this.kartRequest.controls.proposal_inverter_quantity3.setValue("");
        }
      });

      this.kartRequest.get('BuildingType')
      .valueChanges.subscribe(value=>{
        if(value){
          if(value =='commercial'){
            this.displayCommercialList=true;
          }
          else{
            if(value =='residential')
            this.displayCommercialList=false;
          }
        }
      })
      this.kartRequest.get('proposal_type')
      .valueChanges.subscribe(value=>{
        if(value){
          if(value =='2'){
            this.displayEquip=true;
            this.proposalSolutionType= [
              { value: "1", label: "Grid-Tied" }
            ];
          }
          else{
            this.displayEquip=false;
            if(value =='1'){
              this.proposalSolutionType= [
                { value: "1", label: "Grid-Tied" },
                { value: "2", label: "Off-Grid" },
                { value: "3", label: "Hybrid" },
              ];
            }
          }
        if(value== '2' && this.off_grid){
          this.pricingOptions = this.pricingOptions.filter(status => status.value !== "3");
        }else{
          let pricingOptions: Array<any> = [
            { value: "1", label: "Gold" },
            { value: "2", label: "Silver" },
            { value: "3", label: "Both(Gold & Silver)" }
          ];
          this.pricingOptions = pricingOptions;
        }
        }
      })
  }

  updateProposaladvanceValue(payment_split, proposal_sol_type) {
     if (payment_split == 4) {
      if (proposal_sol_type == 1 || proposal_sol_type == 3) {
        this.kartRequest.controls.proposal_advanced.setValue(25);
        this.kartRequest.controls.proposal_payment_2.setValue(40);
        this.kartRequest.controls.proposal_payment_3.setValue(30);
        this.kartRequest.controls.proposal_payment_4.setValue(5);

        this.kartRequest.controls.proposal_advance_silver.setValue(25);
        this.kartRequest.controls.proposal_advance_silver_1.setValue(40);
        this.kartRequest.controls.proposal_advance_silver_2.setValue(30);
        this.kartRequest.controls.proposal_advance_silver_3.setValue(5);
      } else if (proposal_sol_type == 2) {
        this.kartRequest.controls.proposal_advanced.setValue(25);
        this.kartRequest.controls.proposal_payment_2.setValue(55);
        this.kartRequest.controls.proposal_payment_3.setValue(15);
        this.kartRequest.controls.proposal_payment_4.setValue(5);

        this.kartRequest.controls.proposal_advance_silver.setValue(25);
        this.kartRequest.controls.proposal_advance_silver_1.setValue(55);
        this.kartRequest.controls.proposal_advance_silver_2.setValue(15);
        this.kartRequest.controls.proposal_advance_silver_3.setValue(5);
      }
    } else {
      this.kartRequest.controls.proposal_advanced.setValue(25);
      this.kartRequest.controls.proposal_payment_2.setValue(70);
      this.kartRequest.controls.proposal_payment_3.setValue(5);
      this.kartRequest.controls.proposal_payment_4.setValue("");

      this.kartRequest.controls.proposal_advance_silver.setValue(50);
      this.kartRequest.controls.proposal_advance_silver_1.setValue(45);
      this.kartRequest.controls.proposal_advance_silver_2.setValue(5);
      this.kartRequest.controls.proposal_advance_silver_3.setValue("");
    }
  }


  updateKartRequestValues() {
    if (typeof this.proposalEmailData.cceld_address1 != "undefined" &&
      this.proposalEmailData.cceld_address1 != "" &&
      this.proposalEmailData.cceld_address1 != null
    ) {
      this.kartRequest.controls.cceld_address1.setValue(
        this.proposalEmailData.cceld_address1
      );
    }
    if ( typeof this.proposalEmailData.cceld_address2 != "undefined" &&
       this.proposalEmailData.cceld_address2 != "" &&
      this.proposalEmailData.cceld_address2 != null
    ) {
      this.kartRequest.controls.cceld_address2.setValue(
        this.proposalEmailData.cceld_address2
      );
    }
    if(this.proposalEmailData.cceld_avgelectricitybill){
      this.kartRequest.controls.AvgMonthlyBill.setValue(
        this.proposalEmailData.cceld_avgelectricitybill
      );
    }
    if(this.proposalEmailData.cceld_buildingtype){
      this.kartRequest.controls.BuildingType.setValue(
        this.proposalEmailData.cceld_buildingtype);
    }
    if(this.proposalEmailData.cceld_city){
      this.selectedCity = this.proposalEmailData.cceld_city;
    }
    if(this.proposalEmailData.cceld_email){
      this.kartRequest.controls.email.setValue(
        this.proposalEmailData.cceld_email);
    }
    if(this.proposalEmailData.cceld_firstname){
      this.kartRequest.controls.first_name.setValue(
        this.proposalEmailData.cceld_firstname);
    }
    if(this.proposalEmailData.cceld_lastname){
      this.kartRequest.controls.last_name.setValue(
        this.proposalEmailData.cceld_lastname);
    }
    if(Number(this.proposalEmailData.cceld_pincode)){
      this.kartRequest.controls.pincode.setValue(
        this.proposalEmailData.cceld_pincode);
    }
    if(this.proposalEmailData.cceld_rooftype){
      if(this.proposalEmailData.cceld_rooftype =='rcc' ||this.proposalEmailData.cceld_rooftype =='Flat RCC'){
        this.kartRequest.controls.RoofType.setValue(
          "Flat RCC"
        );
      }
      if(this.proposalEmailData.cceld_rooftype =='tin_shed' ||this.proposalEmailData.cceld_rooftype =='Tin Shed'){
        this.kartRequest.controls.RoofType.setValue(
          "Tin Shed"
        );
      }
      if(this.proposalEmailData.cceld_rooftype =='park' ||this.proposalEmailData.cceld_rooftype =='Asbestos'){
        this.kartRequest.controls.RoofType.setValue(
          "Asbestos"
        );
      }
      if(this.proposalEmailData.cceld_rooftype =='ground' ||this.proposalEmailData.cceld_rooftype =='Ground Mount'){
        this.kartRequest.controls.RoofType.setValue(
          "Ground Mount"
        );
      }
    }
    if(this.proposalEmailData.cceld_sitetype){
      this.kartRequest.controls.cceld_sitetype.setValue(
        this.proposalEmailData.cceld_sitetype);
    }
    if(this.proposalEmailData.cceld_state){
      this.selectedState = this.proposalEmailData.cceld_state;
    }
    if (
      typeof this.proposalEmailData.sf_connection_type != "undefined" &&
      this.proposalEmailData.sf_connection_type != "" &&
      this.proposalEmailData.sf_connection_type != null
    ) {
      this.kartRequest.controls.sf_connection_type.setValue(
        this.proposalEmailData.sf_connection_type
      );
    }

    if(this.proposalEmailData.sf_sanctioned_load_capacity){
      this.kartRequest.controls.sf_sanctioned_load_capacity.setValue(
        this.proposalEmailData.sf_sanctioned_load_capacity
      );
    }
    // proposalDetail
  if(this.proposalEmailData.proposalDetails.proposal_code && this.proposalEmailData.proposalDetails.proposal_created_by && this.proposalEmailData.proposalDetails.proposal_created_on){
  let ProposalData=this.proposalEmailData.proposalDetails
  let {is_discount,Accablecore,Accablesqmm,AvgPowerCut,proposal_syncValue,proposal_syncAmount,
  degradation,escalation,proposal_inverter_number,proposal_inverter_rating,
  proposal_inverter_phase,proposal_inverter_quantity,proposal_number_of_solar_panel,proposal_structure_type,
  proposal_insolated_city,proposal_global_solr_irr,proposal_electricity_terrif,proposal_emi_option,
  proposal_pricing_options,proposal_project_value_gold,project_value_silver,proposal_project_value_silver,payment_split,proposal_emi_gold
 ,proposal_emi_silver,discount,discount_silver,discom,proposal_dc_capacity,StrucBOM,
 proposal_inverter_rating2,proposal_inverter_phase2,proposal_inverter_quantity2,proposal_inverter_rating3,
 proposal_inverter_phase3,proposal_inverter_quantity3,bank_finance,corporate_tax_rate,
 discounted_rate,deprication,ppa_tarif,payment_security_period,ppa_tenure,proposal_addition_email_text,
 is_capex,is_opex,equipments,inverter_voltage,battery_series,battery_capacity,battery_nos,
 estimated_loan,interest_rate,repayment_period,proposal_solution_type,avg_running_load,Dlvryweeks,
 Installweeks,Offrvalidays,ModNoofcells,ACDBqty,Dccablecore,Dccablesqmm,GTIphase,Accablelen,
 EarthingDia,EarthingLen,EarthingNos,NoofLA,proposal_catalog,proposal_intro,proposal_lifetime_savings,
 proposal_solar_battery, proposal_dc_capacity_val}=ProposalData;
 if(this.proposalEmailData.proposalDetails.ACDBqty &&this.proposalEmailData.proposalDetails.ACDBqty!==null && this.proposalEmailData.proposalDetails.ACDBqty!=""){
  this.kartRequest.get('ACDBqty')
  .setValue(ACDBqty)
 }
 if(this.proposalEmailData.proposalDetails.proposal_module_capacity){
  this.kartRequest.get('module_capacity')
  .setValue(this.proposalEmailData.proposalDetails.proposal_module_capacity)
 }

 if(Accablecore){
  this.kartRequest.get('Accablecore')
  .setValue(Accablecore)
 }
 if(this.proposalEmailData.proposalDetails.Accablelen!==null && this.proposalEmailData.proposalDetails.Accablelen!=""){
  this.kartRequest.get('Accablelen')
  .setValue(Accablelen)
 }
 if(Accablesqmm){
  this.kartRequest.get('Accablesqmm')
  .setValue(Accablesqmm)
 }
 if(AvgPowerCut){
  this.kartRequest.get('AvgPowerCut')
  .setValue(AvgPowerCut)
 }
 if(proposal_dc_capacity_val){
  this.kartRequest.get('proposal_dc_capacity_val')
  .setValue(proposal_dc_capacity_val)
 }
if(this.proposalEmailData.proposalDetails.Dccablecore!==null && this.proposalEmailData.proposalDetails.Dccablecore!=""){
  this.kartRequest.get('Dccablecore')
  .setValue(Dccablecore)
 }
 if(this.proposalEmailData.proposalDetails.Dccablesqmm!==null && this.proposalEmailData.proposalDetails.Dccablesqmm!=""){
  this.kartRequest.get('Dccablesqmm')
  .setValue(Dccablesqmm)
 }
 if(Dlvryweeks){
  this.kartRequest.get('Dlvryweeks')
  .setValue(Dlvryweeks)
 }
if(this.proposalEmailData.proposalDetails.EarthingDia!==null && this.proposalEmailData.proposalDetails.EarthingDia!=""){
  this.kartRequest.get('EarthingDia')
  .setValue(EarthingDia)
 }
 if(this.proposalEmailData.proposalDetails.EarthingLen!==null && this.proposalEmailData.proposalDetails.EarthingLen!=""){
  this.kartRequest.get('EarthingLen')
  .setValue(EarthingLen)
 }
 if(this.proposalEmailData.proposalDetails.EarthingNos!==null && this.proposalEmailData.proposalDetails.EarthingNos!=""){
  this.kartRequest.get('EarthingNos')
  .setValue(EarthingNos)
 }
 if(GTIphase){
  this.kartRequest.get('GTIphase')
  .setValue(GTIphase)
 }
 if(this.proposalEmailData.proposalDetails.Installweeks !==null && this.proposalEmailData.proposalDetails.Installweeks !=""){
  this.kartRequest.get('Installweeks')
  .setValue(Installweeks)
 }
 if(this.proposalEmailData.proposalDetails.ModNoofcells!==null && this.proposalEmailData.proposalDetails.ModNoofcells!=""){
  this.kartRequest.get('ModNoofcells')
  .setValue(ModNoofcells)
 }
 if(this.proposalEmailData.proposalDetails.NoofLA!==null && this.proposalEmailData.proposalDetails.NoofLA!=""){
  this.kartRequest.get('NoofLA')
  .setValue(NoofLA);
 }
 if(this.proposalEmailData.proposalDetails.Offrvalidays!==null && this.proposalEmailData.proposalDetails.Offrvalidays!="" ){
  this.kartRequest.get('Offrvalidays')
  .setValue(Offrvalidays)
 }
if(StrucBOM){
  this.kartRequest.get('StrucBOM')
  .setValue(StrucBOM)
 }
 if(proposal_inverter_rating){
  this.kartRequest.get('proposal_inverter_rating')
 .setValue(proposal_inverter_rating)
}
if(this.proposalEmailData.proposalDetails.proposal_dc_capacity){
  this.kartRequest.controls.proposal_dc_capacity.setValue(
    this.proposalEmailData.proposalDetails.proposal_dc_capacity
  );
}
if(this.proposalEmailData.proposalDetails.amc_charge){
  let amc_charges =this.proposalEmailData.proposalDetails.amc_charge;
  let amc_charges_value =amc_charges.split(':');
  this.kartRequest.get('amc_option')
  .setValue(amc_charges_value[0]);
  this.kartRequest.get('amc_charge')
  .setValue(amc_charges_value[1]);
}
if(avg_running_load){
  this.kartRequest.get('avg_running_load')
  .setValue(avg_running_load)
 }
if(bank_finance){
  this.kartRequest.get('bank_finance')
  .setValue(bank_finance)
 }
 if(battery_capacity){
  this.kartRequest.get('battery_capacity')
  .setValue(battery_capacity)
 }
 if(battery_nos){
  this.kartRequest.get('battery_nos')
  .setValue(battery_nos)
 }
if(battery_nos){
  this.kartRequest.get('battery_series')
  .setValue(battery_series)
 }
 if (typeof this.proposalEmailData.proposalDetails.battery_volt != "undefined" &&
  this.proposalEmailData.proposalDetails.battery_volt != "" &&
  this.proposalEmailData.proposalDetails.battery_volt != null
) {
  this.kartRequest.controls.battery_volt.setValue(
    this.proposalEmailData.proposalDetails.battery_volt
  );
}
if (typeof this.proposalEmailData.proposalDetails.corporate_tax_rate != "undefined" &&
  this.proposalEmailData.proposalDetails.corporate_tax_rate != "" &&
  this.proposalEmailData.proposalDetails.corporate_tax_rate != null
) {
  this.kartRequest.controls.corporate_tax_rate.setValue(
    this.proposalEmailData.proposalDetails.corporate_tax_rate
  );
}
    if (typeof this.proposalEmailData.proposalDetails.degradation != "undefined" &&
      this.proposalEmailData.proposalDetails.degradation != "" &&
      this.proposalEmailData.proposalDetails.degradation != null
    ) {
      this.kartRequest.controls.degradation.setValue(
        this.proposalEmailData.proposalDetails.degradation
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.deprication != "undefined" &&
      this.proposalEmailData.proposalDetails.deprication != "" &&
      this.proposalEmailData.proposalDetails.deprication != null
    ) {
      this.kartRequest.controls.deprication.setValue(
        this.proposalEmailData.proposalDetails.deprication
      );
    }
    if(discom){
      this.kartRequest.get('discom')
      .setValue(discom)
     }
     if (
      typeof this.proposalEmailData.proposalDetails.discount != "undefined" &&
      this.proposalEmailData.proposalDetails.discount != "" &&
      this.proposalEmailData.proposalDetails.discount != null
    ) {
      this.kartRequest.controls.discount.setValue(
        this.proposalEmailData.proposalDetails.discount
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.discount_silver != "undefined" &&
      this.proposalEmailData.proposalDetails.discount_silver != "" &&
      this.proposalEmailData.proposalDetails.discount_silver != null
    ) {
      this.kartRequest.controls.discount_silver.setValue(
        this.proposalEmailData.proposalDetails.discount_silver
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.discounted_rate != "undefined" &&
      this.proposalEmailData.proposalDetails.discounted_rate != "" &&
      this.proposalEmailData.proposalDetails.discounted_rate != null
    ) {
      this.kartRequest.controls.discounted_rate.setValue(
        this.proposalEmailData.proposalDetails.discounted_rate
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.escalation != "undefined" &&
      this.proposalEmailData.proposalDetails.escalation != "" &&
      this.proposalEmailData.proposalDetails.escalation != null
    ) {
      this.kartRequest.controls.escalation.setValue(
        this.proposalEmailData.proposalDetails.escalation
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.estimated_loan != "undefined" &&
      this.proposalEmailData.proposalDetails.estimated_loan != "" &&
      this.proposalEmailData.proposalDetails.estimated_loan != null
    ) {
      this.kartRequest.controls.estimated_loan.setValue(
        this.proposalEmailData.proposalDetails.estimated_loan
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.interest_rate != "undefined" &&
      this.proposalEmailData.proposalDetails.interest_rate != "" &&
      this.proposalEmailData.proposalDetails.interest_rate != null
    ) {
      this.kartRequest.controls.interest_rate.setValue(
        this.proposalEmailData.proposalDetails.interest_rate
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.inverter_voltage != "undefined" &&
      this.proposalEmailData.proposalDetails.inverter_voltage != "" &&
      this.proposalEmailData.proposalDetails.inverter_voltage != null
    ) {
      this.kartRequest.controls.inverter_voltage.setValue(
        this.proposalEmailData.proposalDetails.inverter_voltage
      );
    }
    if(is_discount){
      this.kartRequest.get('is_discount')
      .setValue(is_discount)
     }
     if (
      typeof this.proposalEmailData.proposalDetails.payment_security_period != "undefined" &&
      this.proposalEmailData.proposalDetails.payment_security_period != "" &&
      this.proposalEmailData.proposalDetails.payment_security_period != null
    ) {
      this.kartRequest.controls.payment_security_period.setValue(
        this.proposalEmailData.proposalDetails.payment_security_period
      );
    }
    // if(this.proposalEmailData.proposalDetails.payment_split !==null && this.proposalEmailData.proposalDetails.payment_split !=""){
    //   this.kartRequest.get('payment_split')
    //   .setValue(payment_split)
    //  }
     if (
      typeof this.proposalEmailData.proposalDetails.ppa_tarif != "undefined" &&
      this.proposalEmailData.proposalDetails.ppa_tarif != "" &&
      this.proposalEmailData.proposalDetails.ppa_tarif != null
    ) {
      this.kartRequest.controls.ppa_tarif.setValue(
        this.proposalEmailData.proposalDetails.ppa_tarif
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.ppa_tenure != "undefined" &&
      this.proposalEmailData.proposalDetails.ppa_tenure != "" &&
      this.proposalEmailData.proposalDetails.ppa_tenure != null
    ) {
      this.kartRequest.controls.ppa_tenure.setValue(
        this.proposalEmailData.proposalDetails.ppa_tenure
      );
    }
    this.kartRequest.controls.proposal_addition_email_text.setValue(
      typeof this.proposalEmailData.proposalDetails.proposal_addition_email_text !=
        "undefined" &&
        this.proposalEmailData.proposalDetails.proposal_addition_email_text != "" &&
        this.proposalEmailData.proposalDetails.proposal_addition_email_text != null
        ? this.proposalEmailData.proposalDetails.proposal_addition_email_text
        : "Please find attached the proposal."
    );
    if ( this.proposalEmailData.proposalDetails.is_email_sent == 1 ) {
      this.is_email_sent=1;
  }
    if(is_capex){
      this.kartRequest.get('is_capex')
      .setValue(is_capex)
    }
    if(is_opex){
      this.kartRequest.get('is_opex')
      .setValue(is_opex)
    }
    if (
      typeof this.proposalEmailData.proposalDetails.proposal_advance_silver != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver != "" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver != null
    ) {
      this.kartRequest.controls.proposal_advance_silver.setValue(
        this.proposalEmailData.proposalDetails.proposal_advance_silver
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.proposal_advance_silver_1 != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver_1 != "" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver_1 != null
    ) {
      this.kartRequest.controls.proposal_advance_silver_1.setValue(
        this.proposalEmailData.proposalDetails.proposal_advance_silver_1
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.proposal_advance_silver_2 != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver_2 != "" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver_2 != null
    ) {
      this.kartRequest.controls.proposal_advance_silver_2.setValue(
        this.proposalEmailData.proposalDetails.proposal_advance_silver_2
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.proposal_advance_silver_3 != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver_3 != "" &&
      this.proposalEmailData.proposalDetails.proposal_advance_silver_3 != null
    ) {
      this.kartRequest.controls.proposal_advance_silver_3.setValue(
        this.proposalEmailData.proposalDetails.proposal_advance_silver_3
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.proposal_advanced != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_advanced != "" &&
      this.proposalEmailData.proposalDetails.proposal_advanced != null
    ) {
      this.kartRequest.controls.proposal_advanced.setValue(
        this.proposalEmailData.proposalDetails.proposal_advanced
      );
    }
    if (
      typeof this.proposalEmailData.proposalDetails.proposal_amc != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_amc != "" &&
      this.proposalEmailData.proposalDetails.proposal_amc != null
    ) {
      this.kartRequest.controls.proposal_amc.setValue(
        this.proposalEmailData.proposalDetails.proposal_amc
      );
    }
//  if(this.proposalEmailData.proposalDetails.proposal_dc_capacity){
//   this.kartRequest.controls.proposal_dc_capacity.setValue(
//     this.proposalEmailData.proposalDetails.proposal_dc_capacity
//   );
// }
if (
  typeof this.proposalEmailData
    .proposal_earthing_pv_protection_system_gold != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_earthing_pv_protection_system_gold !=
    "" &&
  this.proposalEmailData.proposalDetails.proposal_earthing_pv_protection_system_gold != null
) {
  this.kartRequest.controls.proposal_earthing_pv_protection_system_gold.setValue(
    this.proposalEmailData.proposalDetails.proposal_earthing_pv_protection_system_gold
  );
}
if (
  typeof this.proposalEmailData.proposalDetails
    .proposal_earthing_pv_protection_system_silver != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_earthing_pv_protection_system_silver !=
    "" &&
  this.proposalEmailData.proposalDetails.proposal_earthing_pv_protection_system_silver !=
    null
) {
  this.kartRequest.controls.proposal_earthing_pv_protection_system_silver.setValue(
    this.proposalEmailData.proposalDetails.proposal_earthing_pv_protection_system_silver
  );
}

if(this.proposalEmailData.proposalDetails.proposal_electricity_terrif){
  this.kartRequest.controls.electricity_terrif.setValue(
    this.proposalEmailData.proposalDetails.proposal_electricity_terrif
  );
}
if(this.proposalEmailData.proposalDetails.proposal_emi_gold){
  this.kartRequest.controls.proposal_emi_gold.setValue(
    this.proposalEmailData.proposalDetails.proposal_emi_gold
  );
}
if (
  typeof this.proposalEmailData.proposalDetails.proposal_emi_option != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_emi_option != "" &&
  this.proposalEmailData.proposalDetails.proposal_emi_option != null
) {
  this.selecteEmiOption = this.proposalEmailData.proposalDetails.proposal_emi_option;
}
if(this.proposalEmailData.proposalDetails.proposal_emi_option){
  this.kartRequest.controls.proposal_emi_option.setValue(
    this.proposalEmailData.proposalDetails.proposal_emi_option
  );
}
if(proposal_emi_silver){
  this.kartRequest.get('proposal_emi_silver')
.setValue(proposal_emi_silver)
}

if(proposal_emi_silver){
  this.kartRequest.get('global_solr_irr')
.setValue(proposal_global_solr_irr)
}
 if (
      typeof this.proposalEmailData.proposalDetails.proposal_insurance_gold != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_insurance_gold != "" &&
      this.proposalEmailData.proposalDetails.proposal_insurance_gold != null
    ) {
      this.kartRequest.controls.proposal_insurance_gold.setValue(
        this.proposalEmailData.proposalDetails.proposal_insurance_gold
      );
    }

    if (
      typeof this.proposalEmailData.proposalDetails.proposal_insurance_silver != "undefined" &&
      this.proposalEmailData.proposalDetails.proposal_insurance_silver != "" &&
      this.proposalEmailData.proposalDetails.proposal_insurance_silver != null
    ) {
      this.kartRequest.controls.proposal_insurance_silver.setValue(
        this.proposalEmailData.proposalDetails.proposal_insurance_silver
      );
    }
    if(proposal_inverter_number){
      this.kartRequest.get('proposal_inverter_number')
    .setValue(proposal_inverter_number)
    }

    if(proposal_inverter_phase){
      this.kartRequest.get('proposal_inverter_phase')
      .setValue(proposal_inverter_phase)
    }

    if(proposal_inverter_phase2){
      this.kartRequest.get('proposal_inverter_phase2')
      .setValue(proposal_inverter_phase2)
    }
if(proposal_inverter_phase3){
  this.kartRequest.get('proposal_inverter_phase3')
  .setValue(proposal_inverter_phase3)
}
if(proposal_inverter_quantity){
  this.kartRequest.get('proposal_inverter_quantity')
 .setValue(proposal_inverter_quantity)
}
if(proposal_inverter_quantity2){
  this.kartRequest.get('proposal_inverter_quantity2')
 .setValue(proposal_inverter_quantity2)
}
if(proposal_inverter_quantity3){
  this.kartRequest.get('proposal_inverter_quantity3')
 .setValue(proposal_inverter_quantity3)
}
// if(proposal_inverter_rating){
//   this.kartRequest.get('proposal_inverter_rating')
//  .setValue(proposal_inverter_rating)
// }
if(proposal_inverter_rating2){
  this.kartRequest.get('proposal_inverter_rating2')
.setValue(proposal_inverter_rating2)
}
if(proposal_inverter_rating3){
  this.kartRequest.get('proposal_inverter_rating3')
.setValue(proposal_inverter_rating3)
}
if (
  typeof this.proposalEmailData.proposalDetails.proposal_maintenance_gold != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_maintenance_gold != "" &&
  this.proposalEmailData.proposalDetails.proposal_maintenance_gold != null
) {
  this.kartRequest.controls.proposal_maintenance_gold.setValue(
    this.proposalEmailData.proposalDetails.proposal_maintenance_gold
  );
}
if (
  typeof this.proposalEmailData.proposalDetails.proposal_maintenance_silver !=
    "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_maintenance_silver != "" &&
  this.proposalEmailData.proposalDetails.proposal_maintenance_silver != null
) {
  this.kartRequest.controls.proposal_maintenance_silver.setValue(
    this.proposalEmailData.proposalDetails.proposal_maintenance_silver
  );
}
if (
  typeof this.proposalEmailData.proposalDetails.module_capacity != "undefined" &&
  this.proposalEmailData.proposalDetails.module_capacity != "" &&
  this.proposalEmailData.proposalDetails.module_capacity != null
) {
  this.kartRequest.controls.module_capacity.setValue(
    this.proposalEmailData.proposalDetails.module_capacity
  );
}
if (
  typeof this.proposalEmailData.proposalDetails.proposal_no_of_spgs != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_no_of_spgs != "" &&
  this.proposalEmailData.proposalDetails.proposal_no_of_spgs != null
) {
  this.kartRequest.controls.no_of_spgs.setValue(
    this.proposalEmailData.proposalDetails.proposal_no_of_spgs
  );
}
if(proposal_number_of_solar_panel){
  this.kartRequest.get('number_of_solar_panel')
.setValue(proposal_number_of_solar_panel)
}
if (typeof this.proposalEmailData.proposalDetails.proposal_panel_type != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_panel_type != "" &&
  this.proposalEmailData.proposalDetails.proposal_panel_type != null
) {
  this.kartRequest.controls.proposal_panel_type.setValue(
    this.proposalEmailData.proposalDetails.proposal_panel_type
  );
}
if (typeof this.proposalEmailData.proposalDetails.proposal_payment_2 != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_payment_2 != "" &&
  this.proposalEmailData.proposalDetails.proposal_payment_2 != null
) {
  this.kartRequest.controls.proposal_payment_2.setValue(
    this.proposalEmailData.proposalDetails.proposal_payment_2
  );
}
if (typeof this.proposalEmailData.proposalDetails.proposal_payment_3 != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_payment_3 != "" &&
  this.proposalEmailData.proposalDetails.proposal_payment_3 != null
) {
  this.kartRequest.controls.proposal_payment_3.setValue(
    this.proposalEmailData.proposalDetails.proposal_payment_3
  );
}
if (typeof this.proposalEmailData.proposalDetails.proposal_payment_4 != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_payment_4 != "" &&
  this.proposalEmailData.proposalDetails.proposal_payment_4 != null
) {
  this.kartRequest.controls.proposal_payment_4.setValue(
    this.proposalEmailData.proposalDetails.proposal_payment_4
  );
}
  if(proposal_pricing_options){
    this.kartRequest.get('proposal_pricing_options')
  .setValue(proposal_pricing_options)
  }
  if(proposal_project_value_gold){
    this.kartRequest.get('project_value_gold')
  .setValue(proposal_project_value_gold)
  }
  if(proposal_project_value_silver){
    this.kartRequest.get('project_value_silver')
  .setValue(proposal_project_value_silver)
  }
  if (typeof this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_gold !=
      "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_gold != "" &&
    this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_gold != null
  ) {
    this.kartRequest.controls.proposal_remote_monitoring_system_gold.setValue(
      this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_gold
    );
  }
  if (typeof this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_silver !=
      "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_silver != "" &&
    this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_silver != null
  ) {
    this.kartRequest.controls.proposal_remote_monitoring_system_silver.setValue(
      this.proposalEmailData.proposalDetails.proposal_remote_monitoring_system_silver
    );
  }
  if (typeof this.proposalEmailData.proposalDetails.proposal_service_support != "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_service_support != "" &&
    this.proposalEmailData.proposalDetails.proposal_service_support != null
  ) {
    this.kartRequest.controls.proposal_service_support.setValue(
      this.proposalEmailData.proposalDetails.proposal_service_support
    );
  }
  if (typeof this.proposalEmailData.proposalDetails.proposal_solar_battery != "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_solar_battery != "" &&
    this.proposalEmailData.proposalDetails.proposal_solar_battery != null
  ) {
    this.kartRequest.controls.proposal_solar_battery.setValue(
      this.proposalEmailData.proposalDetails.proposal_solar_battery
    );
  }
  if (typeof this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_gold !=
      "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_gold != "" &&
    this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_gold != null
  ) {
    this.kartRequest.controls.proposal_solar_pv_panels_gold.setValue(
      this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_gold
    );
  }
  if (typeof this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_silver !=
      "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_silver != "" &&
    this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_silver != null
  ) {
    this.kartRequest.controls.proposal_solar_pv_panels_silver.setValue(
      this.proposalEmailData.proposalDetails.proposal_solar_pv_panels_silver
    );
  }
  if(proposal_structure_type){
    this.kartRequest.get('proposal_structure_type')
  .setValue(proposal_structure_type)
  }
  if(proposal_syncAmount){
    this.kartRequest.get('proposal_syncAmount')
  .setValue(proposal_syncAmount)
  }
  if(proposal_syncValue){
    this.kartRequest.get('proposal_syncValue')
  .setValue(proposal_syncValue)
  }
  if (
    typeof this.proposalEmailData.proposalDetails.repayment_period != "undefined" &&
    this.proposalEmailData.proposalDetails.repayment_period != "" &&
    this.proposalEmailData.proposalDetails.repayment_period != null
  ) {
    this.kartRequest.controls.repayment_period.setValue(
      this.proposalEmailData.proposalDetails.repayment_period
    );
  }
  this.numberOfSolarInverter = this.proposalEmailData.proposalDetails.proposal_inverter_number;
  if (
    typeof this.proposalEmailData.proposalDetails.proposal_pricing_options != "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_pricing_options != "" &&
    this.proposalEmailData.proposalDetails.proposal_pricing_options != null
  ) {
    this.selectePricingOption = this.proposalEmailData.proposalDetails.proposal_pricing_options;
  }
      // this.Ccmails = 'solar@luminousindia.com,' + this.surveyorEmpDetail.emp_email;
      // this.kartRequest.controls.proposal_details_id.setValue(
      //   this.proposalEmailData.proposalDetails.proposal_details_id
      // );
  if (this.proposalEmailData.proposalDetails.proposal_solution_type == 1) {
    this.onGridInverterEmailValue =
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity +
      " Nos. " +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating +
      " " +
      "Inverter";
     }
     else if(this.proposalEmailData.proposalDetails.proposal_solution_type == 3) {
      this.hybridInverterEmailValue =
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity +
      " Nos. " +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating +
      " " +
      "Hybrid Inverter";
     }
     else {
    this.offGridInverterEmailValue =
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity +
      "*" +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating +
      " " +
      this.proposalEmailData.proposalDetails.inverter_voltage +
      "V";
  }
  if (this.proposalEmailData.proposalDetails.proposal_inverter_number >= 2) {
    this.onGridInverterEmailValue +=
      " + " +
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity2 +
      " Nos. " +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating2 +
      " " +
      "Inverter  ";
      this.hybridInverterEmailValue +=
      " + " +
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity2 +
      " Nos. " +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating2 +
      " " +
      "Hybrid Inverter  ";
    this.offGridInverterEmailValue +=
      " + " +
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity2 +
      "*" +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating2 +
      " " +
      this.proposalEmailData.proposalDetails.inverter_voltage +
      "V";
  }
  if (this.proposalEmailData.proposalDetails.proposal_inverter_number >= 3) {
    this.onGridInverterEmailValue +=
      " + " +
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity3 +
      " Nos. " +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating3 +
      " " +
      "Inverter  ";
      this.hybridInverterEmailValue +=
      " + " +
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity3 +
      " Nos. " +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating3 +
      " " +
      "Hybrid Inverter  ";

    this.offGridInverterEmailValue +=
      " + " +
      this.proposalEmailData.proposalDetails.proposal_inverter_quantity3 +
      "*" +
      this.proposalEmailData.proposalDetails.proposal_inverter_rating3 +
      " " +
      this.proposalEmailData.proposalDetails.inverter_voltage +
      "V";
  }

this.selecteEmiOption=proposal_emi_option
this.is_discount_available=is_discount;
if(proposal_pricing_options){
  this.selectePricingOption=proposal_pricing_options;
}
this.bank_finance=bank_finance;
// let  payBackFormArray: FormArray = this.kartRequest.get('payBackFormArray') as FormArray;
// if(is_capex =="1" && this.off_grid){
// this.capexSelected=true
// this.kartRequest.get('paybackValidation')
// .setValue("1")
// if(!payBackFormArray.value.includes("capex")){
//   payBackFormArray.push(new FormControl('capex'))
// }
// }

// if(is_capex =="0" && this.off_grid){
//   this.capexSelected=false
// }
// if(is_opex=="1"  && this.off_grid  ){
//   this.opexSelected=true
//   this.kartRequest.get('paybackValidation')
// .setValue("1")
// if(!payBackFormArray.value.includes("opex")){
//   payBackFormArray.push(new FormControl('opex'))
// }
// }
// if(is_opex =="0" && this.off_grid){
//   this.opexSelected=false
// }

  }

  if(this.proposalEmailData.proposalDetails.payment_split !==null && this.proposalEmailData.proposalDetails.payment_split !=""){
    this.kartRequest.get('payment_split')
    .setValue(this.proposalEmailData.proposalDetails.payment_split)
   }
   else{
    this.kartRequest.get('payment_split')
    .setValue('3')

   }

   if(this.proposalEmailData.proposalDetails.netMeteringcost){
     this.kartRequest.get('netMeteringcost').setValue(this.proposalEmailData.proposalDetails.netMeteringcost);
   }

  if (
    typeof this.proposalEmailData.proposalDetails.proposal_email_signature != "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_email_signature != "" &&
    this.proposalEmailData.proposalDetails.proposal_email_signature != null
  ) {
    this.kartRequest.controls.proposal_email_signature.setValue(
      this.proposalEmailData.proposalDetails.proposal_email_signature
    );
  } else {
    var defaultEmailSignature =
      "<p>" +
      this.userData.emp_firstname.charAt(0).toUpperCase() +
      this.userData.emp_firstname.substr(1).toLowerCase() +
      " " +
      this.userData.emp_lastname.charAt(0).toUpperCase() +
      this.userData.emp_lastname.substr(1).toLowerCase() +
      " | Team solarbyluminous™ </p> <p>Tel:- +91-124-4776700, Fax: +91-124-2544170, Mobile: +91-" +
      this.userData.emp_mobileno +
      "</p><p>Head Office: Plot 150, Sector 44, Gurugram, Haryana 122003 (INDIA) </p>" +
      "<p>Branch Office: " +
      this.userData.emp_address2 +
      "</p>";
    this.kartRequest.controls.proposal_email_signature.setValue(
      defaultEmailSignature
    );
  }

  if(this.proposalEmailData.proposalDetails.tranche_description){
    let tranche_description=JSON.parse(this.proposalEmailData.proposalDetails.tranche_description);
    let advancePercentageDes=tranche_description[0];
    let secondTranchePercentageDes=tranche_description[1];
    let thirdTrancheDes=tranche_description[2];
    let fourTranchDes=tranche_description[3];
    if(advancePercentageDes){
      this.tranche_description.controls[0].setValue(advancePercentageDes);
    }
    if(secondTranchePercentageDes){
      this.tranche_description.controls[1].setValue(secondTranchePercentageDes);
    }
    if(thirdTrancheDes){
      this.tranche_description.controls[2].setValue(thirdTrancheDes);
    }
    if(fourTranchDes){
      this.tranche_description.controls[3].setValue(fourTranchDes);
    }
  }

  if (
    typeof this.proposalEmailData.proposalDetails.proposal_email_signature != "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_email_signature != "" &&
    this.proposalEmailData.proposalDetails.proposal_email_signature != null
  ) {
    this.kartRequest.controls.proposal_email_signature.setValue(
      this.proposalEmailData.proposalDetails.proposal_email_signature
    );
  } else {
    var defaultEmailSignature =
      "<p>" +
      this.userData.emp_firstname.charAt(0).toUpperCase() +
      this.userData.emp_firstname.substr(1).toLowerCase() +
      " " +
      this.userData.emp_lastname.charAt(0).toUpperCase() +
      this.userData.emp_lastname.substr(1).toLowerCase() +
      " | Team solarbyluminous™ </p> <p>Tel:- +91-124-4776700, Fax: +91-124-2544170, Mobile: +91-" +
      this.userData.emp_mobileno +
      "</p><p>Head Office: Plot 150, Sector 44, Gurugram, Haryana 122003 (INDIA) </p>" +
      "<p>Branch Office: " +
      this.userData.emp_address2 +
      "</p>";
    this.kartRequest.controls.proposal_email_signature.setValue(
      defaultEmailSignature
    );
  }

let is_capex=this.proposalEmailData.proposalDetails.is_capex;
let  is_opex=this.proposalEmailData.proposalDetails.is_opex;
let  payBackFormArray: FormArray = this.kartRequest.get('payBackFormArray') as FormArray;
if(is_capex){
if(is_capex =="1" && this.off_grid){
this.capexSelected=true
this.kartRequest.get('paybackValidation')
.setValue("1")
if(!payBackFormArray.value.includes("capex")){
  payBackFormArray.push(new FormControl('capex'))
}
}
if(is_capex =="0" && this.off_grid){
  this.capexSelected=false
}
}
else{
  this.capexSelected=false;
}
if(is_opex){
if(is_opex=="1"  && this.off_grid  ){
  this.opexSelected=true
  this.kartRequest.get('paybackValidation')
.setValue("1")
if(!payBackFormArray.value.includes("opex")){
  payBackFormArray.push(new FormControl('opex'))
}
}
if(is_opex =="0" && this.off_grid){
  this.opexSelected=false
}
}
else{
  this.opexSelected=false;
}
if(this.proposalEmailData.proposalDetails.proposal_type){
  this.kartRequest.get('proposal_type')
  .setValue(this.proposalEmailData.proposalDetails.proposal_type);
}
else{
  this.kartRequest.get('proposal_type')
  .setValue('1');

}
  if (typeof this.proposalEmailData.proposalDetails.proposal_insolated_city != "undefined" &&
  this.proposalEmailData.proposalDetails.proposal_insolated_city != "" &&
  this.proposalEmailData.proposalDetails.proposal_insolated_city != null
) {
  this.kartRequest.controls.proposal_insolated_city.setValue(
    this.proposalEmailData.proposalDetails.proposal_insolated_city
  );
} else {
  for (let item of this.InsolationRefcityListing) {
    if (
      this.customerCityName &&
      this.customerCityName.indexOf(item.label) > -1
    ) {
      let value = item.value;
      this.kartRequest.controls.proposal_insolated_city.setValue(
        value + ""
      );
      this.kartRequest.controls.global_solr_irr.setValue(value + "");
    }
  }
}
  if (this.surveyorEmpDetail && this.surveyorEmpDetail.emp_email) {
    if (this.surveyorEmpDetail.emp_email != this.userData.emp_email) {
      this.Ccmails =
        this.surveyorEmpDetail.emp_email + "," + this.userData.emp_email;
    } else {
      this.Ccmails = this.surveyorEmpDetail.emp_email;
    }
  }else{
    this.Ccmails = this.userData.emp_email;
  }
  if (this.proposalEmailData.proposalDetails.CcEmail == "" || this.proposalEmailData.proposalDetails.CcEmail == null
      ) {
        this.kartRequest.controls.CcEmail.setValue(this.Ccmails);
      } else {
        this.kartRequest.controls.CcEmail.setValue(
          this.proposalEmailData.proposalDetails.CcEmail
        );
      }
      if (typeof this.proposalEmailData.proposalDetails.proposal_solution_type != "undefined" &&
    this.proposalEmailData.proposalDetails.proposal_solution_type != "" &&
    this.proposalEmailData.proposalDetails.proposal_solution_type != null
  ) {
    this.kartRequest.controls.proposal_solution_type.setValue(
      this.proposalEmailData.proposalDetails.proposal_solution_type
    );
  } else {
    if (typeof this.proposalEmailData.sf_feasible_solution_type != "undefined" &&
      this.proposalEmailData.sf_feasible_solution_type != "" &&
      this.proposalEmailData.sf_feasible_solution_type != null
    ) {
      let sf_feasible_solution_type = this.proposalEmailData
        .sf_feasible_solution_type;

      if (sf_feasible_solution_type == "on_grid") {
        this.kartRequest.controls.proposal_solution_type.setValue("1");
      }

      if (sf_feasible_solution_type == "hybrid") {
        this.kartRequest.controls.proposal_solution_type.setValue("3");
      }

      if (sf_feasible_solution_type == "off_grid") {
        this.kartRequest.controls.proposal_solution_type.setValue("2");
      }
    }
  }
let parsed= JSON.parse(this.proposalEmailData.proposalDetails.bos_equipments);
        let number_of_solar_panel= this.proposalEmailData.proposalDetails.proposal_number_of_solar_panel

        if(parsed){
          parsed.forEach(data=>{
            let find=this.ComponentData.find(Compdata=>Compdata.component ==data.component);
            if(find){
              data.id=find.id;
            }
          let i=this.ComponentData.findIndex(comData=>{
            return comData.component ==data.component
          })
          if(i!=-1){
            this.ComponentData.splice(i,1,data);
          }
          })
        }
         if(parsed ==null){
              this.ComponentData.forEach(data=>{
                data.checked=true;
              })
              this.ComponentData.forEach(data=>{
              let o= this.bos_equipments.value.findIndex(val=>{
                return  val.component ==data.component
                })
                if(o ==-1)
                this.bos_equipments.push(new FormControl(data));
              });
        }else{
                parsed.forEach(data=>{
                    let i=this.bos_equipments.value.findIndex(val=>{
                    return val.component ==data.component
                     });
                    if(i ==-1)
                      this.bos_equipments.push(new FormControl(data));
                });
                this.ComponentData.forEach(data=>{
                  data.checked=false;
                });
                parsed.forEach(value1=>{
                  this.ComponentData.forEach(value2=>{
                    if(value1.component ==value2.component){
                      value2.checked=true;
                    }
                  })
                })
        }
        if(number_of_solar_panel ){
          this.ComponentData[1].qty=number_of_solar_panel+' '+'No';
         let isSolarPvPanel=this.bos_equipments.value.findIndex(val=>val.component=='Solar PV Panel');
        if(isSolarPvPanel !=-1){
          this.bos_equipments.value.splice(isSolarPvPanel,1,this.ComponentData[1])
        }
        }

        let quantity=Number(this.proposalEmailData.proposalDetails.proposal_inverter_quantity);
        let quantity2=Number(this.proposalEmailData.proposalDetails.proposal_inverter_quantity2);
        let quantity3=Number(this.proposalEmailData.proposalDetails.proposal_inverter_quantity3);

        this.ComponentData[0].qty=String(quantity+quantity2+quantity3)+''+' No';
        let isSolarInverter=this.bos_equipments.value.findIndex(val=>val.component=='Solar Inverter');
        if(isSolarInverter !=-1){
          this.bos_equipments.value.splice(isSolarInverter,1,this.ComponentData[0]);
        }
        this.bos_equipments.value.sort((a,b)=>{
          if(a.id > b.id){
            return 1;
          }
          else if(a.id<b.id){
            return -1;
          }
          else{
            return 0;
          }
        })
        //optional equipments
        if(this.proposalEmailData.proposalDetails.equipments){
          this.equipmentData=[
  {id:1,checked:false,component:'Walkway',description:'300 mm wide FRP Walkways on metal roof for movement & services of solar power plant as per design',make:'India Make',qty:'1 Set',warranty:'--'},
  {id:2,checked:false,component:'Safety Line',description:'GI Safety life line on metal roof for solar power plant service.',make:'India Make',qty:'1 Set',warranty:'--'},
  {id:3,checked:false,component:'Water Cleaning System',description:'Water pipeline for SPV module cleaning: – 1 inch GI/UPVC pipeline with suitable no. of water taps & its accessories.Note: Pressurized water supply to be provided by customer for every proposed building rooftop',make:'Indian Make',qty:'1 Set',warranty:'--'},
  {id:4,checked:false,component:'Fire Protection',description:'1 no. 5Kg, Dry Co2 Fire extinguisher, 1 no. fire & safety instruction chart.',make:'Indian Make',qty:'1 No.',warranty:'--'},
  {id:5,checked:false,component:'Solar Sensor',description:'Solar Irradiance & module temperature sensor PV crystalline type',make:'Meteo control/equ.',qty:'1 No',warranty:'--'},
];
         let parsedequip= JSON.parse(this.proposalEmailData.proposalDetails.equipments);
         parsedequip.forEach((data) => {
          let idx = this.equipmentData.findIndex(
            (optional) => optional.component == data.component
          );
          if (idx == -1) {
            this.equipmentData.push({...data,checked:true});
          } else {
            this.equipmentData[idx] = {...data,checked:true};
          }
          let i = this.equipments.value.findIndex((val) => {
            return val.component == data.component;
          });
          if (i == -1) {
            this.equipments.push(new FormControl(data));
          }
        });

        // this.equipmentData.forEach(data=>{
        //   data.checked=false;
        // })
        // parsedequip.forEach(v1=>{
        //   this.equipmentData.forEach(v2=>{
        //     if(v1.component == v2.component){
        //      v2.checked=true;
        //     }
        //   })
        // })
        this.equipments.value.sort((a,b)=>{
          if(a.id > b.id){
            return 1;
          }
          else if(a.id < b.id){
            return -1;
          }
          else{
            return 0;
          }
        })
      }
    this.paymentPercentageCheck();
    this.paymentPercentageCheck_silver();
  }

  showTabData(step: number) {
    this.panelSteps = step;
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

  searchProjects() {
    this.showSmartSearchComponent = false;
    this.searchForm = this.formBuilder.group({
      qType: ["", Validators.compose([Validators.required])],
      q: [""],
      project_status: ["", Validators.compose([Validators.required])]
    });
    this.actionableList = [];
    this.nonActionableList = [];
    this.isListing = "project-search";
    this.getProjectStatusList();
    this.searchFormValidation();
  }

  submitSearch() {
    this.isSearchFormSubmitted = true;
    this.actionableList = [];
    this.nonActionableList = [];
    this.isPaymentList = false;
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.downloadFileName =
      this.searchResultXlsPath +
      "search_result_" +
      this.userData.emp_id +
      ".xls";
    if (this.searchForm.valid) {
      this.leadListService
        .searchProject(this.searchForm.value)
        .subscribe(
          data => {
            if (data.status) {
              this.leadData = data.result.data;
              this.getActionNonActionArrays(this.leadData);
              if (this.leadData.length > 0) {
                this.popupMessageService.showSuccess(
                  "Data Listed Successfully!",
                  "Success"
                );
              } else {
                this.popupMessageService.showInfo("No Data Found", "Info");
              }
            } else {
              this.popupMessageService.showError(data.error_message, "Error!");
            }
          },
          error => {
            this.popupMessageService.showError("Server Error.", "Error!");
          }
        );
    }
  }
  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

   isNumberKey(evt,msg=false){
     let charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode != 46 && charCode > 31
       && (charCode < 48 || charCode > 57)){
        return false;
       }
       else{
        return true;
       }

  }


  searchLeads() {
    this.showSmartSearchComponent = false;
    this.searchLeadForm = this.formBuilder.group({
      qType: ["", Validators.compose([Validators.required])],
      q: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^([a-zA-Z0-9 _-]+)$/)
        ])
      ]
    });
    this.unprocessedLeads = [];
    this.isListing = "lead-search";
  }

  submitLeadSearch() {
    this.isLeadSearchFormSubmitted = true;
    this.unprocessedLeads = [];
    if (this.searchLeadForm.valid) {
      this.leadListService
        .searchLead(this.searchLeadForm.value)
        .subscribe(
          data => {
            if (data.status) {
              this.unprocessedLeads = data.result.data;

              if (this.unprocessedLeads.length > 0) {
                this.popupMessageService.showSuccess(
                  "Data Listed Successfully!",
                  "Success"
                );
              } else {
                this.popupMessageService.showInfo("No Data Found", "Info");
              }
            } else {
              this.popupMessageService.showError(data.error_message, "Error!");
            }
          },
          error => {
            this.popupMessageService.showError("Server Error.", "Error!");
          }
        );
    }
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
        arrPush.push({
          value: String(item.pmstate_id),
          label: String(item.pmstate_name)
        });
      }
      return arrPush;
    }
  }

  searchFormValidation() {
    const q = this.searchForm.get("q");
    const project_status = this.searchForm.get("project_status");
    this.searchForm.get("qType").valueChanges.subscribe((q_type: string) => {
      if (q_type != "project_status") {
        q.setValidators([
          Validators.required,
          Validators.pattern(/^([a-zA-Z0-9 _-]+)$/)
        ]);
        project_status.clearValidators();
        this.searchForm.controls.project_status.setValue("0");
      } else {
        project_status.setValidators([Validators.required]);
        q.clearValidators();
      }
      q.updateValueAndValidity();
      project_status.updateValueAndValidity();
    });
  }

  getProjectStatusList() {
    this.leadListService.projectStatusList().subscribe(
      data => {
        if (data.status) {
          this.projectStatusList = this.convertProjectStatusForSelect(
            data.data
          );
        } else {
          this.popupMessageService.showError(data.error_message, "Error!");
        }
      },
      error => {
        this.popupMessageService.showError("Server Error.", "Error!");
      }
    );
  }

  getProjectCloseReason() {
    this.leadListService.projectCloseReasonList().subscribe(
      data => {
        if (data.status) {
          this.projectCloseReason = this.convertForSelectForCloseReason(
            data.data
          );
        } else {
          this.popupMessageService.showError(data.error_message, "Error!");
        }
      },
      error => {
        this.popupMessageService.showError("Server Error.", "Error!");
      }
    );
  }

  convertForSelectForCloseReason(listItems: any) {
    if (listItems.length <= 0) {
      return [];
    } else {
      let closeReasonPush = [];
      for (let item of listItems) {
        closeReasonPush.push({
          value: String(item.pcrm_id),
          label: String(item.pcrm_reason)
        });
      }
      return closeReasonPush;
    }
  }

  addNewStausForProject() {
    this.leadListService.AddNewStatusForProject().subscribe(
      data => {
        if (data.status) {
        } else {
          this.popupMessageService.showError(data.error_message, "Error!");
        }
      },
      error => {
        this.popupMessageService.showError("Server Error.", "Error!");
      }
    );
  }
  projectDetail: any = [];
  //get project status data
  getProjectStatusDataDetailed() {
    // this.showSmartSearchComponent = false;
    // this.panelSteps = 2;
    // this.currentProjectId = projectID;
    // this.isloadExpand = false;
    if (this.projectID) {
      this.leadListService
        .getProjectStatusDataService(this.projectID)
        .subscribe(data => {
          //   console.log(data.data.consumer_project_data[0]);
          if (data.status) {
            // this.checklistStatus = false;
            // this.isListing = '';
            // this.showForm = 'project_status_form';
            // this.consumerProjectData = data.data.consumer_project_data[0];
            this.consumerprojectdata = data.data.consumer_project_data[0];
            this.projectDetail = data.data.project_status_data;
            // this.projectType=data.data.consumer_project_data[0].project_type;
            // this.setInvertorAccessoriesValidations()
            // this.projectRejectionData = data.data.rejection_data;
            // this.consumerID = this.consumerProjectData.project_consumerid;
            //this.rejData = data.data[0].prd_remarks;
          } else {
          }
        });
    }
  }
  proposal_lifetime_saving:any;

  getPropsalEmailData() {
    this.leadListService
      .getPropsaEmaillData(this.projectID)
      .subscribe(
        data => {
          if (data.result.data) {
            this.proposalEmailData = data.result.data;
            this.previewProposalAdvanced=(this.proposalEmailData.proposalDetails.proposal_advanced? Math.round((this.proposalEmailData.proposalDetails.proposal_advanced* (this.proposalEmailData.proposalDetails.proposal_project_value_gold - this.proposalEmailData.proposalDetails.discount) )/100):'' );
            this.previewProposalAdvanceSilver=(this.proposalEmailData.proposalDetails.proposal_advance_silver? Math.round((this.proposalEmailData.proposalDetails.proposal_advance_silver*(this.proposalEmailData.proposalDetails.proposal_project_value_silver - this.proposalEmailData.proposalDetails.discount_silver))/100):'' );
            this.previewProposalPayment2=( this.proposalEmailData.proposalDetails.proposal_payment_2? Math.round((this.proposalEmailData.proposalDetails.proposal_payment_2 * (this.proposalEmailData.proposalDetails.proposal_project_value_gold - this.proposalEmailData.proposalDetails.discount))/100):'');
            this.previewProposalAdvanceSilver1=( this.proposalEmailData.proposalDetails.proposal_advance_silver_1? Math.round((this.proposalEmailData.proposalDetails.proposal_advance_silver_1 * (this.proposalEmailData.proposalDetails.proposal_project_value_silver - this.proposalEmailData.proposalDetails.discount_silver))/100):'');
            this.previewProposalPayment3= ( this.proposalEmailData.proposalDetails.proposal_payment_3? Math.round((this.proposalEmailData.proposalDetails.proposal_payment_3 * (this.proposalEmailData.proposalDetails.proposal_project_value_gold - this.proposalEmailData.proposalDetails.discount))/100):'');
            this.previewProposalAdvanceSilver2=( this.proposalEmailData.proposalDetails.proposal_advance_silver_2? Math.round((this.proposalEmailData.proposalDetails.proposal_advance_silver_2 * (this.proposalEmailData.proposalDetails.proposal_project_value_silver - this.proposalEmailData.proposalDetails.discount_silver))/100):'');
            this.previewProposalPayment4=( this.proposalEmailData.proposalDetails.proposal_payment_4 ? Math.round((this.proposalEmailData.proposalDetails.proposal_payment_4 * (this.proposalEmailData.proposalDetails.proposal_project_value_gold - this.proposalEmailData.proposalDetails.discount))/100):'');
            this.previewProposalAdvanceSilver3=( this.proposalEmailData.proposalDetails.proposal_advance_silver_3?Math.round((this.proposalEmailData.proposalDetails.proposal_advance_silver_3 * (this.proposalEmailData.proposalDetails.proposal_project_value_silver - this.proposalEmailData.proposalDetails.discount_silver))/100):'');
            this.proposal_lifetime_saving=Number(data.result.data.proposalDetails.proposal_lifetime_savings_opex);
            this.isProposalEmailPreview = true;
            this.proposal_advanced=Number(data.result.data.proposalDetails.proposal_advanced);
            this.proposal_advance_silver=Number(data.result.data.proposalDetails.proposal_advance_silver);
            if (this.proposalEmailData.proposalDetails.proposal_solution_type == 1) {
              this.solutionTypeText = "Grid-Tied";
            } else if (this.proposalEmailData.proposalDetails.proposal_solution_type == 2) {
              this.solutionTypeText = "Off-Grid";
            }
            else if (this.proposalEmailData.proposalDetails.proposal_solution_type == 3) {
              this.solutionTypeText = "Hybrid";
            }

            this.setpaneltype(this.proposalEmailData.proposalDetails.proposal_panel_type);
            if(this.proposalEmailData.proposalDetails.proposal_pricing_options){
              this.selectePricingOption = this.proposalEmailData.proposalDetails.proposal_pricing_options;
            }
             this.proposal_addition_email_text = this.proposalEmailData.proposalDetails ? this.proposalEmailData.proposalDetails.proposal_addition_email_text:null;
            this.createKartRequestForm();
            this.showTabData(1);
          } else {
            // this.popupMessageService.showError(data.error_message, "Error!");
          }
        },
        error => {
          this.popupMessageService.showError("Server Error.", "Error!");
        }
      );
  }

  setpaneltype(type){
   // console.log(type,'gunjan')
    if (type == 1) {
      this.panelTypeText = "72-Cell Poly-Crystalline";
    } else if (type == 2) {
      this.panelTypeText = "144-Cell Mono PERC Half Cut";
    } else if (type == 3) {
      this.panelTypeText = "72-Cell Mono Crystalline";
    }
    else if (type == 4) {
      this.panelTypeText = "72-Cell Mono Crystalline PERC";
    }
  }

  openEmailPreviewPopup() {
    if (!this.openEmailPreviewBox) {
      this.openEmailPreviewBox = true;
    } else {
      this.openEmailPreviewBox = false;
    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.kartRequest.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
   // console.log(invalid);
    return invalid;
  }

  calculateDCapacity() {
    let no_of_solar_panel_value = Number(
      this.kartRequest.controls.number_of_solar_panel.value
    );
    let module_capacity_value = Number(
      this.kartRequest.controls.module_capacity.value
    );
    this.kartRequest.controls.proposal_dc_capacity.setValue(
      no_of_solar_panel_value * module_capacity_value
    );
  }

  paymentPercentageCheck() {
    let payment_split = Number(this.kartRequest.controls.payment_split.value);
    let payment_install1 = Number(
      this.kartRequest.controls.proposal_advanced.value
    );
    let payment_install2 = Number(
      this.kartRequest.controls.proposal_payment_2.value
    );
    let payment_install3 = Number(
      this.kartRequest.controls.proposal_payment_3.value
    );

    if (payment_split == 3) {
      if (payment_install1 + payment_install2 + payment_install3 == 100) {
        this.payment_percentage_check = 1;
      } else {
        this.payment_percentage_check = 0;
      }
    } else {
      let payment_install4 = Number(
        this.kartRequest.controls.proposal_payment_4.value
      );
      if (
        payment_install1 +
          payment_install2 +
          payment_install3 +
          payment_install4 ==
        100
      ) {
        this.payment_percentage_check = 1;
      } else {
        this.payment_percentage_check = 0;
      }
    }
  }
  paymentPercentageCheck_silver() {
    let payment_split = Number(this.kartRequest.controls.payment_split.value);
    let payment_install1 = Number(
      this.kartRequest.controls.proposal_advance_silver.value
    );
    let payment_install2 = Number(
      this.kartRequest.controls.proposal_advance_silver_1.value
    );
    let payment_install3 = Number(
      this.kartRequest.controls.proposal_advance_silver_2.value
    );

    if (payment_split == 3) {
      if (payment_install1 + payment_install2 + payment_install3 == 100) {
        this.payment_percentage_check_silver = 1;
      } else {
        this.payment_percentage_check_silver = 0;
      }
    } else {
      let payment_install4 = Number(
        this.kartRequest.controls.proposal_advance_silver_3.value
      );
      if (
        payment_install1 +
          payment_install2 +
          payment_install3 +
          payment_install4 ==
        100
      ) {
        this.payment_percentage_check_silver = 1;
      } else {
        this.payment_percentage_check_silver = 0;
      }
    }
  }

  smartSearchResults(event) {
    let searchResult = event.data;
    this.actionableList = [];
    this.nonActionableList = [];
    this.getActionNonActionArrays(searchResult);
  }
  getRevisedProposal() {
    this.showSmartSearchComponent = false;
    this.isListing = "revised-proposal-list";
    this.isPaymentList = false;
    this.userData = JSON.parse(localStorage.getItem("userData"));
    if (localStorage.getItem("emp_auth_key")) {
      this.leadListService
        .getRevisedProposalFromFollowupDetails()
        .subscribe(data => {
          if (data.status) {
            this.revisedProposalFolloupData = data.result.data;
          } else {
           // console.log("error");
          }
        });
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  /**
   * @description: Sending Email through button directly from the pop up
   * @developer: Roshan
   */
  SendEmail() {
    if (
      this.proposalEmailData.length == 0 ||
      (this.proposalEmailData.proposal_project_value_gold <= 0 &&
        this.proposalEmailData.proposal_project_value_silver <= 0)
    ) {
      this.popupMessageService.showError("Proposal Value is Blank", "Error");
      return false;
    }
    let project_id = this.currentProjectId;
    this.actionLoader = "fillKart_loader";
    this.leadListService
      .sendProposalMail(project_id)
      .subscribe(data => {
        if (data.status == 1) {
          this.is_email_sent = 1; // if email send successfully.
          this.popupMessageService.showInfo("Proposal Email Sent", "Info");
          //surveyor checklist submit
          this.checklistSubmitForm.controls.checklist_name.setValue("13");
          this.checkIfRemarkable(13);
          //this.changeProjectStatus();
          //end of surveyor checklist submit
          this.openEmailPreviewBox = false;
        } else {
          this.popupMessageService.showError("Email sent Failed", "Error");
        }
        this.actionLoader = "";
      });
  }

  /**
   * @developer:roshan
   */
  ProposalDoumentSelect(event, pdoc_id) {
    let value = event.srcElement.checked ? 1 : 0;
    //console.log(value);
    this.leadListService
      .selectProposalService(pdoc_id, value, "proposal")
      .subscribe(data => {
        if (data.status) {
          let idx=this.projectDocuments.findIndex(item=>item.pdoc_id==pdoc_id);

          if(idx!==-1){

            this.projectDocuments[idx].pdoc_attached_email=value
          }
          if (data.data == 1) {
            this.popupMessageService.showInfo("Checked proposal", "success");
          } else {
            this.popupMessageService.showInfo("Unchecked proposal", "success");
          }
        } else {
          this.popupMessageService.showError("Proposal Check Failed", "Error!");
        }
      });
  }

  ProposalCatalogSelect(event,doctype) {
    let value = event.srcElement.checked ? 1 : 0;
    //console.log(value);
    this.leadListService
      .selectProposalService(this.currentProjectId, value, doctype)
      .subscribe(data => {
        if (data.status) {

          this.proposalEmailData.proposalDetails[doctype=='catalog'? 'proposal_catalog' : 'proposal_intro']=value;
          if (value) {
            this.proposalEmailData.proposalDetails[doctype=='catalog'? 'proposal_catalog' : 'proposal_intro']
            this.popupMessageService.showInfo("Checked Document", "success");
          } else {
            this.popupMessageService.showInfo("Unchecked Document", "success");
          }
        } else {
          this.popupMessageService.showError("Proposal Check Failed", "Error!");
        }
      });
  }

  EmailSentChange(event) {
    let value = event.srcElement.checked ? 1 : 0;
    this.leadListService
      .selectProposalService(this.currentProjectId, value, "email")
      .subscribe(data => {
        if (data.status) {
          if (data.data == 1) {
            if (value == 1) {
              this.popupMessageService.showInfo("Success Checked", "success");
            } else {
              this.popupMessageService.showInfo("Success Unchecked", "success");
            }
          } else {
            this.popupMessageService.showInfo("Email Sent fail", "success");
          }
        } else {
          this.popupMessageService.showError("Email Sent fail", "Error!");
        }
      });
  }

  ConfirmDeleting: boolean = false;
  pdoc_data: any;
  confirmDeleteDoc(data) {
    this.ConfirmDeleting = true;
    this.pdoc_data = data;
  }

  hideConfirmDeleting() {
    this.ConfirmDeleting = false;
  }

  DeleteDocument(pdoc_data) {
    let pdoc_id = pdoc_data.pdoc_id;
    this.leadListService.deletePdoc(pdoc_id).subscribe(data => {
      if (data.status == 1) {
        this.ConfirmDeleting = false;
        this.getUploadedDocumentsForSolDesigner(pdoc_data.pdoc_projecitid);
        this.popupMessageService.showInfo("Document Removed", "!Info");
      } else {
        this.ConfirmDeleting = false;
        this.popupMessageService.showInfo("Document Removed failed", "!Info");
      }
    });
  }

  cityList: any;
  stateList: any;
  selectedState: any;

  selectedCity: any;
  localityList: any;
  knowYourStateCity(searchValue: string, type?: String) {
    // console.log(searchValue);
    if (searchValue.length == 6) {
      this.leadPanelService
        .getStateCityData(searchValue)
        .subscribe(data => {
          if (data.status) {
            this.selectedState = data.data.states_data[0].id;
            this.cityList = this.getCitybyState(this.selectedState);
            this.selectedCity = data.data.district_data[0].id;
            this.localityList = this.convertForSelectStates(
              data.data.locality_data
            );
            return;
          } else {
            this.cityList = this.convertForSelectStates(this.allCities, "city");
            this.stateList = this.convertForSelectStates(
              this.allStates,
              "state"
            );
          }
        });
    } else {
      this.kartRequest.controls["state"].setValue("");
      this.kartRequest.controls["city"].setValue("");
    }
  }

  getCitybyState(state_id: number) {
    let cityList = [];
    for (let item of this.allCities) {
      if (item.district_stateid == state_id)
        cityList.push({
          value: String(item.district_id),
          label: String(item.district_name)
        });
    }
    return cityList;
  }

  setStatebyCity(city_id: number) {
    let cityStateId = this.allCities.find(x => x.district_id == city_id)
      .district_stateid;
    if (cityStateId) {
      return cityStateId;
    }
    return null;
  }

  allStates: any;
  allCities: any;
  allStatesAndCitiesData() {
    this.leadPanelService.getAllStates().subscribe(data => {
      if (data.status) {
        this.allStates = data.data;
        this.stateList = this.convertForSelectStates(this.allStates, "state");
      }
    });

    this.leadPanelService.getAllCities().subscribe(data => {
      if (data.status) {
        this.allCities = data.data;
        //console.log(this.allCities,'all cities');
        this.cityList = this.convertForSelectStates(this.allCities, "city");
      }
    });
  }

  convertForSelectStates(listItems: any, type?: string) {
    if (listItems.length <= 0) {
      return [];
    } else {
      let arrPush = [];
      for (let item of listItems) {
        if (type == "state") {
          arrPush.push({
            value: String(item.state_id),
            label: String(item.state_name)
          });
        } else if (type === "city") {
          arrPush.push({
            value: String(item.district_id),
            label: String(item.district_name)
          });
        } else {
          arrPush.push({ value: String(item.id), label: String(item.name) });
        }
      }
      return arrPush;
    }
  }

  ifStateIfCity(type: String, formType?: String) {
    if (type == "state") {
      this.cityList = this.getCitybyState(this.kartRequest.get("state").value);
    } else if (type == "city") {
      this.kartRequest.controls.state.setValue(
        this.setStatebyCity(this.kartRequest.get("city").value)
      );
    }
  }

  getInsolationCity() {
    this.leadListService.getInsolationList().subscribe(data => {
      let insolationlist = data.data;
      let arrayInsolationcity = [];
      for (let item of insolationlist) {
        arrayInsolationcity.push({
          value: String(item.insolationCity.ins_yeild_value),
          label: String(item.insolationCity.ins_location)
        });
      }
      this.InsolationRefcityListing = arrayInsolationcity;
    });
  }

  contactsList: any;
  getProjectContacts(poject_id) {
    this.leadPanelService.getProjectContacts(poject_id).subscribe(data => {
      if (data.status == 1) {
        this.contactsList = data.data;
      }
    });
  }

  /*
  * InverterAcessories Change Detect
  */
  onSynChange(value) {
    this.syncAmountHide = value === 'none' ? true : false;
    if(this.syncAmountHide) {
     this.kartRequest.controls.proposal_syncAmount.setValue('');
     this.kartRequest.controls['proposal_syncAmount'].disable();
     this.removeAmountValidation();
    } else {
       this.kartRequest.controls['proposal_syncAmount'].enable();
       this.createAmountValidation();
     }
   }

  setformsection(value){
    this.formsection=value;
   // window.scroll(0,0);
  }
  newequipment: any = {};
  addRow(){
    this.newequipment={id: (this.equipmentData.length + 1),checked:false,component:'',description:'',make:'',qty:'',warranty:''};
    this.equipmentData.push(this.newequipment);
   return true;
  }

  onBeforeUnload(event){
      event.returnValue='Your Project will be stuck!';
  }
}
