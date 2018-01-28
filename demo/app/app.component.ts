import { Component, OnInit, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { ClipboardModalComponent } from './components';
import * as FileSaver from 'file-saver';
import { RemoteDesktopManager } from '../../src/services';
import { WebSocketTunnel } from '@illgrenoble/guacamole-common-js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
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

    constructor(private ngbModal: NgbModal, private notificationService: NotificationsService) {

    }

    handleScreenshot(): void {
        this.manager.createScreenshot(blob => {
            if (blob) {
                FileSaver.saveAs(blob, `screenshot.png`);
            }
        });
    }

    isConnected() {
        return this.manager.isState('CONNECTED');
    }

    createModal(classRef) {
        this.isRemoteDesktopFocused = false;
        const modal = this.ngbModal.open(classRef, {
            size: 'lg',
            windowClass: 'modal-xxl',
            container: '.ngx-remote-desktop',
            keyboard: false
        });
        modal.componentInstance.manager = this.manager;
        return modal;
    }

    handleShareDesktop(): void {
        alert('Not implemented :(');
    }

    handleHelp(): void {
        alert('Not implemented :(');
    }

    handleSettings(): void {
        alert('Not implemented :(');
    }

    handleDisconnect(): void {
        this.manager.getClient().disconnect();
    }

    handleClipboard(): void {
        const modal = this.createModal(ClipboardModalComponent);
        modal.result.then((text) => {
            this.isRemoteDesktopFocused = true;
            this.manager.sendRemoteClipboardData(text);
        }, () => this.isRemoteDesktopFocused = true);
    }

    handleReconnect(): void {
        this.manager.connect();
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
