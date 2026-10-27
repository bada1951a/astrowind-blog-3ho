---
title: "Cara Otomatis Kirim Laporan PDF Mingguan dari Google Sheets dengan Apps Script"
description: "Panduan praktis otomatisasi kirim email laporan PDF mingguan dari Google Sheets langsung dari SCBD Jakarta tanpa ribet."
publishDate: 2026-10-20T21:00:00.000Z
image: 'https://picsum.photos/seed/work-mvgbluze-10-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Otomatisasi", "Produktivitas"]
theme: "Pure Titanium Clean"
---

## 1. Situasi Kritis dan Hambatan Kerja Mendesak di Kantor

Jam 8 malam di kawasan bisnis SCBD Jakarta, saya masih terjebak di kantor menyelesaikan rekap data operasional mingguan yang berantakan karena salah rumus. Besok pagi, laporan tersebut harus sudah ada di meja direksi. Masalahnya bukan cuma datanya yang banyak, tapi proses ekspor manual ke PDF lalu melampirkannya ke email setiap minggu benar-benar membuang waktu dan rentan kelupaan. Jika Anda sering mengalami kepanikan lembur akibat tugas repetitif seperti ini, sudah saatnya kita beresin pakai Google Apps Script. 

Mari kita bedah kenapa sistem manual ini sering bikin frustrasi dan bagaimana cara mengotomatisasinya sekali jalan untuk selamanya. ![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbluze-10-b/1000/550.jpg)

## Akar Masalah: Kenapa Kirim Laporan Manual Sering Gagal?

Sebelum masuk ke kodenya, mari kita pahami tiga biang kerok utama yang biasa bikin proses rekap mingguan kantor berantakan:

1. Human Error saat Ekspor PDF: Mengatur orientasi halaman (landscape/portrait), ukuran kertas, dan area cetak secara manual di Google Sheets sering kali hasilnya berantakan saat dibuka bos di ponsel.

2. Keterlambatan Pengiriman: Karena dikerjakan manual, sering kali staf lupa mengirim laporan tepat waktu karena sibuk dengan urusan operasional lain di hari Senin pagi.

3. Format Email yang Tidak Konsisten: Mengetik subjek dan isi email secara manual tiap minggu berisiko salah ketik atau salah melampirkan file versi lama. <div style="border-left: 4px solid #334155; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Catatan Profesional:</strong> Otomatisasi bukan sekadar soal malas, tapi soal meminimalkan celah kesalahan manusia (human error) pada data penting perusahaan.
</div>

---

## Langkah-Langkah Membuat Skrip Otomatisasi PDF Mingguan

Kita tidak butuh aplikasi tambahan yang mahal. Cukup gunakan Google Sheets dan sedikit baris kode Apps Script yang bisa Anda salin langsung.

### Langkah 1: Buka Editor Apps Script
1. Buka file Google Sheets laporan Anda.

2. Di menu atas, klik Ekstensi > Apps Script.

3. Hapus semua kode default yang ada di dalam editor.

### Langkah 2: Masukkan Kode Skrip Otomatis
Salin kode praktis di bawah ini ke dalam editor Apps Script And

**a:**

```javascript
function kirimLaporanMingguan() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Laporan");
  var emailPenerima = "direksi@perusahaan.com";
  var subjek = "Laporan Operasional Mingguan - SCBD Office";
  var pesan = "Halo Bapak/Ibu,\n\nBerikut terlampir laporan operasional mingguan otomatis dari sistem.\n\nSalam,\nTim Operasional";

  // URL ekspor Google Sheets ke PDF dengan format rapi
  var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
  var sheetId = sheet.getSheetId();
  var url = "https://docs.google.com/spreadsheets/d/" + ssId + "/export?";
  
  var exportOptions = {
    exportFormat: "pdf",
    format: "pdf",
    size: "a4",
    portrait: "false", // set true jika ingin portrait
    fitw: "true",
    sheetranges: "

**A1:**G20", // sesuaikan range data Anda
    gid: sheetId
  };

  var urlParameters = [];
  for (var key in exportOptions) {
    urlParameters.push(key + "=" + exportOptions[key]);
  }
  var exportUrl = url + urlParameters.join("&");

  // Ambil token akses untuk otorisasi unduh file
  var response = UrlFetchApp.fetch(exportUrl, {
    headers: {
      "Authorization": "Bearer " +  ScriptApp.getOAuthToken(),
      "MuteHttpExceptions": true
    }
  });

  var blob = response.getBlob().setName("Laporan_Mingguan_" + Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd") + ".pdf");

  // Kirim email dengan lampiran PDF
  GmailApp.sendEmail(emailPenerima, subjek, pesan, {
    attachments: [blob]
  });
}
```

### Langkah 3: Atur Jadwal Otomatis (Trigger)
Supaya Anda tidak perlu klik tombol apa pun setiap mingguny

**a:**
1. Di halaman Apps Script, klik ikon Jam (Pemicu / Triggers) di menu sebelah kiri.

2. Klik tombol Tambah Pemicu di pojok kanan bawah.

3. Pilih fungsi `kirimLaporanMingguan`.

4. Pilih jenis waktu: Berbasis waktu > Pemicu minggu > Pilih hari Senin jam 07:00 - 08:00 pagi.

5. Simpan dan berikan izin akses akun Google Anda. <div style="border-left: 4px solid #334155; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Tips Penting:</strong> Pastikan nama tab sheet di kode (`"Laporan"`) sama persis dengan nama sheet yang ada di file Excel/Google Sheets Anda agar tidak muncul error <em>Sheet not found</em>.
</div>

---

## Tanya Jawab (FAQ)

1. Apakah skrip ini aman untuk data perusahaan yang bersifat rahasia?
Ya, sangat aman karena skrip berjalan di dalam akun ekosistem Google Workspace privat Anda sendiri tanpa melibatkan server pihak ketiga atau aplikasi langganan luar.

2. Bagaimana jika saya ingin mengirim ke beberapa orang sekaligus?
Anda bisa mengubah variabel `emailPenerima` menjadi bentuk array atau memisahkan alamat email dengan koma, contoh: `"bos1@perusahaan.com, bos2@perusahaan.com"`.

3. Kenapa file PDF yang terkirim kadang terpotong halamannya?
Hal ini biasanya karena pengaturan `sheetranges` atau ukuran kolom terlalu lebar. Anda bisa menyesuaikan parameter `sheetranges: "

**A1:**G20"` di dalam kode agar pas dengan area cetak dokumen Anda.
