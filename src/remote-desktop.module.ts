import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    RemoteDesktopComponent,
    ToolbarItemComponent,
    MessageComponent,
    DisplayComponent,
    ErrorMessageComponent,
    DisconnectedMessageComponent,
    ConnectingMessageComponent,
    StatusBarComponent,
    StatusBarItemComponent
} from './components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
