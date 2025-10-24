const URL = 'https://31.javascript.htmlacademy.pro/kekstagram/';

export const getData = async () => {
  const response = await fetch(`${URL}data`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
};

export const sendData = async (data) => {
  const response = await fetch(URL, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Ошибка отправки: ${response.status}`);
  }
  return response;
};
