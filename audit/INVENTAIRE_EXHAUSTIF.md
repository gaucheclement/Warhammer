# INVENTAIRE EXHAUSTIF - Application Warhammer V1

**Date**: 2025-11-07
**Objectif**: Audit complet pour migration V1→V2
**Status**: 15 tickets initiaux → **ESTIMATION 280-350 TICKETS RÉELS**

---

## RÉSUMÉ EXÉCUTIF

### Volumétrie Totale
- **Code**: ~14,500 lignes (Code.js 1,872 + HTML 12,600)
- **Données**: 24 tables JSON (3.2 MB)
- **Fichiers**: 49 HTML + 1 JS + 24 JSON

### Estimation par Domaine

| # | Domaine | Complexité | Tickets |
|---|---------|------------|---------|
| 1 | Tables de Données (24) | ★★★★★ | 70-85 |
| 2 | Wizard Création (10 steps) | ★★★★★ | 50-65 |
| 3 | Gestion Personnages | ★★★★☆ | 28-35 |
| 4 | Système Avancement | ★★★★☆ | 12-15 |
| 5 | Système Magie | ★★★☆☆ | 10-13 |
| 6 | Système Équipement | ★★★☆☆ | 10-14 |
| 7 | Administration/Édition | ★★★☆☆ | 12-15 |
| 8 | Recherche/Navigation | ★★★☆☆ | 15-20 |
| 9 | Import/Export Foundry | ★★★★☆ | 10-14 |
| 10 | Utilitaires/Helpers | ★★★☆☆ | 22-28 |
| 11 | Règles Métier | ★★★★★ | 30-40 |
| 12 | Infrastructure GAS | ★★★☆☆ | 15-20 |
| **TOTAL** | | | **284-364** |

---

## 1. TABLES DE DONNÉES (70-85 tickets)

### 1.1 Tables COMPLEXES (7 tables, 40-50 tickets)


#### SPECIES (78 KB) - 7 tickets
- Schema & Relations (refChar, refCareer, refDetail)
- Logique génération aléatoire (rand)
- Parsing skills/talents ("ou", "Au choix", "X aléatoire")
- Calculs détails physiques (âge, taille formules)
- Migration descriptions HTML
- Tests cohérence
- Validation données

#### CAREERS (216 KB) - 8 tickets
- Schema & Relations (class, rand par espèce)
- Filtrage carrières par espèce
- Filtrage par région (Middenheim, Nordland, etc.)
- Pondération aléatoire (rand object)
- Lien avec careerLevels (1-4 niveaux)
- Migration descriptions
- Tests cohérence
- Validation

#### CAREER_LEVELS (198 KB) - 8 tickets
- Schema & Relations (careerLabel → careers)
- 4 niveaux par carrière (Bronze/Silver/Gold)
- Parsing avances caractéristiques ("+5 CC, +10 E")
- Parsing lists skills/talents/trappings
- Accumulation avantages par niveau
- Calcul coût XP progression
- Tests cohérence
- Validation

#### TALENTS (123 KB) - 9 tickets
- Schema & Relations (addSkill, addMagic, addCharacteristic, addTalent)
- Gestion rangs multiples (max formule)
- Gestion spécialisations (specs)
- Talents débloquant autres talents
- Talents modifiant caractéristiques
- Talents ajoutant compétences/magie
- Application effets talents
- Tests cohérence
- Validation

#### SPELLS (276 KB - plus grosse table) - 5 tickets
- Schema & Relations (lore, book)
- CN, range, target, duration
- Migration descriptions HTML longues
- Filtrage par domaine magie
- Validation

#### SKILLS (56 KB) - 5 tickets
- Schema & Relations (char → characteristics)
- Basic vs Advanced
- Gestion spécialisations
- Avances (0-100+)
- Validation

#### TRAPPINGS (149 KB) - 6 tickets
- Schema & Relations (properties → qualities)
- Encombrement (enc)
- Prix (format complexe)
- Disponibilité (availability)
- Catégorisation (armes/armures/divers)
- Validation

### 1.2 Tables MOYENNES (12 tables, 25-30 tickets)

- LORES (82 KB): 3-4 tickets
- CREATURES (80 KB): 3-4 tickets
- TREES (61 KB): 2-3 tickets
- GODS (51 KB): 2-3 tickets
- TRAITS (41 KB): 2-3 tickets
- STARS (26 KB): 2 tickets
- MAGICKS (25 KB): 2-3 tickets
- DETAILS (22 KB): 2 tickets
- QUALITIES (15 KB): 2 tickets
- ETATS (12 KB): 2 tickets
- CHARACTERISTICS (12 KB): 3-4 tickets
- PSYCHOLOGIES (8 KB): 2 tickets

### 1.3 Tables SIMPLES (5 tables, 5 tickets)

