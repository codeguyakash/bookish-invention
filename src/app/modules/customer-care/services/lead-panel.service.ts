import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router'
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { SharedServices } from './../../../services/shared.services';
import * as globals from './../../../static/static';
import { ConsumerNotInterestedFields } from './../../../interfaces/cceNotInterested.interface';
import { ConsumerNoResponseFields } from './../../../interfaces/cceNoResponse.interface';
import { CallRescheduleFields } from './../../../interfaces/cceCallReschedule.interface';
import { CustomerCareFormFields } from './../../../interfaces/cceFillForm.interface';

@Injectable()
export class LeadPanelService {
    headers:any;
    constructor(
        private http: Http,
        private sharedService:SharedServices
    ) { }

    /**
     * Get Lead info for cce
     * @param user_id number
     */
    getLeadDetailsForCce(userId: number):Observable<any> {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.get(globals.APIS.CCE_LEAD_INFO+'?user_id='+userId, { headers: this.headers });
        //return this.http.get('ccelistLeadInfo?user_id=' + userId).map((res: Response) => res.json()).share();
    }

    /**
     * Get Lead info for cce
     * @param user_id number
     */
    getLeadDetailsForm(userId: number):Observable<any> {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.get(globals.APIS.CCE_LEAD_FORM + '?leadid=' + userId, { headers: this.headers });
        //return this.http.get('ccelistLeadInfo?user_id=' + userId).map((res: Response) => res.json()).share();
    }

    /* Not Interested Request Submit
    * @param interface ConsumerNotInterestedFields
    * @return Subscription
    */
   requestConsumerNotInterested(consumerNotInterestedRequestDetails: ConsumerNotInterestedFields):Observable<any>{
       this.headers = new Headers();
       this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
       return this.sharedService.post(globals.APIS.CONSUMER_NOT_INTERESTED, consumerNotInterestedRequestDetails, { headers: this.headers });
   }

   /* Not Response Request Submit
    * @param interface ConsumerNoResponseFields
    * @return Subscription
    */
   requestConsumerNoResponse(consumerNoResponseRequestDetails: ConsumerNoResponseFields):Observable<any>{
       this.headers = new Headers();
       this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
       return this.sharedService.post(globals.APIS.CONSUMER_NO_RESPONSE, consumerNoResponseRequestDetails, { headers: this.headers });
   }

   /* Call Reschedule Request Submit
    * @param interface ConsumerNotInterestedFields
    * @return Subscription
    */
   requestCallReschedule(callRescheduleRequestDetails: CallRescheduleFields):Observable<any>{
       this.headers = new Headers();
       this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
       return this.sharedService.post(globals.APIS.CALL_RESCHEDULE, callRescheduleRequestDetails, { headers: this.headers });
   }

   /* Consumer Form Request Submit
    * @param interface CustomerCareFormFields
    * @return Subscription
    */
   requestSubmitForm(customerCareFormRequestDetails: CustomerCareFormFields, buttonValue: number):Observable<any>{
       this.headers = new Headers();
       this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
       if(buttonValue === 3) {
           return this.sharedService.post(globals.APIS.AUTO_SAVE, customerCareFormRequestDetails, { headers: this.headers });
       } else {
           return this.sharedService.post(globals.APIS.CCE_LEAD_FORM_SUBMIT, customerCareFormRequestDetails, { headers: this.headers });
       }

   }

   /**
     * Get State info for user
     * @param pincode string
     */
    getStateCityData(pincode: String):Observable<any> {
        return this.sharedService.get(globals.APIS.STATE_CITY+'?locality_pincode='+pincode);
    }

    /**
     * Get State info for user
     * @param pincode string
     */
    // getSurveyorData():Observable<any> {
    //     this.headers = new Headers();
    //     this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    //     return this.sharedService.get(globals.APIS.SURVEYOR_DATA, { headers: this.headers });
    // }

    getSurveyorData(skill_id?:number):Observable<any> {
      let employee_skill_id =  (skill_id)?skill_id:13;
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      return this.sharedService.get(globals.APIS.SURVEYOR_DATA+"?emp_skill_level_id="+ employee_skill_id, { headers: this.headers });
    }

