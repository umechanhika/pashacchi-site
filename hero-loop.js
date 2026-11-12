/* LP の最初の画面のスマホに、撮影画面のループ動画を重ねる。

   HTML にあるのは画像（動画の最初のコマと同じもの）だけで、動画はここで足す。
   - 「動きを減らす」設定の端末と、データ節約を求めている端末には足さない。画像のままにする。
   - 動画は再生が始まってから見せる。読み込み中は画像が見えている。
   - 端末が自動再生を止めた場合（iPhone の省電力モードなど）は、動画を外して画像に戻す。
   - 画面の外にある間は止める。
   対象は data-loop="<動画の URL>" を付けた img。body の末尾で読み込む。 */
(function () {
  'use strict';

  var img = document.querySelector('img[data-loop]');
  if (!img) throw new Error('hero-loop: data-loop を付けた img が見つからない');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection && navigator.connection.saveData) return;

  var video = document.createElement('video');
  video.className = 'hero__loop';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';
  // 何が写っているかは画像の alt が伝える。同じ内容を 2 回読ませない
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  video.src = img.getAttribute('data-loop');
  video.addEventListener('playing', function () {
    video.classList.add('is-playing');
  }, { once: true });
  img.parentNode.appendChild(video);

  var blocked = false;
  function play() {
    video.play().catch(function (error) {
      // 自動再生を端末が止めたときだけ画像に戻す。それ以外の失敗は隠さない
      if (error.name !== 'NotAllowedError') throw error;
      blocked = true;
      video.remove();
    });
  }

  new IntersectionObserver(function (entries) {
    if (blocked) return;
    if (entries[0].isIntersecting) play();
    else video.pause();
  }).observe(img);
})();
