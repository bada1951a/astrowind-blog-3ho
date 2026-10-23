---
title: "Tự động hóa báo cáo tuần: Viết Apps Script gửi Google Sheets thành file PDF"
description: "Hướng dẫn thực chiến giúp nhân viên văn phòng tại TP.HCM và Hà Nội tự động hóa quy trình xuất và gửi báo cáo PDF từ Google Sheets chỉ trong vài nốt nhạc."
publishDate: 2026-10-20T22:15:00.000Z
image: 'https://picsum.photos/seed/work-mvgbm3er-11-c/1200/675.jpg'
category: 'automation'
tags: ["Google Apps Script", "Automation", "Google Sheets", "Office Tips"]
theme: "Mint Fresh Engineering"
---


Đồng hồ góc phải màn hình máy tính vừa điểm 17:30 chiều thứ Sáu tại văn phòng quận 1, TP.HCM. Sếp tổng vừa nhắn vào nhóm Zalo chung: "Mọi người gửi gấp bảng số liệu kinh doanh tuần này vào email để anh kiểm tra trước bữa tối nhé". Trong khi các đồng nghiệp khác bắt đầu thở dài, mở từng sheet, loay hoay chọn vùng in, xuất file PDF thủ công rồi đính kèm vào Outlook/Gmail, tôi nhấp chuột nhẹ nhàng vào một nút bấm tùy chỉnh sẵn trên thanh công cụ và thong thả nhấp ngụm cà phê. Chỉ 5 giây sau, một thông báo xanh hiện lên: "Đã gửi báo cáo tuần thành công đến hộp thư của sếp!". 

Bạn hoàn toàn có thể đạt được trạng thái "thong thả" này mỗi tuần mà không phải tốn một giọt mồ hôi vô ích nào cho việc copy-paste dữ liệu lặp đi lặp lại.

<div style="border-left: 4px solid #059669; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Mục tiêu bài viết:</strong> Chia sẻ trọn bộ mã nguồn Google Apps Script chuẩn xác, giúp bạn tự động hóa hoàn toàn quy trình chuyển đổi Google Sheets thành file PDF gọn gàng và gửi trực tiếp qua email định kỳ mỗi tuần.
</div>

## Nguyên nhân khiến quy trình làm báo cáo thủ công luôn "gây nghẽn"

Trước khi áp dụng tự động hóa, tôi từng trải qua vô số buổi chiều thứ Sáu "địa ngục" chỉ vì những lý do ngớ ngẩn sau:

1. Sai sót định dạng vùng in (Print Area): Khi xuất file PDF thủ công qua mục *Tệp > Tải xuống > Tài liệu PDF*, bảng tính thường bị tràn trang, chữ bị cắt đôi hoặc cột bị đẩy sang trang thứ hai trông rất thiếu chuyên nghiệp.

2. Quên cập nhật số liệu mới nhất: Do vội vàng, nhiều lần tôi gửi nhầm phiên bản báo cáo của tuần trước do chưa kịp tổng hợp dữ liệu mới từ các phòng ban đổ về.

3. Áp lực thời gian cuối ngày: Việc lặp lại các thao tác: Mở file, chọn Tệp, xuất PDF, mở Gmail, tải file lên, nhập tiêu đề, điền người nhận dễ khiến đầu óc mệt mỏi và bấm nhầm lẫn tài liệu nhạy cảm.

## Hướng dẫn thiết lập Apps Script tự động hóa báo cáo từ A đến Z

Chúng ta sẽ giải quyết bài toán này bằng một đoạn mã nguồn Google Apps Script ngắn gọn, tối ưu và không đòi hỏi kiến thức lập trình phức tạp. Hãy làm theo từng bước cụ thể dưới đây.

### Bước 1: Chuẩn bị bảng tính và mở trình soạn thảo mã nguồn
1. Mở file Google Sheets chứa báo cáo tuần của bạn.

2. Trên thanh thực đơn phía trên, chọn Tiện ích bổ sung (Extensions) > Trình chỉnh sửa tập lệnh (Apps Script). Một tab trình duyệt mới sẽ mở ra với giao diện lập trình.

### Bước 2: Dán đoạn mã Apps Script thực chiến
Xóa sạch đoạn mã mặc định có sẵn trong khung soạn thảo, sau đó dán toàn bộ đoạn mã tối ưu dưới đây vào:

