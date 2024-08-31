import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable'
import { LeadListService } from '../services/lead-list.service';
import { ProjectManagementService } from '../services/project-management.services'
import { FormsModule, FormBuilder, FormControl, Validators, FormGroup, FormArray ,ValidationErrors} from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { TIMES } from '../../../static/static';
import * as globals from '../../../static/static';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { SharedServices } from '../../../services/shared.services';
import {DatePipe} from '@angular/common';
import { map } from 'rxjs/operators';
import { audit } from 'rxjs/operator/audit';

@Component({
	selector: 'auditor',
	templateUrl: './auditor.component.html',
	styleUrls: [ '../../../../assets/css/bootstrap.min.css', './auditor.component.css']
})

export class AuditorPanel implements OnInit {
    audit1:FormGroup;
    instalationaudit:FormGroup;
    data: any;
    view: any;
    popup:any = false;
    audit: any = 
    {
        task_id:'',
        project_id:'',
        ptask_pp_id:'',
        h_id:'',
        ptask_ttid:'',
        audit2Checkbox:'',
        solar:{mod_type:{qty:'',make:'',status:'',remarks:''},
                mod_capacity:{qty:'',make:'',status:'',remarks:''},
                rfid:{qty:'',make:'',status:'',remarks:''},
                noofarray:{qty:'',make:'',status:'',remarks:''},
                arraywisevolt:{qty:'',make:'',status:'',remarks:''},
                shadow_panel:{qty:'',make:'',status:'',remarks:''}
                },
        inverter:{inverter_type:{qty:'',make:'',status:'',remarks:''},
              inverter_capacity:{qty:'',make:'',status:'',remarks:''}
                },
        battery:{battery_type:{qty:'',make:'',status:'',remarks:''},
               battery_capacity:{qty:'',make:'',status:'',remarks:''}
               },
        mms:{mms_type:{qty:'',make:'',status:'',remarks:''},
                galav_thick:{qty:'',make:'',status:'',remarks:''},
                str_thick_leg:{qty:'',make:'',status:'',remarks:''},
                str_thick_purlin:{qty:'',make:'',status:'',remarks:''},
                str_thick_cross:{qty:'',make:'',status:'',remarks:''},
                str_height_front:{qty:'',make:'',status:'',remarks:''},
                str_height_back:{qty:'',make:'',status:'',remarks:''},
                str_angle:{qty:'',make:'',status:'',remarks:''}
        },
        roof:{roof_type:{qty:'',make:'',status:'',remarks:''},
                str:{qty:'',make:'',status:'',remarks:''},
                blast_mounting:{qty:'',make:'',status:'',remarks:''},
                blast_size:{qty:'',make:'',status:'',remarks:''},
                blast_painted:{qty:'',make:'',status:'',remarks:''},
                blast_side:{qty:'',make:'',status:'',remarks:''},
        },
        hdw:{hdw_type:{qty:'',make:'',status:'',remarks:''},
            connector:{qty:'',make:'',status:'',remarks:''}
        },
        hdwcable:{hdw_type:{qty:'',make:'',status:'',remarks:''},
                      size:{qty:'',make:'',status:'',remarks:''},
                      certi:{qty:'',make:'',status:'',remarks:''},
                      ratedcap:{qty:'',make:'',status:'',remarks:''},
        },
        earthing:{nos:{qty:'',make:'',status:'',remarks:''},
            conductor:{qty:'',make:'',status:'',remarks:''},
            line:{qty:'',make:'',status:'',remarks:''},
            Connection:{qty:'',make:'',status:'',remarks:''},
            resistance:{qty:'',make:'',status:'',remarks:''},
        },
        cable:{cable_type:{qty:'',make:'',status:'',remarks:''},
                       uv:{qty:'',make:'',status:'',remarks:''},
                       lugs:{qty:'',make:'',status:'',remarks:''},
        },
    };

