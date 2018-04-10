"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var screenfull = require("screenfull");
var services_1 = require("../services");
var connecting_message_component_1 = require("./messages/connecting-message.component");
var disconnected_message_component_1 = require("./messages/disconnected-message.component");
var error_message_component_1 = require("./messages/error-message.component");
/**
 * The main component for displaying a remote desktop
 */
var RemoteDesktopComponent = /** @class */ (function () {
    function RemoteDesktopComponent() {
        /**
         * Guacamole has more states than the list below however for the component we are only interested
         * in managing four states.
         */
        this.states = {
            CONNECTING: 'CONNECTING',
            CONNECTED: 'CONNECTED',
            DISCONNECTED: 'DISCONNECTED',
            ERROR: 'ERROR'
        };
        /**
         * Manage the component state
         */
        this.state = new rxjs_1.BehaviorSubject(this.states.CONNECTING);
        /**
         * Subscriptions
         */
        this.subscriptions = [];
        /**
         * Hide or show the toolbar
         */
        this.toolbarVisible = true;
    }
    /**
     * Subscribe to the connection state  and full screen state when the component is initialised
     */
    RemoteDesktopComponent.prototype.ngOnInit = function () {
        this.bindSubscriptions();
    };
    /**
     * Remove all subscriptions when the component is destroyed
     */
    RemoteDesktopComponent.prototype.ngOnDestroy = function () {
        this.unbindSubscriptions();
    };
    /**
     * Bind the subscriptions
     */
    RemoteDesktopComponent.prototype.bindSubscriptions = function () {
        this.subscriptions.push(this.manager.onStateChange.subscribe(this.handleState.bind(this)));
        this.subscriptions.push(this.manager.onFullScreen.subscribe(this.handleFullScreen.bind(this)));
    };
    /**
     * Unbind the subscriptions
     */
    RemoteDesktopComponent.prototype.unbindSubscriptions = function () {
        this.subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    /**
     * Set the component state to the new guacamole state
     * @param newState
     */
    RemoteDesktopComponent.prototype.setState = function (newState) {
        this.state.next(newState);
    };
    /**
     * Receive the state from the desktop client and update this components state
     * @param newState - state received from the guacamole client
     */
    RemoteDesktopComponent.prototype.handleState = function (newState) {
        switch (newState) {
            case services_1.RemoteDesktopManager.STATE.CONNECTED:
                this.setState(this.states.CONNECTED);
                break;
            case services_1.RemoteDesktopManager.STATE.DISCONNECTED:
                this.exitFullScreen();
                this.setState(this.states.DISCONNECTED);
                break;
            case services_1.RemoteDesktopManager.STATE.CONNECTING:
            case services_1.RemoteDesktopManager.STATE.WAITING:
                this.setState(this.states.CONNECTING);
                break;
            case services_1.RemoteDesktopManager.STATE.CLIENT_ERROR:
            case services_1.RemoteDesktopManager.STATE.TUNNEL_ERROR:
                this.exitFullScreen();
                this.setState(this.states.ERROR);
                break;
        }
    };
    /**
     * Exit full screen and show the toolbar
     */
    RemoteDesktopComponent.prototype.exitFullScreen = function () {
        if (!screenfull.isFullscreen) {
            return;
        }
        var containerElement = this.container.nativeElement;
        screenfull.exit(containerElement);
    };
    /**
     * Enter full screen mode and auto hide the toolbar
     */
    RemoteDesktopComponent.prototype.enterFullScreen = function () {
        var _this = this;
        if (screenfull.isFullscreen) {
            return;
        }
        var containerElement = this.container.nativeElement;
        screenfull.request(containerElement);
        screenfull.on('change', function (change) {
            if (!screenfull.isFullscreen) {
                _this.manager.setFullScreen(false);
            }
            _this.handleToolbar();
        });
    };
    /**
     * Go in and out of full screen
     */
    RemoteDesktopComponent.prototype.handleFullScreen = function (newFullScreen) {
        if (newFullScreen) {
            this.enterFullScreen();
        }
        else {
            this.exitFullScreen();
        }
    };
    RemoteDesktopComponent.prototype.handleToolbar = function () {
        this.toolbarVisible = (this.manager.isFullScreen()) ? false : true;
    };
    /**
     * Handle the display mouse movement
     * @param event Mouse event
     */
    RemoteDesktopComponent.prototype.handleDisplayMouseMove = function ($event) {
        if (!this.manager.isFullScreen()) {
            return;
        }
        var toolbarWidth = this.toolbar.nativeElement.clientWidth;
        if ($event.x >= toolbarWidth) {
            this.toolbarVisible = false;
        }
    };
    RemoteDesktopComponent.prototype.onDocumentMousemove = function ($event) {
        if (!this.manager.isFullScreen()) {
            return;
        }
        var toolbarWidth = this.toolbar.nativeElement.clientWidth;
        var x = $event.x;
        if (x >= -1 && x <= 0) {
            this.toolbarVisible = true;
        }
        if (x >= toolbarWidth) {
            this.toolbarVisible = false;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", services_1.RemoteDesktopManager)
    ], RemoteDesktopComponent.prototype, "manager", void 0);
    __decorate([
        core_1.ContentChild(connecting_message_component_1.ConnectingMessageComponent),
        __metadata("design:type", connecting_message_component_1.ConnectingMessageComponent)
    ], RemoteDesktopComponent.prototype, "connectingMessage", void 0);
    __decorate([
        core_1.ContentChild(disconnected_message_component_1.DisconnectedMessageComponent),
        __metadata("design:type", disconnected_message_component_1.DisconnectedMessageComponent)
    ], RemoteDesktopComponent.prototype, "disconnectedMessage", void 0);
    __decorate([
        core_1.ContentChild(error_message_component_1.ErrorMessageComponent),
        __metadata("design:type", error_message_component_1.ErrorMessageComponent)
    ], RemoteDesktopComponent.prototype, "errorMessage", void 0);
    __decorate([
        core_1.ViewChild('container'),
        __metadata("design:type", core_1.ElementRef)
    ], RemoteDesktopComponent.prototype, "container", void 0);
    __decorate([
        core_1.ViewChild('toolbar'),
        __metadata("design:type", core_1.ElementRef)
    ], RemoteDesktopComponent.prototype, "toolbar", void 0);
    __decorate([
        core_1.HostListener('document:mousemove', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], RemoteDesktopComponent.prototype, "onDocumentMousemove", null);
    RemoteDesktopComponent = __decorate([
        core_1.Component({
            selector: 'ngx-remote-desktop',
            template: "\n        <main class=\"ngx-remote-desktop\" #container>\n            <!-- Toolbar items template -->\n            <ng-template #toolbarItems>\n                <ul class=\"ngx-remote-desktop-toolbar-items\">\n                    <ng-content select='ngx-remote-desktop-toolbar-item[align=left]'></ng-content>\n                </ul>\n                <ul class=\"ngx-remote-desktop-toolbar-items\">\n                    <ng-content select='ngx-remote-desktop-toolbar-item[align=right]'></ng-content>\n                </ul>\n            </ng-template>\n            <!-- End toolbar items template -->\n            <!-- Normal toolbar -->\n            <nav class=\"ngx-remote-desktop-toolbar\" *ngIf=\"!manager.isFullScreen()\" >\n                <template [ngTemplateOutlet]=\"toolbarItems\"></template>\n            </nav>\n            <!-- End normal toolbar -->\n            <!-- Full screen toolbar -->\n            <nav class=\"ngx-remote-desktop-toolbar ngx-remote-desktop-toolbar-fullscreen\" *ngIf=\"manager.isFullScreen()\"\n                [@toolbarAnimation]=\"toolbarVisible\" #toolbar>\n                <template [ngTemplateOutlet]=\"toolbarItems\"></template>\n            </nav>\n            <!-- End full screen toolbar -->\n            <section class=\"ngx-remote-desktop-container\">\n                <!-- Connecting message -->\n                <div *ngIf=\"(state|async) === states.CONNECTING\">\n                    <div class=\"ngx-remote-desktop-message\" *ngIf=\"connectingMessage\" >\n                        <ng-content select=\"ngx-remote-desktop-connecting-message\"></ng-content>\n                    </div>\n                    <ngx-remote-desktop-message  *ngIf=\"!connectingMessage\"\n                        title=\"Connecting to remote desktop\"\n                        message=\"Attempting to connect to the remote desktop. Waiting for response...\"\n                        type=\"success\">\n                    </ngx-remote-desktop-message>\n                </div>\n                <!-- End connecting message -->\n\n                <!-- Disconnected message -->\n                <div *ngIf=\"(state|async) === states.DISCONNECTED\">\n                    <div class=\"ngx-remote-desktop-message\" *ngIf=\"disconnectedMessage\">\n                        <ng-content select=\"ngx-remote-desktop-disconnected-message\"></ng-content>\n                    </div>\n                    <ngx-remote-desktop-message *ngIf=\"!disconnectedMessage\"\n                        title=\"Disconnected\"\n                        message=\"The connection to the remote desktop terminated successfully\"\n                        type=\"error\">\n                        <button (click)=\"manager.onReconnect.next(true)\" class=\"ngx-remote-desktop-message-body-btn\">\n                            Reconnect\n                        </button>\n                    </ngx-remote-desktop-message>\n                </div>\n                <!-- End disconnected message -->\n                \n                <!-- Error message -->\n                <div *ngIf=\"(state|async) === states.ERROR\">\n                    <div class=\"ngx-remote-desktop-message\" *ngIf=\"errorMessage\">\n                        <ng-content select=\"ngx-remote-desktop-error-message\"></ng-content>\n                    </div>\n\n                    <ngx-remote-desktop-message *ngIf=\"!errorMessage\"\n                        title=\"Connection error\"\n                        message=\"The remote desktop server is currently unreachable.\"\n                        type=\"error\">\n                        <button (click)=\"manager.onReconnect.next(true)\" class=\"ngx-remote-desktop-message-body-btn\">\n                            Connect\n                        </button>\n                    </ngx-remote-desktop-message>\n                </div>\n                <!-- End error message -->\n                \n                <!-- Display -->\n                <ngx-remote-desktop-display *ngIf=\"(state|async) === states.CONNECTED\"\n                    [manager]=\"manager\"\n                    (onMouseMove)=\"handleDisplayMouseMove($event)\">\n                </ngx-remote-desktop-display>                \n                <!-- End display -->\n            </section>\n            <section [class.ngx-remote-desktop-status-bar-hidden]=\"manager.isFullScreen()\">\n                <ng-content select=\"ngx-remote-desktop-status-bar\"></ng-content>\n            </section>\n        </main>\n    ",
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.Default,
            animations: [
                animations_1.trigger('toolbarAnimation', [
                    animations_1.state('1', animations_1.style({ transform: 'translateX(0%)' })),
                    animations_1.state('0', animations_1.style({ transform: 'translateX(-100%)' })),
                    animations_1.transition('1 => 0', animations_1.animate('200ms 200ms ease-out')),
                    animations_1.transition('0 => 1', animations_1.animate('225ms ease-in'))
                ])
            ],
        })
    ], RemoteDesktopComponent);
    return RemoteDesktopComponent;
}());
exports.RemoteDesktopComponent = RemoteDesktopComponent;
//# sourceMappingURL=remote-desktop.component.js.map