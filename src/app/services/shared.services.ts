import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/operator/map';
import 'rxjs/operator/share';
import { Observable} from 'rxjs/Rx';
import * as globals from './../static/static'

@Injectable()
export class SharedServices {
    public isLogged: Subject<boolean> = new Subject<boolean>();
    public isLoggedUsername: Subject<boolean> = new Subject<boolean>();

    public searchForm = new BehaviorSubject('');
    public project_type = new BehaviorSubject('');
    public view_type = new BehaviorSubject('');
    public formDataSmartSearch = new BehaviorSubject('');

    public partnerListType = new BehaviorSubject('');

    public cceCurrentLeadId = '';

    headers:any;
    consumer_role: any = globals.ROLES.CONSUMER_ROLE;
    constructor(
        private http: Http
    ){}

    /**
     * Show Login Popup
     */
    public userData: Subject<boolean> = new Subject<boolean>();
    showLoginPopupSource = new Subject<{ show: boolean, step: number }>();
    showLoginPopupListner = this.showLoginPopupSource.asObservable();
    showLoginPopup(show: boolean, step: number) {
        this.showLoginPopupSource.next({ show: show, step: step });
    }
     /**
     * Post data to server
     * @method post
     * @param  {string}          url
     * @param  {any}             data
     * @param  {any}             option
     * @return {Observable<any>}
     */
    public post(url: string, data: any, option?: any, loader: boolean = true): Observable<any> {
      //  console.log(data,'data');
        
        return this.http.post(url, data,option) // ...using post request
            .map((res: Response) => {
                return res.json();
            })
            .share();
    }

    /**
     * Get data from server
     * @method get
     * @param  {string}          url
     * @param  {boolean}         loader
     * @return {Observable<any>}
     */
    public get(url: string,options?: any, loader: boolean = true): Observable<any> {
        return this.http.get(url,options)
            .map((response: Response) => {
                return response.json();
            })
            .share();
    }

    /**
     * Docs To Base 64
     */
    docsToBase64(element: any, allowedFiles: Array<string>) {
        return new Promise((resolve, reject) => {
            let _URL = window.URL;
            let file = element.target.files[0];
            let rejectMessage: Array<any> = [];
            let image = new Image();
            if (allowedFiles.indexOf(element.target.files[0].name.split('.').pop()) != -1 || allowedFiles.indexOf('*') != -1) {
                this.readFile(element.target).then((data) => {
                    resolve(data);
                })
            } else {
                // allowedFiles.forEach((elem) => {
                //     // if (elem.split('/')[1] != 'msword' && elem.split('/')[1] != 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
                //         rejectMessage.push(elem);
                //     // }
                // })
                reject('Invalid file type!.');
            }
        });
    }

    readFile(inputValue: any) {
        return new Promise((resolve) => {
            let file: File = inputValue.files[0];
            let reader: FileReader = new FileReader();
            reader.onload = (e => {
                resolve(reader.result);
            });
            reader.readAsDataURL(file);
        })
    }




    //Shared API Hits

    /**
     * Upload Spce Document
     * @param spceId number
     * @param documentBase64 string
     * @return Subscribe
     */
    uploadSpceDocument(pId: Number, documentId: any, documentBase64: String, ext: String, extType: any,filename: any = null) {
        let role_id = localStorage.getItem('role_id');
        let creater_id:number;
        let creater = JSON.parse(localStorage.getItem('userData'));
        this.headers = new Headers();
        if (localStorage.getItem('role_id') == this.consumer_role){
            this.headers.append('Authorize', localStorage.getItem('auth_key'));
            creater_id = creater.consumer_id;
        }else{
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
            creater_id = creater.emp_id;
        }
        return this.http.post(globals.APIS.UPLOAD_FILES, { pdoc_projecitid: pId, file: documentBase64, pdoc_filename: documentId, pdoc_roleid: role_id, pdoc_createdby: creater_id, extension: ext, extension_type: extType, filename }, { headers: this.headers }).map((res: Response) => res.json()).share();
    }

