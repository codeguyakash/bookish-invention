import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LeadListService } from '../services/lead-list.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AlertServices } from '../../../services/alert.services';
import { Router, ActivatedRoute } from '@angular/router';
import { InlineMessageService } from './../../message/services/message.service';
import { TIMES } from '../../../static/static';
import * as globals from '../../../static/static';
import { PopupMessageService } from './../../../modules/message/services/message.service';
declare var $: any;

@Component({
    selector: 'marketing',
    templateUrl: './marketing.component.html',
    styleUrls: ['./marketing.component.css']
})
export class Marketing implements OnInit {
    subscription: Subscription;
    isListing:boolean;
    isLoginEmp:boolean;
    surveyorFormData;
    toggleStatus: Boolean;
    footerStripForm: FormGroup;
    showForm: String;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    imageSelected: any;
    imageShow: any;
    userData:any;
    stripData:any;
    closeStrip:boolean;

    @ViewChild('myInput')
    myInputVariable: any;

    constructor(
        private leadListService: LeadListService,
        private formBuilder: FormBuilder,
        private popupMessageService: PopupMessageService
    ) { }

    ngOnInit() {
      this.toggleStrip();
        if (localStorage.getItem('emp_auth_key')) {
            this.userData = JSON.parse(localStorage.getItem('userData'));
        }
        this.showForm = "new_strip";
        this.createStripForm();
    }

    createStripForm(){
        this.footerStripForm  = this.formBuilder.group({
            fs_text :['', Validators.compose([Validators.required])],
            fs_close_button_color: ['', Validators.compose([Validators.pattern(/^\(??([A-Za-z0-9]{6})$/)])],
            fs_img_max_height: ['', Validators.pattern(/^[1-2]{1}[0-9]{1}|30$/)],
            fs_color_code: ['', Validators.compose([Validators.pattern(/^\(??([A-Za-z0-9]{6})$/)])],
            fs_image:['']
        });
    }

    addNewStripText(){
        this.showForm = "new_strip";
        this.createStripForm();
    }

    newStripSubmit(){
        if (this.imageSelected && this.croppedImage) {
            this.footerStripForm.controls.fs_image.setValue(this.croppedImage);
        }
        if (this.footerStripForm.valid){
            this.subscription = this.leadListService.createNewStripText(this.footerStripForm.value).subscribe(data => {
                if (data.status == 1) {
                    this.popupMessageService.showSuccess("Data Submitted Successfully", "Success!");
                    this.footerStripForm.reset();
                    this.myInputVariable.nativeElement.value = "";
                    this.imageSelected = false;
                    this.imageShow = false;
                    this.stripData = false;
                } else {
                    this.popupMessageService.showError(data.error_message, "Error!");
                }
            }, (error) => {
                this.popupMessageService.showError(globals.SERVER_ERRORS.INTERNET_OR_API_ACCESS, "Error!");
            });
        }else{
            this.popupMessageService.showError("Invalid Form Data.", "Error!");
        }
    }

    toggleStrip() {
      this.leadListService.CheckToggleStatus().subscribe(data => {
        if(data.data[0].fs_visibility_status === '1'){
          this.toggleStatus = false;
        } else {
          this.toggleStatus = true;
        }
      })
    }

    toggleFooterStrip() {
      this.leadListService.ToggleFooterStrip().subscribe(data => {
      })
     }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.imageSelected = true;
    }

    imageCropped(image: string) {
        this.imageShow = true;
        this.croppedImage = image;
    }

    showPreview(){
        this.stripData = false;
        if (this.closeStrip){
            this.closeStrip = false;
        }
        if (this.imageSelected && this.croppedImage) {
            this.footerStripForm.controls.fs_image.setValue(this.croppedImage);
        }
        if (this.footerStripForm.valid) {
            this.stripData = this.footerStripForm.value;
        } else {
            this.popupMessageService.showError("Invalid Form Data.", "Error!");
        }
    }

}
