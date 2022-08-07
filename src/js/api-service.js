export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.options = 'image_type=photo&orientation=horizontal&safesearch=true';
  }

  fetchArticles() {
    const url = `https://pixabay.com/api/?key=28934161-1d72d18718d0b61d346597ac7&q=${this.searchQuery}&${this.options}&per_page=40&page=${this.page}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        this.page += 1;
        console.log(data.totalHits);
        return data.hits;
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
