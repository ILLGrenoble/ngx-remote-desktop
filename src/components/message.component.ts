import {
    Component,
    Input
} from '@angular/core';

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

    @Input()
    private title;

    @Input()
    private message;

    @Input()
    private type = 'success';
}
