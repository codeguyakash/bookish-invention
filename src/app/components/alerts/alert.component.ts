import { Component, OnInit } from '@angular/core';
import { AlertServices } from '../../services/alert.services';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
 
})
export class AlertComponent implements OnInit {
  message: any;
  
  constructor( private alertService:AlertServices) { }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => {this.message = message;})
  }

}
