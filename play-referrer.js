/* 流入元の引き継ぎ。

   このサイトへのリンクに付いた utm_*（utm_source があるときだけ有効）を、
   ページ内の Google Play リンクの referrer= に書き写す。
   Play Console の「ユーザー獲得」で、どのサイトから来てインストールしたかを
   分けるため。解析ツールは入れないので、計測はこの referrer だけで行う。

   - utm_source / utm_medium / utm_campaign / utm_term は入口の値で上書きする。
   - utm_content は Play リンク側の値（<言語>-<位置>）をそのまま残す。
     どのボタンから Play へ行ったかは、入口がどこでも分けたいため。
   - 受け取った utm_* は sessionStorage に置き、同じタブで言語を切り替えても
     引き継ぐ。タブを閉じれば消える。URL は触らない。アクセス解析（GA など）が
     着地 URL の utm_* で流入元を取るので、消すと解析側の計測が壊れるため。
   - utm_source の無い訪問では何もしない。Play リンクは HTML に書いた
     pashacchi-site 発の referrer のまま。 */
(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];
  var STORAGE_KEY = 'inbound-utm';

  function readFromUrl() {
    var q = new URLSearchParams(location.search);
    if (!q.get('utm_source')) return null;
    var utm = {};
    KEYS.forEach(function (key) {
      var value = q.get(key);
      if (value) utm[key] = value;
    });
    return utm;
  }

  function load() {
    var fromUrl = readFromUrl();
    if (fromUrl) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    var saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  function rewrite(link, utm) {
    var url = new URL(link.href);
    var referrer = new URLSearchParams(url.searchParams.get('referrer') || '');
    KEYS.forEach(function (key) {
      if (utm[key]) referrer.set(key, utm[key]);
    });
    url.searchParams.set('referrer', referrer.toString());
    link.href = url.toString();
  }

  try {
    var utm = load();
    if (!utm) return;
    document.querySelectorAll('a[href^="https://play.google.com/"]').forEach(function (link) {
      rewrite(link, utm);
    });
  } catch (e) {}
})();
