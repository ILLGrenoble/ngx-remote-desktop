declare module 'screenfull';
declare module '@illgrenoble/guacamole-common-js' {

    export class Client {
        constructor(tunnel: any);
        getDisplay(): Display;
        disconnect(): void;
        connect(options: any): void;
        onstatechange(state: number): void;
        onname(name: string): void;
        onerror(status: Status): void;
        onaudio(stream: InputStream, mimetype: string): AudioPlayer;
        onvideo(stream: InputStream, layer: Display.VisibleLayer): VideoPlayer;
        onclipboard(stream: InputStream, mimetype: string): void;
        onfile(stream: InputStream, mimetype: string, filename: string): void;
        onfilesystem(object: Object, name: string): void;
        onpipe(mimetype: string, name: string): void;
        onsync(timestamp: number): void;
        sendMouseState(mouseState: Mouse.State): void;
        sendKeyEvent(pressed: number, keysym: number): void;
        sendSize(width: number, height: number): void;
        setClipboard(data: string): void;
        createOutputStream(): OutputStream;
        createAudioStream(mimetype: string);
        createFileStream(mimetype: string, filename: string);
        createPipeStream(mimetype: string, name: string);
        createClipboardStream(mimetype: string);
        createObjectOutputStream(index: number, mimetype: string, name: string);
        requestObjectInputStream(index: number, name: string): void;
        sendAck(index: number, message: string, code: number): void;
        sendBlob(index: number, data: string): void;
        endStream(index: number): void;
    }

    export class Tunnel {
        connect(data: string): void;
        disconnect(): void;
        onerror(error: Status): void;
        onstatechange(state: number): void;
        oninstruction(opcode: string, parameters: any): void;
        sendMessage(elements: any): void;
        setState(state: number): void;
    }


    export class WebSocketTunnel extends Tunnel {
        constructor(tunnelURL: string);
    }

    export class ChainedTunnel extends Tunnel {
        constructor(tunnelChannel: any);
    }

    export class HTTPTunnel extends Tunnel {
        constructor(tunnelURL: string, crossDomain: boolean, extraTunnelHeaders: any);
    }

    export class StaticHTTPTunnel extends Tunnel {
        constructor(url: string, crossDomain: boolean, extraTunnelHeaders: any);
    }

    export class AudioPlayer {
        sync(): void;
        static isSupportedType(mimetype: string): boolean;
        static getSupportedTypes(): any;
        static getInstance(stream: InputStream, mimetype: string): AudioPlayer;
    }

    export class RawAudioPlayer extends AudioPlayer {
        constructor(stream: InputStream, mimetype: string);
    }

    export class AudioRecorder {
        onclose(): void;
        onerror(): void;
        static isSupportedType(mimetype: string): boolean;
        static getSupportedTypes(): any;
    }

    export class RawAudioRecorder extends AudioRecorder {
        constructor(stream: AudioRecorder, mimetype: string);
        static isSupportedType(mimetype: string): boolean;
        static getSupportedTypes(): any;
    }

    export class ArrayBufferReader {
        constructor(stream: InputStream);
        ondata(buffer: ArrayBuffer): void;
        onend(): void;
    }

    export class ArrayBufferWriter {
        constructor(stream: OutputStream);
        sendData(data: any);
        sendEnd(): void;
        onack(status: Status);

    }

    export class Keyboard {
        constructor(element: any);
        reset();
        onkeydown(keysym: number): boolean;
        onkeyup(keysym: number): void;
        press(keysym: number): boolean;
        release(keysym: number): void;
        reset(): void;
    }

    export class Display {
        onresize(width: number, height: number): void;
        oncursor(x: number, y: number): void;
        getElement();
        getWidth(): number;
        getHeight(): number;
        getDefaultLayer(): Display.VisibleLayer;
        getCursorLayer(): Display.VisibleLayer;
        createLayer(): Display.VisibleLayer;
        createBuffer(): Layer;
        flush(callback: any): void;
        setCursor(hotspotX: number, hotspotY: number, layer: Layer, srcx: number, srcy: number, srcw: number, srch: number): void;
        showCursor(shown: boolean): void;
        moveCursor(x: number, y: number): void;
        resize(layer: Layer, width: number, height: number);
        drawImage(layer: Layer, x: number, y: number, image: Image): void;
        drawBlob(layer: Layer, x: number, y: number, blob: any): void;
        draw(layer: Layer, x: number, y: number, url: string): void;
        play(layer: Layer, mimetype: string, duration: number, url: string): void;
        transfer(srcLayer: Layer, srcx: number, srcy: number, srcw: number, srch: number, dstLayer: Layer, x: number, y: number, transferFunction: any): void;
        put(srcLayer: Layer, srcx: number, srcy: number, srcw: number, srch: number, dstLayer: Layer, x: number, y: number): void;
        copy(srcLayer: Layer, srcx: number, srcy: number, srcw: number, srch: number, dstLayer: Layer, x: number, y: number): void;
        moveTo(layer: Layer, x: number, y: number): void;
        lineTo(layer: Layer, x: number, y: number): void;
        arc(layer: Layer, x: number, y: number, radius: number, startAngle: number, endAngle: number, negative: boolean);
        curveTo(layer: Layer, cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number);
        close(layer: Layer): void;
        rect(layer: Layer, x: number, y: number, w: number, h: number): void;
        clip(layer: Layer): void;
        strokeColor(layer: Layer, cap: string, join: string, thickness: number, r: number, g: number, b: number, a: number): void;
        fillColor(layer: Layer, r: number, g: number, b: number, a: number): void;
        strokeLayer(layer: Layer, cap: string, join: string, thickness: number, srcLayer: Layer): void;
        fillLayer(layer: Layer, srcLayer: Layer): void;
        push(layer: Layer): void;
        pop(layer: Layer): void;
        reset(layer: Layer): void;
        setTransform(layer: Layer, a: number, b: number, c: number, d: number, e: number, f: number): void;
        transform(layer: Layer, a: number, b: number, c: number, d: number, e: number, f: number): void;
        setChannelMask(layer: Layer, mask: number): void;
        setMiterLimit(layer: Layer, limit: number): void;
        dispose(layer: Layer): void;
        distort(layer: Display.VisibleLayer, a: number, b: number, c: number, d: number, e: number, f: number): void;
        move(layer: Display.VisibleLayer, parent: Display.VisibleLayer, x: number, y: number, z: number): void;
        shade(layer: Display.VisibleLayer, alpha: number): void;
        scale(scale: number): void;
        getScale(): number;
        flatten(): any;
    }

