import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxRemoteDesktopModule } from '../../src';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';

import {
  ClipboardModalComponent
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    ClipboardModalComponent
  ],
  imports: [
    BrowserModule,
    NgxRemoteDesktopModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [],
  entryComponents: [
    ClipboardModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
