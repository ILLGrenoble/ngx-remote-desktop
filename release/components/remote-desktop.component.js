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
var core_1 = require("@angular/core");
var services_1 = require("../services");
var screenfull = require("screenfull");
var animations_1 = require("@angular/animations");
/**
 * The main component for displaying a remote desktop
 */
var RemoteDesktopComponent = /** @class */ (function () {
    function RemoteDesktopComponent() {
        /**
         * Message overrides for localisation
         */
        this.messages = {
            enterFullScreen: 'Full screen',
            exitFullScreen: 'Exit Full screen',
            state: {
                disconnected: {
                    title: 'Disconnected',
                    message: 'The connection to the remote desktop terminated successfully',
                    reconnect: 'Reconnect'
                },
                connecting: {
                    title: 'Connecting to remote desktop',
                    message: 'Attempting to connect to the remote desktop. Waiting for response...',
                },
                error: {
                    title: 'Connection error',
                    message: "The remote desktop server is currently unreachable.",
                    connect: 'Connect'
                }
            }
        };
        /**
         * Full screen mode defaults to false until toggled by the user
         */
        this.isFullScreen = false;
        /**
         * Hide or show the toolbar
         */
        this.toolbarVisible = 1;
        /**
         * Guacamole has more states than the list below however for the component we only interested
         * in managing four states.
         */
        this.states = {
            CONNECTING: 'CONNECTING',
            CONNECTED: 'CONNECTED',
            DISCONNECTED: 'DISCONNECTED',
            ERROR: 'ERROR'
        };
    }
    /**
     * Subscribe to the connection state when the component is initialised
     */
    RemoteDesktopComponent.prototype.ngOnInit = function () {
        this.manager.onStateChange.subscribe(this.handleState.bind(this));
    };
    /**
     * Set the component state to the new guacamole state
     * @param newState
     */
    RemoteDesktopComponent.prototype.setState = function (newState) {
        this.state = newState;
    };
    /**
     * Connect to the remote desktop
     */
    RemoteDesktopComponent.prototype.handleConnect = function () {
        this.manager.connect();
    };
    /**
     * Check if the given state equals the current component state
     * @param newState
     */
    RemoteDesktopComponent.prototype.isState = function (newState) {
        return this.state === newState;
    };
    /**
     * Received the state from the desktop client and update this components state
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
        if (this.isFullScreen) {
            this.handleFullScreen();
        }
    };
    /**
     * Enter or exit full screen mode
     */
    RemoteDesktopComponent.prototype.handleFullScreen = function () {
        var _this = this;
        var element = this.container.nativeElement;
        screenfull.toggle(element);
        screenfull.on('change', function (change) {
            _this.isFullScreen = screenfull.isFullscreen;
            _this.handleToolbar();
        });
    };
    RemoteDesktopComponent.prototype.handleToolbar = function () {
        this.toolbarVisible = (this.isFullScreen) ? 0 : 1;
    };
    /**
     * Handle the display mouse movement
     * @param event Mouse event
     */
    RemoteDesktopComponent.prototype.handleDisplayMouseMove = function ($event) {
        if (!this.isFullScreen) {
            return;
        }
        this.showOrHideToolbar($event.x);
    };
    /**
     * Show or hide the toolbar
     * @param x
     */
    RemoteDesktopComponent.prototype.showOrHideToolbar = function (x) {
        var toolbarWidth = 170;
        if (x >= -1 && x <= 0) {
            this.toolbarVisible = 1;
        }
        if (x >= toolbarWidth) {
            this.toolbarVisible = 0;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", services_1.RemoteDesktopManager)
    ], RemoteDesktopComponent.prototype, "manager", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], RemoteDesktopComponent.prototype, "messages", void 0);
    __decorate([
        core_1.ViewChild('container'),
        __metadata("design:type", core_1.ElementRef)
    ], RemoteDesktopComponent.prototype, "container", void 0);
    RemoteDesktopComponent = __decorate([
        core_1.Component({
            selector: 'ngx-remote-desktop',
            template: "\n        <main class=\"ngx-remote-desktop\" #container>\n            <nav class=\"ngx-remote-desktop-toolbar\" \n                [class.ngx-remote-desktop-toolbar-fullscreen]=\"isFullScreen\" \n                    [@fadeInOut]=\"toolbarVisible\">\n                <ul class=\"ngx-remote-desktop-toolbar-items\">\n                    <ng-content select='ngx-remote-desktop-toolbar-item[align=left]'></ng-content>\n                </ul>\n                <ul class=\"ngx-remote-desktop-toolbar-items\">\n                    <ng-content select='ngx-remote-desktop-toolbar-item[align=right]'></ng-content>\n                    <ngx-remote-desktop-toolbar-item (click)=\"handleFullScreen()\" *ngIf=\"!isFullScreen\" \n                        [hidden]=\"!isState('CONNECTED')\">\n                        <i class=\"fa fa-arrows-alt\"> </i> {{ messages.enterFullScreen }}\n                    </ngx-remote-desktop-toolbar-item>\n                    <ngx-remote-desktop-toolbar-item (click)=\"handleFullScreen()\" *ngIf=\"isFullScreen\" \n                        [hidden]=\"!isState('CONNECTED')\">\n                        <i class=\"fa fa-arrows-alt\"> </i> {{ messages.exitFullScreen }}\n                    </ngx-remote-desktop-toolbar-item>\n                </ul>\n            </nav>\n            <section class=\"ngx-remote-desktop-container\">\n                <ngx-remote-desktop-message *ngIf=\"isState(states.CONNECTING)\"\n                    [title]=\"messages.state.connecting.title\"\n                    [message]=\"messages.state.connecting.message\"\n                    type=\"success\">\n                </ngx-remote-desktop-message>\n\n                <ngx-remote-desktop-message *ngIf=\"isState(states.ERROR)\"\n                    [title]=\"messages.state.error.title\"\n                    [message]=\"messages.state.error.message\"\n                    type=\"error\">\n                    <button (click)=\"handleConnect()\" class=\"ngx-remote-desktop-message-body-btn\">\n                        {{ messages.state.error.connect }}\n                    </button>\n                </ngx-remote-desktop-message>\n\n                <ngx-remote-desktop-message *ngIf=\"isState(states.DISCONNECTED)\"\n                    [title]=\"messages.state.disconnected.title\"\n                    [message]=\"messages.state.disconnected.message\"\n                    type=\"error\">\n                    <button (click)=\"handleConnect()\" class=\"ngx-remote-desktop-message-body-btn\">\n                        {{ messages.state.disconnected.reconnect }}\n                    </button>\n                </ngx-remote-desktop-message>\n\n                <ngx-remote-desktop-display *ngIf=\"isState(states.CONNECTED)\" \n                    [manager]=\"manager\"\n                    [isFullScreen]=\"isFullScreen\"\n                    [isFocused]=\"manager.isFocused\"\n                    (onMouseMove)=\"handleDisplayMouseMove($event)\">\n                </ngx-remote-desktop-display>                \n            </section>\n        </main>\n    ",
            encapsulation: core_1.ViewEncapsulation.None,
            animations: [
                animations_1.trigger('fadeInOut', [
                    animations_1.state('1', animations_1.style({ display: 'visible' })),
                    animations_1.state('0', animations_1.style({ opacity: 0, display: 'none' })),
                    animations_1.transition('1 => 0', animations_1.animate('1000ms')),
                    animations_1.transition('0 => 1', animations_1.animate('0ms'))
                ])
            ],
        })
    ], RemoteDesktopComponent);
    return RemoteDesktopComponent;
}());
exports.RemoteDesktopComponent = RemoteDesktopComponent;
//# sourceMappingURL=remote-desktop.component.js.map