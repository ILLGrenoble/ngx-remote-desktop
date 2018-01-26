# ngx-remote-desktop

### This is a WIP. Breaking changes are likely to happen. It has not yet been published to NPM.

`ngx-remote-desktop` is an Angular component for connecting to a remote desktop using the [guacamole remote desktop gateway](https://guacamole.apache.org/)

It has been built for use with Angular 5.0.0+. It has been tested in Chrome, Firefox, Edge and Safari. It makes heavy use of flex, therefore it will not work in browsers that do not support flex. 

There is no dependency on any presentation component library / framework (ng-bootstrap, clarity etc.).

By default, the only toolbar item available is to allow the user to go in and out of full screen mode, however, you can add as many toolbar items as you wish and create a handler in your main component. You can also override the scss if you wish to change the styling. The `RemoteDesktopClient` exposes some useful methods for generating a screenshot or thumbnail, getting the client state, subscribing to the remote desktop clipboard and sending data to the remote desktop clipboard.

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
npm i @ILLGrenoble/ngx-remote-desktop --save
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

import { RemoteDesktopClient } from '@ILLGrenoble/ngx-remote-desktop';

@Component({
    selector: 'app-root',
    template:`
        <ngx-remote-desktop [client]="client" [focused]="isRemoteDesktopFocused">
        </ngx-remote-desktop>
    `
})
export class AppComponent implements OnInit {

    private client: RemoteDesktopClient;

    /**
     * The keyboard and mouse input listeners to the remote display are only bound when
     * this is set to true.
     * Set this to false if you need to use the keyboard or mouse inside another component outside
     * of the display
     */
    private isRemoteDesktopFocused = true;

    ngOnInit() {
      // URL to a websocket broker that communicates with the guacd process
        const url = `ws://localhost/remote-desktop`;
        this.client = new RemoteDesktopClient(url);
        this.client.connect();
    }

}
```

This will give a basic remote desktop client with one toolbar item (full screen), here is an example with more toolbar items and their associated handlers:

```typescript
import { Component, OnInit } from '@angular/core';

import { RemoteDesktopClient } from '@ILLGrenoble/ngx-remote-desktop';

@Component({
    selector: 'app-root',
    template:`
        <ngx-remote-desktop [client]="client" [focused]="isRemoteDesktopFocused">
            <ngx-remote-desktop-toolbar-item (click)="handleScreenshot()" align="left">Take screenshot</ngx-emote-desktop-toolbar-item>
            <ngx-remote-desktop-toolbar-item (click)="handleHelp()" align="right">Help</ngx-remote-desktop-toolbar-item>
        </ngx-remote-desktop>
    `
})
export class AppComponent implements OnInit {

    private client: RemoteDesktopClient;
    
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
        const url = `ws://localhost/remote-desktop`;
        this.client = new RemoteDesktopClient(url);
        this.client.connect();
    }

}
```

### Other features

All of these features below are used in the demo application.

#### Screenshot
To take a screenshot of the connected remote desktop:

```typescript
  this.client.createScreenshot(blob => {
      if (blob) {
          // do something with blob....
      }
  });
```

#### Thumbnail
To get a thumbnail of the connected remote desktop:

```typescript
  const data = this.client.createThumbnail(340, 240) {
  // do something with the data image url...
```

#### Receive data from the remote clipboard
You can subscribe to the remote clipboard observable:

```typescript
  this.client.onClipboard.subscribe(data => console.log('Got clipboard data', data));
```

#### Send data to the remote clipboard
```typescript
  this.client.sendClipboard('Hello clipboard!');
```

#### Get the current guacamole connection state
```typescript
  const state = this.client.getState();
  if(state === RemoteDesktopClient.STATE.DISCONNECTED) {
    console.log('Oh no!');
  }
```

#### Getting access to the guacamole client and tunnel
```typescript
  const client = this.client.getClient();
  const tunnel = this.client.getTunnel();
```

### Thank you
Thank you to the guacamole team for a fantastic project
