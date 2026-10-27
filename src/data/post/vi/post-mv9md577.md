---
title: "Tự động hóa tổng hợp doanh thu hàng tháng bằng Excel Power Query"
description: "Hướng dẫn thực chiến giúp nhân viên văn phòng tại TP.HCM và Hà Nội dẹp bỏ cơn ác mộng copy-paste thủ công, tự động hóa báo cáo doanh số trong tích tắc."
publishDate: 2026-10-15T22:15:00.000Z
image: "https://picsum.photos/seed/tech800/900/600"
category: "Productivity"
tags: ["Excel", "Power Query", "Automation", "Office Tips", "Workflow"]
theme: "Graphite Technical Paper"
---

## 1. Tình huống sự cố khẩn cấp và tắc nghẽn công việc văn phòng

Đồng hồ góc phải màn hình đã điểm 17:30 chiều thứ Sáu tại văn phòng quận 1, TP.HCM. Sếp vừa gửi một tin nhắn ngắn gọn trên nhóm chat công ty: "Em ơi, tổng hợp lại giúp anh số liệu doanh thu tháng này của 12 chi nhánh, định dạng lại bảng rồi gửi trước 18:00 để anh đưa vào họp ban giám đốc nhé." Nhìn vào màn hình lúc này là một "bãi chiến trường" gồm 12 file Excel riêng biệt do các quản lý khu vực gửi lên, mỗi file lại có một kiểu đặt tên cột khác nhau, định dạng ngày tháng lung tung và font chữ lệch chuẩn. Lại một buổi tối nữa phải ở lại công ty gặm bánh mì, căng mắt copy-paste từng dòng dữ liệu và cầu nguyện không gõ nhầm công thức SUM.

Cơn ác mộng thủ công này chắc chắn quá quen thuộc với bất kỳ ai làm nghề tổng hợp số liệu tại các đô thị lớn như Hà Nội hay TP.HCM, nơi áp lực thời gian và tiến độ luôn đè nặng trước mỗi dịp chốt sổ cuối tháng. Nhưng đừng tiếp tục lãng phí tuổi trẻ vào những việc lặp đi lặp lại như vậy nữ

**A.** Hôm nay, tôi sẽ hướng dẫn bạn cách dùng Power Query trong Excel - một "vũ khí bí mật" có sẵn nhưng ít ai tận dụng hết - để tự động hóa toàn bộ quy trình gom nhóm, làm sạch và tổng hợp dữ liệu doanh thu chỉ với một cú nhấp chuột Refresh.

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office300/1000/550)

<div style="border-left: 4px solid #475569; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Góc nhìn thực chiến:</strong> Power Query không yêu cầu bạn phải biết lập trình VBA phức tạp. Đây là công cụ chuẩn hóa dữ liệu trực quan giúp biến quy trình xử lý báo cáo hàng giờ đồng hồ xuống chỉ còn vài giây.
</div>

---

### Nguyên nhân cốt lõi khiến việc tổng hợp báo cáo luôn chậm trễ

Trước khi nhảy vào cách sửa, chúng ta hãy điểm qua 3 lý do chính khiến việc gom số liệu hàng tháng của bạn luôn biến thành thảm họ

**A.** 1. Dữ liệu đầu vào phân mảnh và không đồng nhất: Mỗi chi nhánh gửi lên một file Excel với cấu trúc tùy ý (chi nhánh A dùng cột "Ma_SP", chi nhánh B lại dùng "Mã sản phẩm", chi nhánh C gộp chung Mã và Tên vào một cột).

2. Sai sót do thao tác thủ công (Human Error): Khi copy hàng nghìn dòng dữ liệu từ nhiều file vào một file tổng, việc lệch dòng, sót dữ liệu hay lỗi định dạng ngày tháng (MM/DD/YYYY thành DD/MM/YYYY) rất dễ xảy ra, dẫn đến sai lệch kết quả tài chính.

3. Quy trình "Làm lại từ đầu" mỗi tháng: Tháng này bạn mất 3 tiếng để xử lý xong, thì sang tháng sau, với 12 file mới tương tự, bạn lại phải lặp lại nguyên vẹn từng bước copy-paste đó một cách vô nghĩ

**A.** ---

### Hướng dẫn từng bước: Thiết lập quy trình tự động hóa với Power Query

Để giải quyết triệt để vấn đề này, hãy gom tất cả 12 file báo cáo doanh thu của các chi nhánh vào chung một thư mục trên máy tính (ví dụ đặt tên thư mục là `DoanhThuThang10`). Sau đó, thực hiện theo các bước sau:

#### Bước 1: Kết nối thư mục dữ liệu qua Power Query
1. Mở một file Excel trống mới hoàn toàn để làm file tổng hợp báo cáo.

2. Trên thanh công cụ, chọn Dữ liệu (Data) > Lấy Dữ liệu (Get Data) > Từ Tệp (From File) > Từ Thư mục (From Folder).

3. Trỏ đường dẫn đến thư mục `DoanhThuThang10` chứa các file báo cáo chi nhánh, sau đó nhấn Mở (Open).

