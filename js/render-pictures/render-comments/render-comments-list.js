import { SHOW_COMMETS_COUNT, STEP } from "../../const";

let commentsCount = SHOW_COMMETS_COUNT;
let templateNode = null;
let loadMoreController = null;

const getDom = () => {
  const modal = document.querySelector(".big-picture") || document;
  const commentsList = modal.querySelector(".social__comments");
  const loadMoreBtn = modal.querySelector(".social__comments-loader");
  const shownCountEl = modal.querySelector(".social__comment-shown-count");
  const totalCountEl = modal.querySelector(".social__comment-total-count");

  if (!commentsList) {
    return { modal, commentsList: null, loadMoreBtn, shownCountEl, totalCountEl };
  }

  if (!templateNode) {
    const first = commentsList.querySelector(".social__comment");
    if (first) {
      templateNode = first.cloneNode(true);
    } else {
      const li = document.createElement("li");
      li.className = "social__comment";
      li.innerHTML = `
        <img class="social__picture" src="" alt="" width="35" height="35">
        <p class="social__text"></p>
      `;
      templateNode = li;
    }
    commentsList.innerHTML = "";
  }

  return { modal, commentsList, loadMoreBtn, shownCountEl, totalCountEl };
};

const updateCounts = (shown, total, shownCountEl, totalCountEl) => {
  if (shownCountEl) shownCountEl.textContent = String(shown);
  if (totalCountEl) totalCountEl.textContent = String(total);
};

export const findItemPicturesList = (dataPictures, id) => {
  const item = dataPictures.find((el) => el.id === Number(id));
  commentsCount = SHOW_COMMETS_COUNT;
  return renderComments(item?.comments ?? []);
};

const buildComment = (c) => {
  const el = templateNode.cloneNode(true);
  const img = el.querySelector(".social__picture");
  if (img) {
    img.src = c.avatar;
    img.alt = c.name;
  }
  const text = el.querySelector(".social__text");
  if (text) text.textContent = c.message;
  return el;
};

const draw = (comments, commentsList) => {
  const frag = document.createDocumentFragment();
  const toRender = comments.slice(0, commentsCount);
  toRender.forEach((c) => frag.append(buildComment(c)));
  commentsList.innerHTML = "";
  commentsList.append(frag);
  return toRender.length;
};

const updateLoader = (loadMoreBtn, hasMore) => {
  if (!loadMoreBtn) return;
  loadMoreBtn.style.display = hasMore ? "" : "none";
  if (hasMore) loadMoreBtn.removeAttribute("disabled");
  else loadMoreBtn.setAttribute("disabled", "true");
};

export const renderComments = (comments) => {
  const { commentsList, loadMoreBtn, shownCountEl, totalCountEl } = getDom();
  if (!commentsList) return;

  const total = comments?.length ?? 0;

  if (loadMoreController) {
    loadMoreController.abort();
    loadMoreController = null;
  }

  if (!total) {
    commentsList.innerHTML = "";
    updateCounts(0, 0, shownCountEl, totalCountEl);
    updateLoader(loadMoreBtn, false);
    return;
  }

  commentsCount = Math.min(commentsCount, total);
  let shownNow = draw(comments, commentsList);
  updateCounts(shownNow, total, shownCountEl, totalCountEl);
  updateLoader(loadMoreBtn, shownNow < total);

  if (loadMoreBtn) {
    loadMoreController = new AbortController();
    const { signal } = loadMoreController;

    loadMoreBtn.addEventListener(
      "click",
      () => {
        commentsCount = Math.min(commentsCount + STEP, total);
        shownNow = draw(comments, commentsList);
        updateCounts(shownNow, total, shownCountEl, totalCountEl);
        updateLoader(loadMoreBtn, shownNow < total);
      },
      { signal }
    );
  }
};
