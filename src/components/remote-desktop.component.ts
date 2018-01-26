import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    ViewEncapsulation,
    HostListener,
    OnChanges
} from '@angular/core';

import { RemoteDesktopService } from '../services';
import { Observable } from 'rxjs';
import * as screenfull from 'screenfull';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
    selector: 'ngx-remote-desktop',
    template: `
        <main class="ngx-remote-desktop" #container>
            <nav class="ngx-remote-desktop-toolbar" 
                [class.ngx-remote-desktop-toolbar-fullscreen]="isFullScreen" 
                    [@fadeInOut]="toolbarVisible">
                <ul class="ngx-remote-desktop-toolbar-items">
                    <ng-content select='ngx-remote-desktop-toolbar-item[align=left]'></ng-content>
                </ul>
                <ul class="ngx-remote-desktop-toolbar-items">
                    <ng-content select='ngx-remote-desktop-toolbar-item[align=right]'></ng-content>
                    <ngx-remote-desktop-toolbar-item (click)="handleFullScreen()" *ngIf="!isFullScreen" 
                        [hidden]="!isState('CONNECTED')">
                        <i class="fa fa-arrows-alt"> </i> {{ messages.enterFullScreen }}
                    </ngx-remote-desktop-toolbar-item>
                    <ngx-remote-desktop-toolbar-item (click)="handleFullScreen()" *ngIf="isFullScreen" 
                        [hidden]="!isState('CONNECTED')">
                        <i class="fa fa-arrows-alt"> </i> {{ messages.exitFullScreen }}
                    </ngx-remote-desktop-toolbar-item>
                </ul>
            </nav>
            <section class="ngx-remote-desktop-container">
                <ngx-remote-desktop-message *ngIf="isState(states.CONNECTING)"
                    [title]="messages.state.connecting.title"
                    [message]="messages.state.connecting.message"
                    type="success">
                </ngx-remote-desktop-message>

                <ngx-remote-desktop-message *ngIf="isState(states.ERROR)"
                    [title]="messages.state.error.title"
                    [message]="messages.state.error.message"
                    type="error">
                    <button (click)="handleConnect()" class="ngx-remote-desktop-message-body-btn">
                        {{ messages.state.error.connect }}
                    </button>
                </ngx-remote-desktop-message>

                <ngx-remote-desktop-message *ngIf="isState(states.DISCONNECTED)"
                    [title]="messages.state.disconnected.title"
                    [message]="messages.state.disconnected.message"
                    type="error">
                    <button (click)="handleConnect()" class="ngx-remote-desktop-message-body-btn">
                        {{ messages.state.disconnected.reconnect }}
                    </button>
                </ngx-remote-desktop-message>

                <ngx-remote-desktop-display *ngIf="isState(states.CONNECTED)" 
                    [client]="client"
                    [isFullScreen]="isFullScreen"
                    [isFocused]="isFocused"
                    (onMouseMove)="handleDisplayMouseMove($event)">
                </ngx-remote-desktop-display>                
            </section>
        </main>
    `,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../themes/default.scss'],
    animations: [
        trigger('fadeInOut', [
            state('1', style({ display: 'visible' })),
            state('0', style({ opacity: 0, display: 'none' })),
            transition('1 => 0', animate('1000ms')),
            transition('0 => 1', animate('0ms'))
        ])
    ],
})
export class RemoteDesktopComponent implements OnInit {
    /**
     * Client that manages the connection to the remote desktop
     */
    @Input()
    private client: RemoteDesktopService;

    /**
     * Binds the display input listeners (keyboard and mouse) if set to true
     */
    @Input('focused')
    private isFocused = true;

    /**
     * Message overrides for localisation
     */
    @Input()
    private messages: any = {
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
                message: `The remote desktop server is currently unreachable.`,
                connect: 'Connect'
            }
        }
    };

    @ViewChild('container')
    private container: ElementRef;

    /**
     * Full screen mode defaults to false until toggled by the user
     */
    private isFullScreen = false;

    /**
     * Hide or show the toolbar
     */
    private toolbarVisible = 1;

    /**
     * Manage the component state
     */
    private state;

    /**
     * Guacamole has more states than the list below however for the component we only interested
     * in managing four states.
     */
    private states = {
        CONNECTING: 'CONNECTING',
        CONNECTED: 'CONNECTED',
        DISCONNECTED: 'DISCONNECTED',
        ERROR: 'ERROR'
    };

    ngOnInit(): void {
        this.client.onStateChange.subscribe(this.handleState.bind(this));
    }

    /**
     * Set the component state to the new guacamole state
     * @param newState
     */
    private setState(newState): void {
        this.state = newState;
    }

    /**
     * Connect to the remote desktop
     */
    private handleConnect(): void {
        this.client.connect();
    }

    /**
     * Check if the given state equals the current component state
     * @param newState 
     */
    private isState(newState) {
        return this.state === newState;
    }

    /**
     * Received the state from the desktop client and update this components state
     * @param newState - state received from the guacamole client
     */
    private handleState(newState) {
        switch (newState) {
            case RemoteDesktopService.STATE.CONNECTED:
                this.setState(this.states.CONNECTED);
                break;
            case RemoteDesktopService.STATE.DISCONNECTED:
                this.exitFullScreen();
                this.setState(this.states.DISCONNECTED);
                break;
            case RemoteDesktopService.STATE.CONNECTING:
            case RemoteDesktopService.STATE.WAITING:
                this.setState(this.states.CONNECTING);
                break;
            case RemoteDesktopService.STATE.CLIENT_ERROR:
            case RemoteDesktopService.STATE.TUNNEL_ERROR:
                this.exitFullScreen();
                this.setState(this.states.ERROR);
                break;
        }
    }

    /**
     * Exit full screen and show the toolbar
     */
    private exitFullScreen() {
        if (this.isFullScreen) {
            this.handleFullScreen();
        }
    }

    /**
     * Enter and exit full screen mode
     */
    private handleFullScreen(): void {
        const element = this.container.nativeElement;
        screenfull.toggle(element);
        screenfull.on('change', (change) => {
            this.isFullScreen = screenfull.isFullscreen;
            this.handleToolbar();
        });
    }

    private handleToolbar(): void {
        this.toolbarVisible = (this.isFullScreen) ? 0 : 1;
    }

    private handleDisplayMouseMove($event): void {
        if (!this.isFullScreen) {
            return;
        }
        this.showOrHideToolbar($event.x);
    }

    private showOrHideToolbar(x): void {
        const toolbarWidth = 170;

        if (x >= -1 && x <= 0) {
            this.toolbarVisible = 1;
        }
        if (x >= toolbarWidth) {
            this.toolbarVisible = 0;
        }
    }
}
