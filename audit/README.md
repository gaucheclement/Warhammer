# Audit Warhammer V1 - Base de Connaissance pour Migration

**Date de création** : 2025-11-07
**Objectif** : Créer une base de connaissance (KB) métier exhaustive pour réussir la migration V1→V2

---

## Vue d'Ensemble

Ce répertoire contient l'audit complet de l'application Warhammer V1 (Google Apps Script) en préparation d'une migration vers une stack moderne.

### Pourquoi cet audit ?

Après **2 échecs de migration**, les causes identifiées :
- Claude perdait le contexte et oubliait ses propres créations
- Réinvention continue de composants déjà créés
- Surdev sur tâches simples ou tickets incomplets marqués DONE avec "Future Work"
- Manque de discipline et de référentiel métier

**Solution** : Créer une KB métier exhaustive AVANT de commencer la migration.

---

## Statut Actuel

### Phase 1 : Tables de Données (EN COURS)

✅ **85 tickets créés** documentant toutes les tables de données
⏳ **0 tickets exécutés** (KB à créer)

**Prochaine étape** : Exécuter ticket #001 (Species Schema & Relations)

---

## Structure du Répertoire

```
audit/
├── README.md                    # Ce fichier
├── APPROCHE_PROGRESSIVE.md      # ⭐ Méthodologie (LIRE EN PREMIER)
├── RESUME_EXECUTIF.md           # Contexte et plan stratégique
├── INVENTAIRE_EXHAUSTIF.md      # Analyse détaillée code V1
├── BREAKDOWN_TICKETS.md         # Répartition des tickets
├── EXEMPLES_COMPLEXITE.md       # Preuves concrètes complexité
├── GUIDE_LECTURE.md             # Parcours de lecture recommandés
│
├── tickets/
│   ├── _STATUS.md               # Dashboard avancement
│   ├── 001-species-schema-relations.md
│   ├── 002-species-generation-aleatoire.md
│   ├── ...                      # 85 tickets au total
│   └── 085-eyes-hairs-schema-validation.md
│
├── database/                    # KB tables (À CRÉER)
│   └── _index.md
│
├── features/                    # KB fonctionnalités (À CRÉER)
│   └── _index.md
│
└── business-rules/              # KB règles métier (À CRÉER)
    └── _index.md
```

---

## Documentation Principale

### 📖 Documents à Lire

1. **[APPROCHE_PROGRESSIVE.md](./APPROCHE_PROGRESSIVE.md)** ⭐ **LIRE EN PREMIER**
   - Méthodologie de création de tickets
   - Pourquoi 85 tickets et pas 335
   - Workflow recommandé
   - Principes de qualité

2. **[tickets/_STATUS.md](./tickets/_STATUS.md)**
   - Dashboard de progression
   - Répartition des 85 tickets
   - Prochaines étapes

3. **[RESUME_EXECUTIF.md](./RESUME_EXECUTIF.md)**
   - Contexte projet
   - Analyse code V1 (14,500 lignes)
   - Plan migration 8 phases
   - Risques et recommandations

4. **[INVENTAIRE_EXHAUSTIF.md](./INVENTAIRE_EXHAUSTIF.md)**
   - Détails complets code V1
   - 24 tables analysées
   - Domaines fonctionnels identifiés

---

## Les 85 Tickets

### Répartition par Complexité

**Tables TRÈS COMPLEXES** (48 tickets) - Phase 1 prioritaire
- Species (7 tickets) - #001-#007
- Careers (8 tickets) - #008-#015
- CareerLevels (8 tickets) - #016-#023
- Talents (9 tickets) - #024-#032
- Spells (5 tickets) - #033-#037
- Skills (5 tickets) - #038-#042
- Trappings (6 tickets) - #043-#048

**Tables MOYENNES** (32 tickets)
- Lores, Creatures, Trees, Gods, Traits, Stars, Magicks, Details, Qualities, Etats, Characteristics, Psychologies

**Tables SIMPLES** (5 tickets)
- Books, Classes, Eyes/Hairs

### Tickets Prioritaires (P0 - Phase 1)

**À exécuter en premier** (32 tickets) :
1. #001-#007 : Species
2. #008-#015 : Careers
3. #016-#023 : CareerLevels
4. #024-#032 : Talents

---

## Approche Progressive

