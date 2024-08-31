import {Pipe}  from '@angular/core';
@Pipe({
    name: 'underscoreRemove'
})
export class UnderscoreRemove {
    transform(value: string): string {
        let newString =  value.replace(/_/g,' ');
        return newString.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
}