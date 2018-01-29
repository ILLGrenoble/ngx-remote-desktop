# ngx-remote-desktop

For installation and usage details go [here](https://illgrenoble.github.io/ngx-remote-desktop/additional-documentation/installation.html)

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

For a full implementation example, see the [demo source code](https://github.com/ILLGrenoble/ngx-remote-desktop/tree/master/demo).

## Installation

To use ngx-remote-desktop in your project, install it via npm:

```
npm i @illgrenoble/ngx-remote-desktop --save
```

### Thank you
Thank you to the guacamole team for a fantastic project.