import { picturesList } from './render-pictures-list';
import { pictureModal } from './render-picture-modal';
import { closeButtonModal, showPictureModal, hidePictureModal } from '../picture-modal';
import { isEnterKey, isEscapeKey } from '../utils';

export const handleClickPicturesList = ({target}) => {
  showPictureModal(target);
};

export const handleCloseClick = (evt) => {
  evt.preventDefault();
  hidePictureModal();
};

export const handleOpenModalKeydown = ({target}) => {
  if (isEnterKey(evt)) {
    showPictureModal(target);
  }
};

const handleCloseModalKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    hidePictureModal();
  }
};

export const toggleEventModal = (isOpen) => {

  if (isOpen) {
    document.addEventListener('keydown', handleOpenModalKeydown);
    closeButtonModal.addEventListener('click', handleCloseClick);

    pictureModal.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');

  } else {
    document.addEventListener('keydown', handleCloseModalKeydown);
    picturesList.addEventListener('click', handleClickPicturesList);

    pictureModal.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');

  }
};

