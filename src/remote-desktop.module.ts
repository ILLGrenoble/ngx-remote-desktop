import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
        CommonModule
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
