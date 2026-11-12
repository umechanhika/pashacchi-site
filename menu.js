/* LP の狭い画面のメニュー。見出しの一覧を下からせり上がる <dialog> で出す。

   開くボタンはヘッダーと下端の帯の 2 か所にあり、どちらも同じ一覧を開く。
   見出し・閉じるボタン・一覧の外側（背景）のどれを押しても閉じる。
   body の末尾で読み込む。 */
(function () {
  'use strict';

  var menu = document.getElementById('menu');
  var openers = document.querySelectorAll('[data-menu-open]');
  if (!menu) throw new Error('menu: #menu が見つからない');
  if (!openers.length) throw new Error('menu: 開くボタンが見つからない');

  openers.forEach(function (button) {
    button.addEventListener('click', function () { menu.showModal(); });
  });
  menu.addEventListener('click', function (ev) {
    // 背景を押したときは、押された要素が <dialog> 自身になる
    if (ev.target === menu || ev.target.closest('a, [data-menu-close]')) menu.close();
  });
})();
