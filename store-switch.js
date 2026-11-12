/* LP のストアボタンを、開いた端末に合わせて 1 つだけ出す。

   ヘッダー（広い画面）と下端に浮かせる帯（狭い画面）には幅が足りず、2 つのストアを並べられないため。
   - iPhone（iPod touch を含む）は App Store、Android は Google Play のボタンを出す。
   - それ以外（パソコン、iPad など）は「ダウンロード」を出し、ページ下のバッジへ送る。
     iPad はまだ対応していないので、App Store へ直接は送らない。
   HTML では 3 つのボタンのうち「ダウンロード」だけが見えている。

   下端の帯は、冒頭のバッジ・ページ下のバッジ・フッターのどれも見えていない間だけ出す。
   バッジが見えている間は同じ行き先が 2 つ並ぶだけになり、フッターでは文字を覆ってしまうため。
   body の末尾で読み込む。 */
(function () {
  'use strict';

  var ua = navigator.userAgent;
  var os = /iPhone|iPod/.test(ua) ? 'ios' : /Android/.test(ua) ? 'android' : 'other';
  document.querySelectorAll('[data-os]').forEach(function (button) {
    button.hidden = button.getAttribute('data-os') !== os;
  });

  var bar = document.querySelector('.float-cta');
  var targets = ['.hero .badges', '#download', '.footer'].map(function (selector) {
    var el = document.querySelector(selector);
    if (!el) throw new Error('store-switch: ' + selector + ' が見つからない');
    return el;
  });
  if (!bar) throw new Error('store-switch: .float-cta が見つからない');

  var visible = new Set();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    bar.classList.toggle('is-shown', visible.size === 0);
  });
  targets.forEach(function (el) { observer.observe(el); });
})();
