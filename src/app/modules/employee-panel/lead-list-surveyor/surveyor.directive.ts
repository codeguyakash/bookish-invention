import { HostListener, Input, Directive, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Directive({
    selector: '[luminousSurveyor]'
})

export class LuminousSurveyorDirective implements OnInit {

    @Input() group;
    @Input() select: any;
    constructor(private element: ElementRef) {
    }

    ngOnInit() {

    }

    @HostListener('change', ['$event'])
    change($event) {
        
        let watt = this.group.value.lsf_power_watts;
        watt = this.select.querySelector(`option[value="${watt}"]`).innerHTML;
        
        let a = this.group.value.lsf_quantity_day_time;
        let c = this.group.value.lsf_backup_hours_of_use_during_day_time;
        let e = this.group.value.lsf_quantity_night_time;
        let d = this.group.value.lsf_backup_hours_of_use_during_night_time;
        let result1 = a*watt*c;
        let result2 = e*watt*d;

        this.group.get('lsf_watt_hour_energy_day_time')
            .patchValue(result1);

        this.group.get('lsf_watt_hour_energy_night_time')
            .patchValue(result2);
        this.group.updateValueAndValidity();
    }

}
