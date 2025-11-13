# Résumé - Export et impression

## Vue d'ensemble

Export et impression feuille personnage (partiellement implémenté).

## État actuel

Impression native non implémentée.

Impression navigateur (Ctrl+P) capture écran résumé sans optimisation.

## Fonctionnalités prévues

### Export PDF

Génération PDF feuille complète :
- Toutes sections (Perso, Compétences, Talents, Trappings, Sorts, XP)
- Mise en page A4
- Format texte structuré ou feuille officielle Warhammer

### Impression optimisée

CSS @media print :
- Masque navigation
- Affiche tous onglets séquentiels
- Ajuste marges/polices pour A4
- Gère sauts de page

### Export JSON

Export données structurées personnage.

Format : name, species, career, characteristics, skills, talents, trappings, spells, details, xp.

Usage : Sauvegarde locale, partage, backup.

## Alternatives

Impression sections individuelles, capture écran automatisée (html2canvas + jsPDF), génération serveur.

## Règles métier

Export complet SANS perte : métadonnées, caractéristiques, compétences, talents, trappings, sorts, détails, XP.

Format nom fichier : [Nom_Personnage]_[Date].pdf ou .json.

Export limité personnage courant uniquement (pas données sensibles app).

## Voir aussi

- [resume-display.md](./resume-display.md)
- [resume-save.md](./resume-save.md)
