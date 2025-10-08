import {isEscapeKey, getFocusableElements, trapFocus} from '../utils';
import { isValidHashtags, isWithinHashtagsLimit, isUniqueValue, isValidDescription } from './validator-form';
import { handleScaleUploadImage } from './scale';
import { initEffects } from './effects.js';
import { sendData } from '../api.js';
import { FILE_TYPES } from '../const.js';

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

let controller = null;

const isOverlayOpen = () => !uploadImage.classList.contains('hidden');

const showMessage = (templateId) => {
  const template = document.querySelector(templateId);

  const element = template.content.firstElementChild.cloneNode(true);
  document.body.append(element);

  controller = new AbortController();
  const { signal } = controller;

  const removeMessage = () => {
    element.remove();
    controller.abort();
  };

  const onEsc = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      removeMessage();
    }
  };

  const onClickOutside = (evt) => {
    if (!evt.target.closest(`${templateId.replace('#', '.')}`)) {
      removeMessage();
    }
  };

  const button = element.querySelector('button');
  if (button) {
    button.addEventListener('click', removeMessage, { signal });
  }

  document.addEventListener('keydown', onEsc, { signal });
  document.addEventListener('click', onClickOutside, { signal });
};

const closeUploadOverlay = () => {
  document.body.classList.remove('modal-open');
  uploadImage.classList.add('hidden');

  uploadInput.value = '';
  uploadInputHashtag.value = '';
  uploadInputDescription.value = '';

  scaleValueField.value = '100%';
  previewImage.style.transform = 'scale(1)';
  previewImage.className = '';
  previewImage.style.filter = 'none';

  controller?.abort();
  controller = null;
};


const endUploadFormSession = (evt) => {
  evt.preventDefault();

  closeUploadOverlay();
};

const openModalUploadForm = (signal) => {
  scaleValueField.value = '100%';
  previewImage.style.transform = 'scale(1)';

  scaleSmallerButton.addEventListener(
    'click',
    () => handleScaleUploadImage(true, false, scaleValueField, previewImage),
    { signal }
  );

  scaleBiggerButton.addEventListener(
    'click',
    () => handleScaleUploadImage(false, true, scaleValueField, previewImage),
    { signal }
  );

  initEffects(previewImage, signal);

  document.body.classList.add('modal-open');
  uploadImage.classList.remove('hidden');

  const modalElements = getFocusableElements(uploadForm);

  document.addEventListener('keydown', (evt) => {
    trapFocus(evt, modalElements);
  }, { signal });

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
      });
      reader.readAsDataURL(file);
      startUploadFormSession();
    } else {
      showMessage('#file-error');
      uploadInput.value = '';
    }
  });
};

bindOpenTrigger();

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
