/* eslint-env browser */

function getBreakPoint(buttons) {
  const positions = [].map.call(buttons, (button) => {
    const btnTop = button.getBoundingClientRect().top;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return (btnTop + scrollTop);
  });
  return Math.max(...positions);
}

function addButtonsToHeader(buttons) {
  const buttonAnchor = document.querySelector('#button-anchor');
  if (buttonAnchor.offsetWidth < 350) { // 295 is absolute minimum
    const navLinks = document.querySelectorAll('.navLink');
    navLinks.forEach((link) => {
      link.style.display = 'none';
    });
  }
  buttons.forEach((button) => {
    const newButton = button.cloneNode(true);
    if (newButton.getAttribute('for') === 'diploma_formcontrol') {
      newButton.addEventListener('click', () => {
        window.scrollTo(0, 0);
      });
    }
    buttonAnchor.appendChild(newButton);
  });
}

function removeButtonsFromHeader() {
  const buttons = document.querySelectorAll('#button-anchor .moveToHeader');
  buttons.forEach((button) => {
    button.parentNode.removeChild(button);
  });
  const navLinks = document.querySelectorAll('.navLink');
  navLinks.forEach((link) => {
    link.removeAttribute('style');
  });
}

const buttonsToHeader = (buttons) => {
  const breakPoint = getBreakPoint(buttons);
  let buttonsInHeader = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > breakPoint && !buttonsInHeader) {
      addButtonsToHeader(buttons);
      buttonsInHeader = true;
    }
    if (window.scrollY < breakPoint && buttonsInHeader) {
      removeButtonsFromHeader();
      buttonsInHeader = false;
    }
  });
};

export default buttonsToHeader;
