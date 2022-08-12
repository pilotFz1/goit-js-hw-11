/* import PixabayApiService from './js/api-service'; */
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
let caunt = 1;
let clear = '';

const refs = {
  searchForm: document.querySelector('.search-form'),
  submitBtn: document.querySelector('.submit'),
  getBtn: document.querySelector('.get'),
  searchList: document.querySelector('.gallery'),
};

const loadBtnOn = () => refs.getBtn.classList.remove('invisible');
const loadBtnOff = () => refs.getBtn.classList.add('invisible');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28934161-1d72d18718d0b61d346597ac7';
const PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

/* const getPost = async () => {
  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&q=${refs.searchForm.searchQuery.value}&${PARAMS}&per_page=40&page=${caunt}`
  );
  const data = await response.json();
  refs.searchForm.searchQuery.value = '';
  console.log(refs.searchForm.searchQuery.value);
  if (data.totalHits === 0) {
    loadBtnOff();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    loadBtnOn();
    Notify.success(`Hoooray! We found ${data.totalHits} images!`);
  }

  caunt += 1;
  console.log(data);
  console.log(data.hits);
  renderMarkup(data.hits);
  addSearch();
};

const post = getPost();
console.log(post);

const renderMarkup = post => {
  return post
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
    .join('');
};

console.log(renderMarkup);

const addSearch = searchMarkup => {
  refs.searchList.insertAdjacentHTML('beforeend', searchMarkup.markup);
  lightbox.refresh();
}; */

const getPost = e => {
  clear = refs.searchForm.searchQuery.value;
  loadBtnOff();
  reset();
  caunt = 1;
  e.preventDefault();
  fetch(
    `${BASE_URL}?key=${API_KEY}&q=${refs.searchForm.searchQuery.value}&${PARAMS}&per_page=40&page=${caunt}`
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      refs.searchForm.searchQuery.value = '';
      console.log(refs.searchForm.searchQuery.value);
      if (data.totalHits === 0) {
        loadBtnOff();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        loadBtnOn();
        Notify.success(`Hoooray! We found ${data.totalHits} images!`);
      }

      caunt += 1;
      console.log(data.totalHits);
      console.log(data.hits);
      return data.hits;
    })
    .then(renderMarkup)
    .then(addSearch)
    .catch(error => console.log(error));
};

const getMore = e => {
  fetch(
    `${BASE_URL}?key=${API_KEY}&q=${clear}&${PARAMS}&per_page=40&page=${caunt}`
  )
    .then(response => response.json())
    .then(data => {
      caunt += 1;
      return data.hits;
    })
    .then(renderMarkup)
    .then(addSearch)
    .catch(error => console.log(error));
};

refs.submitBtn.addEventListener('click', getPost);
refs.getBtn.addEventListener('click', getMore);

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
};

const reset = () => {
  refs.searchList.innerHTML = '';
};
