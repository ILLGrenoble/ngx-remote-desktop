import { Component, OnInit, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { ClipboardModalComponent } from './components';
import * as FileSaver from 'file-saver';
import { RemoteDesktopManager } from '../../src/services';

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
            this.manager.sendClipboard(text);
        }, () => this.isRemoteDesktopFocused = true);
    }

    handleReconnect(): void {
        this.manager.connect();
    }

    ngOnInit() {
        // Setup client
        const url = 'ws://localhost:8080';
        this.manager = new RemoteDesktopManager(url, { ip: '192.168.13.232' });
        this.manager.connect();
    }

}
