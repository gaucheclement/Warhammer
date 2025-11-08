# Advancement - Récapitulatif XP

## Contexte

Le récapitulatif XP offre une vue d'ensemble des dépenses par catégorie pour aider les joueurs à optimiser leurs choix et suivre leur progression.

## Total par Catégorie

### Calcul Automatique

Le système calcule automatiquement le **XP dépensé par catégorie**:

**Caractéristiques:** Somme coûts toutes caractéristiques améliorées
**Compétences:** Somme coûts toutes compétences (acquisition + avances)
**Talents:** Somme coûts tous talents (tous rangs)
**Sorts:** Somme coûts tous sorts appris (si applicable)

**Total général:** Somme des 4 catégories

### Affichage

**Format:**
```
Caractéristiques: 150 XP (3 améliorées)
Compétences: 85 XP (5 acquises/améliorées)
Talents: 200 XP (2 acquis)
Sorts: 100 XP (3 appris)
────────────────────────
Total dépensé: 535 XP
XP restant: 65 XP
```

## Statistiques Dépenses

### Par Élément

**V1:** Pas de breakdown détaillé par élément individuel

**V2 recommandé:**
- Liste détaillée avec coût par élément
- Tri par coût (éléments les plus chers en premier)
- Filtrage par catégorie

**Exemple:**
```
Sociabilité +6: 155 XP
Affable (rang 1): 100 XP
Charme +5: 50 XP
Intelligence +3: 75 XP
Éloquent (rang 1): 100 XP
```

### Par Type

**Dans carrière vs Hors carrière:**
- XP dépensé dans carrière: XXX XP
- XP dépensé hors carrière (×2): XXX XP
- Ratio optimisation: X%

**Utilité:** Identifier dépenses sous-optimales (trop hors carrière)

## Graphiques (V2)

### Camembert Catégories

**Répartition XP par catégorie:**
- Caractéristiques: 28%
- Compétences: 16%
- Talents: 37%
- Sorts: 19%

**Visuel:** Graphique camembert (pie chart) ou barres

### Courbe Progression

**Évolution XP dans le temps:**
- Axe X: Sessions/Temps
- Axe Y: XP total
- Courbes: XP gagné, XP dépensé, XP disponible

**Visuel:** Graphique ligne temporelle

## Export Rapport

### Formats Export

**TXT/MD:** Rapport texte avec détails dépenses par catégorie
**CSV:** Tableau analyse (Type, Nom, Avances, Coût, Dans Carrière)
**PDF (V2):** Rapport formaté avec graphiques (archivage/partage MJ)

## Organisation Visuelle

### Panneaux

**V1:** Affichage inline dans step Experience (pas de panneau dédié)

**V2 recommandé:**
- Panneau gauche: Budget et contrôles
- Panneau central: Listes achat
- Panneau droit: **Récapitulatif temps réel**

**Avantage:** Vision permanente répartition XP pendant achats

### Onglet Récapitulatif

**Alternative:** Onglet dédié "Récapitulatif XP" (comme wizard Resume)

**Contenu:**
- Statistiques complètes
- Graphiques
- Export
- Historique gains XP (sources)

## Optimisation Joueur

### Comparaison Coûts

Le récapitulatif aide à **comparer les coûts** pour optimiser dépenses:

**Scénario:**
- Soc +1 (dans carrière): 25 XP
- End +1 (hors carrière): 50 XP
- Talent Dur à cuire (hors carrière): 200 XP

**Analyse:** Privilégier Soc +1 (meilleur ratio efficacité/coût)

### Optimisation et Historique

**Recommandations (V2):** Alertes dépenses hors carrière (40% ×2), suggestions progression niveau
**Sources XP:** Liste gains (espèce/carrière/étoile/aventures) avec totaux (voir [xp-budget.md](./xp-budget.md))

## Validation

### Cohérence

**Vérifications:**
1. Somme catégories = Total dépensé
2. Total dépensé = character.xp.tmp_used (ou xp.used)
3. XP restant = xp.max - total dépensé
4. Aucun élément négatif

### Messages Incohérence

**V2:** Alerte si incohérence détectée
- "Incohérence détectée: Somme catégories ≠ Total (recalcul en cours)"

## Relations

### Fichiers Liés

- [xp-budget.md](./xp-budget.md) - Budget XP disponible
- [xp-log.md](./xp-log.md) - Historique dépenses
- [experience-summary.md](../wizard/experience-summary.md) - Résumé wizard création
