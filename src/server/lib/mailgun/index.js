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

async function sendNewContact(hubspotID, fields) {
  try {
    const studentName = `${fields.firstname} ${fields.lastname}`;
    const hubspotLink = `https://app.hubspot.com/sales/2651862/contact/${hubspotID}/`;
    const message = {
      from: 'System <no-reply@londonschoolofdigitalmarketing.com>',
      to: 'marriott@londonschoolofdigitalmarketing.com',
      subject: `${studentName} is a new contact in Hubspot.`,
      text: `
        ${studentName} is a new contact.

        You can see their contact page here: ${hubspotLink}
      `,
    };
    return await mailgun.messages().send(message);
  } catch (err) {
    throw (err);
  }
}

async function sendQuery(fields) {
  try {
    const studentName = `${fields.firstname} ${fields.lastname}`;
    const message = {
      from: `${studentName} <${fields.email}>`,
      to: 'marriott@londonschoolofdigitalmarketing.com',
      subject: `${studentName} has a question.`,
      text: fields.query,
    };
    return await mailgun.messages().send(message);
  } catch (err) {
    throw err;
  }
}

export default {
  addToList,
  sendNewContact,
  sendQuery,
};
