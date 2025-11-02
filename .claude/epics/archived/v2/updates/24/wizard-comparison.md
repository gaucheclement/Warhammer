# Comparaison Wizard V1 vs V2

Date: 2025-10-25

## V1 - Ordre des étapes (Référence correcte)

**Fichier:** `CharacterGenerator.html` (lignes 8-20)

### Liste des 9 étapes V1:

1. **Species (Race)** - Choix de la race avec random/bonus XP
   - Random: +20 XP si accepté immédiatement
   - Logique de random avec imposedSpecie

2. **Careers (Carrière)** - Choix de la carrière
   - Random 1er choix: +50 XP
   - Random 2ème choix (3 options): +25 XP  
   - Choix manuel: 0 XP

3. **Characteristics (Attributs)** - Roll des caractéristiques
   - Random + acceptation: +50 XP
   - Random + réassignation: +25 XP
   - Choix manuel: 100 points à répartir (4-18 par carac)
   - Inclut: Fate, Resilience, Extra Points

4. **Talents** - Talents de carrière
   - Gestion des talents avec spécialisations
   - Logique "talent cascade" (addTalent)

5. **Skills (Compétences)** - Compétences de carrière
   - Compétences de race + carrière

6. **Trappings (Équipement)** - Équipement de départ
   - Équipement de carrière

7. **Details (Détails)** - Apparence et personnalité
   - Nom, âge, yeux, cheveux, taille
   - **APRÈS la race** (les couleurs dépendent de la race)
   - Random basé sur `specie.refDetail`

8. **Experience (Dépense PX)** - Dépenser les bonus XP gagnés
   - Dépenser les PX de bonus (random race/carrière/caractéristiques)
   - Restrictions: seulement les éléments de carrière actuelle

9. **Resume (Résumé)** - Validation et sauvegarde finale
   - Affichage complet du personnage
   - Bouton "Sauvegarder"

---

## V2 - Ordre actuel (16 étapes)

**Fichier:** `epic-v2/warhammer-v2/src/routes/Creator.svelte` (lignes 44-61)

1. Details - AVANT la race!
2. Species
3. Career
4. Characteristics
5. Skills
6. Talents
7. Spells - Pas d'étape dédiée en V1
8. Equipment
9. Fate - Inclus dans Characteristics en V1
10. Ambitions - Nouveau
11. Party - Nouveau
12. Experience
13. Notes - Nouveau
14. Psychology - Nouveau
15. Review
16. Complete - Page de fin

---

## Problèmes identifiés dans V2

### 1. CRITIQUE: Ordre incorrect

**Problème principal:** `Details` (step 1) AVANT `Species` (step 2)

- En V1: Details est l'étape 6 (APRÈS Species, Careers, Characteristics)
- En V2: Details est l'étape 1 (AVANT tout)
- **Impact:** L'utilisateur choisit la couleur des yeux/cheveux AVANT de choisir sa race
  - En V1, les couleurs disponibles dépendent de `specie.refDetail`

### 2. Trop d'étapes: 16 au lieu de 9

V2 a fragmenté le processus:
- **Fate (step 9)**: En V1, c'est intégré dans Characteristics
- **Spells (step 7)**: Pas d'étape dédiée en V1
- **Ambitions (step 10)**: Nouveau
- **Party (step 11)**: Nouveau
- **Notes (step 13)**: Nouveau
- **Psychology (step 14)**: Nouveau

### 3. Fonctionnalités V1 manquantes: Système Random/XP

**En V1, chaque étape majeure offre des bonus XP:**
- **Species:** +20 XP si random accepté
- **Careers:** +50 XP (1er choix) ou +25 XP (2ème choix)
- **Characteristics:** +50 XP (accepté) ou +25 XP (réassigné)

**Total possible:** 120 XP bonus max

**En V2:** Aucun système de random/bonus XP visible

### 4. Logique métier manquante

- **Talent Cascade:** Les talents peuvent ajouter d'autres talents (V1 Character.html lignes 149-167)
- **Validation spécifique:** Chaque Step a saveAction/validateAction/resetAction
- **Mode création vs progression:** Distinction claire en V1

---

## Fonctionnalités V1 à préserver

### HIGH Priority

1. **Système Random/XP Bonus**
   - Bouton "Lancer" avec rewards XP
   - randomState tracking
   - Total XP display

2. **Ordre correct des étapes**
   - Species → Careers → Characteristics → Talents → Skills → Equipment → Details

3. **Random Details basé sur Race**
   - Les tables de couleurs dépendent de specie.refDetail

4. **Characteristics avec Extra Points**
   - Fate, Resilience, Extra Points dans une seule étape

### MEDIUM Priority

5. **Talent Cascade Logic**
6. **Experience Step Restrictions**
7. **Mode "Libre" vs "Création"**

---

## Ordre recommandé (Option A: Strict V1 Port)

```
1. Species          - Avec random +20 XP
2. Career           - Avec random +50/+25 XP
3. Characteristics  - Avec random +50/+25 XP, inclut Fate/Resilience
4. Talents          - Talents de carrière avec cascade
5. Skills           - Compétences de carrière
6. Equipment        - Équipement de départ
7. Details          - Nom, âge, yeux, cheveux (APRÈS race!)
8. Experience       - Dépenser les bonus XP
9. Review           - Validation finale et sauvegarde
```

---

## Plan d'action recommandé

### Phase 1: Correctifs critiques (URGENT)

1. **Réordonner les étapes**
   - Déplacer Details APRÈS Species
   - Species devient step 1

2. **Fix Details step pour utiliser Species**
   - Ajouter prop species pour random basé sur refDetail
   - Désactiver champs d'apparence si species non choisi

### Phase 2: Système Random/XP (HIGH Priority)

3. **Ajouter randomState au character model**
4. **Ajouter bouton Random à chaque étape**
5. **Ajouter XP tracking**
6. **Implémenter Experience step**

### Phase 3: Optimisation (MEDIUM Priority)

7. **Fusionner les étapes fragmentées**
   - Fate → intégrer dans Characteristics
   - Notes/Psychology → supprimer du wizard
   - Party → supprimer

8. **Implémenter Talent Cascade**
9. **Validation spécifique par étape**

---

## Estimation d'effort

| Tâche | Effort | Impact |
|-------|--------|--------|
| Phase 1: Réordonner étapes | 2h | CRITICAL |
| Phase 2: Random/XP système | 8h | HIGH |
| Phase 3: Optimisation | 6h | MEDIUM |
| **TOTAL** | **16h** | |

---

## Conclusion

**Problèmes majeurs V2:**
1. Ordre incorrect (Details avant Species)
2. Trop fragmenté (16 étapes vs 9)
3. Système Random/XP manquant

**Recommandation:** Option A (Strict V1 Port) pour préserver la mécanique de jeu

**Priorité immédiate:**
1. Corriger l'ordre (Phase 1)
2. Implémenter Random/XP (Phase 2)
3. Tester avec un personnage complet
