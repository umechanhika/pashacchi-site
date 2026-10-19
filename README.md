# パシャっち 紹介サイト

Android 向け子ども用カメラアプリ「パシャっち」の紹介ページ。ビルド不要の静的 HTML。
GitHub Pages（main のルート）で https://pashacchi.com/ に公開する。ドメインは `CNAME` ファイルで指定する。

## 構成

- `index.html` — 英語（既定。アプリの既定言語に合わせる）
- `ja/index.html` — 日本語
- `privacy/index.html`、`ja/privacy/index.html` — プライバシーポリシー（英語・日本語）。Play Console に登録する URL は英語版 https://pashacchi.com/privacy/
- `play-referrer.js` — このサイトに付いて来た `utm_*` を Google Play リンクの `referrer=` に書き写す（下の「Play へのリンクの流入元」）
- `style.css` — 共通スタイル。配色と字体はアプリに合わせている（クリーム地、コーラル、セージ、マスタード、スカイ、Zen Maru Gothic）
- `assets/google-play-badge-*.png` — Google Play の公式バッジ（https://play.google.com/intl/en_us/badges/ から取得。改変しない）
- `assets/` — アイコン、OGP 画像、画面写真
  - 画面写真はアプリのリポジトリ（umechanhika/kids-camera の `store/`）にあるストア用画像から、端末の画面部分（02 は写真カード）だけを切り出したもの。見出しはページ側に書くので、画像に焼き込まれた見出しは使わない
  - ストア用画像と完全には同期しない。見せたい画面が変わったときに手で持ち込む

## 画像を作り直す

アプリのリポジトリの直下で次を実行し、できた `site/assets/` をこのリポジトリの `assets/` に上書きする。

```sh
for l in ja en; do
  src=store/phone; [ $l = en ] && src=store/en/phone
  for i in 01 03 06; do
    cp $src/$i.png /tmp/crop-$l.png
    sips -c 1370 740 --cropOffset 540 170 /tmp/crop-$l.png
    sips -Z 1000 -s format jpeg -s formatOptions 85 /tmp/crop-$l.png --out /tmp/screen-$i.jpg
    cwebp -q 82 -m 6 /tmp/screen-$i.jpg -o site/assets/$l/screen-$i.webp
  done
  cp $src/02.png /tmp/crop-$l.png
  sips -c 1092 704 --cropOffset 596 158 /tmp/crop-$l.png
  sips -Z 1000 -s format jpeg -s formatOptions 85 /tmp/crop-$l.png --out /tmp/screen-02.jpg
  cwebp -q 82 -m 6 /tmp/screen-02.jpg -o site/assets/$l/screen-02.webp
done
```

`screen-04.webp`（1枚ずつ大きく見て選ぶ画面）だけは、下のボタンまで見せるためストア用画像からの切り出しではなく、端末の画面写真（`adb exec-out screencap -p`、1080x2424）をそのまま幅 540px に縮小したもの。画面写真は転送量を抑えるため WebP（`cwebp`、品質 82）で置く。OGP 画像とバッジは PNG のまま。

## 手元で確かめる

```sh
python3 -m http.server 8765
# http://127.0.0.1:8765/ と http://127.0.0.1:8765/ja/
```

## Play へのリンクの流入元

Google Play へのリンクには `referrer=` に UTM を URL エンコードして付けている。Play Console の「ユーザー獲得」で、流入元 `pashacchi-site` として集計される。
`utm_content` は `<言語>-<位置>`（`ja-hero` など）で、どの言語のどのボタンから来たかを分ける。リンクを足すときも同じ形式にする。

### 外からこのサイトへのリンク

このサイトへ飛ばすリンクに `utm_source`（必須）、`utm_medium`、`utm_campaign` を付けると、`play-referrer.js` が
その値でページ内の Play リンクの `utm_source` / `utm_medium` / `utm_campaign` を上書きする。`utm_content` はボタンの位置のまま残る。
Play Console では、そのリンク元からインストールした人が `utm_source` の値で集計される。

```
https://pashacchi.com/ja/?utm_source=umechanhika.com&utm_medium=referral&utm_campaign=works
```

- 受け取った `utm_*` は同じタブの間だけ `sessionStorage` に持ち、言語を切り替えても引き継ぐ。URL は変えない（アクセス解析が着地 URL の `utm_*` で流入元を取るため）。
- アクセス解析は LP への流入を、Play の referrer はインストールまでを計測する。役割が違うので両方使う。
- 英語ページから日本語ページへの自動振り分けはクエリを引き継ぐ。ただし日本語の読者向けなら最初から `/ja/` へ飛ばす。
- JavaScript が無効なときは、HTML に書いた `pashacchi-site` 発の referrer のまま Play へ行く。
- 付けているリンク: umechanhika.com の「つくったもの」（`utm_source=umechanhika.com`、`utm_campaign=works`）

## 関連

- アプリ本体: umechanhika/kids-camera（非公開）
- 旧プライバシーポリシー: umechanhika/pashacchi-privacy（このリポジトリへ転送するだけのページを残している）
