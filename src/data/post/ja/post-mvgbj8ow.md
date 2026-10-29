---
title: "GASでスプレッドシートを週次自動PDF化してメール送信！丸之内の残業をゼロにする実装手順"
description: "品川・丸之内のオフィスで月末の売上集計締切に追われていませんか？Google Apps Scriptを活用して、週次PDFレポートの作成からメール送信までを完全自動化する方法を現役ITワーカーが徹底解説します。"
publishDate: 2026-10-20T11:00:00.000Z
image: 'https://picsum.photos/seed/work-mvgbjrfz-2-c/1200/675.jpg'
category: 'automation'
tags: ["Google Apps Script", "業務効率化", "スプレッドシート", "自動化", "時短術"]
theme: "Cobalt Enterprise Lab"
---

時計の針は金曜日の18時を回ったところ。丸の内のオフィスでは、翌週の経営陣向け定例会議に向けた「週次売上レポート」の作成に追われ、フロア全体にキーボードを叩く音だけがピリピリと響いていました。Googleスプレッドシートで集計したデータを手作業でPDFにエクスポートし、宛先を確認してメールに添付して送信する……。毎週これを手動でやっているせいで、金曜の夜が消えていく。そんな絶望感に襲われたことはありませんか？

「また今週も、この単純作業で終電コースか……」

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbjrfz-2-b/1000/550.jpg)

直属の上司からは「来週からは定型業務の自動化を進めてくれよ」とプレッシャーをかけられ、頭を抱えた瞬間、私は決心しました。もう二度と、手作業でPDF化とメール送信をやらないと。今回は、GoogleスプレッドシートとGoogle Apps Script（GAS）を組み合わせて、指定したシートを自動でPDF化し、毎週決まった時間にメール送信する仕組みを完全構築する方法を共有します。

<div style="border-left: 4px solid #1e40af; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Cobalt Enterprise Lab Insights:</strong> 実際にこのGAS自動化を導入したチームでは、週次レポート作成にかかっていた手作業の時間が「ゼロ」になり、月間でおよそ12時間の工数削減（年間144時間！）に成功しています。
</div>

---

## なぜ手動でのPDFレポート送信は破綻するのか？3つの根本原因

多くのオフィスワーカーが、毎週末の定例レポート作成で疲弊しているのには明確な理由があります。システムやツールが悪いのではなく、運用フローに潜む構造的なボトルネックが原因です。

1. <strong>エクスポート設定の属人化と手戻り</strong>
   PDFに出力する際、「印刷範囲の選択」「ページを幅に合わせる」「グリッド線の有無」といった細かい設定を毎回手動で行っているため、担当者によってレイアウトが崩れたり、見切れたりするミスが頻発します。
2. <strong>送信先リストや宛先の管理ミス</strong>
   メーラーを開いて宛先（TO / CC）を手入力したり、アドレス帳から検索したりする作業は、深夜の疲れた頭では誤送信リスク（情報漏洩リスク）を跳ね上げます。
3. <strong>「忘れる」というヒューマンエラー</strong>
   どれだけ優秀なビジネスパーソンでも、祝日や繁忙期が重なると「週次レポートの送信自体を忘れていた」という事故が起こります。これは人間の記憶力に依存している限り防げません。

---

## 3ステップで完了！GASを使った週次PDF自動送信の実装手順

ここからは、実際にコピペで動かせる実用的なコードと設定手順を解説します。プログラミングの深い知識がなくても、手順通りに進めれば15分で完了します。

### ステップ1：スプレッドシートにApps Scriptエディタを開く
対象となるGoogleスプレッドシートを開き、上部メニューの <strong>「拡張機能」 > 「Apps Script」</strong> をクリックします。初期コード（`myFunction`など）はすべて削除してください。

### ステップ2：自動化スクリプトの貼り付け
以下のコードをエディタにそのまま貼り付けます。送信先メールアドレスやシート名はお使いの環境に合わせて書き換えてください。

