export const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const createIdGenerator = () => {
  let id = 0;
  return () => ++id;
};

export const isEscapeKey = (evt) => evt.key === 'Escape';
export const isEnterKey = (evt) => evt.key === 'Enter';

const parseTabKey = (evt) => {
  const isTab = (evt.key === 'Tab');

  return {
    isTab,
    isBackward: isTab && evt.shiftKey
  };
};

export const getFocusableElements = (container) => {
  const modalElements = Array.from(
    container.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    )
  );

  return modalElements.filter((el) =>
    !el.disabled &&
    el.getAttribute('type') !== 'hidden' &&
    el.offsetParent !== null &&
    el.getClientRects().length > 0
  );
};


export const trapFocus = (evt, focusableElements) => {
  const tabInfo = parseTabKey(evt);

  if (!tabInfo.isTab) {
    return;
  }

  evt.preventDefault();

  let nextIndex;
  const currentIndex = focusableElements.indexOf(document.activeElement);

  if (currentIndex === -1) {
    nextIndex = tabInfo.isBackward
      ? focusableElements.length - 1
      : 0;
  } else if (tabInfo.isBackward) {
    nextIndex = currentIndex === 0
      ? focusableElements.length - 1
      : currentIndex - 1;
  } else {
    nextIndex = currentIndex === focusableElements.length - 1
      ? 0
      : currentIndex + 1;
  }

  focusableElements[nextIndex].focus();
};