    uploadSupplyOrderDoc(data) {
        let role_id = localStorage.getItem('role_id');
        let creater_id:number;
        let creater = JSON.parse(localStorage.getItem('userData'));
        this.headers = new Headers();
        if (localStorage.getItem('role_id') == this.consumer_role){
            this.headers.append('Authorize', localStorage.getItem('auth_key'));
            creater_id = creater.consumer_id;
        }else{
            this.headers.append('Authorize', localStorage.getItem('emp_auth_key'));
            creater_id = creater.emp_id;
        }
        return this.http.post(globals.APIS.UPLOAD_SO_FILES, data, { headers: this.headers }).map((res: Response) => res.json()).share();

    }

    saveExtraDetails(){
        return this.get(globals.APIS.SAVE_EXTRA_DETAILS);
    }

    getFaqs(keywords:any){
        return this.get(globals.APIS.GET_FAQS + '?keywords='+keywords);
    }

    uploadPayments(payment_category: any, documentBase64: String, ext: String, extType: any) {
        this.headers = new Headers();
        this.headers.append('Authorize', localStorage.getItem('auth_key'));
        return this.http.post(globals.APIS.UPLOAD_PAYMENTS, {file: documentBase64, file_name: payment_category, extension: ext, extension_type: extType }, { headers: this.headers }).map((res: Response) => res.json()).share();
    }

    sendCustomerIoData(url:any) {
        let userMobile:0;
        let userData;

        if (localStorage.getItem('auth_key')) {
             userData = JSON.parse(localStorage.getItem('userData'));
             userMobile = userData.consumer_mobileno;
         }

        return this.post(globals.APIS.SAVE_CUSTOMER_IO, { mobile:userMobile, page: url});
    }

    getDateInFormat(dateinput){
        let date=new Date();
        if(dateinput !=''){
         date = new Date(dateinput);
        }
        return date.getFullYear()+'-'+ (date.getMonth()+1) +'-'+date.getDate();
    }

    getTimeInFormat(dateinput){
        let date=new Date();
        if(dateinput !=''){
         date = new Date(dateinput);
        }
        return date.getHours()+':'+date.getMinutes()+':'+'00';
    }
    
    getTimeInMilliseconds(dateinput){
        let date = new Date(dateinput);
        return date.getTime();
    }

    getPartnerQueryStatusName(status:any){
        let statusNames = ['New - Partner Query',
                        'Completed Partner Query Form',
                        'Converted To Lead',
                        'No Response - Partner Query',
                        'Reschedule - Partner Query'];
        if(status>=0){
            return statusNames[status];
        } else {
            return 'N/A';
        }
        
    }

    uploadTaskDocument(h_id: Number, task_id: Number, pp_id: Number, milestone_id: Number, filename: any, documentBase64: String, ext: String, extType: any, is_audit, isWebForm?:any) {
        let role_id;
        let creater;
        if(isWebForm) {
            role_id = localStorage.getItem('webform_role_id');
            creater = JSON.parse(localStorage.getItem('webform_userData'));
          } else {
            role_id = localStorage.getItem('role_id');
            creater = JSON.parse(localStorage.getItem('userData'));
          }
        let creater_id:number;
        this.headers = new Headers();
        creater_id = creater.emp_id;
        let formData =  { hid: h_id,
                          task_id: task_id,
                          pp_id: pp_id,
                          milestone_id: milestone_id,
                          file: documentBase64, 
                          filename: filename, roleid: role_id, 
                          createdby: creater_id, 
                          extension: ext, 
                          is_audit:is_audit,
                          extension_type: extType };
        return this.http.post(globals.APIS.UPLOAD_TASK_DOCUMENTS+ '/?irdi=' + role_id, formData, { headers: this.headers }).map((res: Response) => res.json()).share();
    }
}