### Pourquoi pas 335 tickets d'avance ?

**Tentative initiale** : Générer 335 tickets automatiquement.

**Résultat** :
- ✅ Tickets #001-#085 (tables) : Structure claire, tickets précis
- ❌ Tickets #086-#335 (features) : Génériques et inutiles ("Feature 12", "Logique 3")

**Leçon** : On ne peut pas créer des tickets de qualité sans analyser le code d'abord.

### Nouvelle approche

1. ✅ **Analyser** le code V1
2. ✅ **Comprendre** la logique métier
3. ✅ **Créer** tickets précis
4. ✅ **Exécuter** et créer KB
5. 🔁 **Répéter**

**Estimation finale** : 205-250 tickets (pas 335)

---

## Workflow d'Exécution

### Pour chaque ticket

1. **Prendre** : Marquer IN_PROGRESS dans tickets/_STATUS.md
2. **Lire** : Analyser uniquement les fichiers listés
3. **Extraire** : Logique métier (QUOI/POURQUOI, pas COMMENT)
4. **Créer** : Fichier KB selon template
5. **Vérifier** : Tous critères d'acceptance cochés
6. **Marquer DONE** : Seulement si 100% complet (pas de "Future Work")

### Règles absolues

- ❌ Pas de "Future Work" dans tickets DONE
- ❌ Pas de code technique dans KB
- ❌ Pas de fichier > 200 lignes
- ✅ Un ticket = un livrable précis
- ✅ Validation rigoureuse avant DONE

---

## Phases Suivantes

### Après Phase 1 (Tables)

Les tickets des domaines suivants seront créés **progressivement après analyse** :

1. **Wizard Création** (~40-60 tickets)
   - 10 steps à analyser
   - Règles métier complexes

2. **Modèle Character** (~10-15 tickets)
   - 925 lignes à analyser
   - Méthodes critiques

3. **Autres Systèmes** (~70-100 tickets)
   - Avancement XP
   - Magie
   - Équipement
   - Import/Export
   - Administration
   - Règles métier
   - Infrastructure

**Méthodologie** : Voir [APPROCHE_PROGRESSIVE.md](./APPROCHE_PROGRESSIVE.md)

---

## Utilisation Future (Migration V2)

Lors de la migration, chaque ticket dev référencera explicitement la KB :

```markdown
## Contexte métier
- Table DB : [audit/database/species.md]
- Règles : [audit/business-rules/random-generation.md]

## Critères d'acceptance
- Toutes règles KB implémentées
- Tous cas particuliers gérés
```

**Avantages** :
- Claude ne peut plus oublier (c'est dans la KB)
- Claude ne peut plus inventer (il suit la spec)
- Claude ne peut plus dupliquer (il cross-référence)
- Pas de Future Work (KB = scope complet)

---

## Chiffres Clés

### Code V1 Analysé
- **14,500 lignes** de code
- **24 tables JSON** (3.2 MB)
- **49 fichiers HTML**
- **1 fichier JS** (Code.js - 1,872 lignes)

### Tickets
- **85 tickets** créés (tables de données)
- **0 tickets** exécutés
- **~120-165 tickets** restants (à créer progressivement)
- **Total estimé** : 205-250 tickets

### Durée Estimée Phase 1
- **1 dev senior** : 2-3 semaines
- **3 dev** : 1 semaine

---

## Prochaines Étapes Immédiates

1. ✅ Structure audit/ créée
2. ✅ 85 tickets tables créés
3. ✅ Méthodologie documentée
4. → **Exécuter ticket #001** : Species Schema & Relations
5. Continuer Phase 1 (tickets #001-#032 prioritaires)

---

## Support et Questions

Pour toute question sur :
- **Méthodologie** → Lire [APPROCHE_PROGRESSIVE.md](./APPROCHE_PROGRESSIVE.md)
- **Progression** → Voir [tickets/_STATUS.md](./tickets/_STATUS.md)
- **Contexte projet** → Lire [RESUME_EXECUTIF.md](./RESUME_EXECUTIF.md)
- **Détails techniques V1** → Consulter [INVENTAIRE_EXHAUSTIF.md](./INVENTAIRE_EXHAUSTIF.md)

---

**Dernière mise à jour** : 2025-11-07
**Statut** : Phase 1 en cours (85 tickets TODO)