    audit3  =
    {
        task_id:'',
        project_id:'',
        project_code:'',
        ptask_pp_id:'',
        h_id:'',
        ptask_ttid:'',
        contact:'',
        size:'',
        sspfirmname:'',
        auditorname:'',
        address:'',
        customername:'',
        dc_capacity:'',
        inverter_capacity:'',
        installationdate: new Date(),
        time:'',
        date:'',
        arno:'',
        reportno:'',
        audit3Checkbox:'',
        LA:{lalocation:{qty:'',make:'',status:'',remarks:''},
              laheight:{qty:'',make:'',status:'',remarks:''},
              connectedstrip:{qty:'',make:'',status:'',remarks:''},
              stripsize:{qty:'',make:'',status:'',remarks:''},
              fixedstrip:{qty:'',make:'',status:'',remarks:''},
              tightness:{qty:'',make:'',status:'',remarks:''},
              resistance:{qty:'',make:'',status:'',remarks:''},
                },
        cable:{type:{qty:'',make:'',status:'',remarks:''},
               size:{qty:'',make:'',status:'',remarks:''},
               certi:{qty:'',make:'',status:'',remarks:''},
               capacity:{qty:'',make:'',status:'',remarks:''},
                },
        dcdb:{type:{qty:'',make:'',status:'',remarks:''},
              location:{qty:'',make:'',status:'',remarks:''},
              mcb:{qty:'',make:'',status:'',remarks:''},
              spd:{qty:'',make:'',status:'',remarks:''}
               },
        acdb:{type:{qty:'',make:'',status:'',remarks:''},
               location:{qty:'',make:'',status:'',remarks:''},
               mcb:{qty:'',make:'',status:'',remarks:''},
               spd:{qty:'',make:'',status:'',remarks:''}
                },
        generation:{monthly:{qty:'',make:'',status:'',remarks:''},
                     perday:{qty:'',make:'',status:'',remarks:''}
        },
        connectivity:{availability:{qty:'',make:'',status:'',remarks:''},
                           working:{qty:'',make:'',status:'',remarks:''}
        },
        dispatch:{dispatch:{qty:'',make:'',status:'',remarks:''}, },
        others:{others:{qty:'',make:'',status:'',remarks:''}, },
    };
    audit_type: number;
    audit_master = this.audit;
    audit_master3 = this.audit3;
    project_id: any;
    baseurl: any;
    ngOnInit(){
      this.AuditorListing();
      this.createAudit1Form();
      this.AuditorListingComplete();
      this.createInstallationAuditForm();
      this.baseurl = globals.API_BASE_URL;
    }

    constructor(
        private route: Router,
        private sharedServices: SharedServices,
        private alertService: AlertServices,
        private formBuilder: FormBuilder,
        private leadListService: LeadListService,
        private projectManagementService: ProjectManagementService,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService
    ) { }

    audit_task_type = {'24':'Audit 1','30':'Installation Audit','15':'After Installation'};
    auditor_pending_list:any;
    auditor_complete_list:any;
    AuditorListing(){
        this.view='listing';
        this.projectManagementService.getAuditorListing('pending').subscribe(data=>{
            if(data.status==1 && data.data !='NULL'){
                this.auditor_pending_list = data.data;
            }
        });
    }

    getAuditTypename(ptask_ttid:any=null){
        return this.audit_task_type[ptask_ttid];

    }
    
    AuditorListingComplete(){
        this.view='listing';
        this.projectManagementService.getAuditorListing('complete').subscribe(data=>{
            if(data.status==1 && data.data !='NULL' ){
                this.auditor_complete_list = data.data;
            }
        });
    }

    ptask_id:any;
    ptask_ttid:any;
    ptask_pp_id:any;
    project_code:any;
    h_id:any;
    ptask_miestone_id:any;
    audit1Form(ptask_id:any=null , ptask_ttid:any=null, ptask_pp_id:any=null ,project_code:any=null, h_id:any=null , ptask_miestone_id:any=null){
        //console.log(this.popup,this.view)
        this.popup='audit1';
        this.ptask_id =ptask_id;
        this.ptask_ttid =ptask_ttid;
        this.ptask_pp_id = ptask_pp_id;
        this.project_code = project_code;
        this.h_id = h_id;
        this.ptask_miestone_id = ptask_miestone_id;
        this.getUploadedDocumentsTask();
    }

    createAudit1Form(){

        this.audit1 = this.formBuilder.group({
            remarks:['',[Validators.required]],
            auditdate:['',[Validators.required]]
        })
    }
     
     currentDate:any= new Date();
    //save audit 1 data
     SaveAudit1data(){
         //console.log(this.audit1.value);
         if(this.audit1.valid){
            let dateobj_audit_date = this.sharedServices.getDateInFormat(this.audit1.value.auditdate);
            let dateobj_todaydate = this.sharedServices.getDateInFormat(this.currentDate);
            if(new Date(dateobj_audit_date).getTime() < new Date(dateobj_todaydate).getTime()){
              this.popupMessageService.showError('Audit date can not less than the current date', "Error!");
              return false;
            }

            let send_formdata = {'task_id':this.ptask_id , 'project_id':this.project_code , 'ptask_pp_id':this.ptask_pp_id, 'h_id':this.h_id, 'ptask_ttid':this.ptask_ttid };
             let finaljson = new Array();
             finaljson.push(send_formdata);
             finaljson.push(this.audit1.value)
            //console.log(finaljson);
            this.projectManagementService.SaveAudit1Data(finaljson).subscribe((data) => {
                if(data.status ==1){
                this.popupMessageService.showSuccess("Audit submit successfully", "Success!");
                this.auditor_pending_list = null;
                this.auditor_complete_list = null;
                this.AuditorListing();
                this.AuditorListingComplete();
                this.popup='';

                }else{
                this.popupMessageService.showError('Something went wrong', "Server Error!");
                }

            }) ;
 
         }else{
          this.popupMessageService.showError('Date and Remarks are required', "Error!");
           console.log('audit form not valid');
         }


     }

