import { createPhotos } from './moks.js';

const pisturesList = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const pictureListFragment = document.createDocumentFragment();

const dataPictures = createPhotos();

dataPictures.forEach(({url, description, likes, comments}) => {
  const pictureItem = pictureTemplate.cloneNode(true);
  const pictureImg = pictureItem.querySelector('.picture__img');
  pictureImg.src = url;
  pictureImg.alt = description;
  pictureItem.querySelector('.picture__likes').textContent = likes;
  pictureItem.querySelector('.picture__comments').textContent = comments.length;
  pictureListFragment.appendChild(pictureItem);
});

pisturesList.appendChild(pictureListFragment)