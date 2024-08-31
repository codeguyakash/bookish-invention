import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeServices } from 'app/services/employee.services';
import { AlertServices } from 'app/services/alert.services';
import { InlineMessageService, PopupMessageService } from 'app/modules/message/services/message.service';


@Component({
    selector: 'app-webform-login',
    templateUrl: './webform-login.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../../../assets/css/cc-styles.css', '../../../../assets/css/employee-login.css','./webform-login.component.css']
})
export class WebFormLogin implements OnInit {

    loginEmployee: FormGroup;
    employeeEmailID: any;
    EnterEmailFP: Boolean = false;
    employeeLogin: Boolean = true;
    forgotPassword: Boolean = false;
    invalid: Boolean = false;
    EnternewPassword: Boolean = false;
    VerifyOTP: boolean = false;
    EnterNewPassword: FormGroup;
    // employeeId: Number;
    isSubmittedOtp: Boolean = false;
    OneTimePassword: Number;
    EmployeeMobileNumber: Number;
    subscription: Subscription;
    isSubmittedLogin: boolean = false;
    ForgotPasswordEmail: FormGroup;
    isSubmittedPassword: Boolean = false;
    token: String;
    verifyOTP: FormGroup;
    isLoading: Boolean = false;
    isOtpGenerated: boolean = false;
    returnUrl: any;
    
    constructor(
        private formBuilder: FormBuilder,
        private employeeServices: EmployeeServices,
        private alertService: AlertServices,
        private route: Router,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService,
        private activatedRoute: ActivatedRoute
    ){
    }

    ngOnInit(): void {
        this.createEmployeeLoginForm();
        this.createEnterEmailForm();
        this.createNewPasswordForm();
        this.createVerifyOTP();
        this.token = localStorage.getItem('webform_emp_auth_key');
        // if ((this.token)) {
        //     this.route.navigateByUrl('/customer-care/lead-panel');
        // }
        // get return url from route parameters or default to '/'
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * Employee Login
     */
     createEmployeeLoginForm(){
        this.loginEmployee = this.formBuilder.group({
            consumer_mobileno: [''],
            consumer_otp:[''],
        })
    }
    createEnterEmailForm(){
      this.ForgotPasswordEmail = this.formBuilder.group({
        email_id: ['', Validators.compose([Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])]
      })
    }
    _keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);

