import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable'
import { LeadListService } from '../services/lead-list.service';
import { ProjectManagementService } from '../services/project-management.services'
import { FormBuilder, FormControl, Validators, FormGroup, FormArray ,ValidationErrors} from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { TIMES } from '../../../static/static';
import * as globals from '../../../static/static';
import { PopupMessageService } from './../../../modules/message/services/message.service';
import { SharedServices } from '../../../services/shared.services';
import {DatePipe} from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
	selector: 'project-manager-view',
	templateUrl: './project-manager-view.component.html',
	styleUrls: [ '../../../../assets/css/bootstrap.min.css' , './project-manager-view.component.css']
})
export class ProjectManagerViewPanel implements OnInit {
	activetask: any;
	userData:any;
	isView:any;
	showSmartSearchComponent: Boolean = true;
	isListing:any;
	currentHandOffData: any;
	projectplan: any;
	calender: any;

	//for view more task 
	task_num : any ='0';
	taskForm: FormGroup;
	currentDate:any= new Date();
	tasksdata: any;
	doc_id: any;
	showactualenddate: any;
	actionLoader: any;
	projectDocuments: any;
	subscription: Subscription;
	paginationSubmitForm: FormGroup;
	pages: any;
	smartSearchFormData: any;
	projects: string;
	totalItem: any;
	pageCount: number;
	itemPerPage: any=10;
	searchResult: any;
	handoff_data: any;
	currentProjectId: any;
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

	baseurl:any;
	ngOnInit() { 
		this.getOngoingProjectList();
		this.createPaginationSubmitForm();
		this.baseurl = globals.API_BASE_URL;
	}

	ongoingProjects: any;
    getOngoingProjectList() {
				this.ResetSmartSearchForm()
        this.userData = JSON.parse(localStorage.getItem('userData'));
        if (localStorage.getItem('emp_auth_key')) {
						this.isView = '';
            this.projectManagementService.getProjectManagementList('ongoing','','view-only').subscribe(data=>{
                if(data.status ==1 || data.status ==0 ){
                   //this.ongoingProjects = data.projectList;
                    this.isListing = 'ongoing_project_listing';
										let ongoingproject_list =[];
										this.ongoingProjects = [];
                    let hdata ='';
                     if( data.status ==1 ){
                        data.result.data.forEach(function (value) {
                        hdata = JSON.parse(value.handOff.h_data);
                          value.handOff.h_data = hdata[0]
                          ongoingproject_list.push(value);
						});
						this.totalItem = data.result._meta.total_records;
						this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
						this.pages = 1;
						this.createPaginationSubmitForm();
                     }
                    this.ongoingProjects = ongoingproject_list;
					this.sharedServices.view_type.next('pm_view');
					this.sharedServices.searchForm.next('ongoing');
                    this.sharedServices.project_type.next('ongoing');
                    this.showSmartSearchComponent = true;
                } else {
                    this.popupMessageService.showError('Can not Load data','Error');
                }
                
            })
        } else {
            this.route.navigateByUrl('/employee/login');
        }
	}
	
	completedProjectlist: any;
    getCompletedProjectList(){
          this.ResetSmartSearchForm();
          if (localStorage.getItem('emp_auth_key')) {
            this.projectManagementService.getProjectManagementList('completed','','view-only').subscribe(data=>{
                if(data.status ==1 || data.status ==0 ){
                    this.isListing = 'completed_project_listing';
										this.isView = '';
										this.completedProjectlist=[];
                     
                    let completedproject_list =[];
                    let hdata ='';
                    if( data.status ==1 ){
                        data.result.data.forEach(function (value) {
                        hdata = JSON.parse(value.handOff.h_data);
                          value.handOff.h_data = hdata[0]
                          completedproject_list.push(value);
						});
						this.totalItem = data.result._meta.total_records;
						this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
						this.pages = 1;
						this.createPaginationSubmitForm();
                    }
                    this.completedProjectlist = completedproject_list;
					this.sharedServices.view_type.next('pm_view');
					this.sharedServices.searchForm.next('completed');
                    this.sharedServices.project_type.next('completed');
                    this.showSmartSearchComponent = true;

                } else {
                    this.popupMessageService.showError('Can not Load data','Error');
                }
                
            })
            } else {
                this.route.navigateByUrl('/employee/login');
            }

	}

