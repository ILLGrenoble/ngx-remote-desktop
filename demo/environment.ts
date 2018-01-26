import { disableDebugTools } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

const _decorateModuleRef = function identity<T>(value: T): T { return value; };

export const decorateModuleRef = _decorateModuleRef;
