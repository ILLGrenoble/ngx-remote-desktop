import { Client, Tunnel } from '@illgrenoble/guacamole-common-js';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
/**
 * Manages the connection to the remote desktop
 */
export declare class RemoteDesktopManager {
    private parameters;
    static STATE: {
        IDLE: string;
        CONNECTING: string;
        WAITING: string;
        CONNECTED: string;
        DISCONNECTED: string;
        CLIENT_ERROR: string;
        TUNNEL_ERROR: string;
    };
    /**
     * Remote desktop connection state observable
     * Subscribe to this if you want to be notified when the connection state changes
     */
    onStateChange: BehaviorSubject<string>;
    /**
     * Remote desktop clipboard observable.
     * Subscribe to this if you want to be notified if text has been cut/copied within
     * the remote desktop.
     */
    onRemoteClipboardData: ReplaySubject<{}>;
    /**
     * The actual underlying remote desktop client
     */
    private client;
    /**
     * The tunnel being used by the underlying remote desktop client
     */
    private tunnel;
    /**
     * Current state of the connection
     */
    private state;
    /**
     * The keyboard and mouse input listeners to the remote display are only bound when
     * this is set to true.
     * Set this to false if you need to use the keyboard or mouse inside another component outside
     * of the display
     */
    private focused;
    /**
     * When set to true, this will trigger an event to enter into full screen mode and hide the toolbar
     */
    private fullScreen;
    /**
     * The dimensions parameters to send to the tunnel.
     * This can be overridden by using  {@link setDimensionParameters}
     */
    private dimensionsParameters;
    /**
     * Set up the manager
     * @param tunnel  WebsocketTunnel, HTTPTunnel or ChainedTunnel
     * @param parameters Query parameters to send to the tunnel url
     */
    constructor(tunnel: Tunnel, parameters?: {});
    /**
     * Get the guacamole connection state
     */
    getState(): string;
    /**
     * Check to see if the given state equals the current state
     * @param state
     */
    isState(state: string): boolean;
    /**
     * Set the display focus
     * @param newFocused
     */
    setFocused(newFocused: boolean): void;
    /**
     * Set full screen
     * @param newFullScreen
     */
    setFullScreen(newFullScreen: boolean): void;
    /**
     * Is the display full screen?
     */
    isFullScreen(): boolean;
    /**
     * Is the display focused?
     */
    isFocused(): boolean;
    /**
     * Is the tunnel connected?
     */
    isConnected(): boolean;
    /**
     * Get the guacamole client
     */
    getClient(): Client;
    /**
     * Get the guacamole tunnel
     */
    getTunnel(): Tunnel;
    /**
     * Set the dimensions parameters.
     * This is used for sending the client dimensions when connecting to the tunnel.
     * @param width
     * @param height
     */
    setDimensionParameters(width: string, height: string): void;
    /**
     * Generate a thumbnail
     * @param {number} width  The width of the thumbnail
     * @param {number} height The height of the thumbnail
     * @returns {string} An image data url
     */
    createThumbnail(width?: number, height?: number): string;
    /**
     * Generate a screenshot
     * @param {blob} done Callback with the screenshot blob data
     */
    createScreenshot(done: any): void;
    /**
     * Send text to the remote clipboard
     * @param {string} text Clipboard text to send
     */
    sendRemoteClipboardData(text: string): void;
    /**
     * Disconnect from the remote desktop
     */
    disconnect(): void;
    /**
     * Connect to the remote desktop
     */
    connect(): void;
    /**
     * Set the connection state and emit the new state to any subscribers
     * @param state Connection state
     */
    private setState(state);
    /**
     * Receive clipboard data from the remote desktop and emit an event to the client
     * @param stream
     * @param mimetype
     */
    private handleClipboard(stream, mimetype);
    /**
     * Calculate the display dimensions.
     * We always take the full width and height of the screen as we
     * always want to scale up rather than scale down.
     */
    private calculateDimensions();
    /**
     * Build the URL query parameters to send to the tunnel connection
     */
    private buildParameters();
    /**
     * Build the url query parameters and set the width and height parameters
     */
    private buildConfiguration();
    /**
     * Bind the client and tunnel event handlers
     */
    private bindEventHandlers();
    /**
     * Handle any client errors by disconnecting and updating the connection state
     * @param state State received from the client
     */
    private handleClientError(status);
    /**
     * Update the connection state when the client state changes
     * @param state State received from the client
     */
    private handleClientStateChange(state);
    /**
     * Handle any tunnel errors by disconnecting and updating the connection state
     * @param status Status received from the tunnel
     */
    private handleTunnelError(status);
    /**
     * Update the connection state when the tunnel state changes
     * @param state State received from the tunnel
     */
    private handleTunnelStateChange(state);
}
