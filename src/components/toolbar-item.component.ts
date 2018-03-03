import { Component } from '@angular/core';

/**
 * Toolbar item inside the toolbar
 */
@Component({
    selector: 'ngx-remote-desktop-toolbar-item',
    template: `<li class="ngx-remote-desktop-toolbar-item"><ng-content></ng-content></li>`
})
export class ToolbarItemComponent {

}
