---
title: "Automatyzacja raportów w Google Sheets: Jak wysyłać cotygodniowy PDF przez Apps Script"
description: "Poradnik krok po kroku: Jak napisać własny skrypt Apps Script, który automatycznie generuje i wysyła cotygodniowe raporty PDF z Google Sheets."
publishDate: 2026-10-20T19:45:00.000Z
image: 'https://picsum.photos/seed/work-mvgblldk-9-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automatyzacja", "Excel i Biuro"]
theme: "Nordic Clean Ice"
---

## 1. Awaryjna sytuacja i paraliż pracy w biurze

Była dokładnie 16:45 w czwartek, kiedy w naszym biurze w warszawskim centrum biznesowym zapadła cisza przed burzą. Jutro rano zarząd miał otrzymać kluczowy cotygodniowy raport ze sprzedaży i wskaźników KPI. Niestety, arkusz Google Sheets, który miał zasilać te dane, właśnie się zawiesił. Formuły importujące dane z zewnętrznych baz zaczęły sypać błędami typu #REF!, a ręczne przeklikiwanie widoków, eksportowanie do PDF i wysyłanie maili do pięciu dyrektorów miało zająć mi co najmniej dwie godziny monotonnej pracy. 

Zamiast panikować i spędzić wieczór w biurze, postanowiłem wdrożyć rozwiązanie, które od dawna odkładałem na później: prosty skrypt Google Apps Script, który robi całą tę brudną robotę w 5 sekund.

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgblldk-9-b/1000/550.jpg)

<div style="border-left: 4px solid #0284c7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Nordic Clean Tip:</strong> Automatyzacja nie polega na pisaniu tysięcy linijek kodu. Chodzi o to, by raz skonfigurować prosty mechanizm, który uratuje Twój czas w każdy piątkowy poranek.
</div>

---

### Dlaczego ręczne raportowanie to tykająca bomba?

Zanim przejdziemy do kodu, przyjrzyjmy się trzem najczęstszym pułapkom, w które wpadamy przy tradycyjnym obiegu dokumentów:

1. Błędy ludzkie przy eksporcie: Ręczne pobieranie pliku jako PDF często rozjeżdża formatowanie (obcięte kolumny, brzydkie podziały stron).

2. Opóźnienia i zapominalstwo: W wirze spotkań łatwo zapomnieć o kliknięciu "Wyślij" dokładnie w poniedziałek o 8:00 rano.

3. Sztywność danych: Gdy arkusz ma uszkodzone formuły w momencie wysyłki, zarząd otrzymuje puste lub błędne liczby, co niszczy wiarygodność zespołu.

---

### Krok po kroku: Twój własny skrypt automatyzujący PDF

Nawet jeśli nie jesteś programistą, poniższy kod wkleisz i dostosujesz w kilka minut. Otwórz swój arkusz Google Sheets, wybierz z górnego menu Rozszerzenia > Apps Script, skasuj wszystko i wklej poniższy kod.

```javascript
function wyslijRaportPDF() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("RaportTygodniowy"); // Zmień na nazwę swojej zakładki
  
  // Pobierz ID arkusza
  var ssId = spreadsheet.getId();
  var sheetId = sheet.getSheetId();
  
  // Ustawienia eksportu do PDF
  var url = spreadsheet.getUrl().replace(/edit$/, '') + 'export?';
  var exportOptions = {
    exportFormat: 'pdf',
    format: 'pdf',
    size: 'A4',
    portrait: 'false', // Poziomo (true dla pionu)
    fitw: 'true',      // Dopasuj do szerokości strony
    gridlines: 'false',
    gid: sheetId
  };
  
  var payload = [];
  for (var key in exportOptions) {
    payload.push(key + '=' + exportOptions[key]);
  }
  
  var urlOpts = {
    httpsMethod: 'GET',
    headers: {
      'Authorization': 'Bearer ' +  ScriptApp.getOAuthToken(),
      'MuteHttpExceptions': true
    }
  };
  
  var blob = UrlFetchApp.fetch(url + payload.join('&'), urlOpts).getBlob().setName("Raport_Zarzadu_" + Utilities.formatDate(new Date(), "CET", "yyyy-MM-dd") + ".pdf");
  
  // Konfiguracja wiadomości e-mail
  var emailOdbiorcy = "zarzad@twojadomen

A. pl";
  var temat = "Automatyczny Raport Tygodniowy - Google Sheets";
  var tresc = "Dzień dobry,\n\nW załączniku przesyłam aktualny cotygodniowy raport KPI wygenerowany automatycznie.\n\nPozdrowienia,\nZespół Analityczny";
  
  MailApp.sendEmail(emailOdbiorcy, temat, tresc, {
    attachments: [blob]
  });
}
```

