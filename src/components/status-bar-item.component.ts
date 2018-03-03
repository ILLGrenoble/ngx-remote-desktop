import { Component } from '@angular/core';

/**
 * Status bar item component
 */
@Component({
    selector: 'ngx-remote-desktop-status-bar-item',
    template: `<ng-content></ng-content>`,
    host: {
        class: 'ngx-remote-desktop-status-bar-item'
    }
})
export class StatusBarItemComponent {

}
