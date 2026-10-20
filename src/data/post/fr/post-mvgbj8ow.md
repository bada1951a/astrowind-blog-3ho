---
title: "Automatisez vos rapports PDF hebdomadaires Google Sheets avec Apps Script"
description: "Guide pratique pour automatiser l'envoi de vos rapports PDF par e-mail depuis Google Sheets sans passer vos weekends au bureau."
publishDate: 2026-10-20T13:30:00.000Z
image: 'https://picsum.photos/seed/work-mvgbkaw0-4-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automation", "Productivite"]
theme: "Forest Emerald Bio"
---


Il est 17h55 un vendredi au cœur de La Défense, et c'est la panique générale dans l'open space : le tableau de bord des KPIs de la semaine est resté bloqué sur une ancienne version Google Sheets, et le comité de direction s'attend à recevoir son rapport PDF avant 18h00 pile. Pendant que mon collègue s'acharne à exporter manuellement chaque onglet en PDF tout en pestant contre la mise en page qui saute, je me rappelle pourquoi j'ai arrêté de perdre mes vendredis soirs avec des tâches répétitives. 

Si vous en avez assez de copier-coller des données, de générer des PDF à la main et de risquer l'oubli chaque semaine, cet article est votre passeport pour le week-end à l'heure. Voyons comment configurer un petit script Apps Script élégant qui s'occupe de tout, tout seul.

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbkaw0-4-b/1000/550.jpg)

<div style="border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; background-color: rgba(16, 185, 129, 0.08); border-radius: 4px; color: #111827;">
<strong>Objectif gain de temps :</strong> Fini les exportations manuelles. En configurant ce script une seule fois, vos rapports hebdomadaires partiront par e-mail automatiquement chaque vendredi à l'heure de votre choix.
</div>

## Pourquoi vos rapports manuels vous font perdre un temps précieux

Avant de plonger dans le code, analysons pourquoi le processus actuel coince :

1. **L'oubli ou le retard stratégique :** Pris dans une réunion de dernière minute, vous ratez l'horaire d'envoi et votre manager s'interroge sur l'avancement.
2. **La mise en page imprévisible :** Exporter un Google Sheet en PDF de manière native via l'interface génère souvent des coupures de pages hasardeuses sur les graphiques.
3. **La fatigue opérationnelle :** Répéter les mêmes clics (Fichier > Télécharger > Document PDF > Ouvrir Gmail > Joindre le fichier) chaque semaine est une source majeure d'erreurs d'inattention.

---

## Guide pas à pas : Votre premier script d'automatisation PDF

Pas besoin d'être un développeur expert en Silicon Valley pour s'en sortir. Google Sheets intègre un environnement de développement complet basé sur JavaScript : **Apps Script**. Suivez ces étapes pour mettre en place votre robot d'envoi automatique.

### Étape 1 : Ouvrir l'éditeur de script
Dans votre Google Sheets, rendez-vous dans le menu supérieur, puis cliquez sur :
> **Extensions > Apps Script**

### Étape 2 : Coller le code d'automatisation
Effacez tout code par défaut dans l'éditeur et collez le script ci-dessous. Ce script cible une plage spécifique de votre feuille, la convertit proprement en PDF aux dimensions adaptées, et l'envoie à votre liste de diffusion.

