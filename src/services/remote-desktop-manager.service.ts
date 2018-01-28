import {
    Client,
    Tunnel,
    WebSocketTunnel,
    ChainedTunnel,
    HTTPTunnel,
    Status,
    StringReader
} from '@illgrenoble/guacamole-common-js';

import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { URLSearchParams } from '@angular/http';

/**
 * Manages the connection to the remote desktop
 */
export class RemoteDesktopManager {

    static STATE = {
        /**
         * The machine connection has not yet been attempted.
         */
        IDLE: 'IDLE',

        /**
         * The machine connection is being established.
         */
        CONNECTING: 'CONNECTING',

        /**
         * The machine connection has been successfully established, and the
         * client is now waiting for receipt of initial graphical data.
         */
        WAITING: 'WAITING',

        /**
         * The Guacamole connection has been successfully established, and
         * initial graphical data has been received.
         */
        CONNECTED: 'CONNECTED',

        /**
         * The machine connection has terminated successfully. No errors are
         * indicated.
         */
        DISCONNECTED: 'DISCONNECTED',

        /**
         * The machine connection has terminated due to an error reported by
         * the client. The associated error code is stored in statusCode.
         *
         */
        CLIENT_ERROR: 'CLIENT_ERROR',

        /**
         * The machine connection has terminated due to an error reported by
         * the tunnel. The associated error code is stored in statusCode.
         */
        TUNNEL_ERROR: 'TUNNEL_ERROR'
    };

    /**
     * Remote desktop connection state observable
     * Subscribe to this if you want to be notified when the connection state changes
     */
    public onStateChange = new BehaviorSubject(RemoteDesktopManager.STATE.CONNECTING);

    /**
     * Remote desktop clipboard observable.
     * Subscribe to this if you want to be notified if text has been cut/copied within
     * the remote desktop.
     */
    public onRemoteClipboardData = new ReplaySubject(1);

    /**
     * The actual underlying remote desktop client
     */
    private client: Client;

    /**
     * The tunnel being used by the underlying remote desktop client
     */
    private tunnel: Tunnel;

    /**
     * Current state of the connection
     */
    private state = RemoteDesktopManager.STATE.IDLE;

    /**
     * The dimensions parameters to send to the tunnel.
     * This can be overridden by using  {@link setDimensionParameters}
     */
    private dimensionsParameters = { width: 'width', height: 'height' };

    /**
     * Set up the manager
     * @param tunnel  WebsocketTunnel, HTTPTunnel or ChainedTunnel
     * @param parameters Query parameters to send to the tunnel url
     */
    constructor(tunnel: WebSocketTunnel | HTTPTunnel | ChainedTunnel, private parameters = {}) {
        this.tunnel = tunnel;
        this.client = new Client(this.tunnel);
    }

    /**
     * Get the guacamole connection state
     */
    public getState() {
        return this.state;
    }

    /**
     * Check to see if the given state equals the current state
     * @param state
     */
    public isState(state): boolean {
        return state === this.state;
    }

    /**
     * Is the tunnel connected?
     */
    public isConnected(): boolean {
        return this.state === RemoteDesktopManager.STATE.CONNECTED;
    }

    /**
     * Get the guacamole client
     */
    public getClient(): Client {
        return this.client;
    }

    /**
     * Get the guacamole tunnel
     */
    public getTunnel(): Tunnel {
        return this.tunnel;
    }

    /**
     * Set the dimensions parameters.
     * This is used for sending the client dimensions when connecting to the tunnel.
     * @param width
     * @param height 
     */
    public setDimensionParameters(width: string, height: string) {
        // tslint:disable-next-line:object-literal-shorthand
        this.dimensionsParameters = { width: width, height: height };
    }

    /**
     * Generate a thumbnail
     * @param {number} width  The width of the thumbnail
     * @param {number} height The height of the thumbnail
     * @returns {string} An image data url
     */
    public createThumbnail(width: number = 340, height: number = 240): string {
        const display = this.client.getDisplay();
        if (display && display.getWidth() > 0 && display.getHeight() > 0) {
            // Get screenshot
            const canvas = display.flatten();
            const scale = Math.min(width / canvas.width, height / canvas.height, 1);

            // Create thumbnail canvas
            const thumbnail = document.createElement('canvas');
            thumbnail.width = canvas.width * scale;
            thumbnail.height = canvas.height * scale;

            // Scale screenshot to thumbnail
            const context = thumbnail.getContext('2d');
            context.drawImage(canvas,
                0, 0, canvas.width, canvas.height,
                0, 0, thumbnail.width, thumbnail.height
            );
            return thumbnail.toDataURL('image/png');
        }
        return null;
    }

