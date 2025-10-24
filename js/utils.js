export const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const createIdGenerator = () => {
  let id = 0;
  return () => ++id;
};

export const isEscapeKey = ({key}) => key === 'Escape';
export const isEnterKey = ({key}) => key === 'Enter';

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

  if (!focusableElements || focusableElements.length === 0) {
    evt.preventDefault();
    return;
  }

  evt.preventDefault();

  const currentIndex = focusableElements.indexOf(document.activeElement);
  let nextIndex;

  if (currentIndex === -1) {
    nextIndex = tabInfo.isBackward ? focusableElements.length - 1 : 0;
  } else if (tabInfo.isBackward) {
    nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
  } else {
    nextIndex = currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1;
  }

  focusableElements[nextIndex].focus();
};


export const debounce = (callback, delay = 500) => {
  let timeoutId;

  return function debounced(...args) {
    const ctx = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      callback.apply(ctx, args);
    }, delay);
  };
};

export const enableFocusTrap = (container, preferInitial = null, restoreTo = null) => {
  let list = getFocusableElements(container);
  const first = list[0] || container;

  (preferInitial || first).focus?.({ preventScroll: true });

  const prev = document.activeElement;

  const onKeydown = (evt) => {
    if (evt.key !== 'Tab') {
      return;
    }

    list = getFocusableElements(container);
    trapFocus(e, list);
  };

  const onFocusIn = (e) => {
    if (!container.contains(e.target)) {
      list = getFocusableElements(container);
      (list[0] || container).focus?.();
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
