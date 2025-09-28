import { HASHTAG_VALIDATION, MAX_HASHTAGS } from '../const';

const convertToArray = (string) => string.trim().split(/\s+/).filter((element) => element.trim().length);

export const isValidHashtags = (value) => {
  const tags = convertToArray(value);

  if (tags.length === 0) {
    return true;
  }
  return tags.every((tag) => HASHTAG_VALIDATION.test(tag));
};

export const isWithinHashtagsLimit = (value) => {
  const tags = convertToArray(value);
  return tags.length <= MAX_HASHTAGS;
};

export const isUniqueValue = (value) => {
  const tags = convertToArray(value).map((tag) => tag.toLowerCase().normalize('NFC'));
  return tags.length === new Set(tags).size;
};

export const isValidDescription = (value) => value.trim().length <= 140;