	allocateProjectList: any;
	getAllocatedProject(){
			this.ResetSmartSearchForm();
			if (localStorage.getItem('emp_auth_key')) {
				 this.isView = '';
				 this.projectManagementService.getProjectManagementList('allocated','','view-only').subscribe(data=>{
						 if(data.status ==1 || data.status ==0 ){
								 this.allocateProjectList =[];
										this.isListing = 'allocated_project_listing';
									
										 let allocatedproject_list =[];
										 let hdata ='';
										if( data.status ==1 ){
												 data.result.data.forEach(function (value) {
												 hdata = JSON.parse(value.handOff.h_data);
													 value.handOff.h_data = hdata[0]
													 allocatedproject_list.push(value);
												 });
												 this.totalItem = data.result._meta.total_records;
												 this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
												 this.pages = 1;
												 this.createPaginationSubmitForm();
										 }
										 this.allocateProjectList = allocatedproject_list;
									this.sharedServices.view_type.next('pm_view');
									this.sharedServices.searchForm.next('allocated');
									this.sharedServices.project_type.next('allocated');
									this.showSmartSearchComponent = true;


						 } else {
								 this.popupMessageService.showError('Can not Load data','Error');
						 }
						 
				 })
		 } else {
				 this.route.navigateByUrl('/employee/login');
		 }

 }

	assignedProjectList: any;
	getAssignedProjectList(){
			//console.log(proposalSolutionType);
			this.ResetSmartSearchForm();
			if (localStorage.getItem('emp_auth_key')) {
					this.projectManagementService.getProjectManagementList('assigned','','view-only').subscribe(data=>{
							let assignedproject_list =[];
							this.assignedProjectList = [];
							if(data.status ==1 || data.status ==0 ){
									let hdata ='';
									if( data.status ==1 ){
											data.result.data.forEach(function (value) {
												 hdata = JSON.parse(value.handOff.h_data);
												 value.handOff.h_data = hdata[0]
												 assignedproject_list.push(value);
											 });
									this.totalItem = data.result._meta.total_records;
									this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
									this.pages = 1;
									this.createPaginationSubmitForm();
									}
									
									//console.log(assignedproject_list);

							} else {
									this.popupMessageService.showError('Can not Load data','Error');
							}
							this.assignedProjectList = assignedproject_list;
							this.isListing = 'assigned_project_listing';
							this.sharedServices.view_type.next('pm_view');
							this.sharedServices.searchForm.next('assigned');
							this.sharedServices.project_type.next('assigned');
							this.showSmartSearchComponent = true;
					})
					} else {
							this.route.navigateByUrl('/employee/login');
					}

	}
	

    getSolutionType(solutiontype:any){
		if(solutiontype =='1'){
		   return 'Grid-Tied';
		}
		else if(solutiontype =='2'){
		  return 'Off-Grid';
		}
		else if (solutiontype == '3') {
            return 'Hybrid';
        } 
		else{
		  return '';
		}
 
	 }
	
       //view on going project plan 
		Ongoingviewprojectplan(handoff_data:any=null){
			this.activetask = '';
			 if (localStorage.getItem('emp_auth_key')) {
					 this.currentProjectId = handoff_data.h_projectid;
					 this.isView = 'ongoing_view_project_plan';
					 this.isListing = '';
					 this.currentHandOffData=handoff_data;
					 this.projectplan = [];
					 this.projectManagementService.getprojectplan(handoff_data.h_projectid,handoff_data.gridtype).subscribe((data)=>{
						 if(data.status==1){
							 this.projectManagementService.transformprojectplan(data.data.tasks,handoff_data.gridtype)
							 this.projectplan=data.data.tasks;
							 this.calender=data.data.calender;
						 }
					 });
				  } else {
					 this.route.navigateByUrl('/employee/login');
				 }
	 
		}

