import {
    Component,
    Input
} from '@angular/core';

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
    private title: string;

    /**
     * Content of the message to display
     */
    @Input()
    private message: string;

    /**
     * Message type. Can be 'success' or 'error'
     */
    @Input()
    private type = 'success';
}
