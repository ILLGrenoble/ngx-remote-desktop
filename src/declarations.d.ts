declare module 'screenfull';
declare module '@illgrenoble/guacamole-common-js' {


    export function Layer(width: any, height: any): any;

    export class Client {
        constructor(tunnel: any);
        getDisplay();
        setClipboard(text: string);
        disconnect(): void;
        connect(options: any): void;
        onerror(status: any);
        onstatechange(status: any);
        onclipboard(text: any);
        onerror(text: any);
    }
    export class Tunnel {

    }
    export interface WebSocketTunnel {

    }
    export interface ChainedTunnel {

    }
    export interface HTTPTunnel {

    }
    export class Keyboard {
        constructor(element: any);
    }

    export class Mouse {
        constructor(element: any);

    }
    export class StringReader {

    }
}