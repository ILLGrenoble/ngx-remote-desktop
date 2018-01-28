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

    public onStateChange = new BehaviorSubject(RemoteDesktopManager.STATE.CONNECTING);

    public onRemoteClipboardData = new ReplaySubject(1);

    /**
     * The ID of the connection associated with this client
     */
    private id: string;

    /**
     * The actual underlying remote desktop client
     */
    private client: Client;

    /**
     * The tunnel being used by the underlying remote desktop client
     */
    private tunnel: Tunnel;

    private dimensionsParameters = { width: 'width', height: 'height' };

    /**
     * Current state of the connection
     */
    private state = RemoteDesktopManager.STATE.IDLE;

    /**
     * 
     * @param tunnel - WebsocketTunnel, HTTPTunnel or ChainedTunnel
     * @param parameters  - query parameters to send to the tunnel url
     */
    constructor(tunnel, private parameters = {}) {
        this.tunnel = tunnel;
        this.client = new Client(this.tunnel);
    }

    public getState() {
        return this.state;
    }

    public isState(state) {
        return state === this.state;
    }

    public getClient(): Client {
        return this.client;
    }

    public getTunnel(): Tunnel {
        return this.tunnel;
    }

    public setDimensionParameters(width, height) {
        // tslint:disable-next-line:object-literal-shorthand
        this.dimensionsParameters = { width: width, height: height };
    }

    /**
     * Generate a thumbnail
     */
    public createThumbnail(width = 340, height = 240) {
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
     */
    public createScreenshot(done) {
        const display = this.client.getDisplay();
        if (display && display.getWidth() > 0 && display.getHeight() > 0) {
            const canvas = display.flatten();
            return canvas.toBlob(done);
        }
        done(null);
    }

    /**
     * Receive clipboard data from the remote desktop and emit an event to the client
     * @param stream 
     * @param mimetype 
     */
    public handleClipboard(stream, mimetype) {
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
     * Send text to the remote keyboard
     * @param text 
     */
    public sendRemoteClipboardData(text) {
        if (text) {
            this.onRemoteClipboardData.next(text);
            this.client.setClipboard(text);
        }
    }

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

    private setState(state): void {
        this.state = state;
        this.onStateChange.next(this.state);
    }

    /**
     * Calculate the display dimensions
     */
    private calculateDimensions() {
        const screen = window.screen;
        const width = screen.width;
        const height = screen.height;
        return { height, width };
    }

    private buildParameters(): URLSearchParams {
        const params = new URLSearchParams();
        for (const key in this.parameters) {
            if (this.parameters.hasOwnProperty(key)) {
                params.set(key, this.parameters[key]);
            }
        }
        return params;
    }

    private buildConfiguration() {
        const dimensionsParameters = this.dimensionsParameters;
        const dimensions = this.calculateDimensions();
        const buildParameters = this.buildParameters();
        buildParameters.set(this.dimensionsParameters.width, dimensions.width.toString());
        buildParameters.set(this.dimensionsParameters.height, dimensions.height.toString());
        return buildParameters.toString();
    }

    private bindEventHandlers(): void {
        this.client.onerror = this.handleClientError.bind(this);
        this.client.onstatechange = this.handleClientStateChange.bind(this);
        this.client.onclipboard = this.handleClipboard.bind(this);
        this.tunnel.onerror = this.handleTunnelError.bind(this);
        this.tunnel.onstatechange = this.handleTunnelStateChange.bind(this);
    }

    private handleClientError(status): void {
        // Disconnect if connected
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.CLIENT_ERROR);
    }

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

    private handleTunnelError(status): void {
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.TUNNEL_ERROR);
    }

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
