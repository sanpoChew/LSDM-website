/* eslint-env browser */
import 'cookieconsent2';
import hyperform from 'hyperform/dist/hyperform.cjs.min';
import smoothscroll from 'smoothscroll-polyfill';
import svg4everybody from 'svg4everybody';
import Swiper from 'swiper/dist/js/swiper.min';
import buttonsToHeader from './modules/buttonsToHeader';
import formListener from './modules/forms';
import './scss/base.scss';

window.cookieconsent_options = {
  message: 'We use cookies to ensure you get the best experience on our website',
  dismiss: 'Got it!',
  learnMore: 'More info',
  link: null,
  theme: 'dark-floating',
};

hyperform(window);
smoothscroll.polyfill();
svg4everybody();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
}(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'));

ga('create', 'UA-89685544-1', 'auto');
ga('send', 'pageview');

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
