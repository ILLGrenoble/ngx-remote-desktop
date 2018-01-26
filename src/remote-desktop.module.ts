import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    RemoteDesktopComponent,
    ToolbarItemComponent,
    MessageComponent,
    DisplayComponent

} from './components';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        /**
         * Components
         */
        RemoteDesktopComponent,
        ToolbarItemComponent,
        MessageComponent,
        DisplayComponent
        /**
         * Directives
         */
    ],
    exports: [
        RemoteDesktopComponent,
        ToolbarItemComponent
    ],
    entryComponents: [

    ],
    bootstrap: [RemoteDesktopComponent]
})
export class NgxRemoteDesktopModule {
}
