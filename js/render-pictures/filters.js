import { renderPictures } from './render-pictures-list.js';
import { debounce } from '../utils.js';
import { RANDOM_PICTURES_COUNT } from '../const.js';

const filters = document.querySelector('.img-filters');
const buttons = filters.querySelectorAll('.img-filters__button');

let currentFilter = 'filter-default';

const getRandomPictures = (pictures) => {
  const shuffled = [...pictures].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, RANDOM_PICTURES_COUNT);
};

const getDiscussedPictures = (pictures) => [...pictures].sort((a, b) => b.comments.length - a.comments.length);


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

const onFilterClick = debounce((evt, pictures) => {
  const target = evt.target;
  if (!target.classList.contains('img-filters__button')) {
    return;
  }

  buttons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
  target.classList.add('img-filters__button--active');

  currentFilter = target.id;
  const filtered = applyFilter(pictures);

  renderPictures(filtered);
}, 500); // устранение дребезга (0.5 сек)

export const initFilters = (pictures) => {
  filters.classList.remove('img-filters--inactive');
  filters.addEventListener('click', (evt) => onFilterClick(evt, pictures));
};
