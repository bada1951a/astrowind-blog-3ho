---
title: "Xu ly loi VBA Excel va tach cot dia chi so dien thoai voi ChatGPT"
description: "Huong dan xu ly loi macro VBA khi tach dia chi va so dien thoai trong Excel, ket hop ChatGPT de tao cong thuc nhanh chong."
publishDate: 2026-10-24T03:55:00.000Z
image: 'https://picsum.photos/seed/work-mvlaxm2r-11-c/1200/675.jpg'
category: 'automation'
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Dracula Purple Dev"
---


Sang nay tai phong lam việc o tang 12 toa nha van phong trung tam quan 1 TP.HCM, ca nhan toi vua trai qua mot phen hu via. Chi con dung hai tieng nua la den han chot gui bao cao du lieu khach hang cho sep tong, trong khi file Excel tong hop danh sach ca ngan dong lai dang nam hon doan. Nguoi phu trach cu da nghi viec tu tuan truoc va khong de lai bat ky huong dan nao. Thay vi ngoi do cho doi, toi thay co mot nut bam macro ghi chu la "Chuan_Hoa_Du_Lieu" o goc man hinh. Voi chut hy vong mong manh rang no se tu dong tach cot dia chi va so dien thoai giup minh, toi da click ngay vao do.

Ngay lap tuc, mot man hinh xam xi hien len voi dong thong bao loi mau vang choe: Run-time error '1004': Application-defined or object-defined error. Nhan nut Debug, toi hoa mat vi nhung dong ma VBA phuc tap duoc viet tu nhieu nam truoc da bi loi thoi va khong the tuong thich voi phien bản Excel 365 hien tai dang dung. Toan bo du lieu bi treo dung lai, khong the undo va nut lenh thi vo tac dung.

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlaxm2r-11-b/1000/550.jpg)

Vi sao lai xay ra tinh trang do? Duoi day la ba nguyen nhan chinh khien cac file Excel cu thuong xuyen sup do khi thuc hien thao tac tach du lieu:

Thu nhat, ma nguon VBA phu thuoc vao cau truc o nho co dinh cua phien ban Excel cu, khi gap nhung dong du lieu moi co dinh dang dia chi dai hon hoac co chua ky tu dac biet, no se lap tuc bi tran bo nho va phat sinh loi runtime.

Thu hai, du lieu dia chi va so dien thoai tai Viet Nam thuong duoc nhap vao cung mot o ma khong co quy chuan. So dien thoai co the bat dau bang 09, 08, hoac dau +84, co khoang trang hoac dau gach ngang, khien cho cac doan ma lenh cu khong the nhan dien duoc mau de cat chuoi.

Thu ba, thieu su ho tro cua cac cong cu AI hien dai nhu ChatGPT trong viec viet lai ham Excel hoac Power Query, khien nguoi lam van phong phai vat va thao tac thu cong hoac phu thuoc hoan toan vao nhung doan code macro het han su dung.

De cuu nguy cho tinh the nay ma khong can phai la mot chuyen gia lap trinh, chung ta se ap dụng quy trinh ba buoc su dung ChatGPT ket hop voi cac ham chuan trong Excel.

Buoc dau tien, hay thiet lap lai file Excel va sao luu du lieu de tranh mat mat. Mo file Excel len, vao menu Tep, chon Tuy chon de kiem tra lai cac thiet lap macro, sau do dung Power Query hoac ham co ban de xu ly thay vi dung code VBA da hong. Truoc khi lam bat cu dieu gi, hay copy file hien tai ra mot ban sao de phong ho.

Buoc thu hai, su dung prompt cua ChatGPT de tao ra cong thuc tach chuoi thong minh. Hay mo ChatGPT len va sao chep cau lenh mau duoi day de yeu cau AI viet cong thuc phu hop nhat voi mau du lieu cua ban:

```excel
Toi co mot o Excel chua ca dia chi va so dien thoai (vi du: "So 123 Nguyen Hue, Quan 1, TP.HCM - 0901234567"). Hay viet giup toi cong thuc Excel hoac ham Flash Fill de tach rieng phan dia chi ra mot cot va phan so dien thoai ra mot cot rieng biet.
```

Sau khi ChatGPT tra ve ket qua, ban se nhan duoc cac ham rat tien loi nhu TEXTAFTER hoac TEXTBEFORE, hoac tham chi la doan ma Python/VBA da duoc viet lai sach se va khong con loi runtime.

Buoc thu ba, ap dung cong thuc vao bang tinh. Vi du trong Excel 365, ban co the su dung ham sau de lay so dien thoai nam o phia cuoi chuoi sau dau gach ngang:

```excel
=TRIM(RIGHT(SUBSTITUTE(A2, "-", REPT(" ", 100)), 100))
```

<div style="border-left: 4px solid #bd93f9; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Luu y thuc chien: Truoc khi dan cong thuc vao toan bo danh sach hang ngan dong, hay thu nghiem truoc tren 5 dong dau tien de dam bao rang cac so dien thoai co do dai khac nhau (10 hoac 11 so) deu duoc trich xuat chinh xac ma khong bi sot chu so dau tien so 0.
</div>

De dam bảo an toan thong tin va nang cao hieu suat lam viec trong nhung lan sau, ban can ghi nho mot so loi khuyen tu chuyen gia. Tuyet đối khong chay cac doan ma macro khong ro nguon goc tu nhung file do dong nghiep cu de lai ma khong qua kiem tra. Neu bat buoc phai dung VBA, hay nho ChatGPT doc hieu va giai thich tung dong ma truoc khi an chay lenh. Ngoai ra, nen uu tien su dung Power Query trong menu Du lieu cua Excel vi no truc quan, de sua loi hon la viet code VBA phuc tap.

Duoi day la phan giai dap nhung cau hoi thuong gap tu nhung nguoi lam viec van phong khi xu ly tinh huong nay:

Q1. Toi dang dung phien ban Excel cu 2016 thi co dung duoc ham tach chuoi ma ChatGPT cung cap khong?

A1. Cac ham moi nhu TEXTAFTER hay TEXTBEFORE chi co tu phien ban Excel 365 hoac Excel Web. Tuy nhien, ban chi can noi voi ChatGPT rang "Toi dang dung Excel 2016", lap tuc AI se cung cấp giai phap thay the bang cach ket hợp cac ham co dien nhu MID, FIND, va LEN rat hieu qua.

Q2. Khi bam nut Debug cua loi VBA, toi co nen tu sua cac dong code mau do khong?

A2. Neu ban khong co nen tang ve lap trinh VBA, tot nhat khong nen tu sua vi se de gay ra loi he thong nang hon. Hay copy nguyen doan code loi do, dan vao ChatGPT va yeu cau AI tim loi giup hoac chuyen doi no thanh ham Excel thuan tuy.

Q3. So dien thoai trong file cua toi co cai bat dau bang dau +84, co cai co so 0, ChatGPT co xu ly dong thoi duoc khong?

A3. Hoan toan duoc. Ban chi can dua cho ChatGPT 3 dong du lieu mau co dinh dang khac nhau nhat, AI se thiet ke cho ban mot bieu thuc chinh quy hoac mot ham ket hop de chuan hoa tat ca cac so dien thoai ve cung mot dinh dang thong nhat truoc khi tach cot.
