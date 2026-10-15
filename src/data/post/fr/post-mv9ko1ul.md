---
title: "Classification automatique de texte dans Google Sheets avec l'API Gemini et Apps Script"
description: "Automatisez la catégorisation de milliers de lignes de texte dans Google Sheets grâce à Apps Script et l'API Gemini sans effort."
publishDate: 2026-10-15T13:30:00.000Z
image: "https://picsum.photos/seed/tech324/1200/630"
category: "Productivity"
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Industrial Blueprint"
---


Il est 17h45 au bureau de La Défense, la pluie tambourine contre les baies vitrées de la tour, et c'est la panique générale. Sur mon écran, un tableau Google Sheets de plus de deux mille lignes de retours clients attend désespérément d'être catégorisé avant la réunion stratégique de demain matin avec la direction. Le filtre automatique ne suffit plus, copier-coller les blocs de texte un par un dans une interface d'IA me prendrait toute la nuit, et mon café est totalement froid. Je ne peux pas passer ma soirée à trier manuellement des commentaires de satisfaction en formulant des étiquettes une à une.

C'est exactement dans ce genre de moment critique que l'on réalise la puissance d'une automatisation bien ficelée. Au lieu de céder au désespoir, j'ai ouvert l'éditeur de scripts. En connectant l'API Gemini directement à Google Sheets via Apps Script, j'ai transformé ce tableau figé en un moteur de classification intelligent capable de traiter l'ensemble du volume en moins de deux minutes.

![AI Productivity & Workflow Automation](https://picsum.photos/seed/office824/1000/550)

<div style="border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Diagnostic Rapide (Style Blueprint) :</strong> Le goulet d'étranglement ne vient pas de votre capacité de travail, mais de l'absence de passerelle directe entre votre tableur et le modèle linguistique. Voici comment structurer cette connexion pour éliminer définitivement la corvée du traitement manuel.
</div>

---

### Pourquoi vos méthodes actuelles bloquent

Avant de plonger dans le code, identifions les trois raisons principales qui font dérailler ce type de tâche répétitive dans un contexte d'entreprise :

1. **La surcharge d'onglets et de formules complexes :** Essayer d'imbriquer des fonctions SI, RECHERCHEV ou des expressions régulières pour deviner le sentiment d'un texte génère des erreurs de syntaxe et ralentit le calcul du tableur.
2. **Le syndrome du copier-coller manuel :** Traiter les données par lots de cinquante dans une interface externe consomme un temps précieux et augmente le risque d'erreurs humaines ou d'oublis.
3. **Les limites des extensions payantes :** De nombreux modules complémentaires pour Google Sheets facturent l'utilisation d'IA au mois ou bloquent l'accès au-delà d'un certain nombre de lignes, alors que l'utilisation directe d'une clé API reste extrêmement économique, voire gratuite pour des volumes standards.

---

### Mise en place pas à pas : De zéro à l'automatisation en 3 étapes

Pour mettre en place ce système, vous aurez besoin de deux éléments : une clé API Gemini (disponible gratuitement sur Google AI Studio) et votre tableau Google Sheets contenant vos données textuelles en colonne A.

#### Étape 1 : Récupérer votre clé API Gemini
Rendez-vous sur Google AI Studio, connectez-vous avec votre compte Google professionnel et générez une nouvelle clé API. Conservez-la précieusement, nous allons l'intégrer de manière sécurisée dans les propriétés du script.

#### Étape 2 : Configurer Google Apps Script
Dans votre Google Sheets, cliquez sur le menu **Extensions**, puis sélectionnez **Apps Script**. Effacez le code par défaut et collez le script ci-dessous :

```javascript
const API_KEY = "VOTRE_CLE_API_GEMINI"; // Remplacez par votre clé
const MODEL_NAME = "gemini-1.5-flash";

function classifierCommentaires() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  // Lecture des données de la colonne A (à partir de la ligne 2)
  const range = sheet.getRange(2, 1, lastRow - 1, 1);
  const values = range.getValues();
  
  const outputValues = [];
  
  for (let i = 0; i < values.length; i++) {
    const texte = values[i][0];
    if (!texte) {
      outputValues.push([""]);
      continue;
    }
    
    // Appel de l'API Gemini pour catégoriser le texte
    const categorie = appelGemini(texte);
    outputValues.push([categorie]);
    
    // Petite pause pour éviter de saturer les limites de requêtes (rate limit)
    Utilities.sleep(500);
  }
  
  // Écriture des résultats dans la colonne B
  const outputRange = sheet.getRange(2, 2, outputValues.length, 1);
  outputRange.setValues(outputValues);
}

function appelGemini(texte) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Classe ce texte client en une seule catégorie parmi ces choix : [Bug technique, Facturation, Demande commerciale, Autre]. Réponds uniquement par le nom de la catégorie.\n\nTexte : "${texte}"`
      }]
    }]
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    if (json.candidates && json.candidates.length > 0) {
      return json.candidates[0].content.parts[0].text.trim();
    } else {
      return "Erreur API";
    }
  } catch (e) {
    return "Erreur technique";
  }
}
```

#### Étape 3 : Créer un bouton de déclenchement rapide
Pour éviter d'avoir à repasser par l'éditeur de code à chaque mise à jour :
1. Dans votre feuille de calcul, allez dans **Insertion > Dessin**.
2. Créez une forme de bouton, nommez-la "Lancer la classification" et enregistrez.
3. Cliquez sur les trois petits points en haut à droite de votre dessin, sélectionnez **Affecter un script**, et écrivez `classifierCommentaires`.
4. En un clic, vos cellules se remplissent automatiquement en direct.

---

### Comparatif des approches de traitement de données

| Critère | Saisie Manuelle / Copier-Coller | Formules Complexes (SI / REGEX) | Script Apps Script + Gemini API |
| :--- | :--- | :--- | :--- |
| **Temps pour 2000 lignes** | Plusieurs heures | Souvent impossible / Instable | Moins de 3 minutes |
| **Flexibilité sémantique** | Faible (fatigue humaine) | Nulle (logique rigide) | Excellente (compréhension du contexte) |
| **Maintenance** | Épuisante | Cauchemardesque à modifier | Simple (modification du prompt) |

<div style="border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Conseil d'expert :</strong> Ne stockez jamais votre clé API en texte brut si votre fichier Google Sheets est partagé avec toute l'entreprise. Utilisez plutôt le service <code>PropertiesService</code> d'Apps Script pour masquer et stocker vos identifiants en toute sécurité.
</div>

---

### Foire Aux Questions (FAQ)

**1. Que faire si le script s'arrête brusquement au milieu du traitement ?**
Google Apps Script impose une limite d'exécution de 6 minutes par script. Si vous traitez plus de cinq mille lignes, il est conseillé d'adapter le code pour enregistrer la progression (index de la dernière ligne traitée) et de relancer le script via un déclencheur temporel si nécessaire.

**2. Comment modifier les catégories cibles proposées par l'IA ?**
Il vous suffit de modifier directement la consigne (le prompt) dans la fonction `appelGemini` du script. Remplacez simplement la liste `[Bug technique, Facturation, Demande commerciale, Autre]` par vos propres axes d'analyse internes.

**3. Mes données confidentielles sont-elles partagées avec Google pour l'entraînement ?**
Lorsque vous utilisez l'API Gemini via les conditions d'utilisation payantes ou de Google AI Studio selon les quotas de niveau payant, vos données professionnelles ne sont pas utilisées pour réentraîner les modèles publics. Vérifiez toujours la politique de confidentialité en vigueur sur votre compte développeur pour les données sensibles d'entreprise.
