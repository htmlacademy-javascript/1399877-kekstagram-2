import {getRandomInteger, createIdGenerator} from './utils';
import {MESSAGES, COUNT_AVATAR, AUTHORS, COUNT_COMMENTS, DESCRIPTIONS, COUNT_LIKES, COUNT_PHOTOS} from './const';

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

export const createPhotos = () => {
  const getPhotoId = createIdGenerator();
  const getCommentId = createIdGenerator();

  return Array.from({ length: COUNT_PHOTOS }, () =>
    generatePhoto(getPhotoId, getCommentId)
  );
};