    export class Mouse {
        constructor(element: any);
        onmousedown(event: any);
        onmouseup(event: any);
        onmousemove(event: any);
        onmousedown(event: any);
    }

    export class Layer {
        constructor(width: number, height: number);
        getCanvas(): any;
        toCanvas(): any;
        resize(newWidth: number, newHeight: number);
        drawImage(x: number, y: number, image: any): void;
        transfer(srcLayer: Layer, srcx: number, srcy: number, srcw: number, srch: number, x: number, y: number, transferFunction: any): void;
        put(srcLayer: Layer, srcx: number, srcy: number, srcw: number, srch: number, x: number, y: number): void;
        copy(srcLayer: Layer, srcx: number, srcy: number, srcw: number, srch: number, x: number, y: number): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, negative: boolean);
        curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number);
        close(): void;
        rect(x: number, y: number, w: number, h: number): void;
        clip(): void;
        strokeColor(cap: string, join: string, thickness: number, r: number, g: number, b: number, a: number): void;
        fillColor(r: number, g: number, b: number, a: number): void;
        strokeColor(cap: string, join: string, thickness: number, srcLayer: Layer): void;
        strokeLayer(cap: string, join: string, thickness: number, srcLayer: Layer): void;
        fillLayer(srcLayer: Layer): void;
        push(): void;
        pop(): void;
        reset(): void;
        setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        setChannelMask(mask: number): void;
        setMiterLimit(limit: number): void;
    }

    namespace Mouse {
        export class State {
            constructor(x: number, y: number, left: boolean, middle: boolean, right: boolean, up: boolean, down: boolean);
            onmousedown(state: State): void;
            onmouseup(state: State): void;
            onmousemove(state: State);

        }
    }

    namespace Display {
        export class VisibleLayer {
            constructor(width: number, height: number);
            resize(width: number, height: number): void;
            getElement(): any;
            translate(x: number, y: number): void;
            move(parent: VisibleLayer, x: number, y: number, z: number): void;
            shade(a: number);
            dispose(): void;
            distort(a: number, b: number, c: number, d: number, e: number, f: number): void;
        }
    }
    
    export class Status {
        Code: any;
    }

    export class InputStream {
        constructor(client: Client, index: number);
        sendAck(message: string, code: number): void;
    }

    export class OutputStream {
        constructor(client: Client, index: number);
        sendBlob(data: string): void;
        sendEnd(): void;
    }

    export class IntegerPool {
        next();
        free(integer: number);
    }

    export class StringReader {
        constructor(stream: InputStream);
        ontext(text: string): void;
        onend();
    }

    export class BlobWriter {
        constructor(stream: OutputStream);
        sendBlob(blob: any): void;
        sendEnd(): void;
        onack(status: Status): void;
        onerror(blob: any, offset: number, error: any): void;
        onprogress(blob: any, offset: number): void;
        oncomplete(blob: any): void;
    }

    export class BlobWriter {
        constructor(stream: InputStream, mimetype: string);
        getLength(): number;
        getBlob(): any;
        onprogress(length: number);
        onend(): void;
    }

    export class DataURIReader {
        constructor(stream: InputStream, mimetype: InputStream);
        getURI(): string;
        onend(): void;
    }

    export class Object {
        constructor(client: Client, index: number);
        onbody(inputStream: InputStream, mimetype: string, name: string): void;
        onundefine(): void;
        requestInputStream(name: string, bodyCallback: any): void;
        createOutputStream(mimetype: string, name: string): OutputStream;
    }

    export class JSONReader {
        constructor(stream: InputStream);
        getLength(): number;
        getJSON(): any;
        onprogress(length: number): void;
        onend(): void;
    }

    export class StringWriter {
        constructor(stream: InputStream);
        sendText(text: string): void;
        sendEnd(): void;
        onack(status: Status): void;
    }

    export class Parser {
        receive(packet: string): void;
        oninstruction(opcode: string, parameters: any): void;
    }

    export class RawAudioFormat {
        constructor(template: any);
        parse(mimetype: string): RawAudioFormat;
    }
}