import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
declare var require: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(
        private location: Location,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private platmorm_location: PlatformLocation
    ) { 
        platmorm_location.onPopState(() => {
               //alert(this.location.path());
               this.router.navigateByUrl(this.location.path());
            }); 
    }

    ngOnInit() {
        
        // if (this.location.path().includes('/customer-care') || this.location.path().includes('/employee/login') || this.location.path().includes('/employee-panel')) {
        //     require("style-loader!../assets/css/cc-styles.css");
        //     require("style-loader!../assets/css/employee-login.css");
        // } else {
        //     // require("style-loader!../assets/css/styles.css");
        // }

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });

    }
    
}
