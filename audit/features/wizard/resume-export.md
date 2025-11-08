# Export et Impression de la Feuille de Personnage

## Contexte

L'écran de résumé devait proposer export et impression de la feuille de personnage. Dans V1, ces fonctionnalités sont partiellement implémentées ou commentées, indiquant une intention future.

## État actuel (V1)

### Export Foundry (commenté)

Code contient fonction randomAction commentée (lignes 57-66 StepResume.html) pour export Foundry VTT :
- Bouton "Export Foundry"
- Génération JSON via FoundryHelper.fullExport(CharGen, character)
- Téléchargement fichier [nom_personnage].json
- Format compatible Foundry VTT Warhammer

Désactivé dans V1 pour simplification ou incompatibilité version.

### Impression native (non implémentée)

Aucune fonction impression directe. Dépend du navigateur :
- Ctrl+P ouvre dialogue impression standard
- Capture écran résumé affiché
- Pas de mise en page optimisée
- Onglets multiples compliquent impression complète

## Fonctionnalités prévues

### Export PDF

**Objectif :** Générer PDF feuille personnage complète.

**Contenu :** Toutes sections (Perso, Compétences/Talents, Possession, Sorts, XP), caractéristiques en-tête, mise en page A4 optimisée.

**Formats possibles :**
1. PDF structuré données textuelles (recherche/modification facile)
2. PDF mimant feuille officielle Warhammer (graphisme complet, cases remplies)

### Impression optimisée

**Objectif :** Améliorer impression navigateur avec CSS print-friendly.

**Optimisations CSS :**
- @media print masque navigation (boutons, menus)
- Force affichage tous onglets séquentiels (pas seulement actif)
- Ajuste polices/marges pour A4
- Gère sauts de page
- Noir et blanc par défaut

**Résultat :** Ctrl+P génère aperçu propre multi-pages, toutes sections visibles, sans éléments UI.

### Export JSON

**Objectif :** Exporter données JSON structuré pour interopérabilité.

**Structure :** name, species, career, characteristics, skills, talents, trappings, spells, details, xp.

**Cas d'usage :** Import autres outils (Roll20, Foundry, Fantasy Grounds), sauvegarde locale, partage, migration V2.

## Intégration Foundry VTT

### Format export

Transformation données vers schéma Foundry :
- Mapping caractéristiques Warhammer → Foundry
- Conversion compétences avec spécialisations
- Adaptation talents avec effets automatisés
- Inclusion trappings avec propriétés armes/armures
- Embedding sorts avec NI et effets

**FoundryHelper.fullExport() :** Fonction commentée V1 génère objet compatible Foundry. Nécessite CharGen et character, retourne JSON selon API Foundry.

### Workflow

1. Clic bouton "Export Foundry"
2. Appel FoundryHelper.fullExport(CharGen, character)
3. Génération blob JSON
4. Création lien téléchargement temporaire
5. Déclenchement download [nom].json
6. Import JSON dans Foundry manuellement

## Alternatives

### Impression sections individuelles

Bouton "Imprimer" par onglet, CSS ciblé, génération PDF section isolée.

### Capture écran automatisée

API Canvas HTML5 (html2canvas + jsPDF) : Rendre sections en images, compiler en PDF, contrôle qualité, fonctionne offline.

### Service impression serveur

Envoi données à backend, génération PDF serveur avec template officiel Warhammer, retour PDF optimisé, permet personnalisation avancée (logos, fonds).

## Relations

### Dépendances

- [resume-display.md](./resume-display.md) : Données à exporter/imprimer
- [resume-save.md](./resume-save.md) : Sauvegarde vs export

### Tables utilisées

Toutes tables personnage : species, careers, careerLevels, characteristics, skills, talents, trappings, spells, lores, gods, stars, details.

## Règles métier

### Contenu export complet

Export DOIT inclure TOUTES données sans perte : Métadonnées (nom, race, carrière), caractéristiques (init + avances + modificateurs), compétences (base + specs + avances), talents (rangs + specs + effets), trappings (équipement + quantités), sorts (liste + domaines), détails (âge, taille, yeux, cheveux, ambitions), XP (totale, dépensée, actuelle, historique).

### Nom fichier

Format : [Nom_Personnage]_[Date].pdf ou .json
- Éviter caractères spéciaux (espaces → underscores)
- Inclure date versioning
- Encodage UTF-8 (accents français)

### Sécurité

Export NE DOIT PAS inclure : Données sensibles app (clés API, tokens), infos autres personnages, données système CharGen. Export limité personnage courant uniquement.

## Exemples Warhammer

**PDF Agitateur Humain :**
- Fichier : Johann_Agitateur_2025-01-15.pdf
- Page 1 : Caractéristiques + Identité
- Page 2 : Compétences + Talents
- Page 3 : Possessions + XP
- Format A4 portrait, N&B, marges 2cm

**JSON Foundry Répurgateur Nain :**
- Fichier : Thorin_Repurgateur.json, ~50 KB
- Contenu : actor type "character", items array (talents, skills, trappings, spells), data (characteristics, details, xp)
- Import Foundry : Glisser-déposer → Acteur créé

**Impression navigateur Sorcier Elfe :**
- Ctrl+P sur résumé
- Problème : Seulement onglet actif imprimé (Perso)
- Onglets Compétences/Talents, Possession, Sorts manquants
- Solution : CSS @media print affiche tous onglets séquentiels

**PDF optimisé Halfling :**
- Template feuille officielle Warhammer
- Cases pré-remplies avec données
- Graphiques (logo, bordures décoratives)
- Résultat professionnel prêt table de jeu

**Export JSON multi-outils :**
- Même JSON importable dans Roll20 (transformation schema), Fantasy Grounds (adapter format .mod), applications mobiles tierces
- Permet portabilité personnage entre plateformes

**Impression sections isolées Prêtre :**
- Impression onglet "Sorts" seul (3 pages sorts Béni détaillés)
- Économie papier vs impression complète
- Utile pour référence rapide en jeu
