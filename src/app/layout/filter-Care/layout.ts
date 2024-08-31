import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Route, NavigationStart, Router} from '@angular/router';
import * as globals from '../../static/static';
import { Subscription } from 'rxjs/Subscription';
import { LeadListService } from '../../modules/employee-panel/services/lead-list.service';
import { SharedServices } from '../../services/shared.services';
import { PopupMessageService } from '../../modules/message/services/message.service';

@Component({
    selector: 'app-filter-Care',
    templateUrl: './layout.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../../assets/css/cc-styles.css', '../../../assets/css/employee-login.css']
})
export class FilterCareLayout implements OnInit {
    emp_token: any;
    toggleAside: any;
    togglePanel: any;
    isLogged : Boolean = false;
    userData:any = [];
    allRoles:any =[];
    roleNameArray = globals.ALL_ROLES;
    subscription: Subscription;
    roletab:any;


    constructor(
        private popupmessageService: PopupMessageService,
        private router: Router,
        private leadListService: LeadListService,
        private sharedService: SharedServices
    ) {}

    ngOnInit() {
        // alert("zfdsfasvsad")
        this.rightMove();
        this.isLogged = !!localStorage.getItem('emp_auth_key');
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.allRoles = this.userData? this.userData.role_ids.split(','):'';
        this.roletab = localStorage.getItem('role_id');
    }

    rightMove() {
        if (localStorage.getItem('emp_auth_key')) {
            if (localStorage.getItem('role_id') == '22') {
                this.router.navigateByUrl('/employee-panel/lead-list-surveyor');
            } else if (localStorage.getItem('role_id') == '5') {
                this.router.navigateByUrl('/customer-care/lead-panel');
            } else if (localStorage.getItem('role_id') == '8') {
                this.router.navigateByUrl('/employee-panel/lead-list-soldesign');
            } else if (localStorage.getItem('role_id') == '17') {
                this.router.navigateByUrl('/employee-panel/lead-list-opshead');
            } else if (localStorage.getItem('role_id') == '24') {
                this.router.navigateByUrl('/employee-panel/lead-list-partner');
            } else if (localStorage.getItem('role_id') == '9') {
                this.router.navigateByUrl('/employee-panel/lead-list-finance');
            } else if (localStorage.getItem('role_id') == '2') {
                this.router.navigateByUrl('/employee-panel/lead-list-aftersales');
            } else if (localStorage.getItem('role_id') == '25') {
                this.router.navigateByUrl('/customer-care/cce-supervisor');
            } else if (localStorage.getItem('role_id') == '13') {
                this.router.navigateByUrl('/employee-panel/marketing');
            } else if (localStorage.getItem('role_id') == '26') {
                this.router.navigateByUrl('/employee-panel/admin');
            } else if (localStorage.getItem('role_id') == '27') {
              this.router.navigateByUrl('/filter-panel/filterScreen');
            } else if (localStorage.getItem('role_id') == '28') {
              this.router.navigateByUrl('/customer-care/lead-partner');
            }
            else if (localStorage.getItem('role_id') == '29') {
             this.router.navigateByUrl('/employee-panel/project-manager');
            } else if (localStorage.getItem('role_id') ==  '30') {
                this.router.navigateByUrl('/employee-panel/project-manager-view');
            } else if(localStorage.getItem('role_id') == '4'){
                this.router.navigateByUrl('/employee-panel/auditor');
            } 
        } else {
            this.router.navigateByUrl('/employee/login');
        }
    }

    checkRoleExists(roleId:number){
        this.roletab = roleId;
        if (localStorage.getItem('emp_auth_key')) {
            this.subscription = this.leadListService.checkRoleExists(roleId).subscribe(data => {
                if (data.status) {
                    window.localStorage['role_id'] = data.data.role_id;
                    let curRole = data.data.role_id;
                    if (curRole == '22') {
                        this.router.navigateByUrl('/employee-panel/lead-list-surveyor');
                    } else if (curRole == '5') {
                        this.router.navigateByUrl('/customer-care/lead-panel');
                    } else if (curRole == '8') {
                        this.router.navigateByUrl('/employee-panel/lead-list-soldesign');
                    } else if (curRole == '17') {
                        this.router.navigateByUrl('/employee-panel/lead-list-opshead');
                    } else if (curRole == '24') {
                        this.router.navigateByUrl('/employee-panel/lead-list-partner');
                    } else if (curRole == '9') {
                        this.router.navigateByUrl('/employee-panel/lead-list-finance');
                    } else if (curRole == '2') {
                        this.router.navigateByUrl('/employee-panel/lead-list-aftersales');
                    }else if (curRole == '25') {
                        this.router.navigateByUrl('/customer-care/cce-supervisor');
                    } else if (curRole == '13') {
                        this.router.navigateByUrl('/employee-panel/marketing');
                    } else if (curRole == '26') {
                        this.router.navigateByUrl('/employee-panel/admin');
                    } else if (curRole == '27') {
                      this.router.navigateByUrl('/filter-panel/filterScreen');
                    } else if (curRole == '28') {
                    this.router.navigateByUrl('/customer-care/lead-partner');
                    } else if (curRole == '29') {
                    this.router.navigateByUrl('/employee-panel/project-manager');
                    } else if (curRole ==  30) {
                        this.router.navigateByUrl('/employee-panel/project-manager-view');
                    } else if(curRole == '4'){
                        this.router.navigateByUrl('/employee-panel/auditor');
                    } 
                } else if (data.error_code==401){
                    localStorage.clear();
                    this.router.navigate(['/employee/login']);
                }
            })
        } else {
            this.router.navigateByUrl('/employee/login');
        }
    }

    logout() {
        this.isLogged = false;
        localStorage.clear();
        this.router.navigate(['/employee/login']);
        this.popupmessageService.showSuccess('Logged Out Successfully', 'success');
    }

}
