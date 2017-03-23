import bunyan from 'bunyan';
import 'dotenv/config';
import Koa from 'koa';
import body from 'koa-better-body';
import hbs from 'koa-hbs';
import path from 'path';
import router from './routes';

const log = bunyan.createLogger({ name: 'LSDM' });

hbs.registerHelper('cut', (text) => {
  const index = text.indexOf('<p>', 1000);

  return new hbs.SafeString(text.substring(0, index));
});

hbs.registerHelper('encodeMyString', i =>
  new hbs.SafeString(i.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')),
);

new Koa()
  .use(body())
  .use(hbs.middleware({
    viewPath: path.resolve('./src/views/pages'),
    partialsPath: path.resolve('./src/views/partials'),
    layoutsPath: path.resolve('./src/views/layouts'),
    defaultLayout: 'default',
    disableCache: process.env.NODE_ENV !== 'production',
  }))
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
