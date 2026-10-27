---
title: "Jak szybko usunąć duplikaty klientów w Google Sheets za pomocą Gemini"
description: "Awaria raportu dla zarządu? Zobacz, jak w kilka sekund uporządkować bazę klientów w Google Sheets, wykorzystując prompty Gemini."
publishDate: 2026-10-19T19:45:00.000Z
image: 'https://picsum.photos/seed/work-mvf6sp61-9-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Gemini", "Automatyzacja", "Biuro"]
theme: "Graphite Technical Paper"
---

## 1. Awaryjna sytuacja i paraliż pracy w biurze

Siedziałem w szklanej sali konferencyjnej w warszawskim centrum biznesowym, a na moim zegarku wybiła 16:45. Za piętnaście minut miałem wysłać ostateczny raport sprzedażowy do zarządu. Otwieram główny arkusz Google Sheets i nagle widzę czerwoną, pulsującą apokalipsę: formuła wyszukiwania duplikatów całkowicie się sypła, pokazując tysiące przemieszanych wierszy z powtarzającymi się adresami e-mail klientów i literówkami w nazwach firm („Jan Kowalski sp. z o.o.” kontra „Jan Kowalski Sp z o.o.”). Standardowa funkcja usuwania duplikatów w Google Sheets polegająca na dopasowaniu dokładnego tekstu była bezużyteczna, bo dane były brudne. Zbliżał się zawał serc

**A.** W tym artykule pokażę Ci, jak uratowałem ten raport za pomocą sztucznej inteligencji i jak Ty też możesz zautomatyzować ten proces bez pisania skomplikowanych skryptów Apps Script.

## Dlaczego standardowe metody zawodzą? Analiza problemu

Kiedy w bazie danych gromadzimy leady z różnych źródeł (formularze na stronie, importy z LinkedIn, ręczne wpisy handlowców), standardowe narzędzia do czyszczenia danych często zawodzą. 

<div style="border-left: 4px solid #475569; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Główne przyczyny błędów w arkuszach:</strong>
<br>1. Różnice w wielkości liter i zbędne spacje („Warszawa ” zamiast „Warszawa”).
<br>2. Literówki i warianty nazw firm (np. „Orlen S.

**A.** ” vs „Polski Koncern Naftowy ORLEN”).
<br>3. Zduplikowane wpisy z różnych kolumn, których zwykły filtr Google Sheets nie potrafi inteligentnie połączyć.
</div>

Próby ręcznego filtrowania i sortowania po kolumnach zajęłyby mi kolejne godziny. Potrzebowałem czegoś, co zrozumie kontekst biznesowy moich danych. Z pomocą przyszło narzędzie Gemini zintegrowane z ekosystemem Google.

---

## Krok po kroku: Jak użyć Gemini do oczyszczenia bazy klientów

Zamiast tracić czas na manualne usuwanie, wykorzystajmy Gemini jako inteligentnego asystenta analitycznego, który wygeneruje dla nas gotową formułę lub skrypt oczyszczający.

### Krok 1: Przygotowanie danych i eksport zakresu
Zaznacz problematyczny obszar w Google Sheets (np. kolumny od A do E zawierające imię, nazwisko, e-mail i nazwę firmy). Skopiuj ten wycinek danych (nie musisz kopiować tysięcy wierszy, wystarczy próbka z nagłówkami).

### Krok 2: Użycie precyzyjnego promptu dla Gemini
Otwórz Gemini i wklej swoje dane wraz z konkretnym poleceniem (promptem). Unikaj ogólników – bądź precyzyjny w opisie tego, co chcesz osiągnąć.

> Sprawdzony prompt do skopiowani

**A.** > „Mam poniższy zestaw danych klientów z Google Sheets. Zawiera on duplikaty spowodowane literówkami, różnicami w wielkości liter oraz dodatkowymi spacjami w kolumnach z nazwami firm i e-mailami. Napisz mi zaawansowaną formułę Google Sheets (lub krótki skrypt Apps Script), która pozwoli mi zidentyfikować i usunąć te duplikaty, traktując adres e-mail jako klucz główny, a nazwy firm normalizując. Oto moje dane: [Wklej dane]”

### Krok 3: Wdrożenie rozwiązania w Google Sheets
Gemini błyskawicznie przeanalizuje strukturę i poda Ci rozwiązanie. Jeśli zaproponuje formułę opartą na `REGEXREPLACE`, `TRIM` i `UNIQUE`:
1. Wklej nową formułę pomocniczą do pustej kolumny obok swoich danych.

2. Przeciągnij ją w dół.

3. Gdy kolumna pomocnicza uporządkuje dane, zaznacz ją, wybierz Edycja > Kopiuj, a następnie Edycja > Wklej specjalne > Wklej tylko wartości.

4. Teraz w menu górnym wejdź w Dane > Oczyszczanie danych > Usuń duplikaty.

Problem rozwiązany w niecałe 3 minuty. Raport poszedł do zarządu na czas, a ja mogłem odetchnąć z ulgą.

---

## Ostrzeżenie ekspert

**A.** Bezpieczeństwo danych klientów (RODO)

<div style="border-left: 4px solid #475569; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Ważna uwaga dotycząca prywatności:</strong>
<br>Nigdy nie wklejaj do publicznych wersji modeli AI poufnych danych osobowych (PII) swoich klientów, takich jak numery PESEL, pełne adresy zamieszkania czy numery kart kredytowych, chyba że Twoja firma korzysta z korporacyjnej, bezpiecznej wersji Gemini (np. Gemini Workspace z gwarancją ochrony danych). Przed wysłaniem danych do AI zawsze anonimizuj nazwa klientów (np. zamieniając je na „Klient A”, „Klient B”).
</div>

---

## Często zadawane pytania (FAQ)

### 1. Czy muszę płacić za Gemini, żeby to zadziałało?
Nie. Do podstawowego oczyszczania danych i generowania prostych skryptów w zupełności wystarczy darmowa wersja Gemini lub panel boczny zintegrowany z Workspace (jeśli Twoja organizacja ma wykupioną odpowiednią licencję).

![How to Automate Duplicate Customer Removal in Google Sheets Using Gemini Prompts AI Automation Guide](https://picsum.photos/seed/work-mvf6sp61-9-b/1000/550.jpg)

### 2. Co zrobić, jeśli Gemini wygeneruje formułę, która zwraca błąd #ARG!?
Błędy typu `#ARG!` lub `#NAZWA?` najczęściej wynikają z różnic w ustawieniach językowych Google Sheets. Angielskie nazwy funkcji (np. `VLOOKUP`, `TRIM`) mogą wymagać polskiego odpowiednika (`WYSULAJ.PIONOWO`, `USUŃ.ZBĘDNE.SPACJE`). Poproś Gemini w kolejnym oświadczeniu: *"Przetłumacz tę formułę na polską wersję językową Google Sheets"*.

### 3. Czy mogę zautomatyzować ten proces na stałe?
Tak. Zamiast za każdym razem pytać AI od nowa, poproś Gemini o napisanie gotowego skryptu Google Apps Script. Następnie wklej go w Google Sheets pod zakładką Rozszerzenia > Apps Script. Stworzysz w ten sposób własny przycisk „Oczyść bazę”, który wykona całą pracę jednym kliknięciem.
