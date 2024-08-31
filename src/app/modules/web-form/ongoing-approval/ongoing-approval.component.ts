import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadListService } from 'app/modules/employee-panel/services/lead-list.service';
import { ProjectManagementService } from 'app/modules/employee-panel/services/project-management.services';
import { PopupMessageService } from 'app/modules/message/services/message.service';

@Component({
    selector: 'app-ongoing-approval',
    templateUrl: './ongoing-approval.component.html',
    styleUrls: ['./ongoing-approval.component.css']
})
export class OngoingApproval implements OnInit {

    ppid:string = '';
    ttid: string = ''
    mile: string = ''
    project_id: string = ''
    taskData: any;
    showApproveBtn: boolean = false;
    isTaskApproved: boolean = false;
    isTaskRejected: boolean = false;
    
    constructor(
        private activatedRoute: ActivatedRoute,
        private leadListService: LeadListService,
        private projectManagementService: ProjectManagementService,
        private popupMessageService: PopupMessageService,
    ){}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.ppid = params['ppid'];
            this.ttid = params['tt_id'];
            this.mile = params['mile'];
            this.project_id = params['project_id'];
            this.getTaskDetails(); 
          }); 
          
           
    }

    approve(type) {
        this.leadListService.approveOngoing({ppid: this.ppid, ttid: this.ttid, type: type}, true).subscribe(res => {
            if(res.status) {
                if(res.status) {
                    if(type == "approve") {
                        this.isTaskApproved = true;
                    }
                    if(type == 'reject') {
                        this.isTaskRejected = true;
                    }
                    this.popupMessageService.showSuccess(res.data, "Success");
                }
            }
        });
    }

    getTaskDetails() {
        this.projectManagementService.getmilestonetasks(this.ppid, this.mile, this.ttid, this.project_id, true ).subscribe(res => {
            console.log(res);
            if(res.status) {
                this.taskData = res.data[this.ttid];
                this.showApproveBtn = true;
                // res.data[this.ttid].ptask_pending_approval == 0 ? this.isTaskApproved = true: this.isTaskApproved = false;
            } else {
                this.popupMessageService.showError("Error", "Can't get project details");
            }
        });
    }

    getTrancheName(num) {
        if(num == 1) {
            return "P1 from customer";
        }
        if(num == 19) {
            return "P2 from customer";
        }
        if(num == 12) {
            return "P3 from customer";
        }
        if(num == 43) {
            return "P4 from customer";
        }
    }
   
}
