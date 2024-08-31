import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { InlineMessageComponent } from './components/inline/inline.component';
import { PopupMessageComponent } from './components/popup/popup.component';
import { InlineMessageService } from './services/message.service';
import { PopupMessageService } from './services/message.service';


@NgModule({
    declarations: [
        InlineMessageComponent,
        PopupMessageComponent
    ],
    exports: [
        InlineMessageComponent,
        PopupMessageComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ],
    providers: [
        InlineMessageService,
        PopupMessageService
    ]
})
export class MessageModule {}