```javascript
function sendWeeklyReportPDF() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("BaoCaoTuan"); // Đổi tên này thành tên sheet thực tế của bạn
  
  if (!sheet) {
    Logger.log("Không tìm thấy tên sheet phù hợp!");
    return;
  }
  
  var sheetId = sheet.getSheetId();
  var url = ss.getUrl().replace(/edit$/, '') + 'export?';
  
  // Thiết lập thông số xuất file PDF gọn gàng, vừa trang giấy A4 ngang
  var exportOptions = {
    exportFormat: 'pdf',
    format: 'pdf',
    size: 'A4',
    portrait: 'false', // false = Khổ ngang (Landscape), true = Khổ dọc (Portrait)
    fittow: '1',
    fittestpage: 'true',
    gridlines: 'false',
    printtitle: 'false',
    sheetnames: 'false',
    fivethousandrows: 'true',
    gid: sheetId
  };
  
  var ratingParameters = [];
  for (var key in exportOptions) {
    ratingParameters.push(key + '=' + exportOptions[key]);
  }
  
  var exportUrl = url + ratingParameters.join('&');
  
  // Xác thực quyền tải file PDF từ Google Sheets cá nhân
  var response = UrlFetchApp.fetch(exportUrl, {
    headers: {
      'Authorization': 'Bearer ' +  ScriptApp.getOAuthToken(),
      'MuteHttpExceptions': true
    }
  });
  
  var blob = response.getBlob().setName("Bao_Cao_Doanh_Thu_Tuan.pdf");
  
  // Cấu hình thông tin người nhận email
  var emailRecipient = "soperand@company.com"; // Thay đổi email người nhận tại đây
  var subject = "Báo cáo số liệu kinh doanh tuần - Tự động hóa từ hệ thống";
  var body = "Kính gửi Ban Giám đốc,\n\nEm gửi đính kèm file PDF báo cáo số liệu chi tiết của tuần này.\nTrân trọng.";
  
  // Gửi email kèm file PDF
  GmailApp.sendEmail(emailRecipient, subject, body, {
    attachments: [blob],
    name: "Hệ thống Báo cáo Tự động"
  });
  
  Logger.log("Đã gửi báo cáo PDF thành công!");
}
```

### Bước 3: Cấu hình trình kích hoạt tự động (Triggers) theo lịch trình
Bạn không muốn phải bấm chạy code thủ công mỗi tuần? Hãy để Google làm thay bạn:
1. Nhấn vào biểu tượng Trình kích hoạt (hình chiếc đồng hồ bên trái màn hình Apps Script).

2. Nhấn vào nút Thêm trình kích hoạt (Add Trigger) ở góc dưới bên phải.

3. Chọn hàm `sendWeeklyReportPDF`.

4. Ở phần chọn nguồn sự kiện, chọn Theo thời gian (Time-driven).

5. Chọn kiểu thời gian là Bộ hẹn giờ theo tuần (Weekly timer), chọn ngày thứ Sáu và khung giờ phù hợp (ví dụ: 17:00 - 18:00).

6. Nhấn Lưu (Save) và cấp quyền tài khoản Google của bạn khi được hỏi.

<div style="border-left: 4px solid #059669; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Mẹo nhỏ chuyên nghiệp:</strong> Trong lần chạy đầu tiên, Google sẽ yêu cầu bạn cấp quyền (Authorization). Hãy nhấn <em>Nâng cao (Advanced)</em> rồi chọn <em>Đi tới Untitled project (không an toàn)</em> vì đây là mã nguồn do chính bạn tự viết và vận hành trên tài khoản của mình.
</div>

## Những lưu ý thực tế khi triển khai

* Tên Sheet chính xác: Biến `sheetName` trong code phải khớp hoàn toàn với tên tab hiển thị dưới góc trái bảng Google Sheets của bạn (Ví dụ: `BaoCaoTuan` hoặc `Sheet1`). Tránh để khoảng trắng thừa gây lỗi tìm kiếm.
* Quyền riêng tư dữ liệu: Đoạn mã sử dụng OAuth Token nội bộ của tài khoản bạn để trích xuất file PDF, đảm bảo an toàn tuyệt đối và không bị rò rỉ dữ liệu ra bên ngoài ứng dụng của bên thứ ba.
* Kiểm tra định dạng trang in: Nếu bảng tính của bạn quá dài, hãy thử chuyển thông số `portrait` thành `true` hoặc chỉnh sửa lại độ rộng các cột trên Google Sheets trước khi chạy script để file PDF xuất ra đạt thẩm mỹ cao nhất.

## Câu hỏi thường gặp (FAQ)

### 1. Tôi có thể gửi email báo cáo này đồng thời cho nhiều người nhận không?
Hoàn toàn được. Bạn có thể thay đổi biến `emailRecipient` bằng một mảng danh sách email cách nhau bởi dấu phẩy, ví dụ: `"sếp1@company.com, sếp2@company.com, ketoan@company.com"`.



![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbm3er-11-b/1000/550.jpg)

### 2. File PDF xuất ra bị tràn chữ sang trang khác thì xử lý thế nào?
Bạn có thể tinh chỉnh lại các tham số trong khối `exportOptions` của đoạn code trên. Cụ thể, đặt `fittow: '1'` giúp ép toàn bộ bề dày bảng tính vừa khít vào một trang giấy theo chiều ngang, hạn chế tối đa tình trạng vỡ chữ.

### 3. Làm thế nào để kiểm tra script đã chạy thành công mà không cần đợi đến cuối tuần?
Rất đơn giản, ngay tại giao diện trình chỉnh sửa Apps Script, bạn hãy chọn đúng hàm `sendWeeklyReportPDF` trên thanh menu thả xuống và nhấn nút Chạy (Run) màu đỏ/xám bên cạnh. Hãy mở hộp thư đến của bạn sau vài giây để kiểm tra kết quả ngay lập tức!
