import { KoaNestTs, Logger } from '@by/nestjs';
import { appModule } from './app.module';
import { setStateMiddleware } from './share/middlewares';
import { authGuards } from './share/guards';
import { ValidationPip } from './share/pipes';

function start() {
  const app = KoaNestTs.create(appModule, { prefix: '/adminConsole' });
  app.use(setStateMiddleware);
  app.setGlobalGuard(authGuards);
  app.setGlobalPip(new ValidationPip());
  app.listen(8080, () => {
    Logger.info('app is runing in prot 8080');
  });
}
start();
