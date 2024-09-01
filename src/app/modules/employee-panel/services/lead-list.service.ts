import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router'
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { SharedServices } from './../../../services/shared.services';
// import * as globals from './../../../static/static';
import * as globals from '../../../static/global';
import { ConsumerProjectMilestone } from './../../../interfaces/consumerProjectMilestone.interface';
import { Kart } from './../../../interfaces/kartValues.interface';
import { Header } from 'primeng/primeng';
import { getLocaleMonthNames } from '@angular/common/src/i18n/locale_data_api';
import { empty } from 'rxjs/observable/empty';
import { ThrowStmt } from '@angular/compiler';


@Injectable()
export class LeadListService {
  headers: any;

  newTabLeadData = null;
  isNewTab = false;

  constructor(
    public http: Http,
    public sharedService: SharedServices
  ) { }

  /**
   * Get Lead info for cce
   * @param user_id number
   */
  getLeadDetailsForEmployee(formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      console.log('this.is inside the if block');
      return this.sharedService.post(globals.APIS.GET_SITE_SURVEYOR_LIST + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', formData, { headers: this.headers });
    } else {
      console.log('this.is inside the else block');
      return this.sharedService.get(globals.APIS.GET_SITE_SURVEYOR_LIST + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', { headers: this.headers });
    }
  }

  /**
   * Get Lead actionable info for cce
   * @param user_id number
   */

  getLeadDetailsForEmployee_actionable(formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      console.log('this.is inside the if block');
      return this.sharedService.post(globals.APIS.GET_SUBMITTED_HANDOFF_LIST + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', formData, { headers: this.headers });
    } else {
      console.log('this.is inside the else block');
      return this.sharedService.get(globals.APIS.GET_SUBMITTED_HANDOFF_LIST + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', { headers: this.headers });
    }

  }

  getSupplyOrderList(formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      console.log('this.is inside the if block');
      return this.sharedService.post(globals.APIS.GET_SUPPLY_ORDER_LIST + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', formData, { headers: this.headers });
    } else {
      console.log('this.is inside the else block');
      return this.sharedService.get(globals.APIS.GET_SUPPLY_ORDER_LIST + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', { headers: this.headers });
    }
  }

  sendSupplyOrderMail(data): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SEND_SUPPLY_ORDER_MAIL + '?irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  getSupplyOrderDetails(projectId): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_SUPPLY_ORDER_DETAILS + '/' + projectId + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  /**
   * Get Lead info for cce
   * @param user_id number
   */
  getClarificationDetailsForEmployee(page, pagesize, formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.GET_SITE_SURVEYOR_CLAR_LIST + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_SITE_SURVEYOR_CLAR_LIST + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  /**
   * Get Lead info for cce
   * @param user_id number
   */
  getProjectStatusDetailsForEmployee(page, pazesize, formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.PROJECT_STATUS_DATA_LIST + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pazesize, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.PROJECT_STATUS_DATA_LIST + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pazesize, { headers: this.headers });
    }
  }

  getConsumerLeadsForOps(page, pazesize, type, formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.CONUMER_LEADS_FOR_OPS + '?irdi=' + currentEmpRoleId + '&list_type=' + type + '&page=' + page + '&pagesize=' + pazesize, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.CONUMER_LEADS_FOR_OPS + '?irdi=' + currentEmpRoleId + '&list_type=' + type + '&page=' + page + '&pagesize=' + pazesize, { headers: this.headers });
    }
  }

