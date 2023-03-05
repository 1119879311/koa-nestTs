import { resolveApp } from './uitl/index';
import { KoaNestTs } from "./share";
import { LoggerMwareInfo } from "./share/Middleware";
import koaBodyParser from "koa-bodyparser";
import { Logger } from "./share/Logger";
import { appModule } from "./modules/app.module";
import { ValidationPipe } from "./share/Pipe/ValidationPipe";
import { authGuard } from "./share/Guard/Auth.guard";
import koa2Cors from "koa2-cors";
import koaArtTemplate from "koa-art-template"

const App = KoaNestTs.create(appModule, { routerPrefix: "/api" });
const koaInastance = App.getKoa()
//管道
App.setGlobalPip(
  ValidationPipe({
    validateError: (errs: any[]) => {
      let errRes: string[] = Object.values(errs[0].constraints);
      throw new Error(errRes[0]);
    },
  })
);
//全局守卫
App.setGlobalGuard(authGuard);


koaArtTemplate(koaInastance, {
  root: resolveApp("view"),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});
// 中间间
App.use(koa2Cors(), koaBodyParser(), LoggerMwareInfo); //全局中间件
App.listen(3001, () => {
  Logger.info("app is runing in prot 3001");
});
