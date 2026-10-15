---
title: "Excel cassé dans le TGV : comment j'ai réparé mon XLOOKUP avec ChatGPT sur mon smartphone"
description: "Panne de formule Excel en route pour Lyon ? Découvrez comment utiliser ChatGPT depuis votre mobile pour corriger vos XLOOKUP et SI imbriqués en un clin d'œil."
publishDate: 2026-10-15T13:30:00.000Z
image: "https://loremflickr.com/1200/630/smartphone,iphone,android,mobile?lock=434"
category: "Mobile"
tags: ["Smartphone", "Excel", "ChatGPT", "Productivite", "Bureautique"]
theme: "Steel Silver Metallic"
---


<div style="border-left: 4px solid #64748b; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>FICHE D'INTERVENTION - SUPPORT NUMÉRIQUE</strong><br>
<strong>Statut :</strong> Incident critique en mobilité<br>
<strong>Symptôme :</strong> Formules Excel corrompues (XLOOKUP / SI imbriqués)<br>
<strong>Lieu :</strong> TGV Paris-Lyon / Ligne 1 du métro parisien
</div>

Il était exactement 8h15, coincé dans une rame de la ligne 1 du métro parisien ultra-bondée à l'approche de La Défense, quand mon tableau de bord financier a décidé de s'effondrer. Un rapport budgétaire crucial pour une réunion client à Lyon s'affichait avec un hideux `#N/A` généralisé. En voulant moderniser mes vieux tableaux avec un `RECHERCHEX` (XLOOKUP) et des `SI` imbriqués à rallonge, j'avais oublié une minuscule parenthèse et inversé une plage de cellules. Impossible de sortir un PC portable sur mes genoux, debout entre deux portes étouffantes. Mes mains tremblaient sur mon écran de smartphone, la batterie affichait 18 %, et le train allait s'élancer de la Gare de Lyon. C'est là que l'application ChatGPT sur mon téléphone m'a sauvé la mise en moins de deux minutes.

