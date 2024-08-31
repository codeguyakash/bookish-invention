import { Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
//sudo nimport { Router } from '@angular/router'
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { SharedServices } from './../../../services/shared.services';
import * as globals from './../../../static/static';

@Injectable()
export class ProjectManagementService {
    headers: any;
    constructor(
        private http: Http,
        private sharedService: SharedServices
    ) { }

    getProjectManagementList(type:any,formData?:any,view:any='list'): Observable<any>{
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(formData) {
            return this.sharedService.post(globals.APIS.GET_PROJECTS_LIST_PM + '?irdi='+currentEmpRoleId+'&type='+type+'&page=1&pagesize=10'+'&view='+view,formData, { headers: this.headers });
          } else {
            return this.sharedService.get(globals.APIS.GET_PROJECTS_LIST_PM + '?irdi='+currentEmpRoleId+'&type='+type+'&page=1&pagesize=10'+'&view='+view, { headers: this.headers });
          }
    }


    AcceptAssignedProject(hid:any , formData:any) : Observable<any> {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(formData) {
            return this.sharedService.post(globals.APIS.ACCEPT_REJECT_PM + '?irdi='+currentEmpRoleId+'&h_id='+hid,formData, { headers: this.headers });
          }


    }
    submitCalenderdata(formData?:any){
      this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(formData) {
            return this.sharedService.post(globals.APIS.SUBMIT_CALENDER_PM + '?irdi='+currentEmpRoleId,formData, { headers: this.headers });
          } else {
            return this.sharedService.get(globals.APIS.SUBMIT_CALENDER_PM + '?irdi='+currentEmpRoleId, { headers: this.headers });
          }
    }

    submitMilestoneCalendar(formData){
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        return this.sharedService.post(globals.APIS.SUBMIT_MILESTONE_CALENDAR + '?irdi='+currentEmpRoleId,formData, { headers: this.headers });

    }
    getprojectplan(project_id,gridtype){
      this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(project_id) {
            return this.sharedService.get(globals.APIS.GETPROJECTPLAN + '?irdi='+currentEmpRoleId+'&project_id='+project_id+'&gridtype='+gridtype, { headers: this.headers });
          }
    }

    submitTaskdata(formData, isWebForm?:any){
      this.headers = new Headers();
      let currentEmpRoleId;
      if(isWebForm) {
        this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('webform_role_id');
      } else {
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('role_id');
      }
      return this.sharedService.post(globals.APIS.SUBMIT_TASK_DATA + '?irdi='+currentEmpRoleId,formData, { headers: this.headers });

    }

    submitTaskdataLegacy(formData, isWebForm?:any){
      this.headers = new Headers();
      let currentEmpRoleId;
      if(isWebForm) {
        this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('webform_role_id');
      } else {
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('role_id');
      }
      return this.sharedService.post(globals.APIS.SUBMIT_TASK_DATA_LEGACY + '?irdi='+currentEmpRoleId,formData, { headers: this.headers });

    }

    submitTaskdataOld(formData, isWebForm?:any){
      this.headers = new Headers();
      let currentEmpRoleId;
      if(isWebForm) {
        this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('webform_role_id');
      } else {
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('role_id');
      }
      return this.sharedService.post(globals.APIS.SUBMIT_TASK_DATA_OLD + '?irdi='+currentEmpRoleId,formData, { headers: this.headers });

    }

    getUploadedDocumentsTask(h_id, task_id, isWebForm?): Observable<any> {
      this.headers = new Headers();
      let currentEmpRoleId;
      if(isWebForm) {
        this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('webform_role_id');
      } else {
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('role_id');
      }
       return this.sharedService.get(globals.APIS.GET_UPLOADED_DOCS_FOR_TASK + '/' + task_id + '/' + h_id + '/?irdi=' + currentEmpRoleId, { headers: this.headers });

    }

    getUploadedDocumentsTask_Auditwise(h_id, task_id): Observable<any> {
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
       return this.sharedService.get(globals.APIS.GET_UPLOADED_DOCS_FOR_TASK_AUDITWISE + '/' + task_id + '/' + h_id + '/?irdi=' + currentEmpRoleId, { headers: this.headers });

    }

    getmilestonetasks(pp_id,milestone_id, tt_id?, project_id?, isWebForm?:any){
      this.headers = new Headers();
      let currentEmpRoleId;
      if(isWebForm) {
        this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('webform_role_id');
      } else {
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('role_id');
      }
      if(pp_id && milestone_id) {
          return this.sharedService.get(`${globals.APIS.GETMILESTONETASKS}?irdi=${currentEmpRoleId}&pp_id=${pp_id}&mile=${milestone_id}&tt_id=${tt_id}&project_id=${project_id}`, { headers: this.headers });
        }
    }

    getmilestonetasksLegacy(pp_id,milestone_id, tt_id?, project_id?, isWebForm?:any){
      this.headers = new Headers();
      let currentEmpRoleId;
      if(isWebForm) {
        this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('webform_role_id');
      } else {
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('role_id');
      }
      if(pp_id && milestone_id) {
          return this.sharedService.get(`${globals.APIS.GETMILESTONETASKS_LEGACY}?irdi=${currentEmpRoleId}&pp_id=${pp_id}&mile=${milestone_id}&tt_id=${tt_id}&project_id=${project_id}`, { headers: this.headers });
        }
    }

    SubmitmilestoneongoingProject(hid) : Observable<any> {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(hid) {
            return this.sharedService.get(globals.APIS.SUBMIT_ONGOING_PROJECT + '?irdi='+currentEmpRoleId+'&h_id='+hid, { headers: this.headers });
          }


    }

    gethandofremark(h_id){
      this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(h_id) {
            return this.sharedService.get(globals.APIS.GETHANDOFFREMARK + '?irdi='+currentEmpRoleId+'&h_id='+h_id, { headers: this.headers });
          }
    }

    getProjectDetail(h_id,project_id){
      this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(h_id) {
            return this.sharedService.get(globals.APIS.GETPROJECTDETAIL + '?irdi='+currentEmpRoleId+'&h_id='+h_id+'&project_id='+project_id, { headers: this.headers });
          }
    }

    Sendsms_task_notification(task_id, h_id , projectplan_id, milestone_id){
       this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(h_id) {
            return this.sharedService.get(globals.APIS.SENDTASKNOTIFICATION + '?irdi='+currentEmpRoleId+'&h_id='+h_id+'&task_id='+task_id+'&projectplan_id='+projectplan_id+'&milestone_id='+milestone_id, { headers: this.headers });
          }


    }

    Sendemail_task_notification(task_id, h_id , projectplan_id, doc_id, milestone_id){
       this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(h_id) {
            return this.sharedService.get(globals.APIS.SENDEMAILTASKNOTIFICATION + '?irdi='+currentEmpRoleId+'&h_id='+h_id+'&task_id='+task_id+'&projectplan_id='+projectplan_id+'&doc_id='+doc_id+'&milestone_id='+milestone_id, { headers: this.headers });
          }
    }

    getTaskLog(ptask_id){
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
      if(ptask_id) {
          return this.sharedService.get(globals.APIS.GET_TASK_LOGS + '?irdi='+currentEmpRoleId+'&ptask_id='+ptask_id, { headers: this.headers });
        }
    }

    get_task_allocated(hid){
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
      if(hid) {
          return this.sharedService.get(globals.APIS.GET_TASK_ALLOCATED + '?irdi='+currentEmpRoleId+'&hid='+hid, { headers: this.headers });
        }
    }

    deleteTaskPdoc(tdoc_id, isWebForm?:any){
      this.headers = new Headers();
      let currentEmpRoleId;
      if(isWebForm) {
        this.headers.append('Authorize', localStorage.getItem('webform_emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('webform_role_id');
      } else {
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        currentEmpRoleId = localStorage.getItem('role_id');
      }
        let formData = {'tdoc_id':tdoc_id};
        return this.sharedService.post(globals.APIS.DELETE_TASKPDOC +'?irdi='+currentEmpRoleId,formData, {headers: this.headers});
    }


     Notify_task_toPartner(task_id, h_id , projectplan_id, milestone_id){
       this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(h_id) {
            return this.sharedService.get(globals.APIS.NOTIFY_TASK_PARTNER + '?irdi='+currentEmpRoleId+'&h_id='+h_id+'&task_id='+task_id+'&projectplan_id='+projectplan_id+'&milestone_id='+milestone_id, { headers: this.headers });
          }
    }

    getAuditorListing(listing_type) {
      this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
        let currentEmpRoleId = localStorage.getItem('role_id');
        if(currentEmpRoleId) {
            return this.sharedService.get(globals.APIS.GET_AUDITOR_LISTING + '?irdi='+currentEmpRoleId+'&listing_type='+listing_type, { headers: this.headers });
          }
    }

    SaveAudit1Data(formData:any){
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
      return this.sharedService.post(globals.APIS.SAVE_AUDIT_TASK_DATA+ '?irdi='+currentEmpRoleId , formData, { headers: this.headers });

    }

     SaveInstallationAuditData(formData:any, savetype:any, audit_type:any){
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
      return this.sharedService.post(globals.APIS.SAVE_INSTALLATIONAUDIT_TASK_DATA+ '?irdi='+currentEmpRoleId+'&savetype='+savetype+'&audit_type='+audit_type , formData, { headers: this.headers });

    }

    getInstallationAuditTaskData(send_data:any){
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
      return this.sharedService.post(globals.APIS.GET_INSTALLATIONAUDIT_TASK_DATA+ '?irdi='+currentEmpRoleId , send_data, { headers: this.headers });

    }

     shufflePaymentInstallationViewPlan(task,gridtype){
      let  PaymentCollection3thtranche=task.findIndex(x=>x.Milestone.plnm_id==="7")
      if(PaymentCollection3thtranche!==-1){
        let modified=task.splice(PaymentCollection3thtranche,1)
        let inserted=task.findIndex(x=>x.Milestone.plnm_id ==="6")
        task.splice(inserted,0,modified[0])
      }
    }

    shufflePaymentInstallationProjectDetail(taskData,gridtype){
    let PaymentCollection3rdtrancheid=taskData.findIndex(x=>x.projectPlan.pp_milestone_id === "7")
      if(PaymentCollection3rdtrancheid !==-1){
        let removePayment=taskData.splice(PaymentCollection3rdtrancheid,1)
        let insertedindex=taskData.findIndex(x=>x.projectPlan.pp_milestone_id ==="6")
        taskData.splice(insertedindex,0,removePayment[0])
      }
    }

    // modify viewplan data
    transformprojectplan(task,gridtype){
      if(gridtype ==="1"){
       let  PaymentCollection4thtranche=task.findIndex(x=>x.Milestone.plnm_id==="11")
       if(PaymentCollection4thtranche!==-1){
         let modified=task.splice(PaymentCollection4thtranche,1)
         let inserted=task.findIndex(x=>x.Milestone.plnm_id ==="10")
         task.splice(inserted,0,modified[0])
        }

       this.shufflePaymentInstallationViewPlan(task,gridtype)
      }

      if(gridtype === "2"){
      this.shufflePaymentInstallationViewPlan(task,gridtype)
      }

    }

    // modifyprojectDetailData
    transformProjectDetailData(taskData,gridtype){
      if(gridtype ==="1"){
      let PaymentCollection4thtrancheid =	taskData.findIndex(x=>x.projectPlan.pp_milestone_id==="11")
      if(PaymentCollection4thtrancheid !==-1){
      let inserted=taskData.findIndex(x=>x.projectPlan.pp_milestone_id==="10")
      let removed=taskData.splice(PaymentCollection4thtrancheid,1)
      taskData.splice(inserted,0,removed[0])
      }
      this.shufflePaymentInstallationProjectDetail(taskData,gridtype)
      }

      if(gridtype ==="2"){
        this.  shufflePaymentInstallationProjectDetail(taskData,gridtype)

      }
    }

    SaveSupplyOrderData(formData:any){
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
      return this.sharedService.post(globals.APIS.SAVE_SUPPLYORDER+ '?irdi='+currentEmpRoleId , formData, { headers: this.headers });

    }

    SaveSupplyOrderDraft(formData:any){
      this.headers = new Headers();
      this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
      let currentEmpRoleId = localStorage.getItem('role_id');
      return this.sharedService.post(globals.APIS.SAVE_SUPPLYORDER_DRAFT+ '?irdi='+currentEmpRoleId , formData, { headers: this.headers });

    }


}
