// アクセス解析（Google アナリティクス 4 と Microsoft Clarity）と Cookie の同意バナー。
// ID はこのファイルだけで管理し、各ページは <script async src="analytics.js"> で読み込む。
// 訪問者がバナーで同意するまで、解析のスクリプトは一切読み込まない。
// 選んだ内容は localStorage の "cookie-consent" に "accepted" / "rejected" で残す。
// 手元の確認（127.0.0.1 など）や GitHub Pages の既定ドメインでは、バナーは出るが計測はしない。
// ストアのボタン（data-store と data-position を付けた <a>）のクリックは GA の store_click イベントで送る。
(function () {
  var GA_MEASUREMENT_ID = "G-RY7BQSZDJY";
  // Clarity は空にすると読み込まない。
  var CLARITY_PROJECT_ID = "z0cuykfz1g";

  var STORAGE_KEY = "cookie-consent";
  var lang = document.documentElement.lang === "ja" ? "ja" : "en";

  // ストアのボタンのクリックを GA に送る。遷移は止めない。
  // 同意前は gtag が無いので何も送らない。
  document.addEventListener("click", function (ev) {
    var link = ev.target.closest("a[data-store]");
    if (!link || typeof window.gtag !== "function") return;
    window.gtag("event", "store_click", {
      store: link.getAttribute("data-store"),
      position: link.getAttribute("data-position"),
      lang: lang
    });
  });
  var text = {
    en: {
      body: "This site uses cookies from Google Analytics and Microsoft Clarity to learn how it is visited. You can change your choice any time from “Cookie settings” at the bottom of the page.",
      policy: "Privacy policy",
      accept: "Accept",
      reject: "Decline"
    },
    ja: {
      body: "このサイトでは、閲覧のされ方を知るために Google アナリティクスと Microsoft Clarity の Cookie を使います。選んだ内容は、ページの下の「Cookie の設定」からいつでも変えられます。",
      policy: "プライバシーポリシー",
      accept: "同意する",
      reject: "同意しない"
    }
  }[lang];
  var policyHref = (lang === "ja" ? "/ja/privacy/" : "/privacy/") + "#cookies";

  function readChoice() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (location.hostname !== "pashacchi.com") return;

    // Google アナリティクス 4（gtag.js）
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);

    // Microsoft Clarity
    if (!CLARITY_PROJECT_ID) return;
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    var cl = document.createElement("script");
    cl.async = true;
    cl.src = "https://www.clarity.ms/tag/" + CLARITY_PROJECT_ID;
    document.head.appendChild(cl);
  }

  // 同意を取り消したとき、解析が置いた Cookie を消し、読み込み済みのスクリプトを止めるためにページを読み直す
  function clearAnalyticsCookies() {
    var names = document.cookie.split(";").map(function (c) { return c.split("=")[0].trim(); });
    var domains = ["", location.hostname, "." + location.hostname];
    names.forEach(function (name) {
      if (!/^(_ga|_gid|_gat|_clck|_clsk|CLID|ANONCHK|MUID|SM)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }

  var banner = null;
  function showBanner() {
    if (banner) return;
    banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", text.policy);
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text"></p>' +
        '<div class="cookie-banner__actions">' +
          '<a class="cookie-banner__policy"></a>' +
          '<button type="button" class="btn btn--small btn--ghost" data-choice="rejected"></button>' +
          '<button type="button" class="btn btn--small" data-choice="accepted"></button>' +
        "</div>" +
      "</div>";
    banner.querySelector(".cookie-banner__text").textContent = text.body;
    var policy = banner.querySelector(".cookie-banner__policy");
    policy.textContent = text.policy;
    policy.href = policyHref;
    banner.querySelector('[data-choice="rejected"]').textContent = text.reject;
    banner.querySelector('[data-choice="accepted"]').textContent = text.accept;
    banner.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-choice]");
      if (!btn) return;
      choose(btn.getAttribute("data-choice"));
    });
    document.body.appendChild(banner);
  }
  function hideBanner() {
    if (!banner) return;
    banner.remove();
    banner = null;
  }

  var analyticsLoaded = false;
  function choose(value) {
    var before = readChoice();
    saveChoice(value);
    hideBanner();
    if (value === "accepted" && !analyticsLoaded) {
      analyticsLoaded = true;
      loadAnalytics();
    } else if (value === "rejected" && before === "accepted") {
      clearAnalyticsCookies();
      location.reload();
    }
  }

  function init() {
    var choice = readChoice();
    if (choice === "accepted") {
      analyticsLoaded = true;
      loadAnalytics();
    } else if (choice !== "rejected") {
      showBanner();
    }
    // フッターの「Cookie の設定」から選び直せるようにする
    document.querySelectorAll("[data-cookie-settings]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        showBanner();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
