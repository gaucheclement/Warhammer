# Table Stars - Documentation

## Vue d'ensemble

Contient 23 signes astrologiques Warhammer (constellations influençant naissance). Chaque signe modifie caractéristiques et peut accorder un talent initial.

**Fichier**: `data/stars.json` (41 KB) - Source: ADE2 p.40-47

## Structure

### Champs clés

| Champ | Type | Description | Exemples |
|-------|------|-------------|----------|
| index | Nombre | ID unique | 0-23 |
| label | Texte | Nom signe | "Wymund l'Anachorète", "La Grande Croix" |
| book/page | Texte/Nombre | Référence source | "ADE2" p.40-47 |
| rand | Nombre | Tirage 1d100 | 5, 10, 15...100 |
| subRand | Texte/Nombre | Sous-tirage Étoile Sorcier | "", 3, 6, 9, 10 |
| characteristics | Texte | Modificateurs caracs | "+2 Sociabilité, -3 Intelligence" |
| talent | Texte | Talent accordé | "Chanceux", "Sixième sens", "" |
| signe | Texte | Titre symbolique | "Signe de l'Endurance" |
| classique | Texte | Nom classique | "Wymenos", "Azurios" |
| ascendant | Texte | Saison/période | "cœur de l'hiver", "printemps" |
| dates | Texte | Calendrier impérial | "12 vorhexen - 27 vorhexen" |
| dieux | Texte | Divinité associée | "Manann", "Ulric", "Ranald" |
| apparence | Texte | Aspect constellation | "un visage sévère", "un dragon cabré" |
| desc | HTML | Description personnalité | Texte formaté |

### Système génération aléatoire

#### Principe pondération
Tirage 1d100, signe = premier où `rand >= valeur_aléatoire`.

**Distribution réelle**:
- 5: Wymund (5%)
- 10: Grande Croix (5%)
- 15-95: autres signes (5% chacun)
- 100: Étoile du Sorcier (5%)

#### Étoile du Sorcier (index 19-22)
Cas spécial: **4 variantes** avec `rand=100` mais `subRand` différent.

**Processus**:
1. Si rand=100 tombé, tirer 1d10
2. Sélectionner variante selon subRand:
   - 1-3: Sixième sens (subRand=3)
   - 4-6: Seconde vue (subRand=6)
   - 7-9: Magie mineure (subRand=9)
   - 10: Sorcier ! (subRand=10)

**Conséquences**: Variantes ont modifications différentes:
- Sixième sens: aucun malus carac
- Seconde vue/Magie mineure: -3 Force
- Sorcier !: -5 Force

### Modificateurs caractéristiques

**Format**: Chaîne parsing "+X Nom, -Y Nom, ..."

**Exemples**:
- "+2 Force, +2 Force Mentale, -3 Initiative"
- "-3 Force Mentale" (uniquement malus)
- "" (vide, aucun modificateur)

**Caractéristiques modifiables**: Capacité de Combat, Capacité de Tir, Force, Endurance, Initiative, Agilité, Dextérité, Intelligence, Force Mentale, Sociabilité

**Parsing nécessaire**: Conversion chaîne → liste éléments avec nom carac + valeur signée

### Talents accordés

**Principe**: Certains signes donnent talent gratuit niveau 1 à la naissance.

**Talents possibles**: Chanceux, Maître artisan (Au choix), Ferveur ardente, Noctambule, Sixième sens, Résistance (Maladie), Affinité avec les animaux, Volonté de fer, Négociateur, Seconde vue, Magie mineure, Sorcier !

**Spécialisations**: "Au choix" → joueur choisit. **Parsing**: Conversion chaîne → référence table talents

## Relations tables

**Directes**: Caractéristiques (parsing modificateurs), Talents (référence nom exact, niveau 1 gratuit), Dieux (influence choix compatibles), Livres (book + page)

