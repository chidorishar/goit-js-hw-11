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
let intersectObserver = {};

//main function
(() => {
  pixabayAPIInst = new PixabayAPI();
  galleryAPIInst = new GalleryAPI('#gallery-root');
  galleryViewer = new SimpleLightbox('.gallery a', { uniqueImages: false });

  domEls.searchForm.addEventListener('submit', onSearchFormSubmit);
  intersectObserver = new IntersectionObserver(onLastImageIsSeen, {
    threshold: 0.2,
  });
})();

function onSearchFormSubmit(event) {
  event.preventDefault();

  const query = event.target.searchQuery.value;

  isNewSearch = true;
  Notify.info('Searching...');
  makeRequestToPixabay(
    pixabayAPIInst.loadImagesByQuery.bind(pixabayAPIInst),
    query
  );
}

function onBackendSuccessRespond({ hits: images, totalHits }) {
  if (!totalHits) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryAPIInst.clearGallery();

    return;
  }

  if (isNewSearch) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    window.scrollTo({ top: 0 });
    renderImages(images);
    isNewSearch = false;
  } else {
    appendImagesToGallery(images);
    window.scrollBy({
      top: galleryAPIInst.getCardHeight() * 2,
      behavior: 'smooth',
    });
  }
  intersectObserver.observe(galleryAPIInst.getLastCardElement());
}

function renderImages(images) {
  galleryAPIInst.render(images);
  galleryViewer.refresh();
}

function appendImagesToGallery(images) {
  galleryAPIInst.appendImages(images);
  galleryViewer.refresh();
}

function onLastImageIsSeen(entries) {
  const { isIntersecting } = entries[0];

  if (isIntersecting) {
    intersectObserver.disconnect();

    if (!pixabayAPIInst.canLoadMoreImages()) {
      Notify.warning("That's all, folks!");

      return;
    }

    Notify.info('Loading more images...');
    makeRequestToPixabay(pixabayAPIInst.loadMoreImages.bind(pixabayAPIInst));
  }
}

function makeRequestToPixabay(apiRequestFunction, arg = null) {
  apiRequestFunction(arg)
    .then(onBackendSuccessRespond)
    .catch(() => Notify.failure('Error!'));
}
