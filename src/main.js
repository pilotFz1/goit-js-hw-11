/* import PixabayApiService from './js/api-service'; */
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import axios from 'axios';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
let caunt = 1;
let clear = '';
let cauntPages = 40;
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

const getPost = async e => {
  try {
    clear = refs.searchForm.searchQuery.value;
    loadBtnOff();
    e.preventDefault();
    reset();
    caunt = 1;
    cauntPages = 40;

    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${refs.searchForm.searchQuery.value}&${PARAMS}&per_page=40&page=${caunt}`
    );
    refs.searchForm.searchQuery.value = '';
    if (response.data.totalHits === 0) {
      loadBtnOff();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      loadBtnOn();
      Notify.success(`Hoooray! We found ${response.data.totalHits} images!`);
    }
    renderMarkup(response.data.hits);
    refs.searchList.insertAdjacentHTML(
      'beforeend',
      renderMarkup(response.data.hits)
    );
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
};

const getMore = async e => {
  try {
    caunt += 1;
    cauntPages += 40;
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${clear}&${PARAMS}&per_page=40&page=${caunt}`
    );

    caunt += 1;
    renderMarkup(response.data.hits);
    refs.searchList.insertAdjacentHTML(
      'beforeend',
      renderMarkup(response.data.hits)
    );
    lightbox.refresh();

    if (cauntPages > response.data.totalHits) {
      loadBtnOff();
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
};

refs.submitBtn.addEventListener('click', getPost);
refs.getBtn.addEventListener('click', getMore);

function renderMarkup(data) {
  return data
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
}

const reset = () => {
  refs.searchList.innerHTML = '';
};
