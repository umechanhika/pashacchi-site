// 紹介動画。ページを開いただけでは YouTube に通信せず、再生ボタンを押したときに初めて埋め込みを読み込む。
// 対象は data-youtube="<動画 ID>" を付けた要素。中のポスター画像とボタンを、YouTube の埋め込み（youtube-nocookie.com）に置き換える。
// 再生は GA のイベント video_play で送る（Cookie に同意していなければ gtag が無いので送らない）。
(function () {
  var lang = document.documentElement.lang === "ja" ? "ja" : "en";

  document.addEventListener("click", function (ev) {
    var button = ev.target.closest("[data-youtube] button");
    if (!button) return;
    var box = button.closest("[data-youtube]");
    var id = box.getAttribute("data-youtube");

    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&hl=" + lang;
    iframe.title = box.getAttribute("data-title") || "";
    iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    iframe.setAttribute("allowfullscreen", "");
    box.replaceChildren(iframe);
    box.classList.add("video--playing");

    if (typeof window.gtag === "function") {
      window.gtag("event", "video_play", { video: id, lang: lang });
    }
  });
})();
