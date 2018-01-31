import { ElementRef, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export declare class DisplayComponent implements OnInit, OnDestroy, DoCheck {
    private viewport;
    /**
     * Emit the mouse move events to any subscribers
     */
    onMouseMove: BehaviorSubject<any>;
    /**
     * Remote desktop manager
     */
    private manager;
    private display;
    /**
     * Remote desktop keyboard
     */
    private keyboard;
    /**
     * Remote desktop mouse
     */
    private mouse;
    constructor(viewport: ElementRef);
    /**
     * Create the display canvas when initialising the component
     */
    ngOnInit(): void;
    /**
     * Unbind all display input listeners when destroying the component
     */
    ngOnDestroy(): void;
    ngDoCheck(): void;
    /**
     * Bind input listeners if display is focused, otherwise, unbind
     */
    private handleFocused();
    /**
     * Release all the keyboards when the window loses focus
     * @param event
     */
    private onWindowBlur(event);
    /**
     * Create the remote desktop display and bind the event handlers
     */
    private createDisplayCanvas();
    /**
     * Get the remote desktop display and set the scale
     */
    private setDisplayScale();
    /**
     * Get the remote desktop display
     */
    private getDisplay();
    /**
     * Get the remote desktop client
     */
    private getClient();
    /**
     * Calculate the scale for the display
     */
    private calculateDisplayScale();
    /**
     * Assign the display to the client
     */
    private createDisplay();
    /**
     * Bind input listeners for keyboard and mouse
     */
    private bindDisplayInputListeners();
    /**
     * Remove all input listeners
     */
    private removeDisplayInputListeners();
    /**
     * Create the keyboard and mouse inputs
     */
    private createDisplayInputs();
    /**
     * Send mouse events to the remote desktop
     * @param mouseState
     */
    private handleMouseState(mouseState);
    /**
     * Send key down event to the remote desktop
     * @param key
     */
    private handleKeyDown(key);
    /**
     * Send key up event to the remote desktop
     * @param key
     */
    private handleKeyUp(key);
}