  /**
   * Get Surveyor Rej_remarks info for surveyor
   * @param projectID number
   */
  getRejRemarksDataService(projectID, state?: any): Observable<any> {
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_SITE_SURVEYOR_REJ_REMARKS + '?irdi=' + currentEmpRoleId + '&pstatus_projectid=' + projectID + '&state=' + state);
  }

  /**
   * Get project status data
   * @param projectID number
   */
  getProjectStatusDataService(projectID): Observable<any> {
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.PROJECT_STATUS_DATA + '?irdi=' + currentEmpRoleId + '&pstatus_projectid=' + projectID);
  }

  /**
   * Get Surveyor form info for surveyor
   * @param projectID number
   * @param consumerID number
   */
  getSurveyorDataService(projectID, consumerID): Observable<any> {
    // this.headers = new Headers();
    // this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_SURVEYOR_DATA + '?irdi=' + currentEmpRoleId + '&sf_project_id=' + projectID + '&sf_consumer_id=' + consumerID);
  }

  /**
   * Get Surveyor form info for surveyor
   */
  getApplianceAll(): Observable<any> {
    // this.headers = new Headers();
    // this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.get(globals.APIS.GET_APPLIANCE_DATA);
  }

  /**
   * Get Surveyor form info for surveyor
   * @param projectID number
   * @param consumerID number
   */
  getSurveyorAudit(projectID, consumerID): Observable<any> {
    // this.headers = new Headers();
    // this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_SURVEYOR_AUDIT_DATA + '?irdi=' + currentEmpRoleId + '&sf_project_id=' + projectID + '&sf_consumer_id=' + consumerID);
  }

  /**
   * Get Surveyor form info for surveyor
   * @param projectID number
   * @param consumerID number
   */
  getAuditorDetail(projectID): Observable<any> {
    // this.headers = new Headers();
    // this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_AUDITOR_DATA + '?irdi=' + currentEmpRoleId + '&ssd_projectid=' + projectID);
  }

  /**
   * Register Consumer
   * @param interface ConsumerProjectMilestone
   * @return Subscription
   */
  consumerProjectMileStoneUpdate(consumerMileStone: ConsumerProjectMilestone): Observable<any> {
    return this.sharedService.post(globals.APIS.CONSUMER_PROJECT_MILESTONE, consumerMileStone);
  }

  /**
   * Register Consumer
   * @return Subscription
   */
  requestSubmitSurveyorForm(request): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.POST_SURVEYOR_DATA + '/?irdi=' + currentEmpRoleId, request, { headers: this.headers });
    //return this.sharedService.post(globals.APIS.POST_SURVEYOR_DATA,request, { headers: this.headers });
  }

  /**
   * Register Consumer
   * @param interface Kart
   * @return Subscription
   */
  requestKartValue(kartValues: Kart): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');

    return this.sharedService.post(globals.APIS.KART_PROJECT_VALUE + '/?irdi=' + currentEmpRoleId, kartValues, { headers: this.headers });
  }

  pdfCreate(kartValues) {
    let project_id = kartValues.project_id;
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');

    //Function to send PDF create PDF Data internelly
    return this.sharedService.get(globals.APIS.CREATE_PDF + '/?irdi=' + currentEmpRoleId + '&project_id=' + project_id, { headers: this.headers });

  }

  /**
   * Get Lead info for cce
   * @param user_id number
   */
  getProjectDetailsForChecklists(projectId: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_PROJECT_DETAILS_FOR_CHECKLIST + '/' + projectId + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  getSoDesignerCharges(projectId: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_SO_DESIGNER_CHARGES + '/' + projectId + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  checklistSubmitServiceP(project_id, state, checklist_status): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.CHANGE_PROJECT_STATUS + '/' + project_id + '/' + state + '/' + checklist_status, { headers: this.headers });
  }

  checklistSubmitService(project_id, checklistSubmitForm, isTempSurveyor?): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId;
    if (!isTempSurveyor) {
      currentEmpRoleId = localStorage.getItem('role_id');
    } else {
      currentEmpRoleId = globals.ROLES.SITE_SURVEYOR;
    }
    return this.sharedService.post(globals.APIS.CHANGE_PROJECT_STATUS + '/' + project_id + '/?irdi=' + currentEmpRoleId, checklistSubmitForm, { headers: this.headers });
  }

  getUploadedDocuments(project_id, roleId, docTypes): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (docTypes != '') {
      return this.sharedService.get(globals.APIS.GET_UPLOADED_DOCS_FOR_EMP + '/' + project_id + '/' + roleId + '/' + docTypes + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_UPLOADED_DOCS_FOR_EMP + '/' + project_id + '/' + roleId + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
    }

  }

  /* Get Upload Document Master Data
   *  @return Subscription
   */
  getUploadMasterData(docIds) {
    let headers = new Headers({ 'Authorize': localStorage.getItem('emp_auth_key') });
    let options = new RequestOptions({ headers: headers });
    return this.sharedService.get(`${globals.APIS.GET_UPLOAD_MASTER_DATA}${localStorage.getItem('role_id')}` + '/?docIds=' + docIds, options);
  }

  auditFormDisplay() {
    return this.http.get('http://solarluminousapi.com/getSurveyFormData?sf_project_id=1&sf_consumer_id=3')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getPaymentList(type: string): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.get(`${globals.APIS.GET_PAYMENT_APPROVAL_LIST}/${type}`, { headers: this.headers });
  }

  savePaymentReleaseData(paymentData: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.post(`${globals.APIS.SAVE_RELEASE_DATA}`, paymentData, { headers: this.headers });
  }

  updatePaymentApproval(approvalData: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.post(`${globals.APIS.UPDATE_APPROVAL}`, approvalData, { headers: this.headers });
  }

  getEmployeeDataByRole(roleId): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.get(`${globals.APIS.EMPLOYEES_DATA_BY_ROLE}/${roleId}`, { headers: this.headers });
  }

  getPartnerDataByRole(roleId): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.get(`${globals.APIS.PARTNER_DATA_BY_ROLE}/${roleId}`, { headers: this.headers });
  }


  getReleaseRequestList(type: string): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.get(`${globals.APIS.GET_RELEASE_REQUEST_LIST}/${type}`, { headers: this.headers });
  }

  updatePaymentReleaseData(paymentData: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.post(`${globals.APIS.UPDATE_RELEASE_DATA}`, paymentData, { headers: this.headers });
  }

  getQueryList(page, pazesize): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.QUERY_LIST + '/?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pazesize, { headers: this.headers });
  }

  updateQuery(queryData): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.UPDATE_QUERY + '/?irdi=' + currentEmpRoleId, queryData, { headers: this.headers });
  }

  requestCCELeadSubmitForm(customerCareFormRequestDetails: any): Observable<any> {
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.CCE_LEAD_FORM_SUBMIT + '/?irdi=' + currentEmpRoleId, customerCareFormRequestDetails);
  }

  checkRoleExists(roleId) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.get(globals.APIS.CHECK_ROLE_EXISTS + '/?irdi=' + roleId, { headers: this.headers });
  }

  uploadBulkDocument(documentBase64: String, ext: String, extType: any) {
    let role_id = localStorage.getItem('role_id');
    let creater_id: number;
    let creater = JSON.parse(localStorage.getItem('userData'));
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.http.post(globals.APIS.LEAD_BULK_UPLOAD, { file: documentBase64, extension: ext, extension_type: extType }, { headers: this.headers }).map((res: Response) => res.json()).share();
  }
  searchProject(searchData) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.SEARCH_PROJECT + '/?irdi=' + currentEmpRoleId + '&qType=' + searchData.qType + '&q=' + searchData.q + '&pstatus=' + searchData.project_status, { headers: this.headers });
  }

  searchLead(searchData) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.SEARCH_LEAD + '/?irdi=' + currentEmpRoleId + '&qType=' + searchData.qType + '&q=' + searchData.q, { headers: this.headers });
  }

  projectStatusList() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.PROJECT_STATUS_LIST + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  revokeColdLead(coldBucketCommentForm: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.REVOKE_COLD_BUCKET_LEAD + '/?irdi=' + currentEmpRoleId, coldBucketCommentForm, { headers: this.headers });


  }

  saveCashPaymentDetails(cashDetailForm: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SAVE_CASH_PAYMENT + '/?irdi=' + currentEmpRoleId, cashDetailForm, { headers: this.headers });

  }

  createNewStripText(stripTextDetails: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.CREATE_STRIP_TEXT + '/?irdi=' + currentEmpRoleId, stripTextDetails, { headers: this.headers });
  }

  projectCloseReasonList() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.PROJECT_CLOSE_REASON + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  AddNewStatusForProject() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.ADD_PROJECT_STATUS + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  getSurveyNotVisitedReason() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.SUREVY_NOT_VISITED_REASON + '/?irdi=' + currentEmpRoleId, { headers: this.headers });

  }

  GetLeadsList() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_LEADS_SOURCE_LISTING + '/?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  DeleteLead(masterID) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.DELETE_LEADS_SOURCE + '?irdi=' + currentEmpRoleId + '&source_master_id=' + masterID, { headers: this.headers })
  }

  AddLeadSource(formData: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.post(globals.APIS.ADD_LEAD_SOURCE, formData, { headers: this.headers });
  }

  UpdateSource(formData: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.post(globals.APIS.UPDATE_LEAD_SOURCE, formData, { headers: this.headers });
  }

  CheckToggleStatus() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.TOGGLE_FOOTER_STRIP + '?irdi=' + currentEmpRoleId + '&status=check', { headers: this.headers })
  }

  ToggleFooterStrip() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.TOGGLE_FOOTER_STRIP + '?irdi=' + currentEmpRoleId, { headers: this.headers })
  }

  getPropsaEmaillData(projectId: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_PROPOSAL_EMAIL_DATA + '/' + projectId + '?irdi=' + currentEmpRoleId, { headers: this.headers })
  }
  getSiteSurveyByScheduleDate(formData: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SITE_SURVEY_BY_DATE + '/?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }
  getPincodeListing(page, pagesize, formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.PINCODE_LISTING + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.PINCODE_LISTING + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }
  removeLocality(localityID): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.REMOVE_LOCALITY + '?irdi=' + currentEmpRoleId + '&locality_id=' + localityID, { headers: this.headers });
  }
  addLocality(formData: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.ADD_LOCALITY, formData, { headers: this.headers });
  }
  updateLocality(formData: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.UPDATE_LOCALITY, formData, { headers: this.headers });
  }

  addAnnouncement(formData: any, irdi): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    return this.sharedService.post(globals.APIS.ADD_ANNOUNCEMENT + '?irdi=' + irdi, formData, { headers: this.headers });
  }

  getFollowUpListing(listType: String, page, pagesize, searchType?: String, searchField?: String, formData?: any, isExported?: any, isActionable?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let type = (searchType) ? searchType : '';
    let search = (searchField) ? searchField : '';
    let currentEmpRoleId = localStorage.getItem('role_id');
    console.log(JSON.stringify(formData))
    console.log(JSON.stringify('?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&listType=' + listType + '&export=' + isExported + '&isActionable=' + isActionable, formData,))
    if (formData) {
      return this.sharedService.post(globals.APIS.FOLLOW_UP_LISTING + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&listType=' + listType + '&export=' + isExported + '&isActionable=' + isActionable, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.FOLLOW_UP_LISTING + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&listType=' + listType + '&type=' + type + '&search=' + search + '&export=' + isExported + '&isActionable=' + isActionable, { headers: this.headers })
    }

  }
  getStatusList() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.FOLLOWUP_STATUS_LIST + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }
  updateCustomerDetailsFromLeadData(formData: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.UPADTE_CUSTOMER_DATA_FROM_CCELEAD_FOLLOWUP + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }
  getInteractionListingFollowup(fup_id) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.CUTOMER_INTERACTION_LISTING_FOLLOWUP + '/' + fup_id + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }
  customerEmailSmsNotification(data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SEND_CUSTOMER_EMAIL_SMS + '?irdi=' + currentEmpRoleId, data, { headers: this.headers })
  }
  updateFollowUpInteraction(formData: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.UPDATE_FOLLOWUP_INTERACTION + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }
  getProposalHistory(projectId: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_PROPOSAL_HISTORY + '/' + projectId + '?irdi=' + currentEmpRoleId, { headers: this.headers })
  }
  getLeadListStatus() {
    return this.sharedService.get(globals.APIS.LEAD_LIST_STATUS_MASTER);
  }

  panelsAndInvGetRequest(grid: string, mode: string, type: string, id?: number, page?: number, pagesize?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (id) {
      return this.sharedService.get(globals.APIS.PANEL_AND_INV + '/?grid=' + grid + '&mode=' + mode + '&type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
    } else {
      return this.sharedService.get(globals.APIS.PANEL_AND_INV + '/?grid=' + grid + '&mode=' + mode + '&type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  panelsAndInvPostRequest(grid: string, mode: string, type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.PANEL_AND_INV + '/?grid=' + grid + '&mode=' + mode + '&type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  panelbulkupload(grid: string, mode: string, type: string, documentBase64: String, ext: String, extType: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { file: documentBase64, extension: ext, extension_type: extType };
    return this.sharedService.post(globals.APIS.PANEL_AND_INV + '/?grid=' + grid + '&mode=' + mode + '&type=' + type + '&irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  dutyTaxesGet(type: string, id?: number, page?: number, pagesize?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (id) {
      return this.sharedService.get(globals.APIS.DUTY_TAXES + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
    } else {
      return this.sharedService.get(globals.APIS.DUTY_TAXES + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  dutyTaxesPost(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.DUTY_TAXES + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  fixedLookupGet(type: string, id?: number, page?: number, pagesize?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (id) {
      return this.sharedService.get(globals.APIS.FIXED_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
    } else {
      return this.sharedService.get(globals.APIS.FIXED_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }
  funnelManagementGet(type: string, id: number, page?: number, pagesize?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (id) {
      return this.sharedService.get(globals.APIS.FUNNEL_CONVERSION + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })

    }
    else {
      return this.sharedService.get(globals.APIS.FUNNEL_CONVERSION + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });

    }


  }

  fixedLookupPost(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.FIXED_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  funnelManagementPost(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.FUNNEL_CONVERSION + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  varLookupGet(type: string, id?: number, page?: number, pagesize?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (id) {
      return this.sharedService.get(globals.APIS.VAR_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
    } else {
      return this.sharedService.get(globals.APIS.VAR_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  varLookupPost(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.VAR_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  gbiLookupGet(type: string, id?: number, page?: number, pagesize?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (id) {
      return this.sharedService.get(globals.APIS.GBI_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
    } else {
      return this.sharedService.get(globals.APIS.GBI_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  gbiLookupPost(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.GBI_LOOKUP + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  ahGet(type: string, id?: number, page?: number, pagesize?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (id) {
      return this.sharedService.get(globals.APIS.AH_REFERENCE + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
    } else {
      return this.sharedService.get(globals.APIS.AH_REFERENCE + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  ahPost(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.AH_REFERENCE + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  /* Get the followup listing */
  followUpSmsEmailGet(type: string, id?: number, page?: number, pagesize?: number) {

    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    // console.log(type+'---'+currentEmpRoleId);
    if (id) {
      return this.sharedService.get(globals.APIS.FOLLOW_UP_EMAIL_SMS + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
    } else {
      return this.sharedService.get(globals.APIS.FOLLOW_UP_EMAIL_SMS + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  followUpSmsEmailPost(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.FOLLOW_UP_EMAIL_SMS + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }
  /**
  * Get Lead info for cce
  * @param user_id number
  */
  getRevisedProposalFromFollowupDetails(formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.REVISED_PROPOSAL_FROM_FOLLOW_UP + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.REVISED_PROPOSAL_FROM_FOLLOW_UP + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', { headers: this.headers });
    }
  }
  /* Get the Employee listing */
  getEmployeeList(type: string, id?: number, page?: number, pagesize?: number, form_data?: any, funnel?: number) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    //this.headers.append('Content-Type', 'application/json');
    let currentEmpRoleId = localStorage.getItem('role_id');
    // console.log(type+'---'+currentEmpRoleId);
    if (form_data) {
      return this.sharedService.post(globals.APIS.EMPLOYEE_MASTER + '/?type=' + type + '&irdi=' + currentEmpRoleId, form_data, { headers: this.headers })
    } else {
      if (id) {
        return this.sharedService.get(globals.APIS.EMPLOYEE_MASTER + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&id=' + id, { headers: this.headers })
      } else {
        return this.sharedService.get(globals.APIS.EMPLOYEE_MASTER + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&funnel=' + funnel, { headers: this.headers });
      }
    }

  }
  /*Add Employee */
  employeeAdd(type: string, data: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.EMPLOYEE_MASTER + '/?type=' + type + '&irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }
  /* Get the Role listing */
  getRoleList(type: string, id?: number, page?: number, pagesize?: number) {

    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let url = globals.APIS.ROLE_MASTER + '?type=' + type + '&irdi=' + currentEmpRoleId;
    url += (id) ? '&role_id=' + id : "";
    url += (page) ? '&page=' + page : "";
    url += (pagesize) ? '&page=' + pagesize : "";
    return this.sharedService.get(url, { headers: this.headers })

  }
  /* Get the Role listing */
  getSkillList(type: string, roleid?: number, page?: number, pagesize?: number) {

    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let url = globals.APIS.SKILL_MASTER + '?type=' + type + '&irdi=' + currentEmpRoleId;
    url += (roleid) ? '&roleid=' + roleid : "";
    url += (page) ? '&page=' + page : "";
    url += (pagesize) ? '&page=' + pagesize : "";
    return this.sharedService.get(url, { headers: this.headers })

  }



  /* Get the followup listing */
  getMissedCallLogs(type: string, page?: number, pagesize?: number, formData?: any) {

    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.MISSED_CALL_LOGS + '?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.MISSED_CALL_LOGS + '/?type=' + type + '&irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  /**
   * @description: get all rejection remark for search form of coldbucket to search by rejection
   * @developer: Roshan
   * _-_-_-_Krishna_-_-_-_-
   */
  getallRejectionRemark() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_ALL_REJECTION_REMARK + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  /**
   * @description: get all lead status from status master for colbucket search filter
   * @developer: Roshan
   * _-_-_-_Krishna_-_-_-_-
   */
  getallLeadStatus() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_ALL_LEAD_STATUS + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  /**
   * @description: get all roles of employee [currently]
   * @developer: Roshan
   * _-_-_-_Krishna_-_-_-_-
   */
  getEmpRoleMap(emp_id) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_ROLE_MAPING + '?irdi=' + currentEmpRoleId + '&emp_id=' + emp_id, { headers: this.headers });
  }


  /**
   * @description: Submit roles of employee [currently]
   * @developer: Roshan
   * _-_-_-_Krishna_-_-_-_-
   */
  submitEmpRoleMap(form_data) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SUBMIT_ROLE_MAP + '?irdi=' + currentEmpRoleId, form_data, { headers: this.headers });
  }




  sendProposalMail(project_id) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.SEND_PROPOSAL_EMAIL + '/' + project_id + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  createLeadFromMissedCall(mobile) {
    this.headers = new Headers();
    this.headers.append('authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.MISSED_CALL_CREATE_LEAD + '?irdi=' + currentEmpRoleId, { 'mobileNo': mobile }, { headers: this.headers });
  }

  savepartnerdata(form_data: any) {
    this.headers = new Headers();
    this.headers.append('authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.PARTNER_QUERY_DATA + '?irdi=' + currentEmpRoleId, form_data, { headers: this.headers });
  }
  moveToQueue() {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.LOCK_RELEASE_LEADS + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }

  selectProposalService(pdoc_id, value, type) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.SELECT_PROPOSALS + '/' + pdoc_id + '?irdi=' + currentEmpRoleId + '&active=' + value + '&type=' + type, { headers: this.headers });
  }

  getPartnerQuery(page?: number, pagesize?: number, formData?: any, isExported?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.GET_PARTNER_QUERY + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_PARTNER_QUERY + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported, { headers: this.headers });
    }
  }

  getPartnerQueryUser(page?: number, pagesize?: number, formData?: any, type?: any, isExported?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.GET_PARTNER_QUERY_USER + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&type=' + type + '&export=' + isExported, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_PARTNER_QUERY_USER + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&type=' + type + '&export=' + isExported, { headers: this.headers });
    }
  }

  getpartnerData(partner_id) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_PARTNER_QUERY + '?irdi=' + currentEmpRoleId + '&prt_id=' + partner_id, { headers: this.headers });
  }

  createLeadFromPartner(partner_id) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formdata = { "partner_id": partner_id };
    return this.sharedService.post(globals.APIS.CREATE_LEAD_FROM_PARTNER + '?irdi=' + currentEmpRoleId, formdata, { headers: this.headers });
  }

  submitPartnerQuery(formdata) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SUBMIT_PARTNER_QUERY + '?irdi=' + currentEmpRoleId, formdata, { headers: this.headers });
  }

  missedCallAction(missedCallId, type?: any) {
    this.headers = new Headers();
    this.headers.append('authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { 'missed_call_id': missedCallId, 'type': type };
    return this.sharedService.post(globals.APIS.MISSED_CALL_ACTION + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  /* Get all the CCE leads  */
  getAllCCELeadsData(page?: number, pagesize?: number, formData?: any, isExported: boolean = false) {

    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.CCE_LEAD_LISTING + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&exported=' + isExported, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.CCE_LEAD_LISTING + '/?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&exported=' + isExported, { headers: this.headers });
    }
  }

  getPartnerLogRemarksHistory(partner_id) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.PARTNER_LOG_HISTORY + '/?irdi=' + currentEmpRoleId + '&partner_id=' + partner_id, { headers: this.headers });
  }

  deletePdoc(pdoc_id) {
    this.headers = new Headers();
    this.headers.append('authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { 'pdoc_id': pdoc_id };
    return this.sharedService.post(globals.APIS.DELETE_PDOC + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  getRefrenceList(page?: any, pagesize?: any, formData?: any, isExported?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.GET_REFRENCE_LIST + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&exported=' + isExported, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_REFRENCE_LIST + '/?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&exported=' + isExported, { headers: this.headers });
    }
  }

  removeLeadRefrence(refrenceId) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { 'lead_refrence_id': refrenceId };
    return this.sharedService.post(globals.APIS.DELETE_REFRENCE + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  submitLeadRefrenceFrom(formData?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SUBMIT_LEAD_REFRENCE + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  getSurveyorHandOffListing(page?: any, pagesize?: any, formData?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.GET_SURVEYOR_HANDOFF_DATA + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_SURVEYOR_HANDOFF_DATA + '/?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize, { headers: this.headers });
    }
  }

  getHandOffData(projectId: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (projectId) {
      return this.sharedService.post(globals.APIS.GET_HANDOFF_DATA + '?irdi=' + currentEmpRoleId, { "project_id": projectId }, { headers: this.headers });
    }
  }

  submitHandoffdata(formData?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SUBMIT_HANDOFF_DATA + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }
  allocateprojectManager(formData?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SUBMIT_PM_Allocation + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  getAllocatedProjectList(formData?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.GET_ALLOCATED_PROJECTS_LIST_PM + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_ALLOCATED_PROJECTS_LIST_PM + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', { headers: this.headers });
    }
  }

  view_project_plan(h_id): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (h_id) {
      console.log('this.is inside the if block');
      return this.sharedService.post(globals.APIS.VIEW_PROJECT_PLAN + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', h_id, { headers: this.headers });
    } else {
      console.log('this.is inside the else block');
      return this.sharedService.get(globals.APIS.VIEW_PROJECT_PLAN + '?irdi=' + currentEmpRoleId + '&page=1&pagesize=20', { headers: this.headers });
    }
  }

  getFollowupIntration(projectId): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.get(globals.APIS.GET_FOLLOWUP_INTERACTION + '/' + projectId + '?irdi=' + currentEmpRoleId, { headers: this.headers });
  }


  getInsolationList(page?: number, pagesize?: number, formData?: any, isExported: boolean = false) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (empty(formData)) {
      return this.sharedService.get(globals.APIS.INSOLATION_OPS + '?irdi=' + currentEmpRoleId + '&type=list' + '&page=' + page + '&pagesize=' + pagesize + '&exported=' + isExported, { headers: this.headers });
    } else {
      return this.sharedService.post(globals.APIS.INSOLATION_OPS + '?irdi=' + currentEmpRoleId + '&type=list' + '&page=' + page + '&pagesize=' + pagesize + '&exported=' + isExported, formData, { headers: this.headers });
    }
  }

  submitInsolationFrom(formData?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.INSOLATION_OPS + '?irdi=' + currentEmpRoleId + '&type=addupdate', formData, { headers: this.headers });
  }

  removeInsolation(insolationId) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { 'insolation_id': insolationId };
    return this.sharedService.post(globals.APIS.INSOLATION_OPS + '?irdi=' + currentEmpRoleId + '&type=delete', formData, { headers: this.headers });
  }

  uploadBulkInsolation(documentBase64: String, ext: String, extType: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { file: documentBase64, extension: ext, extension_type: extType };
    return this.http.post(globals.APIS.INSOLATION_OPS + '?irdi=' + currentEmpRoleId + '&type=bulkupload', formData, { headers: this.headers }).map((res: Response) => res.json()).share();
  }


  getLeadsListing(page?: number, pagesize?: number, formData?: any, isExported?: any) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.LEADS_LISTING_CCE + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.LEADS_LISTING_CCE + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported, { headers: this.headers });
    }
  }

  updateLeadspriority(lead_id, status, leadsarray: any = []) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { 'lead_id': lead_id, 'status': status, 'leadsarray': leadsarray };
    return this.sharedService.post(globals.APIS.UPDATE_LEAD_PRIORITY + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  addUpdateSetting(name, value) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { 'name': name, 'value': value };
    return this.sharedService.post(globals.APIS.UPDATE_SETTING + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  getSetting(name) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    let formData = { 'name': name };
    return this.sharedService.post(globals.APIS.GET_SETTING + '?irdi=' + currentEmpRoleId, formData, { headers: this.headers });
  }

  rejectallocation(data) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (data.pid) {
      return this.sharedService.post(globals.APIS.REJECTALLOCATION + '?irdi=' + currentEmpRoleId + '&pid=' + data.pid, data, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.REJECTALLOCATION + '?irdi=' + currentEmpRoleId, { headers: this.headers });
    }
  }

  gethandofremark(h_id) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (h_id) {
      return this.sharedService.get(globals.APIS.GETHANDOFFREMARK + '?irdi=' + currentEmpRoleId + '&h_id=' + h_id, { headers: this.headers });
    }
  }

  getProjectsListing(page?: number, pagesize?: number, type?: string, formData?: any, isExported?: any, view: any = 'list') {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.GET_PROJECTS_LIST_PM + '?irdi=' + currentEmpRoleId + '&type=' + type + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported + '&view=' + view, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.GET_PROJECTS_LIST_PM + '?irdi=' + currentEmpRoleId + '&type=' + type + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported + '&view=' + view, { headers: this.headers });
    }
  }

  sendGlobalSms(formData): Observable<any> {
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SEND_SMS + "?irdi=" + currentEmpRoleId, formData, { headers: this.headers });
  }
  scriptexecution(): Observable<any> {
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.SCRIPT + "?irdi=" + currentEmpRoleId, { headers: this.headers });
  }

  getPaymentApproveList(page?: number, pagesize?: number, type?: string, formData?: any, isExported?: any, isWebForm?: any): Observable<any> {
    this.headers = new Headers();
    let currentEmpRoleId;
    if (isWebForm) {
      this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
      currentEmpRoleId = localStorage.getItem('webform_role_id');
    } else {
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      currentEmpRoleId = localStorage.getItem('role_id');
    }
    if (formData) {
      return this.sharedService.post(globals.APIS.PAYMENT_REQUEST_FINANCE + '?irdi=' + currentEmpRoleId + '&type=' + type + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.PAYMENT_REQUEST_FINANCE + '?irdi=' + currentEmpRoleId + '&type=' + type + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported, { headers: this.headers });
    }
  }

  getSspPaymentApproval(page?: number, pagesize?: number, type?: string, formData?: any, isExported?: any, isApproved?: any, isWebForm?: any): Observable<any> {
    this.headers = new Headers();
    let currentEmpRoleId;
    if (isWebForm) {
      this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
      currentEmpRoleId = localStorage.getItem('webform_role_id');
    } else {
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      currentEmpRoleId = localStorage.getItem('role_id');
    }
    return this.sharedService.post(globals.APIS.GET_SSP_PAYMENT_APPROVAL + '?irdi=' + currentEmpRoleId + '&type=' + type + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported + '&isApproved=' + isApproved, formData, { headers: this.headers });
  }

  getPaymentHistory(ptask_id): Observable<any> {
    this.headers = new Headers();
    let currentEmpRoleId;
    this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
    //currentEmpRoleId = localStorage.getItem('webform_role_id');
    currentEmpRoleId = 17;
    return this.sharedService.post(globals.APIS.GET_PAYMENT_HISTORY + '?irdi=' + currentEmpRoleId, { ptask_id: ptask_id }, { headers: this.headers });
  }

  getApprovedPaymentHistory(page, itemPerPage, data): Observable<any> {
    this.headers = new Headers();
    let currentEmpRoleId;
    this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
    //currentEmpRoleId = localStorage.getItem('webform_role_id');
    currentEmpRoleId = 17;
    return this.sharedService.post(globals.APIS.GET_APPROVED_PAYMENT_HISTORY + '?irdi=' + currentEmpRoleId + '&page=' + page + '&pagesize=' + itemPerPage, data, { headers: this.headers });
  }

  getPaymentApproveListNew(page?: number, pagesize?: number, type?: string, formData?: any, isExported?: any, exportFromDate?: any, exportToDate?: any): Observable<any> {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('role_id');
    if (formData) {
      return this.sharedService.post(globals.APIS.PAYMENT_REQUEST_FINANCE_NEW + '?irdi=' + currentEmpRoleId + '&type=' + type + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported, formData, { headers: this.headers });
    } else {
      return this.sharedService.get(globals.APIS.PAYMENT_REQUEST_FINANCE_NEW + '?irdi=' + currentEmpRoleId + '&type=' + type + '&page=' + page + '&pagesize=' + pagesize + '&export=' + isExported + '&selectFromDate=' + exportFromDate + '&selectToDate=' + exportToDate, { headers: this.headers });
    }
  }

  aproveSspPayrequest(data) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('webform_role_id');
    return this.sharedService.post(globals.APIS.APPROVE_SSP_PAY_REQUEST + '?irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  aproveSspPayrequestOpshead(data) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('webform_role_id');
    return this.sharedService.post(globals.APIS.APPROVE_SSP_PAY_REQUEST_OPSHEAD + '?irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  releasePaymentByFinanceteam(data) {
    this.headers = new Headers();
    this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
    let currentEmpRoleId = localStorage.getItem('webform_role_id');
    return this.sharedService.post(globals.APIS.RELEASE_REQUEST_BY_FINANCE + '?irdi=' + currentEmpRoleId, data, { headers: this.headers });
  }

  dashboardData(type, monthyear) {
    let formData = { 'type': type, 'monthyear': monthyear };
    let currentEmpRoleId = localStorage.getItem('role_id');
    return this.sharedService.post(globals.APIS.F_DASHBOARD + "?irdi=" + currentEmpRoleId, formData, { headers: this.headers });
  }

  getLatestAnnouncement() {
    return this.sharedService.get(globals.APIS.GET_LATEST_ANNOUNCEMENT);
  }

  approveOngoing(data, isWebForm?: any) {
    this.headers = new Headers();
    let currentEmpRoleId;
    if (isWebForm) {
      this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
      currentEmpRoleId = localStorage.getItem('webform_role_id');
    } else {
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      currentEmpRoleId = localStorage.getItem('role_id');
    }
    return this.sharedService.get(globals.APIS.APPROVE_ONGOING + '?irdi=' + currentEmpRoleId + '&pp_id=' + data.ppid + '&tt_id=' + data.ttid + '&type=' + data.type, { headers: this.headers });
  }

  testWebhook(data) {
    this.headers = new Headers();
    this.headers.append('authorize', 'kNK6TL3zYYtUIDEWeik4X0oAtrcvjm');
    return this.sharedService.post(globals.APIS.TEST_WEBHOOK, data, { headers: this.headers })
  }

}