      if (!pattern.test(inputChar) && event.keyCode != 8) {
        // invalid character, prevent input
        event.preventDefault();
      }
    }

    createVerifyOTP(){
      this.verifyOTP = this.formBuilder.group({
        email_id: [''],
        otp: ['', [Validators.required]]
      })
    }

    createNewPasswordForm(){
      this.EnterNewPassword = this.formBuilder.group({
        email_id: [''],
        otp: [''],
        emp_id: [''],
        newPassword: ['', [Validators.required, Validators.pattern(/^\w{8,}/)]],
        confim_password: ['', [Validators.required]]}
      )
    }

    onKey(event){
      let values = event.target.value;
      if (values.length === 0 || values === this.EnterNewPassword.value.newPassword){
        this.invalid = false;
      } else {
        this.invalid = true;
      }
    }
    verifyEmailForgotPassword(){
      this.isSubmittedLogin = true;
      if(this.ForgotPasswordEmail.valid){
        this.employeeEmailID = this.ForgotPasswordEmail.value;
        this.employeeServices.verifyEmailForgotPassword(this.employeeEmailID).subscribe(data => {
          if (data.status == 1) {
            let lastFourDigits = data.data.partial_no;
            // this.EmployeeMobileNumber = data.data.mobile;
            // this.OneTimePassword = data.data.otp;
            // this.employeeId = data.data.emp_id;
            // this.verifyOTP.controls.mobile_no.setValue(this.EmployeeMobileNumber);
            // this.EnterNewPassword.controls.mobile_no.setValue(this.EmployeeMobileNumber);
            this.EnterEmailFP = false;
            this.VerifyOTP = true;
            this.popupMessageService.showSuccess('OTP sent to ******' + lastFourDigits , 'Success!');
          } else {
            this.popupMessageService.showError(data.error_message, 'Failure!');
          }
        })
      }
   }

   backToLogin() {
     this.forgotPassword = false;
     this.VerifyOTP = false;
     this.EnternewPassword = false;
     this.employeeLogin = true;
     this.ForgotPasswordEmail.reset();
     this.verifyOTP.reset();
     this.EnterNewPassword.reset();
   }

    submitOTP(){
      this.isSubmittedOtp = true;
      if(this.verifyOTP.valid){
      this.verifyOTP.controls.email_id.setValue(this.employeeEmailID.email_id);
      this.employeeServices.verifyOTP(this.verifyOTP.value).subscribe(data => {
        if (data.status == 1) {
          this.VerifyOTP = false;
          this.EnternewPassword = true;
          this.popupMessageService.showSuccess('OTP verified successfully', 'Success!');
        } else {
          this.popupMessageService.showError(data.error_message, 'Failure!');
          }
        })
      }
    }

    submitPassword(){
      this.isSubmittedPassword = true;
      if(this.EnterNewPassword.valid && this.invalid == false){
        this.EnterNewPassword.controls.otp.setValue(this.verifyOTP.value.otp);
      // this.EnterNewPassword.controls.emp_id.setValue(this.employeeId);
      this.EnterNewPassword.controls.email_id.setValue(this.employeeEmailID.email_id);
      this.employeeServices.verifyPassword(this.EnterNewPassword.value).subscribe(data => {
        if(data.status == 1){
          this.forgotPassword = false;
          this.EnternewPassword = false;
          this.employeeLogin = true;
          this.popupMessageService.showSuccess('Password reset successfully', 'Success!');
        } else {
          this.popupMessageService.showError(data.error_message, 'Failure!');
         }
        })
      }
    }

    loginEmployeeSubmit(){
        if(!this.isOtpGenerated) {
            const phone = this.loginEmployee.controls.consumer_mobileno.value;
            this.generateOtp(phone, 'WL');
            return false;
        }   

        this.isSubmittedLogin = true;
        if (this.loginEmployee.valid) {
            this.isLoading = true;
            this.subscription = this.employeeServices.loginUser(this.loginEmployee.value).subscribe(data => {
                this.isLoading = false;
                if (data.status==1) {
                    this.loginRedirect(data);
                } else {
                    this.inlineMessageService.showError(data.error_message);
                }
            }, (error) => {
                this.inlineMessageService.showError("Error in response");
                }) ;
            } else {
                this.inlineMessageService.showError("Invalid data");
            }
    }
    
    /**
     * Generate OTP through Mobile Number
     */
     generateOtp(consumerMobile?:any,type? : String) {
        if(consumerMobile!=0 && consumerMobile.match(/^[1-9]{1}[0-9]{9}$/)) {
            this.isLoading = true;
            this.employeeServices.generateOTP(consumerMobile,type).subscribe(data => {
              if(data.status) {
                this.popupMessageService.showSuccess("OTP generated successfully", "Success");
                this.isLoading = false;
                this.isOtpGenerated = true;
              }
            },(error) => {
                this.popupMessageService.showError("Can't generate OTP", "Error");
                this.isLoading = false;
            }) ;
        } else {
            this.popupMessageService.showError("Please enter a valid phone number", "Error");
        }
    }

    /**
     * Take to dashboard after login
     */
    loginRedirect(data) {
        window.localStorage['webform_emp_auth_key'] = data.token;
        window.localStorage['webform_role_id'] = data.data[0].primary_role_id;
        window.localStorage['webform_userData'] = JSON.stringify(data.data[0]);
        this.route.navigateByUrl(this.returnUrl);
        
    }
    
   
}
