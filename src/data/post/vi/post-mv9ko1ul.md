---
title: "Tự động phân loại hàng nghìn dòng dữ liệu trong Google Sheets với Gemini API và Apps Script"
description: "Hướng dẫn thực chiến kết nối Gemini API vào Google Sheets bằng Apps Script để phân loại hàng loạt văn bản cực nhanh, không lo lỗi giờ tan ca."
publishDate: 2026-10-15T22:15:00.000Z
image: "https://picsum.photos/seed/tech835/1200/630"
category: "Productivity"
tags: ["AI Tools", "Workflow", "Automation", "Google Sheets"]
theme: "Modern Minimalist Slate"
---


Đồng hồ trên góc phải màn hình máy tính vừa điểm 16:45 tại văn phòng ở quận 1, TP.HCM. Sếp vừa tung vào nhóm Zalo một file Google Sheets chứa đúng 2.500 dòng phản hồi của khách hàng từ chiến dịch tháng này và kèm theo yêu cầu ngắn gọn: "Em phân loại giúp anh các phản hồi này thành Tích cực, Tiêu cực hoặc Trung lập trước buổi họp giao ban lúc 17:30 nhé". Nhìn 2.500 dòng text lộn xộn, tay tôi lạnh ngắt vì nếu ngồi đọc và copy-paste thủ công từng dòng chắc phải đến nửa đêm mới xong.

<div style="border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Cú sốc đầu giờ chiều:</strong> Đừng bao giờ lãng phí thời gian cày cuốc thủ công cho những việc mà AI và một đoạn code ngắn có thể xử lý trong vòng chưa đầy 2 phút.
</div>

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office335/1000/550)

Trong cơn hoảng loạn, tôi nhớ đến Gemini API kết hợp cùng Google Apps Script. Thay vì trả tiền cho các add-on tính phí đắt đỏ hoặc cặm cụi gõ hàm thủ công, chúng ta hoàn toàn có thể tự dựng một chiếc "máy phân loại tự động" ngay trong bảng tính chỉ với vài bước đơn giản. Dưới đây là quy trình thực chiến tôi đã áp dụng để cứu cánh hạn chót cận kề.

---

### Nguyên nhân khiến việc tự động hóa hay gặp lỗi (Root Cause Breakdown)

Trước khi xắn tay áo vào code, hãy điểm qua 3 cạm bẫy phổ biến khiến anh em hay nản lòng khi kết nối Google Sheets với Gemini API:

1. **Lỗi Quá Tải Hạn Mức (Rate Limit - HTTP 429):** Khi bạn gửi quá nhiều yêu cầu (request) liên tục trong một giây, Gemini API sẽ lập tức chặn lại và báo lỗi. Apps Script cần có lệnh chờ (`Utilities.sleep`) để ngắt nhịp các lượt gọi.
2. **Sai Định Dạng Endpoint hoặc Khóa API (API Key):** Khóa API để lộ hoặc gọi sai phiên bản Gemini (như dùng model cũ hoặc cú pháp endpoint v1 thay vì v1beta) sẽ khiến hàm trả về giá trị trống hoặc lỗi quyền truy cập.
3. **Phản hồi AI quá dài dòng:** Đôi khi Gemini "nhiệt tình" trả về cả một đoạn văn giải thích thay vì chỉ đúng một từ khóa yêu cầu ("Tích cực", "Tiêu cực", "Trung lập"), làm lệch cột dữ liệu trên trang tính.

---

### Hướng dẫn từng bước thiết lập hàm tùy chỉnh (Custom Function) với Apps Script

Nào, bây giờ chúng ta sẽ cùng xử lý dứt điểm đống dữ liệu kia. Hãy làm theo chính xác các bước dưới đây trên giao diện Google Sheets của bạn.

#### Bước 1: Lấy mã khóa Gemini API (API Key)
1. Truy cập vào trang Google AI Studio (aistudio.google.com).
2. Đăng nhập bằng tài khoản Google cá nhân hoặc công việc của bạn.
3. Nhấp vào nút **Get API key**, chọn **Create API key in new project** và copy chuỗi ký tự được cung cấp. Hãy lưu lại cẩn thận, đừng để lộ cho người khác.

#### Bước 2: Viết mã Apps Script trong Google Sheets
1. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Xóa sạch đoạn code mặc định trong trình soạn thảo và dán đoạn mã thực chiến tối ưu hóa dưới đây vào:

