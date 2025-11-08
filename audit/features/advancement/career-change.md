# Advancement - Changement Carrière

## Contexte

Les personnages peuvent changer de carrière au cours de leur vie pour refléter une évolution narrative. Ce changement a des impacts mécaniques importants.

## Conditions de Changement

### Recommandations WFRP

**Complétion carrière actuelle:** Atteindre niveau 4 (Gold) de la carrière actuelle avant changement
**Justification narrative:** Raison RP valide (événement, opportunité, quête)
**Validation MJ:** Accord du MJ requis

**Note:** Ces règles sont **optionnelles** et gérées par le MJ (pas d'implémentation V1).

### V1 Actuel

**Aucune restriction technique:** Le joueur peut changer de carrière à tout moment via le bouton "Carrière" en mode post-création.

## Mécanisme de Changement

### Processus

1. Clic sur bouton **[Carrière]** en mode advancement
2. Affichage interface sélection carrière (identique création)
3. Choix nouvelle carrière (toutes accessibles si compatibles espèce)
4. Confirmation changement
5. **Mise à jour carrière actuelle** (careerLevel passe à niveau 1 nouvelle carrière)

**Important:** Le changement est vers le **niveau 1** de la nouvelle carrière (pas niveau 4 de l'ancienne).

### Conservation des Acquis

**Ce qui est CONSERVÉ:**
- Toutes les caractéristiques améliorées (avances permanentes)
- Toutes les compétences acquises/améliorées
- Tous les talents acquis/rangs
- Tous les sorts appris
- XP dépensé total (character.xp.used)

**Ce qui CHANGE:**
- **Carrière actuelle** (career + careerLevel niveau 1)
- **Liste "dans carrière"** (nouvelles caractéristiques/compétences/talents)
- **Coûts futurs** (recalculés selon nouvelle carrière)
- **Status social** (selon nouvelle carrière niveau 1)

### Exemple Complet

**Avant changement:**
- Pamphlétaire niveau 4 (Gold)
- Soc 55 (+15 avances XP), Int 50 (+10), Ag 45 (+5)
- Charme +20, Ragot +15, Commandement +10
- Talents: Affable, Éloquent, Étiquette, etc.

**Après changement → Soldat niveau 1 (Bronze):**
- **Carrière:** Soldat niveau 1
- **Caractéristiques conservées:** Soc 55, Int 50, Ag 45 (inchangées)
- **Compétences conservées:** Charme +20, Ragot +15, etc. (inchangées)
- **Talents conservés:** Affable, Éloquent, etc. (inchangés)
- **Nouveaux coûts:** Soc devient **hors carrière** (×2), CC devient **dans carrière**

## Impact sur les Coûts

### Recalcul "Dans/Hors Carrière"

Lors du changement, la détermination "dans/hors carrière" **change instantanément**:

**Nouvelles caractéristiques "dans carrière":**
- Celles listées dans niveau 1 nouvelle carrière

**Nouvelles compétences "dans carrière":**
- Celles listées dans niveau 1 nouvelle carrière

**Nouvelles talents "dans carrière":**
- Ceux listés dans niveau 1 nouvelle carrière

**Exemple Pamphlétaire → Soldat:**
- Charme: **dans carrière** (Pamphlétaire) → **hors carrière** (Soldat, coût ×2)
- Corps à Corps: **hors carrière** (Pamphlétaire, coût ×2) → **dans carrière** (Soldat)

### Avances Futures

Les **avances futures** sont calculées selon la **nouvelle carrière**:

**Achat +1 Charme:**
- Avant (Pamphlétaire): 10 ou 15 XP (selon palier)
- Après (Soldat): 20 ou 30 XP (×2, selon palier)

**Achat +1 CC:**
- Avant (Pamphlétaire): 50 ou 60 XP (×2, selon palier)
- Après (Soldat): 25 ou 30 XP (normal, selon palier)

## Nouveaux Avantages

### Accès Nouveau Niveau 1

Le changement donne accès aux **avantages du niveau 1** de la nouvelle carrière:

**Nouvelles caractéristiques disponibles:** 3 nouvelles (coût normal)
**Nouvelles compétences disponibles:** 8-10 nouvelles (coût normal)
**Nouveaux talents disponibles:** 4 nouveaux (coût normal)

**Exemple Soldat niveau 1:**
- Caractéristiques: CC, Force, Endurance (coût normal désormais)
- Compétences: Corps à Corps (spé), Athlétisme, Calme, Esquive, Intimidation, etc.
- Talents: Combattant vicieux, Maîtrise (armes), Résistance, etc.

### Progression dans Nouvelle Carrière

Après le changement, le personnage peut **progresser normalement** dans la nouvelle carrière:
- Niveau 1 → 2 → 3 → 4
- Accumulation avantages nouveaux niveaux
- Complétion carrière avant nouveau changement (optionnel MJ)

## Coûts XP du Changement

### V1 Actuel

**Aucun coût XP pour le changement lui-même** (gratuit)

Seuls les achats **futurs** dans la nouvelle carrière coûtent XP (normal).

### Recommandation WFRP

Certains MJ imposent un **coût XP fixe** pour changer de carrière (ex: 100-200 XP) pour refléter le temps d'apprentissage.

**V2:** Option configurable MJ.

## Restrictions Espèce

### Compatibilité Carrière/Espèce

Certaines carrières sont **réservées à certaines espèces**:
- Tueur de Trolls → Nains uniquement
- Mage de Bataille → Hauts Elfes uniquement
- Halfling → Carrières Halflings uniquement

**Validation:** Le système filtre les carrières incompatibles (voir [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md)).

### Changement Impossible

Un Humain ne peut **PAS** devenir Tueur de Trolls (carrière Nain exclusive).

## Implications Narratives

### Justification RP

Le MJ peut exiger une justification narrative:
- **Pamphlétaire → Soldat:** Guerre, enrôlement forcé, désillusion politique
- **Soldat → Prêtre:** Révélation divine, traumatisme combat, quête rédemption
- **Érudit → Sorcier:** Découverte grimoire, mentor magique, talent inné révélé

### Temps d'Apprentissage

Le MJ peut imposer un **temps narratif** avant activation nouvelle carrière:
- Formation militaire: 6 mois
- Ordination religieuse: 1 an
- Apprentissage magique: 2-5 ans

**V1:** Pas d'implémentation (instantané).

## Validation

### Contraintes

1. **Espèce compatible** avec nouvelle carrière
2. **Niveau 1** de la nouvelle carrière (pas niveau 4)
3. **Validation MJ** (optionnelle)
4. **Complétion carrière actuelle** (optionnelle MJ)

### Messages

- "Carrière incompatible avec votre espèce (Humain)"
- "Complétion carrière actuelle requise (niveau 4 non atteint)"
- "Changement de carrière vers Soldat niveau 1 confirmé"

## Relations

### Fichiers Liés

- [career-levels.md](./career-levels.md) - Progression niveaux carrière
- [out-of-career.md](./out-of-career.md) - Recalcul coûts ×2
- [career-restrictions.md](./career-restrictions.md) - Restrictions par carrière

### Tables Database

- [careers.md](../../database/careers.md) - 117 carrières
- [careerLevels.md](../../database/careerLevels.md) - 4 niveaux par carrière

### Business Rules

- [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md) - Compatibilité espèce/carrière
- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Système progression
