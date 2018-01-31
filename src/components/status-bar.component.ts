import {
    Component
} from '@angular/core';

/**
 * Status bar component
 */
@Component({
    selector: 'ngx-remote-desktop-status-bar',
    template: `<ng-content></ng-content>`,
    host: {
        class: 'ngx-remote-desktop-status-bar'
    }
})
export class StatusBarComponent {

}
