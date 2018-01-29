declare module 'screenfull';
declare module '@illgrenoble/guacamole-common-js' {

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
        sendMouseState(state: any);
        sendKeyEvent(pressed: number, keysym: number);
    }

    export class Tunnel {
        constructor(element: WebSocketTunnel | HTTPTunnel | ChainedTunnel);
        onerror(error: any);
        onstatechange(state: any);
    }

    export class WebSocketTunnel {
        constructor(url: string);
    }

    export class ChainedTunnel {
        constructor(url: string);
    }

    export class HTTPTunnel {
        constructor(url: string);

    }

    export class Keyboard {
        constructor(element: any);
        reset();
        onkeydown(key);
        onkeyup(key);

    }

    export class Mouse {
        constructor(element: any);
        onmousedown(event: any);
        onmouseup(event: any);
        onmousemove(event: any);
        onmousedown(event: any);

    }

    namespace Mouse {
        export class State {
            constructor(x: number, y: number, left: boolean, middle: boolean, right: boolean, up: boolean, down: boolean);
        }
    }

    export class Status {
        Code: any;
    }

    export class StringReader {
        constructor(stream: any);
        ontext(text: string);
        onend(event: any);
    }
}