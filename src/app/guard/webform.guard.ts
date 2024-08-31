import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";

@Injectable()
export class WebFormAuthGuard implements CanActivate {
	constructor(
		private router: Router) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Promise<boolean> {
        const accessToken = localStorage.getItem('webform_emp_auth_key');
        let isAuthenticated = false;
        if(accessToken) {
            isAuthenticated = true;
        }
		if (!isAuthenticated) {
			this.router.navigate(['/webform/login'],{ queryParams: { returnUrl: state.url }});
		}
		return isAuthenticated;
	}
}
