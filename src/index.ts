import koaBodyParser from "koa-bodyparser";
import koa2Cors from "koa2-cors";
import  koaArtTemplate from "koa-art-template"
import { KoaNestTs ,Logger} from "@by/nestjs";
import { LoggerMwareInfo } from "./share/middlewares";
import { resolveApp } from './utils/index';
import { appModule } from "./modules/app.module";
import { ValidationPipe } from "./share/pipes";
import { authGuard } from "./share/guards/auth.guard";


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
App.listen(3002, () => {
  Logger.info("app is runing in prot 3002");
});
