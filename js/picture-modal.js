import { picturesList } from './render-pictures/render-pictures-list';
import { pictureModal, renderPictureModal } from './render-pictures/render-picture-modal';
import * as handleModal from './render-pictures/handle-picture-modal';

export const closeButtonModal = pictureModal.querySelector('.big-picture__cancel')
let modalOpen = false;
handleModal.toggleEventModal(modalOpen);

export const showPictureModal = (element) => {
  picturesList.removeEventListener('click', handleModal.handleClickPicturesList);
  document.removeEventListener('keydown', handleModal.handleOpenModalKeydown);

  const elementList = element.closest('.picture');

  renderPictureModal(elementList)

  modalOpen = true;
  handleModal.toggleEventModal(modalOpen);
};

export const hidePictureModal = () => {
  document.removeEventListener('keydown', handleModal.handleCloseKeydown);
  closeButtonModal.removeEventListener('click', handleModal.handleClickPicturesList);

  modalOpen = false;
  handleModal.toggleEventModal(modalOpen);
};
