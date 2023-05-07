"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa2_cors_1 = __importDefault(require("koa2-cors"));
const koa_art_template_1 = __importDefault(require("koa-art-template"));
const nestjs_1 = require("./package/nestjs/src");
const middlewares_1 = require("./share/middlewares");
const index_1 = require("./utils/index");
const app_module_1 = require("./modules/app.module");
const pipes_1 = require("./share/pipes");
const auth_guard_1 = require("./share/guards/auth.guard");
const App = nestjs_1.KoaNestTs.create(app_module_1.appModule, { routerPrefix: "/api" });
const koaInastance = App.getKoa();
//管道
App.setGlobalPip((0, pipes_1.ValidationPipe)({
    validateError: (errs) => {
        let errRes = Object.values(errs[0].constraints);
        throw new Error(errRes[0]);
    },
}));
//全局守卫
App.setGlobalGuard(auth_guard_1.authGuard);
(0, koa_art_template_1.default)(koaInastance, {
    root: (0, index_1.resolveApp)("view"),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});
// 中间间
App.use((0, koa2_cors_1.default)(), (0, koa_bodyparser_1.default)(), middlewares_1.LoggerMwareInfo); //全局中间件
App.listen(3002, () => {
    nestjs_1.Logger.info("app is runing in prot 3002");
});