#### Bước 2: Gom nhóm và kết hợp file (Combine Files)
1. Trong cửa sổ xem trước hiện ra, thay vì nhấn nút Load trực tiếp, hãy chọn Kết hợp (Combine) > Kết hợp & Chuyển đổi Dữ liệu (Combine & Transform Data).

2. Excel sẽ hiển thị bảng mẫu (Sample File). Chọn sheet chứa dữ liệu doanh thu thực tế của các chi nhánh (ví dụ: Sheet1) rồi nhấn OK.

3. Cửa sổ giao diện chỉnh sửa Power Query Editor sẽ bật lên. Tại đây, bạn sẽ thấy toàn bộ dữ liệu từ các file đã tự động nối đuôi nhau gộp lại thành một bảng lớn duy nhất.

#### Bước 3: Làm sạch và chuẩn hóa dữ liệu
Đây là bước quan trọng nhất để loại bỏ các lỗi định dạng:
* Xóa dòng trống hoặc tiêu đề trùng lặp: Sử dụng tính năng Remove Rows hoặc Remove Top Rows nếu các file chi nhánh có chứa dòng tiêu đề phụ thừa thãi.
* Chuẩn hóa định dạng cột: Nhấp chuột phải vào tiêu đề cột Ngày tháng (Date) hoặc Doanh thu, chọn Kiểu Dữ liệu (Data Type) và đổi sang đúng định dạng *Ngày (Date)* hoặc *Số nguyên (Whole Number)* để tránh lỗi tính toán.
* Lọc bỏ dữ liệu rác: Dùng mũi tên lọc ở tiêu đề cột để bỏ đi các dòng tổng cộng (Total) ở cuối bảng của từng file chi nhánh (vì khi gộp chung, các dòng tổng phụ này sẽ làm sai lệch kết quả tổng cuối cùng).

#### Bước 4: Tải dữ liệu ra bảng tính Excel (Load to)
1. Sau khi đã làm sạch xong xuôi, trên góc trái Power Query Editor, chọn Đóng & Tải (Close & Load) > Đóng & Tải Đến... (Close & Load To...).

2. Chọn Bảng (Table) và chọn vị trí đặt bảng kết quả trên file Excel của bạn, sau đó nhấn OK.

Từ bây giờ, sang tháng sau, bạn chỉ cần thay thế các file dữ liệu mới vào thư mục `DoanhThuThang10` (giữ nguyên tên hoặc cấu trúc file), quay lại file tổng hợp, nhấp chuột phải vào bảng kết quả và chọn Làm mới (Refresh). Toàn bộ quy trình gom nhóm, lọc rác và tính toán sẽ được tự động thực hiện trong chưa đầy 3 giây.

---

### Lưu ý chuyên gia & Cảnh báo an toàn dữ liệu

<div style="border-left: 4px solid #475569; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Cảnh báo bảo mật và vận hành:</strong> 
<ul>
  <li><strong>Tính nhất quán của tên cột:</strong> Power Query ghép nối các file dựa trên tên cột. Hãy thống nhất với các đầu mối chi nhánh giữ nguyên tiêu đề cột (ví dụ: "MaSP", "DoanhThu") xuyên suốt các tháng.</li>
  <li><strong>Đường dẫn file:</strong> Không đổi tên hoặc di chuyển vị trí thư mục nguồn sau khi đã thiết lập liên kết, nếu không Power Query sẽ báo lỗi mất nguồn dữ liệu (Source not found).</li>
</ul>
</div>

---

### Câu hỏi thường gặp (FAQ)

1. Nếu tháng sau có thêm 2 chi nhánh mới gửi file vào thư mục thì Power Query có tự nhận diện không?
Có, hoàn toàn tự động. Power Query quét toàn bộ các file nằm trong thư mục nguồn. Miễn là các file mới có cấu trúc cột tương tự, chúng sẽ tự động được gộp vào bảng tổng khi bạn bấm Refresh.

2. Tôi phải làm sao nếu định dạng ngày tháng giữa các file chi nhánh bị lẫn lộn giữa kiểu Việt Nam (DD/MM/YYYY) và kiểu Mỹ (MM/DD/YYYY)?
Trong Power Query Editor, bạn hãy nhấp vào biểu tượng kiểu dữ liệu ở góc trái tên cột ngày tháng, chọn Sử dụng Địa phương (Using Locale), chọn ngôn ngữ là *English (United States)* hoặc *Vietnamese* cùng định dạng ngày tương ứng để công cụ tự động quy đổi về một chuẩn duy nhất.

3. File báo cáo của tôi có dung lượng rất lớn, dùng Power Query có làm Excel bị đơ không?
Power Query xử lý dữ liệu dựa trên công nghệ nén dữ liệu tiên tiến, chịu tải số lượng dòng lên tới hàng triệu dòng mà không làm file Excel nặng nề như cách dùng hàm VLOOKUP hay SUMIFS truyền thống. Tuy nhiên, bạn nên lọc bỏ bớt các cột không cần thiết ngay trong bước chỉnh sửa để tối ưu hóa tốc độ.
