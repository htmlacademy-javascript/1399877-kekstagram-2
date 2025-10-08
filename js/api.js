export const getData = () => {
  return fetch('https://31.javascript.htmlacademy.pro/kekstagram/data').then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Ошибка загрузки данных');
    }
  })
};

export const sendData = (formData) => {
  return fetch('https://31.javascript.htmlacademy.pro/kekstagram', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка отправки данных');
      }
      return response;
    });
};
