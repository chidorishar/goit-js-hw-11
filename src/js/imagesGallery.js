var throttle = require('lodash.throttle');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import { fetchCountries } from './fetchImages';

import cardTmpl from './markup/layouts/cardMarkup.hbs';

const domEls = {
  // input: document.querySelector('#search-box'),
  // countryList: document.querySelector('.country-list'),
  // countryInfo: document.querySelector('.country-info'),
};

//in ms
const THROTTLE_TIMEOUT = 250;

//main function
(() => {
  // domEls.input.addEventListener('input', throttle(onInput, DEBOUNCE_DELAY));
})();
