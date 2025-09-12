import { createPhotos } from './moks.js';

export const picturesList = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const pictureListFragment = document.createDocumentFragment();

export const dataPictures = createPhotos();

dataPictures.forEach(({url, description, likes, comments,id}) => {
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