		   //view details on completed projects list 
		   Completedviewprojectplan(handoff_data:any=null){
			if (localStorage.getItem('emp_auth_key')) {
				this.currentProjectId = handoff_data.h_projectid;
					this.isView = 'completed_view_detail_project_plan';
					this.isListing = '';
					this.currentHandOffData=handoff_data;
					this.projectplan = [];
					this.projectManagementService.getprojectplan(handoff_data.h_projectid,handoff_data.gridtype).subscribe((data)=>{
						if(data.status==1){
							this.projectplan=data.data.tasks;
							this.calender=data.data.calender;
						}
					});
				 } else {
					this.route.navigateByUrl('/employee/login');
				}
	
	   }

	     //calculate date difference between two date 
  getdatediff(date1){ //console.log(date1);
	let pipe = new DatePipe('en-US');
	let todaydate = pipe.transform(this.currentDate, 'dd-MM-yyyy');
	if(date1 != null && date1 !=''){
	  let currentdate = todaydate;
	  let currentdate_array=currentdate.split("-");
	  let currentdate_newDate=currentdate_array[1]+"/"+currentdate_array[0]+"/"+currentdate_array[2]; 
	  let current_date_time = new Date(currentdate_newDate).getTime();
	   //console.log(current_date_time , 'current');

	  let myDate = date1;
	  let myDate_array=myDate.split("/");
	  let newDate=myDate_array[1]+"/"+myDate_array[0]+"/"+myDate_array[2]; 
	  let end_date_time = new Date(newDate).getTime();
	  //console.log(end_date_time , 'enddate');
	   let diff = (current_date_time - end_date_time );
	   let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
	   if(diffDays > 0 ){
		 return diffDays;
	   }else{
		return '';
	   }
	   

	} else{
	  return '';
	}

}

taskFormValidation(milestone,task_id:any=0) {
	this.taskForm = this.formBuilder.group ({
		remarks: [''],
		actualstartdate:[],
		//actualenddate:[{value:'',disabled:true}],
		actualenddate:[''],
		allocated_to:[''],
		status:['2',Validators.compose([Validators.required])],
		pp_id:[milestone.pp_id,Validators.compose([Validators.required])],
		tt_id:[task_id],
		milestone_id:[milestone.plnm_id],
		cheque_no:[],
		bank_drawn_no:[],
		ac_no:[],
		payment:[],
		sap_number:[],
		bank_reference_number:[],
		invoice_no:[],
		transaction_date:[],
		drawn_on_date:[],
		bankdrawnonname:[],
		allocatedddate:[]
	});
}

plan:any;
   milestone_id:any;
    OngoingTaskList(milestone_id:any, handoff_data:any=null, plan :any=null){
         if (localStorage.getItem('emp_auth_key')) {
          
          this.currentHandOffData=handoff_data;
          this.plan = plan;
          this.milestone_id = milestone_id;
           //prefilled data
           this.tasksdata = [];
        // this.projectManagementService.getmilestonetasks(plan.Milestone.pp_id,plan.Milestone.plnm_id).subscribe((data)=>{
        //     if(data.status==1){
        //          this.tasksdata=data.data;
        //     }
        // }); 
         this.doc_id = [];
		 if(milestone_id==1){
			this.isView = 'task_list_completedby_milestone_checkrealization';
			this.isListing = '';
		  } else if(milestone_id==2){ 
			this.isView = 'task_list_completedby_milestone_partnerallocation';
			this.isListing = '';
		  }
		  else if(milestone_id==3){
			this.isView = 'task_list_completedby_milestone_documentsubmission';
			this.isListing = '';
		  }
		  else if(milestone_id==4){
			this.isView = 'task_list_completedby_milestone_material_payment_collection_second';
			this.isListing = '';
		  }
		  else if(milestone_id==5){
			this.isView = 'task_list_completedby_milestone_materialdispatch';
			this.isListing = '';
		  }
		  else if(milestone_id==6){
			this.isView = 'task_list_completedby_milestone_installation';
			this.isListing = '';
		  }
		  else if(milestone_id==7){
			this.isView = 'task_list_completedby_milestone_payment_collection_third';
			this.isListing = '';
		  }
		   else if(milestone_id==8){
			this.isView = 'task_list_completedby_milestone_net_meter_instalation';
			this.isListing = '';
		  }
		   else if(milestone_id==9){
			this.isView = 'task_list_completedby_milestone_subsidy_document_submission';
			this.isListing = '';
		  }
		   else if(milestone_id==10){
			this.isView = 'task_list_completedby_milestone_projecthandover_closer';
			this.isListing = '';
		  }
			
                
        } else {
            this.route.navigateByUrl('/employee/login');
        }
    }


