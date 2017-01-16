import Mailgun from 'mailgun-js';

const list = 'newsletter@mg.londonschoolofdigitalmarketing.com';
const mailgun = new Mailgun({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN,
});

async function checkListSub(address) {
  try {
    const { member: { subscribed } } = await mailgun.lists(list).members(address).info();
    return subscribed;
  } catch (err) {
    return false;
  }
}

async function addToList(address) {
  try {
    await mailgun.lists(list).members().create({ subscribed: true, address });
  } catch (err) {
    const subscribed = checkListSub(address);
    if (!subscribed) {
      throw err;
    }
  }
}

export default {
  addToList,
};

// function emailContact(contactID, contactFields) {
//   const studentName = `${contactFields.firstname} ${contactFields.lastname}`;
//   const studentLink = `https://app.hubspot.com/sales/2651862/contact/${contactID}/`;
//   return new Promise((resolve, reject) => {
//     request.post('https://api.mailgun.net/v3/mg.londonschoolofdigitalmarketing.com/messages', {
//       auth: {
//         user: 'api',
//         pass: '',
//       },
//       form: {
//         from: `${studentName} <${contactFields.email}>`,
//         to: 'marriott@londonschoolofdigitalmarketing.com',
//         subject: 'New Contact',
//         text: `
//         ${studentName} is a new contact.
//
//         You can see their contact page here: ${studentLink}
//         `,
//       },
//     }, (err, res, body) => {
//       if (!err && res.statusCode === 200) {
//         const j = JSON.parse(body);
//         if (j.id) {
//           resolve(j);
//           return;
//         }
//         reject(Object.assign({ fail: 'email' }, j));
//       }
//       reject({ fail: 'email', status: res.statusCode, error: err });
//     });
//   });
// }
//
// function emailQuery(contactFields, query, contactID) {
//   const studentName = `${contactFields.firstname} ${contactFields.lastname}`;
//   const studentLink = `https://app.hubspot.com/sales/2651862/contact/${contactID}/`;
//   return new Promise((resolve, reject) => {
//     request.post('https://api.mailgun.net/v3/mg.londonschoolofdigitalmarketing.com/messages', {
//       auth: {
//         user: 'api',
//         pass: '',
//       },
//       form: {
//         from: `${studentName} <${contactFields.email}>`,
//         to: 'marriott@londonschoolofdigitalmarketing.com',
//         subject: 'New Query',
//         text: `
//         ${studentName} has a question:
//
//           ${query}
//
//         Contact Page: ${studentLink}
//         `,
//       },
//     }, (err, res, body) => {
//       if (!err && res.statusCode === 200) {
//         const j = JSON.parse(body);
//         if (j.id) {
//           resolve(j);
//           return;
//         }
//         reject(Object.assign({ fail: 'email' }, j));
//       }
//       reject({ fail: 'email', status: res.statusCode, error: err });
//     });
//   });
// }
