# Demo

You will need access to a websocket broker that communicates with guacd for connecting to RDP or VNC desktops. You can use this project as a test websocket broker: https://github.com/jamhall/guacamole-test-server

## Running the demo app

Clone the project and install the dependencies:

```
npm instsll
```

Modify `app.component.ts` inside `demo/app`

Change the parameters for the connection and the URL for the websocket server:

```
const tunnel = new WebSocketTunnel('ws://127.0.0.1:8080/ws');
// URL parameters (image, audio and other query parameters you want to send to the tunnel.)
const parameters = {
    ip: '192.168.99.100' // remote desktop ip address
    port: 3389 // rdp or vnc port
    type: 'rdp' // rdp or vnc
    image: 'image/png',
    width: window.screen.width,
    height: window.screen.height,
    audio: 'audio/L16',
    dpi: 96
};
```

Run the demo:

```
npm start
```

Go to http://localhost:9999 in your browser.
