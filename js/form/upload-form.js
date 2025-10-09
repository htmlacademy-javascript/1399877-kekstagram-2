import {isEscapeKey, getFocusableElements, trapFocus} from '../utils';
import { isValidHashtags, isWithinHashtagsLimit, isUniqueValue, isValidDescription } from './validator-form';
import { initEffects } from './effects.js';
import { sendData } from '../api.js';
import { FILE_TYPES } from '../const.js';
import { initScale } from './init-scale.js';

export const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = uploadForm?.querySelector('#upload-file');

export const uploadInputHashtag = uploadForm?.querySelector('.text__hashtags');
export const uploadInputDescription = uploadForm?.querySelector('.text__description');

const uploadImage = uploadForm.querySelector('.img-upload__overlay');
const previewImage = uploadForm.querySelector('.img-upload__preview img');

const buttonCancelUpload = uploadForm.querySelector('.img-upload__cancel');
const submitButton = uploadForm.querySelector('#upload-submit');

const scaleSmallerButton = uploadForm.querySelector('.scale__control--smaller');
const scaleBiggerButton = uploadForm.querySelector('.scale__control--bigger');
const scaleValueField = uploadForm.querySelector('.scale__control--value');

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

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

let controllerForm = null;
let controllerMessage = null;

const isOverlayOpen = () => !uploadImage.classList.contains('hidden');

const showMessage = (templateId) => {
  const template = document.querySelector(templateId);
  const element = template.content.firstElementChild.cloneNode(true);
  document.body.append(element);

  controllerMessage = new AbortController();
  const { signal } = controllerMessage;

  const removeMessage = () => {
    element.remove();
    controllerMessage.abort();
  };

  const handleEsc = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      removeMessage();
    }
  };

  const handleClickOutside = (evt) => {
    if (!evt.target.closest(`${templateId.replace('#', '.')}`)) {
      removeMessage();
    }
  };

  const button = element.querySelector('button');
  if (button) {
    button.addEventListener('click', removeMessage, { signal });
  }

  document.addEventListener('keydown', handleEsc, { signal });
  document.addEventListener('click', handleClickOutside, { signal });
};

const closeUploadOverlay = () => {
  document.body.classList.remove('modal-open');
  uploadImage.classList.add('hidden');

  uploadInput.value = '';
  uploadInputHashtag.value = '';
  uploadInputDescription.value = '';

  scaleValueField.value = '100%';
  scaleValueField.setAttribute('value', '100%');
  previewImage.style.transform = 'scale(1)';
  previewImage.className = '';
  previewImage.style.filter = 'none';

  pristine.reset();

  controllerForm?.abort();
  controllerForm = null;
};

const endUploadFormSession = (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
};

const openModalUploadForm = (signal) => {
  document.body.classList.add('modal-open');
  uploadImage.classList.remove('hidden');

  const smaller = uploadForm.querySelector('.scale__control--smaller');
  const bigger = uploadForm.querySelector('.scale__control--bigger');
  const valueField = uploadForm.querySelector('.scale__control--value');
  const preview = uploadForm.querySelector('.img-upload__preview img');

  initEffects(preview, signal);
};

const startUploadFormSession = () => {
  if (!uploadInput.files?.[0]) {
    return;
  }

  if (isOverlayOpen()) {
    return;
  }

  controllerForm?.abort();
  controllerForm = new AbortController();
  const { signal } = controllerForm;

  openModalUploadForm(signal);

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
    const file = uploadInput.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((ext) => fileName.endsWith(ext));

    if (matches) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        previewImage.src = reader.result;
        setTimeout(() => startUploadFormSession(), 0);
      });
      reader.readAsDataURL(file);
    } else {
      showMessage('#file-error');
      uploadInput.value = '';
    }
  });
};

bindOpenTrigger();
initScale(uploadForm);

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  const formData = new FormData(uploadForm);
  blockSubmitButton();

  sendData(formData)
    .then(() => {
      showMessage('#success');
      pristine.reset();
      uploadForm.reset();
      closeUploadOverlay();
    })
    .catch(() => {
      showMessage('#error');
    })
    .finally(() => {
      unblockSubmitButton();
    });
});