    /**
     * Generate a screenshot
     * @param {blob} done Callback with the screenshot blob data
     */
    public createScreenshot(done): void {
        const display = this.client.getDisplay();
        if (display && display.getWidth() > 0 && display.getHeight() > 0) {
            const canvas = display.flatten();
            return canvas.toBlob(done);
        }
        done(null);
    }

    /**
     * Send text to the remote clipboard
     * @param {string} text Clipboard text to send
     */
    public sendRemoteClipboardData(text: string) {
        if (text) {
            this.onRemoteClipboardData.next(text);
            this.client.setClipboard(text);
        }
    }

    /**
     * Disconnect from the remote desktop
     */
    public disconnect(): void {
        this.client.disconnect();
    }

    /**
     * Connect to the remote desktop
     */
    public connect(): void {
        const configuration = this.buildConfiguration();
        this.client.connect(configuration);
        this.bindEventHandlers();
    }

    /**
     * Set the connection state and emit the new state to any subscribers
     * @param state Connection state
     */
    private setState(state): void {
        this.state = state;
        this.onStateChange.next(this.state);
    }

    /**
     * Receive clipboard data from the remote desktop and emit an event to the client
     * @param stream 
     * @param mimetype 
     */
    private handleClipboard(stream, mimetype: string): void {
        // If the received data is text, read it as a simple string
        if (/^text\//.exec(mimetype)) {
            const reader = new StringReader(stream);

            // Assemble received data into a single string
            let data = '';
            reader.ontext = (text) => data += text;

            // Set clipboard contents once stream is finished
            reader.onend = () => this.onRemoteClipboardData.next(data);
        }
    }

    /**
     * Calculate the display dimensions.
     * We always take the full width and height of the screen as we
     * always want to scale up rather than scale down.
     */
    private calculateDimensions(): { width: number, height: number } {
        const screen = window.screen;
        const width = screen.width;
        const height = screen.height;
        return { height, width };
    }

    /**
     * Build the URL query parameters to send to the tunnel connection
     */
    private buildParameters(): URLSearchParams {
        const params = new URLSearchParams();
        for (const key in this.parameters) {
            if (this.parameters.hasOwnProperty(key)) {
                params.set(key, this.parameters[key]);
            }
        }
        return params;
    }

    /**
     * Build the url query parameters and set the width and height parameters
     */
    private buildConfiguration() {
        const dimensionsParameters = this.dimensionsParameters;
        const dimensions = this.calculateDimensions();
        const buildParameters = this.buildParameters();
        buildParameters.set(this.dimensionsParameters.width, dimensions.width.toString());
        buildParameters.set(this.dimensionsParameters.height, dimensions.height.toString());
        return buildParameters.toString();
    }

    /**
     * Bind the client and tunnel event handlers
     */
    private bindEventHandlers(): void {
        this.client.onerror = this.handleClientError.bind(this);
        this.client.onstatechange = this.handleClientStateChange.bind(this);
        this.client.onclipboard = this.handleClipboard.bind(this);
        this.tunnel.onerror = this.handleTunnelError.bind(this);
        this.tunnel.onstatechange = this.handleTunnelStateChange.bind(this);
    }

    /**
     * Handle any client errors by disconnecting and updating the connection state
     * @param state State received from the client
     */
    private handleClientError(status): void {
        // Disconnect if connected
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.CLIENT_ERROR);
    }

    /**
     * Update the connection state when the client state changes
     * @param state State received from the client
     */
    private handleClientStateChange(state): void {
        switch (state) {
            // Idle
            case 0:
                this.setState(RemoteDesktopManager.STATE.IDLE);
                break;
            // Ignore "connecting" state
            case 1: // Connecting
                break;
            // Connected + waiting
            case 2:
                this.setState(RemoteDesktopManager.STATE.WAITING);
                break;
            // Connected
            case 3:
                this.setState(RemoteDesktopManager.STATE.CONNECTED);
                break;
            // Update history when disconnecting
            case 4: // Disconnecting
            case 5: // Disconnected
                break;
        }
    }

    /**
     * Handle any tunnel errors by disconnecting and updating the connection state
     * @param status Status received from the tunnel
     */
    private handleTunnelError(status): void {
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.TUNNEL_ERROR);
    }

    /**
     * Update the connection state when the tunnel state changes
     * @param state State received from the tunnel
     */
    private handleTunnelStateChange(state): void {
        switch (state) {
            // Connection is being established
            case 1:
                this.setState(RemoteDesktopManager.STATE.CONNECTING);
                break;
            // Connection has closed
            case 2:
                this.setState(RemoteDesktopManager.STATE.DISCONNECTED);
                break;
        }
    }

}
