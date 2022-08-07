import PixabayApiService from './js/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
let downloadСounter = 1;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchList: document.querySelector('.gallery'),
};

const loadBtnOn = () => refs.loadMoreBtn.classList.remove('invisible');
const loadBtnOff = () => refs.loadMoreBtn.classList.add('invisible');

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  reset();
  downloadСounter = 1;

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value;
  pixabayApiService.resetPage();
  pixabayApiService
    .fetchArticles()
    .then(renderMarkup)
    .then(addSearch)
    .catch(showErrors);
}

function onLoadMore() {
  pixabayApiService
    .fetchArticles()
    .then(renderMarkup)
    .then(addSearch)
    .catch(showErrors);
}

const renderMarkup = array => {
  console.log(array);
  if (array.length !== 0 && downloadСounter === 1) {
    showSuccess();
    loadBtnOn();
  }
  downloadСounter += 1;

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
                <b>Likes </br>${photo.likes}</b>
              </p>
              <p class="info-item">
                <b>Views </br>${photo.views}</b>
              </p>
              <p class="info-item">
                <b>Comments  </br>${photo.comments} </b>
              </p>
              <p class="info-item">
                <b>Downloads  </br>${photo.downloads}</b>
              </p>
            </div>
           
          </div>
          `
      )
      .join(''),
  };
};

const addSearch = searchMarkup => {
  refs.searchList.insertAdjacentHTML('beforeend', searchMarkup.markup);
  lightbox.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const reset = () => {
  refs.searchList.innerHTML = '';
};

const showErrors = error => {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );

  loadBtnOff();
};

const showSuccess = success => {
  Notify.success(`Hoooray! We found 500 images!`);
};
