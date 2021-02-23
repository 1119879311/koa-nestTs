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
const routerDecorator_1 = require("../../routerDecorator");
const test_UserServer_1 = require("./test.UserServer");
class db {
    constructor() {
        this.name = "小明";
    }
}
let UserController = class UserController extends db {
    constructor(userService) {
        super();
        this.userService = userService;
        this.a = 123456;
    }
    list(query, ctx) {
        throw new Error("路由级错误....");
        //    try {
        //     let result =  this.userService.getUrl()
        //     console.log(this.a,this.name)
        //     console.log("getbefore")
        //     ctx.body = result
        //     console.log("getnext")
        //    } catch (error) {
        //         console.log(error)
        //    }    
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
    routerDecorator_1.GET(),
    __param(0, routerDecorator_1.Query()), __param(1, routerDecorator_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "list", null);
__decorate([
    routerDecorator_1.GET("save/:id"),
    __param(0, routerDecorator_1.Query()), __param(1, routerDecorator_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "save", null);
UserController = __decorate([
    routerDecorator_1.Controller("/A"),
    __metadata("design:paramtypes", [test_UserServer_1.UserServer])
], UserController);
exports.UserController = UserController;