	    //view task list in completed project list
		CompletedTaskList(milestone_id:any, handoff_data:any=null, plan :any=null){
			if (localStorage.getItem('emp_auth_key')) {
			 
			 this.currentHandOffData=handoff_data;
			 this.plan = plan;
			//    this.projectManagementService.getmilestonetasks(plan.Milestone.pp_id,plan.Milestone.plnm_id).subscribe((data)=>{
			// 	   if(data.status==1){
			// 		   this.tasksdata=data.data;
			// 	   }
			//    });
			 if(milestone_id==1){
			   this.isView = 'task_list_completedby_milestone_checkrealization';
			   this.isListing = '';
			 } else if(milestone_id==2){ 
			   this.isView = 'task_list_completedby_milestone_partnerallocation';
			   this.isListing = '';
			 }
			 else if(milestone_id==3){
			   this.isView = 'task_list_completedby_milestone_documentsubmission';
			   this.isListing = '';
			 }
			 else if(milestone_id==4){
			   this.isView = 'task_list_completedby_milestone_material_payment_collection_second';
			   this.isListing = '';
			 }
			 else if(milestone_id==5){
			   this.isView = 'task_list_completedby_milestone_materialdispatch';
			   this.isListing = '';
			 }
			 else if(milestone_id==6){
			   this.isView = 'task_list_completedby_milestone_installation';
			   this.isListing = '';
			 }
			 else if(milestone_id==7){
			   this.isView = 'task_list_completedby_milestone_payment_collection_third';
			   this.isListing = '';
			 }
			  else if(milestone_id==8){
			   this.isView = 'task_list_completedby_milestone_net_meter_instalation';
			   this.isListing = '';
			 }
			  else if(milestone_id==9){
			   this.isView = 'task_list_completedby_milestone_subsidy_document_submission';
			   this.isListing = '';
			 }
			  else if(milestone_id==10){
			   this.isView = 'task_list_completedby_milestone_projecthandover_closer';
			   this.isListing = '';
			 }
		   } else {
			   this.route.navigateByUrl('/employee/login');
		   }
	   }

