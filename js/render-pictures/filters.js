import { renderPictures } from './render-pictures-list.js';
import { debounce } from '../utils.js';
import { RANDOM_PICTURES_COUNT } from '../const.js';

const filtersBlock = document.querySelector('.img-filters');
const form = filtersBlock.querySelector('.img-filters__form');

form.addEventListener('submit', (evt) => evt.preventDefault());

let allPictures = [];
let currentFilter = 'filter-default';
let inited = false;


const getRandomPictures = (pictures) => {
  const shuffled = [...pictures].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, RANDOM_PICTURES_COUNT);
};

const getDiscussedPictures = (pictures) =>
  [...pictures].sort((a, b) => b.comments.length - a.comments.length);

const applyFilter = (pictures) => {
  switch (currentFilter) {
    case 'filter-random':
      return getRandomPictures(pictures);
    case 'filter-discussed':
      return getDiscussedPictures(pictures);
    default:
      return pictures;
  }
};

const debouncedRender = debounce(() => {
  if (!allPictures.length) {
    return;
  }
  renderPictures(applyFilter(allPictures));
}, 500);

const buttons = Array.from(form.querySelectorAll('.img-filters__button'));

const activateButton = (btn) => {
  buttons.forEach((b) => b.classList.remove('img-filters__button--active'));
  btn.classList.add('img-filters__button--active');
};

buttons.forEach((b) => (b.type = 'button'));

buttons.forEach((btn) => {
  btn.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (btn.classList.contains('img-filters__button--active')){
      return;
    }

    activateButton(btn);
    currentFilter = btn.id;
    debouncedRender();
  });
});


export const initFilters = (pictures) => {
  if (inited) {
    return;
  }

  allPictures = pictures;

  filtersBlock.classList.remove('img-filters--inactive');

  renderPictures(applyFilter(allPictures));

  inited = true;
};
