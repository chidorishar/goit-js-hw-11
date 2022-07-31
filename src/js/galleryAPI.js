import galleryCardsTmpl from './markup/layouts/cardMarkup.hbs';

export default class GalleryAPI {
  #galleryRootDOMEl;

  /**
   * @param {string} galleryRootSelector - selector which match gallery root element in HTML markup
   */
  constructor(galleryRootSelector) {
    this.#galleryRootDOMEl = document.querySelector(galleryRootSelector);
  }

  /**
   * @param {Array} images - array containing images data and info about it in format of pixabay response
   */
  render(images) {
    this.#galleryRootDOMEl.innerHTML = galleryCardsTmpl({ images });
  }

  /**
   * @param {Array} images - array containing images data and info about it in format of pixabay response
   */
  appendImages(images) {
    this.#galleryRootDOMEl.insertAdjacentHTML(
      'beforeend',
      galleryCardsTmpl({ images })
    );
  }

  clearGallery() {
    this.#galleryRootDOMEl.innerHTML = '';
  }

  getLastCardElement() {
    return this.#galleryRootDOMEl.lastElementChild;
  }

  getCardHeight() {
    const { height } =
      this.#galleryRootDOMEl.firstElementChild.getBoundingClientRect();

    return height;
  }
}
