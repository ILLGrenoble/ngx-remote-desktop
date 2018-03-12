# Usage

This example will give a basic remote desktop client with with four toolbar items and their associated handlers: take a screenshot, help, enter full screen and exit full screen. The example also shows you how you can override the connecting messages.

In your `app.component.ts`, you define a new remote desktop client like this:


```typescript
import { Component, OnInit } from '@angular/core';

import { RemoteDesktopManager } from '@illgrenoble/ngx-remote-desktop';
import { WebSocketTunnel } from '@illgrenoble/guacamole-common-js';

@Component({
    selector: 'app-root',
    template:`
          <ngx-remote-desktop [manager]="manager">
            
            <!-- Toolbar items -->
            <ngx-remote-desktop-toolbar-item align="left" *ngIf="manager.isConnected()" (click)="handleScreenshot()">
                <i class="fa fa-print"></i> Take screenshot
            </ngx-remote-desktop-toolbar-item>
            <ngx-remote-desktop-toolbar-item (click)="handleHelp()" align="right">Help</ngx-remote-desktop-toolbar-item>
            <ngx-remote-desktop-toolbar-item (click)="handleEnterFullScreen()" *ngIf="!manager.isFullScreen() && manager.isConnected()" align="right">
                <i class="fa fa-arrows-alt" aria-hidden="true"></i> Enter full screen
            </ngx-remote-desktop-toolbar-item>
            <ngx-remote-desktop-toolbar-item (click)="handleExitFullScreen()" *ngIf="manager.isFullScreen() && manager.isConnected()" align="right">
                Exit full screen
            </ngx-remote-desktop-toolbar-item>
            <!-- End toolbar items -->

            <!-- Override connection state messages -->
            <ngx-remote-desktop-connecting-message>
                <div class="ngx-remote-desktop-message-title ngx-remote-desktop-message-title-success">
                    CONNECTING TO REMOTE DESKTOP
                </div>
                <div class="ngx-remote-desktop-message-body">
                    Attempting to connect to the remote desktop. Waiting for response...
                </div>
            </ngx-remote-desktop-connecting-message>

            <!-- Status bar -->
            <ngx-remote-desktop-status-bar *ngIf="manager.isConnected()">
                <ngx-remote-desktop-status-bar-item>Hello world!</ngx-remote-desktop-status-bar-item>
            </ngx-remote-desktop-status-bar>
        </ngx-remote-desktop>
    `
})
export class AppComponent implements OnInit {

    private manager: RemoteDesktopManager;
    
    handleHelp() {
        console.log('Hello help');
    }

    handleScreenshot() {
        this.client.createScreenshot(blob => {
        if (blob) {
            // do something with blob....
            }
        });
    }

    handleEnterFullScreen() {
        this.manager.setFullScreen(true);
    }

    handleExitFullScreen() {
        this.manager.setFullScreen(false);
    }

    ngOnInit() {
        // Setup tunnel. The tunnel can be either: WebsocketTunnel, HTTPTunnel or ChainedTunnel
        const tunnel = new WebSocketTunnel('ws://localhost:8080');
        /**
         *  Create an instance of the remote desktop manager by 
         *  passing in the tunnel and parameters
         */
        this.manager = new RemoteDesktopManager(tunnel);

              // URL parameters (image, audio and other query parameters you want to send to the tunnel.)
        const parameters = {
            ip: '192.168.13.232',
            image: 'image/png',
            width: window.screen.width,
            height: window.screen.height,
        };
        /*
         * The manager will establish a connection to: 
         * ws://localhost:8080?width=n&height=n&ip=192.168.13.232&image=image/png
         */
        this.manager.connect(parameters);
    }

}
```

# Other features

All of these features below are used in the demo application.

The `RemoteDesktopManager` exposes some useful methods.

#### Focusing and unfocusing the display
Sometimes you need to unfocus the display so you can use keyboard events inside another component (i.e. text input inside a modal)
```typescript
  this.manager.setFocused(true|false);
```

#### Set full screen mode
Changing this value will bring the display in and out of full screen mode

```typescript
  this.manager.setFullScreen(true|false);
```

#### Screenshot
Take a screenshot of the connected remote desktop.

```typescript
  this.manager.createScreenshot(blob => {
      if (blob) {
          // do something with blob....
      }
  });
```

#### Thumbnail
Get a thumbnail of the connected remote desktop

```typescript
  const data = this.manager.createThumbnail(340, 240) {
  // do something with the data image url...
```

#### Receive data from the remote clipboard
Subscribe to the remote clipboard and receive data when text is cut or copied

```typescript
  this.manager.onRemoteClipboardData.subscribe(data => console.log('Got clipboard data', data));
```

#### Send data to the remote clipboard
```typescript
  this.manager.sendRemoteClipboardData('Hello clipboard!');
```

#### Get the current guacamole connection state
```typescript
  const state = this.manager.getState();
  if(state === RemoteDesktopManager.STATE.DISCONNECTED) {
    console.log('Oh no!');
  }
```

#### Getting access to the guacamole client and tunnel
```typescript
  const client = this.manager.getClient();
  const tunnel = this.manager.getTunnel();
```

### Get notified when a tunnel instruction is recevied
This can be useful for generating stats, .i.e. display the total data received from the tunnel
```typescript
this.manager.onTunnelInstruction.subscribe(instruction => {
    if (instruction && instruction.opcode === 'blob') {
        const data = atob(instruction.parameters[1]);
        this.totalTunnelDataReceived += data.length;
    }
});
```

