/* eslint-env browser */
const video = document.querySelector('iframe');
const videoBtn = document.querySelector('#video-btn');

videoBtn.addEventListener('click', () => {
  video.style.display = 'block';
  videoBtn.style.display = 'none';
});
