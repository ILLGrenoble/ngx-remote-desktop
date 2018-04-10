import { Component, Input } from '@angular/core';

/**
 * Message component for showing error or success messages for when the connection
 * state changes
 */
@Component({
    selector: 'ngx-remote-desktop-message',
    template: `
        <div class="ngx-remote-desktop-message">
            <div class="ngx-remote-desktop-message-title"
                [class.ngx-remote-desktop-message-title-success]="type === 'success'"
                [class.ngx-remote-desktop-message-title-error]="type === 'error'">
            {{ title | uppercase }}
            </div>
            <div class="ngx-remote-desktop-message-body">
                <p>{{ message }}</p>
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class MessageComponent {

    /**
     * Title of the message to display
     */
    @Input()
    public title: string;

    /**
     * Content of the message to display
     */
    @Input()
    public message: string;

    /**
     * Message type. Can be 'success' or 'error'
     */
    @Input()
    public type = 'success';
}
