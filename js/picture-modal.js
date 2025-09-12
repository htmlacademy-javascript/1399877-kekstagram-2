import { picturesList } from './render-pictures-list';
import { pictureModal, renderPictureModal } from './render-picture-modal';
import { isEnterKey, isEscapeKey } from './utils';

const closeButtonModal = pictureModal.querySelector('.big-picture__cancel')

const showPictureModal = (element) => {
  renderPictureModal(element)

  pictureModal.classList.remove('hidden');
  pictureModal.querySelector('.social__comment-count').classList.add('hidden');
  document.querySelector('body').classList.add('modal-open');

  closeButtonModal.addEventListener('click', onCloseClick);
  document.addEventListener('keydown', closePicturesListKeydown);

  picturesList.removeEventListener('click', onPicturesListClick);
};

const hidePictoreModal = () => {
  pictureModal.classList.add('hidden');

  pictureModal.querySelector('.social__comment-count').classList.remove('hidden');
  document.querySelector('body').classList.remove('modal-open');

  document.removeEventListener('keydown', closePicturesListKeydown);

  document.addEventListener('keydown', onPicturesListKeydown);
  picturesList.addEventListener('click', onPicturesListClick);
};

const onCloseClick = (evt) => {
  evt.preventDefault();
  hidePictoreModal();
};

const onPicturesListClick = (evt) => {
  evt.preventDefault();

  showPictureModal(evt.target.parentNode);
};

const onPicturesListKeydown = (evt) => {
  if (isEnterKey(evt)){
    showPictureModal(evt.target);
  }
};

const closePicturesListKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    hidePictoreModal();
  }
}

picturesList.addEventListener('click', onPicturesListClick);
document.addEventListener('keydown', onPicturesListKeydown);
