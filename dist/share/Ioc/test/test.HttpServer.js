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
const index_1 = require("../index");
const test_app_url_1 = require("./test.app_url");
let HttpServer = class HttpServer {
    constructor(appUrl) {
        this.appUrl = appUrl;
        console.log(this.appUrl, "HttpServer int----------");
    }
};
HttpServer = __decorate([
    index_1.Injectable(),
    __param(0, index_1.Inject(test_app_url_1.APP_URL)),
    __metadata("design:paramtypes", [String])
], HttpServer);
exports.HttpServer = HttpServer;
