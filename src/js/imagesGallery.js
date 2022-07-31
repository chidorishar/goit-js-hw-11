let throttle = require('lodash.throttle');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayAPI from './fetchImagesAPI';
import GalleryAPI from './galleryAPI';

const domEls = {
  searchForm: document.querySelector('#search-form'),
};

//in ms
const THROTTLE_TIMEOUT = 250;
//in px
const LOAD_MORE_IMAGES_OFFSET = 60;
let isNewSearch = true;
let galleryViewer = {};
let pixabayAPIInst = {};
let galleryAPIInst = {};

//main function
(() => {
  pixabayAPIInst = new PixabayAPI();
  galleryAPIInst = new GalleryAPI('#gallery-root');
  galleryViewer = new SimpleLightbox('.gallery a', { uniqueImages: false });

  domEls.searchForm.addEventListener('submit', onSearchFormSubmit);
  window.addEventListener('scroll', throttle(onPageScroll, THROTTLE_TIMEOUT));
})();

function onSearchFormSubmit(event) {
  event.preventDefault();

  const query = event.target.searchQuery.value;

  isNewSearch = true;
  Notify.warning('Searching...');
  pixabayAPIInst
    .loadImagesByQuery(query)
    .then(onBackendRespond)
    .catch(() => Notify.failure('Error!'));
}

function onBackendRespond({ hits: images, totalHits }) {
  if (totalHits && isNewSearch) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    renderImages(images);
    isNewSearch = false;

    return;
  } else if (!totalHits) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryAPIInst.clearGallery();

    return;
  }

  appendImagesToGallery(images);
  window.scrollBy({
    top: galleryAPIInst.getCardHeight() * 2,
    behavior: 'smooth',
  });
}

function onPageScroll() {
  if (getDeltaToLastGalleryImage() < LOAD_MORE_IMAGES_OFFSET) {
    if (!pixabayAPIInst.canLoadMoreImages()) {
      Notify.failure("That's all, folks!");

      return;
    }

    Notify.warning('Loading more images...');
    pixabayAPIInst.loadMoreImages().then(onBackendRespond);
  }
}

function renderImages(images) {
  galleryAPIInst.render(images);
  galleryViewer.refresh();
}

function appendImagesToGallery(images) {
  galleryAPIInst.appendImages(images);
  galleryViewer.refresh();
}

function getDeltaToLastGalleryImage() {
  return Math.abs(
    window.innerHeight -
      galleryAPIInst.getLastCardElement().getBoundingClientRect().bottom
  );
}
