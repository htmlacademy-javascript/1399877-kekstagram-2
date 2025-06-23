const COUNT_PHOTOS = 25;
const COUNT_AVATAR = { min: 1, max: 6 };
const COUNT_LIKES = { min: 15, max: 200 };
const COUNT_COMMENTS = { min: 0, max: 30 };

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const AUTHORS = [
  'Алексей Смирнов',
  'Мария Иванова',
  'Иван Кузнецов',
  'Ольга Соколова',
  'Дмитрий Морозов',
  'Анна Волкова',
  'Егор Лебедев',
  'Светлана Новикова',
  'Никита Павлов',
];

const DESCRIPTIONS = [
  'Закат над заливом, отражение в воде просто волшебное',
  'Уютное кафе с пледом и чашкой кофе на фоне серого неба',
  'Заросшая тропинка в сосновом лесу, словно из сказки',
  'Старинный фасад дома в солнечном свете выглядит особенно тепло',
  'Тёплый свет фонарей на фоне вечернего дождя',
  'Яркие витрины магазина на тихой улочке Петербурга',
  'Кораблик у причала на фоне тумана — как иллюстрация к повести',
  'Уличный музыкант играет на саксофоне, и всё вокруг будто замирает',
  'Листья клена на брусчатке — осень в самом красивом проявлении',
];

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const createIdGenerator = () => {
  let id = 0;
  return () => ++id;
};

const generateComment = (getId) => {
  const sentencesCount = getRandomInteger(1, 2);
  const message = Array.from({ length: sentencesCount }, () =>
    MESSAGES[getRandomInteger(0, MESSAGES.length - 1)]
  ).join(' ');

  return {
    id: getId(),
    avatar: `img/avatar-${getRandomInteger(COUNT_AVATAR.min, COUNT_AVATAR.max)}.svg`,
    message,
    name: AUTHORS[getRandomInteger(0, AUTHORS.length - 1)],
  };
};

const generateComments = (getId) =>
  Array.from({ length: getRandomInteger(COUNT_COMMENTS.min, COUNT_COMMENTS.max) }, () =>
    generateComment(getId)
  );

const generatePhoto = (getPhotoId, getCommentId) => {
  const id = getPhotoId();
  return {
    id,
    url: `photos/${id}.jpg`,
    description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
    likes: getRandomInteger(COUNT_LIKES.min, COUNT_LIKES.max),
    comments: generateComments(getCommentId),
  };
};

const createPhotoDescriptions = () => {
  const getPhotoId = createIdGenerator();
  const getCommentId = createIdGenerator();
  return Array.from({ length: COUNT_PHOTOS }, () =>
    generatePhoto(getPhotoId, getCommentId)
  );
};

const photoDescriptions = createPhotoDescriptions();
console.log(photoDescriptions);
