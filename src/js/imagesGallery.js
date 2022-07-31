let throttle = require('lodash.throttle');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import cardsTmpl from './markup/layouts/cardMarkup.hbs';
import pixabayAPI from './fetchImagesAPI';
import PixabayAPI from './fetchImagesAPI';

const domEls = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#images-wrapper'),
};

//in ms
const THROTTLE_TIMEOUT = 250;
let gallery = {};
let pixabayAPIInst = {};

//main function
(() => {
  pixabayAPIInst = new pixabayAPI();
  gallery = new SimpleLightbox('.gallery a', { uniqueImages: false });
  pixabayAPIInst = new PixabayAPI();

  domEls.searchForm.addEventListener('submit', onSearchFormSubmit);
})();

function renderImages({ hits: images }) {
  domEls.gallery.innerHTML = cardsTmpl({ images });
  gallery.refresh();
}

function onSearchFormSubmit(event) {
  event.preventDefault();

  const query = event.target.searchQuery.value;

  pixabayAPIInst.loadImagesByQuery(query).then(renderImages);
}
