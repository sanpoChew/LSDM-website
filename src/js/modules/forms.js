/* eslint-env browser */

function updateFormStatus(statusDiv, status, fields = []) {
  while (statusDiv.lastChild) {
    statusDiv.removeChild(statusDiv.lastChild);
  }
  if (fields.length) {
    fields.forEach((field) => {
      const messageDiv = document.createElement('div');
      const messageString = document.createTextNode(`There was a problem
        with your ${field}, please try again.`);
      statusDiv.appendChild(messageDiv.appendChild(messageString));
    });
    return;
  }
  const messageString = document.createTextNode(status);
  statusDiv.appendChild(messageString);
}

function createButton(dealID) {
  const block = document.createElement('div');
  block.setAttribute('class', 'action-block');
  const link = document.createElement('a');
  link.setAttribute('class', 'action-link');
  link.setAttribute('target', '_blank');
  link.setAttribute('href', `${window.location.pathname}/enrol/${dealID}`);
  link.textContent = 'Enrol Now';
  block.appendChild(link);
  return block;
}


const dateSelectForm = {
  reset(dateTable) {
    const dateTableBody = dateTable.querySelector('tbody');
    dateTable.removeAttribute('style');
    while (dateTableBody.firstChild) {
      dateTableBody.removeChild(dateTableBody.firstChild);
    }
  },
  loadDates(dates, dateTable, statusBox) {
    if (!dates.length) {
      updateFormStatus(statusBox, 'Sorry, no courses are available.');
      return;
    }
    updateFormStatus(statusBox, '');
    const dateTableBody = dateTable.querySelector('tbody');
    dateTable.style.display = 'table';
    dates.forEach((course, i) => {
      const row = dateTableBody.insertRow(i);
      row.insertCell().textContent = course.location;
      row.insertCell().textContent = course.date;
      row.insertCell().textContent = course.price;
      if (!course.full) {
        row.insertCell().appendChild(createButton(course.id));
        return;
      }
      row.insertCell().textContent = 'Full';
      updateFormStatus(statusBox, 'If you want to apply for a full course, please call us at 0203 3732 0578');
    });
  },
};

function handlePostResult(form, statusBox, res) {
  switch (form.id) {
    case 'city-filter': {
      const dateTable = document.querySelector('.course-payment-date-select > table');
      dateSelectForm.reset(dateTable);
      dateSelectForm.loadDates(res, dateTable, statusBox);
      break;
    }
    default:
      return;
  }
}

function addPostEvent(form) {
  const eventType = form.id.endsWith('filter') ? 'change' : 'submit';
  form.addEventListener(eventType, (e) => {
    e.preventDefault();
    const statusBox = form.querySelector('.formStatus');
    updateFormStatus(statusBox, 'Loading...');
    fetch(`/forms/${form.id}`, {
      method: 'post',
      body: new FormData(form),
    }).then(res => res.json()).then(j => handlePostResult(form, statusBox, j));
  });
}

const connectForms = (forms) => {
  [].forEach.call(forms, (f) => {
    if (f.getAttribute('method') !== 'post') {
      addPostEvent(f);
    }
  });
};

export default connectForms;
