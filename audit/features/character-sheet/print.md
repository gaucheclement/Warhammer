# Character Sheet - Mode Impression

## Contexte

Le mode impression/PDF n'est pas implémenté dans V1.

**Objectif prévu** : Générer version imprimable/PDF de la feuille pour usage hors ligne.

**État V1** : Non implémenté

## État Actuel V1

### Fonctionnalités Absentes

- **Export PDF** : Aucun bouton/mécanisme
- **CSS Print** : Aucune règle @media print dans Stylesheet.html
- **window.print()** : Aucun appel dans code
- **Mise en page optimisée** : Interface web non adaptée impression

### Comportement Actuel

**Impression navigateur** : Ctrl+P déclenche impression standard

**Résultat** :
- Conserve navigation/onglets (non souhaité)
- Pas saut de page intelligent
- Tableaux coupés
- Couleurs/bordures non optimisées
- Format peu lisible

**Alternative V1** : Copier/coller manuel sections dans document externe

## Export Foundry (Commenté V1)

**Code présent** : StepResume.html contient randomAction commentée pour export Foundry VTT

**Format** : JSON compatible Foundry VTT

**Mécanisme** : FoundryHelper.fullExport() → Blob JSON → Téléchargement [nom].json

**État** : Code commenté, FoundryHelper absent, non fonctionnel V1

## Fonctionnalités Prévues

### Export PDF

**Bouton** : "Exporter PDF" dans onglet Résumé

**Options** :
- Nom fichier : [Nom].pdf ou [Carrière]_[Nom].pdf
- Format : A4 portrait/paysage
- Sections : Toutes ou sélection

**Technologies** : jsPDF + html2canvas OU service serveur

### CSS Print

**Masquer** : Boutons navigation, onglets, popups

**Optimiser** :
- Marges réduites (1cm)
- Police 10-12pt
- Noir et blanc
- Sauts de page intelligents

**Exemple** :
```css
@media print {
  .validate, .cancel, #tabs ul { display: none; }
  body { font-size: 10pt; color: black; }
  .header table { page-break-inside: avoid; }
}
```

### Mise en Page Optimisée

**Page 1** : Identité + Caractéristiques + Dérivées

**Page 2** : Compétences + Talents

**Page 3** : Équipement (+ Sorts si magique)

**Total** : 3-4 pages A4 portrait

## Implémentation Prévue

### Phase 1 : CSS Print (1-2 jours)

- Ajouter @media print dans Stylesheet
- Masquer navigation/interaction
- Optimiser mise en page
- Tester Ctrl+P navigateur

### Phase 2 : Export PDF (3-5 jours)

- Intégrer jsPDF + html2canvas
- Bouton "Exporter PDF" StepResume
- Capture HTML → PDF
- Téléchargement [Nom].pdf

### Phase 3 : Optimisations (1-2 semaines)

- Template PDF dédié
- Mise en page professionnelle
- Options export (sections, format)
- Aperçu avant export

## Règles Métier

### Contenu Exporté

**Obligatoire** : Identité, Caractéristiques (10 + dérivées), Compétences (advances > 0), Talents (rang > 0)

**Optionnel** : Sorts (si magique), Équipement, Historique XP

### Format Fichier

**Nom** : [Nom].pdf ou [Carrière]_[Nom]_[Date].pdf

**Métadonnées** : Titre (nom), Auteur (Warhammer CharGen), Sujet (Feuille WJRF)

### Sécurité

- Pas données sensibles (données personnage uniquement)
- PDF statique (pas JavaScript embarqué)

## Contournement Actuel

### Impression Sections

1. Ouvrir onglet désiré
2. Copier contenu (Ctrl+A, Ctrl+C)
3. Coller traitement texte
4. Formater manuellement
5. Imprimer/exporter PDF

**Limitation** : Fastidieux, perte formatage, tableaux cassés

### Capture Écran

1. Capturer chaque onglet (Snipping Tool)
2. Assembler images
3. Imprimer

**Limitation** : Qualité basse, non textuel, volumineux

### Export JSON

Sauvegarder personnage (code) → Réimporter ailleurs

**Limitation** : JSON non lisible humain

## Exemples Attendus

### PDF Agitateur (3 pages)

P1: Identité + Caractéristiques | P2: Compétences + Talents | P3: Équipement

### PDF Sorcier (4 pages)

P1: Identité + Caractéristiques | P2: Compétences + Talents | P3: Sorts (Ghur) | P4: Équipement

## Relations

### Dépendances Features

- **character-sheet/identity.md** : Contenu identité
- **character-sheet/characteristics-skills.md** : Contenu stats
- **character-sheet/talents-spells.md** : Contenu talents/sorts
- **character-sheet/equipment.md** : Contenu équipement
- **wizard/resume-export.md** : Export Foundry (commenté V1)

## Voir Aussi

- **wizard/resume-save.md** : Sauvegarde JSON (alternative export)
