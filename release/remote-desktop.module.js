"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var animations_1 = require("@angular/platform-browser/animations");
var components_1 = require("./components");
var NgxRemoteDesktopModule = /** @class */ (function () {
    function NgxRemoteDesktopModule() {
    }
    NgxRemoteDesktopModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                animations_1.BrowserAnimationsModule
            ],
            declarations: [
                components_1.RemoteDesktopComponent,
                components_1.ToolbarItemComponent,
                components_1.MessageComponent,
                components_1.DisplayComponent,
                components_1.ErrorMessageComponent,
                components_1.DisconnectedMessageComponent,
                components_1.ConnectingMessageComponent,
                components_1.StatusBarComponent,
                components_1.StatusBarItemComponent
            ],
            exports: [
                components_1.RemoteDesktopComponent,
                components_1.ToolbarItemComponent,
                components_1.ErrorMessageComponent,
                components_1.DisconnectedMessageComponent,
                components_1.ConnectingMessageComponent,
                components_1.StatusBarComponent,
                components_1.StatusBarItemComponent
            ],
            entryComponents: [],
            bootstrap: [components_1.RemoteDesktopComponent]
        })
    ], NgxRemoteDesktopModule);
    return NgxRemoteDesktopModule;
}());
exports.NgxRemoteDesktopModule = NgxRemoteDesktopModule;
//# sourceMappingURL=remote-desktop.module.js.map