     handleFilesDropped(event: any, task_id:any,hid:any=null, ptask_miestone_id:any=null, pp_id:any=null ,ptask_ttid:any=null) {
        let eventAsSelectfile = {'target': {'files': event}};
        this.fileChange(eventAsSelectfile,task_id,hid, ptask_miestone_id, pp_id, ptask_ttid);
    }

    // end of save audit 1 data
   imageDocsIssues:string = '';
    fileChange(event: any, task_id:any,hid:any=null, ptask_miestone_id:any=null, pp_id:any=null,ptask_ttid:any=null) {
        
         //console.log(task_id, 'taskid');
         if (localStorage.getItem('emp_auth_key')) {
              let eventClone = event;
              let documentName = eventClone.target.files[0].name;//'taskDoc'+task_id;
              let extType = event.target.files[0].type;
              let ext = eventClone.target.files[0].name.split('.').pop();
                this.sharedServices.docsToBase64(event, ["pdf", "doc", "docx", "msword", "xls", "xlsx", "csv", "jpeg", "jpg", "png", "PDF", "DOC", "DOCX", "XLS", "XLSX", "CSV", "JPEG", "JPG", "PNG"]).then(data => {
                        this.imageDocsIssues = '';
                         this.sharedServices.uploadTaskDocument(hid, ptask_ttid, pp_id, ptask_miestone_id, documentName, String(data), ext, extType, 'audit_material').subscribe(data => {
                            if (data.status == 1) {
                               this.getUploadedDocumentsTask(task_id);

                                this.popupMessageService.showSuccess("File Uploaded Successfully", "Success!");

                               // this.actionLoader = '';
                                
                            } else if (data.error_code != 0) {
                                this.popupMessageService.showError(data.error_message, "Error!");
                            }
                        });
                    }).catch(data => {
                        this.popupMessageService.showError(data, "Invalid File Type!");
                        //this.alertService.error(data);
                    });

                
            } 
             else {
            this.route.navigateByUrl('/employee/login');
          }
    }
   
