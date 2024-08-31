import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { EmployeeServices } from './../../services/employee.services';
import { AlertServices } from './../../services/alert.services';
import * as globals from './../../static/static';
import { Router } from '@angular/router';
import { InlineMessageService } from './../../modules/message/services/message.service';
import { PopupMessageService } from './../../modules/message/services/message.service';

@Component({
    selector: 'app-employee-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../../assets/css/cc-styles.css', '../../../assets/css/employee-login.css']
})
export class EmployeeLoginComponent implements OnInit {
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
    constructor(
        private formBuilder: FormBuilder,
        private employeeServices: EmployeeServices,
        private alertService: AlertServices,
        private route: Router,
        private inlineMessageService: InlineMessageService,
        private popupMessageService: PopupMessageService
    ){}
    ngOnInit() {
        this.createEmployeeLoginForm();
        this.createEnterEmailForm();
        this.createNewPasswordForm();
        this.createVerifyOTP();
        this.token = localStorage.getItem('emp_auth_key');
        if ((this.token)) {
            this.route.navigateByUrl('/customer-care/lead-panel');
        }
    }
    /**
     * Employee Login
     */
    createEmployeeLoginForm(){
        this.loginEmployee = this.formBuilder.group({
            emp_email: ['', Validators.compose([Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            emp_password:['',[Validators.required]],
            emp_roleid:['',[Validators.required]]
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

        this.isSubmittedLogin = true;
        if (this.loginEmployee.valid) {
            this.isLoading = true;
            const financeRole = this.loginEmployee.controls.emp_roleid.value;
            if(financeRole == '9l') {
              this.loginEmployee.controls.emp_roleid.patchValue('9');
            }
            this.subscription = this.employeeServices.loginEmployee(this.loginEmployee.value).subscribe(data => {
                this.isLoading = false;
                if (data.status==1) {
                    if(financeRole != '9l') {
                      this.loginRedirect(data);
                      console.log("a");

                    } else {
                      localStorage.setItem('financeLegacy', 'true');
                      this.loginRedirectFinanceLegacy(data);
                      console.log("b");

                    }

                } else {
                    this.inlineMessageService.showError(data.error_message);
                }
            }, (error) => {
                this.inlineMessageService.showError("Error in response");
                }) ;
            }
    }
    ForgotPassword(){
      this.EnterEmailFP = true;
      this.forgotPassword = true;
      this.employeeLogin = false;
    }

    /**
     * Take to dashboard after login
     */
    loginRedirect(data) {
        window.localStorage['emp_auth_key'] = data.token;
        window.localStorage['role_id'] = data.data['current_role'];
        window.localStorage['userData'] = JSON.stringify(data.data[0]);
        let empData = data.data['current_role'];
        if(empData==5) {
            this.route.navigateByUrl('/customer-care/lead-panel');
        } else if(empData==22) {
            this.route.navigateByUrl('/employee-panel/lead-list-surveyor');
        }  else if(empData==8) {
            this.route.navigateByUrl('/employee-panel/lead-list-soldesign');
        } else if (empData == 17) {
            this.route.navigateByUrl('/employee-panel/lead-list-opshead');
        } else if (empData == 24) {
            this.route.navigateByUrl('/employee-panel/lead-list-partner');
        } else if (empData == 9) {
            this.route.navigateByUrl('/employee-panel/lead-list-finance');
        } else if (empData == 2) {
            this.route.navigateByUrl('/employee-panel/lead-list-aftersales');
        } else if (empData == 25) {
            this.route.navigateByUrl('/customer-care/cce-supervisor');
        } else if (empData ==  13) {
            this.route.navigateByUrl('/employee-panel/marketing');
        } else if (empData ==  26) {
            this.route.navigateByUrl('/employee-panel/admin');
        } else if (empData ==  27) {
          this.route.navigateByUrl('/employee-panel/followup');
        } else if (empData ==  28) {
          this.route.navigateByUrl('/customer-care/lead-partner');
        } else if (empData ==  29) {
          this.route.navigateByUrl('/employee-panel/project-manager');
        }  else if (empData ==  30) {
          this.route.navigateByUrl('/employee-panel/project-manager-view');
        }  else if (empData ==  4) {
          this.route.navigateByUrl('/employee-panel/auditor');
        } else {
            this.route.navigateByUrl('/');
        }
    }

    /**
     * Redirect to Finance legacy
     */
     loginRedirectFinanceLegacy(data) {
      window.localStorage['emp_auth_key'] = data.token;
      window.localStorage['role_id'] = data.data['current_role'];
      window.localStorage['userData'] = JSON.stringify(data.data[0]);
      this.route.navigateByUrl('/employee-panel/lead-list-finance-legacy');
     }
}
