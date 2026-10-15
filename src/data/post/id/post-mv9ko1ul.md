---
title: "Otomatisasi Kategorisasi Data di Google Sheets Menggunakan Gemini API dan Apps Script"
description: "Panduan praktis menghubungkan Gemini API ke Google Sheets dengan Apps Script untuk kategorisasi data massal tanpa ribet."
publishDate: 2026-10-15T21:00:00.000Z
image: "https://picsum.photos/seed/tech762/1200/630"
category: "Productivity"
tags: ["Google Sheets", "Gemini API", "Apps Script", "Otomatisasi Kantor"]
theme: "Nordic Clean Ice"
---


Jam sudah menunjukkan pukul 21.30 WIB di kawasan bisnis SCBD Jakarta. Di ruang rapat lantai 22 yang mulai sepi, saya terjebak lembur menghadapi tumpukan data feedback pelanggan sebanyak 3.000 baris yang harus dikelompokkan ke dalam kategori produk sebelum rapat direksi esok pagi jam 08.00. Mencoba mengelompokkannya satu per satu secara manual jelas membuat jemputan malam melayang, sementara rumus VLOOKUP atau IF bertingkat sudah menyerah menghadapi variasi bahasa gaul dan typo dari para pelanggan. 

<div style="border-left: 4px solid #0284c7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Catatan Realita Kantor:</strong> Mengandalkan copy-paste manual untuk ribetnya data teks harian di kantor tidak hanya membuang waktu, tapi juga rentan salah kategori yang berujung pada laporan manajemen yang tidak akurat.
</div>

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office262/1000/550)

Saat situasi sudah mendesak, solusinya bukan bekerja lebih lama, melainkan bekerja lebih cerdas dengan memanfaatkan kecerdasan buatan langsung di lembar kerja kita. Mari kita bedah cara menghubungkan Gemini API langsung ke Google Sheets menggunakan Google Apps Script agar tugas kategorisasi massal selesai dalam hitungan menit.

---

### Mengapa Cara Konvensional Sering Gagal?

Sebelum masuk ke solusi kodenya, mari kita pahami tiga hambatan utama yang sering membuat proses kategorisasi teks massal di kantor berantakan:

1. **Variasi Bahasa yang Kompleks:** Pelanggan menulis ulasan dengan singkatan, bahasa slang, atau typo. Rumus teks standar Google Sheets seperti SEARCH atau REGEX tidak cukup pintar untuk memahami konteks makna.
2. **Keterbatasan Add-in Berbayar:** Banyak ekstensi pihak ketiga di Google Workspace Marketplace yang menawarkan fitur AI, namun dibatasi oleh kuota gratis yang sangat ketat atau langganan bulanan yang mahal untuk perusahaan.
3. **Waktu Eksekusi yang Lambat (Timeout):** Memproses ribetnya data dalam jumlah besar sering kali membuat browser atau skrip macet (*script timeout*) jika tidak diatur dalam fungsi <i>batch</i> yang efisien.

---

### Langkah-Langkah Menghubungkan Gemini API ke Google Sheets

Solusi paling bersih dan gratis (menggunakan tier developer Gemini) adalah menulis fungsi kustom (*custom function*) atau tombol eksekusi di Google Apps Script. 

#### Langkah 1: Dapatkan Gemini API Key
1. Kunjungi Google AI Studio (aistudio.google.com).
2. Masuk menggunakan akun Google Anda dan klik tombol **Get API key**.
3. Buat kunci baru dan simpan *string* API key tersebut di tempat aman. Jangan bagikan kunci ini ke sembarang orang.

#### Langkah 2: Pasang Skrip di Google Apps Script
1. Buka Google Sheets rekap data Anda.
2. Pada menu atas, klik **Ekstensi** > **Apps Script**.
3. Hapus semua kode default di editor, lalu salin dan tempel kode bersih di bawah ini:

