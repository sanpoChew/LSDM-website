/* eslint-env browser */
import hyperform from 'hyperform/dist/hyperform.cjs.min';
import smoothscroll from 'smoothscroll-polyfill';
import svg4everybody from 'svg4everybody';
import Swiper from 'swiper/dist/js/swiper.min';
import buttonsToHeader from './modules/buttonsToHeader';
import formListener from './modules/forms';

hyperform(window);
smoothscroll.polyfill();
svg4everybody();

formListener(document.querySelectorAll('form'));

const movingButtons = document.querySelectorAll('.moveToHeader');

if (movingButtons) {
  buttonsToHeader(movingButtons);
}

const stripeButton = document.querySelector('.stripe-button-el');

if (stripeButton) {
  stripeButton.disabled = true;
  const form = document.querySelector('form');
  form.addEventListener('change', () => {
    if (form.checkValidity()) {
      stripeButton.disabled = false;
    }
  });
}

const video = document.querySelector('iframe');
const videoBtn = document.querySelector('#video-btn');

if (video) {
  videoBtn.addEventListener('click', () => {
    video.style.display = 'block';
    videoBtn.style.display = 'none';
  });
}

const BrochurePopUp = document.querySelector('#popup_formcontrol');

if (BrochurePopUp) {
  BrochurePopUp.addEventListener('change', () => {
    if (BrochurePopUp.checked) {
      window.scrollTo(0, 0);
    }
  });
}

const scrollButtons = document.querySelectorAll('.scroll-btn');

const addListen = {
  scroll: (element, link) => {
    element.addEventListener('click', () => {
      document.querySelector(link).scrollIntoView({ behavior: 'smooth' });
    });
  },
};

if (scrollButtons) {
  [].forEach.call(scrollButtons, (button) => {
    addListen.scroll(button, button.getAttribute('href'));
  });
}

if (document.querySelector('.swiper-container')) {
  window.mySwiper = new Swiper('.swiper-container', {
    autoHeight: true,
    centeredSlides: true,
    loop: true,
    loopAdditionalSlides: 1,
    slidesPerView: 4.5,
    spaceBetween: 25,
    breakpoints: {
      475: {
        slidesPerView: 1.35,
      },
      768: {
        spaceBetween: 10,
        slidesPerView: 2.25,
      },
      1200: {
        spaceBetween: 10,
        slidesPerView: 3.25,
      },
    },
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    pagination: '.swiper-pagination',
  });
}

const header = document.querySelector('.header');
const contactAnchor = header.querySelector('.header-nav #contact-anchor');
let headerAnimated = false;

const animateHeader = {
  expand: () => {
    const logo = document.querySelector('.header-main-logo a').cloneNode(true);
    logo.querySelector('span').remove();
    const contact = document.querySelector('.header-main-contact > div').cloneNode(true);
    header.classList.toggle('collapsed');
    header.querySelector('.header-nav a').before(logo);
    contactAnchor.appendChild(contact);
  },
  collapse: () => {
    header.querySelector('.header-nav a').remove();
    contactAnchor.removeChild(contactAnchor.firstChild);
    header.classList.toggle('collapsed');
  },
};

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80 && headerAnimated === false) {
      headerAnimated = true;
      animateHeader.expand();
      return;
    }
    if (window.scrollY < 80 && headerAnimated === true) {
      headerAnimated = false;
      animateHeader.collapse();
    }
  });
}

const mobileNav = header.querySelector('#mobile-nav');

document.querySelector('#close-menu-button').addEventListener('click', () => {
  mobileNav.checked = false;
});

const enrolForm = document.querySelector('.enrol-form > form');

if (enrolForm) {
  document.querySelector('.stripe-button-el').disabled = true;
  enrolForm.addEventListener('change', () => {
    if (enrolForm.checkValidity()) {
      document.querySelector('.stripe-button-el').disabled = false;
      return;
    }
    document.querySelector('.stripe-button-el').disabled = true;
  });
}
