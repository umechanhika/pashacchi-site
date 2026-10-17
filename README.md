# パシャっち 紹介サイト

Android 向け子ども用カメラアプリ「パシャっち」の紹介ページ。ビルド不要の静的 HTML。
GitHub Pages（main のルート）で https://umechanhika.github.io/pashacchi-site/ に公開する。

## 構成

- `index.html` — 英語（既定。アプリの既定言語に合わせる）
- `ja/index.html` — 日本語
- `privacy/index.html`、`ja/privacy/index.html` — プライバシーポリシー（英語・日本語）。Play Console に登録する URL は英語版 https://umechanhika.github.io/pashacchi-site/privacy/
- `style.css` — 共通スタイル。配色と字体はアプリに合わせている（クリーム地、コーラル、セージ、マスタード、スカイ、Zen Maru Gothic）
- `assets/google-play-badge-*.png` — Google Play の公式バッジ（https://play.google.com/intl/en_us/badges/ から取得。改変しない）
- `assets/` — アイコン、OGP 画像、画面写真
  - 画面写真はアプリのリポジトリ（umechanhika/kids-camera の `store/`）にあるストア用画像を幅 540px に縮小したもの
  - `assets/<lang>/hero-screen.jpg` はストア用画像の 1 枚目から端末の画面部分だけを切り出したもの
  - ストア用画像と完全には同期しない。見せたい画面が変わったときに手で持ち込む

## 画像を作り直す

アプリのリポジトリの直下で次を実行し、できた `site/assets/` をこのリポジトリの `assets/` に上書きする。

```sh
for l in ja en; do
  src=store/phone; [ $l = en ] && src=store/en/phone
  for i in 01 02 03 04 05 06 07; do
    sips -Z 960 -s format jpeg -s formatOptions 82 $src/$i.png --out site/assets/$l/shot-$i.jpg
  done
  cp $src/01.png /tmp/crop-$l.png
  sips -c 1370 740 --cropOffset 540 170 /tmp/crop-$l.png
  sips -Z 1000 -s format jpeg -s formatOptions 85 /tmp/crop-$l.png --out site/assets/$l/hero-screen.jpg
done
```

## 手元で確かめる

```sh
python3 -m http.server 8765
# http://127.0.0.1:8765/ と http://127.0.0.1:8765/ja/
```

## Play へのリンクの流入元

Google Play へのリンクには `referrer=` に UTM を URL エンコードして付けている。Play Console の「ユーザー獲得」で、流入元 `pashacchi-site` として集計される。
`utm_content` は `<言語>-<位置>`（`ja-hero` など）で、どの言語のどのボタンから来たかを分ける。リンクを足すときも同じ形式にする。

## 関連

- アプリ本体: umechanhika/kids-camera（非公開）
- 旧プライバシーポリシー: umechanhika/pashacchi-privacy（このリポジトリへ転送するだけのページを残している）
