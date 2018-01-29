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

import { RemoteDesktopManager } from '../services';
import { Observable } from 'rxjs';
import * as screenfull from 'screenfull';
import { trigger, state, transition, animate, style } from '@angular/animations';

/**
 * The main component for displaying a remote desktop
 */
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
                    [manager]="manager"
                    [isFullScreen]="isFullScreen"
                    [isFocused]="manager.isFocused"
                    (onMouseMove)="handleDisplayMouseMove($event)">
                </ngx-remote-desktop-display>                
            </section>
        </main>
    `,
    encapsulation: ViewEncapsulation.None,
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
    private manager: RemoteDesktopManager;

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
    private isFullScreen: boolean = false;

    /**
     * Hide or show the toolbar
     */
    private toolbarVisible: number = 1;

    /**
     * Manage the component state
     */
    private state: string;

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

    /**
     * Subscribe to the connection state when the component is initialised
     */
    ngOnInit(): void {
        this.manager.onStateChange.subscribe(this.handleState.bind(this));
    }

    /**
     * Set the component state to the new guacamole state
     * @param newState
     */
    private setState(newState: string): void {
        this.state = newState;
    }

    /**
     * Connect to the remote desktop
     */
    private handleConnect(): void {
        this.manager.connect();
    }

    /**
     * Check if the given state equals the current component state
     * @param newState 
     */
    private isState(newState: string) {
        return this.state === newState;
    }

    /**
     * Received the state from the desktop client and update this components state
     * @param newState - state received from the guacamole client
     */
    private handleState(newState: string) {
        switch (newState) {
            case RemoteDesktopManager.STATE.CONNECTED:
                this.setState(this.states.CONNECTED);
                break;
            case RemoteDesktopManager.STATE.DISCONNECTED:
                this.exitFullScreen();
                this.setState(this.states.DISCONNECTED);
                break;
            case RemoteDesktopManager.STATE.CONNECTING:
            case RemoteDesktopManager.STATE.WAITING:
                this.setState(this.states.CONNECTING);
                break;
            case RemoteDesktopManager.STATE.CLIENT_ERROR:
            case RemoteDesktopManager.STATE.TUNNEL_ERROR:
                this.exitFullScreen();
                this.setState(this.states.ERROR);
                break;
        }
    }

    /**
     * Exit full screen and show the toolbar
     */
    private exitFullScreen(): void {
        if (this.isFullScreen) {
            this.handleFullScreen();
        }
    }

    /**
     * Enter or exit full screen mode
     */
    private handleFullScreen(): void {
        const element = this.container.nativeElement;
        screenfull.toggle(element);
        screenfull.on('change', (change: any) => {
            this.isFullScreen = screenfull.isFullscreen;
            this.handleToolbar();
        });
    }

    private handleToolbar(): void {
        this.toolbarVisible = (this.isFullScreen) ? 0 : 1;
    }

    /**
     * Handle the display mouse movement
     * @param event Mouse event
     */
    private handleDisplayMouseMove($event: any): void {
        if (!this.isFullScreen) {
            return;
        }
        this.showOrHideToolbar($event.x);
    }

    /**
     * Show or hide the toolbar
     * @param x
     */
    private showOrHideToolbar(x: number): void {
        const toolbarWidth = 170;

        if (x >= -1 && x <= 0) {
            this.toolbarVisible = 1;
        }
        if (x >= toolbarWidth) {
            this.toolbarVisible = 0;
        }
    }
}
