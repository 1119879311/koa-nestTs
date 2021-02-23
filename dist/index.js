"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const share_1 = require("./share");
const Middleware_1 = require("./share/Middleware");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const Logger_1 = require("./share/Logger");
const app_module_1 = require("./modules/app.module");
const authUser = function (opt) {
    console.log(opt.get("Perssions"), '以获取元数据');
    throw new Error("token is errors");
    // return true
};
const App = share_1.KoaNestTs.create(app_module_1.appModule);
App.setGlobalGuard(authUser);
App.use(Middleware_1.LoggerMwareInfo, koa_bodyparser_1.default());
App.listen(3001, () => {
    Logger_1.Logger.info("app is runing in prot 3001");
});
