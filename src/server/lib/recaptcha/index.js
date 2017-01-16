import request from 'request';

function checkCaptcha(response) {
  return new Promise((resolve, reject) => {
    request.post({
      url: 'https://www.google.com/recaptcha/api/siteverify',
      qs: {
        secret: process.env.RC_KEY,
        response,
      },
    }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const j = JSON.parse(body);
        if (j.success) {
          resolve(j);
          return;
        }
        reject(Object.assign({ fail: 'captcha' }, j));
      }
      reject({ status: res.statusCode, error: err });
    });
  });
}

export default checkCaptcha;
