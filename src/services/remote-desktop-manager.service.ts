import { URLSearchParams } from '@angular/http';
import { Client, StringReader, Tunnel } from '@illgrenoble/guacamole-common-js';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

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
    public onStateChange = new BehaviorSubject(RemoteDesktopManager.STATE.IDLE);

    /**
     * Remote desktop clipboard observable.
     * Subscribe to this if you want to be notified if text has been cut/copied within
     * the remote desktop.
     */
    public onRemoteClipboardData = new ReplaySubject(1);

    public onKeyboardReset = new BehaviorSubject<boolean>(true);

    public onFocused = new BehaviorSubject<boolean>(true);

    public onFullScreen = new BehaviorSubject<boolean>(false);

    public onReconnect = new Subject<boolean>();

    /**
     * When an instruction is received from the tunnel
     */
    public onTunnelInstruction = new BehaviorSubject<{ opcode: string, parameters: any }>(null);

    /**
     * The actual underlying remote desktop client
     */
    private client: Client;

    /**
     * The tunnel being used by the underlying remote desktop client
     */
    private tunnel: Tunnel;

    /**
     * Set up the manager
     * @param tunnel  WebsocketTunnel, HTTPTunnel or ChainedTunnel
     * @param parameters Query parameters to send to the tunnel url
     */
    constructor(tunnel: Tunnel) {
        this.tunnel = tunnel;
        this.client = new Client(this.tunnel);
    }

    /**
     * Get the guacamole connection state
     */
    public getState() {
        return this.onStateChange.getValue();
    }

    /**
     * Check to see if the given state equals the current state
     * @param state
     */
    public isState(state: string): boolean {
        return state === this.onStateChange.getValue();
    }

    /**
     * Set the display focus
     * @param newFocused
     */
    public setFocused(newFocused: boolean) {
        this.onFocused.next(newFocused);
    }

    /**
     * Set full screen
     * @param newFullScreen
     */
    public setFullScreen(newFullScreen: boolean) {
        this.onFullScreen.next(newFullScreen);
    }

    /**
     * Is the display full screen?
     */
    public isFullScreen(): boolean {
        return this.onFullScreen.getValue();
    }

    /**
     * Is the tunnel connected?
     */
    public isConnected(): boolean {
        return this.onStateChange.getValue() === RemoteDesktopManager.STATE.CONNECTED;
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
    public createScreenshot(done: any): void {
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
     * Reset the keyboard
     * This will release all keys
     */
    public resetKeyboard(): void {
        this.onKeyboardReset.next(true);
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
    public connect(parameters = {}): void {
        const configuration = this.buildParameters(parameters);
        this.client.connect(configuration);
        this.bindEventHandlers();
    }

    /**
     * Set the connection state and emit the new state to any subscribers
     * @param state Connection state
     */
    private setState(state: string): void {
        this.onStateChange.next(state);
    }

    /**
     * Receive clipboard data from the remote desktop and emit an event to the client
     * @param stream 
     * @param mimetype 
     */
    private handleClipboard(stream: any, mimetype: string): void {
        // If the received data is text, read it as a simple string
        if (/^text\//.exec(mimetype)) {
            const reader = new StringReader(stream);

            // Assemble received data into a single string
            let data = '';
            reader.ontext = (text: string) => data += text;

            // Set clipboard contents once stream is finished
            reader.onend = () => this.onRemoteClipboardData.next(data);
        }
    }

    /**
     * Build the URL query parameters to send to the tunnel connection
     */
    private buildParameters(parameters = {}): string {
        const params = new URLSearchParams();
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                params.set(key, parameters[key]);
            }
        }
        return params.toString();
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
        /*
         * Override tunnel instruction message
         */
        this.tunnel.oninstruction = ((oninstruction) => {
            return (opcode: string, parameters: any) => {
                oninstruction(opcode, parameters);
                this.onTunnelInstruction.next({ opcode, parameters });
            };
        })(this.tunnel.oninstruction);
    }

    /**
     * Handle any client errors by disconnecting and updating the connection state
     * @param state State received from the client
     */
    private handleClientError(status: any): void {
        // Disconnect if connected
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.CLIENT_ERROR);
    }

    /**
     * Update the connection state when the client state changes
     * @param state State received from the client
     */
    private handleClientStateChange(state: number): void {
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
    private handleTunnelError(status: any): void {
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.TUNNEL_ERROR);
    }

    /**
     * Update the connection state when the tunnel state changes
     * @param state State received from the tunnel
     */
    private handleTunnelStateChange(state: number): void {
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
