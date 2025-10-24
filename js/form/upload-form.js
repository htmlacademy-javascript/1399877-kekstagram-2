import {isEscapeKey, getFocusableElements, trapFocus} from '../utils';
import { isValidHashtags, isWithinHashtagsLimit, isUniqueValue, isValidDescription } from './validator-form';
import { resetEffect } from './effects.js';
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

const scaleValueField = uploadForm.querySelector('.scale__control--value');

let releaseFocusTrap = null;

const enableFocusTrap = (container, preferInitial = null, restoreTo = null) => {
  let list = getFocusableElements(container);
  const first = list[0] || container;

  (preferInitial || first).focus({ preventScroll: true });
  const prev = document.activeElement;

  const onKeydown = (evt) => {
    if (evt.key !== 'Tab') {
      return;
    }

    list = getFocusableElements(container);
    trapFocus(evt, list);
  };

  const onFocusIn = ({target}) => {
    if (!container.contains(target)) {
      list = getFocusableElements(container);
      (list[0] || container).focus();
    }
  };

  document.addEventListener('keydown', onKeydown);
  document.addEventListener('focusin', onFocusIn);

  return () => {
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('focusin', onFocusIn);
    (restoreTo || prev)?.focus?.({ preventScroll: true });
  };
};

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
      evt.stopPropagation();
      removeMessage();
    }
  };

  const handleClickOutside = ({target}) => {
    const blockSelector = templateId.replace('#', '.');
    const innerSelector = `${blockSelector}__inner`;
    const clickedInsideInner = target.closest(innerSelector);

    if (!clickedInsideInner) {
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

  uploadForm.reset();

  uploadInput.value = '';
  uploadInputHashtag.value = '';
  uploadInputDescription.value = '';

  scaleValueField.value = '100%';
  scaleValueField.setAttribute('value', '100%');
  previewImage.style.transform = 'scale(1)';
  previewImage.className = '';
  previewImage.style.filter = 'none';

  resetEffect();

  pristine.reset();

  releaseFocusTrap?.();
  releaseFocusTrap = null;

  controllerForm?.abort();
  controllerForm = null;
};

const endUploadFormSession = (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
};

const openModalUploadForm = () => {
  document.body.classList.add('modal-open');
  uploadImage.classList.remove('hidden');

  const initial = buttonCancelUpload || getFocusableElements(uploadImage)[0] || uploadImage;
  releaseFocusTrap = enableFocusTrap(uploadImage, initial, uploadInput);
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
  document.addEventListener(
    'keydown',
    (evt) => {
      if (!isEscapeKey(evt)) {
        return;
      }

      if (document.querySelector('.success') || document.querySelector('.error')) {
        return;
      }

      if (evt.target === uploadInputHashtag || evt.target === uploadInputDescription) {
        return;
      }

      evt.preventDefault();
      closeUploadOverlay();
    },
    { signal }
  );

};

const bindOpenTrigger = () => {
  uploadInput?.addEventListener('change', () => {
    const file = uploadInput.files?.[0];
    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const isAllowed = FILE_TYPES.some((ext) => fileName.endsWith(ext));
    if (!isAllowed) {
      showMessage('#file-error');
      uploadInput.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    previewImage.src = objectUrl;

    document
      .querySelectorAll('.effects__preview')
      .forEach((el) => {
        el.style.backgroundImage = `url(${objectUrl})`;
      });

    startUploadFormSession();
  });
};


bindOpenTrigger();
initScale(uploadForm);

uploadForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  const formData = new FormData(uploadForm);
  blockSubmitButton();

  try {
    await sendData(formData);
    showMessage('#success');

    pristine.reset();
    uploadForm.reset();
    closeUploadOverlay();
  } catch (error) {
    showMessage('#error');
  } finally {
    unblockSubmitButton();
  }
});

