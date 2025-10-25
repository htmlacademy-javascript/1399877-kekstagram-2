const FILTERS = [
  {
    name: 'none',
    style: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  {
    name: 'chrome',
    style: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  {
    name: 'sepia',
    style: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  {
    name: 'marvin',
    style: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  {
    name: 'phobos',
    style: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  {
    name: 'heat',
    style: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
];
const DEFAULT_EFFECT = FILTERS[0];
let chosenEffect = DEFAULT_EFFECT;

const imageElement = document.querySelector('.img-upload__preview img');
const effectsElement = document.querySelector('.effects');
const sliderElement = document.querySelector('.effect-level__slider');
const sliderContainerElement = document.querySelector('.img-upload__effect-level');
const effectLevelElement = document.querySelector('.effect-level__value');

const isDefault = ()=> chosenEffect === DEFAULT_EFFECT;

const showSlider = ()=>{
  sliderContainerElement.classList.remove('hidden');
};
const hideSlider = ()=>{
  sliderContainerElement.classList.add('hidden');
};
const updateSlider = ()=>{
  sliderElement.noUiSlider.updateOptions({
    range:{
      min: chosenEffect.min,
      max:chosenEffect.max,
    },
    step:chosenEffect.step,
    start:chosenEffect.max,
  });
  if(isDefault()){
    hideSlider();
  }else{
    showSlider();
  }
};

const onSliderUpdate = () => {
  const raw = sliderElement.noUiSlider.get();
  const num = Number(raw);
  const normalized = String(num);

  if (isDefault()) {
    imageElement.style.filter = DEFAULT_EFFECT.style;
  } else {
    imageElement.style.filter = `${chosenEffect.style}(${normalized}${chosenEffect.unit})`;
  }

  effectLevelElement.value = normalized;
};

const onEffectsChange = ({target})=>{
  if(!target.classList.contains('effects__radio')){
    return;
  }
  chosenEffect = FILTERS.find((effect)=> effect.name === target.value);

  if (chosenEffect === DEFAULT_EFFECT) {
    imageElement.className = '';
  } else {
    imageElement.className = `effects__preview--${chosenEffect.name}`;
  }

  updateSlider();
  onSliderUpdate();
};

export const resetEffect = () => {
  const effectNone = document.querySelector('#effect-none');
  const effectValueInput = document.querySelector('input[name="effect"]');

  chosenEffect = DEFAULT_EFFECT;

  if (imageElement) {
    imageElement.className = '';
    imageElement.style.filter = 'none';
  }

  if (effectNone) {
    effectNone.checked = true;
  }
  if (effectValueInput) {
    effectValueInput.value = 'none';
  }

  if (effectLevelElement) {
    effectLevelElement.value = '';
  }

  if (sliderContainerElement) {
    sliderContainerElement.classList.add('hidden');
  }

  if (sliderElement && sliderElement.noUiSlider) {
    sliderElement.noUiSlider.set(DEFAULT_EFFECT.max);
  }
};


noUiSlider.create(sliderElement,{
  range: {
    min:DEFAULT_EFFECT.min,
    max:DEFAULT_EFFECT.max,
  },
  start:DEFAULT_EFFECT.max,
  step: DEFAULT_EFFECT.step,
  connect: 'lower',
});
hideSlider();

effectsElement.addEventListener('change',onEffectsChange);
sliderElement.noUiSlider.on('update', onSliderUpdate);
