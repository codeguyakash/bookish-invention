import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { InlineMessageService } from '../../services/message.service';

@Component({
	selector:'app-inline-message',
	templateUrl: './inline.component.html'
})

export class InlineMessageComponent {
	show = true;
	type = '';
	content = '';
    subscription: Subscription;
    constructor(
        private inlineMessageService: InlineMessageService
    ) {}

    ngOnInit() {
        this.subscription = this.inlineMessageService.inlineMessageState
        .subscribe((state) => {
            this.show = state.show;
            this.type = state.type;
            this.content = state.content;
        });
    }

    hide(){
        this.inlineMessageService.hide();
    }

    ngOnDestroy() {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }
}
