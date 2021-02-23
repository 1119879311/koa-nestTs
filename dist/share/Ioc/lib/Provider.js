"use strict";
// 提供着provider
Object.defineProperty(exports, "__esModule", { value: true });
function isClassProvider(arg) {
    return arg.useClass !== undefined;
}
exports.isClassProvider = isClassProvider;
function isValueProvider(arg) {
    return arg.useValue !== undefined;
}
exports.isValueProvider = isValueProvider;
function isFactoryProvider(arg) {
    return arg.useFactory !== undefined;
}
exports.isFactoryProvider = isFactoryProvider;
function isProvider(arg) {
    return arg.provide !== undefined;
}
exports.isProvider = isProvider;
