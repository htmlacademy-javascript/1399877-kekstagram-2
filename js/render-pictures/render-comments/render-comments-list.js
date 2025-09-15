const commentsList = document.querySelector('.social__comments');
const commentItemTemplate = commentsList.querySelector('.social__comment');
const commentsFragmentList = document.createDocumentFragment();

export const renderComments = (dataPictures, id) => {
  const item = dataPictures.find((element) => {
    return element.id === parseInt(id);
  });

  item.comments.forEach((comment) => {
    const element = commentItemTemplate.cloneNode(true);
    const image = element.querySelector('.social__picture');

    image.src = comment.avatar;
    image.alt = comment.name;
    element.querySelector('.social__text').textContent = comment.message;

    commentsFragmentList.append(element);
  });

  commentsList.innerHTML = '';
  commentsList.append(commentsFragmentList);
};