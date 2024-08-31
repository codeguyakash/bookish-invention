import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, sequence } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
import { PopupMessageService } from '../../services/message.service';

@Component({
    selector: 'app-popup-message',
    templateUrl: './popup.component.html',
    animations: [
        trigger('slideAnimation', [
            transition('* => void', [
                style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }),
                sequence([
                    animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
                    animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none' }))
                ])
            ]),
            transition('void => active', [
                style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
                sequence([
                    animate(".1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
                    animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }))
                ])
            ])
        ])
    ]
})


export class PopupMessageComponent {
    popupMessageCollection: Array<any> = [];
    subscription: Subscription;
    constructor(
        private popupMessageService: PopupMessageService
    ) { }

    ngOnInit() {
        this.subscription = this.popupMessageService.popupMessageState
            .subscribe((state) => {
                this.addMessage(state.show, state.type, state.content, state.key);
            });

        this.runMessageClear();
    }

    addMessage(status: boolean, type: string, message: string, key: string) {
        this.popupMessageCollection.push({ status: status === true ? 'active' : 'inactive', type: type, message: message, key: key });
        this.runMessageClear();
    }

    removeMessage(index) {
        this.popupMessageCollection.splice(index, 1);
    }

    runMessageClear() {
        let timer = window.setInterval(() => {
            if (this.popupMessageCollection.length > 0)
                this.popupMessageCollection.shift();
            else
                window.clearInterval(timer);
        }, 7000);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
