import fs from 'fs';
import Router from 'koa-router';
import blogRouter from './blog';
import coursesRouter from './courses';
import diagnosticRouter from './diagnostic';
import formsRouter from './forms';
import testimonialsRouter from './testimonials';
import log from '../index';
import { loadBaseData } from '../lib/directus';

const assetManifest = JSON.parse(fs.readFileSync('./dist/manifest.json'));

const index = new Router()
  .get(/^\/(.*)(?:\/|$)/, async (ctx, next) => {
    try {
      const baseData = await loadBaseData();
      ctx.state = baseData;
      ctx.state.assetPaths = assetManifest;
      await next();
    } catch (err) {
      log.error({ err });
    }
  })
  .use('/blog', blogRouter.routes(), blogRouter.allowedMethods())
  .use('/courses', coursesRouter.routes(), coursesRouter.allowedMethods())
  .use('/diagnostic-tool', diagnosticRouter.routes(), diagnosticRouter.allowedMethods())
  .use('/forms', formsRouter.routes(), formsRouter.allowedMethods())
  .use('/testimonials', testimonialsRouter.routes(), testimonialsRouter.allowedMethods())
  .get('/', async (ctx) => {
    try {
      await ctx.render('home', Object.assign(ctx.state, {
        pageTitle: 'Home | London School of Digital Marketing',
      }));
    } catch (err) {
      log.error({ err });
    }
  })
  .get('/:page', async (ctx) => {
    try {
      const [page] = ctx.state.pages.filter(p => p.link === ctx.params.page);
      await ctx.render(page.link, Object.assign(page, {
        pageTitle: `${page.name} | London School of Digital Marketing`,
        nav: ctx.state.nav,
      }));
    } catch (err) {
      log.error({ err });
    }
  });

export default index;