```javascript
function envoyerRapportHebdoPDF() {
  var feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");
  var idFre1 = SpreadsheetApp.getActiveSpreadsheet().getId();
  
  // Paramètres d'export PDF (format paysage, ajusté à la page)
  var urlExport = "https://docs.google.com/spreadsheets/d/" + idFre1 + "/export?";
  
  var optionsExport = {
    exportFormat: "pdf",
    format: "pdf",
    size: "A4",
    portrait: "false", // Paysage pour les tableaux larges
    fitw: "true",      // Ajuster à la largeur
    gridlines: "false",
    sheetnames: "false",
    gid: feuille.getSheetId()
  };
  
  var urlParts = [];
  for (var cle in optionsExport) {
    urlParts.push(cle + "=" + optionsExport[cle]);
  }
  var urlExportFinale = urlExport + urlParts.join("&");
  
  // Requête avec authentification OAuth du script
  var reponse = UrlFetchApp.fetch(urlExportFinale, {
    headers: {
      "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
      "MuteHttpExceptions": true
    }
  });
  
  var blobBlob = reponse.getBlob().setName("Rapport_Hebdomadaire_KPIs.pdf");
  
  // Configuration de l'e-mail
  var destinataire = "direction@entreprise.com";
  var sujet = "Rapport Hebdomadaire Automatique - " + Utilities.formatDate(new Date(), "Europe/Paris", "dd/MM/yyyy");
  var corpsMessage = "Bonjour,\n\nVeuillez trouver ci-joint le rapport hebdomadaire généré automatiquement depuis le tableau de bord.\n\nBien cordialement,\nLe Service Ops";
  
  // Envoi de l'e-mail avec la pièce jointe PDF
  GmailApp.sendEmail(destinataire, sujet, corpsMessage, {
    attachments: [blobBlob]
  });
}
```

### Étape 3 : Automatiser l'envoi (Déclencheur)
Pour que ce script s'exécute tout seul sans intervention humaine :
1. Dans l'interface Apps Script, cliquez sur l'icône d'horloge à gauche (**Déclencheurs**).
2. Cliquez sur **Ajouter un déclencheur** en bas à droite.
3. Choisissez la fonction `envoyerRapportHebdoPDF`.
4. Sélectionnez la source de l'événement : **Basé sur le temps**.
5. Choisissez le type de déclencheur : **Par semaine**, puis sélectionnez votre jour (ex: Vendredi) et votre plage horaire (ex: 17h - 18h).
6. Enregistrez et validez les autorisations de compte Google.

<div style="border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; background-color: rgba(16, 185, 129, 0.08); border-radius: 4px; color: #111827;">
<strong>Astuce pro :</strong> Testez toujours votre code en cliquant d'abord sur le bouton "Exécuter" dans l'éditeur Apps Script avant de configurer le déclencheur automatique. Cela vous évitera toute surprise au moment fatidique.
</div>

---

## Précautions d'expert et bonnes pratiques

- **Sécurité des données :** Le script s'exécute avec vos propres droits d'accès. Assurez-vous que les e-mails destinataires saisis dans le code sont corrects pour éviter toute fuite de données financières ou RH confidentielles.
- **Quota d'envoi Gmail :** Google impose des quotas quotidiens sur l'envoi d'e-mails via Apps Script (généralement 100 e-mails/jour pour les comptes gratuits, 1500 pour Google Workspace). Pour un rapport hebdomadaire à un comité, vous êtes largement dans les clous.
- **Gestion des erreurs :** Renommez bien l'onglet source dans le code (`getSheetByName("Dashboard")`) pour qu'il corresponde exactement au nom de votre onglet dans Google Sheets, sous peine d'obtenir une erreur d'exécution.

---

## Foire Aux Questions (FAQ)

**Q1 : Puis-je envoyer le rapport PDF à plusieurs destinataires en même temps ?**
R : Tout à fait. Il vous suffit de remplacer la variable `destinataire` par une chaîne de caractères séparée par des virgules, par exemple : `"manager@entreprise.com, directeur@entreprise.com"`.

**Q2 : Comment modifier l'orientation du PDF (passer du format Portrait au Paysage) ?**
R : Dans l'objet `optionsExport` du script, modifiez la ligne `portrait: "false"` par `portrait: "true"` si vous préférez un format portrait vertical classique.

**Q3 : Que faire si le script m'affiche une erreur d'autorisation lors du premier test ?**
R : C'est un comportement standard de sécurité Google. Cliquez sur "Paramètres avancés", puis sur "Accéder au projet (non sécurisé)" pour autoriser le script à interagir avec votre Google Sheets et votre Gmail.
