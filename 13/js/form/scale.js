import { SCALE_STEP, MIN_SCALE, MAX_SCALE } from '../const.js';

export const handleScaleUploadImage = (isSmaller, isBigger, scaleField, previewImage) => {
  let currentValue = parseInt(scaleField.value, 10);

  currentValue = Math.min(MAX_SCALE, Math.max(MIN_SCALE, currentValue));

  if (isSmaller && currentValue > MIN_SCALE) {
    currentValue -= SCALE_STEP;
  } else if (isBigger && currentValue < MAX_SCALE) {
    currentValue += SCALE_STEP;
  }

  const newValue = `${currentValue}%`;

  scaleField.value = newValue;
  scaleField.setAttribute('value', newValue);
  scaleField.dispatchEvent(new Event('input', { bubbles: true }));
  scaleField.dispatchEvent(new Event('change', { bubbles: true }));

  previewImage.style.transform = `scale(${currentValue / 100})`;
};
