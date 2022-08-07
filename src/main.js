import PixabayApiService from './js/api-service';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchList: document.querySelector('.gallery'),
};

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  reset();
  createLightBox();
  lightbox.refresh();
  pixabayApiService.query = e.currentTarget.elements.searchQuery.value;
  pixabayApiService.resetPage();
  pixabayApiService.fetchArticles().then(renderMarkup).then(addSearch);
}

function onLoadMore() {
  pixabayApiService.fetchArticles().then(renderMarkup).then(addSearch);
}

const renderMarkup = array => {
  return {
    markup: array
      .map(
        photo =>
          `<div class="photo-card">
          
           <a class="gallery__item" href="${photo.largeImageURL}">
            <img class="gallery__image" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy"  width="300" height="200" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes ${photo.likes}</b>
              </p>
              <p class="info-item">
                <b>Views ${photo.views}</b>
              </p>
              <p class="info-item">
                <b>Comments  ${photo.comments} </b>
              </p>
              <p class="info-item">
                <b>Downloads  ${photo.downloads}</b>
              </p>
            </div>
          </div>
          `
      )
      .join(''),
  };
};

const createLightBox = () => {
  lightbox = new SimpleLightbox('.gallery__item', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
};

const addSearch = searchMarkup => {
  refs.searchList.insertAdjacentHTML('beforeend', searchMarkup.markup);
};

const reset = () => {
  refs.searchList.innerHTML = '';
};
