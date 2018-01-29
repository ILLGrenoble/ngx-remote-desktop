"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Message component for showing error or success messages for when the connection
 * state changes
 */
var MessageComponent = /** @class */ (function () {
    function MessageComponent() {
        /**
         * Message type. Can be 'success' or 'error'
         */
        this.type = 'success';
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MessageComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MessageComponent.prototype, "message", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MessageComponent.prototype, "type", void 0);
    MessageComponent = __decorate([
        core_1.Component({
            selector: 'ngx-remote-desktop-message',
            template: "\n        <div class=\"ngx-remote-desktop-message\">\n            <div class=\"ngx-remote-desktop-message-title\"\n                [class.ngx-remote-desktop-message-title-success]=\"type === 'success'\"\n                [class.ngx-remote-desktop-message-title-error]=\"type === 'error'\">\n            {{ title | uppercase }}\n            </div>\n            <div class=\"ngx-remote-desktop-message-body\">\n                <p>{{ message }}</p>\n                <ng-content></ng-content>\n            </div>\n        </div>\n    "
        })
    ], MessageComponent);
    return MessageComponent;
}());
exports.MessageComponent = MessageComponent;
//# sourceMappingURL=message.component.js.map