import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    OnInit,
    Output,
    OnChanges,
    OnDestroy,
    HostListener
} from '@angular/core';
import { Mouse, Keyboard } from 'guacamole-js';
import { BehaviorSubject } from 'rxjs';
import * as screenfull from 'screenfull';
import { RemoteDesktopManager } from '../services';

@Component({
    selector: 'ngx-remote-desktop-display',
    host: { class: 'ngx-remote-desktop-viewport' },
    template: `
        <div class="ngx-remote-desktop-display" #display>
        </div>
    `
})
export class DisplayComponent implements OnInit, OnDestroy, OnChanges {

    @Output()
    public onMouseMove = new BehaviorSubject(null);

    /**
     * Remote desktop client
     */
    @Input()
    private manager: RemoteDesktopManager;

    @ViewChild('display')
    private display: ElementRef;

    /**
     * Remote desktop keyboard
     */
    private keyboard: Keyboard;

    /**
     * Remote desktop mouse
     */
    private mouse: Mouse;

    @Input()
    private isFullScreen = false;

    /**
     * Bind input listeners if display is focused, otherwise, unbind
     */
    @Input()
    private isFocused = false;

    constructor(private viewport: ElementRef) {
    }

    ngOnInit(): void {
        this.createDisplayCanvas();
    }

    ngOnDestroy(): void {
        this.removeDisplayInputListeners();
    }

    ngOnChanges(changes: any): void {
        const isFocused = changes.isFocused;
        if (isFocused && !isFocused.firstChange) {
            this.bindDisplayInputListeners();
        }
        window.setTimeout(() => this.setDisplayScale(), 100);
    }

    @HostListener('window:resize', ['$event'])
    private onWindowResize(event): void {
        this.setDisplayScale();
    }

    @HostListener('window:blur', ['$event'])
    private onWindowBlur(event): void {
        if (this.keyboard) {
            // release all keys
            this.keyboard.reset();
        }
    }

    /**
     * Create the remote desktop display and bind the event handlers
     */
    private createDisplayCanvas(): void {
        this.createDisplay();
        this.createDisplayInputs();
        this.bindDisplayInputListeners();
    }

    /**
     * Get the remote desktop display and set the scale
     */
    private setDisplayScale() {
        const display = this.getDisplay();
        const scale = this.calculateDisplayScale();
        display.scale(scale);
    }

    /**
     * Get the remote desktop display
     */
    private getDisplay() {
        return this.manager.getClient().getDisplay();
    }

    /**
     * Get the remote desktop client
     */
    private getClient() {
        return this.manager.getClient();
    }

    /**
     * Calculate the scale for the display
     */
    private calculateDisplayScale() {
        const viewportElement = this.viewport.nativeElement;
        const screenElement = window.screen;
        const scale = Math.min(viewportElement.clientWidth / screenElement.width,
            viewportElement.clientHeight / screenElement.height);
        return scale;
    }

    /**
     * Assign the display to the client
     */
    private createDisplay(): void {
        const element = this.display.nativeElement;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        const display = this.getDisplay();
        element.appendChild(display.getElement());
    }

    /**
     * Bind input listeners for keyboard and mouse
     */
    private bindDisplayInputListeners(): void {
        this.removeDisplayInputListeners();
        if (this.isFocused) {
            this.mouse.onmousedown = this.mouse.onmouseup = this.mouse.onmousemove = this.handleMouseState.bind(this);
            this.keyboard.onkeyup = this.handleKeyUp.bind(this);
            this.keyboard.onkeydown = this.handleKeyDown.bind(this);
        }
    }

    /**
     * Remove all input listeners
     */
    private removeDisplayInputListeners(): void {
        if (this.keyboard) {
            this.keyboard.onkeydown = null;
            this.keyboard.onkeyup = null;
        }
        if (this.mouse) {
            this.mouse.onmousedown = this.mouse.onmouseup = this.mouse.onmousemove = null;
        }
    }

    /**
     * Create the keyboard and mouse inputs
     */
    private createDisplayInputs(): void {
        const display = this.display.nativeElement.children[0];
        this.mouse = new Mouse(display);
        this.keyboard = new Keyboard(window.document);
    }

    /**
     * Send mouse events to the remote desktop
     * @param mouseState
     */
    private handleMouseState(mouseState): void {
        const display = this.getDisplay();
        const scale = display.getScale();
        const scaledState = new Mouse.State(
            mouseState.x / scale,
            mouseState.y / scale,
            mouseState.left,
            mouseState.middle,
            mouseState.right,
            mouseState.up,
            mouseState.down);
        this.getClient().sendMouseState(scaledState);
        this.onMouseMove.next(mouseState);
    }

    /**
     * Send key down event to the remote desktop
     * @param key 
     */
    private handleKeyDown(key): void {
        this.getClient().sendKeyEvent(1, key);
    }

    /**
     * Send key up event to the remote desktop
     * @param key
     */
    private handleKeyUp(key): void {
        this.getClient().sendKeyEvent(0, key);
    }

}