**Implicites**: Wizard Step 4 (sélection signe, choix manuel/aléatoire), Caractéristiques finales (signe = 1/4 facteurs: espèce + carrière + signe + jets), Magic talents (Seconde vue/Magie mineure/Sorcier ! → addMagic)

## Cas d'usage métier

### Création personnage - Étape sélection signe

**Options**:
1. Choix manuel: liste 20 signes normaux (index 0-18) + Étoile Sorcier (variantes groupées)
2. Tirage aléatoire: 1d100 puis 1d10 si Étoile Sorcier

**Données affichées**:
- Label + signe symbolique
- Apparence constellation
- Dates calendrier + saison (ascendant)
- Divinité associée
- Bonus/malus caractéristiques
- Talent accordé (si présent)
- Description personnalité

**Application effets**: Parser characteristics → appliquer modificateurs; si talent présent → ajouter niveau 1; enregistrer label signe

**Affichage description**: Format dynamique incluant signe, nom classique, ascendant, dates calendrier, divinité, apparence, bonus/pénalité caractéristiques, talent, desc narrative

**Filtrage saison**: 14 ascendants possibles (hiver, printemps, été, automne + nuances). Interface peut filtrer par période pour immersion

## Points d'attention

### Signe TEST (index 23)
Entrée debug: rand=101 (jamais sélectionnable aléatoirement), bonus extrêmes (+100 toutes caracs). Ne pas afficher en production.

### Signes jumeaux
Certains signes partagent caractéristiques similaires mais descriptions/divinités différentes. Exemples: Wymund/Gnuthus (loyauté/endurance), Flûtiste/Vobist (roublards/incertitude).

### Associations Chaos
"Charrette Brisée" associée Nurgle (rarement évoqué). Description mentionne "lien sombre et primitif", "offrandes inavouables". Sensible contexte RP.

### Talents magiques
4 variantes Étoile Sorcier + talents "Béni" créent 5 voies accès magie dès création. Impacte fortement évolution personnage.

## Validation données

### Contraintes champs obligatoires

| Champ | Contrainte | Validation |
|-------|-----------|------------|
| index | INTEGER PK | 0-23, unique, séquentiel |
| label | VARCHAR(100) | 5-60 car, unique |
| rand | INTEGER | 5-101, incréments 5 (sauf 100) |
| subRand | VARCHAR(10) | "" ou 3,6,9,10 |
| characteristics | TEXT | Format "+X Nom, -Y Nom" parsable |
| talent | VARCHAR(100) | "" ou nom existant talents.json |
| signe | VARCHAR(100) | 10-80 car, commence "Signe de/du/des" |
| classique | VARCHAR(50) | 5-30 car |
| ascendant | VARCHAR(50) | Saison valide (liste 14 valeurs) |
| dates | VARCHAR(100) | Format "DD nom_mois - DD nom_mois" |
| dieux | VARCHAR(200) | Nom(s) dieu(x), parenthèses OK |
| apparence | VARCHAR(200) | 5-100 car |
| desc | TEXT | 100-2000 car, HTML valide, balises `<br>` OK |
| book | VARCHAR(20) | "ADE2" |
| page | INTEGER | 40-47 |

### Règles inter-champs
**R1**: rand=100 → subRand obligatoire | **R2**: talent → existe dans talents.json | **R3**: characteristics → noms existent dans characteristics.json | **R4**: |sum(bonus)| - |sum(malus)| ≤ 5 | **R5**: index=23 → rand=101

### Messages erreur métier
**rand désordonnés**: "Probabilités incohérentes: {label} (rand={rand}) après {label_précédent}"
**talent inexistant**: "Talent {talent} introuvable pour {label}"
**parsing échoue**: "Modificateurs mal formatés pour {label}: {characteristics}"
**subRand manquant**: "Étoile Sorcier {label} nécessite subRand"
**desc vide**: "Description obligatoire pour {label}"
**déséquilibre**: "Déséquilibre bonus/malus {label}: différence {delta} > 5"