    //get uploaded doc of audit 1 task
    projectDocuments: any;
    getUploadedDocumentsTask(ptask_id:any=null) {
        let h_id = this.h_id;
        let task_id = this.ptask_ttid;
        if (localStorage.getItem('emp_auth_key')) {
            this.projectDocuments = [];
             this.projectManagementService.getUploadedDocumentsTask_Auditwise(h_id, task_id).subscribe(data => {
                if (data.status == 1) {
                    this.projectDocuments = data.data;
                }else{
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            });
        } else {
            this.route.navigateByUrl('/employee/login');
        }

    }
   //end of get uploaded doc of audit 1 task
  ConfirmDeleting:boolean=false;
  pdoc_data:any;
   confirmDeleteTaskDoc(data,handoff:any=null){ //console.log(data);
    this.ConfirmDeleting = true;
    this.h_id=handoff;
    this.pdoc_data = data;

  }
   hideConfirmDeleting(){
        this.ConfirmDeleting = false;
    }

   DeleteTaskDocument(pdoc_data,hid:any=null){  //console.log(pdoc_data);
        let tdoc_id = pdoc_data.tdoc_id;
        this.projectManagementService.deleteTaskPdoc(tdoc_id).subscribe((data)=>{
            if(data.status==1){
                this.ConfirmDeleting = false;
                this.getUploadedDocumentsTask(pdoc_data.tdoc_task_id);
                this.popupMessageService.showInfo('Document Removed','!Info');
            } else {
                this.ConfirmDeleting = false;
                this.popupMessageService.showInfo('Document Removed failed','!Info');
            }
        });
    }


    audit2Form(ptask_id:any=null , ptask_ttid:any=null, ptask_pp_id:any=null ,project_id:any=null, h_id:any=null , ptask_miestone_id:any=null){
        
        this.resetAuditData();
        this.view='audit2';
        this.ptask_id =ptask_id;
        this.ptask_ttid =ptask_ttid;
        this.ptask_pp_id = ptask_pp_id;
        this.project_id = project_id;
        this.h_id = h_id;
        this.ptask_miestone_id = ptask_miestone_id;
        this.audit_type=2;
        this.getInstallationAuditTaskData();
        this.getUploadedDocumentsTask(ptask_id);
    }

    audit3Form(task_id:any=null , ptask_ttid:any=null, ptask_pp_id:any=null ,project_id:any=null , project_code:any=null, h_id:any=null , ptask_miestone_id:any=null){
        
        this.resetAuditData();
        this.view='audit3';
        this.ptask_id =task_id;
        this.ptask_ttid =ptask_ttid;
        this.ptask_pp_id = ptask_pp_id;
        this.project_id = project_id;
        this.project_code = project_code;
        this.h_id = h_id;
        this.ptask_miestone_id = ptask_miestone_id;
        this.audit_type=3;
        this.getInstallationAuditTaskData();
        this.getUploadedDocumentsTask(task_id);
    }
   
   //back to auditor listing
   BackAuditorListing(){
    this.auditor_pending_list = null;
    this.auditor_complete_list = null;
    this.AuditorListing();
    this.createAudit1Form();
    this.AuditorListingComplete();
    this.createInstallationAuditForm();
   }
   //end of back to auditor listing
   
   //save instalation audit data
   createInstallationAuditForm(){
        this.instalationaudit = this.formBuilder.group({
          solar_pv_qty1:['',[Validators.required]],
          solar_pv_make1:['',[Validators.required]],
          solar_pv_status1:['',[Validators.required]],
          solar_pv_remarks1:['',[Validators.required]],  
          solar_pv_qty2:['',[Validators.required]],
          solar_pv_make2:['',[Validators.required]],
          solar_pv_status2:['',[Validators.required]],
          solar_pv_remarks2:['',[Validators.required]],
          reason_rejection:['',[Validators.required]],
          task_id:[this.ptask_id],
          project_id:[this.project_id],
          project_code:[this.project_code],
          ptask_pp_id:[this.ptask_pp_id],
          h_id:[this.h_id],
          ptask_ttid:[this.ptask_ttid]
        })
    }

    SaveAudit2Form(savetype:any=null){
       this.audit.task_id = this.ptask_id;
       this.audit.project_id = this.project_id;
       this.audit.ptask_pp_id = this.ptask_pp_id;
       this.audit.h_id= this.h_id;
       this.audit.ptask_ttid = this.ptask_ttid;
      if(this.audit){
            this.projectManagementService.SaveInstallationAuditData(this.audit, savetype, 2).subscribe((data) => {
                if(data.status ==1){
                this.popupMessageService.showSuccess(data.data, "Success!");
                this.BackAuditorListing();
                this.popup='';
                }else{
                this.popupMessageService.showError('Something went wrong', "Server Error!");
                }
            }) ;
         }else{
           console.log('installation audit form not valid');
         }  
   }

   SaveAudit3Form(savetype:any=null){
    this.audit3.task_id = this.ptask_id;
    this.audit3.project_id = this.project_id;
    this.audit3.project_code = this.project_code;
    this.audit3.ptask_pp_id = this.ptask_pp_id;
    this.audit3.h_id= this.h_id;
    this.audit3.ptask_ttid = this.ptask_ttid;
    //console.log(this.audit3); 
   if(this.audit3){
         this.projectManagementService.SaveInstallationAuditData(this.audit3, savetype, 3).subscribe((data) => {
             if(data.status ==1){
             this.popupMessageService.showSuccess(data.data, "Success!");
             this.BackAuditorListing();
             this.popup='';
             }else{
             this.popupMessageService.showError('Something went wrong', "Server Error!");
             }
         }) ;
      }else{
        console.log('Audit form not valid');
      }  
}

   //get data of installation audit form
   project_data:any;
    getInstallationAuditTaskData(){
        let send_data = {'project_id':this.project_id , 'task_id':this.ptask_id,'audit_type':this.audit_type };  
        this.projectManagementService.getInstallationAuditTaskData(send_data).subscribe((data) => {
             if(data.status==1){
                  if(data.data.audit.jsondata && this.audit_type==2 && data.data.audit.jsondata != 'null'){
                        this.audit = JSON.parse(data.data.audit.jsondata);
                    } else if(this.audit_type==3){
                        if(data.data.audit.jsondata && data.data.audit.jsondata != 'null'){
                        this.audit3 = JSON.parse(data.data.audit.jsondata);
                       this.audit3.installationdate = (this.audit3.installationdate)? new Date(this.audit3.installationdate): new Date();
                       }
                       
                        this.project_data = data.data.project_detail[0];
                       // console.log(this.project_data.proposalDetails);
                        if(this.project_data.proposalDetails.proposal_solution_type == 1){
                            this.audit3.inverter_capacity = this.project_data.proposalDetails.proposal_inverter_quantity + ' Nos. ' + this.project_data.proposalDetails.proposal_inverter_rating+' Kw' + 'GTI Inverter';
                            } else {
                                this.audit3.inverter_capacity= this.project_data.proposalDetails.proposal_inverter_quantity+'*'+this.project_data.proposalDetails.proposal_inverter_rating+' Kw ' + this.project_data.proposalDetails.inverter_voltage +'V Solar PCU';
                            }
                        this.audit3.customername=this.project_data.cceLeaddata.cceld_firstname+' '+this.project_data.cceLeaddata.cceld_lastname;
                        this.audit3.contact=this.project_data.cceLeaddata.cceld_contactnumber;
                        this.audit3.sspfirmname=this.project_data.partner_name;
                        this.audit3.auditorname=this.project_data.auditor_name;
                        this.audit3.address=this.project_data.cceLeaddata.cceld_address1+' '+this.project_data.cceLeaddata.cceld_address2+' '+this.project_data.district_name+' '+this.project_data.state_name;
                        this.audit3.dc_capacity=this.project_data.proposalDetails.proposal_dc_capacity+' KW';
                        this.audit3.time=this.sharedServices.getDateInFormat(this.audit.created_on);
                        this.audit3.date=this.sharedServices.getTimeInFormat(this.audit.created_on);
                        this.audit3.arno=this.audit.audit_code;
                        // this.audit3.time='';
                        // this.audit3.date='';
                        // this.audit3.arno='';
                        this.audit3.project_code = this.project_data.consumerProject.project_code;
                        this.audit3.size = this.project_data.proposalDetails.proposal_dc_capacity;
                        this.audit3.auditorname = this.project_data.auditor_name;
                        this.audit3.sspfirmname = this.project_data.partner_name;
                        this.audit3.arno = data.data.audit.audit_code;
                        this.audit3.reportno = data.data.audit.audit_id;
                        let pipe = new DatePipe('en-US');
                        this.audit3.time = pipe.transform(data.data.audit.created_on, 'HH:mm');
                        this.audit3.date = pipe.transform(data.data.audit.created_on, 'dd/MM/yyyy');

                    
                } 
            }else {
                this.audit = this.audit_master;
                this.audit3 = this.audit_master3;
            }
                
            
            //  if(data.status==1){
            //    this.taskname = data.data.taskname;
            //    this.formdata = data.data.taskinfo;
            //    if(data.data.taskinfo.ptask_status ==1){
            //     this.showactualenddate= true;
            //    }
            //   (this.formdata.ptask_remark)?this.taskUpdate.controls.remarks.setValue(this.formdata.ptask_remark):'';
            //   (this.formdata.taskstartdate!='')?this.taskUpdate.controls.actualstartdate.setValue(new Date(this.formdata.taskstartdate)):this.taskUpdate.controls.actualstartdate.setValue('');
            //   (this.formdata.taskenddate!='')?this.taskUpdate.controls.actualenddate.setValue(new Date(this.formdata.taskenddate)):this.taskUpdate.controls.actualenddate.setValue('');
            //   (this.formdata.ptask_status)?this.taskUpdate.controls.status.setValue(this.formdata.ptask_status):'';

            //  }else{
            //    this.taskname = '';
            //  }

        });


    }
   //end of get data of installation audit form 

   //reset audit Form
    resetAuditData(){
       this.audit = this.audit_master;
    }

    prevListing = '';
	projectDetailData:any;
	handoff_id:any;
	ProjectDetailView(h_id,project_id){
	 
		 if (localStorage.getItem('emp_auth_key')) {
				 this.projectManagementService.getProjectDetail(h_id, project_id).subscribe((data)=>{
						 if(data.status==1){
								 this.handoff_id = h_id;
								 this.prevListing = this.view;
								 this.view = "view_project_detail";
							 this.projectDetailData=data.data[0];
							// console.log(this.projectDetailData, 'roshan projct detail')
						 }
				 });
	 
	 } else {
			 this.route.navigateByUrl('/employee/login');
	 }
	 
	}

	CloseProjectDetail(){
		this.view = this.prevListing;
		this.prevListing = '';
 }


}