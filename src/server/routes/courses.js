import Router from 'koa-router';
import Stripe from 'stripe';
import log from '../index';
import directus from '../lib/directus';
import hubspot from '../lib/hubspot';

function removeMeta(data, fields = []) {
  return data.map(d =>
    Object.assign(d, ...fields.map(f => ({ [f]: d[f].data[0][f] })))
  );
}

const courseRouter = new Router()
  .get('/', async (ctx) => {
    try {
      const { data } = await directus.getItems('courses');
      const parsedData = removeMeta(data, ['link']);
      const courseData = {
        long: parsedData.filter(c => c.Type === 'Long Course'),
        short: parsedData.filter(c => c.Type === 'Short Course').map((c) => {
          if (c.course_content) {
            return Object.assign(c, {
              course_content: c.course_content.split('\r\n'),
            });
          }
          return c;
        }),
      };
      await ctx.render('courses', Object.assign(ctx.state, {
        pageTitle: 'Our Courses | London School of Digital Marketing',
        courseData,
      }));
    } catch (err) {
      log.error({ err });
    }
  })
  .get('/:course', async (ctx) => {
    try {
      const { data: [page] } = await directus.getItems('pages', {
        filters: { link: ctx.params.course },
      });
      const templateName = page.course.data.Type === 'Short Course' ? 'module' : 'diploma';
      if (templateName === 'diploma') {
        const { data } = await directus.getItems('courses', {
          filters: { parent_course: page.course.data.id },
        });
        const parsedSubCourses = removeMeta(data, ['link']);
        page.sub_courses = parsedSubCourses.map(course =>
          Object.assign(course, {
            course_content: course.course_content.split('\r\n'),
          })
        );
      }
      await ctx.render(templateName, Object.assign(ctx.state, {
        pageTitle: `${page.name} | London School of Digital Marketing`,
        page,
      }));
    } catch (err) {
      log.error({ err });
    }
  })
  .get('/:course/enrol/:dealid', async (ctx) => {
    try {
      const { data: [{
        course: {
          data: course,
        },
      }] } = await directus.getItems('pages', {
        filters: { link: ctx.params.course },
      });
      course.link = ctx.params.course;
      const deal = await hubspot.getDeal(ctx.params.dealid, course.id);
      await ctx.render('enrol', Object.assign(ctx.state, {
        layout: 'enrol',
        pageTitle: `${course.name} | London School of Digital Marketing`,
        course,
        deal,
      }));
    } catch (err) {
      log.error({ err });
    }
  })
  .post('/:course/enrol/:dealid/enrol-complete', async (ctx) => {
    try {
      const stripe = Stripe(process.env.ST_KEY);
      const { data: [{
        course: {
          data: course,
        },
      }] } = await directus.getItems('pages', {
        filters: { link: ctx.params.course },
      });
      const charge = await stripe.charges.create({
        amount: course.price * 100,
        currency: 'gbp',
        source: ctx.request.fields.stripeToken,
        receipt_email: ctx.request.fields.stripeEmail,
        description: 'Enrolment',
      });
      log.info(charge);
      const contactFields = Object.assign({}, ctx.request.fields);
      delete contactFields.stripeToken;
      delete contactFields.stripeTokenType;
      delete contactFields.stripeEmail;
      const contact = await hubspot.addContact(contactFields);
      await hubspot.associateDeal(contact.vid, ctx.params.dealid);
      const deal = await hubspot.getDeal(ctx.params.dealid, ctx.params.courseid);
      await ctx.render('enrol-complete', Object.assign(ctx.state, {
        layout: 'enrol',
        pageTitle: 'Enrolment Complete | London School of Digital Marketing',
        course,
        deal,
      }));
    } catch (err) {
      log.error({ err });
    }
  });

export default courseRouter;
