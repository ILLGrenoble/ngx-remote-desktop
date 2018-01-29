import { OnInit } from '@angular/core';
/**
 * The main component for displaying a remote desktop
 */
export declare class RemoteDesktopComponent implements OnInit {
    /**
     * Client that manages the connection to the remote desktop
     */
    private manager;
    /**
     * Message overrides for localisation
     */
    private messages;
    private container;
    /**
     * Full screen mode defaults to false until toggled by the user
     */
    private isFullScreen;
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
     * Received the state from the desktop client and update this components state
     * @param newState - state received from the guacamole client
     */
    private handleState(newState);
    /**
     * Exit full screen and show the toolbar
     */
    private exitFullScreen();
    /**
     * Enter or exit full screen mode
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
     * @param x
     */
    private showOrHideToolbar(x);
}