#### Jak to skonfigurować w 3 prostych krokach:

1. Dopasuj nazwę arkusz

A. W linijce `var sheet = spreadsheet.getSheetByName("RaportTygodniowy");` wpisz dokładnie taką nazwę, jaką ma Twoja zakładka z raportem w Google Sheets.

2. Wpisz adres odbiorcy: Zmień `"zarzad@twojadomen

A. pl"` na docelowy adres e-mail (lub listę adresów rozdzielonych przecinkami).

3. Autoryzuj skrypt: Kliknij ikonę dysku (Zapisz), a następnie przycisk Uruchom (Run). Google poprosi Cię o uprawnienia do wysyłania maili i odczytu arkusza – przejdź przez standardowy proces autoryzacji (kliknij "Zaawansowane" -> "Przejdź do Bez tytułu (niebezpieczne)").

---

### Jak ustawić automatyczne wysyłanie (Harmonogram)?

Nie chcesz przecież klikać "Uruchom" co tydzień ręcznie. Zautomatyzujmy to:

1. W edytorze Apps Script kliknij ikonę Zegara (Triggers / Wyzwalacze) po lewej stronie.

2. Kliknij Dodaj wyzwalacze w prawym dolnym rogu.

3. Wybierz funkcję `wyslijRaportPDF`.

4. Jako rodzaj źródła zdarzenia wybierz Oparte na czasie.

5. Wybierz Wyzwalacz cotygodniowy i ustaw preferowany dzień oraz godzinę (np. Poniedziałek, 8:00 - 9:00 rano).

6. Zapisz zmiany.

<div style="border-left: 4px solid #0284c7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Ważna wskazówka ekspertow

A. </strong> Pamiętaj, aby przed wysyłką upewnić się, że Twoje formuły odświeżają się poprawnie. Jeśli korzystasz z zewnętrznych zapytań (np. IMPORTDATA czy IMPORTXML), mogą one potrzebować chwili na załadowanie danych przed uruchomieniem skryptu PDF.
</div>

---

### Często zadawane pytania (FAQ)

1. Czy skrypt będzie działał, gdy komputer jest wyłączony?
Tak! Google Apps Script działa w chmurze Google, a nie w Twojej przeglądarce. Kiedy minie wyznaczona godzina, serwery Google uruchomią skrypt automatycznie, nawet przy wyłączonym komputerze.

2. Co zrobić, jeśli wygenerowany PDF jest rozjechany wizualnie?
Parametry w kodzie takie jak `fitw: 'true'` (dopasuj do szerokości) oraz `portrait: 'false'` (układ poziomy) pomagają utrzymać porządek. Najlepiej przetestować kilka kombinacji, zmieniając układ strony w sekcji `exportOptions`.

3. Czy mogę wysyłać ten raport do kilku osób jednocześnie?
Oczywiście. W zmiennej `var emailOdbiorcy` możesz podać kilka adresów e-mail oddzielając je przecinkami, na przykład: `"dyrektor1@firm

A. pl, dyrektor2@firm

A. pl"`.