```javascript
const API_KEY = "MASUKKAN_API_KEY_ANDA_DI_SINI"; // Ganti dengan API key Anda

function categorizeText(text) {
  if (!text) return "";
  
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;
  
  const prompt = `Kategorisasikan teks berikut ke dalam salah satu kategori ini: [Teknis, Pembayaran, Pengiriman, Lainnya]. Jawab hanya dengan nama kategorinya saja tanpa tanda baca tambahan.\n\nTeks: "${text}"`;
  
  const payload = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }]
  };
  
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.candidates && result.candidates[0].content.parts[0].text) {
      return result.candidates[0].content.parts[0].text.trim();
    } else {
      return "Error: Format Respon";
    }
  } catch (error) {
    return "Error: " + error.toString();
  }
}
```

4. Masukkan API Key Anda pada variabel `API_KEY` di baris pertama kode.
5. Klik ikon simpan (floppy disk) di bagian atas editor.

#### Langkah 3: Gunakan Rumus Langsung di Sel Google Sheets
Kembali ke lembar kerja Google Sheets Anda. Anda sekarang bisa menggunakan fungsi buatan tadi layaknya rumus bawaan Excel atau Sheets.

Misalnya, data teks keluhan pelanggan ada di kolom A (dari baris 2 sampai 100). Pada sel B2, ketikkan rumus:

```text
=categorizeText(A2)
```

Tarik rumus tersebut ke bawah untuk memproses ribuan baris data secara otomatis. Gemini akan mengembalikan kategori yang bersih sesuai instruksi *prompt* yang Anda berikan di kode Apps Script.

<div style="border-left: 4px solid #0284c7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Tip Produktivitas:</strong> Untuk data yang sangat besar (di atas 500 baris), disarankan membuat fungsi tombol eksekusi (*onOpen/Button*) yang memproses data menggunakan perulangan array agar menghindari batasan waktu eksekusi *custom function* Google Sheets (30 detik).
</div>

---

### Catatan Penting & Keamanan Data (Expert Warning)

<div style="border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; background-color: rgba(239, 68, 68, 0.05); border-radius: 4px; color: #111827;">
<strong>Perhatian Privasi Perusahaan:</strong> Jangan pernah mengirimkan data sensitif perusahaan seperti NIK, data keuangan pribadi, atau informasi rahasia klien ke API eksternal tanpa persetujuan divisi kepatuhan (compliance) perusahaan Anda. Gunakan data anonim jika diperlukan.
</div>

- **Kuota API:** Perhatikan batas penggunaan (*rate limit*) dari Google AI Studio tier gratis agar skrip Anda tidak berhenti mendadak saat memproses data dalam jumlah masif.
- **Pencadangan (Backup):** Selalu buat salinan (*Make a copy*) file Google Sheets sebelum menjalankan skrip otomatisasi massal untuk menghindari kesalahan timpa data.

---

### Pertanyaan yang Sering Diajukan (FAQ)

**1. Mengapa muncul pesan error "Service invoked too many times" di Google Sheets?**
Ini terjadi karena Google Apps Script mendeteksi terlalu banyak panggilan API dalam waktu singkat secara bersamaan. Solusinya, tambahkan fungsi jeda (`Utilities.sleep(1000)`) di dalam perulangan skrip Anda untuk memberi jeda 1 detik tiap barisnya.

**2. Apakah saya bisa mengubah kategori pilihannya sesuai kebutuhan kantor saya?**
Tentu saja. Anda cukup mengubah teks pada variabel `prompt` di dalam kode Apps Script sesuai dengan kebutuhan klasifikasi departemen Anda, misalnya divisi HR, keuangan, atau operasional.

**3. Apakah metode ini memerlukan biaya langganan?**
Tidak. Gemini API menyediakan tier gratis (*free tier*) dengan kuota harian yang sangat mencukupi untuk kebutuhan otomatisasi tugas administratif harian standar perkantoran.
