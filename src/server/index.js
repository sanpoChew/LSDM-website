import bunyan from 'bunyan';
import co from 'co';
import 'dotenv/config';
import Koa from 'koa';
import body from 'koa-better-body';
import convert from 'koa-convert';
import hbs from 'koa-hbs';
import path from 'path';
import router from './routes';

const log = bunyan.createLogger({ name: 'LSDM' });

new Koa()
  .use(convert(body()))
  .use(convert(hbs.middleware({
    viewPath: path.resolve('./src/views/pages'),
    partialsPath: path.resolve('./src/views/partials'),
    layoutsPath: path.resolve('./src/views/layouts'),
    defaultLayout: 'default',
    disableCache: true,
  })))
  .use(async (ctx, next) => {
    const render = ctx.render;
    ctx.render = async function _convertedRender(...args) {
      return co.call(ctx, render.apply(ctx, args));
    };
    await next();
  })
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      log.error(err);
    }
  })
  .use(router.routes())
  .listen(3000);

export default log;
