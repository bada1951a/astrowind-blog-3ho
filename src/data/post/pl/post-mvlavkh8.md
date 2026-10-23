---
title: "Jak szybko podzielić adres i numer telefonu w Excelu z pomocą ChatGPT"
description: "Poradnik automatyzacji w warszawskim biurowcu: scalanie i czyszczenie 12 plików z zagranicznych oddziałów za pomocą Excela i ChatGPT."
publishDate: 2026-10-24T03:45:00.000Z
image: 'https://picsum.photos/seed/work-mvlax9b3-9-c/1200/675.jpg'
category: 'automation'
tags: ["Excel", "ChatGPT", "Automatyzacja", "Biuro", "Warszawa"]
theme: "Tokyo Neon Violet"
---


Siedziałem w naszym biurze na warszawskiej Woli przed wielkim monitorem, próbując ogarnąć bałagan, który spłynął z zagranicznych oddziałów. Na skrzynce mailowej czekało dokładnie dwanaście plików Excela. Każdy z nich został wygenerowany przez inny system lokalny. W jednym pliku pełny adres i numer telefonu sklejone były w jedną kolumnę w formacie ulica, miasto i telefon wtrącone w nawiasy. W innym pliku formaty daty były rozjechane, a czcionki skakały od Arial po Times New Roman. Do spotkania zarządu zostało niewiele czasu, a próba ręcznego poprawiania tego tysiąca wierszy groziła katastrofą. Trzeba było znaleźć sposób na automatyczne rozdzielenie adresu i numeru telefonu oraz ujednolicenie danych, zanim przełożeni zaczną pytać o raport.

W takich momentach człowiek szybko orientuje się, dlaczego standardowe metody zawodzą. Główne przyczyny tego chaosu to:

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlax9b3-9-b/1000/550.jpg)

1. Różnorodne standardy wprowadzania danych w zagranicznych oddziałach, gdzie każdy kraj stosuje własne nawiasy, spacje i separatory.

2. Sklejone kolumny tekstowe, w których funkcja Tekst jako kolumny gubi się przez zmienną liczbę spacji i brak stałego ogranicznika.

3. Różnice w kodowaniu znaków i czcionkach, które powodują, że polskie znaki lub specyficzne formaty numeryczne zamieniają się w bzdurne znaczki.

Tradycyjne ręczne czyszczenie zajęłoby mi co najmniej kilka godzin monotonnego kopiowania. Zamiast tego postanowiłem wykorzystać ChatGPT jako inteligentnego asystenta do wygenerowania precyzyjnych formuł oraz krótkiego skryptu, który rozwiąże problem w kilka sekund. Oto procedura krok po kroku, którą wdrożyłem na stanowisku pracy.

Krok pierwszy to przygotowanie danych i pobranie ich do wspólnego arkusza. Otworzyłem nowy plik programu Excel, a następnie posłużyłem się wbudowanym narzędziem z zakładki Dane, wybierając opcję pobierania danych z folderu, aby połączyć wszystkie dwanaście plików w jedną spójną tabelę.

Krok drugi polega na ujednoliceniu czcionek i usunięciu śmieciowych formatowań. Zaznaczyłem całą tabelę, w menu Narzędzia główne wyrównałem czcionkę do jednej rodziny, na przykład Calibri w rozmiarze 11, oraz usunąłem formatowania warunkowe, które powodowały migotanie arkusza.

Krok trzeci to wykorzystanie ChatGPT do wygenerowania formuły wyciągającej numer telefonu oraz oddzielającej adres. Ponieważ numery telefonów miały różne prefiksy i długości, napisałem do ChatGPT konkretny prompt w naszym korporacyjnym języku roboczym.

<div style="border-left: 4px solid #8b5cf6; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Prompt dla ChatGPT: Mam w kolumnie A komórki zawierające adres oraz numer telefonu w formacie np. "ul. Marszałkowska 10, Warszawa (tel. +48 123 456 789)". Podaj mi formułę programu Excel, która oddzieli numer telefonu do osobnej kolumny oraz zostawi sam adres w kolumnie głównej.
</div>

ChatGPT błyskawicznie dostarczył rozwiązanie oparte na funkcji REGEXEXTRACT lub złożonej kombinacji funkcji tekstowych, zależnie od wersji Excela, którą posiadasz. Dla uniwersalnego zastosowania w nowoczesnym Excelu najlepiej sprawdziła się formuła oparta na wyszukiwaniu wzorców lub funkcja tekstowa z wycięciem ciągu znaków po fragmencie tel.

```excel
=REGEXTRACT(A2; "\+?[0-9\s\(\)-]{7,}")
```

Jeśli Twoja wersja Excela nie obsługuje jeszcze funkcji opartych na wyrażeniach regularnych, ChatGPT zaproponował niezawodną formułę pomocniczą z użyciem funkcji ZNAJDŹ i FRAG.TEKST:

```excel
=JEŻELI.BŁĄD(FRAG.TEKST(A2; ZNAJDŹ("tel"; A2); DŁ(A2)); "Brak")
```

Wkleiłem powyższe formuły do odpowiednich kolumn, przeciągnąłem je w dół tabeli i w ułamku sekundy cały bałagan z dwunastu różnych arkuszy ułożył się w przejrzystą strukturę. Adresy trafiły na swoje miejsce, numery telefonów zostały wyciągnięte do osobnej kolumny, a format dat został ujednolicony za pomocą szybkiego formatowania niestandardowego.

<div style="border-left: 4px solid #8b5cf6; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Ważna wskazówka eksperta: Zanim zaczniesz masowo przetwarzać dane wrażliwe lub numery telefonów klientów za pomocą zewnętrznych narzędzi AI, upewnij się, że usuwasz lub anonimizujesz poufne informacje identyfikujące osoby fizyczne. Bezpieczeństwo danych w korporacji zawsze stoi na pierwszym miejscu.
</div>

Oto najczęściej zadawane pytania, które mogą pojawić się podczas wdrażania tej metody w Twoim biurze:

Q1. Co zrobić, gdy numery telefonów mają zupełnie inne prefiksy międzynarodowe i spacji w różnych miejscach?

A1. Najlepszym rozwiązaniem jest poproszenie ChatGPT o napisanie krótkiego makra VBA lub skryptu w języku Python, który przeskanuje kolumnę i oczyści ciąg znaków ze wszystkich niedozwolonych znaków oprócz cyfr i plusa.

Q2. Czy ta metoda zadziała na starszych wersjach programu Excel sprzed pakietu Microsoft 365?

A2. Tak, ale zamiast zaawansowanych funkcji dynamicznych będziesz musiał polegać na tradycyjnych kombinacjach funkcji LEWY, PRAWY, ZNAJDŹ oraz FRAG.TEKST, które również bez problemu wygeneruje dla Ciebie sztuczna inteligencja.

Q3. Jak uniknąć błędów kodowania znaków przy scalaniu plików z różnych krajów?

A3. Najlepiej otwierać każdy plik tekstowy lub CSV przez kreator importu danych w Excelu i ręcznie wskazywać kodowanie UTF-8, co całkowicie eliminuje problem krzaków zamiast polskich lub zagranicznych liter.
