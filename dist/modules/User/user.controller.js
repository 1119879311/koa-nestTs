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
exports.UserController = void 0;
// import { POST } from "src/share/RouterDecorator.all";
// import { Auth } from "../../share/Decorator";
// import { Perssions, PERSSIONSKEY } from "../../share/Decorator";
const router_1 = require("../../package/router/src");
const add_user_dto_1 = require("./dto/add.user.dto");
const user_serves_1 = require("./user.serves");
const decorators_1 = require("../../share/decorators");
const auth_guard_1 = require("../../share/guards/auth.guard");
let UserController = class UserController {
    constructor(userServer) {
        this.userServer = userServer;
    }
    // @Guard(authUser)
    // @Use(middelare)
    // @setMetadata("Perssions", "list")
    list(headers, ctx, name, query) {
        // @GetContext(PERSSIONSKEY, true) perssions: string // @Query("name") name: string // @Query() query: AddUserDto,
        // throw new Error("server is error")
        // console.log("headers", headers);
        // return this.userServer.find();
        ctx.render("index", { title: "title" });
    }
};
__decorate([
    (0, decorators_1.Auth)("list"),
    (0, router_1.GET)(),
    __param(0, (0, router_1.Header)()),
    __param(1, (0, router_1.Ctx)()),
    __param(2, (0, router_1.Query)("name")),
    __param(3, (0, router_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, add_user_dto_1.AddUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "list", null);
UserController = __decorate([
    (0, router_1.Guard)(auth_guard_1.authGuard),
    (0, decorators_1.Auth)()
    // @Use(middelare)
    // @Auth()
    // @setMetadata("per-group", "user")
    ,
    (0, router_1.Controller)("spc"),
    __metadata("design:paramtypes", [user_serves_1.UserServer])
], UserController);
exports.UserController = UserController;
