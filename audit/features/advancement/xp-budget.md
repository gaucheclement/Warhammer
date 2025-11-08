# Advancement - Budget XP Disponible

## Contexte

Le système suit le budget XP disponible pour permettre aux joueurs de dépenser leurs points d'expérience de manière contrôlée.

## Structure du Budget XP

### Champs Character.xp

**character.xp.max:** XP total gagné (sources multiples)
**character.xp.used:** XP déjà dépensé (consolidé)
**character.xp.tmp_used:** XP dépensé temporairement (session actuelle, annulable)

**XP disponible = xp.max - xp.used - xp.tmp_used**

### Sources XP (xp.max)

**En création:**
- Espèce aléatoire: +50 XP (premier tirage), +25 XP (second tirage)
- Carrière aléatoire: +50 XP (premier tirage), +25 XP (second tirage)
- Étoile aléatoire: +25 XP
- **Total typique:** 0-200 XP

**En post-création:**
- Récompenses MJ (aventures, roleplay, défaites ennemis)
- Milestones narratifs
- Progression sessions
- **Total variable:** 0-10000+ XP (campagnes longues)

## Affichage Budget

### Affichage Temps Réel

Le budget XP est affiché en **temps réel** pendant la phase Experience:

**Format:** `[150] Points d'Expérience à dépenser`

Le nombre est mis à jour **après chaque modification**:
- Clic [+]: XP diminue
- Clic [-]: XP augmente
- Changement valeur: Recalcul complet

### Couleurs (V2 recommandé)

**Vert:** XP disponible > 0
**Orange:** XP disponible = 0
**Rouge:** XP disponible < 0 (mode création: bloqué, post-création: autorisé)

## Gestion du Budget

### Mode Création (Wizard)

**Blocage strict:**
- Le bouton [+] est **désactivé** si l'achat ferait dépasser le budget
- Le bouton [Valider] est **désactivé** si XP disponible < 0
- **Impossible de valider** avec budget négatif

**Logique:**
```
disabled = (xp.max - xp.tmp_used - coût_prochain_achat) < 0
```

**Exemple:**
- XP max: 100
- XP dépensé: 85
- Prochain achat: 25 XP
- Bouton [+] → **désactivé** (85 + 25 = 110 > 100)

### Mode Post-Création

**Souplesse:**
- Le bouton [+] est toujours **activé** (pas de blocage)
- Le budget peut devenir **négatif** (dette XP temporaire)
- Le MJ peut autoriser "dépenses futures"

**Note:** Le MJ gère manuellement les dépassements (V2: option "dette XP autorisée").

## Calcul XP Dépensé

### Algorithme

Le XP dépensé (tmp_used) est recalculé dynamiquement:

**Pour chaque catégorie:**
1. Caractéristiques: Somme coûts paliers × multiplicateur carrière
2. Compétences: Somme coûts (acquisition + avances) × multiplicateur carrière
3. Talents: Somme coûts rangs × multiplicateur carrière

**Multiplicateur carrière:**
- Élément dans carrière: × 1
- Élément hors carrière: × 2

**Exemple:**
- Soc +3 (dans): 25+25+25 = 75 XP
- End +2 (hors): (25+25) × 2 = 100 XP
- Charme +5 (dans): 10+10+10+10+10 = 50 XP
- Affable (dans): 100 XP
- **Total:** 325 XP

## Ajout XP (Post-Création)

### Méthode character.addXP()

**Signature:** `character.addXP(source, amount, permanent)`

**Paramètres:**
- **source:** Raison de l'attribution ("Aventure terminée", "Roleplay exceptionnel")
- **amount:** Montant XP (positif)
- **permanent:** true (ajouté à xp.max), false (temporaire)

**Exemple:**
```
character.addXP("Aventure: Temple maudit", 250, true)
→ xp.max += 250
```

### Historique Gains XP

Le système peut stocker un **log des gains** pour traçabilité:
- Date gain
- Source gain
- Montant gain
- XP max après gain

**Affichage:** Onglet "Expérience" du character sheet (voir [resume-display.md](../wizard/resume-display.md)).

## Validation Budget

### Contraintes Mode Création

1. **XP disponible ≥ 0** avant validation step
2. **Budget initial cohérent** (sources XP correctes)
3. **Pas de dépassement** autorisé

### Contraintes Mode Post-Création

1. **XP disponible** peut être négatif (dette temporaire)
2. **MJ valide** les dépassements (option)
3. **Traçabilité** gains/dépenses

### Messages d'Erreur

- "Budget XP insuffisant (25 XP nécessaires, 10 XP disponibles)"
- "Validation bloquée: XP disponible négatif (-15 XP)"
- "Dette XP: -50 XP (à rembourser avec prochains gains)"

## Exemples Concrets

### Exemple 1: Création Humain Agitateur

**Budget initial:**
- Espèce (Humain): 0 XP (choix direct)
- Carrière (Agitateur): +50 XP (premier tirage)
- Étoile: +25 XP
- **Total: 75 XP**

**Dépenses:**
- Soc +3: 75 XP
- **Restant: 0 XP** (budget épuisé)

### Exemple 2: Post-Création Aventure Complète

**Budget avant aventure:** 50 XP disponible (375 max - 325 used)

**Gains:**
- Aventure terminée: +200 XP
- Roleplay: +50 XP
- **Nouveau budget:** 300 XP disponible (625 max - 325 used)

**Dépenses:**
- Passage carrière niveau 2: Complétion + nouveaux avantages
- **Coût estimé:** ~250 XP

## Relations

### Fichiers Liés

- [xp-log.md](./xp-log.md) - Historique dépenses
- [validation.md](./validation.md) - Validation achats
- [experience-budget.md](../wizard/experience-budget.md) - Budget en wizard création

### Tables Database

Aucune (logique pure)
