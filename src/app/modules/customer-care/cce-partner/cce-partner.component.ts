import { Component, OnInit } from '@angular/core';
import { LeadListService } from '../../employee-panel/services/lead-list.service';
import { LeadPanelService } from '../services/lead-panel.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { Router } from '@angular/router';

import { SharedServices } from '../../../services/shared.services';
import { ngxCsv } from 'ngx-csv/ngx-csv';

declare var $: any;

@Component({
    selector: 'cce-partner',
    templateUrl: './cce-partner.component.html'
})
export class CustomerCareCcePartner implements OnInit {
    userData:any;
    isLoginEmp:any=false;
    loading:boolean = false;
    showSmartSearchComponent:boolean = false;

    isListing:any;
    subscription:any;

    allStates: any;
    allCities: any;
    cityList:any;
    stateList:any;
    localityList:any;
    otherPincode:any;
    isPincode:any;
    lead_form:boolean = false;
    

    constructor(
        private route: Router,
        private formBuilder: FormBuilder,
        private leadPanelService: LeadPanelService,
        private leadListService: LeadListService,
        private popupMessageService: PopupMessageService,
        private sharedServices:SharedServices
        ) {}

    ngOnInit() {
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
        }
        this.partnerQueryDataOpen(1);

    }


    partnerQueryLogsList:Array<any> = [];
    totalItem:any;
    pageCount:any = 1;
    pages:any;
    itemPerPage:number = 10;
    smartSearchFormData:any;

    noRecords:boolean;
    partnerQueryData(page,type?:any) {
        this.showSmartSearchComponent = true;
        this.isListing = 'partnerQueryListing';
        this.sharedServices.searchForm.next('PartnerQueryUser');
        this.partnerQueryLogsList = [];
        this.leadListService.getPartnerQueryUser(page, this.itemPerPage, this.smartSearchFormData,type)
          .subscribe(
            data => {
              if (data.status==1) {
                this.partnerQueryLogsList = data.result.data;
                this.totalItem = data.result._meta.total_records;
                this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
                this.pages = page;
                this.createPaginationSubmitForm();
              }
            }
          );
    }

    QueryType:any;
    partnerQueryDataOpen(page){
        this.sharedServices.formDataSmartSearch.next("");
        this.smartSearchFormData = '';
        this.QueryType = 'open';
        this.partnerQueryData(page,'open');
        this.sharedServices.partnerListType.next('open');
    }

    partnerQueryDataClosed(page){
        this.sharedServices.formDataSmartSearch.next("");
        this.smartSearchFormData = '';
        this.QueryType = 'closed';
        this.partnerQueryData(page,'closed');
        this.sharedServices.partnerListType.next('closed');
    }

    paginationSubmitForm:FormGroup;
    createPaginationSubmitForm() {
        this.paginationSubmitForm = this.formBuilder.group({
            page_number: [this.pages, Validators.compose([Validators.required, Validators.min(0), Validators.max(this.pageCount)])],
        });
    }

    currentSearchTab:any;
    smartSearchResult(event: any) {
        this.pages = 1;
        this.sharedServices.formDataSmartSearch.subscribe((data) => {
            this.smartSearchFormData = data;
        })
        this.sharedServices.searchForm.subscribe((data) => {
            this.currentSearchTab = data;
        });
        if(this.isListing = 'partnerQueryListing'){
            this.partnerQueryLogsList = event.result.data;
            this.totalItem = event.result._meta.total_records;
            this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
            this.createPaginationSubmitForm();
        }
    }

    pageSubmit() {
        if (this.paginationSubmitForm.valid) {
            let page = this.paginationSubmitForm.controls.page_number.value;
            if (this.isListing == 'partnerQueryListing'){
                this.partnerQueryData(page,this.QueryType);
             }
        }
    }


    partnerQryDetailForm:any;
    partnerQryDetailData:any;
    partnerLogDataHistory:any;
    OpenPartnerDetail(data) {
        this.partnerQryDetailForm = true;
        let partner_id = data.partnerQuery.prt_id;
        this.leadListService.getPartnerLogRemarksHistory(partner_id).subscribe((data)=>{
            this.partnerLogDataHistory = data.data;
        });
        this.partnerQryDetailData = data;
        this.createQueryDetailForm(data);
    }

    minDate = new Date();
    queryDetailForm:FormGroup;
    defaultResolutionDate:any = new Date();
    resolutionStatus:any;
    createQueryDetailForm(data) {
        let partner_id = data.partnerQuery.prt_id;
        this.resolutionStatus = data.partnerQuery.prt_user_status;
        if(data.partnerQuery.prt_resolution_date != null){
            this.defaultResolutionDate = new Date(Date.parse(data.partnerQuery.prt_resolution_date));
        } else {
            this.defaultResolutionDate = new Date();
        }
        let remark = data.partnerQuery.prt_remark;
        let resolution_status = data.partnerQuery.prt_user_status;
          this.queryDetailForm = this.formBuilder.group({
              prt_id: [partner_id],
              resolutionDate: [this.defaultResolutionDate,Validators.required],
              remarks: [remark,Validators.required],
              resolutionStatus: [resolution_status,Validators.required]
          });
      }

      noResponseRequest:FormGroup;
      createNoResponseRequestForm(partner_id) {
          this.noResponseRequest = this.formBuilder.group({
              prt_id: [partner_id],
              lease_modifiedby: [this.userData.emp_id],
              lead_callowner_remarks: ['',Validators.required],
          });
      }
  
      
      submitQueryDetail(){
          if(this.queryDetailForm.valid){
              let formData = this.queryDetailForm.value;
              this.leadListService.submitPartnerQuery(formData).subscribe((data)=> {
                  if(data.status == 1){
                      this.partnerQueryData(1,this.QueryType);
                      this.ClosePartnerDetail();
                      this.popupMessageService.showSuccess('Remark Saved Successfully','!success');
                  } else {
                        this.ClosePartnerDetail();
                      this.popupMessageService.showError(data.error_message,'!Error');
                  }
              });
          } else {
            this.popupMessageService.showError('Insufficient Data!!', 'error');
          }
      }

      ExportCSVForParterLog(){

        this.leadListService.getPartnerQueryUser(this.pages, this.itemPerPage, this.smartSearchFormData,this.QueryType,'export')
          .subscribe(
            data => {
                let exportData = [{
                    Partner_Name: "Partner Name",
                    Firm_Name : "Firm Name",
                    Phone_No : "Phone No",
                    Alt_Phone_No : "Alternate Phone No",
                    Address : "Address",
                    Status : "Status",
                    Remark : "Remarks",
                    Resolution_date : "Resolution Date",
                    Missed_Call_Count : "Missed Call Count",
                    Missed_Call_Date : "Missed Call Date",
               }];
              if (data.status==1) {
                data.result.data.forEach(element => {
                    let Districtname = (element.districtMaster.district_name)?element.districtMaster.district_name:'';
                    let Statename = (element.stateMaster.state_name)?element.stateMaster.state_name:'';
                    var temp = {
                    Partner_Name: element.partnerQuery.prt_name,
                    Firm_Name : element.partnerQuery.prt_firm,
                    Phone_No : element.partnerQuery.prt_mobile,
                    Alt_Phone_No : element.partnerQuery.prt_alternate_no,
                    Address : element.partnerQuery.prt_address + ' ' + Districtname + ' ' + Statename,
                    Status : (element.partnerQuery.prt_user_status==1)?'close':'open',
                    Remark : element.partnerQuery.prt_remark,
                    Resolution_date : element.partnerQuery.prt_resolution_date,
                    Missed_Call_Count : element.missedCallData.count_missed_call,
                    Missed_Call_Date : element.missedCallData.missed_call_date,
                    };
                    exportData.push(temp);
            });
            this.exportToCSV(exportData , 'Partner Query Lead report');
            } else {
                this.popupMessageService.showInfo('No exported data','Info');
            }
        });
      }

      exportToCSV(data , fileName){
        new ngxCsv(data, fileName , {showLabels : true});
    }


    //PartnerTab data
    PartnerTabData:any;
    PartnerTab(tab: string) {
        $('html, body').animate({ scrollTop: $("#fill-form-widget").offset().top }, 1000);
        this.PartnerTabData = tab;
    }

    //partner Form data
    partnerFillForm:FormGroup;
    createPartnerForm(partner_id) {
        this.isListing = 'partner_listing';
        this.PartnerTabData = 'fill_form';
        this.partnerFillForm = this.formBuilder.group({
            prt_id: [''],
            name: ['',Validators.compose([Validators.required])],
            firm_name: ['',Validators.compose([Validators.required])],
            mobileno: ['',Validators.compose([Validators.required])],
            alternate_mobileno: [''],
            email:[''],
            address:[''],
            pincode:[''],
            city:[''],
            state:[''],
            query:[''],
            type:[''],
        });
        this.getLeadDetails(partner_id);
        this.createNoResponseRequestForm(partner_id);
    }


    ClosePartnerDetail() {
        this.partnerQryDetailForm = false;
    }
    isSubmitpartner:boolean = false;
    submitPartnerReqForm(type) {
        if(type=='submit'){
            this.partnerFillForm.controls.type.setValue('submit');
            if(this.partnerFillForm.valid != true){
                this.popupMessageService.showError('Insufficient Data!!', 'error');
                return;
            }
            this.loading = true;
            this.isSubmitpartner=true;
        } else if(type=='auto'){
            let pincode = this.partnerFillForm.get("pincode").value;
            if(pincode>0){
                this.getstateCity(pincode);
            }
            this.partnerFillForm.controls.type.setValue('auto');
        }
        this.leadListService.savepartnerdata(this.partnerFillForm.value).subscribe(data=>{
            this.loading = false;
            if(type=='submit'){
                this.popupMessageService.showInfo("Partner Data Saved",'Success');
                this.partnerQueryData(this.pages,this.QueryType);
            }
        });
    }
     /**
     * Get Partner lead details
     * @param
     */
    partnerData:any;
    getLeadDetails(partner_id) {
        this.userData = JSON.parse(localStorage.getItem('userData'));
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.getpartnerData(partner_id).subscribe(data => {
                if (data.status) {
                    if(data.type=='PARTNER'){
                        this.isListing = 'partner_listing';
                        this.partnerData = data.result.data;
                        this.partnerFillForm.controls.name.setValue(data.result.data.prt_name);
                        this.partnerFillForm.controls.firm_name.setValue(data.result.data.prt_firm);
                        this.partnerFillForm.controls.mobileno.setValue(data.result.data.prt_mobile);
                        this.partnerFillForm.controls.alternate_mobileno.setValue(data.result.data.prt_alternate_no);
                        this.partnerFillForm.controls.email.setValue(data.result.data.prt_email);
                        this.partnerFillForm.controls.address.setValue(data.result.data.prt_address);
                        this.partnerFillForm.controls.pincode.setValue(data.result.data.prt_pincode);
                        this.partnerFillForm.controls.city.setValue(data.result.data.prt_city);
                        this.partnerFillForm.controls.state.setValue(data.result.data.prt_state);
                        this.partnerFillForm.controls.prt_id.setValue(data.result.data.prt_id);
                        this.partnerFillForm.controls.query.setValue(data.result.data.prt_query);
                    }
                } else {
                    this.isLoginEmp = false;
                }
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }

    ifStateIfCity(type: String, formType?:String) {
        if (type == 'state') {
            if (formType == 'partner-form'){
                this.cityList =  this.getCitybyState(this.partnerFillForm.get("state").value);
            }

        } else if (type == 'city') {
            if (formType == 'partner-form'){
               // this.partnerFillForm.controls.state.setValue(this.setStatebyCity(this.partnerFillForm.get("city").value));
            }
        }
    }

    getCitybyState(state_id: number) {
        let cityList = [];
        this.partnerFillForm.controls.city.setValue('');
        for (let item of this.allCities) {
            if (item.district_stateid == state_id)
                cityList.push({ value: String(item.district_id), label: String(item.district_name) });
        }
        return cityList;
    }

    setStatebyCity(city_id: number) {
        let cityStateId = this.allCities.find(x => x.district_id == city_id).district_stateid;
        if (cityStateId) {
            return cityStateId;
        }
        return null;
    }

    getstateCity(searchValue:string) {
        if (this.partnerFillForm.get('pincode').valid || searchValue.length == 6) {
            this.subscription = this.leadPanelService.getStateCityData(searchValue).subscribe(data => {
                if (data.status) {
                    this.isPincode = false;
                    this.otherPincode = false;
                    this.cityList = this.convertForSelect(data.data.district_data);
                    this.stateList = this.convertForSelect(data.data.states_data);
                    this.localityList = this.convertForSelect(data.data.locality_data);
    
                } else {
                    this.otherPincode = true;
                    this.cityList = this.convertForSelect(this.allCities, 'city');
                    this.stateList = this.convertForSelect(this.allStates, 'state');
                }
            });
        }
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


}