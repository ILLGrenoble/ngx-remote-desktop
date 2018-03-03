import { Component } from '@angular/core';

/**
 * Status bar component
 */
@Component({
    selector: 'ngx-remote-desktop-status-bar',
    template: `<ng-content select="ngx-remote-desktop-status-bar-item"></ng-content>`,
    host: {
        class: 'ngx-remote-desktop-status-bar'
    }
})
export class StatusBarComponent {

}
