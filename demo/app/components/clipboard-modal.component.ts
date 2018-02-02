import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { RemoteDesktopManager } from '../../../src/services';

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
                Text copied/cut within the remote desktop will appear here. 
                Sending the text below will affect the remote desktop clipboard.
            </p>
            <form>
                <div class="form-group">
                    <ngx-codemirror 
                        [(ngModel)]="text" 
                        name="text"
                        [options]="{
                            lineNumbers: true,
                            theme: 'material',
                            mode: 'text/plain'
                        }">
                    </ngx-codemirror>
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
    manager: RemoteDesktopManager;

    private text = '';
    private clipboardData = [];
    private clipboardSubscription;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
        this.clipboardSubscription = this.manager.onRemoteClipboardData;
        this.clipboardSubscription.subscribe(data => this.text = data);
    }

    public close() {
        this.activeModal.close(null);
    }

    submit() {
        this.activeModal.close(this.text);
    }

}