- BOOKS (39 KB): 1 ticket
- CLASSES (4 KB): 1 ticket
- EYES (2.6 KB): 1 ticket
- HAIRS (2.6 KB): 1 ticket

---

## 2. WIZARD CRÉATION PERSONNAGE (50-65 tickets)

### Steps Analysés (CharacterGenerator.html)


#### STEP 0: SPECIES (StepSpecies.html) - 5 tickets
- Sélection espèce/région
- Génération aléatoire pondérée
- Application caractéristiques base
- Affichage détails espèce
- Tests

#### STEP 1: CAREERS (StepCareers.html) - 6 tickets
- Sélection carrière compatible espèce
- Filtrage par classe
- Génération aléatoire
- Sélection niveau initial
- Gestion carrières multiples
- Tests

#### STEP 2: CHARACTERISTICS (StepCharacteristics.html) - 7 tickets
- Affichage carac base
- Jet 2d10 variables
- Ajout bonus carrière
- Saisie manuelle/aléatoire
- Calcul totaux & bonus
- Validation
- Tests

#### STEP 3: STARS (StepStars.html) - 2 tickets
- Sélection signe astrologique
- Tests

#### STEP 4: TALENTS (StepTalents.html) - 8 tickets
- Affichage talents espèce/carrière
- Sélection talents à choix
- Sélection talents aléatoires
- Gestion spécialisations
- Gestion rangs multiples
- Application effets
- Validation pré-requis
- Tests

#### STEP 5: SKILLS (StepSkills.html) - 8 tickets
- Affichage compétences sources multiples
- Gestion spécialisations
- Sélection à choix
- Gestion avances
- Calcul valeurs finales
- Groupement
- Validation
- Tests

#### STEP 6: TRAPPINGS (StepTrappings.html) - 6 tickets
- Affichage équipement carrière
- Sélection à choix
- Ajout manuel
- Calcul encombrement
- Organisation
- Tests

#### STEP 7: DETAIL (StepDetail.html) - 5 tickets
- Âge/taille (formules)
- Couleurs (tables 2d10)
- Nom/ambitions
- Dieu patron
- Tests

#### STEP 8: EXPERIENCE création (StepExperience.html) - 7 tickets
- Définition XP disponible
- Dépense XP caractéristiques
- Dépense XP compétences
- Dépense XP talents
- Historique dépenses
- Validation
- Tests

#### STEP 9: RESUME (StepResume.html) - 5 tickets
- Récapitulatif complet
- Vérification cohérence
- Calculs dérivés (mouvement, blessures)
- Export/print
- Tests

#### STEP 10: EXPERIENCE final (mode 'final') - 4 tickets
- Gestion XP post-création
- Avancement
- Validation
- Tests

---

## 3. GESTION PERSONNAGES (28-35 tickets)

### 3.1 Modèle Personnage (Character.html - 925 lignes) - 15 tickets

**Structure données**:
- mode, stepIndex, specie, careerLevel
- characteristics[], skills[], talents[], spells[]
- trappings[], details[], god, star, magic
- xp{max, log, used, tmp_used}
- randomState{...}

**Méthodes critiques**:
- setSpecie/getSpecie (2)
- setCareerLevel/getCareerLevel (2)
- Gestion characteristics (2)
- Gestion skills (addSkills, getSkills) (2)
- Gestion talents (addTalents, getTalents, applyTalent) (3)
- Gestion spells (1)
- save/load (2)
- deleteEmpty, calculs dérivés (1)

### 3.2 Sauvegarde/Chargement - 5 tickets
- Google Sheets (feuille Save)
- LocalStorage
- Export JSON
- Import JSON
- Gestion multiples personnages

### 3.3 Feuille Personnage - 6 tickets
- Affichage complet
- Mode impression
- Calculs automatiques
- Mise à jour temps réel
- Formatage
- Tests

### 3.4 Édition Personnage - 9 tickets
- Modification caractéristiques
- Ajout/suppression compétences
- Ajout/suppression talents
- Ajout/suppression sorts
- Gestion équipement
- Historique XP
- Progression carrière
- Validation
- Tests

---

## 4-12. AUTRES DOMAINES (résumé)

### 4. AVANCEMENT (12-15 tickets)
- Calcul coûts XP (carac/skills/talents/spells)
- Historique dépenses
- Restrictions carrière
- Changement carrière
- Validation/Tests

### 5. MAGIE (10-13 tickets)
- Domaines (Arcane/Divine/Chaos)
- Apprentissage sorts
- Restrictions/pré-requis
- Coût XP
- Tests

### 6. ÉQUIPEMENT (10-14 tickets)
- Inventaire (quantités, catégories)
- Armes (dégâts, allonge, qualités)
- Armures (PA par zone, qualités)
- Calcul encombrement
- Tests