```javascript
function PHAN_LOAI_GEMINI(text) {
  if (!text) return "";
  
  // Thay thế chuỗi YOUR_API_KEY bằng mã API thực tế của bạn
  var apiKey = "YOUR_API_KEY"; 
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
  var prompt = "Phân loại đoạn văn bản sau thành một trong ba trạng thái: Tích cực, Tiêu cực, Trung lập. Chỉ trả về đúng từ khóa kết quả, không giải thích gì thêm: " + text;
  
  var payload = {
    "contents": [{
      "parts": [{"text": prompt}]
    }]
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    if (json.candidates && json.candidates.length > 0) {
      return json.candidates[0].content.parts[0].text.trim();
    } else {
      return "Lỗi phản hồi";
    }
  } catch (error) {
    return "Lỗi kết nối: " + error.toString();
  }
}
```

3. Nhấp vào biểu tượng đĩa mềm **Lưu (Save)** ở trên cùng.

#### Bước 3: Sử dụng hàm trực tiếp trên bảng tính
Quay lại trang Google Sheets chính của bạn. Tại ô cần hiển thị kết quả (giả sử cột A chứa nội dung phản hồi, bạn muốn hiện kết quả ở cột B), hãy nhập công thức:

`=PHAN_LOAI_GEMINI(A2)`

Kéo công thức xuống cho các dòng tiếp theo. Chỉ sau vài giây, các nhãn phân loại sẽ tự động đổ về gọn gàng, chuẩn xác.

<div style="border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Mẹo thực chiến:</strong> Đối với số lượng dòng quá lớn (trên 500 dòng), việc gọi hàm liên tiếp có thể gây chậm. Thay vì dùng hàm tùy chỉnh (Custom Function) ở mọi ô, bạn nên viết một hàm Apps Script dạng vòng lặp mảng (Batch Process) để xử lý một lần rồi ghi kết quả dạng giá trị tĩnh (Value) ra bảng tính nhằm tối ưu tốc độ.
</div>

---

### Lưu ý quan trọng từ chuyên gia khi vận hành thực tế

- **Bảo mật dữ liệu công ty:** Tuyệt đối không đưa dữ liệu mang tính chất bảo mật nội bộ cao, thông tin khách hàng nhạy cảm (PII) hoặc tài chính doanh nghiệp vào các gói API miễn phí nếu chưa có thỏa thuận bảo mật dữ liệu doanh nghiệp với nhà cung cấp.
- **Sao lưu dữ liệu:** Luôn luôn tạo một bản sao (Make a copy) của file Google Sheets trước khi chạy các lệnh tự động hóa quy mô lớn để tránh việc script ghi đè lỗi làm hỏng dữ liệu gốc.
- **Xử lý ngắt quãng:** Nếu bảng tính có hàng nghìn dòng, hãy chia nhỏ thành các batch khoảng 100-200 dòng để chạy, tránh việc script bị timeout (giới hạn thời gian chạy 6 phút của Google Apps Script).

---

### Câu hỏi thường gặp (FAQ)

**1. Dùng hàm tùy chỉnh này có bị mất phí không?**
Hiện tại, Google cung cấp hạn mức miễn phí (Free tier) cho Gemini API thông qua Google AI Studio với giới hạn số lượng request mỗi phút (RPM) khá thoải mái cho các nhu cầu công việc văn phòng hàng ngày. Bạn hoàn toàn có thể yên tâm sử dụng mà không lo tốn phí phát sinh.

**2. Tại sao khi kéo công thức cho nhiều ô, một số ô lại báo lỗi "Exception: Request failed for..."?**
Đó là do bạn đã vượt quá giới hạn gọi API trong một khoảng thời gian ngắn (Rate Limit). Để khắc phục, bạn có thể thêm một khoảng dừng ngắn `Utilities.sleep(1000)` trong code, hoặc đơn giản là chia nhỏ các nhóm dòng để xử lý dần.

**3. Tôi muốn đổi các nhãn phân loại thành dạng khác (Ví dụ: Khen ngợi, Phàn nàn, Góp ý) thì phải làm sao?**
Rất đơn giản, bạn chỉ cần sửa lại phần biến `prompt` trong đoạn code Apps Script thành nội dung yêu cầu mới mà bạn mong muốn, sau đó lưu lại là xong. Gemini sẽ tuân thủ tuyệt đối cấu trúc nhãn mới của bạn.