![Smartphone Diagnostic & Troubleshooting](https://loremflickr.com/1000/550/screen,battery,gadget,phone?lock=934)

Voici comment j'ai transformé mon smartphone en assistant expert en bureautique pour réparer ce fichu tableur avant d'arriver au bureau.

---

### 📋 Fiche d'identification des symptômes (Diagnostic de panne)

Avant de paniquer, il faut comprendre pourquoi Excel rejette vos formules en bloc. Sur mobile, la saisie tactile n'arrange rien aux erreurs de syntaxe.

<div style="border-left: 4px solid #64748b; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<ul>
  <li><strong>Symptôme 1 : Le XLOOKUP aveugle (#N/A ou #VALEUR!)</strong> - Souvent causé par une plage de recherche qui ne fait pas la même taille que la plage de renvoi, ou par des formats de cellules incompatibles (texte vs nombre).</li>
  <li><strong>Symptôme 2 : L'enfer des SI imbriqués</strong> - Une parenthèse oubliée ou mal fermée dans une formule à 5 niveaux de conditions, provoquant un blocage net d'Excel qui refuse de valider la cellule.</li>
  <li><strong>Symptôme 3 : Le piège de la langue</strong> - Taper des formules en français (`SI`, `RECHERCHEX`) alors que l'application mobile ou le fichier tourne en syntaxe anglaise (`IF`, `XLOOKUP`), ce qui génère des erreurs de nom (`#NOM?`).</li>
</ul>
</div>

---

### 🛠️ Étape par étape : Réparer ses formules avec ChatGPT sur mobile

Inutile de chercher la solution tout seul les yeux rivés sur un écran minuscule dans les transports. Voici la méthode exacte que j'ai appliquée pour corriger mon fichier Excel depuis mon téléphone.

#### Étape 1 : Copier la formule malade sans s'arracher les cheveux
Ouvrez l'application mobile Excel ou Microsoft 365 sur votre smartphone. Sélectionnez la cellule bloquée, touchez l'écran pour afficher la barre de formule, puis faites un appui long pour **copier le texte brut** de la formule récalcitrante. Évitez les captures d'écran si le texte est long : le copier-coller textuel est beaucoup plus rapide et évite les erreurs de lecture de caractères.

#### Étape 2 : Envoyer un prompt ultra-précis à l'application ChatGPT
Ouvrez l'application ChatGPT sur votre téléphone. Ne lui dites pas juste "ça ne marche pas". Donnez-lui le contexte exact en un minimum de mots, parfait pour une saisie rapide sur clavier virtuel :

> "Voici ma formule Excel qui génère une erreur dans mon tableau : `[Collez votre formule ici]`. Je veux chercher une valeur dans une colonne et renvoyer le résultat correspondant, mais Excel m'affiche une erreur. Corrige-la-moi et explique-moi brièvement l'erreur en français."

#### Étape 3 : Appliquer le correctif et tester la syntaxe
ChatGPT va instantanément vous renvoyer la formule corrigée (en faisant attention aux points-virgules `;` typiques de la version française d'Excel ou aux virgules `,` selon votre configuration). 
1. Copiez la formule corrigée depuis ChatGPT.
2. Retournez dans votre application Excel mobile.
3. Collez-la dans la cellule et validez avec la touche coche verte.
4. Si vos données s'affichent correctement, enregistrez immédiatement sur votre cloud (OneDrive ou Google Drive) avant que la connexion 5G ne saute dans le tunnel du RER.

---

### ⚠️ Avertissements et conseils d'expert pour le travail en mobilité

<div style="border-left: 4px solid #64748b; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>PRÉCAUTIONS DE SÉCURITÉ DES DONNÉES</strong><br>
Si vous travaillez sur des données professionnelles sensibles ou nominatives dans le train ou les transports en commun, <strong>ne coller jamais de données personnelles nominatives, de chiffres d'affaires confidentiels ou de mots de passe</strong> dans l'intelligence artificielle. Remplacez les valeurs textuelles par des termes neutres (par exemple, remplacez "Nom du client" par "ClientA", et les montants par "100").
</div>

- **Attention au format des séparateurs :** Excel en version française utilise le point-virgule (`;`) pour séparer les arguments des fonctions, alors que ChatGPT a parfois tendance à proposer des virgules (`,`) par défaut. Si Excel refuse la formule de ChatGPT, remplacez simplement les `,` par des `;`.
- **Sauvegarde cloud obligatoire :** Lorsque vous modifiez un fichier lourd sur mobile en déplacement, assurez-vous que l'enregistrement automatique est bien activé pour éviter de perdre vos modifications en cas de coupure de réseau.

---

### ❓ FAQ - Questions fréquentes (FAQ)

**1. Puis-je utiliser la saisie vocale de mon clavier mobile pour dicter mon problème à ChatGPT ?**
Absolument ! C'est même l'astuce ultime quand on est debout dans un transport bondé et qu'il est difficile de taper de longs textes. Utilisez le micro de votre clavier (iOS ou Gboard) pour dicter votre formule ou expliquer le bug à ChatGPT.

**2. Que faire si ChatGPT me donne une fonction en anglais (`XLOOKUP`) alors que mon Excel est en français (`RECHERCHEX`) ?**
Précisez-le simplement dans votre message suivant : *"Donne-moi la version française de la formule avec des points-virgules"*. ChatGPT s'adaptera instantanément à votre version linguistique d'Office.

**3. Comment éviter que les formules ne se cassent lors du passage du PC au mobile ?**
Utilisez de préférence l'application officielle Microsoft 365 ou Excel connectée à votre compte OneDrive. Les versions de bureau et mobiles gèrent ainsi exactement le même moteur de calcul, ce qui évite les incompatibilités de syntaxe entre différentes versions logicielles.
