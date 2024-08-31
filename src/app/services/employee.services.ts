import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, BehaviorSubject} from 'rxjs/Rx';
import { SharedServices } from './shared.services';
import * as globals from './../static/static'
import 'rxjs/Rx';
@Injectable()
export class EmployeeServices {

    constructor(
        private http: Http,
        private sharedService:SharedServices
    ){
    }

    /**
     * Login Employee
     * @return Subscription
     */
    loginEmployee(employeeloginDetails:any):Observable<any>{
        return this.sharedService.post(globals.APIS.EMPLOYEE_LOGIN,employeeloginDetails);
    }

    verifyEmailForgotPassword(employeeEmail:any) {
      return this.sharedService.post(globals.APIS.EMAIL_FORGOT_PASSWORD ,employeeEmail);
    }

    verifyOTP(otp: any) {
      return this.sharedService.post(globals.APIS.VERIFY_OTP_FORGOT_PASSWORD, otp);
    }

    verifyPassword(password: any) {
      return this.sharedService.post(globals.APIS.UPDATE_PASSWORD, password);
    }
    

    getvalidurl_task_partner(data:any){
        return this.sharedService.post(globals.APIS.GET_VALID_URL_TASK, data);
    }

    SaveTaskData(data:any){
        return this.sharedService.post(globals.APIS.SAVE_TASK_NOTIFY_PARTNER, data);
    }

    getTaskdata(data:any){
        return this.sharedService.post(globals.APIS.GET_TASK_INFO_TASKID_PPID, data);
    }

    generateOTP(mobileNumber:Number,otpType:any){
        return this.sharedService.get(`${globals.APIS.GENERATE_OTP}${mobileNumber}${'/'}${otpType}`);        
    }

    loginUser(consumerloginDetails:any):Observable<any>{
      return this.sharedService.post(globals.APIS.EMPLOYEE_LOGIN_OTP,consumerloginDetails);
    }


}
