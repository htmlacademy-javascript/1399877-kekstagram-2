import { getData } from '../api';

export const picturesList = document.querySelector('.pictures');

const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const pictureListFragment = document.createDocumentFragment();

const showError = (id) => {
  const template = document.querySelector(id).content.querySelector('.data-error');
  const errorMessage = template.cloneNode(true);
  document.body.append(errorMessage);
  setTimeout(() => errorMessage.remove(), 5000);
};

export const dataPictures = getData();

dataPictures.then((data) => {
  data.forEach(({ url, description, likes, comments, id }) => {
    const pictureItem = pictureTemplate.cloneNode(true);
    const pictureImg = pictureItem.querySelector('.picture__img');

    pictureImg.src = url;
    pictureImg.alt = description;
    pictureItem.querySelector('.picture__likes').textContent = likes;
    pictureItem.querySelector('.picture__comments').textContent = comments.length;
    pictureItem.dataset.itemId = id;

    pictureListFragment.append(pictureItem);
  });

  picturesList.append(pictureListFragment);
}).catch(() => showError('#data-error'));
