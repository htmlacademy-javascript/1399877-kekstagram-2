import { findItemPicturesList } from './render-comments/render-comments-list';

export const pictureModal = document.querySelector('.big-picture');

export const renderPictureModal = (item, picturesData) => {
  const image = item.querySelector('.picture__img');
  const commentsCount = item.querySelector('.picture__comments').textContent;
  const likes = item.querySelector('.picture__likes').textContent;
  let commentShow = 5;
  const descriptionPicture = image.alt;

  if (commentsCount < commentShow) {
    commentShow = commentsCount;
  }

  const bigImg = pictureModal.querySelector('.big-picture__img img');
  const imgUrl = image.getAttribute('src');

  bigImg.setAttribute('src', imgUrl);
  bigImg.setAttribute('alt', descriptionPicture);
  pictureModal.querySelector('.likes-count').textContent = likes;
  pictureModal.querySelector('.social__comment-shown-count').textContent = commentShow;
  pictureModal.querySelector('.social__comment-total-count').textContent = commentsCount;
  pictureModal.querySelector('.social__caption').textContent = descriptionPicture;

  findItemPicturesList(picturesData, item.dataset.itemId);
};
