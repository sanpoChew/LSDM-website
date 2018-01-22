import Router from 'koa-router';
import Stripe from 'stripe';
import log from '../index';
import directus from '../lib/directus';
import hubspot from '../lib/hubspot';

function removeMeta(data, fields = []) {
  return data.map(d =>
    Object.assign(d, ...fields.map(f => ({ [f]: d[f].data[0][f] }))),
  );
}

const courseRouter = new Router()
  .get('/', async (ctx) => {
    try {
      const { data } = await directus.getItems('Testimonials');
      await ctx.render('testimonials', Object.assign(ctx.state, {
        pageTitle: 'Testimonials | London School of Digital Marketing',
        data
      }));
    } catch (err) {
      log.error({ err });
    }
  })
  .get('/:name', async (ctx) => {
    try {
        const { data: [ testimonial ] } = await directus.getItems('Testimonials', {
            filters: { Slug: ctx.params.name },
        });

        console.log(testimonial);

        await ctx.render('testimonial', Object.assign(ctx.state, {
            pageTitle: `${testimonial.Title} | London School of Digital Marketing`,
            testimonial,
        }));
    } catch (err) {
        log.error({ err });
    }
  })

export default courseRouter;
