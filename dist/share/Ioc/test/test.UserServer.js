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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_HttpServer_1 = require("./test.HttpServer");
const index_1 = require("../index");
const test_app_url_1 = require("./test.app_url");
let UserServer = class UserServer {
    constructor(httpServer, appUrl) {
        this.httpServer = httpServer;
        this.appUrl = appUrl;
    }
    getUrl() {
        console.log(this.httpServer);
        console.log(this.appUrl);
        return this.appUrl;
    }
};
UserServer = __decorate([
    index_1.Injectable(),
    __param(1, index_1.Inject(test_app_url_1.APP_URL)),
    __metadata("design:paramtypes", [test_HttpServer_1.HttpServer, String])
], UserServer);
exports.UserServer = UserServer;
