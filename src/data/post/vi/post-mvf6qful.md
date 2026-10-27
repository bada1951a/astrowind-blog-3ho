---
title: "Tự động hóa lọc khách hàng trùng lặp trên Google Sheets bằng Gemini Prompt"
description: "Hướng dẫn thực chiến dọn sạch dữ liệu khách hàng trùng lặp trong Google Sheets bằng Gemini AI trước giờ chốt báo cáo tại văn phòng."
publishDate: 2026-10-19T22:15:00.000Z
image: 'https://picsum.photos/seed/work-mvf6t76x-11-c/1200/675.jpg'
category: 'automation'
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Crimson Emergency Field"
---

## 1. Tình huống sự cố khẩn cấp và tắc nghẽn công việc văn phòng

Đồng hồ góc phải màn hình máy tính nhảy tưng tưng báo 17:15 chiều. Sếp vừa nhắn vào nhóm Zalo chung: "Em ơi, 18:00 gửi anh danh sách lead khách hàng chiến dịch tháng này để họp ban giám đốc nhé. Nhớ là dữ liệu phải sạch, không được trùng lặp sỉ lẻ đấy!". 

Tôi mở file Google Sheets chứa gần 5.000 dòng dữ liệu vừa được tổng hợp từ 3 nguồn khác nhau: form đăng ký sự kiện, tin nhắn Zalo OA và danh sách sales tự nhập tay. Nhìn sơ qua là thấy hoa mắt: số điện thoại người thì có đầu +84, người thì để 0, email có chỗ viết hoa chữ cái đầu, có chỗ thừa dấu cách ở đuôi. Dùng tính năng Remove Duplicates mặc định của Google Sheets thì kết quả trả về gần như số lượng cũ vì định dạng dữ liệu không đồng nhất. Lọc bằng tay thì đến mai mới xong, mà sếp thì đang giục gắt.

<div style="border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Cảnh báo khủng hoảng dữ liệu:</strong> Dữ liệu trùng lặp nhưng khác định dạng (ví dụ: "0901234567" và "+84901234567") sẽ lọt qua mọi bộ lọc thông thường của bảng tính, khiến báo cáo hiệu suất quảng cáo bị sai lệch nghiêm trọng.
</div>

## 3 Nguyên nhân chính khiến file dữ liệu khách hàng luôn hỗn loạn

Trước khi tìm cách giải quyết bằng AI, chúng ta cần hiểu tại sao file Google Sheets của văn phòng lại biến thành một bãi chiến trường như vậy:

1. Định dạng số điện thoại và email không đồng nhất: Người dùng nhập từ điện thoại di động thường bật chế độ tự động viết hoa chữ cái đầu tiên của email, hoặc thêm dấu cách vô tình ở cuối dòng. Số điện thoại lúc thì có dấu chấm (090.123.4567), lúc có dấu cách, lúc thêm mã vùng quốc gia.

2. Sai sót từ khâu nhập liệu thủ công (Human Error): Đội ngũ sales khi nhập tay danh sách khách hàng từ các cuộc gọi hotline thường gõ nhầm một vài ký tự hoặc viết tắt tên công ty, khiến hệ thống nhận diện đây là hai khách hàng hoàn toàn khác nhau.

3. Đổ dữ liệu (Merge Data) từ nhiều nguồn: Khi kết hợp file từ Facebook Ads, Google Ads và Landing Page tự thiết kế, các trường thông tin (Column headers) không khớp nhau, dẫn đến việc trùng lặp khách hàng nhưng nằm ở các cột dịch chuyển lệch pha. ## Giải pháp thực chiến: Dùng Google Sheets kết hợp Gemini Prompt để xử lý triệt để

Thay vì viết những hàm Regex phức tạp hay ngồi dò từng dòng bằng mắt, tôi tận dụng Gemini để tạo ra một đoạn mã Google Apps Script tự động làm sạch và gom nhóm dữ liệu chính xác trong tích tắc.

### Bước 1: Chuẩn bị dữ liệu và mở Apps Script
Tại file Google Sheets của bạn, hãy vào menu Tiện ích mở rộng (Extensions) > chọn Apps Script. Xóa toàn bộ đoạn mã mặc định có sẵn trong khung soạn thảo.

### Bước 2: Sử dụng Gemini Prompt chuyên dụng để viết mã tự động
Hãy copy đoạn prompt dưới đây và dán vào Gemini (hoặc ChatGPT) để yêu cầu AI viết mã Apps Script phù hợp với cấu trúc file của bạn:

```text
Tôi đang làm việc trên Google Sheets tại văn phòng và cần xử lý một bảng dữ liệu khách hàng. 
Trang tính hiện tại có tên là "Sheet1" với các cột lần lượt là:

**A:** Họ tên, B: Số điện thoại, C: Email, D: Ngày đăng ký.
Hãy viết giúp tôi một đoạn mã Google Apps Script hoàn chỉnh thực hiện các việc sau:
1. Tự động làm sạch dữ liệu: Xóa khoảng trắng thừa ở đầu và cuối chuỗi (trim), chuyển email về chữ thường (lowercase).

2. Chuẩn hóa số điện thoại: Loại bỏ tất cả các ký tự không phải số, chuyển đổi đầu số +84 thành 0 nếu có.

3. Tìm và loại bỏ các dòng có số điện thoại hoặc email trùng lặp, chỉ giữ lại dòng xuất hiện đầu tiên.

4. Đưa các dòng dữ liệu đã được làm sạch và lọc trùng ra một Sheet mới có tên là "Cleaned_Data".
Chỉ trả về đoạn mã code sạch, kèm theo hướng dẫn ngắn gọn cách chạy.
```

### Bước 3: Dán mã và chạy lệnh xử lý
Sau khi Gemini trả về đoạn mã Apps Script, bạn dán nó vào khung soạn thảo trong Google Sheets, đặt tên cho dự án và nhấn nút Chạy (Run). Cấp quyền truy cập tài khoản khi Google hiển thị bảng cảnh báo bảo mật (nhấn *Nâng cao* > *Đi tới dự án không an toàn*).

Chưa đầy 5 giây, một Sheet mới mang tên Cleaned_Data xuất hiện ngay trước mắt tôi với toàn bộ danh sách 5.000 dòng đã được gọt giũa sạch sẽ, các bản ghi trùng lặp đã bốc hơi hoàn toàn, định dạng số điện thoại và email đồng bộ 100%.

<div style="border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Mẹo thực chiến từ chuyên gi

**a:**</strong> Luôn tạo một bản sao (Make a copy) của file Google Sheets gốc trước khi chạy bất kỳ đoạn mã Apps Script nào do AI viết để phòng tránh trường hợp mất dữ liệu do lỗi logic trong code.
</div>

## Những lưu ý quan trọng về bảo mật dữ liệu doanh nghiệp

Khi sử dụng các công cụ AI như Gemini để xử lý dữ liệu bảng tính, bạn cần ghi nhớ các nguyên tắc cốt lõi sau để bảo vệ thông tin khách hàng:
* Ẩn danh hóa thông tin nhạy cảm: Trước khi yêu cầu AI phân tích mẫu dữ liệu hoặc viết mã, hãy thay thế họ tên thật, số điện thoại thật bằng các chuỗi giả lập (ví dụ: Khách hàng A, 0900000000) nếu bạn dùng phiên bản AI công cộng.
* Kiểm tra quyền của Apps Script: Chỉ cấp quyền chạy mã cho những đoạn script do chính bạn kiểm soát logic. Không chạy các đoạn mã chưa rõ nguồn gốc được chia sẻ tràn lan trên mạng.

---

## Các câu hỏi thường gặp (FAQ)

### 1. Tôi có cần biết lập trình JavaScript để dùng cách này không?
Hoàn toàn không. Bạn chỉ cần biết cách sao chép (copy) và dán (paste). Mọi công việc tư duy logic và viết mã phức tạp đã có Gemini lo liệu hoàn toàn dựa trên yêu cầu bằng tiếng Việt của bạn.

![How to Automate Duplicate Customer Removal in Google Sheets Using Gemini Prompts AI Automation Guide](https://picsum.photos/seed/work-mvf6t76x-11-b/1000/550.jpg)

### 2. Số điện thoại của khách hàng có mã vùng quốc tế khác ngoài +84 thì có bị lỗi không?
Trong phần prompt ở trên, tôi đã giới hạn chuẩn hóa về đầu số 0 quen thuộc tại thị trường Việt Nam. Nếu hệ thống của bạn có khách hàng quốc tế, hãy sửa lại yêu cầu trong prompt thành: "Giữ nguyên định dạng quốc tế có dấu cộng và mã vùng, chỉ xóa các ký tự khoảng trắng và dấu chấm".

### 3. File Google Sheets của tôi có hơn 50.000 dòng thì Apps Script có bị treo không giới hạn thời gian không?
Google Apps Script có giới hạn thời gian chạy là 6 phút cho mỗi lần thực thi. Với dữ liệu cực lớn trên 20.000 dòng, bạn nên yêu cầu Gemini viết thêm logic xử lý theo từng lô (batch processing) để tránh lỗi quá thời gian timeout của Google.
