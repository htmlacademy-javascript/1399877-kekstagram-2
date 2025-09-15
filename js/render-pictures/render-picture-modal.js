import { dataPictures } from './render-pictures-list';
import { renderComments } from './render-comments/render-comments-list';

export const pictureModal = document.querySelector('.big-picture');

export const renderPictureModal = (item) => {
  const image = item.querySelector('.picture__img');
  const commentsCount = item.querySelector('.picture__comments').textContent;
  const likes = item.querySelector('.picture__likes').textContent;
  let commentShow = 5;
  const descriptionPicture = image.alt;

  if(commentsCount < commentShow) {
    commentShow = commentsCount;
  }

  pictureModal.querySelector('img').src = image.src;
  pictureModal.querySelector('.likes-count').textContent = likes;
  pictureModal.querySelector('.social__comment-shown-count').textContent = commentShow;
  pictureModal.querySelector('.social__comment-total-count').textContent = commentsCount;
  pictureModal.querySelector('.social__caption').textContent = descriptionPicture;

  renderComments(dataPictures, item.dataset.itemId);
}
