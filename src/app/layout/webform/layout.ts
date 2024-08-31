import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Route, NavigationStart, Router, RouterState, RouterStateSnapshot} from '@angular/router';
import * as globals from '../../static/static';
import { Subscription } from 'rxjs/Subscription';
import { LeadListService } from '../../modules/employee-panel/services/lead-list.service';
import { SharedServices } from '../../services/shared.services';
import { PopupMessageService } from '../../modules/message/services/message.service';

@Component({
    selector: 'app-webform-layout',
    templateUrl: './layout.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../../assets/css/cc-styles.css', '../../../assets/css/employee-login.css']
})
export class WebFormLayout implements OnInit {
    
    toggleAside: any;
    togglePanel: any;
    username : any;
    isLogged : Boolean = false;
    snapshot: RouterStateSnapshot;

    constructor(
        private popupmessageService: PopupMessageService,
        private router: Router,
    ) {
        const state: RouterState = router.routerState;
        this.snapshot = state.snapshot;
     }

    ngOnInit() {
        this.isLogged = !!localStorage.getItem('webform_emp_auth_key');
        const userData = localStorage.getItem('webform_userData');
        if(userData) {
            const user = JSON.parse(userData);
            this.username = user.emp_firstname
        }
    }

    logout() {
        this.isLogged = false;
        localStorage.removeItem('webform_emp_auth_key');
        localStorage.removeItem('webform_userData');
        localStorage.removeItem('webform_role_id');
        this.router.navigate(['/webform/login'],{ queryParams: { returnUrl: this.snapshot.url }});
        this.popupmessageService.showSuccess('Logged Out Successfully', 'success');
      }

    

    

    
}
