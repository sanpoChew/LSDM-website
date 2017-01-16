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
  .post('/:course/brochure', async (ctx) => {
    await hubspot.addContact(ctx.request.fields);
    ctx.redirect(`/pdf/${ctx.params.course}.pdf`);
  })
  .post('/newsletter', async (ctx) => {
    await mailgun.addToList(ctx.request.fields.email);
    ctx.status = 200;
    ctx.body = 'Complete';
  });

export default formRouter;
