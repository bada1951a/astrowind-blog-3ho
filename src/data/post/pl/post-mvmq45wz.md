---
title: "Jak codziennie pobierać ceny konkurencji z Amazon do Google Sheets bez kodowania"
description: "Praktyczny poradnik automatyzacji cen Amazona w warszawskim biurze bez naruszania polityki bezpieczeństwa danych."
publishDate: 2026-10-25T03:45:00.000Z
image: 'https://picsum.photos/seed/work-mvmq5xvo-9-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Automatyzacja", "Amazon", "E-commerce", "No-Code"]
theme: "Warm Coffee Latte"
---

## 1. Kryzys w warszawskim biurze i dylemat z danymi

Siedziałem przy moim biurku w biurowcu niedaleko Ronda Daszyńskiego, popijając drugą dziś latte, gdy kierownik działu sprzedaży rzucił na mój stół pilne zadanie. Do jutrzejszego porannego spotkania zarządu potrzebowaliśmy codziennego monitoringu cen pięćdziesięciu kluczowych produktów naszej konkurencji z serwisu Amazon. Brzmi jak standardowe zadanie analityczne, prawda? Tyle że w tym momencie uderzył mnie mur polityki bezpieczeństwa naszej korporacji. 

Zgodnie z rygorystycznymi unijnymi procedurami RODO oraz wewnętrznymi regulaminami IT, nie mogłem po prostu wrzucić wrażliwych danych klientów ani nawet bezpośrednich linków z zewnętrznych narzędzi szpiegujących do dowolnego generatora AI czy zewnętrznych skryptów pobierających. Z jednej strony naciskał dyrektor sprzedających nam towary, żądając natychmiastowej automatyzacji raportowania cen, z drugiej – inspekcja bezpieczeństwa informatycznego ostrzegała przed ryzykiem wycieku danych i naruszeniem polityki prywatności. Utknąłem w klasycznym rozkroku: jak zautomatyzować codzienne pobieranie cen z Amazona bez pisania kodu i bez łamania wewnętrznych procedur bezpieczeństwa?

<div style="border-left: 4px solid #78350f; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Wskazówka ekspert

A. </strong> Automatyzacja bez kodu (no-code) oparta na wbudowanych funkcjach chmurowych to najbezpieczniejszy sposób na ominięcie restrykcyjnych blokad działu IT, ponieważ nie wymaga instalowania podejrzanych wtyczek ani przekazywania kluczy dostępowych do zewnętrznych serwerów.
</div>

