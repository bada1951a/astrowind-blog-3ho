---
title: "Jak połączyć API Gemini z Google Sheets: Masowa kategoryzacja tekstów"
description: "Ratunek przed awarią raportu w warszawskim biurowcu. Zobacz, jak zautomatyzować kategoryzację tekstów w Google Sheets przy użyciu API Gemini i Apps Script."
publishDate: 2026-10-15T19:45:00.000Z
image: "https://picsum.photos/seed/tech689/1200/630"
category: "Productivity"
tags: ["Google Sheets", "Gemini API", "Apps Script", "Automatyzacja", "AI Tools"]
theme: "Rosewood Hardware Guide"
---


Była dokładnie 16:45, a ja siedziałem w szklanym biurowcu w centrum Warszawy, patrząc z przerażeniem na arkusz Google Sheets zawierający trzy tysiące nieposortowanych opinii klientów. Zarząd zażądał kompleksowego raportu nastrojów i kategoryzacji zgłoszeń na jutrzejsze spotkanie zarządu o 9:00 rano. Standardowe formuły warunkowe i zagnieżdżone funkcje wyszukiwania rozsypały się całkowicie pod napływem specyficznego slangu branżowego i literówek. Ręczne przepisywanie tego przez całą noc oznaczało wizję zimnej pizzy i utratę zdrowia. Wtedy przypomniałem sobie o swoim tajnym planie awaryjnym: połączeniu Google Sheets bezpośrednio z API Gemini przez prosty skrypt Apps Script.

<div style="border-left: 4px solid #be123c; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Sytuacja kryzysowa:</strong> Tysiące wierszy surowego tekstu, brak czasu na ręczne tagowanie i zawieszające się standardowe formuły arkuszowe. Czas na rozwiązanie oparte na sztucznej inteligencji, które wykona całą pracę w kilka minut.
</div>

## Gdzie leży problem? Dlaczego tradycyjne metody zawodzą?

Zanim przejdziemy do naprawy sytuacji, warto zrozumieć, dlaczego standardowe podejście do masowej analizy tekstów w arkuszach rzadko się sprawdza:

1. **Sztywność reguł tekstowych:** Formuły takie jak `JEŻELI` czy `SZUKAJ.TEKST` wymagają dokładnego dopasowania słów kluczowych. W prawdziwym świecie klienci robią błędy ortograficzne i używają synonimów, których arkusz nie rozpozna.
2. **Ograniczenia wydajnościowe:** Zagnieżdżanie dziesiątek warunków drastycznie spowalnia działanie pliku Google Sheets, prowadząc do błędów przekroczenia limitu czasu wykonania skryptu.
3. **Brak kontekstu semantycznego:** Tradycyjne metody nie potrafią odróżnić ironii od rzeczywistej pochwały, co fałszuje końcowe wyniki raportu dla zarządu.

---

## Krok po kroku: Jak wpiąć Gemini API do Google Sheets

Całą operację przeprowadzimy bez instalowania zewnętrznych, płatnych wtyczek. Wykorzystamy darmowe środowisko Google Apps Script oraz oficjalny klucz API od Google.

### Krok 1: Uzyskanie klucza API Gemini
Wejdź do Google AI Studio, zaloguj się swoim kontem Google i wygeneruj nowy klucz API dla modelu Gemini. Skopiuj go i zachowaj w bezpiecznym miejscu – będzie nam potrzebny za moment.

### Krok 2: Otworzenie Edytora Skryptów w Arkuszu
W swoim pliku Google Sheets z danymi kliknij w górnym menu:
`Rozszerzenia` > `Apps Script`. 

Usuń domyślny kod i wklej poniższy skrypt niestandardowej funkcji, która wyśle tekst do Gemini i zwróci kategorię:

```javascript
function ANALIZUJ_AI(tekst) {
  if (!tekst) return "";
  
  const apiKey = "TUTAJ_WKLEJ_SWÓJ_KLUCZ_API";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
  const payload = {
    "contents": [{
      "parts": [{
        "text": "Sklasyfikuj poniższą opinię klienta do jednej z kategorii: [Techniczne, Finansowe, Obsługa, Inne]. Zwróć WYŁĄCZNIE nazwę kategorii bez dodatkowego tekstu: " + tekst
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
    const data = JSON.parse(response.getContentText());
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    return "Błąd: " + error.toString();
  }
}
```

### Krok 3: Użycie nowej funkcji w arkuszu
Wróć do swojego arkusza Google Sheets. W kolumnie obok komórki z tekstem (np. załóżmy, że tekst jest w komórce `A2`) wpisz nową formułę:

`=ANALIZUJ_AI(A2)`

Przeciągnij formułę w dół dla pozostałych wierszy. Gemini błyskawicznie przetworzy dane, zwracając czyste kategorie gotowe do wygenerowania wykresów przestawnych.

<div style="border-left: 4px solid #be123c; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Wskazówka eksperta:</strong> Przy bardzo dużych plikach (ponad 500 wierszy) zalecamy przetwarzanie danych partiami lub dopisanie prostego warunku sprawdzającego, czy komórka wynikowa nie jest już uzupełniona, aby uniknąć ponownego odpytywania API przy każdym odświeżeniu arkusza.
</div>

---

## Często zadawane pytania (FAQ)

### 1. Czy korzystanie z Gemini API w Google Sheets jest darmowe?
Google oferuje hojny darmowy pakiet (tzw. Free Tier) dla deweloperów korzystających z Google AI Studio, który w zupełności wystarcza do codziennych zastosowań biurowych i przetwarzania kilku tysięcy zapytań miesięcznie.



![AI Productivity & Workflow Automation](https://picsum.photos/seed/office189/1000/550)

### 2. Co zrobić, gdy skrypt zwraca błąd przekroczenia limitu czasu?
Darmowe API posiada limity zapytań na minutę (RPM). Jeśli przetwarzasz ogromną bazę danych, dodaj funkcję opóźnienia (`Utilities.sleep(1000)`) w pętli skryptu lub podziel arkusz na mniejsze części.

### 3. Czy moje dane firmowe są bezpieczne?
Korzystając z darmowego klucza API w Google AI Studio, pamiętaj, że dane mogą być wykorzystywane do trenowania modeli. W przypadku wrażliwych danych korporacyjnych zaleca się korzystanie z płatnej wersji Vertex AI, która gwarantuje pełną poufność i zgodność z polityką RODO.
