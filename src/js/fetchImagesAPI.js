import axios from 'axios';

export default class PixabayAPI {
  #URL = 'https://pixabay.com/api/';
  #API_KEY = '28936627-cce82c9af8b6ea5e0aa07396c';
  #query = '';
  #searchOptions = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  };
  #totalHits = 0;
  #loadedNumber = 0;

  constructor() {}

  canLoadMoreImages() {
    return Boolean(this.#totalHits - this.#loadedNumber);
  }

  async loadImagesByQuery(searchQuery) {
    this.#searchOptions.page = 1;
    this.#loadedNumber = 0;
    this.#query = searchQuery;

    const response = await this.#fetchImages();
    this.#totalHits = response.totalHits;
    this.#loadedNumber += response.hits.length;

    return response;
  }

  async loadMoreImages() {
    this.#searchOptions.page++;

    const response = await this.#fetchImages();
    this.#loadedNumber += response.hits.length;

    return response;
  }

  async #fetchImages() {
    const response = await axios(
      `${this.#URL}?key=${this.#API_KEY}&q=${
        this.#query
      }&${this.#optionsToString()}`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }

  #optionsToString() {
    const { #searchOptions: searchOptions } = this;

    return Object.keys(searchOptions)
      .reduce(
        (acc, optKey) => (acc += `${optKey}=${searchOptions[optKey]}&`),
        ''
      )
      .slice(0, -1);
  }
}
