---
title: "Splitter facilement adresses et téléphones dans Excel avec l'IA"
description: "Guide pratique pour automatiser le découpage des colonnes d'adresses et de téléphones sur Excel en utilisant ChatGPT."
publishDate: 2026-10-24T03:20:00.000Z
image: 'https://picsum.photos/seed/work-mvlawe9p-4-c/1200/675.jpg'
category: 'automation'
tags: ["AI Tools", "Workflow", "Automation", "Office Tips"]
theme: "Cyberpunk Terminal"
---

## 1. Situation d'urgence critique au bureau

Hier après-midi, dans notre open-space du siège à La Défense, l'ambiance était électrique. J'avais confié à ChatGPT et Claude la lourde tâche de nettoyer et structurer un compte-rendu stratégique et des bases de données de contacts pharaoniques pour le comité de direction. Le résultat ? Une catastrophe absolue. Les IA avaient complètement zappé les chiffres clés, mélangé les numéros de téléphone internationaux avec les adresses postales, et généré un résumé fantaisiste qui ne correspondait en rien à nos tableaux Excel. Face à cette montagne de données brutes où tout était collé dans une seule et même cellule, j'ai failli y passer la nuit à faire du copier-coller manuel. C'est là que j'ai compris qu'il fallait arrêter de demander à l'IA de deviner l'impossible, et plutôt exploiter sa puissance logique pour générer des formules de découpage chirurgicales.

Pourquoi nos outils de bureautique et nos assistants IA se prennent-ils les pieds dans le tapis face à des données textuelles non structurées ? 

![How to Auto-Split Address and Phone Number Columns in Excel with ChatGPT Assistance AI Automation Guide](https://picsum.photos/seed/work-mvlawe9p-4-b/1000/550.jpg)

Premièrement, le problème vient de l'absence de délimiteur standard. Dans nos fichiers d'export CRM, les adresses et les numéros de téléphone s'entassent souvent sans espaces logiques ni virgules bien placées, ce qui perturbe l'analyse séquentielle de base. Deuxièmement, les formules Excel natives comme Texte en colonnes s'avèrent inefficaces dès que la longueur des chaînes de caractères varie d'une ligne à l'autre. Enfin, l'utilisation brute de l'IA sans contexte technique précis pousse le modèle à halluciner des structures de données au lieu d'appliquer une règle mathématique ou syntaxique rigoureuse.

Pour résoudre ce problème une bonne fois pour toutes, voici la méthode en trois étapes pour automatiser le nettoyage et le fractionnement de vos colonnes en un temps record.

<div style="border-left: 4px solid #00ffcc; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
ASTUCE TERMINAL : Ne perdez plus une seule minute à coder des macros VBA complexes. Utilisez la syntaxe de prompt ci-dessous pour transformer instantanément votre assistant IA en générateur de formules Excel sur-mesure.
</div>

Étape 1 : Préparer et formuler le prompt exact pour l'IA
Au lieu de demander à ChatGPT de trier les données à notre place, nous allons lui demander de rédiger la formule Excel parfaite. Copiez-collez ce prompt dans votre interface IA :

```text
Agis en expert absolu d'Excel. J'ai une colonne A contenant des adresses postales françaises suivies d'un numéro de téléphone au format international (par exemple : '15 rue de la Paix 75001 Paris +33123456789'). Fournis-moi deux formules Excel distinctes : une pour extraire uniquement l'adresse dans la colonne B, et une autre pour extraire uniquement le numéro de téléphone dans la colonne C. Pas de bavardage, donne-moi directement les formules adaptées aux versions récentes d'Excel.
```

Étape 2 : Implémenter les formules dans votre feuille de calcul
Récupérez les formules générées par l'IA (souvent basées sur des fonctions avancées comme STRTXT, TROUVE ou GAUCHE selon la structure de vos données) et intégrez-les directement dans votre tableau. 
Si le texte est trop complexe, passez par le menu Données > Power Query pour fusionner ou diviser les colonnes de manière visuelle et reproductible pour vos futurs imports mensuels.

Étape 3 : Valider et figer les données
Une fois que vos colonnes sont parfaitement séparées, n'oubliez pas de sélectionner les nouvelles colonnes, de faire un Copier, puis un Collage spécial en tant que "Valeurs". Cela évitera que vos formules ne plantent si vous supprimez la colonne de données brutes initiale.

<div style="border-left: 4px solid #00ffcc; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
AVERTISSEMENT SÉCURITÉ : Veillez à anonymiser ou masquer les données personnelles sensibles (noms, numéros de téléphone directs, adresses privées) avant de les soumettre à des IA publiques, conformément aux directives RGPD de votre entreprise.
</div>

FAQ

Q1. Puis-je utiliser cette méthode si mes données mélangent des formats fixes et des formats aléatoires ?

A1. Oui, mais dans ce cas, il est préférable d'utiliser l'outil Power Query accessible via l'onglet Données > Obtenir des données, qui permet d'ajouter des colonnes conditionnelles basées sur des motifs textuels plutôt que des formules rigides.

Q2. Comment faire si ChatGPT me donne une formule en anglais alors que mon Excel est en français ?

A2. Précisez toujours dans votre prompt initial : "Attention, mon Excel utilise la version française, donne-moi les noms de fonctions en français (ex: NBCAR au lieu de LEN)".

Q3. Que faire si la formule renvoie une erreur #VALEUR ! ?

A3. Cela signifie généralement qu'un caractère recherché (comme le signe + du téléphone ou une virgule) est absent sur certaines lignes. Demandez à l'IA d'intégrer une gestion d'erreur avec la fonction SI.ERREUR dans sa formule.
