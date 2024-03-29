"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const ioc_1 = require("../../package/ioc/src");
const user_controller_1 = require("./user.controller");
const user_serves_1 = require("./user.serves");
const usersql_server_1 = require("./usersql.server");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, ioc_1.Module)({
        controllers: [user_controller_1.UserController],
        providers: [user_serves_1.UserServer, usersql_server_1.SqlServer],
    })
], UserModule);
exports.UserModule = UserModule;
