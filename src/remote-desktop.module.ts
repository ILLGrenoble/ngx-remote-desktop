import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    ConnectingMessageComponent,
    DisconnectedMessageComponent,
    DisplayComponent,
    ErrorMessageComponent,
    MessageComponent,
    RemoteDesktopComponent,
    StatusBarComponent,
    StatusBarItemComponent,
    ToolbarItemComponent,
} from './components';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ],
    declarations: [
        RemoteDesktopComponent,
        ToolbarItemComponent,
        MessageComponent,
        DisplayComponent,
        ErrorMessageComponent,
        DisconnectedMessageComponent,
        ConnectingMessageComponent,
        StatusBarComponent,
        StatusBarItemComponent
    ],
    exports: [
        RemoteDesktopComponent,
        ToolbarItemComponent,
        ErrorMessageComponent,
        DisconnectedMessageComponent,
        ConnectingMessageComponent,
        StatusBarComponent,
        StatusBarItemComponent
    ],
    entryComponents: [

    ],
    bootstrap: [RemoteDesktopComponent]
})
export class NgxRemoteDesktopModule {
}
