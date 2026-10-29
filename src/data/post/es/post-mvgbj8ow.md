---
title: "Automatiza tus reportes en Google Sheets: Envía PDFs semanales sin morir en el intento"
description: "Aprende a programar Apps Script para exportar y enviar por correo reportes semanales en PDF desde Google Sheets de forma automática."
publishDate: 2026-10-20T14:45:00.000Z
image: 'https://picsum.photos/seed/work-mvgbkjxe-5-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automatización", "Productividad"]
theme: "Dark Velvet Obsidian"
---

Eran las 8:45 de la mañana en nuestra oficina de Madrid. El comité de dirección empezaba a las 9:00 y mi bandeja de entrada seguía vacía. El reporte semanal de métricas de conversión, ese que el director comercial exige religiosamente cada lunes sin falta, se había quedado atascado en un bucle de fórmulas rotas tras la última actualización del equipo de operaciones. Minutos antes de entrar a la sala de juntas, sudando frío, tuve que reconstruir a mano un pupurrí de datos dispersos, exportar el PDF a la fuerza y adjuntarlo manualmente con el corazón a mil por hora. 

Juré que no me volvería a pasar. Si dependía de mi memoria y de mis clics manuales, tarde o temprano volvería a fallar frente a los socios. Así fue como decidí automatizar el proceso de punta a punta usando Google Apps Script para que el sistema genere y envíe el PDF exacto a la hora precisa, sin mi intervención.

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbkjxe-5-b/1000/550.jpg)

<div style="border-left: 4px solid #a855f7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Consejo del experto:</strong> No esperes a que falle el próximo informe trimestral. Las tareas repetitivas de copia y pega son la principal fuente de error humano y frustración en entornos corporativos de alta presión.
</div>

---

### Por qué fallan los envíos manuales y qué hay detrás del bloqueo

Antes de saltar al código, analicemos por qué este proceso suele volverse un dolor de cabeza en el día a día:

1. <strong>Dependencia del factor humano:</strong> Si dependes de recordar abrir la hoja de cálculo cada lunes, un día festivo, una baja médica o un simple despiste romperá la cadena de comunicación con los directivos.
2. <strong>Exportaciones manuales inconsistentes:</strong> Al descargar PDFs de forma manual desde el menú Archivo > Descargar, los márgenes, los saltos de página y las áreas de impresión suelen desconfigurarse, dando una apariencia poco profesional.
3. <strong>Falta de manejo de errores en scripts antiguos:</strong> Copiar códigos obsoletos de internet sin entender cómo interactúan los permisos de Google Drive y Gmail suele terminar en fallos de autorización silenciosos donde el correo nunca llega.

---

### Paso a paso: Crea tu propio script de envío automático de PDFs

Vamos directo al grano con una solución limpia, funcional y libre de rodeos técnicos innecesarios. Sigue esta ruta exacta:

#### Paso 1: Configurar el contenedor del script
Abre tu documento en Google Sheets. En el menú superior, navega a <strong>Extensiones > Apps Script</strong>. Se abrirá el editor de código integrado. Borra cualquier línea que aparezca por defecto.

#### Paso 2: Pegar el código de automatización
Copia y pega el siguiente bloque optimizado. Este script toma una pestaña específica de tu hoja, la convierte temporalmente en un archivo PDF con formato limpio y la envía por correo electrónico al destinatario configurado:

