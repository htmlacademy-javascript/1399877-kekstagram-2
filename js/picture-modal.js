import { picturesList, dataPictures } from './render-pictures/render-pictures-list';
import { pictureModal, renderPictureModal } from './render-pictures/render-picture-modal';
import * as handleModal from './render-pictures/handle-picture-modal';
import { enableFocusTrap, getFocusableElements } from './utils';

export const closeButtonModal = pictureModal.querySelector('.big-picture__cancel');

let modalOpen = false;
let releaseFocusTrap = null;
let lastTrigger = null;

handleModal.toggleEventModal(modalOpen);

export const showPictureModal = (element) => {
  const elementList = element.closest('.picture');

  if (!elementList) {
    return;
  }

  lastTrigger = elementList;
  picturesList.removeEventListener('click', handleModal.handleClickPicturesList);
  document.removeEventListener('keydown', handleModal.handleOpenModalKeydown);

  picturesList.removeEventListener('click', handleModal.handleClickPicturesList);
  document.removeEventListener('keydown', handleModal.handleOpenModalKeydown);

  dataPictures.then((data) => {
    renderPictureModal(elementList, data);

    const initial =
      closeButtonModal ||
      getFocusableElements(pictureModal)[0] ||
      pictureModal;

    releaseFocusTrap = enableFocusTrap(pictureModal, initial, lastTrigger);
  });

  modalOpen = true;
  handleModal.toggleEventModal(modalOpen);
};

export const hidePictureModal = () => {
  releaseFocusTrap?.();
  releaseFocusTrap = null;
  lastTrigger = null;

  modalOpen = false;
  handleModal.toggleEventModal(modalOpen);

  document.removeEventListener('keydown', handleModal.handleCloseKeydown);
  closeButtonModal.removeEventListener('click', handleModal.handleClickPicturesList);
};
