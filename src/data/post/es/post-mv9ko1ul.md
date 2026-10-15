---
title: "Categoriza textos en masa con la API de Gemini y Google Sheets"
description: "Guía práctica para conectar la API de Gemini en Google Sheets mediante Apps Script y automatizar la categorización de miles de filas sin errores."
publishDate: 2026-10-15T14:45:00.000Z
image: "https://picsum.photos/seed/tech397/1200/630"
category: "Productivity"
tags: ["Google Sheets", "Apps Script", "Gemini API", "Automatización", "Productivity"]
theme: "Modern Minimalist Slate"
---


Eran las 11:45 de la mañana en nuestra oficina del Paseo de la Castellana en Madrid. El comité de dirección empezaba a las 12:00 en punto, y sobre la mesa teníamos un Excel con más de 3,500 comentarios de clientes sobre el último lanzamiento. El marrón: nadie los había categorizado. Las fórmulas condicionales y los BUSCARV estaban completamente rotos, la hoja de cálculo se congelaba cada vez que intentábamos aplicar un filtro, y el director general esperaba métricas claras sobre satisfacción y quejas en la pantalla grande. Copiar y pegar manualmente en ChatGPT era una misión suicida por el tiempo y el límite de caracteres. Necesitaba una solución directa, sin rodeos, para automatizar esa masacre de datos en cuestión de minutos.

Si te ha pasado lo mismo, sabes que depender del método manual o de fórmulas obsoletas con bases de datos gigantes es un callejón sin salida. Aquí tienes el sistema exacto para conectar la API de Gemini directamente con Google Sheets usando Apps Script y resolver esto hoy mismo.

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office897/1000/550)

---

### ¿Por qué fallan los métodos tradicionales con grandes volúmenes de texto?

Cuando intentas procesar miles de filas de texto libre en una hoja de cálculo, te encuentras siempre con los mismos muros:

1. **Límites de las fórmulas nativas:** Funciones como `SI` anidadas o expresiones regulares en Sheets se vuelven injeruestionables, lentas y propensas a errores de sintaxis cuando la taxonomía es compleja o ambigua.
2. **Corte manual (Copy-Paste):** Abrir la interfaz web de la IA y pegar bloques de 50 filas destruye tu productividad, genera inconsistencias en las etiquetas y te expone a errores humanos.
3. **Bloqueos de rendimiento (Timeouts):** Las consultas masivas sin un script optimizado saturan la memoria del navegador, provocando que Google Sheets colapse justo cuando más lo necesitas.

---

### El Plan de Acción: Conecta Gemini API con Google Sheets en 4 pasos

Olvídate de extensiones de pago de terceros que cobran suscripciones mensuales absurdas. Vamos a usar Apps Script nativo y la API oficial de Google Gemini.

#### Paso 1: Consigue tu clave de API de Gemini
Entra en Google AI Studio, genera una clave de API gratuita (Gemini API Key) y guárdala en un lugar seguro. No la compartas nunca en repositorios públicos.

#### Paso 2: Configura tu Google Sheet
Prepara tu hoja de cálculo con una estructura limpia:
* Columna A: ID o número de fila.
* Columna B: Texto del cliente (el comentario a categorizar).
* Columna C: Categoría (aquí es donde aparecerá el resultado mágico).

#### Paso 3: Añade el código en Apps Script
En tu Google Sheet, ve al menú superior y selecciona **Extensiones > Apps Script**. Borra cualquier código que aparezca y pega la siguiente función personalizada optimizada:

```javascript
function categorizarConGemini(texto) {
  if (!texto) return "";
  
  const apiKey = "TU_API_KEY_DE_GEMINI"; // Reemplaza con tu clave real
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
  const prompt = "Analiza el siguiente comentario de cliente y asígnale una sola categoría entre estas opciones: [Soporte, Facturación, Producto, Envios]. Devuelve solo el nombre de la categoría sin explicaciones: " + texto;
  
  const payload = {
    "contents": [{
      "parts": [{"text": prompt}]
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
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      return "Error de API";
    }
  } catch (error) {
    return "Error: " + error.message;
  }
}
```

#### Paso 4: Ejecuta la función masiva
Una vez guardado el script, puedes usarlo directamente en tu celda como si fuera una fórmula normal de Excel o Sheets:

`=categorizarConGemini(B2)`

Arrastra la fórmula hacia abajo y observa cómo la IA procesa cada fila de forma autónoma.

<div style="border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Consejo Pro de Rendimiento:</strong> Si tienes más de 500 filas, evita arrastrar la fórmula en masa para no saturar los límites de peticiones por minuto (Rate Limits) de la API gratuita. Es mejor crear una función iterativa en Apps Script que procese bloques de 50 filas con una pequeña pausa (<code>Utilities.sleep(1000)</code>) entre cada lote.
</div>

---

### Advertencia del Especialista

<div style="border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; background-color: rgba(239,68,68,0.05); border-radius: 4px; color: #111827;">
<strong>Privacidad y Datos Sensibles:</strong> Nunca envíes datos personales identificables (PII) de clientes o información financiera altamente confidencial a APIs gratuitas de IA sin revisar las políticas de privacidad y cumplimiento de tu empresa o del RGPD (Reglamento General de Protección de Datos en Europa). Anonimiza los datos antes de ejecutar el script si es necesario.
</div>

---

### Preguntas Frecuentes (FAQ)

**1. ¿Qué pasa si supero el límite gratuito de llamadas a la API de Gemini?**
La capa gratuita de Google AI Studio es bastante generosa para tareas diarias de oficina, pero si procesas decenas de miles de filas al día, la API devolverá un error de cuota excedida (Error 429). En ese caso, puedes activar la facturación por uso (pay-as-you-go) en Google Cloud, cuyos costos por token son extremadamente bajos.

**2. ¿Puedo pedirle que devuelva múltiples columnas o un formato JSON?**
Sí. Modifica el prompt dentro del código de Apps Script para exigir una estructura específica (por ejemplo: "Devuelve categoría y urgencia separados por una coma") y utiliza la función `split()` en JavaScript para dividir el resultado en varias celdas de Google Sheets.

**3. ¿Por qué algunas celdas devuelven "Error de API" de repente?**
Generalmente se debe a un corte temporal de conexión, a que la clave de API está mal escrita, o a que el texto del cliente incluye caracteres especiales que rompen el formato JSON del payload. Asegúrate de sanitizar las comillas y saltos de línea en el texto de entrada antes de enviarlo.
