import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { EmployeeServices } from './../../services/employee.services';
import { AlertServices } from './../../services/alert.services';
import * as globals from './../../static/static';
import { Router } from '@angular/router';
import { InlineMessageService } from './../../modules/message/services/message.service';
import { PopupMessageService } from './../../modules/message/services/message.service';
import { SharedServices } from './../../services/shared.services';

@Component({
    selector: 'projectmanager-tasksubmit',
    templateUrl: './projectmanager-tasksubmit.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', './projectmanager-tasksubmit.component.css']
})
export class ProjectmanagerTasksubmitComponent implements OnInit {
  taskUpdate: FormGroup;
  checkurl :any ;
  validurl:any =0;
  pp_id:any;
  h_id:any;
  task_id:any;
  employee_id:any;
  milestone_id:any;
  showactualenddate:any=false;
  formdata:any;
  currentDate:any= new Date(); 
    constructor(
        private formBuilder: FormBuilder,
        private employeeServices: EmployeeServices,
        private popupMessageService: PopupMessageService,
        private sharedServices: SharedServices,
        private router: Router
    ){}

    ngOnInit() {
      this.getTaskValidUrl();
      this.createTaskUpdateForm();
      
    }

    getTaskValidUrl(){
        //this.href = this.router.url;
        // let token = this.router.snapshot.params.get('token');
        // console.log(token);
        this.checkurl = window.location.href;
        let send_data = {'url':this.checkurl};
        this.employeeServices.getvalidurl_task_partner(send_data).subscribe((data) => {
           if(data.status==1){

              this.pp_id = data.result.pp_id;
              this.task_id = data.result.task_id;
              this.h_id = data.result.handoff_id;
              this.employee_id = data.result.employee_id;
              this.milestone_id = data.result.milestone_id;
              this.getTaskdata();
              this.validurl=1;

           } else{
             this.validurl=0;
             //this.popupMessageService.showSuccess('Page not found' , 'Error!');
           }  
           

        }) ;


    }
   
   //get task data by task id and pp_id
   taskname:any;
    getTaskdata(){
      // console.log(this.pp_id , 'pp_id')
      // console.log(this.task_id , 'task_id')
      let send_data = {'pp_id':this.pp_id , 'task_id':this.task_id , 'h_id':this.h_id };  
        this.employeeServices.getTaskdata(send_data).subscribe((data) => {
             
             if(data.status==1){
               this.taskname = data.data.taskname;
               this.formdata = data.data.taskinfo;
               if(data.data.taskinfo.ptask_status ==1){
                this.showactualenddate= true;
               }
              (this.formdata.taskstartdate!='')?this.taskUpdate.controls.actualstartdate.setValue(new Date(this.formdata.taskstartdate)):this.taskUpdate.controls.actualstartdate.setValue('');
              (this.formdata.taskenddate!='')?this.taskUpdate.controls.actualenddate.setValue(new Date(this.formdata.taskenddate)):this.taskUpdate.controls.actualenddate.setValue('');
              (this.formdata.ptask_status)?this.taskUpdate.controls.status.setValue(this.formdata.ptask_status):'';

             }else{
               this.taskname = '';
             }

        });


    }

    createTaskUpdateForm(){
       this.taskUpdate = this.formBuilder.group({
            remarks:[''],
            actualstartdate:[],
            actualenddate:[''],
            status:['2',Validators.compose([Validators.required])]
        })
    }

    SaveTaskdata(){
        if(this.taskUpdate.value.actualenddate){
              if(!this.taskUpdate.value.actualstartdate){
                this.popupMessageService.showError('Start Date not found', "Error!");
                return false;
             }
             let dateobj_strdate = this.sharedServices.getDateInFormat(this.taskUpdate.value.actualstartdate);
             let dateobj_enddate = this.sharedServices.getDateInFormat(this.taskUpdate.value.actualenddate);
            if(new Date(dateobj_strdate).getTime() > new Date(dateobj_enddate).getTime()){
              this.popupMessageService.showError('End date should be greater than start date!', "Error!");
              return false;
            }
            if(this.taskUpdate.value.status != 1){
                this.popupMessageService.showError('End date should be enter on task complete', "Error!");
                return false;
            }
         }   

        if (this.taskUpdate.valid){
             let send_formdata = {'pp_id':this.pp_id , 'task_id':this.task_id , 'h_id':this.h_id, 'employee_id':this.employee_id , 'milestone_id':this.milestone_id };
             let finaljson = new Array();
             finaljson.push(send_formdata);
             finaljson.push(this.taskUpdate.value)
             // console.log(finaljson); return false;
            this.employeeServices.SaveTaskData(finaljson).subscribe((data) => {
                if(data.status ==1){
                  this.popupMessageService.showSuccess("Data updated successfully", "Success!");

                  this.router.navigateByUrl('/employee/login');
                  
                }else{
                  this.popupMessageService.showError('Something went wrong', "Server Error!");
                }

            }) ;


        }else{
          console.log('form not valid');
        }


    }


    onChangetaskcomplete(i:any){
        let actualend= this.taskUpdate.controls.actualenddate;
        if(i == 1){
            this.showactualenddate=true;
            actualend.setValidators([Validators.required]);
        }else{
            this.showactualenddate=false;
            actualend.setValue('');
            actualend.clearValidators(); 
        }
        actualend.updateValueAndValidity();
    }



    


    



    
}
