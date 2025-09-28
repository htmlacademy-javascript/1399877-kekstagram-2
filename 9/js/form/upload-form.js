import {isEscapeKey} from '../utils';
import { isValidHashtags, isWithinHashtagsLimit, isUniqueValue, isValidDescription } from './validator-form';

export const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = uploadForm?.querySelector('#upload-file');

export const uploadInputHashtag = uploadForm?.querySelector('.text__hashtags');
export const uploadInputDescription = uploadForm?.querySelector('.text__description');

const uploadImage = uploadForm.querySelector('.img-upload__overlay');
const buttonCancelUpload = uploadForm.querySelector('.img-upload__cancel');

export const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
  errorTextTag: 'div'
}, false);

pristine.addValidator(uploadInputDescription, isValidDescription, 'длина комментария больше 140 символов');
pristine.addValidator(uploadInputHashtag, isWithinHashtagsLimit, 'превышено количество хэштегов', 3, true);
pristine.addValidator(uploadInputHashtag, isValidHashtags, 'введён невалидный хэштег', 2, true);
pristine.addValidator(uploadInputHashtag, isUniqueValue, 'хэштеги повторяются', 1, true);

let controller = null;

const isOverlayOpen = () => !uploadImage.classList.contains('hidden');

const closeUploadOverlay = () => {
  document.body.classList.remove('modal-open');
  uploadImage.classList.add('hidden');

  uploadInput.value = '';

  controller?.abort();
  controller = null;
};

const endUploadFormSession = (evt) => {
  evt.preventDefault();

  closeUploadOverlay();
};

const startUploadFormSession = () => {
  if (!uploadInput.files?.[0]) {
    return;
  }

  if (isOverlayOpen()) {
    return;
  }

  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  document.body.classList.add('modal-open');
  uploadImage.classList.remove('hidden');

  buttonCancelUpload?.addEventListener('click', endUploadFormSession, { signal });
  document.addEventListener('keydown', (evt) => {
    if (!isEscapeKey(evt)) {
      return;
    }
    if (evt.target === uploadInputHashtag) {
      return;
    }

    evt.preventDefault();

    closeUploadOverlay();
  }, { signal });
};

const bindOpenTrigger = () => {
  uploadInput?.addEventListener('change', () => {
    if (isOverlayOpen()) {
      return;
    }

    startUploadFormSession();
  });
};

bindOpenTrigger();

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});