### 7. ADMINISTRATION (12-15 tickets)
- Interface admin (Admin.html)
- Édition données (EditHelper.html)
- Contenu personnalisé
- Validation/sauvegarde
- Tests

### 8. RECHERCHE/NAVIGATION (15-20 tickets)
- Glossaire (Glossaire.html)
- Descriptions (DescriptionHelper.html - CRITIQUE)
- Recherche globale
- Filtres/tri
- Liens inter-entités
- Tests

### 9. IMPORT/EXPORT (10-14 tickets)
- Export Foundry VTT (FoundryHelper.html)
- Mapping IDs
- Export JSON
- Import JSON
- Validation
- Tests

### 10. UTILITAIRES (22-28 tickets)
- Helper.html (1,696 lignes!)
  - Dés virtuels (3)
  - UI (showPopin, ajaxLoader, etc.) (5)
  - Manipulation données (4)
  - Calculs (getSkills, getTalents) (4)
  - Navigation (3)
- DataHelper/DataFunctions (5)
- Menu/Navigation (4)

### 11. RÈGLES MÉTIER (30-40 tickets)
- Génération aléatoire (5-6)
- Parsing & validation (8-10)
- Calculs jeu (carac, skills, combat, magie) (7-9)
- Restrictions/conditions (6-8)
- Application effets talents (5-7)
- Tests (3-5)

### 12. INFRASTRUCTURE (15-20 tickets)
- Google Apps Script (Code.js) (8-10)
- Google Sheets integration (4-5)
- Tests/debug (3-4)
- UI framework (jQuery, styles) (2-3)

---

## PLAN DE MIGRATION RECOMMANDÉ

### PHASE 1: Tables Critiques (30 tickets, 2-3 semaines)
1. Species (7)
2. Careers (8)
3. CareerLevels (8)
4. Talents (7)

### PHASE 2: Wizard Essentiel (40 tickets, 3-4 semaines)
1. Steps 0-2: Species/Careers/Characteristics (18)
2. Steps 4-5: Talents/Skills (16)
3. Step 8: Experience (6)

### PHASE 3: Tables Moyennes (35 tickets, 2-3 semaines)
1. Skills (5)
2. Spells (5)
3. Trappings (6)
4. Lores, Characteristics, Creatures, etc. (19)

### PHASE 4: Gestion Personnages (35 tickets, 3 semaines)
1. Modèle Character complet (15)
2. Sauvegarde/chargement (5)
3. Feuille personnage (6)
4. Édition (9)

### PHASE 5: Systèmes Secondaires (40 tickets, 3 semaines)
1. Avancement XP (15)
2. Magie (13)
3. Équipement (12)

### PHASE 6: Admin & Export (35 tickets, 2-3 semaines)
1. Administration (15)
2. Import/Export Foundry (14)
3. Recherche/Descriptions (6)

### PHASE 7: Règles & Utilitaires (60 tickets, 4 semaines)
1. Règles métier transverses (40)
2. Utilitaires (20)

### PHASE 8: Infrastructure & Polish (35 tickets, 2 semaines)
1. Infrastructure GAS (20)
2. Tables simples restantes (5)
3. Tests finaux (5)
4. Debug/optimisation (5)

---

## ESTIMATION FINALE

### Total Tickets: 280-350

### Durée Estimée:
- **1 développeur senior**: 7-10 mois
- **Équipe 3 dev**: 3-4 mois
- **Avec TDD strict**: +20-30%

### Risques Majeurs:
1. **Parsing compétences/talents** - Logique complexe, nombreux cas particuliers
2. **Règles métier WFRP** - Documentation incomplète, inférences du code
3. **Application effets talents** - Chaînes de dépendances complexes
4. **Export Foundry** - Compatibilité format
5. **Google Sheets → DB moderne** - Migration infrastructure

### Recommandations:
1. ✅ **Démarrer TDD dès Phase 1**
2. ✅ **Extraire règles métier progressivement**
3. ✅ **Tests E2E sur wizard complet**
4. ✅ **Documentation inline pendant migration**
5. ✅ **Revue code entre phases**

---

## CONCLUSION

**L'audit initial de 15 tickets représente ~5% du travail réel.**

Cette migration est un **projet majeur** équivalent à:
- Reconstruire une application complète
- Migrer 3.2 MB de données structurées
- Implémenter toutes les règles WFRP 4e édition
- Maintenir compatibilité Foundry VTT

**Prochaines étapes**:
1. Valider cette estimation
2. Créer structure tickets détaillée
3. Prioriser Phase 1
4. Démarrer avec TDD
5. Sprints 2 semaines

EOF
cat "C:\Users\gauch\PhpstormProjects\Warhammer\audit\INVENTAIRE_EXHAUSTIF.md" | wc -l
