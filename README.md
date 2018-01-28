# ngx-remote-desktop

### This is a WIP. Breaking changes are likely to happen. It has not yet been published to NPM.

`ngx-remote-desktop` is an Angular component for connecting to a remote desktop using the [guacamole remote desktop gateway](https://guacamole.apache.org/)

It has been built for use with Angular 5.0.0+. It has been tested in Chrome, Firefox, Edge and Safari. It makes heavy use of flex, therefore it will not work in browsers that do not support flex. 

There is no dependency on any presentation component library / framework (ng-bootstrap, clarity etc.). This component does not make any assertions about how the backend web socket broker to guacd is implemented.

By default, the only toolbar item available is to allow the user to go in and out of full screen mode, however, you can add as many toolbar items as you wish and create a handler in your main component. You can also override the scss if you wish to change the styling. The `RemoteDesktopManager` exposes some useful methods for generating a screenshot or thumbnail, getting the client state, subscribing to the remote desktop clipboard and sending data to the remote desktop clipboard.

![Screenshot](https://raw.githubusercontent.com/ILLGrenoble/ngx-remote-desktop/master/screenshot.png)

## Features
  - Fluid screen resizing and scaling
  - Full screen mode
  - Toolbar (auto hide when in full screen mode)
  - Take a screenshot
  - Get a thumbnail
  - Subscribe to the remote clipboard observable and receive remote clipboard data
  - Send data to the remote clipboard

For a full implementation example, see the demo.

## Installation

To use `ngx-remote-desktop` in your project install it via npm:

```
npm i @illgrenoble/ngx-remote-desktop --save
```

## Usage

After installing, include `NgxRemoteDesktopModule` in your application module like this:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxRemoteDesktopModule } from '@ILLGrenoble/ngx-remote-desktop';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [NgxRemoteDesktopModule, BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Then in your `app.component.ts`, you define a new remote desktop client like this:

```typescript
import { Component, OnInit } from '@angular/core';
import { RemoteDesktopManager } from '@ILLGrenoble/ngx-remote-desktop';
import { WebSocketTunnel } from '@illgrenoble/guacamole-common-js';

@Component({
    selector: 'app-root',
    template:`
        <ngx-remote-desktop [manager]="manager" [focused]="isRemoteDesktopFocused">
        </ngx-remote-desktop>
    `
})
export class AppComponent implements OnInit {

    private manager: RemoteDesktopManager;

    /**
     * The keyboard and mouse input listeners to the remote display are only bound when
     * this is set to true.
     * Set this to false if you need to use the keyboard or mouse inside another component outside
     * of the display
     */
    private isRemoteDesktopFocused = true;

    ngOnInit() {
        // Setup tunnel. The tunnel can be either: WebsocketTunnel, HTTPTunnel or ChainedTunnel
        const tunnel = new WebSocketTunnel('ws://localhost:8080');
        // URL parameters (image, audio and other query parameters you want to send to the tunnel.)
        const parameters = {
            ip: '192.168.13.232',
            image: 'image/png'
        };
        /**
         *  Create an instance of the remote desktop manager by 
         *  passing in the tunnel and parameters
         */
        this.manager = new RemoteDesktopManager(tunnel, parameters);
        /**
         *  ngx-remote-desktop will always send the max screen dimensions as we always want to scale down and never up
         *  You can override the dimensions parameters that are sent to the tunnel connection 
         */
        this.manager.setDimensionParameters('width', 'height');
        /*
         * The manager will establish a connection to: 
         * ws://localhost:8080?width=n&height=n&ip=192.168.13.232&image=image/png
         */
        this.manager.connect();
    }
}
```

This will give a basic remote desktop client with one toolbar item (full screen), here is an example with more toolbar items and their associated handlers:



```typescript
import { Component, OnInit } from '@angular/core';

import { RemoteDesktopManager } from '@ILLGrenoble/ngx-remote-desktop';
import { WebSocketTunnel } from '@illgrenoble/guacamole-common-js';

@Component({
    selector: 'app-root',
    template:`
        <ngx-remote-desktop [manager]="manager" [focused]="isRemoteDesktopFocused">
            <ngx-remote-desktop-toolbar-item (click)="handleScreenshot()" align="left">Take screenshot</ngx-emote-desktop-toolbar-item>
            <ngx-remote-desktop-toolbar-item (click)="handleHelp()" align="right">Help</ngx-remote-desktop-toolbar-item>
        </ngx-remote-desktop>
    `
})
export class AppComponent implements OnInit {

    private manager: RemoteDesktopManager;
    
    private isRemoteDesktopFocused = true;

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

   ngOnInit() {
        // Setup tunnel. The tunnel can be either: WebsocketTunnel, HTTPTunnel or ChainedTunnel
        const tunnel = new WebSocketTunnel('ws://localhost:8080');
        // URL parameters (image, audio and other query parameters you want to send to the tunnel.)
        const parameters = {
            ip: '192.168.13.232',
            image: 'image/png'
        };
        /**
         *  Create an instance of the remote desktop manager by 
         *  passing in the tunnel and parameters
         */
        this.manager = new RemoteDesktopManager(tunnel, parameters);
        /**
         *  ngx-remote-desktop will always send the max screen dimensions as we always want to scale down and never up
         *  You can override the dimensions parameters that are sent to the tunnel connection 
         */
        this.manager.setDimensionParameters('width', 'height');
        /*
         * The manager will establish a connection to: 
         * ws://localhost:8080?width=n&height=n&ip=192.168.13.232&image=image/png
         */
        this.manager.connect();
    }

}
```


### Other features

All of these features below are used in the demo application.

The `RemoteDesktopManager` exposes some useful methods.

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
Subscribe to the remote clipboard and receive data
when text is cut or copied

```typescript
  this.manager.onRemoteClipboardData.subscribe(data => console.log('Got clipboard data', data));
```

Send text to the remote clipboard
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

### Thank you
Thank you to the guacamole team for a fantastic project