    /* Consumer Requests Site Survey
    * @param interface SiteSurveyRequestFields
    * @return Subscription
    */
    requestSurveyConsumer(siteSurveyRequestDetails:any): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        return this.sharedService.post(globals.APIS.SURVEY_REQUEST+'?isBack=true', siteSurveyRequestDetails, { headers: this.headers });
    }

    updateLeadData(cceDetails: any): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        return this.sharedService.post(globals.APIS.UPDATE_LEAD, cceDetails,{headers: this.headers});
    }

    paymentLink(leadId:number){
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.get(globals.APIS.SEND_PAYMENT_KEY + '/?ld='+ leadId +'&irdi=' + currentEmpRoleId, { headers: this.headers });
    }

    reachoutSms(leadId:number){
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.get(globals.APIS.SEND_REACHOUT_SMS + '/?ld='+ leadId +'&irdi=' + currentEmpRoleId, { headers: this.headers });
    }

    getSurveyorRejectedProjects(formData?: any): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (formData){
          return this.sharedService.post(globals.APIS.SURVEYOR_REJECT_PROJECTS +"?irdi="+currentEmpRoleId, formData, { headers: this.headers });
        } else {
          return this.sharedService.get(globals.APIS.SURVEYOR_REJECT_PROJECTS +"?irdi="+currentEmpRoleId, { headers: this.headers });
        }
    }

    /**
     * @description: Service for fetching data of followup rejected Projects
     * @developer:roshan
     */
    getFollowupRejectedProjects(page: any, pazesize: any, formData?: any): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (formData){
          return this.sharedService.post(globals.APIS.GET_FOLLOWUP_REJECTION +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize, formData, { headers: this.headers });
        } else {
          return this.sharedService.get(globals.APIS.GET_FOLLOWUP_REJECTION +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize, { headers: this.headers });
        }
    }

     /**
     * @description: Service for fetching data of followup rejected Projects
     * @developer:roshan
     */
    getColbucketLeadProject(page: any, pazesize: any, formData?: any): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (formData){
          return this.sharedService.post(globals.APIS.GET_COLDBUCKET_LEADS_PROJECTS +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize, formData, { headers: this.headers });
        } else {
          return this.sharedService.get(globals.APIS.GET_COLDBUCKET_LEADS_PROJECTS +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize, { headers: this.headers });
        }
    }

    getColdbucketRemarks(data) {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (data){
          return this.sharedService.post(globals.APIS.COLDBUCKET_REMARKS +"?irdi="+currentEmpRoleId, data, { headers: this.headers });
        }
    }

    /**
     * @description: to restore the cold bucket leads
     */
    reviveColdbucketleads(formData?:any) {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (formData){
          return this.sharedService.post(globals.APIS.REVIVE_COLDBUCKET_LEADS +"?irdi="+currentEmpRoleId, formData, { headers: this.headers });
        }
    }

    /**
     * @description: to restore the cold bucket Projects [Rejected Projects]
     */
    reviveColdbucketProject(formData?:any) {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (formData){
          return this.sharedService.post(globals.APIS.REVIVE_COLDBUCKET_PROJECT +"?irdi="+currentEmpRoleId, formData, { headers: this.headers });
        }
    }

    rejectProjectPermanently(projectId: number): Observable<any> {
        const data = {
            data : [projectId]
        };
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        const currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.post(`${globals.APIS.REJECT_PROJECT_PERMANENTLY}?irdi=${currentEmpRoleId}`, data, { headers: this.headers } );
    }
    /*
    * Service to remove the leads in Bulk
    */
    rejectProjectPermanentlyBulk(projectsList : Array<string | number>): Observable<any> {
        const data = {
            data : projectsList
        };
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        const currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.post(`${globals.APIS.REJECT_PROJECT_PERMANENTLY}?irdi=${currentEmpRoleId}`, data, { headers: this.headers } );
    }

    rellocateSurveyor(reallocationDetails: any): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.post(globals.APIS.REALLOCATE_SURVEYOR + "?irdi=" + currentEmpRoleId, reallocationDetails, { headers: this.headers });
    }

    getAllStates(): Observable<any> {
        return this.sharedService.get(globals.APIS.ALL_STATES);
    }

    getAllCities(id?:number): Observable<any> {
        if(id){
            return this.sharedService.get(globals.APIS.GET_DISTRICT_MASTER+"?district_stateid="+id);
        }else{
            return this.sharedService.get(globals.APIS.ALL_CITIES);
        }

    }

    makeLeadInQueue(leadId:number): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.get(globals.APIS.MAKE_LEAD_IN_QUEUE +'/'+ leadId +"?irdi=" + currentEmpRoleId, { headers: this.headers });
    }

    getExistingLAndP(phone: number) {
        return this.sharedService.get(globals.APIS.GET_EXISTING_LEAD_PROJECT_FOR_NUMBER + "/" + phone + "/?is_back=1");
    }

    updateExistingLead(lead_id: number, data: any) {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('auth_key'));
        return this.sharedService.post(`${globals.APIS.UPDATE_EX_LEAD}/${lead_id}`, { query_text: data }, { headers: this.headers });
    }

    updateExistingProject(lead_id: number, data: any) {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('auth_key'));
        return this.sharedService.post(`${globals.APIS.UPDATE_EX_PROJECT}/${lead_id}`, { query_text: data }, { headers: this.headers });
    }

    /**
     * @description: Service for fetching data of followup rejected Projects
     * @developer:roshan
     */
    getAllLeads(page: any, pazesize: any, formData?: any, isExported:boolean = false): Observable<any> {
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (formData){
          return this.sharedService.post(globals.APIS.GET_ALL_LEAD_PROJECTS +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize+'&exported='+isExported, formData, { headers: this.headers });
        } else {
          return this.sharedService.get(globals.APIS.GET_ALL_LEAD_PROJECTS +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize+'&exported='+isExported, { headers: this.headers });
        }
    }

    /**
     * Get all leads admin
     */
    getAllLeadsAdmin(page: any, pazesize: any, formData?: any, isExported:boolean = false): Observable<any> {
      this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
        if (formData){
          return this.sharedService.post(globals.APIS.SHOW_ALL_LEADS +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize+'&exported='+isExported, formData, { headers: this.headers });
        } else {
          return this.sharedService.get(globals.APIS.SHOW_ALL_LEADS +"?irdi="+currentEmpRoleId+'&page='+page+'&pazesize='+pazesize+'&exported='+isExported, { headers: this.headers });
        }
    }

    getLeadsDetail(lead_id){
        this.headers = new Headers();
        if (localStorage.getItem('emp_auth_key')) {
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        }
        let currentEmpRoleId = localStorage.getItem('role_id');
          return this.sharedService.get(globals.APIS.GET_LEAD_PROJECT_DETAIL +"?irdi="+currentEmpRoleId+'&lead_id='+lead_id, { headers: this.headers });
    }

    //get employee List
    getEmployeeList(skill_id?:number):Observable<any> {
        let url =  (skill_id)?"?emp_skill_level_id="+ skill_id:"";
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.get(globals.APIS.SURVEYOR_DATA+url, { headers: this.headers });
      }

      //get employee List
    getProjectStatus():Observable<any> {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.get(globals.APIS.ALL_PROJECT_STATE, { headers: this.headers });
      }

      //get employee List
    getLeadStatus():Observable<any> {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.get(globals.APIS.ALL_LEAD_STATE, { headers: this.headers });
      }

    partnerNoResponse(formData):Observable<any>{
        let currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.post(globals.APIS.PARTNER_NO_RESPONSE +"?irdi="+currentEmpRoleId, formData, { headers: this.headers });
    }

    partnerReschedule(formData):Observable<any>{
        let currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.post(globals.APIS.PARTNER_RESCHEDULE +"?irdi="+currentEmpRoleId, formData, { headers: this.headers });
    }

     //get employee List
     getAllEmployeeList():Observable<any> {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.get(globals.APIS.GET_ALL_EMPLOYEE, { headers: this.headers });
      }


     getLeadRefrence():Observable<any> {
        let currentEmpRoleId = localStorage.getItem('role_id');
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.get(globals.APIS.GET_REFRENCE_LIST +"?irdi="+currentEmpRoleId, { headers: this.headers });
      }

      commercialprojectSubmitForm(customerCareFormRequestDetails: CustomerCareFormFields, buttonValue: number):Observable<any>{
        let currentEmpRoleId = localStorage.getItem('role_id');
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.post(globals.APIS.COMMERCIAL_PROJECTS+"?irdi="+currentEmpRoleId, customerCareFormRequestDetails, { headers: this.headers });
    }

    getProjectContacts(project_id){
        let currentEmpRoleId = localStorage.getItem('role_id');
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let formData = {"project_id":project_id};
        return this.sharedService.post(globals.APIS.PROJECT_CONTACTS +"?irdi="+currentEmpRoleId+'&type=list',formData, { headers: this.headers });
    }

    deleteProjectContacts(project_contact_id){
        let currentEmpRoleId = localStorage.getItem('role_id');
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let formData = {"pc_id":project_contact_id};
        return this.sharedService.post(globals.APIS.PROJECT_CONTACTS +"?irdi="+currentEmpRoleId+'&type=del',formData, { headers: this.headers });
    }

    addProjectContact(formData){
        let currentEmpRoleId = localStorage.getItem('role_id');
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.post(globals.APIS.PROJECT_CONTACTS +"?irdi="+currentEmpRoleId+'&type=add',formData, { headers: this.headers });
    }

    callButton(...args) {
        const [clientid, dialNo, transferTo, campId, leadId, crmCallid] = args;;
        return this.sharedService.get(`${globals.APIS.MAKE_CALL}?clientid=${clientid}&dialno=${dialNo}&transferto=${transferTo}&campid=${campId}&leadid=${leadId}&crmcallid=${crmCallid}`);
    }

    changeSurveyor(data):Observable<any>{
        let currentEmpRoleId = localStorage.getItem('role_id');
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        return this.sharedService.post(globals.APIS.UPDATE_SURVEYOR + '?irdi='+currentEmpRoleId, data, { headers: this.headers });
    }

    // Get Listing of Inverter Products to be shown in Admin and Sol Designer
    getInverterProducts(data):Observable<any> {
      let currentEmpRoleId = localStorage.getItem('role_id');
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      return this.sharedService.get(globals.APIS.GET_PRODUCT +"?irdi="+currentEmpRoleId+"&product_type="+data.type, { headers: this.headers });
    }

    addInverterProducts(formData: any) {
      let currentEmpRoleId = localStorage.getItem('role_id');
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      return this.sharedService.post(globals.APIS.ADD_PRODUCT +"?irdi="+currentEmpRoleId, formData,{headers: this.headers});
    }

    updateInverterProducts(formData: any) {
      let currentEmpRoleId = localStorage.getItem('role_id');
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      return this.sharedService.post(globals.APIS.UPDATE_PRODUCT+"?p_id="+formData.p_id +"&irdi="+currentEmpRoleId, formData,{headers: this.headers});
    }

    deleteInverterProducts(deletionID: any) {
      let currentEmpRoleId = localStorage.getItem('role_id');
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      return this.sharedService.get(globals.APIS.DELETE_PRODUCT+"?p_id="+deletionID +"&irdi="+currentEmpRoleId,{headers: this.headers});
    }

    updateLeadSource(formData: any) {
      let currentEmpRoleId = localStorage.getItem('role_id');
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      return this.sharedService.post(globals.APIS.LEAD_SOURCE_UPDATE+"?lead_id="+formData.leadId +"&irdi="+currentEmpRoleId, formData,{headers: this.headers});
    }

    updateSiteSurveyor(formData: any) {
      let currentEmpRoleId = localStorage.getItem('role_id');
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      return this.sharedService.post(globals.APIS.UPDATE_SITE_SURVEYOR+"?lead_id="+formData.leadId +"&irdi="+currentEmpRoleId, formData,{headers: this.headers});
    }
}
