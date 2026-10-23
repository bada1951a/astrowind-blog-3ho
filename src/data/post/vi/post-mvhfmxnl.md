---
title: "Du doan ton kho quy toi bang AI truc tiep tren Excel khong can biet lap trinh"
description: "Huong dan su dung AI de du doan nhu cau ton kho quy toi ngay trong Excel cho nhan vien van phong TP.HCM va Ha Noi truoc gio tan ca."
publishDate: 2026-10-21T22:15:00.000Z
image: 'https://picsum.photos/seed/work-mvhfprc8-11-c/1200/675.jpg'
category: 'automation'
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Deep Indigo System"
---


Dong ho goc phai man hinh vua diem 17:15, chi con 45 phut nua la den gio tan ca chieu thu Sau tai van phong quan 1, TP.HCM. Sep tong vua nhan tin vao nhom Zalo yeu cau nop gap bang du doan ton kho cho quy toi truoc khi buoi hop giao banthu Hai bat dau. Nhin vao file Excel chua 5.000 dong du lieu ban hang tu dau nam den nay, dau oc toi trong rong. Neu ngoi loay hoay dung ham FORECAST hay xu ly thu cong tung ma san pham nhu moi khi, chac chan toi phai o lai cong ty den toi mi mieu va bo lo buoi hen an toi da hua voi gia dinh. 

