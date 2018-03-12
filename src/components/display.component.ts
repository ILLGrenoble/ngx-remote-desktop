import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    AfterViewChecked,
} from '@angular/core';
import { Client, Display, Keyboard, Mouse } from '@illgrenoble/guacamole-common-js';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { RemoteDesktopManager } from '../services';

@Component({
    selector: 'ngx-remote-desktop-display',
    host: { class: 'ngx-remote-desktop-viewport' },
    template: `
        <div class="ngx-remote-desktop-display" #display>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayComponent implements OnInit, OnDestroy, AfterViewChecked {

    /**
     * Emit the mouse move events to any subscribers
     */
    @Output()
    public onMouseMove = new BehaviorSubject(null);

    /**
     * Remote desktop manager
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

    /**
     * Subscriptions
     */
    private subscriptions: Subscription[] = [];

    constructor(private viewport: ElementRef, private renderer: Renderer2) {
    }

    /**
     * Create the display canvas when initialising the component
     */
    ngOnInit(): void {
        this.createDisplayCanvas();
        this.bindSubscriptions();
    }

    /**
     * Unbind all display input listeners when destroying the component
     */
    ngOnDestroy(): void {
        this.removeDisplay();
        this.removeDisplayInputListeners();
        this.unbindSubscriptions();
    }

    ngAfterViewChecked(): void {
        this.setDisplayScale();
    }

    /** 
     * Bind all subscriptions
     */
    private bindSubscriptions(): void {
        this.subscriptions.push(this.manager.onKeyboardReset.subscribe(_ => this.resetKeyboard()));
        this.subscriptions.push(this.manager.onFocused.subscribe(this.handleFocused.bind(this)));
    }

    /** 
     * Unbind all subscriptions
     */
    private unbindSubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    /**
     * Bind input listeners if display is focused, otherwise, unbind
     */
    private handleFocused(newFocused: boolean): void {
        if (newFocused) {
            this.bindDisplayInputListeners();
        } else {
            this.removeDisplayInputListeners();
        }
    }

    /**
     * Release all the keyboards when the window loses focus
     * @param event
     */
    @HostListener('window:blur', ['$event'])
    private onWindowBlur(event: any): void {
        this.resetKeyboard();
    }

    /**
     * Resize the display scale when the window is resized
     * @param event
     */
    @HostListener('window:resize', ['$event'])
    private onWindowResize(event: any): void {
        this.setDisplayScale();
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
        const scale = this.calculateDisplayScale(display);
        display.scale(scale);
    }

    /**
     * Get the remote desktop display
     */
    private getDisplay(): Display {
        return this.manager.getClient().getDisplay();
    }

    /**
     * Get the remote desktop client
     */
    private getClient(): Client {
        return this.manager.getClient();
    }

    /**
     * Calculate the scale for the display
     */
    private calculateDisplayScale(display: Display): number {
        const viewportElement = this.viewport.nativeElement;
        const scale = Math.min(viewportElement.clientWidth / display.getWidth(),
            viewportElement.clientHeight / display.getHeight());
        return scale;
    }

    /**
     * Assign the display to the client
     */
    private createDisplay(): void {
        const element = this.display.nativeElement;
        const display = this.getDisplay();
        this.renderer.appendChild(element, display.getElement());
    }

    /**
     * Remove the display
     */
    private removeDisplay(): void {
        const element = this.display.nativeElement;
        const display = this.getDisplay();
        this.renderer.removeChild(element, display.getElement());
    }

    /**
     * Bind input listeners for keyboard and mouse
     */
    private bindDisplayInputListeners(): void {
        this.removeDisplayInputListeners();
        this.mouse.onmousedown = this.mouse.onmouseup = this.mouse.onmousemove = this.handleMouseState.bind(this);
        this.keyboard.onkeyup = this.handleKeyUp.bind(this);
        this.keyboard.onkeydown = this.handleKeyDown.bind(this);
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
    private handleMouseState(mouseState: any): void {
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
     * Resetting the keyboard will release all keys
     */
    private resetKeyboard(): void {
        if (this.keyboard) {
            this.keyboard.reset();
        }
    }

    /**
     * Send key down event to the remote desktop
     * @param key 
     */
    private handleKeyDown(key: any): void {
        this.getClient().sendKeyEvent(1, key);
    }

    /**
     * Send key up event to the remote desktop
     * @param key
     */
    private handleKeyUp(key: any): void {
        this.getClient().sendKeyEvent(0, key);
    }

}
