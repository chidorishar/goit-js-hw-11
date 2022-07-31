let throttle = require('lodash.throttle');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayAPI from './fetchImagesAPI';
import GalleryRender from './galleryRender';

const domEls = {
  searchForm: document.querySelector('#search-form'),
};

//in ms
const THROTTLE_TIMEOUT = 250;
let isNewSearch = true;
let galleryViewer = {};
let pixabayAPIInst = {};
let galleryRenderInst = {};

//main function
(() => {
  pixabayAPIInst = new PixabayAPI();
  galleryRenderInst = new GalleryRender('#gallery-root');
  galleryViewer = new SimpleLightbox('.gallery a', { uniqueImages: false });

  domEls.searchForm.addEventListener('submit', onSearchFormSubmit);
})();

function renderImages(images) {
  galleryRenderInst.render(images);
  galleryViewer.refresh();
}

function appendImagesToGallery(images) {
  galleryRenderInst.appendImages(images);
  galleryViewer.refresh();
}

function onSearchFormSubmit(event) {
  event.preventDefault();

  const query = event.target.searchQuery.value;

  isNewSearch = true;
  pixabayAPIInst.loadImagesByQuery(query).then(onBackendRespond);
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
    galleryRenderInst.clearGallery();

    return;
  }

  appendImagesToGallery(images);
}
