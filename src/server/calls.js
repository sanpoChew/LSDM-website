import request from 'request';
import log from './index';

// HubSpot

export function associateDeal(contactID, dealID) {
  const url = `https://api.hubapi.com/deals/v1/deal/${dealID}/associations/CONTACT?id=${contactID}&hapikey=6660dfd3-02c2-4bfa-ba82-e76136a30814&portalId=2651862`;
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
