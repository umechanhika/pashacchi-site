/* ヘッダーのストアボタンを、開いた端末に合わせて 1 つだけ出す。

   ヘッダーには幅が足りず、2 つのストアを並べられないため。
   - iPhone（iPod touch を含む）は App Store、Android は Google Play のボタンを出す。
   - それ以外（パソコン、iPad など）は「ダウンロード」を出し、ページ下のバッジへ送る。
     iPad はまだ対応していないので、App Store へ直接は送らない。
   HTML では 3 つのボタンのうち「ダウンロード」だけが見えている。
   ヘッダーの直後で読み込み、描画の前に切り替える。 */
(function () {
  'use strict';

  var ua = navigator.userAgent;
  var os = /iPhone|iPod/.test(ua) ? 'ios' : /Android/.test(ua) ? 'android' : 'other';
  document.querySelectorAll('.header [data-os]').forEach(function (button) {
    button.hidden = button.getAttribute('data-os') !== os;
  });
})();
