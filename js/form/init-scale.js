import { handleScaleUploadImage } from './scale.js';

export const initScale = (form) => {
  const smaller = form.querySelector('.scale__control--smaller');
  const bigger = form.querySelector('.scale__control--bigger');
  const valueField = form.querySelector('.scale__control--value');
  const preview = form.querySelector('.img-upload__preview img');

  if (!smaller || !bigger || !valueField || !preview) {
    return;
  }

  smaller.addEventListener('click', () => {
    handleScaleUploadImage(true, false, valueField, preview);
  });

  bigger.addEventListener('click', () => {
    handleScaleUploadImage(false, true, valueField, preview);
  });
};
