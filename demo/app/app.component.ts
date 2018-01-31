import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { ClipboardModalComponent } from './components';
import * as FileSaver from 'file-saver';
import { RemoteDesktopManager } from '../../src/services';
import { WebSocketTunnel } from '@illgrenoble/guacamole-common-js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['../../src/themes/default.scss', './app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    private manager: RemoteDesktopManager;

    constructor(private ngbModal: NgbModal, private notificationService: NotificationsService) {

    }

    handleScreenshot(): void {
        this.manager.createScreenshot(blob => {
            if (blob) {
                FileSaver.saveAs(blob, `screenshot.png`);
            }
        });
    }

    createModal(classRef) {
        this.manager.setFocused(false);
        const modal = this.ngbModal.open(classRef, {
            size: 'lg',
            windowClass: 'modal-xxl',
            container: '.ngx-remote-desktop',
            keyboard: false
        });
        modal.componentInstance.manager = this.manager;
        return modal;
    }


    handleDisconnect(): void {
        this.manager.getClient().disconnect();
    }

    handleEnterFullScreen() {
        this.manager.setFullScreen(true);
    }

    handleExitFullScreen() {
        this.manager.setFullScreen(false);
    }

    handleClipboard(): void {
        const modal = this.createModal(ClipboardModalComponent);
        modal.result.then((text) => {
            this.manager.setFocused(true);
            this.manager.sendRemoteClipboardData(text);
        }, () => this.manager.setFocused(true));
    }

    ngOnInit() {
        // Setup tunnel. The tunnel can be either: WebsocketTunnel, HTTPTunnel or ChainedTunnel
        const tunnel = new WebSocketTunnel('ws://hallpclnx.ill.fr:8080');
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
