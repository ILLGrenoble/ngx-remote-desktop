import { OnInit, DoCheck } from '@angular/core';
/**
 * The main component for displaying a remote desktop
 */
export declare class RemoteDesktopComponent implements OnInit, DoCheck {
    /**
     * Client that manages the connection to the remote desktop
     */
    private manager;
    private connectingMessage;
    private disconnectedMessage;
    private errorMessage;
    private container;
    private toolbar;
    /**
     * Hide or show the toolbar
     */
    private toolbarVisible;
    /**
     * Manage the component state
     */
    private state;
    /**
     * Guacamole has more states than the list below however for the component we only interested
     * in managing four states.
     */
    private states;
    /**
     * Subscribe to the connection state when the component is initialised
     */
    ngOnInit(): void;
    /**
     * Check if the full screen or focused property has changed
     */
    ngDoCheck(): void;
    /**
     * Set the component state to the new guacamole state
     * @param newState
     */
    private setState(newState);
    /**
     * Connect to the remote desktop
     */
    private handleConnect();
    /**
     * Check if the given state equals the current component state
     * @param newState
     */
    private isState(newState);
    /**
     * Receive the state from the desktop client and update this components state
     * @param newState - state received from the guacamole client
     */
    private handleState(newState);
    /**
     * Exit full screen and show the toolbar
     */
    private exitFullScreen();
    /**
     * Enter full screen mode and auto hide the toolbar
     */
    private enterFullScreen();
    /**
     * Go in and out of full screen
     */
    private handleFullScreen();
    private handleToolbar();
    /**
     * Handle the display mouse movement
     * @param event Mouse event
     */
    private handleDisplayMouseMove($event);
    /**
     * Show or hide the toolbar
     * @param x - Mouse x coordinate respective to the container
     */
    private showOrHideToolbar(x);
}