Truoc day, de lam duoc mot ban du bao nhu cau ton kho cho ca mot quy, toi thuong phai ngoi xuat du lieu tu phan mem ban hang, copy sang Excel, sau do dung cac ham thong ke phuc tap hoac nho doi ngũ IT viet script rieng. Vua mat thoi gian, vua de mac loi tham chieu vung du lieu (#REF!), lai vua khong dam chac chan so lieu co chinh xac hay khong vi su bien dong cua thi truong truoc tet va sau tet rat kho luong.

![How to Use AI to Predict Next Quarter Inventory Needs Directly in Excel Spreadsheets AI Automation Guide](https://picsum.photos/seed/work-mvhfprc8-11-b/1000/550.jpg)

Rat may, sau nhieu lan "chet duoi" vi deadline chieu thu Sau, toi da tim ra mot quy trinh thuc chien giup tich hop thang AI truc tiep vao Excel de xu ly bai toan nay chi trong vong 10 phut. Duoi day la toan bo bi quyet giup ban thoat khoi canh ngoi cay cuoc so lieu thu cong.

<div style="border-left: 4px solid #4338ca; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Luu y he thong (Deep Indigo System):</strong> Quy trinh nay tap trung vao viec loai bo cac thao tac copy-paste thu cong thua thai giua cac phan mem khac nhau, giu cho du lieu tap trung duy nhat tren mot trang tinh Excel duy nhat co ho tro AI.
</div>

---

### Phan 1: Giai ma 3 nguyen nhan khien viec du doan ton kho luong qua tai

Truoc khi ap dung giai phap AI, hay diem qua tai sao viec du doan ton kho trong Excel lai luong thoi gian va gay ra nhieu buc doc den vay:

1. Du lieu tho bi phan manh: So lieu ban hang, nhap kho va ton kho nam o ba sheet khac nhau, dinh dang ngay thang khong dong nhat (ngay/thang/nam vs thang/ngay/nam), khien ham thong ke bi loi lien tuc.

2. Su phu thuoc vao ham thong ke co dien: Cac ham nhu FORECAST hay TREND trong Excel chi dua tren du lieu tuyen tinh don thuan, khong phan tich duoc yeu cau thoi vu, xu huong thi truong dot bien trong quy toi.

3. Thieu cong cu ho tro thong minh truc tiep: Hau het moi nguoi thuong mo mot trinh duyet rieng, copy du lieu, dan vao mot chatbot AI ben ngoai, sau do nhan duoc cau tra loi dang van ban va lai phai go thu cong tung con so vao Excel. Day la mot vong lap gay lang phí thoi gian nghiem trong.

---

### Phan 2: Cac buoc thiet lap AI du doan ton kho truc tiep trong Excel

De giai quyet triet de van de nay, chung ta se su dung tinh nang tich hop AI (nhu Microsoft Copilot trong Excel hoac cac Add-in AI chinh thong duoc phep su dung trong doanh nghiep) de bien trang tinh cua ban thanh mot co may du bao thong minh.

#### buoc 1: Chuan hoa nhanh cau truc du lieu bang Power Query
Truoc khi goi AI, ban phai dam bao du lieu dau vao khong bi rac. 
* Mo file Excel chua du lieu ton kho.
* Chon vung du lieu ban hang, vao tab Du lieu (Data) > Chon Tu bang/vung (From Table/Range) de mo giao dien Power Query.
* Su dung tinh nang thay the loi (Replace Errors) va xoa cac dong trong. Nhan Dong va Tai (Close & Load) de dua du lieu ve mot sheet sach se, chuan hoa.

#### buoc 2: Su dung Prompt AI de tao cot du doan ton kho
Thay vi tu viet cong thuc tinh toan phuc tap cho tung ma hang, hay su dung tro ly AI tich hop ngay trong Excel (hoac thanh ben Copilot):
* Mo thanh cong cu AI trong Excel cua ban.
* Su dung cau lenh (Prompt) ro rang, cu the bang tieng Viet khong dau hoac co dau (tuy giao dien ho tro) de tranh hieu nham:
  > "Phan tich du lieu ban hang 3 thang gan day o cot C va D. Dua tren xu huong tang truong trung binh 10-15% cho quy toi, hay tao mot cot moi du doan so luong ton kho toi thieu can nhap cho tung ma san pham vao o E2."
* Nhan Enter va cho AI tu dong dien so lieu hang loat cho hang ngan dong san pham chi trong vai giay.

#### buoc 3: Kiem tra va hinh thuc hoa ket qua
* Sau khi AI tra ve ket qua tai cot du doan, hay su dung Dinh dang co dieu kien (Conditional Formatting) de to mau do cho nhung mat hang co nguy co thieu hut ton kho (so luong ton du kien nho hon 10).
* Dieu nay giup ban ngay lap tuc nhin ra nhung diem nong can uu tien xu ly truoc khi gui bao cao cho cap tren.

<div style="border-left: 4px solid #4338ca; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Meo thuc chien:</strong> Luon luon thiet lap mot cot kiem tra sai so (Variance Check) bang cach so sanh du bao cua AI voi thuc te thang truoc do de dieu chinh lai trong so prompt cho cac lan chay tiep theo.
</div>

---

### Phan 3: Loi khuyen tu chuyen gia va nguyen tac an toan du lieu

Khi su dung AI de xu ly du lieu noi bo cua cong ty, ban tuyet doi phai ghi nho cac nguyen tac sau de tranh rủi ro bao mat:

* Kiem tra chinh sach bao mat thong tin (Data Privacy): Chi su dung cac cong cu AI da duoc ban lanh dao hoac phong IT cong ty phe duyệt (vi du: ban quyen Microsoft Copilot doanh nghiep). Tuyet đối khong copy du lieu tai chinh nhạy cảm dua len cac nen tang AI mien phi troi noi tren mang.
* Luon luon sao luu file goc (Backup): Truoc khi chay bat ky cau lenh tu dong hoac macro AI nao lam thay doi hang loat du lieu, hay luu mot ban sao (Save As) vao thu muc khac de phong truong hop ket qua tra ve khong nhu y muon.
* Xem lai bang mat (Human-in-the-loop): AI la cong cu ho tro cuc ky manh me giup ban tiet kiem 80% thoi gian, nhung quyet dinh cuoi cung van thuoc ve su danh gia tinh hinh thuc te cua ban. Hay luot qua cac ma hang gia tri cao de dam bao con so hop ly.

---

### Cac cau hoi thuong gap (FAQ)

Q1: Neu cong ty toi chua mua ban quyen Microsoft Copilot thi co cach nao dung AI trong Excel khong?
Co. Ban co the su dung cac Add-in AI uy tin tren Office Add-ins Store (nhu ChatGPT for Excel) hoac xuat du lieu ra file CSV, sau do dung giao diện web cua AI de phan tich, sau do dung ham VLOOKUP hoac XLOOKUP de nap lai vao Excel. Tuy nhien, cach nay se nhieu buoc hon mot chut so voi viec tich hop truc tiep.

Q2: Lam sao de ngan AI dua ra nhung con so du doan qua phi thuc te hoac bi ao tuong (AI hallucination)?
Bí quyet nam o viec cung cấp bo khung rang buoc trong cau lenh prompt. Thay vi chi noi "du doan ton kho", ban hay yeu cau: "Hay du doan dua tren muc tang truong thuc te tu 5% den 15%, tuyet doi khong vuot qua nguon ngan sach ton kho toi da la 500 trieu VND". Su rang buoc nay giup AI bam sat vao thuc te kinh doanh.

Q3: Cach xu ly loi gi khi AI tra ve ket qua dinh dang sai hoac bi loi font tieng Viet trong Excel?
Loi font thuong xay ra do ma hoa ky tu giua file Excel va cong cu AI khong tuong thich (Unicode vs VNVC). Ban hay chuyen toan bo dinh dang cot du lieu sang kieu Text hoac General truoc khi chay lenh, hoac yeu cau AI xuat ket qua duoi dang ma so/ky tu chuan khong dau neu can thiet de de xu ly.