 //view task form details
  pTaskId:any = 0;
    ViewTaskform_detail(task_num: any,plan:any,formdata:any,isinternal:any=false){
        this.getTaskDetail(task_num,plan,formdata,isinternal);

    }
    getTaskDetail(task_num: any,plan:any,formdata:any,isinternal:any=false) {
		//this.activetask = '';
		if(this.activetask != task_num){
		  this.activetask = task_num;
	  } else {
		  if(isinternal==false){
			  this.activetask = '';
		  } else {
			  this.activetask = task_num;
		  }
	  }

	  
	  this.taskFormValidation(plan.Milestone,task_num);
	  this.getUploadedDocumentsTask(task_num);

	  this.projectManagementService.getmilestonetasks(plan.Milestone.pp_id,plan.Milestone.plnm_id, task_num, this.currentProjectId).subscribe((data)=>{
		  if(data.status==1){
			   this.tasksdata=data.data;
			   formdata = data.data;
		  }

	  //this.plan=plan;
	  this.pTaskId = 0;
	  if(formdata[task_num]){
		  this.pTaskId = formdata[task_num].ptask_id;
			if(formdata[task_num].ptask_status && formdata[task_num].ptask_status ==1)
			{ this.showactualenddate = true;}else{ this.showactualenddate = false; }
				//  console.log(formdata[task_num],'payment_mode');
			(formdata[task_num].ptask_allocate_to)?this.taskForm.controls.allocated_to.setValue(formdata[task_num].ptask_allocate_to):this.taskForm.controls.allocated_to.setValue('');
			(formdata[task_num].ptask_remark)?this.taskForm.controls.remarks.setValue(formdata[task_num].ptask_remark):'';
			(formdata[task_num].taskstartdate!='')?this.taskForm.controls.actualstartdate.setValue(new Date(formdata[task_num].taskstartdate)):this.taskForm.controls.actualstartdate.setValue('');
			(formdata[task_num].taskenddate!='')?this.taskForm.controls.actualenddate.setValue(new Date(formdata[task_num].taskenddate)):this.taskForm.controls.actualenddate.setValue('');
			(formdata[task_num].ptask_status)?this.taskForm.controls.status.setValue(formdata[task_num].ptask_status):'';
			(formdata[task_num].ptask_cheque_no)?this.taskForm.controls.cheque_no.setValue(formdata[task_num].ptask_cheque_no):'';
			(formdata[task_num].ptask_payment_mode)?this.taskForm.controls.payment.setValue(formdata[task_num].ptask_payment_mode):this.taskForm.controls.payment.setValue('');
			(formdata[task_num].ptask_invoice_no)?this.taskForm.controls.invoice_no.setValue(formdata[task_num].ptask_invoice_no):'';
			(formdata[task_num].ptask_allocate_date)?this.taskForm.controls.allocatedddate.setValue(new Date(formdata[task_num].ptask_allocate_date)):'';
			(formdata[task_num].ptask_bank_drawn)?this.taskForm.controls.transaction_date.setValue(new Date(formdata[task_num].ptask_bank_drawn)):'';
			(formdata[task_num].ptask_bank_drawn_no)?this.taskForm.controls.bank_drawn_no.setValue(formdata[task_num].ptask_bank_drawn_no):'';
			(formdata[task_num].ptask_ac_no)?this.taskForm.controls.ac_no.setValue(formdata[task_num].ptask_ac_no):'';
			(formdata[task_num].ptask_drawn_on_date)?this.taskForm.controls.drawn_on_date.setValue(new Date(formdata[task_num].ptask_drawn_on_date)):'';
			(formdata[task_num].ptask_bank_name)?this.taskForm.controls.bankdrawnonname.setValue(formdata[task_num].ptask_bank_name):'';
			(formdata[task_num].ptask_sap_number)?this.taskForm.controls.sap_number.setValue(formdata[task_num].ptask_sap_number):'';
			(formdata[task_num].ptask_bank_reference_number)?this.taskForm.controls.bank_reference_number.setValue(formdata[task_num].ptask_bank_reference_number):'';
		}
	  });
  }

