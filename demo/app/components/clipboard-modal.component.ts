import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { RemoteDesktopClient } from '../../../src/services';

@Component({
    selector: 'app-clipboard-modal',
    template: `
        <div class="modal-header">
        <h4 class="modal-title">Clipboard</h4>
        <button type="button" class="close" aria-label="Close" (click)="close()">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body">
            <p>
            Text copied/cut within the remote desktop will appear here. Sending the text below will affect the remote desktop clipboard.</p>

            <form>
                <div class="form-group">
                    <textarea [(ngModel)]="text" name="text" autocomplete="off" autofocus class="form-control"></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button"
                    class="btn btn-primary"
                    (click)="submit()" 
                    [disabled]="text.length === 0">
                Send to remote desktop clipboard
            </button>
            <button type="button" class="btn btn-outline-dark" (click)="close()">Close</button>
        </div>
    `
})
export class ClipboardModalComponent implements OnInit {

    @Input()
    client: RemoteDesktopClient;

    private text = '';
    private clipboardData = [];
    private clipboardSubscription;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
        this.clipboardSubscription = this.client.onClipboard;
        this.clipboardSubscription.subscribe(data => this.text = data);
    }

    ngOnDestroy() {
        // if (this.clipboardSubscription !== null) {
        //     this.clipboardSubscription.unsubscribe();
        // }
    }

    public close() {
        this.activeModal.close(null);
    }

    submit() {
        this.activeModal.close(this.text);
    }

}
