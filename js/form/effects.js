const EFFECTS = {
  chrome: { min: 0, max: 1, step: 0.1, unit: '', filter: 'grayscale' },
  sepia: { min: 0, max: 1, step: 0.1, unit: '', filter: 'sepia' },
  marvin: { min: 0, max: 100, step: 1, unit: '%', filter: 'invert' },
  phobos: { min: 0, max: 3, step: 0.1, unit: 'px', filter: 'blur' },
  heat: { min: 1, max: 3, step: 0.1, unit: '', filter: 'brightness' },
  none: null
};

const sliderElement = document.querySelector('.effect-level__slider');
const sliderContainer = document.querySelector('.img-upload__effect-level');

const initSlider = (previewImage, valueElement) => {
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }

  noUiSlider.create(sliderElement, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower',
  });

  sliderElement.noUiSlider.off('update');

  sliderElement.noUiSlider.on('update', ([value]) => {
    const currentEffect = document.querySelector('.effects__radio:checked').value;
    const config = EFFECTS[currentEffect];

    valueElement.value = parseFloat(value).toFixed(1).replace(/\.0$/, '');

    if (!config) {
      previewImage.style.filter = 'none';
      sliderContainer.classList.add('hidden'); // 👈 добавь сюда на всякий случай
      return;
    }

    sliderContainer.classList.remove('hidden'); // 👈 и сюда
    previewImage.style.filter = `${config.filter}(${value}${config.unit})`;
  });
};

const applyEffect = (effectName, previewImage) => {
  const config = EFFECTS[effectName];

  if (!config) {
    previewImage.style.filter = 'none';
    sliderContainer.classList.add('hidden');
    return;
  }

  sliderContainer.classList.remove('hidden');

  sliderElement.noUiSlider.updateOptions({
    range: { min: config.min, max: config.max },
    start: config.max,
    step: config.step,
  });

  previewImage.style.filter = `${config.filter}(${config.max}${config.unit})`;
};

export const initEffects = (previewImage, signal) => {
  const valueElement = document.querySelector('.effect-level__value');
  const effectRadios = document.querySelectorAll('.effects__radio');
  const effectLabels = document.querySelectorAll('.effects__label');
  const sliderContainer = document.querySelector('.img-upload__effect-level');

  initSlider(previewImage, valueElement);
  applyEffect('none', previewImage);

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      applyEffect(radio.value, previewImage);
    }, { signal });
  });

  effectLabels.forEach((label) => {
    label.addEventListener('click', () => {
      const effectName = label.getAttribute('for')?.replace('effect-', '');
      if (effectName && effectName !== 'none') {
        sliderContainer.classList.remove('hidden');
      }
    }, { signal });
  });
};