  getUploadedDocumentsTask(task_id) {
	let h_id = this.currentHandOffData.h_id;
	if (localStorage.getItem('emp_auth_key')) {
		this.actionLoader = 'uploadedDocs_loader';
		this.projectDocuments = [];
		this.subscription = this.projectManagementService.getUploadedDocumentsTask(h_id, task_id).subscribe(data => {
			if (data.status == 1) {
				this.projectDocuments = data.data;
				this.actionLoader='';
			} else {
				this.popupMessageService.showError(data.error_message, "Error!");
				this.actionLoader='';
				//this.route.navigateByUrl('');
			}
		});
	} else {
		this.route.navigateByUrl('/employee/login');
	}

}

createPaginationSubmitForm() {
	this.paginationSubmitForm = this.formBuilder.group({
		page_number: [this.pages, Validators.compose([Validators.required, Validators.min(1), Validators.max(this.pageCount)])],
	});
}

pageSubmit() {
	if (this.paginationSubmitForm.valid) {
		let page = this.paginationSubmitForm.controls.page_number.value;
			this.sharedServices.searchForm.subscribe((data) => {
				this.projects=data;
				})
		  this.leadListService.getProjectsListing(page, this.itemPerPage,this.projects,this.smartSearchFormData,'','view-only').subscribe((data) => {
					if (data.status) {
					let ongoingproject_list =[];
					let hdata = null;
					data.result.data.forEach(function (value) {
					try {
						hdata =JSON.parse(value.handOff.h_data);
					} catch (e) {
						 hdata = value.handOff.h_data;
					}
				   if(hdata){
					  value.handOff.h_data = hdata[0]
					  ongoingproject_list.push(value);
				   }
					});
					if(this.isListing == 'ongoing_project_listing'){
						this.ongoingProjects=[];
				this.ongoingProjects = ongoingproject_list;
				}else if(this.isListing == 'completed_project_listing'){
								this.completedProjectlist=[];
				this.completedProjectlist = ongoingproject_list;
				}else if(this.isListing == 'allocated_project_listing'){
								this.allocateProjectList=[];
				this.allocateProjectList = ongoingproject_list;
				}else{
								this.assignedProjectList=[];
				this.assignedProjectList = ongoingproject_list;
				}
						this.totalItem = data.result._meta.total_records;
						this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
						this.pages = page;
						this.createPaginationSubmitForm();
					} else {
						console.log('error');
					}
				})
	}
}


smartSearchResults($event) {
		this.totalItem = $event.result._meta.total_records;
		this.pageCount = Math.ceil(this.totalItem / this.itemPerPage);
		this.pages = 1;
		this.createPaginationSubmitForm();
		this.searchResult = $event.result.data;
		this.sharedServices.searchForm.subscribe((data) => {
				this.projects=data;
		 })
		this.sharedServices.formDataSmartSearch.subscribe((data) => {
				this.smartSearchFormData=data;
		});
		console.log(this.projects,'roshan',this.smartSearchFormData);
				let ongoingproject_list =[];
				if( $event.status ==1 ){
					 let hdata = null;
					 this.searchResult.forEach(function (value) {
						try {
								hdata =JSON.parse(value.handOff.h_data);
						} catch (e) {
								 hdata = value.handOff.h_data;
						}
					 if(hdata){
						 value.handOff.h_data = hdata[0]
						 ongoingproject_list.push(value);
					 }
						});
				 }
				 if(this.isListing == 'ongoing_project_listing'){
					this.ongoingProjects=[];
			this.ongoingProjects = ongoingproject_list;
			}else if(this.isListing == 'completed_project_listing'){
							this.completedProjectlist=[];
			this.completedProjectlist = ongoingproject_list;
			}else if(this.isListing == 'allocated_project_listing'){
							this.allocateProjectList=[];
			this.allocateProjectList = ongoingproject_list;
			}else{
							this.assignedProjectList=[];
			this.assignedProjectList = ongoingproject_list;
			}
	}
	
	//view hand off details
handoff_remark: any;
ViewHandoffDetails(handoff: any){ //console.log(handoff);
if (localStorage.getItem('emp_auth_key')) {
    
      this.handoff_data = handoff;
      this.projectManagementService.gethandofremark(handoff.h_id).subscribe((data)=>{
          if(data.status==1){ //console.log(data.handofremark[0].hrj_remark)
            if(data.handofremark.length>0){
                this.handoff_remark = data.handofremark[0];
            }
            this.isListing = 'view_hand_off';
          }
      });

} else {
    this.route.navigateByUrl('/employee/login');
}

}
	

_keyPresspagination(event: any) {
	const pattern = /[0-9\+\-\ ]/;
	let inputChar = String.fromCharCode(event.charCode);
	if(this.pageCount<(this.paginationSubmitForm.controls.page_number.value+event.key) )
		event.preventDefault();
	if (!pattern.test(inputChar) && event.keyCode != 8) {
	  // invalid character, prevent input
	  event.preventDefault();
	}
  }
	prevListing = '';
	projectDetailData:any;
	handoff_id:any;



	ProjectDetailView(handoff){
		 if (localStorage.getItem('emp_auth_key')) {
				 this.handoff_data = handoff;
				 this.projectManagementService.getProjectDetail(handoff.h_id, handoff.h_data.consumerProject.project_id).subscribe((data)=>{
						 if(data.status==1){
								 this.handoff_id = handoff.h_id;
								 this.prevListing = this.isListing;
								 this.isListing = "view_project_detail";
								 this.projectManagementService.transformProjectDetailData(data.data[0].taskData,handoff.gridtype)
							     this.projectDetailData=data.data[0];
							// console.log(this.projectDetailData, 'roshan projct detail')
						 }
				 });
	 
	 } else {
			 this.route.navigateByUrl('/employee/login');
	 }
	 
	}

	CloseProjectDetail(){
		this.isListing = this.prevListing;
		this.prevListing = '';
 }

 ResetSmartSearchForm(){
	this.sharedServices.formDataSmartSearch.next("");  
}


}