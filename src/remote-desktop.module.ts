import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    RemoteDesktopComponent,
    ToolbarItemComponent,
    MessageComponent,
    DisplayComponent,
    ErrorMessageComponent,
    DisconnectedMessageComponent,
    ConnectingMessageComponent
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
        ConnectingMessageComponent
    ],
    exports: [
        RemoteDesktopComponent,
        ToolbarItemComponent,
        ErrorMessageComponent,
        DisconnectedMessageComponent,
        ConnectingMessageComponent
    ],
    entryComponents: [

    ],
    bootstrap: [RemoteDesktopComponent]
})
export class NgxRemoteDesktopModule {
}