![How to Scrape Amazon Competitor Pricing into Google Sheets Daily Without Writing Code AI Automation Guide](https://picsum.photos/seed/work-mvmq5xvo-9-b/1000/550.jpg)

## 2. Dlaczego tradycyjne metody zawodzą

Zanim znalazłem stabilne rozwiązanie, spędziłem kilka godzin na testowaniu metod, które boleśnie obnażyły swoje ograniczenia w warunkach codziennej pracy biurowej:

1. Ręczne sprawdzanie i kopiowanie:Zespół spędzał codziennie 45 minut na przeklikiwaniu stron Amazona, co nie tylko prowadziło do ludzkich błędów przy wklejaniu, ale przy okazji blokowało naszą sieć firmową z powodu zbyt częstych zapytań wysyłanych z tego samego adresu IP.

2.Standardowe skrypty Python znalezione w sieci:Próba uruchomienia gotowych skryptów pobranych z blogów technologicznych natychmiast wywołała alarm antywirusowy naszego działu IT. Ponadto Amazon regularnie zmienia strukturę kodu HTML swoich stron, przez co skrypty psuły się średnio co trzy dni.

3.Płatne narzędzia zewnętrznosystemowe SaaS:Choć na rynku istnieją dedykowane platformy do monitoringu cen, ich wdrożenie wymagało długich zgód prawnych, audytów bezpieczeństwa i podpisania umów powierzenia przetwarzania danych (DPA), na co w naszym przypadku nie było czasu.

## 3. Instrukcja krok po kroku: Jak skonfigurować automatyczny scraper w Google Sheets

Aby rozwiązać ten problem szybko, elegancko i w pełni bezpiecznie, wykorzystamy potężną, ale często niedocenianą funkcję arkusza Google: formułęIMPORTXML. Nie wymaga ona ani linijki kodu, działa w chmurze bez obciążania Twojego komputera i pozwala na pełną kontrolę nad pobieranymi danymi.

### Krok 1: Przygotowanie bezpiecznej struktury tabeli
Otwórz nowy arkusz w Google Sheets. W pierwszej kolumnie (Kolumna A**) wpisz nazwy produktów, w**Kolumnie Bumieść wewnętrzne, zanonimizowane kody SKU (dzięki czemu spełniamy wymogi polityki bezpieczeństwa), a wKolumnie Cwklej bezpośrednie adresy URL do konkretnych ofert produktów w serwisie Amazon.

### Krok 2: Odnalezienie ścieżki XPath dla ceny
Otwórz stronę produktu na Amazonie w przeglądarce (najlepiej w trybie incognito). Kliknij prawym przyciskiem myszy na cenę produktu i wybierzZbadaj element(Inspect). Zlokalizuj znacznik HTML odpowiadający cenie – zazwyczaj ma on unikalną klasę, na przykład `span class="a-price-whole"`.

### Krok 3: Wpisanie formuły IMPORTXML
W komórceKolumny D(np. komórka D2), w której ma pojawić się automatycznie pobierana cena, wpisz następującą formułę:

```excel
=IMPORTXML(C2; "//span[@class='a-price-whole']")
```

Gdzie `C2` to komórka zawierająca adres URL produktu, a `//span[@class='a-price-whole']` to bezpieczna ścieżka XPath wskazująca dokładnie na wartość numeryczną ceny produktu na stronie Amazon

A. <div style="border-left: 4px solid #78350f; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Ważna uwag

A. </strong> Amazon potrafi dynamicznie zmieniać klasy CSS swoich elementów. Jeśli formuła zwróci błąd `#N/A`, kliknij ponownie "Zbadaj element" na Amazonie i upewnij się, że ścieżka XPath nadal wskazuje na właściwy znacznik ceny.
</div>

### Krok 4: Ustawienie automatycznego odświeżania danych
Arkusz Google automatycznie odświeża formuły zewnętrzne w nieregularnych odstępach czasu. Aby wymusić codzienne pobieranie świeżych cen bez Twojego udziału, możesz przejść do menuPlik > Ustawienia arkusza**, wybrać zakładkę**Obliczenia i zmienić ustawienie "Przeliczanie" na *Zmiana i co minutę* lub *Zmiana i co godzinę*.

## 4. Porady eksperta i zasady bezpieczeństwa

Praca z danymi rynkowymi w środowisku korporacyjnym wymaga zachowania kilku żelaznych zasad, które uchronią Cię przed problemami z działem compliance:

- Stosuj pseudonimizację:Nigdy nie łącz bezpośrednio zewnętrznych danych cenowych z poufnymi danymi operacyjnymi klientów w tym samym arkuszu, jeśli nie jest to absolutnie konieczne.
-Nie przesadzaj z liczbą zapytań:Pobieranie cen dla kilkunastu czy kilkudziesięciu produktów dziennie mieści się w granicach standardowego ruchu użytkownik

A. Masowe pobieranie tysięcy stron na sekundę może sprawić, że Amazon tymczasowo zablokuje adres IP serwerów Google przypisanych do Twojego arkusz

**A. -**Twórz kopie zapasowe: Raz dziennie warto ustawić prosty skrypt Apps Script kopiujący wartości z kolumny cen do kolumny historycznej, aby mieć pewność, że nagła zmiana struktury strony Amazona nie wyczyści nam wczorajszych statystyk.

## 5. Często zadawane pytania (FAQ)

### P: Co zrobić, gdy zamiast ceny w arkuszu pojawia się błąd #N/A lub #REF?
O: Błąd ten najczęściej oznacza, że Amazon zaktualizował strukturę kodu HTML na swojej stronie i ścieżka XPath przestała pasować. Otwórz stronę produktu, sprawdź ponownie klasę elementu ceny za pomocą narzędzia deweloperskiego przeglądarki i zaktualizuj ścieżkę w formule `IMPORTXML`.

### P: Czy korzystanie z formuły IMPORTXML narusza regulamin serwisu Amazon?
O: Funkcja ta pobiera publicznie dostępne dane w sposób zbliżony do standardowego przeglądania strony przez użytkownik

A. Przy umiarkowanej skali zapytań (kilkadziesiąt produktów dziennie) jest to powszechnie stosowana praktyka analityczna w małych i średnich zespołach biznesowych.

### P: Czy mogę w ten sam sposób pobierać ceny z innych platform e-commerce?
O: Tak, funkcja `IMPORTXML` działa uniwersalnie dla większości stron internetowych o strukturze opartej na języku HTML i XML, pod warunkiem, że strona nie blokuje agresywnie zapytań ze skryptów chmurowych i poprawnie zlokalizujesz ścieżkę XPath poszukiwanego elementu.
