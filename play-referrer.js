/* 流入元の引き継ぎ。

   このサイトへのリンクに付いた utm_*（utm_source があるときだけ有効）を、
   ページ内の Google Play リンクの referrer= に書き写す。
   Play Console の「ユーザー獲得」で、どのサイトから来てインストールしたかを
   分けるため。アクセス解析（analytics.js）は LP への流入を、この referrer は
   インストールまでを計測する。

   - utm_source / utm_medium / utm_campaign / utm_term は入口の値で上書きする。
   - utm_content は Play リンク側の値（<言語>-<位置>）をそのまま残す。
     どのボタンから Play へ行ったかは、入口がどこでも分けたいため。
   - 受け取った utm_* は sessionStorage に置き、同じタブで言語を切り替えても
     引き継ぐ。タブを閉じれば消える。URL は触らない。アクセス解析（GA など）が
     着地 URL の utm_* で流入元を取るので、消すと解析側の計測が壊れるため。
   - utm_source の無い訪問では何もしない。Play リンクは HTML に書いた
     pashacchi-site 発の referrer のまま。
   - 値は英数字と . - _ だけを通す（. は umechanhika.com のようなドメイン名の utm_source のため）。それ以外の文字を含む値が 1 つでもあれば、
     その流入は引き継がず固定値のまま。referrer に素性の知れない文字列を
     流さないため。 */
(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];
  var STORAGE_KEY = 'inbound-utm';
  var SAFE_VALUE = /^[A-Za-z0-9._-]+$/;

  function readFromUrl() {
    var q = new URLSearchParams(location.search);
    if (!q.get('utm_source')) return null;
    var utm = {};
    var unsafe = false;
    KEYS.forEach(function (key) {
      var value = q.get(key);
      if (!value) return;
      if (!SAFE_VALUE.test(value)) unsafe = true;
      utm[key] = value;
    });
    return unsafe ? null : utm;
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
