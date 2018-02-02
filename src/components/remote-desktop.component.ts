import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    ViewEncapsulation,
    HostListener,
    OnChanges,
    forwardRef,
    ContentChild,
    DoCheck
} from '@angular/core';

import { RemoteDesktopManager } from '../services';
import { Observable } from 'rxjs';
import * as screenfull from 'screenfull';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ConnectingMessageComponent } from './messages/connecting-message.component';
import { DisconnectedMessageComponent } from './messages/disconnected-message.component';
import { ErrorMessageComponent } from './messages/error-message.component';

/**
 * The main component for displaying a remote desktop
 */
@Component({
    selector: 'ngx-remote-desktop',
    template: `
        <main class="ngx-remote-desktop" #container>
            <!-- Toolbar items template -->
            <ng-template #toolbarItems>
                <ul class="ngx-remote-desktop-toolbar-items">
                    <ng-content select='ngx-remote-desktop-toolbar-item[align=left]'></ng-content>
                </ul>
                <ul class="ngx-remote-desktop-toolbar-items">
                    <ng-content select='ngx-remote-desktop-toolbar-item[align=right]'></ng-content>
                </ul>
            </ng-template>
            <!-- End toolbar items template -->
            <!-- Normal toolbar -->
            <nav class="ngx-remote-desktop-toolbar" *ngIf="!manager.isFullScreen()" >
                <template [ngTemplateOutlet]="toolbarItems"></template>
            </nav>
            <!-- End normal toolbar -->
            <!-- Full screen toolbar -->
            <nav class="ngx-remote-desktop-toolbar ngx-remote-desktop-toolbar-fullscreen" *ngIf="manager.isFullScreen()"
                [@toolbarAnimation]="toolbarVisible" #toolbar>
                <template [ngTemplateOutlet]="toolbarItems"></template>
            </nav>
            <!-- End full screen toolbar -->
            <section class="ngx-remote-desktop-container">
                <!-- Connecting message -->
                <div *ngIf="isState(states.CONNECTING)">
                    <div class="ngx-remote-desktop-message" *ngIf="connectingMessage" >
                        <ng-content select="ngx-remote-desktop-connecting-message"></ng-content>
                    </div>
        
                    <ngx-remote-desktop-message  *ngIf="!connectingMessage"
                        title="Connecting to remote desktop"
                        message="Attempting to connect to the remote desktop. Waiting for response..."
                        type="success">
                    </ngx-remote-desktop-message>
                </div>
                <!-- End connecting message -->

                <!-- Disconnected message -->
                <div *ngIf="isState(states.DISCONNECTED)">
                    <div class="ngx-remote-desktop-message" *ngIf="disconnectedMessage">
                        <ng-content select="ngx-remote-desktop-disconnected-message"></ng-content>
                    </div>
                    <ngx-remote-desktop-message *ngIf="!disconnectedMessage"
                        title="Disconnected"
                        message="The connection to the remote desktop terminated successfully"
                        type="error">
                        <button (click)="handleConnect()" class="ngx-remote-desktop-message-body-btn">
                            Reconnect
                        </button>
                    </ngx-remote-desktop-message>
                </div>
                <!-- End disconnected message -->
                
                <!-- Error message -->
                <div *ngIf="isState(states.ERROR)">

                    <div class="ngx-remote-desktop-message" *ngIf="errorMessage">
                        <ng-content select="ngx-remote-desktop-error-message"></ng-content>
                    </div>

                    <ngx-remote-desktop-message *ngIf="!errorMessage"
                        title="Connection error"
                        message="The remote desktop server is currently unreachable."
                        type="error">
                        <button (click)="handleConnect()" class="ngx-remote-desktop-message-body-btn">
                            Connect
                        </button>
                    </ngx-remote-desktop-message>
                </div>
                <!-- End error message -->
                
                <!-- Display -->
                <ngx-remote-desktop-display *ngIf="isState(states.CONNECTED)" 
                    [manager]="manager"
                    (onMouseMove)="handleDisplayMouseMove($event)">
                </ngx-remote-desktop-display>                
                <!-- End display -->
            </section>
            <section [class.ngx-remote-desktop-status-bar-hidden]="manager.isFullScreen()">
                <ng-content select="ngx-remote-desktop-status-bar"></ng-content>
            </section>
        </main>
    `,
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('toolbarAnimation', [
            state('1', style({ transform: 'translateX(0%)' })),
            state('0', style({ transform: 'translateX(-100%)' })),
            transition('1 => 0', animate('200ms 200ms ease-out')),
            transition('0 => 1', animate('225ms ease-in'))
        ])
    ],
})
export class RemoteDesktopComponent implements OnInit, DoCheck {
    /**
     * Client that manages the connection to the remote desktop
     */
    @Input()
    private manager: RemoteDesktopManager;

    @ContentChild(ConnectingMessageComponent)
    private connectingMessage: ConnectingMessageComponent;

    @ContentChild(DisconnectedMessageComponent)
    private disconnectedMessage: DisconnectedMessageComponent;

    @ContentChild(ErrorMessageComponent)
    private errorMessage: ErrorMessageComponent;

    @ViewChild('container')
    private container: ElementRef;

    @ViewChild('toolbar')
    private toolbar: ElementRef;

    /**
     * Hide or show the toolbar
     */
    private toolbarVisible: boolean = true;

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
     * Check if the full screen or focused property has changed
     */
    ngDoCheck(): void {
        this.handleFullScreen();
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
     * Receive the state from the desktop client and update this components state
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
        if (!screenfull.isFullscreen) {
            return;
        }
        this.manager.setFullScreen(false);
        const containerElement = this.container.nativeElement;
        screenfull.exit(containerElement);
    }

    /**
     * Enter full screen mode and auto hide the toolbar
     */
    private enterFullScreen(): void {
        if (screenfull.isFullscreen) {
            return;
        }
        const containerElement = this.container.nativeElement;
        screenfull.request(containerElement);
        screenfull.on('change', (change: any) => {
            if (!screenfull.isFullscreen) {
                this.manager.setFullScreen(false);
            }
            this.handleToolbar();
        });
    }

    /**
     * Go in and out of full screen
     */
    private handleFullScreen(): void {
        if (this.manager.isFullScreen()) {
            this.enterFullScreen();
        } else {
            this.exitFullScreen();
        }
    }

    private handleToolbar(): void {
        this.toolbarVisible = (this.manager.isFullScreen()) ? false : true;
    }

    /**
     * Handle the display mouse movement
     * @param event Mouse event
     */
    private handleDisplayMouseMove($event: any): void {
        if (!this.manager.isFullScreen()) {
            return;
        }
        this.showOrHideToolbar($event.x);
    }

    /**
     * Show or hide the toolbar
     * @param x - Mouse x coordinate respective to the container
     */
    private showOrHideToolbar(x: number): void {
        const toolbarWidth = this.toolbar.nativeElement.clientWidth;
        if (x >= -1 && x <= 0) {
            this.toolbarVisible = true;
        }
        if (x >= toolbarWidth) {
            this.toolbarVisible = false;
        }
    }
}
