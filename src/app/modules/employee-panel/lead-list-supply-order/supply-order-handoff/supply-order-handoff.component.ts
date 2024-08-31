import { Component, Input, OnInit } from '@angular/core';
import * as globals from '../../../../static/static';

@Component({
    selector: 'app-supply-order-handoff',
    templateUrl: './supply-order-handoff.component.html',
    styleUrls: ['../../../../../assets/css/bootstrap.min.css', './supply-order-handoff.component.css']
})
export class SupplyOrderHandOff implements OnInit {

    @Input() handoff_data;
    HandoffLeadListingData: any;
    baseurl: string;

    constructor() {

    }

    ngOnInit() {
        this.baseurl = globals.API_BASE_URL;
    }
}