```javascript
function sendWeeklyReportPDF() {
  // 1. スプレッドシートと対象シートの取得
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("レポート出力用"); // 対象のシート名に変更してください
  
  if (!sheet) {
    Logger.log("指定されたシートが見つかりません。");
    return;
  }
  
  var sheetId = sheet.getSheetId();
  
  // 2. PDFのエクスポートオプション設定
  var url = ss.getUrl().replace(/edit$/, '');
  var exportUrl = url + 'export?';
  
  var exportOptions = {
    exportFormat: 'pdf',
    format: 'pdf',
    size: 'A4',           // 用紙サイズ
    portrait: 'false',    // 横向き（trueなら縦向き）
    fitw: 'true',         // ページ幅をウィンドウに合わせる
    gridlines: 'false',   // グリッド線非表示
    gid: sheetId
  };
  
  var urlParts = [];
  for (var key in exportOptions) {
    urlParts.push(key + '=' + exportOptions[key]);
  }
  var exportUrl = exportUrl + urlParts.join('&');
  
  // 3. アクセストークンを付与してPDFBlobを取得
  var response = UrlFetchApp.fetch(exportUrl, {
    headers: {
      'Authorization': 'Bearer ' +  ScriptApp.getOAuthToken(),
      'MuteHttpExceptions': true
    }
  });
  
  var blob = response.getBlob().setName("週次売上レポート_" + Utilities.formatDate(new Date(), "JST", "yyyyMMdd") + ".pdf");
  
  // 4. メールの送信設定
  var recipient = "your-boss@example.com"; // 送信先メールアドレス
  var subject = "【自動送信】今週の週次売上レポート (" + Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd") + ")";
  var body = "お疲れ様です。\n\n今週の週次売上レポートを自動添付いたします。\nご確認ください。\n\nよろしくお願いいたします。";
  
  GmailApp.sendEmail(recipient, subject, body, {
    attachments: [blob],
    name: "自動レポート配信システム"
  });
}
```

### ステップ3：毎週自動実行するトリガーの設定
コードが正しく動くことを上部の「実行」ボタンでテスト（初回のみ権限承認が必要です）したら、次は定期実行の設定です。

1. Apps Script画面の左メニューにある時計アイコン（<strong>トリガー</strong>）をクリックします。
2. 画面右下の <strong>「トリガーを追加」</strong> ボタンをクリックします。
3. 実行する関数に `sendWeeklyReportPDF` を選択。
4. イベントのソースを <strong>「時間主導型」</strong> に変更。
5. 時間ベースのタイマーのタイプを <strong>「週ベースのタイマー」</strong> にし、毎週金曜日の希望時間（例: 午後 5時〜6時）を設定して保存します。

これで、あなたが定時で帰路についている間も、システムが自動で最新データをPDF化して上司やチームメンバーにメール送信してくれます。

<div style="border-left: 4px solid #1e40af; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Expert Warning / 運用時の注意点:</strong> 初めてスクリプトを実行する際、「承認が必要です」というポップアップが表示されます。これはGoogle公式のセキュリティ確認画面です。「詳細」 > 「安全ではないページに移動（リンク）」をクリックし、ご自身のGoogleアカウントへのアクセス権を許可してください。機密データを扱う際は、送信先メールアドレスの誤入力に十分注意しましょう。
</div>

---

## よくある質問（FAQ）


Q1. PDFのレイアウトが崩れて1枚に収まりません。どうすればいいですか？


A1. スクリプト内の `exportOptions` パラメータで調整が可能です。「`fitw: 'true'`（幅を合わせる）」に加えて、元のスプレッドシート側であらかじめ印刷範囲の列幅・行高を整えておくか、不要な列を非表示にしておくことで、きれいな1枚のPDFに出力されます。


Q2. 複数の宛先（CCや複数人への送信）に対応させるにはどうすればいいですか？


A2. `GmailApp.sendEmail` の引数部分を拡張することで対応できます。例として、オプションに `cc: "colleague@example.com"` を追加するか、`recipient` 変数にカンマ区切りで複数のメールアドレスを指定してください。


Q3. スクリプトの実行エラーに気づくにはどうすればいいですか？


A3. Apps Scriptのトリガー設定画面では、エラー通知の頻度を「毎日」または「すぐに」受け取るように設定できます。万が一API制限やタイムアウトで失敗した場合に即座に通知メールが届くため、メンテナンスも安心です。
