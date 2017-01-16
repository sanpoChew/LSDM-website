import Router from 'koa-router';

const diagnosticRouter = new Router()
  .get('/start', async (ctx) => {
    await ctx.render('diagnostic-start', Object.assign(ctx.state, {
      layout: 'enrol',
      pageTitle: 'Diagnostic Tool | London School of Digital Marketing',
    }));
  });

export default diagnosticRouter;
