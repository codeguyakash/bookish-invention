import { Component, OnInit } from '@angular/core';
import { LeadListService } from '../services/lead-list.service';
import { LeadPanelService } from '../../customer-care/services/lead-panel.service';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { PopupMessageService } from './../../message/services/message.service';
import * as globals from '../../../static/static';
import { SharedServices } from '../../../services/shared.services';
import { ScrollToAnimationEasing, ScrollToEvent, ScrollToOffsetMap } from '@nicky-lenaers/ngx-scroll-to';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanel implements OnInit {

  smartSearchFormData: any;
  showDashboard: Boolean = true;
  Level4Option: string;
  deleteLocality: any;
  lead_source_id: Number=0;
  locality_id: Number=0;
  deleteRecordFrom: String;
  editFlag: Boolean = false;
  leadList: any;
  ShowSidebarTab: string;
  MainDashboardOptions: string;
  LeadForm: FormGroup;
  ProductForm: FormGroup;
  LocalityForm: FormGroup;
  AnnouncementForm: FormGroup;
  showForm: Boolean = false;
  showListing: Boolean = false;
  openDeleteConfirmation:boolean= false;
  addSource: String = 'Add New Lead Source';
  editSource: String = 'Edit Lead Source';
  addLocality: String = 'Add New Locality';
  addAnnouncement: String = 'Add New Announcement';
  editLocalityHeading: String = 'Edit Locality';
  localityList: any;
  allDistricts: any;
  districts = [];
  paginationSubmitForm:FormGroup;
  itemPerPage: number = 20;
  pages: number = 1;
  totalItem: any;
  pageCount: any;
  isSubmittedLocality: boolean = false;
  mainDiv: String = 'showDashboard';
  offGridPanelList:any;
  funnelManagementList:any;
  offGridInverterList:any;
  gridPanelForm:FormGroup;
  gridInverterForm:FormGroup;
  onGridPanelList:any;
  onGridInverterList:any;
  invPanelDeleteId:number;
  noRecords: Boolean = false;
  categories:any = [{value : '1', label : 'Residential'},{ value : '2', label : 'Commercial'}];
  roleList=[];
  skillList=[];
  cats = {
    1: 'Residential',
    2: 'Commercial'
  }
  leadPriorityList = [
    {value: '1', label: 'P1'},
    {value: '2', label: 'P2'}
  ];
  rolesMap = [];
  refrenceList:Array<string> = [];


  funnelStage:{value:string,label:string}[]=[{
    value:"6",label:"S3-Proposed"
  },
  {
    value:"7",label:"S4-Negotiaton"
  }
  ]

  productTypes = [
    {value:"1",label:"On grid"},
    {value:"2",label:"Off grid"},
    {value:"3",label:"Hybrid"},
    {value:"4",label:"Battery"},
    {value:"5",label:"Panel"},
  ];

  submit:boolean = false;


  public ngxScrollToDestination: string;
  public ngxScrollToEvent: ScrollToEvent;
  public ngxScrollToDuration: number;
  public ngxScrollToEasing: ScrollToAnimationEasing;
  public ngxScrollToOffset: number;
  public ngxScrollToOffsetMap: ScrollToOffsetMap;

  SolarInverterOptionsOffGird: Array<any> = [
    { value: "1 kW/Solar NXT PCU, ", label: "1.25 kVA (1 kW) PCU" },
    { value: "2 kW/Solar NXT PCU", label: "2.5 kVA (2 kW) PCU" },
    { value: "3 kW/Solar NXT PCU", label: "3.75 kVA (3 kW) PCU" },
    { value: "6 kW/Solar NXT PCU", label: "7.5 kVA (6 kW) PCU" },
    { value: "7.5 kW/Solar NXT PCU", label: "9.5 kVA (7.5 kW) PCU" },
    { value: "10 kW/Solar NXT PCU", label: "12.5 kVA (10 kW) PCU" },
    { value: "1.6 kW/SOLARVERTER PRO", label: "2 kVA (1.6 kW) SOLARVERTER PRO" },
    { value: "2.4 kW/SOLARVERTER PRO", label: "3 kVA (2.4 kW) SOLARVERTER PRO" },
    { value: "1.6 kW/SOLARVERTER", label: "2 kVA (1.6 kW) SOLARVERTER" },
    { value: "2.4 kW/SOLARVERTER", label: "3 kVA (2.4 kW) SOLARVERTER" },
  ];

  SolarInverterOptionsOnGird: Array<any> = [
    { value: "1 kW/SOLAR NXI GTI", label: "1 kW SOLAR NXI" },
    { value: "1.5 kW/SOLAR NXI GTI", label: "1.5 kW SOLAR NXI" },
    { value: "2 kW/SOLAR NXI GTI", label: "2 kW SOLAR NXI" },
    { value: "3 kW/SOLAR NXI GTI", label: "3 kW SOLAR NXI" },
    { value: "4 kW/SOLAR NXI GTI", label: "4 kW SOLAR NXI" },
    { value: "5 kW/SOLAR NXI GTI", label: "5 kW SOLAR NXI" },
    { value: "8 kW/SOLAR NXI GTI", label: "8 kW SOLAR NXI" },
    { value: "6 kW/SOLAR NXI GTI", label: "6 kW SOLAR NXI" },
    { value: "10 kW/SOLAR NXI GTI", label: "10 kW SOLAR NXI" },
    { value: "12 kW/SOLAR NXI GTI", label: "12 kW SOLAR NXI" },
    { value: "15 kW/SOLAR NXI GTI", label: "15 kW SOLAR NXI" },
    { value: "20 kW/SOLAR NXI GTI", label: "20 kW SOLAR NXI" },
    { value: "25 kW/SOLAR NXI GTI", label: "25 kW SOLAR NXI" },
    { value: "30 kW/SOLAR NXI GTI", label: "30 kW SOLAR NXI" },
    { value: "50 kW/SOLAR NXI GTI", label: "50 kW SOLAR NXI" },
    { value: "60 kW/SOLAR NXI GTI", label: "60 kW SOLAR NXI" },
    { value: "80 kW/SOLAR NXI GTI", label: "80 kW SOLAR NXI" },
    { value: "100 kW/SOLAR NXI GTI", label: "100 kW SOLAR NXI" },
    { value: "110 kW/SOLAR NXI GTI", label: "110 kW SOLAR NXI" },
  ];

  SolarInverterOptionsHybrid: Array<any> = [
    { value: "3 kW/SOLAR HYBRID TX", label: "3.75 kVA (3 kW) SOLAR HYBRID TX"},
    { value: "4 kW/SOLAR HYBRID TX", label: "5 kVA (4 kW) SOLAR HYBRID TX"}
  ];

  invertOptions: any;

  constructor(
    private Service: LeadListService,
    private LeadPanelService: LeadPanelService,
    private formBuilder: FormBuilder,
    private popupMessageService: PopupMessageService,
    private sharedServices: SharedServices,
  ) {}

  ngOnInit() {
    this.statesListing();
    this.roleListGet();
  }

  districtsListing(id?:number) {
    this.LeadPanelService.getAllCities(id).subscribe(data => {
      this.allDistricts = data.data;
      let dist = [];
      for (let item of this.allDistricts) {
        dist.push({ value: String(item.district_id), label: String(item.district_name) });
      }
      this.districts = dist;
    })
  }

  states:any;
  statesListing() {
    this.LeadPanelService.getAllStates().subscribe(data => {
      let dist = [];
      for (let item of data.data) {
        dist.push({ value: String(item.state_id), label: String(item.state_name) });
      }
      this.states = dist;
    })
  }
  ShowLeadManagementOptions() {
    this.ShowSidebarTab = 'LeadManagementSideBar';
    this.mainDiv = 'Level2';
    this.MainDashboardOptions = 'showLeadManagement'
    this.Level4Option = '';
  }

  ShowAddProductsOptions() {
    this.ShowSidebarTab = 'addNewProduct';
    this.mainDiv = 'Level2';
    this.MainDashboardOptions = 'addProducts'
    this.Level4Option = '';
  }

  ShowLeadMasterListing() {
    // this.MainDashboardOptions = '';
    this.mainDiv = 'Level4';
    this.Level4Option = 'leadSourceListing';
    // this.showDashboard = false;
    this.Service.GetLeadsList().subscribe(response =>{
      if (response.status == 1) {
        this.leadList = response.data.data;
      }
    });
  }

  showProductsListingOngrid() {
    this.ShowSidebarTab = 'productListingOnGird';
    this.mainDiv = 'Level4';
    this.Level4Option = 'productListingOnGird';
    this.setinvertOptions();
  }

  showProductsListingOffGrid() {
    this.ShowSidebarTab = 'productListingOffGird';
    this.mainDiv = 'Level4';
    this.Level4Option = 'productListingOffGird';
    this.setinvertOptions();
  }

  showProductsListingHybrid() {
    this.ShowSidebarTab = 'productListingHybrid';
    this.mainDiv = 'Level4';
    this.Level4Option = 'productListingHybrid';
    this.setinvertOptions();
  }

  showProductsListingBattery() {
    this.ShowSidebarTab = 'productListingBattery';
    this.mainDiv = 'Level4';
    this.Level4Option = 'productListingBattery';
    this.setinvertOptions();
  }

  showProductsListingPanel() {
    this.ShowSidebarTab = 'productListingPanel';
    this.mainDiv = 'Level4';
    this.Level4Option = 'productListingPanel';
    this.setinvertOptions();
  }

  setinvertOptions() {
    let data;
    if(this.Level4Option == 'productListingOnGird') {
      data = {
        type: 1
      };
    }
    if(this.Level4Option == 'productListingOffGird') {
      data = {
        type: 2
      };
    }
    if(this.Level4Option == 'productListingHybrid') {
      data = {
        type: 3
      };
    }
    if(this.Level4Option == 'productListingBattery') {
      data = {
        type: 4
      };
    }
    if(this.Level4Option == 'productListingPanel') {
      data = {
        type: 5
      };
    }
    this.LeadPanelService.getInverterProducts(data).subscribe(
      res => {
        if(res.status) {
          this.invertOptions = res.data;
        }
      },
      err => {
        this.popupMessageService.showError("Something went wrong", "Error");
      }
    );
  }

  _keyPressVar(event: any) {
    const pattern1 = /[0-9\+\-\.\ ]/;
    const pattern2 = /^\d{1,3}?(\.\d{1,2})?$|(^\d+(\.)$)/;
    let inputChar = String.fromCharCode(event.charCode);
    let inputString = '';
    if (pattern1.test(inputChar) && (event.keyCode != 8)){
      inputString = event.target.value + inputChar
    } else if (event.keyCode == 8){
      inputString = inputString.slice(inputString.length-1, inputString.length -1);
    } else{
      event.preventDefault();
    }

    if (!pattern2.test(inputString) && (event.keyCode != 8 || event.keyCode != 46)) {
      event.preventDefault();
    }
  }

  _keyPressAh(event: any) {
    const pattern1 = /[0-9\+\-\.\ ]/;
    const pattern2 = /^\d{1,7}?(\.\d{1,2})?$|(^\d+(\.)$)/;
    let inputChar = String.fromCharCode(event.charCode);
    let inputString = '';
    if (pattern1.test(inputChar) && (event.keyCode != 8)) {
      inputString = event.target.value + inputChar
    } else if (event.keyCode == 8) {
      inputString = inputString.slice(inputString.length - 1, inputString.length - 1);
    } else {
      event.preventDefault();
    }

    if (!pattern2.test(inputString) && (event.keyCode != 8 || event.keyCode != 46)) {
      event.preventDefault();
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

  ShowPincodeMasterListing(page?:number) {
    if (page) {
      this.pages = page;
    }
    this.sharedServices.searchForm.next('LocalityMasterListing');
    this.districtsListing();
    this.mainDiv = 'Level4';
    this.Level4Option = 'pincodeListing';
    this.Service.getPincodeListing(this.pages, this.itemPerPage).subscribe(data => {
      if (data.status == 1) {
        this.localityList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.createPaginationSubmitForm();
      }else {
        this.popupMessageService.showError(data.error_message, "Error!");
       }
    }, (error) => {
      this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
    });
  }

  removeLocality() {
    this.Service.removeLocality(this.locality_id).subscribe(data => {
      if (data.status ==1) {
        this.openDeleteConfirmation=false;
        this.popupMessageService.showSuccess('Locality has been deleted successfully!!', 'success')
        this.ShowPincodeMasterListing(this.pages);
      } else {
        this.popupMessageService.showError(data.error_message, 'error');
    }
    })
  }

  addNewPincodeSource() {
    this.districtsListing();
    this.mainDiv = 'Level4';
    this.Level4Option = 'addnewPincode';
    this.createLocalityForm();
    this.editFlag = false;
  }

  ShowLocalityMasterOptions() {
    this.pages = 1;
    this.sharedServices.formDataSmartSearch.next('');
    this.isSubmittedLocality = false;
    this.ShowSidebarTab = 'LocalityMasterSidebar';
    this.mainDiv = 'Level2';
    this.MainDashboardOptions = 'showLocalityManagement';
  }

  editLead(lead) {
    this.Level4Option = 'AddLeadSourceForm';
    this.editFlag = true;
    this.createLeadForm();
    this.LeadForm.patchValue({
      irdi: lead.irdi,
      source_master_id: lead.source_master_id,
      source_master_name: lead.source_master_name,
      source_master_createdby: lead.source_master_createdby,
      source_master_lastmodifiedby: lead.source_master_lastmodifiedby
    });
  }

  editProduct(product) {
    this.ShowSidebarTab = 'addNewProduct'
    this.Level4Option = 'addNewProduct';
    this.editFlag = true;
    this.createProductForm();
    this.ProductForm.patchValue({
      label : product.product_label,
      value : product.product_value,
      type : product.product_type,
    });
    this.productId = product.product_id;
  }

  editLocality(locality) {
    this.Level4Option = 'addnewPincode';
    this.editFlag = true;
    this.createLocalityForm();
    this.LocalityForm.patchValue({
      irdi: locality.irdi,
      locality_name: locality.locality_name,
      locality_id: locality.locality_id,
      locality_pincode: locality.locality_pincode,
      locality_district: locality.locality_district,
      created_by: locality.created_by,
      modified_by: locality.modified_by
    })
  }

  createLeadForm() {
    this.LeadForm = this.formBuilder.group({
      irdi: [''],
      source_master_id: [''],
      source_master_name: [''],
      source_master_createdby: [''],
      source_master_lastmodifiedby: ['']
    })
  }

  createProductForm() {
    this.ProductForm = this.formBuilder.group({
      irdi: [''],
      label: ['', Validators.required],
      value: ['', Validators.required],
      type: ['', Validators.required]
    })
  }

  createLocalityForm() {
    this.LocalityForm = this.formBuilder.group({
      irdi: [''],
      locality_name: ['', Validators.compose([Validators.required])],
      locality_pincode: ['', Validators.compose([Validators.required, Validators.pattern(/^\(??([0-9]{6})$/)])],
      locality_district: ['', Validators.compose([Validators.required])],
      locality_id:[''],
      created_by: [''],
      modified_by: ['']
    })
  }

  createAnnouncementForm() {
    this.AnnouncementForm = this.formBuilder.group({
      irdi: [''],
      announcement: ['', Validators.required],
      created_by: [''],
      emp_roleid: [''],
      isAnnouncementEnabled: ['0']
    });
  }

  dutyTaxDeleteId:number;
  fixedLookupDeleteId:number;
  gbiLookupDeleteId:number;
  ahDeleteId:number;
  followUpSmsEmailDeleteId:number;
  employeeDeleteId:number;
  openDeleteConfirmationPopup(data, string) {
    this.deleteRecordFrom = string;
    if (string === 'LEADS') {
      this.lead_source_id = data;
    } else if(string === 'LOCALITY') {
      this.locality_id = data;
    } else if (string === 'OFF_PANEL' || string === 'ON_PANEL' || string === 'OFF_INV' || string === 'ON_INV') {
      this.invPanelDeleteId = data;
    } else if (string === 'DUTY_TAX') {
      this.dutyTaxDeleteId = data;
    } else if (string === 'FIXED_LOOKUP') {
      this.fixedLookupDeleteId = data;
    } else if (string === 'GBI_LOOKUP') {
      this.gbiLookupDeleteId = data;
    } else if (string === 'AH') {
      this.ahDeleteId = data;
    }else if (string === 'FOLLOW_UP_SMS_EMAIL') {
      this.followUpSmsEmailDeleteId = data;
    }else if (string === 'EMPLOYEE_MASTER') {
      this.employeeDeleteId = data;
    }
    else if(string =="FUNNEL_MANAGMENT"){
      this.employeeDeleteId=data;
    }
    else if(string =="PRODUCT"){
      this.productId=data;
    }

    if(!this.openDeleteConfirmation) {
         this.openDeleteConfirmation = true;
    } else {
         this.openDeleteConfirmation = false;
    }
  }

  cancelDelete(){
    this.openDeleteConfirmation=false;
  }

  confirmDelete() {
    if (this.deleteRecordFrom === 'LEADS') {
      this.deleteLead();
    } else if(this.deleteRecordFrom === 'LOCALITY') {
      this.removeLocality();
    } else if (this.deleteRecordFrom === 'OFF_PANEL') {
      this.deletePanelOrInverter('off', 'panel');
    } else if (this.deleteRecordFrom === 'ON_PANEL') {
      this.deletePanelOrInverter('on', 'panel');
    } else if (this.deleteRecordFrom === 'OFF_INV') {
      this.deletePanelOrInverter('off', 'inv');
    } else if (this.deleteRecordFrom === 'ON_INV') {
      this.deletePanelOrInverter('on', 'inv');
    } else if(this.deleteRecordFrom === 'DUTY_TAX') {
      this.deleteDutyTax();
    } else if (this.deleteRecordFrom === 'FIXED_LOOKUP') {
      this.deleteFixedLookup();
    } else if (this.deleteRecordFrom === 'GBI_LOOKUP') {
      this.deleteGbiLookup();
    } else if (this.deleteRecordFrom === 'AH') {
      this.deleteAh();
    }else if (this.deleteRecordFrom === 'FOLLOW_UP_SMS_EMAIL') {
      this.deleteFollowUpSmsEmail();
    }else if (this.deleteRecordFrom === 'EMPLOYEE_MASTER') {
      this.deleteEmployee();
    }else if(this.deleteRecordFrom === 'LeadRefrenceData') {
      this.deleteLeadRefrence();
    } else if(this.deleteRecordFrom === 'InsolationData'){
      this.deleteInsolation();
    }
    else if(this.deleteRecordFrom =="FUNNEL_MANAGMENT"){
      this.deleteFunnelManagement();
    }
    else if(this.deleteRecordFrom =="PRODUCT"){
      this.deleteProduct();
    }
  }
  deleteLead() {
    let deletionID =  this.lead_source_id;
    this.Service.DeleteLead(deletionID).subscribe(data => {
      if(data.status == 1) {
        this.openDeleteConfirmation=false;
        this.popupMessageService.showSuccess('Lead Source has been deleted successfully!!', 'success')
        this.ShowLeadMasterListing();
      } else {
        this.popupMessageService.showError(data.error_message, 'error');
    }
    });

  }

  submitLocalityForm() {
    this.isSubmittedLocality = true;
    let currentEmpRoleId = localStorage.getItem('role_id');
    let currentEmpId = JSON.parse(localStorage.getItem('userData'));
    this.LocalityForm.controls.irdi.setValue(currentEmpRoleId);
    if(this.LocalityForm.valid) {
      if(this.editFlag) {
        this.LocalityForm.controls.modified_by.setValue(currentEmpId.emp_id);
        this.Service.updateLocality(this.LocalityForm.value).subscribe(response => {
          if(response.status == 1) {
            this.popupMessageService.showSuccess('Locality has been updated successfully!!', 'success')
            this.ShowPincodeMasterListing(this.pages);
          } else {
            this.popupMessageService.showError(response.error_message, 'error');
        }
        });
      } else {
        this.LocalityForm.controls.created_by.setValue(currentEmpId.emp_id);
        this.Service.addLocality(this.LocalityForm.value).subscribe(response => {
          if(response.status == 1) {
            this.popupMessageService.showSuccess('Locality has been added successfully!!', 'success')
            this.ShowPincodeMasterListing(this.pages);
          } else {
            this.popupMessageService.showError(response.error_message, 'error');
        }
        });
      }
    } else {
      this.popupMessageService.showError('Please fill all fields', 'error');
    }
  }

  submitAnnouncementForm() {
    this.isSubmittedLocality = true;
    let currentEmpRoleId = localStorage.getItem('role_id');
    let currentEmpId = JSON.parse(localStorage.getItem('userData'));
    this.AnnouncementForm.controls.irdi.setValue(currentEmpRoleId);
    this.AnnouncementForm.controls.created_by.setValue(currentEmpId.emp_id);
    if(this.AnnouncementForm.valid) {
      this.Service.addAnnouncement(this.AnnouncementForm.value, currentEmpRoleId).subscribe(res => {
        this.popupMessageService.showSuccess('Announcement added successfully', 'success');
      });
    } else {
      this.popupMessageService.showError('Please fill all fields', 'error');
    }
  }

  submitLeadSourceForm() {
    let currentEmpRoleId = localStorage.getItem('role_id');
    let currentEmpId = JSON.parse(localStorage.getItem('userData'));
    this.LeadForm.controls.irdi.setValue(currentEmpRoleId);
    if(this.editFlag) {
      this.LeadForm.controls.source_master_lastmodifiedby.setValue(currentEmpId.emp_id);
      this.Service.UpdateSource(this.LeadForm.value).subscribe(response => {
        if(response.status == 1) {
          this.popupMessageService.showSuccess('Lead Source has been updated successfully!!', 'success')
          this.ShowLeadMasterListing();
        } else {
          this.popupMessageService.showError(response.error_message, 'error');
      }
      });
    } else {
      this.LeadForm.controls.source_master_createdby.setValue(currentEmpId.emp_id);
      this.LeadForm.controls.source_master_lastmodifiedby.setValue(currentEmpId.emp_id);
      this.Service.AddLeadSource(this.LeadForm.value).subscribe(response => {
        if(response.status == 1) {
          this.popupMessageService.showSuccess('Lead Source has been added successfully!!', 'success')
          this.ShowLeadMasterListing();
        } else {
          this.popupMessageService.showError(response.error_message, 'error');
      }
      });
    }
  }
  addNewLeadSource() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'AddLeadSourceForm';
    this.createLeadForm();
    this.editFlag = false;
  }

  productId: any;
  submitAddProductForm() {
    console.log(this.ProductForm);

    this.submit = true;
    if(this.ProductForm.valid) {
      let data: {} = {
        product_label: this.ProductForm.controls.label.value,
        product_value: this.ProductForm.controls.value.value,
        product_type: this.ProductForm.controls.type.value,
      }
      if(this.editFlag) {
        data = {...data, p_id: this.productId}
        this.LeadPanelService.updateInverterProducts(data).subscribe(
          res => {
            if(res.status) {
              this.submit = false;
              if(this.ProductForm.controls.type.value == 1) {
                this.Level4Option = 'productListingOnGird';
                this.ShowSidebarTab = 'productListingOnGird';
              } else if(this.ProductForm.controls.type.value == 2) {
                this.Level4Option = 'productListingOffGird';
                this.ShowSidebarTab = 'productListingOffGird';
              } else if(this.ProductForm.controls.type.value == 3) {
                this.Level4Option = 'productListingHybrid';
                this.ShowSidebarTab = 'productListingHybrid';
              } else if(this.ProductForm.controls.type.value == 4) {
                this.Level4Option = 'productListingBattery';
                this.ShowSidebarTab = 'productListingBattery';
              } else {
                this.Level4Option = 'productListingPanel';
                this.ShowSidebarTab = 'productListingPanel';
              }
              this.popupMessageService.showSuccess("Product updated successfully", "Success");
              this.setinvertOptions();
            } else {
              this.popupMessageService.showError(res.error_message, "Error");
            }
          },
          err => {
            this.submit = false;
            this.popupMessageService.showError("Something went wrong", "Error");
          }
        );
      } else {
        this.LeadPanelService.addInverterProducts(data).subscribe(
          res => {
            if(res.status) {
              if(this.ProductForm.controls.type.value == 1) {
                this.Level4Option = 'productListingOnGird';
                this.ShowSidebarTab = 'productListingOnGird';
              } else if(this.ProductForm.controls.type.value == 2) {
                this.Level4Option = 'productListingOffGird';
                this.ShowSidebarTab = 'productListingOffGird';
              } else if(this.ProductForm.controls.type.value == 3) {
                this.Level4Option = 'productListingHybrid';
                this.ShowSidebarTab = 'productListingHybrid';
              } else if(this.ProductForm.controls.type.value == 4) {
                this.Level4Option = 'productListingBattery';
                this.ShowSidebarTab = 'productListingBattery';
              } else {
                this.Level4Option = 'productListingPanel';
                this.ShowSidebarTab = 'productListingPanel';
              }
              this.popupMessageService.showSuccess("Product added successfully", "Success");
              this.setinvertOptions();
            } else {
              this.popupMessageService.showError(res.error_message, "Error");
            }
          },
          err => {
            this.popupMessageService.showError("Something went wrong", "Error");
          }
        );
      }
    }

  }

  deleteProduct() {
    let deletionID =  this.productId;
    this.LeadPanelService.deleteInverterProducts(deletionID).subscribe(data => {
      if(data.status == 1) {
        this.openDeleteConfirmation=false;
        this.popupMessageService.showSuccess('Product has been deleted successfully!!', 'success')
        this.setinvertOptions();
      } else {
        this.popupMessageService.showError(data.error_message, 'error');
    }
    });

  }

  addNewProduct() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addNewProduct';
    this.createProductForm();
    this.editFlag = false;
  }

  Dashboard() {
    this.mainDiv = 'showDashboard';
    this.ShowSidebarTab = '';
    this.Level4Option = '';
  }
  createPaginationSubmitForm() {
    this.paginationSubmitForm = this.formBuilder.group({
        page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
    });
  }
  pageSubmit(type:string) {
    if (this.paginationSubmitForm.valid) {
      let page = this.paginationSubmitForm.controls.page_number.value;
      if(type == 'locality'){
        if(this.smartSearchFormData) {
          this.Service.getPincodeListing(page,this.itemPerPage, this.smartSearchFormData).subscribe((data) => {
            this.pages = page;
            this.localityList = data.data.data;
            this.totalItem = data.data._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
          })
          return;
        }
        if (this.localityList) {
            this.ShowPincodeMasterListing(page);
        }
      }else if(type == 'offPanel'){
        this.ShowOffGridPanelListing(page);
      } else if (type == 'onPanel') {
        this.ShowOnGridPanelListing(page);
      } else if (type == 'offInv') {
        this.ShowOffGridInverterListing(page);
      } else if (type == 'onInv') {
        this.ShowOnGridInverterListing(page);
      } else if (type == 'dutyTaxes') {
        this.ShowDutyTaxesListing(page);
      } else if (type == 'fixedLookup') {
        this.ShowFixedLookupListing(page);
      } else if (type == 'gbiLookup') {
        this.ShowGbiLookupListing(page);
      } else if (type == 'ah') {
        this.ShowAhListing(page);
      }else if (type == 'followUp') {
        this.ShowFollowUpSmsEmailListing(page);
      }else if (type == 'employee') {
        this.ShowEmployeeListing(page,true);
      }
      else if (type == 'surveyor') {
        this.addSurveyor(page,true);
      }
      else if(type =='funnelManagement'){
        this.showFunnelManagenmentListing(page);
      }

    }
  }

  submitSmartSearch(event) {
    this.pages = 1;
    this.sharedServices.formDataSmartSearch.subscribe((data) => {
      this.smartSearchFormData = data;
    })
    if(this.Level4Option === 'ShowEmployeeListing' || this.Level4Option === 'addSurveyor'){
          this.employeeList = [];
          this.totalItem = 0;
          this.pageCount = 1;
      if(event.data){
        this.employeeList = event.data.data;
        this.totalItem = event.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
      } else {
        this.popupMessageService.showInfo('No Data Found','!Info');
      }
    } else {
      this.localityList = event.data;
      this.totalItem = event._meta.total_records;
      this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
      this.createPaginationSubmitForm();
    }
  }

  onChangeSurveyor(event, empId) {
    let currentEmpRoleId = localStorage.getItem('role_id');
    let data;
    if(event.target.checked) {
      data = {
        emp_id: empId,
        state: 1
      }
    } else {
      data = {
        emp_id: empId,
        state: 0
      }
    }
    this.LeadPanelService.changeSurveyor(data).subscribe(
      res => {
        if(res.status) {
          this.popupMessageService.showSuccess("Surveyor updated successfuly", 'Success');
        } else {
          this.popupMessageService.showError("Failed to update surveyor", "Error");
        }
      }
    )
  }


  //Off Grid

  ShowOffGridOptions() {
    this.ShowSidebarTab = 'ShowOffGridOptions'
    this.mainDiv = 'Level2';
    this.MainDashboardOptions = 'ShowOffGridOptions'
    this.Level4Option = '';
  }

  ShowOffGridPanelOptions() {
    this.ShowSidebarTab = 'ShowOffGridPanelOptions'
    this.mainDiv = 'Level3';
    this.MainDashboardOptions = 'ShowOffGridPanelOptions'
    this.Level4Option = '';
  }

  ShowOffGridInverterOptions() {
    this.ShowSidebarTab = 'ShowOffGridInverterOptions'
    this.mainDiv = 'Level3';
    this.MainDashboardOptions = 'ShowOffGridInverterOptions'
    this.Level4Option = '';
  }

  ShowOffGridPanelListing(page){
    this.mainDiv = 'Level4';
    this.Level4Option ='offPanelListing';
    this.Service.panelsAndInvGetRequest('off', 'panel', 'list', null, page, this.itemPerPage).subscribe(data=>{
      if(data.status){
        this.offGridPanelList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }


  addOffGridPanel() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOffPanelForm';
    this.createPanelForm();
    this.editFlag = false;
  }
  editOffGridPanel(data){
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOffPanelForm';
    this.editFlag = true;
    this.createPanelForm();
    this.gridPanelForm.patchValue(data);
  }

  ShowOffGridInverterListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'offInverterListing';
    this.Service.panelsAndInvGetRequest('off', 'inv', 'list', null, page, this.itemPerPage).subscribe(data => {
      if (data.status) {
        this.offGridInverterList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }

  addOffGridInverter() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOffInverterForm';
    this.createInverterForm();
    this.gridInverterForm.get('phase').clearValidators();
    this.gridInverterForm.get('phase').updateValueAndValidity();
    this.editFlag = false;
  }
  editOffGridInverter(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOffInverterForm';
    this.editFlag = true;
    this.createInverterForm();
    this.gridInverterForm.get('phase').clearValidators();
    this.gridInverterForm.get('phase').updateValueAndValidity();
    this.gridInverterForm.patchValue(data);
  }


  // On Grid

  ShowOnGridOptions() {
    this.ShowSidebarTab = 'ShowOnGridOptions'
    this.mainDiv = 'Level2';
    this.MainDashboardOptions = 'ShowOnGridOptions'
    this.Level4Option = '';
  }

  ShowOnGridPanelOptions() {
    this.ShowSidebarTab = 'ShowOnGridPanelOptions'
    this.mainDiv = 'Level3';
    this.MainDashboardOptions = 'ShowOnGridPanelOptions'
    this.Level4Option = '';
  }

  ShowOnGridInverterOptions() {
    this.ShowSidebarTab = 'ShowOnGridInverterOptions'
    this.mainDiv = 'Level3';
    this.MainDashboardOptions = 'ShowOnGridInverterOptions'
    this.Level4Option = '';
  }

  ShowOnGridPanelListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'onPanelListing';
    this.Service.panelsAndInvGetRequest('on', 'panel', 'list', null, page, this.itemPerPage).subscribe(data => {
      if (data.status) {
        this.onGridPanelList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }

  addOnGridPanel() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOnPanelForm';
    this.createPanelForm();
    this.editFlag = false;
  }
  editOnGridPanel(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOnPanelForm';
    this.editFlag = true;
    this.createPanelForm();
    this.gridPanelForm.patchValue(data);
  }

  ShowOnGridInverterListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'onInverterListing';
    this.Service.panelsAndInvGetRequest('on', 'inv', 'list', null, page, this.itemPerPage).subscribe(data => {
      if (data.status) {
        this.onGridInverterList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }

  addOnGridInverter() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOnInverterForm';
    this.createInverterForm();
    this.gridInverterForm.get('voltage').clearValidators();
    this.gridInverterForm.get('voltage').updateValueAndValidity();
    this.gridInverterForm.get('no_of_batteries').clearValidators();
    this.gridInverterForm.get('no_of_batteries').updateValueAndValidity();
    this.editFlag = false;
  }
  editOnGridInverter(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addOnInverterForm';
    this.editFlag = true;
    this.createInverterForm();
    this.gridInverterForm.get('voltage').clearValidators();
    this.gridInverterForm.get('voltage').updateValueAndValidity();
    this.gridInverterForm.get('no_of_batteries').clearValidators();
    this.gridInverterForm.get('no_of_batteries').updateValueAndValidity();
    this.gridInverterForm.patchValue(data);
  }

/*-------------------------------------------*/

  createPanelForm() {
    this.gridPanelForm = this.formBuilder.group({
      id: [''],
      panel_size: ['', Validators.compose([Validators.required])],
      panel_price: ['', Validators.compose([Validators.required])]
    });
  }
  submitPanelForm(grid: string) {
    if (this.gridPanelForm.valid) {
      if (!this.editFlag) {
        this.Service.panelsAndInvPostRequest(grid, 'panel', 'add', this.gridPanelForm.value).subscribe(data => {
          if (data.status) {
            this.popupMessageService.showSuccess('Panel has been added successfully!!', 'Success!');
            (grid == 'off')?this.ShowOffGridPanelListing(1):this.ShowOnGridPanelListing(1);
          } else {
            this.popupMessageService.showError(data.error_message, 'error');
          }
        })
      } else if (this.editFlag) {
        this.Service.panelsAndInvPostRequest(grid, 'panel', 'update', this.gridPanelForm.value).subscribe(data => {
          if (data.status) {
            this.popupMessageService.showSuccess('Panel has been updated successfully!!', 'Success!');
            (grid == 'off') ? this.ShowOffGridPanelListing(this.pages) : this.ShowOnGridPanelListing(this.pages);
          } else {
            this.popupMessageService.showError(data.error_message, 'error!');
          }
        })
      }
    } else {
      this.popupMessageService.showError('Invalid Form Data!', 'error!');
    }
  }

  createInverterForm() {
    this.gridInverterForm = this.formBuilder.group({
      id: [''],
      inverters: ['', Validators.compose([Validators.required])],
      voltage: ['', Validators.compose([Validators.required])],
      phase: ['', Validators.compose([Validators.required])],
      max_panel: ['', Validators.compose([Validators.required])],
      watt: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      rs_per_watt: ['', Validators.compose([Validators.required])],
      billing: ['', Validators.compose([Validators.required])],
      actual_ratio: ['', Validators.compose([Validators.required])],
      no_of_batteries: ['', Validators.compose([Validators.required])],
    });
  }
  submitInverterForm(grid: string) {
    if (this.gridInverterForm.valid) {
      if (!this.editFlag) {
        this.Service.panelsAndInvPostRequest(grid, 'inv', 'add', this.gridInverterForm.value).subscribe(data => {
          if (data.status) {
            this.popupMessageService.showSuccess('Inverter has been added successfully!!', 'Success!');
            (grid == 'off') ? this.ShowOffGridInverterListing(1): this.ShowOnGridInverterListing(1);
          } else {
            this.popupMessageService.showError(data.error_message, 'error');
          }
        })
      } else if (this.editFlag) {
        this.Service.panelsAndInvPostRequest(grid, 'inv', 'update', this.gridInverterForm.value).subscribe(data => {
          if (data.status) {
            this.popupMessageService.showSuccess('Inverter has been updated successfully!!', 'Success!');
            (grid == 'off') ? this.ShowOffGridInverterListing(this.pages) : this.ShowOnGridInverterListing(this.pages);
          } else {
            this.popupMessageService.showError(data.error_message, 'error!');
          }
        })
      }
    } else {
      this.popupMessageService.showError('Invalid Form Data!', 'error!');
    }
  }

  deletePanelOrInverter(grid:string, mode:string){
    this.Service.panelsAndInvGetRequest(grid, mode, 'delete', this.invPanelDeleteId).subscribe(data=>{
      if (data.status) {
        this.openDeleteConfirmation = false;
        this.popupMessageService.showSuccess('Deleted successfully!!', 'Success!');
        (grid == 'off') ? ((mode == 'panel') ? this.ShowOffGridPanelListing(this.pages) : this.ShowOffGridInverterListing(this.pages)) : ((mode == 'panel') ? this.ShowOnGridPanelListing(this.pages) : this.ShowOnGridInverterListing(this.pages)) ;
      } else {
        this.popupMessageService.showError(data.error_message, 'error!');
      }
    });
  }


  // Calculator Options

  changeCalculatorOptions(level:string, optionText:string) {

    // changeCalculatorOptions('Level3','ShowFixedLookupOptions')
    this.ShowSidebarTab = optionText;
    this.mainDiv = level;
    this.MainDashboardOptions = optionText;
    this.Level4Option = '';
  }


  //Duty Taxes
  dutyTaxesList: any;
  dutyTaxesForm:FormGroup;

  createDutyTaxesForm() {
    this.dutyTaxesForm = this.formBuilder.group({
      id: [''],
      state_id: ['', Validators.compose([Validators.required])],
      duty_per_unit: ['', Validators.compose([Validators.required])],
      duty_on_fixed: ['', Validators.compose([Validators.required])],
      duty_on_variable: ['', Validators.compose([Validators.required])],
      tax_per_unit: ['', Validators.compose([Validators.required])],
      tax_on_fixed: ['', Validators.compose([Validators.required])],
      tax_on_variable: ['', Validators.compose([Validators.required])],
      tax_per_unit_duty: ['', Validators.compose([Validators.required])],
      tax_fix_duty: ['', Validators.compose([Validators.required])],
      tax_var_duty: ['', Validators.compose([Validators.required])],
    });
  }

  addDutyTax() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addDutyTax';
    this.createDutyTaxesForm();
    this.editFlag = false;
  }
  editDutyTax(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addDutyTax';
    this.editFlag = true;
    this.createDutyTaxesForm();
    this.dutyTaxesForm.patchValue(data);
  }

  ShowDutyTaxesListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'ShowDutyTaxesListing';
    this.Service.dutyTaxesGet('list', null, page, this.itemPerPage).subscribe(data => {
      if (data.status) {
        this.dutyTaxesList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }

  submitDutyTaxesForm() {
    if (this.dutyTaxesForm.valid) {
      let type = (!this.editFlag) ?'add':'update';
        this.Service.dutyTaxesPost(type, this.dutyTaxesForm.value).subscribe(data => {
          if (data.status) {
            this.popupMessageService.showSuccess('Duty tax has been saved successfully!!', 'Success!');
            (!this.editFlag) ? this.ShowDutyTaxesListing(1) : this.ShowDutyTaxesListing(this.pages);
          } else {
            this.popupMessageService.showError(data.error_message, 'error');
          }
        })
    } else {
      this.popupMessageService.showError('Invalid Form Data!', 'error!');
    }
  }

  deleteDutyTax(){
    this.Service.dutyTaxesGet('delete', this.dutyTaxDeleteId).subscribe(data => {
      if (data.status) {
        this.openDeleteConfirmation = false;
        this.popupMessageService.showSuccess('Deleted successfully!!', 'Success!');
        this.ShowDutyTaxesListing(this.pages);
      } else {
        this.popupMessageService.showError(data.error_message, 'error!');
      }
    });
  }

  //Fixed Lookup
  fixedLookupList: any;
  fixedLookupForm: FormGroup;

  createFixedLookupForm() {
    this.fixedLookupForm = this.formBuilder.group({
      id: [''],
      state_id: ['', Validators.compose([Validators.required])],
      category_id: ['', Validators.compose([Validators.required])],
      kw_l: ['', Validators.compose([Validators.required])],
      kw_h: ['', Validators.compose([Validators.required])],
      fixed: ['', Validators.compose([Validators.required])],
      per_kw_fc: ['', Validators.compose([Validators.required])],
    });
  }

  addFixedLookup() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addFixedLookup';
    this.createFixedLookupForm();
    this.editFlag = false;
  }
  editFixedLookup(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addFixedLookup';
    this.editFlag = true;
    this.createFixedLookupForm();
    this.fixedLookupForm.patchValue(data);
    this.fixedLookupForm.controls.category_id.setValue(data.category_id);
  }

  ShowFixedLookupListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'ShowFixedLookupListing';
    this.Service.fixedLookupGet('list', null, page, this.itemPerPage).subscribe(data => {
      if (data.status) {
        this.fixedLookupList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }

  submitFixedLookupForm() {
    if (this.fixedLookupForm.valid) {
      let type = (!this.editFlag) ? 'add' : 'update';
      this.Service.fixedLookupPost(type, this.fixedLookupForm.value).subscribe(data => {
        if (data.status) {
          this.popupMessageService.showSuccess('Fixed Lookup record has been saved successfully!!', 'Success!');
          (!this.editFlag) ? this.ShowFixedLookupListing(1) : this.ShowFixedLookupListing(this.pages);
        } else {
          this.popupMessageService.showError(data.error_message, 'error');
        }
      })
    } else {
      this.popupMessageService.showError('Invalid Form Data!', 'error!');
    }
  }

  deleteFixedLookup() {
    this.Service.fixedLookupGet('delete', this.fixedLookupDeleteId).subscribe(data => {
      if (data.status) {
        this.openDeleteConfirmation = false;
        this.popupMessageService.showSuccess('Deleted successfully!!', 'Success!');
        this.ShowFixedLookupListing(this.pages);
      } else {
        this.popupMessageService.showError(data.error_message, 'error!');
      }
    });
  }



  //GBI Lookup
  gbiLookupList: any;
  gbiLookupForm: FormGroup;

  createGbiLookupForm() {
    this.gbiLookupForm = this.formBuilder.group({
      id: [''],
      state_id: ['', Validators.compose([Validators.required])],
      gbi: ['', Validators.compose([Validators.required])],
    });
  }

  addGbiLookup() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addGbiLookup';
    this.createGbiLookupForm();
    this.editFlag = false;
  }
  editGbiLookup(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addGbiLookup';
    this.editFlag = true;
    this.createGbiLookupForm();
    this.gbiLookupForm.patchValue(data);
  }

  ShowGbiLookupListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'ShowGbiLookupListing';
    this.Service.gbiLookupGet('list', null, page, this.itemPerPage).subscribe(data => {
      if (data.status) {
        this.gbiLookupList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }

  submitGbiLookupForm() {
    if (this.gbiLookupForm.valid) {
      let type = (!this.editFlag) ? 'add' : 'update';
      this.Service.gbiLookupPost(type, this.gbiLookupForm.value).subscribe(data => {
        if (data.status) {
          this.popupMessageService.showSuccess('Gbi Lookup record has been saved successfully!!', 'Success!');
          (!this.editFlag) ? this.ShowGbiLookupListing(1) : this.ShowGbiLookupListing(this.pages);
        } else {
          this.popupMessageService.showError(data.error_message, 'error');
        }
      })
    } else {
      this.popupMessageService.showError('Invalid Form Data!', 'error!');
    }
  }

  deleteGbiLookup() {
    this.Service.gbiLookupGet('delete', this.gbiLookupDeleteId).subscribe(data => {
      if (data.status) {
        this.openDeleteConfirmation = false;
        this.popupMessageService.showSuccess('Deleted successfully!!', 'Success!');
        this.ShowGbiLookupListing(this.pages);
      } else {
        this.popupMessageService.showError(data.error_message, 'error!');
      }
    });
  }

  //Var Lookup
  varLookupList: any;

  varListingForm:FormGroup;

  createVarListingForm(){
    this.varListingForm = this.formBuilder.group({
      state_id:['1'],
      category_id:['1']
    })
  }

  varLookupForm:FormGroup;
  createVarLookupForm() {
    this.varLookupForm = this.formBuilder.group({
      fsa: [0, Validators.compose([Validators.required, Validators.pattern(/^\d+\.\d\d$/)])],
      state_id: [''],
      category_id: [''],
      vars: this.formBuilder.array([])
    });
  }

  createVarItem(): FormGroup {
    return this.formBuilder.group({
      id:[''],
      slab_low: [0],
      slab_high: [0],
      kw_low: [0],
      kw_high: [0],
      rs_per_kwh: [0],
      rs_per_kwh_inc_fsa: [0],
      prev_bill_sum_high: [0],
      bill_sum_low: [0],
      bill_sum_high: [0],
    });
  }

  createOldVarItem(vdata): FormGroup {
    return this.formBuilder.group({
      id: [vdata.id],
      slab_low: [vdata.slab_low],
      slab_high: [vdata.slab_high],
      kw_low: [vdata.kw_low],
      kw_high: [vdata.kw_high],
      rs_per_kwh: [vdata.rs_per_kwh],
      rs_per_kwh_inc_fsa: [vdata.rs_per_kwh_inc_fsa],
      prev_bill_sum_high: [vdata.prev_bill_sum_high],
      bill_sum_low: [vdata.bill_sum_low],
      bill_sum_high: [vdata.bill_sum_high],
    });
  }

  isVarItems:boolean;

  addVarItem(flag?:boolean): void {
    this.clickedInput = true;
    let items = <FormArray>this.varLookupForm.get('vars');
    items.push(this.createVarItem());
    if(flag){
      this.validateVarLookupForm(true);
    }
    const varsArray = <FormArray>this.varLookupForm.get('vars');
    if (varsArray.length > 1) {
      this.isVarItems = true;
    }
  }

  addVarItemOld(ldata): void {
    let items = <FormArray>this.varLookupForm.get('vars');
    items.push(this.createOldVarItem(ldata));
  }

  selectedState:any;
  selectedCategory:any;
  addVarLookup(){
    this.selectedState = this.states.find(x => x.value == this.varListingForm.get('state_id').value).label;
    let selectedCategoryId = this.varListingForm.get('category_id').value;
    this.selectedCategory = this.cats[selectedCategoryId];

    this.createVarLookupForm();
    this.varLookupForm.controls.state_id.setValue(this.varListingForm.get('state_id').value);
    this.varLookupForm.controls.category_id.setValue(this.varListingForm.get('category_id').value);
    this.addVarItem();
    this.editFlag = false;
    this.Level4Option = 'editVarLookup';
    this.mainDiv = 'Level4';
  }

  editVarLookup(){
    this.createVarLookupForm();
    this.varLookupForm.controls.fsa.setValue(Math.round(this.varLookupList[0].fsa * 100)/100);
    this.varLookupForm.controls.state_id.setValue(this.varLookupList[0].state_id);
    this.varLookupForm.controls.category_id.setValue(this.varLookupList[0].category_id);
    this.mainDiv = 'Level4';
    this.editFlag = true;
    this.varLookupList.forEach( element=> {
      this.addVarItemOld(element);
    });
    this.Level4Option = 'editVarLookup';
    this.validateVarLookupForm(true);
  }

  clickedInput:any;
  clickInput(event?: any) {
    if(event){
      // event.target.value = 0;
    }
    this.clickedInput = true;
  }

  removeLastRow(){
    const varsArray = <FormArray>this.varLookupForm.get('vars');
    if (!varsArray.controls[varsArray.length - 1].get('id').value && varsArray.length > 1){
      varsArray.removeAt(varsArray.length - 1);
    }
    if (varsArray.length == 1 || varsArray.controls[varsArray.length - 1].get('id').value){
      this.isVarItems = false;
    }
  }
  validateVarLookupForm(isInternal?:boolean){
    let any_rs_per_kwh_empty:boolean;
    let any_slab_high_or_kw_high_empty:boolean;
    //console.log(this.varLookupForm);
    if (isNaN(parseFloat(this.varLookupForm.get('fsa').value))) {
      this.varLookupForm.get('fsa').setValue(0);
    }
    const varsArray = <FormArray>this.varLookupForm.get('vars');

    varsArray.controls.forEach((element, index) => {

      for (var ee in element['controls']){
        if (isNaN(parseFloat(element.get(ee).value))){
          element.get(ee).setValue(0);
        }
      }

      if (index > 0 && parseInt(varsArray.controls[0].get('slab_high').value) != 0){
        element.get('slab_low').setValue(parseInt(varsArray.controls[index-1].get('slab_high').value) + 1);
      }
      if (parseInt(element.get('slab_high').value) < parseInt(element.get('slab_low').value)) {
        element.get('slab_high').setValue(parseInt(element.get('slab_low').value)+1);
      }
      if (index > 0 && parseInt(varsArray.controls[0].get('kw_high').value) != 0) {
        element.get('kw_low').setValue(parseInt(varsArray.controls[index - 1].get('kw_high').value) + 1);
      }
      if (parseInt(element.get('kw_high').value) < parseInt(element.get('kw_low').value)) {
        element.get('kw_high').setValue(parseInt(element.get('kw_low').value) + 1);
      }

      // if (this.varLookupForm.controls.fsa.value > 0 && element.get('rs_per_kwh').value > 0){
      element.get('rs_per_kwh_inc_fsa').setValue(parseFloat(element.get('rs_per_kwh').value) + parseFloat(this.varLookupForm.controls.fsa.value));
      if (index > 0) {
        let slabDiff = parseInt(element.get('slab_high').value) - parseInt(element.get('slab_low').value) + 1;
        element.get('prev_bill_sum_high').setValue(varsArray.controls[index - 1].get('bill_sum_high').value);
        element.get('bill_sum_low').setValue(parseFloat(element.get('prev_bill_sum_high').value) + parseFloat(element.get('rs_per_kwh_inc_fsa').value));
        element.get('bill_sum_high').setValue(parseFloat(element.get('prev_bill_sum_high').value) + (slabDiff * parseFloat(element.get('rs_per_kwh_inc_fsa').value)));
      } else {
        if (parseInt(element.get('slab_low').value) == 0) {
          element.get('bill_sum_low').setValue(0);
          element.get('bill_sum_high').setValue(parseInt(element.get('slab_high').value) * parseFloat(element.get('rs_per_kwh_inc_fsa').value));
        }else{
          let slabDiff = parseInt(element.get('slab_high').value) - parseInt(element.get('slab_low').value) + 1;
          element.get('bill_sum_low').setValue(parseFloat(element.get('prev_bill_sum_high').value) + parseFloat(element.get('rs_per_kwh_inc_fsa').value));
          element.get('bill_sum_high').setValue(parseFloat(element.get('prev_bill_sum_high').value) + (slabDiff * parseFloat(element.get('rs_per_kwh_inc_fsa').value)));
        }
      }
      // }

      if (element.get('rs_per_kwh').value == 0 && !isInternal){
        any_rs_per_kwh_empty = true;
      }

      if (element.get('slab_high').value == 0 && element.get('kw_high').value == 0 && !isInternal){
        any_slab_high_or_kw_high_empty = true;
      }
      // this.clickedInput = false;
    });
    if(any_rs_per_kwh_empty){
      this.popupMessageService.showError('Any of Rs. Per kwh field should not be Zero!', 'Error!');
    }else if(any_slab_high_or_kw_high_empty){
      this.popupMessageService.showError('Any of Unit Or Kw slab should not be Zero!', 'Error!');
    }else{
      this.clickedInput = false;
    }
  }

  submitVarLookupForm(){
    this.Service.varLookupPost('add_update', this.varLookupForm.value).subscribe(data => {
      if (data.status) {
        this.popupMessageService.showSuccess('Operation successfull!!', 'Success!');
        this.ShowVarLookupListing();
      }
    });

  }


  ShowVarLookupListing(initiate?:boolean) {
    this.varLookupList = false;
    if(initiate){
      this.createVarListingForm();
    }
    this.mainDiv = 'Level4';
    this.Level4Option = 'ShowVarLookupListing';
    this.Service.varLookupPost('list', this.varListingForm.value).subscribe(data => {
      if (data.status) {
        this.varLookupList = data.data.data;
      }
    });
  }


  //Ah Reference
  ahList: any;
  ahForm: FormGroup;

  createAhForm() {
    this.ahForm = this.formBuilder.group({
      id: [''],
      ah: ['', Validators.compose([Validators.required,Validators.min(1)])],
      price_taken: ['', Validators.compose([Validators.required,Validators.min(1)])],
      battery_opt: ['', Validators.compose([Validators.required,Validators.min(1)])],
      no_of_batteries: ['', Validators.compose([Validators.required,Validators.min(1)])],
    });
  }

  addAh() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addAh';
    this.createAhForm();
    this.editFlag = false;
  }
  editAh(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addAh';
    this.editFlag = true;
    this.createAhForm();
    this.ahForm.patchValue(data);
  }

  ShowAhListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'ShowAhListing';
    this.Service.ahGet('list', null, page, this.itemPerPage).subscribe(data => {
      if (data.status) {
        this.ahList = data.data.data;
        this.totalItem = data.data._meta.total_records;
        this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
        this.pages = page;
        this.createPaginationSubmitForm();
      }
    });
  }

  submitAhForm() {
    if (this.ahForm.valid) {
      let type = (!this.editFlag) ? 'add' : 'update';
      this.Service.ahPost(type, this.ahForm.value).subscribe(data => {
        if (data.status) {
          this.popupMessageService.showSuccess('Record has been saved successfully!!', 'Success!');
          (!this.editFlag) ? this.ShowAhListing(1) : this.ShowAhListing(this.pages);
        } else {
          this.popupMessageService.showError(data.error_message, 'error');
        }
      })
    } else {
      this.popupMessageService.showError('Please enter valid values in all fields!', 'error!');
    }
  }

  deleteAh() {
    this.Service.ahGet('delete', this.ahDeleteId).subscribe(data => {
      if (data.status) {
        this.openDeleteConfirmation = false;
        this.popupMessageService.showSuccess('Deleted successfully!!', 'Success!');
        this.ShowAhListing(this.pages);
      } else {
        this.popupMessageService.showError(data.error_message, 'error!');
      }
    });
  }

  /** Change on 10-Jan-2019 */


  changeFollowUpOptions(level:string, optionText:string) {
    this.ShowSidebarTab = optionText;
    this.mainDiv = level;
    this.MainDashboardOptions = optionText;
    this.Level4Option = '';
  }

  followUpList: any;
  followUpForm:FormGroup;
  fues_id:number;
  createFollowUpSmsEmailForm() {
    this.followUpForm = this.formBuilder.group({
      fues_id: [''],
      fues_title: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      fues_email_content: ['', Validators.compose([ Validators.required])],
      fues_sms_content: ['', Validators.compose([ Validators.required, Validators.minLength(5)])],

    });
  }
  ShowFollowUpSmsEmailListing(page) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'ShowFollowUpSmsEmailListing';
    this.Service.followUpSmsEmailGet('list', null, page, this.itemPerPage)
      .subscribe(
        data => {
          if (data.status) {
            this.followUpList = data.data.data;
            this.totalItem = data.data._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
            this.pages = page;
            this.createPaginationSubmitForm();
          }
        }
      );
  }
  addFollowUpSmsEmail() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addFollowUpSmsEmail';
    this.createFollowUpSmsEmailForm();
    this.editFlag = false;
  }

  submitFollowUpSmsEmailForm(){
    if (this.followUpForm.valid) {
      let type = (!this.editFlag) ?'add':'update';
      let msg= (!this.editFlag) ? "Followup SMS/Email master has been added successfully!!" : "Followup SMS/Email master has been saved successfully!!"
      this.Service.followUpSmsEmailPost(type, this.followUpForm.value).subscribe(data => {
        if (data.status) {
          this.popupMessageService.showSuccess(msg, 'Success!');
            (!this.editFlag) ? this.ShowFollowUpSmsEmailListing(1) : this.ShowFollowUpSmsEmailListing(this.pages);
        }else {
          this.popupMessageService.showError(data.error_message, 'error');
        }
      });
    } else {
      Object.keys(this.followUpForm.controls).forEach(key => {

        const controlErrors: ValidationErrors = this.followUpForm.get(key).errors;
        if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
        }
    });
      this.popupMessageService.showError('Invalid Form Data!', 'error!');
    }
  }

  editFollowUpSmsEmail(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addFollowUpSmsEmail';
    this.editFlag = true;
    this.createFollowUpSmsEmailForm();
    this.followUpForm.patchValue(data);
  }
  deleteFollowUpSmsEmail(){
    this.Service.followUpSmsEmailGet('delete',this.followUpSmsEmailDeleteId).subscribe(data=>{
       if(data.status){
        this.openDeleteConfirmation = false;
        this.popupMessageService.showSuccess('Followup SMS/Email has been deleted successfully!!', 'Success!');
        this.ShowFollowUpSmsEmailListing(this.pages);
       }else {
        this.popupMessageService.showError(data.error_message, 'error!');
      }
    })
  }

  /**
   * Created on 20 feb
   * Dev: Rajendra Modi
   */
  changeEmployeeMasterOptions(level:string, optionText:string) {
    this.ShowSidebarTab = optionText;
    this.mainDiv = level;
    this.MainDashboardOptions = optionText;
    this.Level4Option = '';
  }

  // Change lead source
  changeLeadSourceOptions(level:string, optionText:string) {
    this.ShowSidebarTab = optionText;
    this.mainDiv = level;
    this.MainDashboardOptions = '';
    this.Level4Option = optionText;
  }


  onClickFunnelManagement(level:string,text:string){
    this.ShowSidebarTab=text;
    this.mainDiv=level;
    this.MainDashboardOptions=text;
  }

  onClickAddAnnouncement(level:string,text:string) {
    this.createAnnouncementForm();
    this.ShowSidebarTab=text;
    this.mainDiv = level;
    this.MainDashboardOptions=text;
    this.getLatestAnnouncement();
  }

  getLatestAnnouncement() {
    this.Service.getLatestAnnouncement().subscribe(res => {
      if(res.status && res.data) {
        this.AnnouncementForm.controls.announcement.patchValue(res.data.announcement);
        this.AnnouncementForm.controls.isAnnouncementEnabled.patchValue(res.data.status);
      }
    });
  }


  employeeList=[];
  ShowEmployeeListing(page,pagination:boolean=false) {
    this.itemPerPage=10;
    this.mainDiv = 'Level4';
    this.Level4Option = 'ShowEmployeeListing';
    if(!pagination){
      this.sharedServices.searchForm.next('employeeMaster');
    }
    this.Service.getEmployeeList('list', null, page, this.itemPerPage,this.smartSearchFormData)
      .subscribe(
        data => {
          //console.log(data);
          if (data.status) {
            this.employeeList = data.data.data;
            this.totalItem = data.data._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
            this.pages = page;
            this.createPaginationSubmitForm();
            this.noRecords=false;
          }else{
            this.noRecords=true;
          }
        }
      );
  }


  showAddEmployeeForm() {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addEmployee';
    this.editFlag = false;
    this.createEmployeeForm();
  }

  employeeForm:FormGroup;
  emp_id:number;
  createEmployeeForm() {
    this.employeeForm = this.formBuilder.group({
      emp_id: [''],
      emp_firstname: ['', Validators.compose([Validators.required])],
      emp_middlename: [''],
      emp_lastname: ['',Validators.compose([Validators.required])],
      emp_email:['',Validators.compose([Validators.required,Validators.email])],
      emp_mobileno:['',Validators.compose([Validators.required,Validators.pattern('[0-9]{10}')])],
      emp_address1:['',Validators.compose([Validators.required])],
      emp_address2:[''],
      emp_city:['',Validators.compose([Validators.required])],
      emp_state:['',Validators.compose([Validators.required])],
      emp_password:[''],
      erm_skill_id:['',Validators.compose([Validators.required])],
      erm_role_id:[''],
      emp_lead_priority:[null],
      emp_gst:['', Validators.compose([Validators.pattern('[a-zA-Z0-9-_]{15}')])],
      emp_code:[''],
      emp_pan:[''],
    });

    if(this.editFlag==false){
      this.employeeForm.get('emp_password').setValidators([Validators.required]);
    }
    this.employeeForm.get('emp_password').updateValueAndValidity();
    this.skillListGet(); //get all option of skill list
    this.roleListGet();
    this.validationforgst();
  }
  fnamelabel:String='First';
  lnamelabel:String='Last';
  validationforgst(){
  this.employeeForm.get('erm_skill_id').valueChanges.subscribe(val=>{
    if(val){
     // console.log(val);
      if(val == "53"){
        this.employeeForm.get('emp_gst').setValidators([Validators.required,Validators.compose([Validators.pattern('[a-zA-Z0-9-_]{15}')])]);
        this.employeeForm.get('emp_code').setValidators([Validators.required]);
        this.employeeForm.get('emp_pan').setValidators([Validators.required]);
        this.fnamelabel='Firm';
        this.lnamelabel='Contact Person';
       }else{
        this.employeeForm.get('emp_gst').clearValidators();
        this.employeeForm.get('emp_code').clearValidators();
        this.employeeForm.get('emp_pan').clearValidators();
        this.fnamelabel='First';
        this.lnamelabel='Last';
      }
      this.employeeForm.get('emp_gst').updateValueAndValidity();
      this.employeeForm.get('emp_code').updateValueAndValidity();
      this.employeeForm.get('emp_pan').updateValueAndValidity();
    }
  })
}
  submitEmpForm = false;
  submitEmployeeForm(){
    this.submitEmpForm = true;
    this.validationforgst();
    if (this.employeeForm.valid) {
      let type = (!this.editFlag) ? 'add':'update';
      let msg= (!this.editFlag) ? "Employee has been added successfully!!" : "Employee has been saved successfully!!"
      this.Service.employeeAdd(type, this.employeeForm.value).subscribe(data => {
        if (data.status) {
          this.popupMessageService.showSuccess(msg, 'Success!');
            (!this.editFlag) ? this.ShowEmployeeListing(1) : this.ShowEmployeeListing(this.pages);
        }else {
          this.popupMessageService.showError(data.error_message, 'error');
        }
      });
    } else {
      this.popupMessageService.showError('Invalid Form Data!', 'error!');
      this.getFormValidationErrors();
    }
  }


  editEmployee(data) {
    this.mainDiv = 'Level4';
    this.Level4Option = 'addEmployee';
    this.editFlag = true;
    this.createEmployeeForm();
    this.employeeForm.patchValue(data);
    //console.log(data);
    this.setState(data.emp_state);
  }


  deleteEmployee(){
    this.Service.getEmployeeList('delete',this.employeeDeleteId).subscribe(data=>{
       if(data.status){
        this.openDeleteConfirmation = false;
        this.popupMessageService.showSuccess('Employee has been deleted successfully!!', 'Success!');
        this.ShowEmployeeListing(this.pages);
       }else {
        this.popupMessageService.showError(data.error_message, 'error!');
      }
    })
  }



  setState(stateid?:number){
      stateid=(stateid) ? stateid: this.employeeForm.value.emp_state;
    if(stateid){
      this.districtsListing(stateid);
    }

  }


  role_id:any ;
  data_emp_id:any ;
  role_emp_data :any;
  getEmployeeRoleManageForm(data) {
    this.role_emp_data  = data;
    this.mainDiv = 'Level4';
    this.Level4Option = 'showEmployeeRoleManageForm';
    this.editFlag = false;
    this.roleListGet(); //getting all the role
    this.skillListGet(); //getting all the skills
    this.role_id=(data.erm_role_id); //set primary role as role id
    this.data_emp_id=(data.emp_id); //set primary role as role id
    this.createemployeeRoleManageForm();//create a role form after getting all the data
  }

  employeeRoleManageForm:FormGroup;
  createemployeeRoleManageForm() {
    this.employeeRoleManageForm = this.formBuilder.group({
      roles: this.formBuilder.array([]),
      erm_role_id: [this.role_id],
      emp_id: [this.data_emp_id]
    });

  }


  public columnRoleList = [];
  roleListGet(id?:number) {
    this.Service.getRoleList('list',id).subscribe(data => {
      this.roleList = data.data;
      let dist = [];
      for (let item of this.roleList) {
        dist.push({ value: String(item.role_id), label: String(item.role_name) });
        this.columnRoleList[item.role_id] = item.role_name;
      }
      this.roleList = dist;
    })
  }


  allSkills = [];
  skillListGet() {
    this.Service.getSkillList('list',this.role_id).subscribe(data => {
      if(data.status){
        this.allSkills = data.data;
        let dist = [];
        for (let item of data.data) {
          dist.push({ value: String(item.skill_level_id), label: String(item.skill_level_designation +"('"+ this.columnRoleList[item.skill_level_roleid] +')') });
          //dist.push(item.skill_level_id);
        }
        this.skillList = dist;
        console.log(this.skillList);
        this.getEmpRoleMap(); //get all skill as role map
      }

    })
  }

  //get validation Error and scroll to form
  //@Roshan _-_-_-_Krishana_-_-_-
  getFormValidationErrors() {
    Object.keys(this.employeeForm.controls).forEach(key => {

    const controlErrors: ValidationErrors = this.employeeForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            this.ngxScrollToDestination = key;
            return;
          });
        }
      });
    }


    emp_roles_array:any = [];
    getEmpRoleMap() {
      this.Service.getEmpRoleMap(this.data_emp_id).subscribe(data=>{
        if(data.data){
        this.rolesMap = data.data;
        this.emp_roles_array = [];//clear the role map before the insert;
        for (const role of data.data) {
           this.emp_roles_array.push(role.erm_skill_id);
          }
        } else {
          //this.popupMessageService.showInfo('No selected roles found','Error')
        }
        this.addCheckboxes();
      });
    }


    private addCheckboxes() {
      this.allSkills.map((o, i) => {
        //console.log(this.emp_roles_array.indexOf(o.skill_level_id));
        let control = new FormControl(this.emp_roles_array.indexOf(o.skill_level_id)>=0);//if user role exists in role it selected the checkbox
        (this.employeeRoleManageForm.controls.roles as FormArray).push(control);
      });
    }

    submitemployeeRoleManageForm() {
      console.log(this.employeeRoleManageForm.value);
      this.Service.submitEmpRoleMap(this.employeeRoleManageForm.value).subscribe(data=>{
        if(data.status==1){
          this.popupMessageService.showSuccess("Selected Roles Applied To User","success!");
          this.ShowEmployeeListing(1);
        } else{
          this.popupMessageService.showError("Failed to update","Error");
        }
      });
    }

    refrenceListing() {
      this.mainDiv = 'Level4';
      this.Level4Option = 'ShowRefrenceListing';
      this.sharedServices.searchForm.next(''); //if any search form is intiated it will be cleared
      this.refrenceList = [];
      this.Service.getRefrenceList().subscribe(data=>{
        if(data.status == 1){
          if(typeof(data.data) != 'undefined' && data.data.length>0) {;
            this.refrenceList = data.data;
          }
        }
      });
    }


    leadSourceListing() {
      this.mainDiv = 'Level4';
      this.Level4Option = 'ShowLeadSourceListing';

    }

    headerText:string;
    updateRefrence(lead_refrence_id,refrence_name){
      this.createLeadRefrenceForm();
      this.leadRefrenceForm.controls['id'].setValue(lead_refrence_id);
      this.leadRefrenceForm.controls['type'].setValue('update');
      this.leadRefrenceForm.controls['name'].setValue(refrence_name);
      this.leadRefrenceForm.updateValueAndValidity();
      this.Level4Option = 'UpdateRefrence';
      this.headerText = "Update Reference Form";
    }

    AddRefrence(){
      this.createLeadRefrenceForm();
      this.leadRefrenceForm.controls['id'].setValue('');
      this.leadRefrenceForm.controls['type'].setValue('add');
      this.leadRefrenceForm.updateValueAndValidity();
      this.Level4Option = 'AddRefrence';
      this.headerText = "Add Reference Form";
      this.mainDiv = 'Level4';
    }


    percentageValidator(control:AbstractControl){
      return control.value && control.value>100? {'limitMax':true}:null;
    }
    isNumberKey(evt){
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
         return false;

      return true;
    }

    MaxMinValidity:ValidatorFn=(fg:FormGroup)=>{
      let min=Number(fg.get('noofdaysmin').value);
      let max=Number(fg.get('noofdaysmax').value);

      return min && max && min>max ? {'range':true}:null;

    }


    FunnelManagenmetForm:FormGroup;

    createFunnelManagenmetForm(){
      this.FunnelManagenmetForm=this.formBuilder.group({
        stage:['',Validators.required],
          noofdaysmin:['',Validators.required],
          noofdaysmax:['',Validators.required],
        percentage:['',[this.percentageValidator,Validators.required]]
      },{ validator:this.MaxMinValidity})

    }

  deleteFunnelManagement(){
    this.Service.funnelManagementGet('delete',this.employeeDeleteId)
    .subscribe(data=>{
      if(data.status){
        this.openDeleteConfirmation=false;
        this.popupMessageService.showSuccess('Deleted successfully!!','Success');
        this.showFunnelManagenmentListing(this.pages);
      }
      else{
        this.popupMessageService.showError(data.error_message,'error!')
      }
    })
  }

    addFunnelManagement(){
      this.createFunnelManagenmetForm();
      this.Level4Option="AddFunnelManagement";
      this.editFlag=false;
      this.headerText="Add Funnel Management Form";
      this.mainDiv='Level4';
    }

    editFunnelManagement(data){
      this.mainDiv="Level4";
      this.Level4Option='AddFunnelManagement';
      this.editFlag=true;
      this.createFunnelManagenmetForm();
      this.FunnelManagenmetForm.patchValue(data);
      this.FunnelManagenmetForm
      .addControl('id',new FormControl(data.id))
    }

    addSurveyor(page,pagination:boolean=false) {
      this.itemPerPage=10;
      this.mainDiv = 'Level4';
      this.Level4Option = 'addSurveyor';
      if(!pagination){
        this.sharedServices.searchForm.next('employeeMaster');
      }
      let isFunnel = 1;
      this.Service.getEmployeeList('list', null, page, this.itemPerPage,this.smartSearchFormData, isFunnel)
        .subscribe(
          data => {
            //console.log(data);
            if (data.status) {
              this.employeeList = data.data.data;
              this.totalItem = data.data._meta.total_records;
              this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
              this.pages = page;
              this.createPaginationSubmitForm();
              this.noRecords=false;
            }else{
              this.noRecords=true;
            }
          }
        );
    }

  showFunnelManagenmentListing(page){
    this.mainDiv='Level4';
    this.Level4Option='FunnelManagementList';
    this.Service.funnelManagementGet('list',null,page,this.itemPerPage)
    .subscribe(data=>{
      if(data.status){
        this.funnelManagementList=data.data.data;
        this.totalItem=data.data._meta.total_records;
        this.pageCount=Math.ceil(this.totalItem/this.itemPerPage);
        this.pages=page;
        this.createPaginationSubmitForm();
      }
    })
  }


    submitFunnelManagementForm(){
      if(this.FunnelManagenmetForm.valid){
        let type=!this.editFlag?'add':'update';
        this.Service.funnelManagementPost(type,this.FunnelManagenmetForm.value)
        .subscribe(data=>{
          if(data.status){
          this.popupMessageService.showSuccess('Funnel Management record has been saved successfully!!','Success');
           !this.editFlag? this.showFunnelManagenmentListing(1):this.showFunnelManagenmentListing(this.pages);
          }
          else{
            this.popupMessageService.showError(data.error_message,'error');
          }
        })
      }
      else{
        this.popupMessageService.showError('Invalid Form Data','error')
      }
    }

    leadRefrenceForm:FormGroup;
    createLeadRefrenceForm(){
      this.leadRefrenceForm = this.formBuilder.group({
        id: [''],
        name: ['',Validators.compose([Validators.maxLength(25),Validators.required,Validators.pattern(/^[a-zA-Z0-9_-]+( [a-zA-Z0-9_-]+)*$/)])],
        type: [''],
      })
    }

    leadRefrenceId:any;
    confirmDeletLeadRefrence(lead_refrence_id){
      this.leadRefrenceId = lead_refrence_id;
      this.deleteRecordFrom = 'LeadRefrenceData';
      this.openDeleteConfirmation = true;
    }

    deleteLeadRefrence(){
      let  lead_refrence_id = this.leadRefrenceId;
      this.Service.removeLeadRefrence(lead_refrence_id).subscribe(data=>{
        if(data.status == 1){
          this.popupMessageService.showInfo('Reference Removed','Success');
          this.refrenceListing();
        }
      });
      this.openDeleteConfirmation = false;
    }

    submitLeadRefrenceFrom(){ //for add and update both
      let Formvalue = this.leadRefrenceForm.value;
      if(this.leadRefrenceForm.valid){
      this.Service.submitLeadRefrenceFrom(Formvalue).subscribe(data=>{
        if(data.status == 1){
          this.popupMessageService.showSuccess('Record has been saved successfully!!', 'Success!');
          this.refrenceListing();
        } else {
          // console.log(data.error_message);
          this.popupMessageService.showError(data.error_message, 'Error');
        }
      });
      } else {
        this.popupMessageService.showError("Insufficient Data!", 'Error');
      }

    }

    changeInsolationoption(level:string, optionText:string) {
      this.ShowSidebarTab = optionText;
      this.mainDiv = level;
      this.MainDashboardOptions = optionText;
      this.Level4Option = '';
    }


    insolationList:any;
    insolationListing() {
      this.mainDiv = 'Level4';
      this.Level4Option = 'ShowInsolationListing';
      this.sharedServices.searchForm.next(''); //if any search form is intiated it will be cleared
      this.insolationList = [];
      this.Service.getInsolationList().subscribe(data=>{
        if(data.status == 1){
          if(typeof(data.data) != 'undefined' && data.data.length>0) {;
            this.insolationList = data.data;
          }
        }
      });
    }

    insolationForm:FormGroup;
    createInsolationForm() {
      this.insolationForm = this.formBuilder.group({
        id: [''],
        location_name: ['',Validators.compose([Validators.maxLength(25),Validators.required,Validators.pattern(/^[a-zA-Z0-9_-]+( [a-zA-Z0-9_-]+)*$/)])],
        yeild_value: ['', Validators.compose([Validators.required,Validators.pattern('[0-9]{1,10}'),Validators.min(1)])],
        type: [''],
      })
    }

    AddInsolation() {
      this.mainDiv = 'Level4';
      this.createInsolationForm();
      this.insolationForm.controls['type'].setValue('add');
      this.insolationForm.updateValueAndValidity();
      this.Level4Option = 'Addinsolation';
      this.headerText = "Add Insolation Form";
    }

    updateInsolation(data){
      this.createInsolationForm();
      this.insolationForm.controls['id'].setValue(data.ins_id);
      this.insolationForm.controls['type'].setValue('update');
      this.insolationForm.controls['location_name'].setValue(data.ins_location);
      this.insolationForm.controls['yeild_value'].setValue(data.ins_yeild_value);
      this.insolationForm.updateValueAndValidity();
      this.Level4Option = 'Updateinsolation';
      this.headerText = "Update Insolation Form";
    }

    submitInsolaionFrom(){ //for add and update both
      let Formvalue = this.insolationForm.value;
      if(this.insolationForm.valid){
      this.Service.submitInsolationFrom(Formvalue).subscribe(data=>{
        if(data.status == 1){
          this.popupMessageService.showSuccess('Record has been saved successfully!!', 'Success!');
          this.insolationListing();
        } else {
          this.popupMessageService.showError(data.error_message, 'Error');
        }
      });
      } else {
        this.popupMessageService.showError("Insufficient Data!", 'Error');
      }

    }

    insolationId:any;
    confirmDeletInsolation(insolationId){
      this.insolationId = insolationId;
      this.openDeleteConfirmation = true;
      this.deleteRecordFrom = 'InsolationData'
    }

    deleteInsolation(){
      let  insolation_id = this.insolationId;
      this.Service.removeInsolation(insolation_id).subscribe(data=>{
        if(data.status == 1){
          this.popupMessageService.showInfo('Insolation City Removed','Success');
          this.insolationListing();
        }
      });
      this.openDeleteConfirmation = false;
    }

    insolationBulkUploadForm:FormGroup;
    bulkUploadFrom() {
      this.insolationBulkUploadForm = this.formBuilder.group({
        bulkUploadFile: ['', Validators.compose([Validators.required])],
      });
    }

    insolationBulkupload() {
      this.bulkUploadFrom();
      this.mainDiv = 'Level4';
      this.Level4Option = 'insolation_bulk_upload';
    }

    actionLoader:any;
    InsoaltionData:any;
    fileChange(event: any) {
      if (localStorage.getItem('emp_auth_key')) {
                  this.actionLoader = 'upload_loader';
                  let eventClone = event;
                  let extType = event.target.files[0].type;
                  let ext = eventClone.target.files[0].name.split('.').pop();
                  this.sharedServices.docsToBase64(event, ["xls", "xlsx", "XLS", "XLSX"]).then(data => {
                  this.Service.uploadBulkInsolation(String(data), ext, extType).subscribe(data => {
                  if (data.status == 1) {
                              this.InsoaltionData = data.data.successData;
                              let successMessage = "Total inserted "+this.InsoaltionData.countAdded+ " and total duplicate recored "+this.InsoaltionData.countDuplicate;
                              this.popupMessageService.showSuccess(successMessage, "Success!");
                              this.actionLoader = '';

                          } else if (data.error_code != 0) {
                              this.popupMessageService.showError(data.error_message, "Error!");
                              this.actionLoader = '';
                          }
                      }, (error) => {
                          this.popupMessageService.showError("Error in file upload.", "Upload Error!");
                          this.actionLoader = '';
                      }
                      );

                  }).catch(data => {
                      this.actionLoader = '';
                      this.popupMessageService.showError(data, "Invalid File Type!");
                      //this.alertService.error(data);
                  });
      }
  }
  bulkuploadgridpanel(event: any,grid){
    if (localStorage.getItem('emp_auth_key')) {
      this.actionLoader = 'upload_loader';
      let extType = event.target.files[0].type;
      let ext = event.target.files[0].name.split('.').pop();
      this.sharedServices.docsToBase64(event, ["xls", "xlsx", "XLS", "XLSX"]).then(data => {
        this.Service.panelbulkupload(grid, 'panel', 'bulkupload', String(data), ext, extType).subscribe(data => {
          if (data.status) {
            this.actionLoader = '';
            if(data.data.successData){
              this.popupMessageService.showSuccess(data.data.successData+' Panel has been added successfully!!', 'Success!');
              (grid == 'off')?this.ShowOffGridPanelListing(1):this.ShowOnGridPanelListing(1);
            }else{
              this.popupMessageService.showError(data.data.error, "Duplicate data!");
            }
            }else if (data.error_code != 0) {
                  this.actionLoader = '';
                  this.popupMessageService.showError(data.error_message, "Error!");
               }
          }, (error) => {
              this.popupMessageService.showError("Error in file upload.", "Upload Error!");
              this.actionLoader = '';
          }
          );
          event.target.value = null;

      }).catch(data => {
          this.actionLoader = '';
          this.popupMessageService.showError(data, "Invalid File Type!");
          //this.alertService.error(data);
      });
}
  }

   /**
     * @description: function handled file dropped as event and serve as same in file change event of form using
     * @developer: Roshan
     */
    handleFilesDropped(event: any) {
      let eventAsSelectfile = {'target': {'files': event}};
      this.fileChange(eventAsSelectfile);
  }

  scriptmovetofunnel(){
    this.Service.scriptexecution().subscribe((data => {
      if (data.status === 1) {
          this.popupMessageService.showSuccess('Script executed', 'success!')
      } else {
          this.popupMessageService.showError(data.error_message, 'error!')
      }
  }))
  }

  offgridBulkUploadForm:FormGroup;
  bulkUploadoffgridFrom() {
    this.offgridBulkUploadForm = this.formBuilder.group({
      bulkUploadFile: ['', Validators.compose([Validators.required])],
    });
  }

  toggleVisibility(e) {
    if (e.target.checked) {
      this.AnnouncementForm.controls.isAnnouncementEnabled.patchValue(1);
    } else {
      this.AnnouncementForm.controls.isAnnouncementEnabled.patchValue(0);
    }
  }
}
