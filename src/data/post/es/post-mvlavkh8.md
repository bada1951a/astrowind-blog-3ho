---
title: "Como separar direcciones y telefonos en Excel usando ChatGPT"
description: "Aprende a separar columnas revueltas de datos de clientes en Excel de forma rapida con ayuda de ChatGPT sin romperte la cabeza."
publishDate: 2026-10-24T03:25:00.000Z
image: 'https://picsum.photos/seed/work-mvlawk0m-5-c/1200/675.jpg'
category: 'automation'
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Solarized Amber Warm"
---


Ayer por la tarde, en plena oficina corporativa en Madrid, monte un grafico de monitorizacion automatizada de precios de la competencia usando un rastreador web sin codigo. Todo iba sobre ruedas hasta que la pagina cambio de estructura de repente, rompiendo el scraper y vomitando una autentica montanya de datos en una sola celda de Excel. Me encontre con quinientas filas donde la direccion postal, el codigo postal y el numero de telefono aparecian mezclados en un bloque ilegible. El comite directivo esperaba el informe de precios listo para la primera hora del dia siguiente, y hacerlo a mano celda por celda habria significado pasar toda la noche en vela pegado al teclado.

Intentar arreglar aquello con las funciones clasicas de texto de Excel fue una pesadilla inmediata. Como cada proveedor escribia la direccion de forma diferente, las funciones de extraccion de caracteres se saltaban de linea o cortaban los numeros de telefono a la mitad. Despues de perder una hora intentando adivinar formulas anidadas larguisimas que solo devolvian errores de sintaxis, decidi dejar de pelearme con la hoja de calculo de la forma tradicional y usar ChatGPT como mi asistente personal de formulas y expresiones regulares.

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlawk0m-5-b/1000/550.jpg)

<div style="border-left: 4px solid #d97706; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Nota rapida de productivdad: Nunca pierdas mas de diez minutos intentando resolver una formula de texto compleja de manera manual. Si los datos no siguen un patron fijo, la inteligencia artificial puede escribir la formula exacta en segundos si le das un buen ejemplo.
</div>

### Por que se rompen las extracciones de datos en Excel

1. Falta de delimitadores estandarizados: Los datos extraidos de la web suelen venir sin separadores limpios como comas o puntos y comas, mezclando espacios simples entre palabras y numeros.

2. Variabilidad en los formatos de telefono: Los numeros fijos y moviles nacionales e internacionales tienen distinta longitud, lo que confunde a las funciones de busqueda estandar.

3. Direcciones con longitud irregular: Algunas lineas incluyen el piso y la puerta mientras que otras solo tienen la calle, impidiendo usar posiciones fijas de caracteres.

### Guia paso a paso para resolverlo con ChatGPT y Excel

El truco no consiste en pedirle a la inteligencia artificial que te devuelva toda la tabla limpia, sino en pedirle que genere una formula dinamica o una funcion personalizada que tu puedas copiar y pegar en tu archivo.

Paso 1: Copia una pequena muestra representativa de tus datos desordenados, asegurandote de incluir tres o cuatro filas con formatos totalmente distintos.

Paso 2: Abre ChatGPT y utiliza un mensaje muy especifico que defina claramente el origen y el resultado deseado. Por ejemplo, puedes usar este texto base:

```text
Tengo una celda en Excel con una direccion y un telefono mezclados, por ejemplo: "Calle Alcala 45, 2D 28014 Madrid 600123456". Necesito extraer unicamente el numero de telefono en una columna y la direccion postal limpia en otra. Dame las formulas exactas para Excel en espanol usando funciones de texto o expresiones regulares si es necesario.
```

Paso 3: Copia la formula que te proporcione el asistente. Ve a tu hoja de Excel, selecciona la celda de destino y pegala ajustando las referencias de celdas segun corresponda, por ejemplo cambiando A1 por la celda real donde tienes el texto bruto.

Paso 4: Arrastra la formula hacia abajo en toda la columna para procesar cientos de filas en menos de un segundo. Si alguna fila falla por un caso muy extrano, pidele a ChatGPT un ajuste especifico para ese patron anomalo.

<div style="border-left: 4px solid #d97706; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
Consejo de seguridad corporativa: Si trabajas con datos sensibles de clientes o informacion confidencial de la empresa, anonimiza los datos de muestra antes de pegarlos en herramientas de inteligencia artificial externas.
</div>

### Preguntas frecuentes

Q1. ¿Puedo hacer esto mismo si mi Excel esta en ingles en lugar de espanol?

A1. Si, solo debes indicarle explicitamente a ChatGPT que te devuelva las formulas usando los nombres de funciones en ingles, como LEFT, RIGHT, MID o FIND, para que coincidan con tu configuracion regional.

Q2. ¿Que hago si la formula me devuelve un error de tipo #VALOR o #NOMBRE?

A2. Generalmente ocurre porque alguna version antigua de Excel no soporta funciones modernas como TEXTBEFORE o TEXTAFTER. Pidele a ChatGPT que te cree una solucion alternativa usando combinaciones de EXTRAE, HALLAR y LARGO.

Q3. ¿Es seguro usar ChatGPT para limpiar bases de datos grandes de la empresa?

A3. Para datos publicos o informacion anonimizada de precios de la competencia no hay problema. Para datos personales protegidos por normativa de privacidad, utiliza versiones empresariales que garanticen que tus datos no se usan para entrenar modelos publicos.
