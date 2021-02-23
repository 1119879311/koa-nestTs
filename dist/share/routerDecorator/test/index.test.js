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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const koa_router_1 = __importDefault(require("koa-router"));
let rotuer = new koa_router_1.default({
    prefix: '/api'
});
class db {
    constructor() {
        this.name = "小明";
    }
}
let A = class A extends db {
    constructor() {
        super();
        this.a = 123456;
    }
    list(query, ctx) {
        console.log(this.a, this.name);
        console.log("getbefore");
        ctx.body = 12123;
        console.log("getnext");
        // return 123132
    }
    save(query, ctx) {
        console.log(this.a, this.name);
        console.log("getbefore");
        // ctx.body =123132
        ctx.response.status = 503;
        throw new Error("user error");
        console.log("getnext");
        // return 123132
    }
    getd() {
        return "lallalla";
    }
};
__decorate([
    index_1.GET(),
    __param(0, index_1.Query()), __param(1, index_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], A.prototype, "list", null);
__decorate([
    index_1.GET("save/:id"),
    __param(0, index_1.Query()), __param(1, index_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], A.prototype, "save", null);
A = __decorate([
    index_1.Controller("/A"),
    __metadata("design:paramtypes", [])
], A);
function testContorller(app) {
    index_1.ResigerRouter(rotuer, index_1.GetRouters(A));
    console.log("121212");
    app.use(rotuer.routes());
}
exports.testContorller = testContorller;
