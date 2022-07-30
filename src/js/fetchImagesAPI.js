import axios from 'axios';

export default class pixabayAPI {
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

  constructor() {}

  async loadImagesByQuery(searchQuery) {
    this.#searchOptions.page = 1;
    this.#query = searchQuery;

    return await this.#fetchImages();
  }

  async loadMoreImages() {
    this.#searchOptions.page++;

    return await this.#fetchImages();
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
