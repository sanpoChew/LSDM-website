import Client from 'hubspot';
import request from 'request';
import log from '../../index';

const client = new Client();
client.useKey(process.env.HS_KEY);

function addContact(contact) {
  return new Promise((resolve, reject) => {
    client.contacts.createOrUpdate(contact.email, {
      properties: Object.entries(contact).map(entry => ({
        property: entry[0],
        value: entry[1],
      })),
    }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

const pipelines = {
  getID: location =>
    new Promise((resolve) => {
      request.get({
        url: `https://api.hubapi.com/deals/v1/pipelines?hapikey=${process.env.HS_KEY}&portalId=2651862`,
      }, (err, res, body) => {
        const j = JSON.parse(body);
        Array.from(j).forEach((pipeline) => {
          if (pipeline.active && pipeline.label === location) {
            resolve(pipeline.pipelineId);
          }
        });
      });
    }),
  getLocation: pipelineID =>
    new Promise((resolve) => {
      request.get({
        url: `https://api.hubapi.com/deals/v1/pipelines/${pipelineID}?hapikey=${process.env.HS_KEY}&portalId=2651862`,
      }, (err, res, body) => {
        const j = JSON.parse(body);
        resolve(j.label);
      });
    }),
};

function formatDate(date, courseID) {
  if (courseID === '10') {
    const endDate = new Date(date);
    endDate.setTime(endDate.getTime() + (5 * 86400000));
    return `${date.getDate()} ${date.toLocaleDateString('en', { month: 'short' })} - ${endDate.getDate()} ${endDate.toLocaleDateString('en', { month: 'short' })} ${endDate.getFullYear()}`;
  }
  return `${date.getDate()} ${date.toLocaleDateString('en', { month: 'short' })} ${date.getFullYear()}`;
}

async function getDates(location, course) {
  const pipelineID = await pipelines.getID(location);
  return new Promise((resolve) => {
    request.get({
      url: `https://api.hubapi.com/deals/v1/deal/paged?hapikey=${process.env.HS_KEY}&portalId=2651862&includeAssociations=true&properties=pipeline&properties=course_size&properties=closedate&properties=amount&properties=course`,
    }, (err, res, body) => {
      const j = JSON.parse(body);
      const courses = [];
      j.deals.forEach((deal) => {
        const prop = deal.properties;
        if (
          !deal.isDeleted &&
          prop.pipeline.value === pipelineID &&
          prop.course.value === course &&
          prop.closedate.value >= Date.now()
        ) {
          const courseDate = new Date(Number(prop.closedate.value));
          courses.push({
            id: deal.dealId,
            location,
            date: formatDate(courseDate, course),
            price: `£${prop.amount.value}.00`,
            full: (prop.num_associated_contacts.value >= prop.course_size.value),
          });
          return;
        }
      });
      resolve(courses);
    });
  });
}

async function getDeal(dealID, courseID) {
  return new Promise((resolve, reject) => {
    request.get({
      url: `https://api.hubapi.com/deals/v1/deal/${dealID}?hapikey=${process.env.HS_KEY}&portalId=2651862`,
    }, (err, res, body) => {
      const j = JSON.parse(body);
      if (j.status && j.status.error) {
        reject(j);
        return;
      }
      if (j.properties.num_associated_contacts.value >= j.properties.course_size.value) {
        reject({ full: true });
        return;
      }
      pipelines.getLocation(j.properties.pipeline.value)
        .then((location) => {
          resolve({
            id: dealID,
            date: formatDate(new Date(Number(j.properties.closedate.value)), courseID),
            price: j.properties.amount.value,
            location,
          });
        });
    });
  });
}

function associateDeal(contactID, dealID) {
  const url = `https://api.hubapi.com/deals/v1/deal/${dealID}/associations/CONTACT?id=${contactID}&hapikey=${process.env.HS_KEY}&portalId=2651862`;
  return new Promise((resolve) => {
    request.put({
      url,
    }, (err, res, body) => {
      if (!err && res.statusCode === 204) {
        resolve();
        return;
      }
      log.error(body);
      resolve();
    });
  });
}

export default {
  addContact,
  associateDeal,
  getDates,
  getDeal,
};
