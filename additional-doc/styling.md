# Styling

There is a default that comes out of the box with the module.

To use it, you need to include `release/themes/default.css` into your application. You can do this like this:

`@import "~@illgrenoble/ngx-remote-desktop/release/themes/default.css";`

## CSS classes

 - `ngx-remote-desktop`:  Master component class
	 - `ngx-remote-desktop-toolbar`: The main tool bar class
		 - `ngx-remote-desktop-toolbar-fullscreen`:  Toolbar when in full screen (the direction of the toolbar will always be vertical when in full screen)
		 - `ngx-remote-desktop-toolbar-items`: Toolbar items container
		 - `ngx-remote-desktop-toolbar-item`: Toolbar item
	 - `ngx-remote-desktop-container`: The main container
		 - `ngx-remote-desktop-viewport`: Holds the remote display
		 - `ngx-remote-desktop-message`: Messages (connecting, disconnected etc.)
			 - `ngx-remote-desktop-message-title`: Title of the message
			 - `ngx-remote-desktop-message-body`: Body of the message
	- `ngx-remote-desktop-status-bar`: Status bar
		`ngx-remote-desktop-status-bar-item`: Status bar item