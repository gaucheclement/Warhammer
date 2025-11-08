# Wizard Experience - Historique Dépenses

## Vue d'ensemble

L'historique des dépenses XP suit toutes les modifications temporaires effectuées pendant l'étape Progression. Permet annulation et suivi en temps réel.

**Référence:** `experience-budget.md`, `experience-characteristics.md`, `experience-skills.md`, `experience-talents.md`

## Structure historique

### Suivi temporaire

**tmpadvance:** Stocke les avances temporaires par élément (non persisté).

**Logique:**
- Chaque élément (characteristic/skill/talent) a un tmpadvance
- tmpadvance = différence entre valeur actuelle et valeur initiale
- Réinitialisé à 0 au démarrage de l'étape

**Exemple:**
- Intelligence initiale: 35 (5 avances carrière)
- Clic "+": tmpadvance = 1 → Intelligence 36
- Clic "+": tmpadvance = 2 → Intelligence 37
- Clic "-": tmpadvance = 1 → Intelligence 36

### Calcul XP dépensé

**Par élément:**
1. oldValue = getAdvance() - tmpadvance
2. newValue = getAdvance()
3. Coût = Helper.getXPCost(elem, oldValue, newValue)
4. Si hors carrière: Coût × 2

**Total:**
- Somme des coûts de tous éléments (characteristics + skills + talents)
- Stocké dans character.xp.tmp_used

## Affichage par catégorie

### Catégories affichées

**1. Caractéristiques:**
- Liste les 3 (création) ou 18 (post-création) caractéristiques
- Affiche Base | Aug | Coût | Total

**2. Talents:**
- Liste les 4 (création) ou tous (post-création) talents
- Affiche Rang | Coût

**3. Compétences:**
- Liste les 8 (création) ou toutes (post-création) compétences
- Affiche Base | Aug | Coût | Total

### Visibilité achats

**Colonne "Aug":** Affiche tmpadvance (avances temporaires achetées).

**Colonne "Coût":** Affiche coût prochain achat (jaune).

**Exemple Athlétisme:**
- Base: 25
- Aug: 5 (dont 2 tmpadvance)
- Coût: 15 (prochain = 6→7)
- Total: 30

## Annulation dernière dépense

### Mécanisme

**Bouton "-":** Réduit tmpadvance de 1.

**Effet:**
1. tmpadvance-- pour l'élément
2. Recalcul XP dépensé
3. Remboursement XP
4. Mise à jour affichage

**Exemple:**
- Intelligence tmpadvance = 3 (75 XP dépensés)
- Clic "-": tmpadvance = 2, remboursement 25 XP
- XP restant augmente de 25

### Annulation complète

**Bouton "Annuler":** Réinitialise tous tmpadvance à 0.

**Effet:**
1. Tous tmpadvance = 0
2. XP dépensé = 0
3. XP restant = XP max
4. Retour état initial

## Remboursement XP

### Calcul remboursement

**Logique:** Remboursement = coût dépensé pour l'avance retirée.

**Exemple Intelligence:**
- Valeur actuelle: 37 (2 tmpadvance)
- Clic "-": Retire 1 avance
- Remboursement: 25 XP (coût de l'avance 36→37)
- Nouvelle valeur: 36 (1 tmpadvance)

### Remboursement intégral

**Aucune perte:** Annuler une dépense rembourse 100% du XP.

**Justification:** Système temporaire, pas encore validé.

## Total par catégorie

### Calcul par type

**Caractéristiques:**
- Somme XP dépensé pour toutes caractéristiques modifiées

**Compétences:**
- Somme XP dépensé pour toutes compétences modifiées

**Talents:**
- Somme XP dépensé pour tous talents acquis/améliorés

### Affichage

**Limitation V1:** Pas d'affichage explicite "Total par catégorie".

**Disponible:** XP total dépensé (toutes catégories) affiché en en-tête.

## Exemples

### Exemple 1: Historique simple (50 XP)

**Actions:**
1. Intelligence +2 (50 XP) → XP restant: 0
2. Clic "-" → Intelligence +1 (25 XP), remboursement 25 XP → XP restant: 25
3. Calme +2 (20 XP) → XP restant: 5

**Historique final:**
- Intelligence tmpadvance: 1 (25 XP)
- Calme tmpadvance: 2 (20 XP)
- Total: 45 XP

### Exemple 2: Annulation complète

**Actions:**
1. Intelligence +2 (50 XP), Calme +3 (30 XP), Charme +2 (20 XP) → Total: 100 XP
2. Bouton "Annuler" → Tous tmpadvance = 0 → XP restant: 125 XP

## Règles métier

### Règle 1: Historique temporaire

Historique effacé à la validation ou annulation complète.

### Règle 2: Remboursement intégral

Pas de pénalité pour annuler une dépense.

### Règle 3: Ordre libre

Joueur peut annuler n'importe quelle avance (pas LIFO strict).

### Règle 4: Visibilité immédiate

Chaque modification met à jour l'affichage instantanément.

## Relations

### Dépendances

**Features:**
- `experience-budget.md` - Budget et XP restant
- `experience-characteristics.md` - Dépenses caractéristiques
- `experience-skills.md` - Dépenses compétences
- `experience-talents.md` - Dépenses talents

**Règles:**
- `calculs-xp-progression.md` - Formules coûts

## Références croisées

**Features:**
- `experience-budget.md`
- `experience-characteristics.md`
- `experience-skills.md`
- `experience-talents.md`
- `experience-validation.md`
- `experience-summary.md`

**Règles:**
- `calculs-xp-progression.md`
