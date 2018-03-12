"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/http");
var guacamole_common_js_1 = require("@illgrenoble/guacamole-common-js");
var rxjs_1 = require("rxjs");
/**
 * Manages the connection to the remote desktop
 */
var RemoteDesktopManager = /** @class */ (function () {
    /**
     * Set up the manager
     * @param tunnel  WebsocketTunnel, HTTPTunnel or ChainedTunnel
     * @param parameters Query parameters to send to the tunnel url
     */
    function RemoteDesktopManager(tunnel) {
        /**
         * Remote desktop connection state observable
         * Subscribe to this if you want to be notified when the connection state changes
         */
        this.onStateChange = new rxjs_1.BehaviorSubject(RemoteDesktopManager.STATE.IDLE);
        /**
         * Remote desktop clipboard observable.
         * Subscribe to this if you want to be notified if text has been cut/copied within
         * the remote desktop.
         */
        this.onRemoteClipboardData = new rxjs_1.ReplaySubject(1);
        this.onKeyboardReset = new rxjs_1.BehaviorSubject(true);
        this.onFocused = new rxjs_1.BehaviorSubject(true);
        this.onFullScreen = new rxjs_1.BehaviorSubject(false);
        this.onReconnect = new rxjs_1.Subject();
        /**
         * When an instruction is received from the tunnel
         */
        this.onTunnelInstruction = new rxjs_1.BehaviorSubject(null);
        this.tunnel = tunnel;
        this.client = new guacamole_common_js_1.Client(this.tunnel);
    }
    /**
     * Get the guacamole connection state
     */
    RemoteDesktopManager.prototype.getState = function () {
        return this.onStateChange.getValue();
    };
    /**
     * Check to see if the given state equals the current state
     * @param state
     */
    RemoteDesktopManager.prototype.isState = function (state) {
        return state === this.onStateChange.getValue();
    };
    /**
     * Set the display focus
     * @param newFocused
     */
    RemoteDesktopManager.prototype.setFocused = function (newFocused) {
        this.onFocused.next(newFocused);
    };
    /**
     * Set full screen
     * @param newFullScreen
     */
    RemoteDesktopManager.prototype.setFullScreen = function (newFullScreen) {
        this.onFullScreen.next(newFullScreen);
    };
    /**
     * Is the display full screen?
     */
    RemoteDesktopManager.prototype.isFullScreen = function () {
        return this.onFullScreen.getValue();
    };
    /**
     * Is the tunnel connected?
     */
    RemoteDesktopManager.prototype.isConnected = function () {
        return this.onStateChange.getValue() === RemoteDesktopManager.STATE.CONNECTED;
    };
    /**
     * Get the guacamole client
     */
    RemoteDesktopManager.prototype.getClient = function () {
        return this.client;
    };
    /**
     * Get the guacamole tunnel
     */
    RemoteDesktopManager.prototype.getTunnel = function () {
        return this.tunnel;
    };
    /**
     * Generate a thumbnail
     * @param {number} width  The width of the thumbnail
     * @param {number} height The height of the thumbnail
     * @returns {string} An image data url
     */
    RemoteDesktopManager.prototype.createThumbnail = function (width, height) {
        if (width === void 0) { width = 340; }
        if (height === void 0) { height = 240; }
        var display = this.client.getDisplay();
        if (display && display.getWidth() > 0 && display.getHeight() > 0) {
            // Get screenshot
            var canvas = display.flatten();
            var scale = Math.min(width / canvas.width, height / canvas.height, 1);
            // Create thumbnail canvas
            var thumbnail = document.createElement('canvas');
            thumbnail.width = canvas.width * scale;
            thumbnail.height = canvas.height * scale;
            // Scale screenshot to thumbnail
            var context = thumbnail.getContext('2d');
            context.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, thumbnail.width, thumbnail.height);
            return thumbnail.toDataURL('image/png');
        }
        return null;
    };
    /**
     * Generate a screenshot
     * @param {blob} done Callback with the screenshot blob data
     */
    RemoteDesktopManager.prototype.createScreenshot = function (done) {
        var display = this.client.getDisplay();
        if (display && display.getWidth() > 0 && display.getHeight() > 0) {
            var canvas = display.flatten();
            return canvas.toBlob(done);
        }
        done(null);
    };
    /**
     * Send text to the remote clipboard
     * @param {string} text Clipboard text to send
     */
    RemoteDesktopManager.prototype.sendRemoteClipboardData = function (text) {
        if (text) {
            this.onRemoteClipboardData.next(text);
            this.client.setClipboard(text);
        }
    };
    /**
     * Reset the keyboard
     * This will release all keys
     */
    RemoteDesktopManager.prototype.resetKeyboard = function () {
        this.onKeyboardReset.next(true);
    };
    /**
     * Disconnect from the remote desktop
     */
    RemoteDesktopManager.prototype.disconnect = function () {
        this.client.disconnect();
    };
    /**
     * Connect to the remote desktop
     */
    RemoteDesktopManager.prototype.connect = function (parameters) {
        if (parameters === void 0) { parameters = {}; }
        var configuration = this.buildParameters(parameters);
        this.client.connect(configuration);
        this.bindEventHandlers();
    };
    /**
     * Set the connection state and emit the new state to any subscribers
     * @param state Connection state
     */
    RemoteDesktopManager.prototype.setState = function (state) {
        this.onStateChange.next(state);
    };
    /**
     * Receive clipboard data from the remote desktop and emit an event to the client
     * @param stream
     * @param mimetype
     */
    RemoteDesktopManager.prototype.handleClipboard = function (stream, mimetype) {
        var _this = this;
        // If the received data is text, read it as a simple string
        if (/^text\//.exec(mimetype)) {
            var reader = new guacamole_common_js_1.StringReader(stream);
            // Assemble received data into a single string
            var data_1 = '';
            reader.ontext = function (text) { return data_1 += text; };
            // Set clipboard contents once stream is finished
            reader.onend = function () { return _this.onRemoteClipboardData.next(data_1); };
        }
    };
    /**
     * Build the URL query parameters to send to the tunnel connection
     */
    RemoteDesktopManager.prototype.buildParameters = function (parameters) {
        if (parameters === void 0) { parameters = {}; }
        var params = new http_1.URLSearchParams();
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                params.set(key, parameters[key]);
            }
        }
        return params.toString();
    };
    /**
     * Bind the client and tunnel event handlers
     */
    RemoteDesktopManager.prototype.bindEventHandlers = function () {
        var _this = this;
        this.client.onerror = this.handleClientError.bind(this);
        this.client.onstatechange = this.handleClientStateChange.bind(this);
        this.client.onclipboard = this.handleClipboard.bind(this);
        this.tunnel.onerror = this.handleTunnelError.bind(this);
        this.tunnel.onstatechange = this.handleTunnelStateChange.bind(this);
        /*
         * Override tunnel instruction message
         */
        this.tunnel.oninstruction = (function (oninstruction) {
            return function (opcode, parameters) {
                oninstruction(opcode, parameters);
                _this.onTunnelInstruction.next({ opcode: opcode, parameters: parameters });
            };
        })(this.tunnel.oninstruction);
    };
    /**
     * Handle any client errors by disconnecting and updating the connection state
     * @param state State received from the client
     */
    RemoteDesktopManager.prototype.handleClientError = function (status) {
        // Disconnect if connected
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.CLIENT_ERROR);
    };
    /**
     * Update the connection state when the client state changes
     * @param state State received from the client
     */
    RemoteDesktopManager.prototype.handleClientStateChange = function (state) {
        switch (state) {
            // Idle
            case 0:
                this.setState(RemoteDesktopManager.STATE.IDLE);
                break;
            // Ignore "connecting" state
            case 1:// Connecting
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
            case 5:// Disconnected
                break;
        }
    };
    /**
     * Handle any tunnel errors by disconnecting and updating the connection state
     * @param status Status received from the tunnel
     */
    RemoteDesktopManager.prototype.handleTunnelError = function (status) {
        this.disconnect();
        this.setState(RemoteDesktopManager.STATE.TUNNEL_ERROR);
    };
    /**
     * Update the connection state when the tunnel state changes
     * @param state State received from the tunnel
     */
    RemoteDesktopManager.prototype.handleTunnelStateChange = function (state) {
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
    };
    RemoteDesktopManager.STATE = {
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
    return RemoteDesktopManager;
}());
exports.RemoteDesktopManager = RemoteDesktopManager;
//# sourceMappingURL=remote-desktop-manager.service.js.map