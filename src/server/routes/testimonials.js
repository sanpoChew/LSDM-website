import Router from 'koa-router';
import log from '../index';
import directus from '../lib/directus';

const courseRouter = new Router()
  .get('/', async (ctx) => {
    try {
      const { data } = await directus.getItems('Testimonials');
      await ctx.render('testimonials', Object.assign(ctx.state, {
        pageTitle: 'Testimonials | London School of Digital Marketing',
        data,
      }));
    } catch (err) {
      log.error({ err });
    }
  })
  .get('/:name', async (ctx) => {
    try {
      const { data: [testimonial] } = await directus.getItems('Testimonials', {
        filters: { Slug: ctx.params.name },
      });

      await ctx.render('testimonial', Object.assign(ctx.state, {
        pageTitle: `${testimonial.Title} | London School of Digital Marketing`,
        testimonial,
      }));
    } catch (err) {
      log.error({ err });
    }
  });

export default courseRouter;
