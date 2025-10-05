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

const initSlider = () => {
  noUiSlider.create(sliderElement, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower',
  });
};


const applyEffect = (effectName, previewImage, valueElement) => {
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

  sliderElement.noUiSlider.on('update', ([value]) => {
    valueElement.value = value;
    previewImage.style.filter = `${config.filter}(${value}${config.unit})`;
  });
};

export const initEffects = (previewImage, signal) => {
  const effectRadios = document.querySelectorAll('.effects__radio');
  const valueElement = document.querySelector('.effect-level__value');

  initSlider();

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      applyEffect(radio.value, previewImage, sliderElement, valueElement);
    }, { signal });
  });
};
