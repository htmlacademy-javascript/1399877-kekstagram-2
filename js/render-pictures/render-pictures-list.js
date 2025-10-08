import { getData } from '../api';
import { initFilters } from './filters';

export const picturesList = document.querySelector('.pictures');

const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const showError = (id) => {
  const template = document.querySelector(id).content.querySelector('.data-error');
  const errorMessage = template.cloneNode(true);
  document.body.append(errorMessage);
  setTimeout(() => errorMessage.remove(), 5000);
};

export const dataPictures = getData();

export const renderPictures = (pictures) => {
  picturesList.innerHTML = '';

  const fragment = document.createDocumentFragment();

  pictures.forEach(({url, description, likes, comments, id}) => {
    const pictureItem = pictureTemplate.cloneNode(true);
    const pictureImg = pictureItem.querySelector('.picture__img');

    pictureImg.src = url;
    pictureImg.alt = description;
    pictureItem.querySelector('.picture__likes').textContent = likes;
    pictureItem.querySelector('.picture__comments').textContent = comments.length;
    pictureItem.dataset.itemId = id;

    fragment.append(pictureItem);
  });
  picturesList.append(fragment);
};

dataPictures.then((data) => {
  renderPictures(data);
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  initFilters(data);
})
  .catch(() => showError('#data-error'));
