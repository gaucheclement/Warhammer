# Advancement - Historique Dépenses XP

## Contexte

Le système enregistre toutes les dépenses XP pour permettre l'annulation et le suivi. Cet historique est essentiel pour la transparence et la correction d'erreurs.

## Structure de l'Historique

### Champ tmpadvance

Chaque élément améliorable (caractéristique, compétence, talent) possède un champ **tmpadvance** qui stocke les **avances temporaires** achetées avec XP.

**Exemple:**
- Charme avances espèce: +0
- Charme avances carrière: +5
- Charme **tmpadvance**: +3 (acheté avec XP)
- **Total:** 0 + 5 + 3 = 8

### Séparation Avances

**Avances permanentes:**
- Avances espèce (immutables)
- Avances carrière (immutables après acquisition niveau)
- Avances talents (modificateurs +5, +Bonus)

**Avances temporaires (tmpadvance):**
- Avances achetées avec XP
- Annulables (bouton -)
- Recalculées dynamiquement

## Affichage de l'Historique

### Par Catégorie

L'historique est affiché par **catégories**:
- **Caractéristiques:** Liste des caractéristiques améliorées avec avances XP
- **Compétences:** Liste des compétences avec avances/acquisition XP
- **Talents:** Liste des talents acquis/rangs achetés avec XP

### Informations Affichées

Pour chaque élément:
- **Nom:** Caractéristique/Compétence/Talent
- **Valeur base:** Valeur avant achat XP
- **Avances:** Nombre d'avances achetées (+N)
- **Coût:** XP dépensé pour cet élément
- **Valeur totale:** Valeur après avances XP

**Exemple Charme:**
- Base: 35 (Soc)
- Avances: +3
- Coût: 40 XP (10 + 10 + 10 + 10)
- Total: 38

## Annulation Dépenses

### Annulation Dernière Dépense (Bouton -)

Chaque ligne d'historique possède un **bouton [-]** permettant de:
1. Réduire tmpadvance de 1 (-1)
2. Recalculer le coût XP (remboursement)
3. Mettre à jour l'affichage
4. Recalculer XP disponible

**Logique:**
- Annulation par **ordre inverse** (LIFO - Last In First Out)
- Première annulation = dernière avance achetée
- Remboursement **intégral** (100%, pas de pénalité)

**Exemple:**
- Charme +3 (coût: 10+10+10 = 30 XP)
- Clic [-] → Charme +2 (remboursement: 10 XP)
- Clic [-] → Charme +1 (remboursement: 10 XP)
- Clic [-] → Charme +0 (remboursement: 10 XP, retour état initial)

### Annulation Complète (Bouton Annuler)

Un bouton global **[Annuler]** permet de:
1. Réinitialiser **tous les tmpadvance** à 0
2. Rembourser **tout le XP dépensé**
3. Retourner à l'état initial du personnage

**Confirmation:** Une popup de confirmation est recommandée (V2).

## Calcul XP Dépensé

### Algorithme refreshXP

La fonction **refreshXP** recalcule dynamiquement le XP total dépensé:

**Logique:**
1. Pour chaque catégorie (characteristic, skill, talent):
   - Pour chaque élément:
     - Calculer oldValue = avance actuelle - tmpadvance
     - Calculer newValue = avance actuelle
     - Appeler Helper.getXPCost(elem, oldValue, newValue)
     - Multiplier par 2 si élément hors carrière (type "otherXXX")
     - Ajouter au total

2. Mettre à jour affichage XP disponible:
   - XP disponible = XP max - XP dépensé

**Temps réel:** Le calcul est exécuté après **chaque modification** (clic +, clic -, changement).

## Remboursement XP

### Règle 100%

Le remboursement XP est **intégral** (100%, pas de pénalité):
- Annuler une avance à 25 XP → +25 XP disponibles
- Annuler un talent à 100 XP → +100 XP disponibles

**Justification:** Mode création = phase de test, pas de pénalité.

### Différence Création vs Post-Création

**Création (Wizard):**
- Remboursement intégral
- Annulation libre
- Pas de validation MJ

**Post-Création (V2 recommandé):**
- Remboursement intégral OU avec pénalité (option MJ)
- Annulation possible OU blocage après validation session (option MJ)
- Validation MJ possible

## Persistance

### Sauvegarde Temporaire

Les tmpadvance sont sauvegardés dans l'objet character **en mémoire** pendant la session wizard.

**Annulation générale:** Retour à l'état sauvegardé précédent (character original sans tmpadvance).

### Sauvegarde Définitive

Lors de la **validation** finale du step Experience:
1. Les tmpadvance sont **consolidés** dans les avances permanentes
2. Le XP dépensé est ajouté à character.xp.used
3. Le XP disponible est mis à jour
4. Les tmpadvance sont **réinitialisés** à 0

**Post-consolidation:** Les avances deviennent **permanentes** et ne peuvent plus être annulées (sauf en mode post-création avec règles MJ).

## Validation

### Contraintes

1. **Cohérence:** XP dépensé = somme des coûts individuels
2. **Budget:** XP dépensé ≤ XP max (création) ou pas de limite (post-création)
3. **tmpadvance ≥ 0:** Pas d'annulation au-delà de 0
4. **Recalcul temps réel:** Affichage toujours synchronisé

### Messages d'Erreur

- "Impossible d'annuler: Aucune avance achetée"
- "Confirmer annulation complète? (remboursement de 150 XP)"

## Relations

### Fichiers Liés

- [xp-budget.md](./xp-budget.md) - Budget XP disponible
- [validation.md](./validation.md) - Validation achats
- [experience-history.md](../wizard/experience-history.md) - Historique en wizard création

### Tables Database

- [characteristics.md](../../database/characteristics.md)
- [skills.md](../../database/skills.md)
- [talents.md](../../database/talents.md)
