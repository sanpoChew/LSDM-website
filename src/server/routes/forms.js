import Router from 'koa-router';
import validator from 'validator';
import hubspot from '../lib/hubspot';
import mailgun from '../lib/mailgun';

function validateFields(fields) {
  return new Promise((resolve, reject) => {
    const invalid = [];
    Object.entries(fields).forEach((field) => {
      switch (field[0]) {
        case 'email':
          if (!validator.isEmail(field[1])) {
            invalid.push(field[0]);
          }
          return;
        default:
          return;
      }
    });
    invalid.length > 0 ? reject({ invalid }) : resolve();
  });
}

const formRouter = new Router()
  .post('/:form', async (ctx, next) => {
    try {
      await validateFields(ctx.request.fields);
      await next();
    } catch (err) {
      if (err.invalid) {
        ctx.status = 422;
        ctx.body = err.invalid;
        return;
      }
      throw err;
    }
  })
  .post('/city-filter', async (ctx) => {
    ctx.body = await hubspot.getDates(ctx.request.fields.city, ctx.request.fields.course);
  })
  .post('/contact-form', async (ctx) => {
    const contactFields = Object.keys(ctx.request.fields).reduce((obj, key) => {
      if (key !== 'query') {
        return Object.assign(obj, {
          [key]: ctx.request.fields[key],
        });
      }
      return obj;
    }, {});
    const contact = await hubspot.addContact(contactFields);
    if (contact.isNew) {
      await mailgun.sendNewContact(contact.vid, contactFields);
    }
    await mailgun.sendQuery(ctx.request.fields);
    ctx.redirect('/thank-you');
  })
  .post('/:course/brochure', async (ctx) => {
    const contact = await hubspot.addContact(ctx.request.fields);
    if (contact.isNew) {
      await mailgun.sendNewContact(contact.vid, ctx.request.fields);
    }
    ctx.redirect(`/pdf/${ctx.params.course}.pdf`);
  })
  .post('/newsletter', async (ctx) => {
    await mailgun.addToList(ctx.request.fields.email);
    ctx.status = 200;
    ctx.body = 'Complete';
  });

export default formRouter;
