import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InlineMessageService {
	private inlineMessageSubject = new Subject<{show: boolean,type: string, content: string}>();
    inlineMessageState = this.inlineMessageSubject.asObservable();
    
    constructor() {}
    
	showError(content: string) {
        this.inlineMessageSubject.next({show: true,type: 'danger', content:content});
    	setTimeout(() => {
    		this.hide();
    	}, 10000);
    }

    showSuccess(content: string){
    	this.inlineMessageSubject.next({show: true,type: 'success', content:content});
    	setTimeout(() => {
    		this.hide();
    	}, 10000);
    }

	
	hide() {
    	this.inlineMessageSubject.next({show: false, type: '', content:''});
    }
}


@Injectable()
export class PopupMessageService {
	private popupMessageSubject = new Subject<{show: boolean,type: string, content: string, key: string}>();
    popupMessageState = this.popupMessageSubject.asObservable();
    
    constructor() {}
    
	showError(content: string, key: string) {
        this.popupMessageSubject.next({show: true,type: 'error', content:content, key: key});
    }

    showSuccess(content: string, key: string){
    	this.popupMessageSubject.next({show: true,type: 'success', content:content, key: key});
	}
	
	showInfo(content: string, key: string){
    	this.popupMessageSubject.next({show: true,type: 'info', content:content, key: key});
    }

	findShowMessage(data: any, key: string){
		if(data.messages.length > 0){
			for(let error in data.messages[0]) {
				if(data.messages[0].hasOwnProperty(error)) {
					this.showError(data.messages[0][error], key);
					break;
				}
			}
		} else {
			this.showError(data.message, key);
		}
	}
	
	hideMessage(){
		this.popupMessageSubject.next({show: false,type: '', content:'', key: ''});
	}
}