```javascript
function enviarReporteSemanalPDF() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ReporteEjecutivo");
  var idHoja = SpreadsheetApp.getActiveSpreadsheet().getId();
  
  // Configuración de parámetros de exportación para PDF limpio
  var url = "https://docs.google.com/spreadsheets/d/" + idHoja + "/export?";
  var opcionesExportacion = {
    exportFormat: "pdf",
    format: "pdf",
    size: "letter",           // Formato carta o A4 según prefieras
    portrait: "false",        // Horizontal para métricas anchas
    fitw: "true",             // Ajustar al ancho de página
    gridlines: "false",       // Ocultar líneas de cuadrícula para mejor estética
    gid: hoja.getSheetId()
  };
  
  var urlPartes = [];
  for (var clave in opcionesExportacion) {
    urlPartes.push(clave + "=" + opcionesExportacion[clave]);
  }
  var urlExportacion = url + urlPartes.join("&");
  
  // Autenticación y descarga del PDF mediante token interno
  var respuesta = UrlFetchApp.fetch(urlExportacion, {
    headers: {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
      "MuteHttpExceptions": true
    }
  });
  
  var blobPDF = respuesta.getBlob().setName("Reporte_Metricas_Semanal.pdf");
  
  // Configuración del correo electrónico
  var destinatario = "direccion@tuempresa.com";
  var asunto = "Reporte Automático de Métricas - Semanal";
  var cuerpo = "Hola,\n\nAdjunto encontrarás el reporte semanal de métricas generado automáticamente desde Google Sheets.\n\nUn saludo,\nAutomatización de Procesos";
  
  GmailApp.sendEmail(destinatario, asunto, cuerpo, {
    attachments: [blobPDF],
    name: "Sistema de Alertas Internas"
  });
}
```

#### Paso 3: Automatizar el disparador (Trigger)
1. En el menú lateral izquierdo del editor de Apps Script, haz clic en el icono de <strong>Reloj</strong> (Activadores).
2. Abajo a la derecha, haz clic en <strong>Añadir activador</strong>.
3. Selecciona la función `enviarReporteSemanalPDF`.
4. Elige el tipo de fuente de eventos: <strong>Basado en el tiempo</strong>.
5. Selecciona el tipo de temporizador: <strong>Basado en la semana</strong> y elige el día y la hora preferidos (por ejemplo, todos los lunes de 8:00 a 9:00). Guarda los cambios y acepta los permisos de cuenta que Google te solicitará por seguridad.

---

### Precauciones de experto y buenas prácticas

<div style="border-left: 4px solid #a855f7; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Aviso de seguridad:</strong> Asegúrate de que las cuentas que ejecutan el script tengan acceso exclusivo a los datos sensibles. Los tokens de OAuth otorgan permisos amplios sobre tus archivos de Drive, por lo que nunca utilices scripts de fuentes desconocidas.
</div>

* <strong>Control de versiones:</strong> Antes de modificar hojas principales con scripts activos, haz una copia de respaldo (<strong>Archivo > Hacer una copia</strong>). Una coma mal puesta en el código puede alterar temporalmente las llamadas de funciones.
* <strong>Nombres de pestañas exactos:</strong> Si cambias el nombre de la pestaña `"ReporteEjecutivo"` en tu Google Sheets, recuerda actualizarlo también en la primera línea del script o el sistema arrojará un error de referencia nula.

---

### Preguntas frecuentes (FAQ)

<strong>¿Por qué el correo llega sin el archivo adjunto o da error de permisos?</strong>
Generalmente ocurre porque la primera vez que ejecutas el script no completaste el flujo de autorización de Google. Ve al editor, ejecuta la función manualmente una vez haciendo clic en el botón de "Ejecutar" y acepta los permisos de seguridad en la ventana emergente.

<strong>¿Puedo enviar el PDF a varios destinatarios al mismo tiempo?</strong>
Sí. Solo debes modificar la variable del destinatario separando los correos con comas dentro de un string, por ejemplo: `var destinatario = "socio1@empresa.com, socio2@empresa.com";`.

<strong>¿Cómo puedo ajustar el PDF para que salga en formato vertical en lugar de horizontal?</strong>
En el objeto de configuración del script, cambia el parámetro `portrait: "false"` por `portrait: "true"`. Asimismo, puedes cambiar `size: "letter"` por `size: "A4"` según los estándares de impresión de tu oficina.
