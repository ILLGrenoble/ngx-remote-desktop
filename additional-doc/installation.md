# Installation

To use `ngx-remote-desktop` in your project install it via npm:

```
npm i @illgrenoble/ngx-remote-desktop --save
```

We also require two peer dependencies:

```
npm i @illgrenoble/guacamole-common-js --save
npm i screenfull --save
```

After installing, include `NgxRemoteDesktopModule` in your application module like this:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxRemoteDesktopModule } from '@illgrenoble/ngx-remote-desktop';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [NgxRemoteDesktopModule, BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
```